// ============================================================
// MES PROFS — Grille des professeurs IA
// ------------------------------------------------------------
// Vue « profs » : une carte par agent défini dans agents-config.js.
// Ce fichier ne contient AUCUNE donnée : tout vient de la config.
// Ajouter une matière = ajouter un objet dans agents-config.js.
// ============================================================

// ---- RENDU PRINCIPAL ----
function renderProfs() {
    const view = document.getElementById("view-profs");
    if (!view) return;

    profAgent = null; // on revient à la liste : plus de conversation ouverte
    document.body.classList.remove("prof-chat-open");

    // Matières où une conversation est déjà commencée → bouton « Reprendre ».
    const enCours = ProfStore.listActive();

    view.innerHTML = `
        ${buildProfsHero()}
        <div class="prof-grid" id="prof-grid">
            ${AGENTS.map(a => buildProfCard(a, enCours[a.id])).join("")}
        </div>
        ${buildProfsFooterNote()}
    `;

    bindProfsActions();
    initScrollReveal();
}

// ---- HERO ----
// Réutilise les classes .mat-hero du design system (page Matières).
// Les compteurs sont calculés depuis la config : ajouter un prof les met à jour.
function buildProfsHero() {
    const nbProfs    = AGENTS.length;
    const nbMatieres = new Set(AGENTS.flatMap(a => a.subjectKeys)).size;

    return `
    <div class="mat-hero">
        <div class="mat-hero-bg"></div>
        <div class="mat-hero-content">
            <span class="mat-hero-badge">🧑‍🏫 Ton équipe pédagogique</span>
            <h1>Tes <span class="mat-gradient-text">${nbProfs} profs IA</span>, disponibles à toute heure.</h1>
            <p>Chacun sa matière, chacun sa méthode. Ils ne te donnent jamais la réponse :
               ils te posent la bonne question pour que tu la trouves.</p>
            <div class="mat-hero-stats">
                <div class="mat-hs"><strong>${nbProfs}</strong><span>Professeurs</span></div>
                <div class="mat-hs"><strong>${nbMatieres}</strong><span>Matières</span></div>
                <div class="mat-hs"><strong>3</strong><span>Niveaux</span></div>
                <div class="mat-hs"><strong>24/7</strong><span>Disponibles</span></div>
            </div>
        </div>
    </div>`;
}

// ---- CARTE D'UN PROF ----
/**
 * @param {Object} agent      un objet du tableau AGENTS
 * @param {number} [nbMsgs]   nombre de messages déjà échangés, s'il y en a
 */
function buildProfCard(agent, nbMsgs) {
    const puces = agent.bullets
        .map(b => `<li>${escapeProf(b)}</li>`)
        .join("");

    const reprise = nbMsgs > 0;
    const libelle = reprise
        ? `Reprendre avec ${escapeProf(agent.name)} →`
        : `Discuter avec ${escapeProf(agent.name)} →`;

    return `
    <article class="prof-card reveal"
             style="--accent:${agent.accent}; --accent-deep:${agent.accentDeep}; --accent-soft:${agent.accentSoft}"
             data-agent="${agent.id}">

        <div class="prof-card-top">
            <span class="prof-avatar" aria-hidden="true">
                ${agent.avatar}
                <span class="prof-avatar-icon">${agent.icon}</span>
            </span>
            <div class="prof-identity">
                <span class="prof-subject">${escapeProf(agent.subject)}</span>
                <h3 class="prof-name">${escapeProf(agent.name)}</h3>
                <p class="prof-tone">${escapeProf(agent.tone)}</p>
            </div>
        </div>

        <p class="prof-tagline">« ${escapeProf(agent.tagline)} »</p>

        <ul class="prof-points">${puces}</ul>

        <div class="prof-meta">
            <span class="prof-chip">🎓 ${escapeProf(agent.levels)}</span>
            ${reprise ? `<span class="prof-chip prof-chip-reprise">💬 ${nbMsgs} message${nbMsgs > 1 ? "s" : ""}</span>` : ""}
        </div>

        <button type="button" class="prof-cta" data-agent="${agent.id}"
                aria-label="${reprise ? "Reprendre la conversation avec" : "Discuter avec"} ${escapeProf(agent.name)}, professeur de ${escapeProf(agent.subject)}">
            ${libelle}
        </button>
    </article>`;
}

// ---- NOTE DE BAS DE PAGE ----
function buildProfsFooterNote() {
    return `
    <p class="prof-footnote">
        🔒 Tes conversations restent privées. Les profs IA peuvent se tromper :
        vérifie toujours une information importante dans ton cours.
    </p>`;
}

// ---- INTERACTIONS ----
function bindProfsActions() {
    document.querySelectorAll("#view-profs .prof-cta").forEach(btn => {
        btn.addEventListener("click", () => openProfChat(btn.dataset.agent));
    });
}

// ============================================================
// CONVERSATION AVEC UN PROF
// ============================================================

let profAgent    = null;   // agent dont la conversation est ouverte
let profMessages = [];     // [{role:'user'|'assistant', content}]
let profBusy     = false;  // une réponse est en cours de génération

/** Ouvre la conversation avec un prof (depuis une carte ou depuis l'URL). */
function openProfChat(agentId) {
    const agent = AgentsConfig.getAgent(agentId);
    if (!agent) return;

    // On recharge la conversation sauvegardée pour cette matière.
    if (!profAgent || profAgent.id !== agent.id) {
        profMessages = ProfStore.load(agent.id, messagesDistants => {
            // Une version plus récente est arrivée d'un autre appareil.
            if (profAgent && profAgent.id === agent.id && !profBusy) {
                profMessages = messagesDistants;
                renderProfMessages();
                showToast("Conversation récupérée depuis un autre appareil.", "info");
            }
        });
    }
    profAgent = agent;

    renderProfChat();
    if (!_suppressHashPush) history.pushState(null, "", "#profs/" + agent.id);
}

/** Revient à la grille des profs. */
function closeProfChat() {
    AiCore.abort();
    profAgent = null;
    profBusy = false;
    renderProfs();
    if (!_suppressHashPush) history.pushState(null, "", "#profs");
}

// ---- RENDU DE LA CONVERSATION ----
function renderProfChat() {
    const view = document.getElementById("view-profs");
    if (!view || !profAgent) return;
    const a = profAgent;

    // Masque le widget 🤖 : il recouvrirait le bouton d'envoi sur mobile.
    document.body.classList.add("prof-chat-open");

    view.innerHTML = `
    <div class="chat-wrap" style="--accent:${a.accent}; --accent-deep:${a.accentDeep}; --accent-soft:${a.accentSoft}">

        <header class="chat-header">
            <button type="button" class="chat-back" id="chat-back" aria-label="Revenir à la liste des profs">←</button>
            <span class="chat-avatar" aria-hidden="true">${a.avatar}</span>
            <div class="chat-id">
                <strong>${escapeProf(a.name)}</strong>
                <small>${escapeProf(a.subject)} · ${escapeProf(a.levels)}</small>
            </div>
            <button type="button" class="chat-clear" id="chat-clear"
                    aria-label="Effacer la conversation" title="Effacer la conversation">🗑️</button>
        </header>

        <div class="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-atomic="false"></div>

        <div class="chat-composer">
            <label class="sr-only" for="chat-input">Écris ton message à ${escapeProf(a.name)}</label>
            <textarea id="chat-input" rows="1" maxlength="4000"
                      placeholder="Pose ta question à ${escapeProf(a.name)}…"></textarea>
            <button type="button" class="chat-send" id="chat-send" aria-label="Envoyer">↑</button>
        </div>
    </div>`;

    renderProfMessages();
    bindProfChat();
    document.getElementById("chat-input")?.focus();
}

/** Redessine la liste des messages (utilisé hors streaming). */
function renderProfMessages() {
    const box = document.getElementById("chat-messages");
    if (!box || !profAgent) return;
    const a = profAgent;

    // Premier message : présentation du prof + suggestions cliquables.
    if (profMessages.length === 0) {
        box.innerHTML = `
        <div class="chat-intro">
            <span class="chat-intro-avatar" aria-hidden="true">${a.avatar}</span>
            <h3>${escapeProf(a.name)}, ${escapeProf(a.subject.toLowerCase())}</h3>
            <p class="chat-intro-tagline">« ${escapeProf(a.tagline)} »</p>
            <p class="chat-intro-help">Par quoi on commence ?</p>
            <div class="chat-starters">
                ${a.starters.map((s, i) => `
                    <button type="button" class="chat-starter" data-starter="${i}">
                        ${escapeProf(s.label)}
                    </button>`).join("")}
            </div>
        </div>`;
        box.querySelectorAll(".chat-starter").forEach(btn => {
            btn.addEventListener("click", () => sendProfMessage(a.starters[btn.dataset.starter].prompt));
        });
        return;
    }

    box.innerHTML = profMessages.map(m => buildProfBubble(m)).join("");
    renderProfMath(box);
    scrollProfChat();
}

/** Une bulle de message. */
function buildProfBubble(m) {
    if (m.role === "user") {
        return `<div class="chat-msg chat-msg-user"><div class="chat-bubble">${escapeProf(m.content)}</div></div>`;
    }
    const classe = m.error ? "chat-bubble chat-bubble-error" : "chat-bubble";
    return `
    <div class="chat-msg chat-msg-bot">
        <span class="chat-msg-avatar" aria-hidden="true">${profAgent.avatar}</span>
        <div class="${classe}">${formatProfText(m.content)}</div>
    </div>`;
}

// ---- ENVOI D'UN MESSAGE ----
function sendProfMessage(texte) {
    const contenu = String(texte || "").trim();
    if (!contenu || profBusy || !profAgent) return;

    profMessages.push({ role: "user", content: contenu });
    profBusy = true;

    const input = document.getElementById("chat-input");
    if (input) { input.value = ""; autoGrowProfInput(input); }

    renderProfMessages();
    const box = document.getElementById("chat-messages");

    // Bulle de réponse + indicateur de réflexion, remplacé dès le premier caractère.
    box.insertAdjacentHTML("beforeend", `
        <div class="chat-msg chat-msg-bot" id="chat-pending">
            <span class="chat-msg-avatar" aria-hidden="true">${profAgent.avatar}</span>
            <div class="chat-bubble">
                <span class="chat-typing" aria-label="${escapeProf(profAgent.name)} réfléchit">
                    <span></span><span></span><span></span>
                </span>
            </div>
        </div>`);
    scrollProfChat();
    majEtatEnvoi();

    const pending = document.getElementById("chat-pending");
    const bulle   = pending.querySelector(".chat-bubble");
    let recu = "";

    AiCore.stream({
        agentId: profAgent.id,
        mode: "chat",
        messages: profMessages.map(m => ({ role: m.role, content: m.content })),
        context: getProfAppContext(),

        onToken(morceau) {
            recu += morceau;
            bulle.textContent = recu;   // texte brut pendant le flux : rapide et sans risque
            scrollProfChat();
        },

        onDone({ text, switchTo, degraded }) {
            profBusy = false;
            profMessages.push({ role: "assistant", content: text });
            renderProfMessages();
            majEtatEnvoi();
            ProfStore.save(profAgent.id, profMessages);
            if (degraded) {
                showToast("Réponse fournie par le professeur de secours (service principal indisponible).", "info");
            }
            // switchTo : redirection vers un collègue — branché à l'étape 6.
        },

        onError({ message, partial }) {
            profBusy = false;
            if (partial && recu) profMessages.push({ role: "assistant", content: recu });
            profMessages.push({ role: "assistant", content: message, error: true });
            renderProfMessages();
            majEtatEnvoi();
            // Les bulles d'erreur ne sont pas sauvegardées (filtrées par ProfStore).
            ProfStore.save(profAgent.id, profMessages);
        }
    });
}

/** Active/désactive le bouton d'envoi selon l'état. */
function majEtatEnvoi() {
    const btn = document.getElementById("chat-send");
    if (!btn) return;
    btn.disabled = profBusy;
    btn.textContent = profBusy ? "…" : "↑";
}

/** Contexte de l'app (leçon ouverte) transmis au prof, s'il y en a un. */
function getProfAppContext() {
    if (typeof currentLesson !== "undefined" && currentLesson) {
        return `L'élève vient de consulter la leçon « ${currentLesson.title} ».`;
    }
    return "";
}

// ---- INTERACTIONS DE LA CONVERSATION ----
function bindProfChat() {
    document.getElementById("chat-back")?.addEventListener("click", closeProfChat);

    document.getElementById("chat-clear")?.addEventListener("click", () => {
        if (profMessages.length && !confirm("Effacer toute la conversation avec " + profAgent.name + " ?")) return;
        AiCore.abort();
        profBusy = false;
        profMessages = [];
        ProfStore.clear(profAgent.id);
        renderProfMessages();
        majEtatEnvoi();
        showToast("Conversation effacée.", "info");
    });

    document.getElementById("chat-send")?.addEventListener("click", () => {
        sendProfMessage(document.getElementById("chat-input")?.value);
    });

    const input = document.getElementById("chat-input");
    input?.addEventListener("keydown", e => {
        // Entrée envoie, Maj+Entrée passe à la ligne.
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendProfMessage(e.target.value);
        }
    });
    input?.addEventListener("input", () => autoGrowProfInput(input));
}

/** La zone de saisie grandit avec le texte, jusqu'à 6 lignes. */
function autoGrowProfInput(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
}

function scrollProfChat() {
    const box = document.getElementById("chat-messages");
    if (box) box.scrollTop = box.scrollHeight;
}

// ---- MISE EN FORME DES RÉPONSES ----
/**
 * Convertit le texte du prof en HTML sûr : gras, italique, code, listes.
 * Tout est échappé AVANT d'ajouter la moindre balise.
 */
function formatProfText(texte) {
    let t = escapeProf(texte);
    t = t.replace(/```([\s\S]*?)```/g, (_m, code) => `<pre class="chat-code">${code.trim()}</pre>`);
    t = t.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    t = t.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    t = t.replace(/\n/g, '<br>');
    return t;
}

/**
 * Rend les formules LaTeX si KaTeX est disponible.
 * Sans KaTeX (hors ligne, CDN bloqué), le texte reste lisible tel quel.
 */
function renderProfMath(racine) {
    if (typeof renderMathInElement !== "function") return;
    try {
        renderMathInElement(racine, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$",  right: "$",  display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ],
            throwOnError: false
        });
    } catch (_) { /* une formule mal formée ne doit jamais casser la page */ }
}

// ---- UTILITAIRE ----
function escapeProf(str) {
    return String(str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
