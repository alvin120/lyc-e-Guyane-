// ============================================================
// PROFS-STORE — Sauvegarde des conversations avec les profs IA
// ------------------------------------------------------------
// Une conversation par élève ET par matière, rechargeable.
//
// Deux niveaux, volontairement :
//   1. localStorage — toujours actif, instantané, fonctionne hors
//      connexion et sans compte. C'est la source de vérité immédiate.
//   2. Supabase — synchronisation entre appareils, uniquement si
//      l'élève est connecté ET que la base répond.
//
// Si Supabase est injoignable (base en pause, coupure réseau),
// l'élève ne perd rien : tout continue en local.
// ============================================================

const ProfStore = (() => {

    const PREFIXE     = 'eduguyane.profs';
    const MAX_MESSAGES = 40;    // au-delà, on ne garde que les plus récents
    const DELAI_SYNC   = 1200;  // ms d'attente avant d'écrire sur Supabase

    let _minuteurs = {};        // un minuteur de synchronisation par matière

    // ── Identité de l'élève ────────────────────────────────
    function idEleve() {
        const u = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        return u ? u.id : 'invite';
    }

    function cle(agentId) {
        return `${PREFIXE}.${idEleve()}.${agentId}`;
    }

    // ── Accès sûr au localStorage ──────────────────────────
    // Peut échouer : navigation privée, quota plein, stockage bloqué.
    function lireLocal(agentId) {
        try {
            const brut = localStorage.getItem(cle(agentId));
            if (!brut) return null;
            const data = JSON.parse(brut);
            return Array.isArray(data.messages) ? data : null;
        } catch (_) {
            return null;
        }
    }

    function ecrireLocal(agentId, messages) {
        try {
            localStorage.setItem(cle(agentId), JSON.stringify({
                messages,
                updatedAt: new Date().toISOString()
            }));
            return true;
        } catch (_) {
            return false; // quota dépassé ou stockage indisponible : on continue sans
        }
    }

    function effacerLocal(agentId) {
        try { localStorage.removeItem(cle(agentId)); } catch (_) { /* rien à faire */ }
    }

    // ── Nettoyage des messages avant stockage ──────────────
    // On ne garde que l'essentiel, et jamais les bulles d'erreur.
    function preparer(messages) {
        return messages
            .filter(m => !m.error && m.content && m.content.trim())
            .slice(-MAX_MESSAGES)
            .map(m => ({ role: m.role, content: m.content }));
    }

    // ============================================================
    // API PUBLIQUE
    // ============================================================

    /**
     * Charge la conversation d'une matière.
     * Renvoie tout de suite le contenu local, puis appelle `onSync`
     * si Supabase possède une version plus récente (autre appareil).
     *
     * @param {string}   agentId
     * @param {Function} [onSync]  (messages) => void
     * @returns {Array} messages disponibles immédiatement
     */
    function load(agentId, onSync) {
        const local = lireLocal(agentId);
        const messages = local ? local.messages : [];

        // Synchronisation distante, en arrière-plan et sans bloquer l'affichage.
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (user && typeof getAiConversation === 'function') {
            getAiConversation(user.id, agentId)
                .then(distant => {
                    if (!distant || !Array.isArray(distant.messages)) return;
                    const plusRecent = !local || new Date(distant.updatedAt) > new Date(local.updatedAt);
                    if (plusRecent && distant.messages.length) {
                        ecrireLocal(agentId, distant.messages);
                        if (typeof onSync === 'function') onSync(distant.messages);
                    }
                })
                .catch(() => { /* base injoignable : le local suffit */ });
        }

        return messages;
    }

    /** Enregistre la conversation (local immédiat, Supabase différé). */
    function save(agentId, messages) {
        const propres = preparer(messages);
        if (!propres.length) return clear(agentId);

        ecrireLocal(agentId, propres);

        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (!user || typeof saveAiConversation !== 'function') return;

        // On regroupe les écritures : inutile d'écrire à chaque caractère.
        clearTimeout(_minuteurs[agentId]);
        _minuteurs[agentId] = setTimeout(() => {
            saveAiConversation(user.id, agentId, propres).catch(() => { /* silencieux */ });
        }, DELAI_SYNC);
    }

    /** Supprime la conversation d'une matière, localement et à distance. */
    function clear(agentId) {
        clearTimeout(_minuteurs[agentId]);
        effacerLocal(agentId);

        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (user && typeof deleteAiConversation === 'function') {
            deleteAiConversation(user.id, agentId).catch(() => { /* silencieux */ });
        }
    }

    /**
     * Matières où une conversation est en cours, pour afficher
     * « Reprendre » plutôt que « Discuter » sur les cartes.
     * @returns {Object} { agentId: nombre de messages }
     */
    function listActive() {
        const actives = {};
        if (typeof AGENTS === 'undefined') return actives;
        AGENTS.forEach(a => {
            const c = lireLocal(a.id);
            if (c && c.messages.length) actives[a.id] = c.messages.length;
        });
        return actives;
    }

    return { load, save, clear, listActive };
})();
