// ============================================================
// AI-CORE — Couche d'appel IA unique des professeurs IA
// ------------------------------------------------------------
// AUCUN composant ne doit appeler fetch() vers une IA directement :
// tout passe par AiCore.stream(). C'est ici, et seulement ici, que
// vivent le streaming, les délais d'attente, les replis et la
// traduction des erreurs en messages compréhensibles par un élève.
//
// Chaîne de repli : /api/tutor (Claude → Groq, côté serveur)
//                   puis Pollinations (côté client, si l'API est injoignable).
// ============================================================

const AiCore = (() => {

    const ENDPOINT          = '/api/tutor';
    const FIRST_TOKEN_MS    = 30000; // délai avant le premier caractère
    const INACTIVITY_MS     = 30000; // délai entre deux caractères
    const POLLINATIONS_MS   = 25000;

    /** Requête en cours (une seule à la fois par élève). */
    let _controller = null;

    // ── Messages d'erreur, par code ────────────────────────
    const ERRORS = {
        no_key:   "Le professeur IA n'est pas encore configuré. Préviens ton enseignant. 🔑",
        auth:     "La clé du professeur IA est invalide. Préviens ton enseignant. 🔑",
        quota:    "Beaucoup d'élèves sollicitent le professeur en ce moment. Réessaie dans une minute. ⏳",
        timeout:  "Le professeur met trop de temps à répondre. Vérifie ta connexion et réessaie. ⏱️",
        network:  "Impossible de joindre le professeur IA. Vérifie ta connexion internet. 📡",
        refusal:  "Je préfère ne pas répondre à cette demande. Reformule-la autrement. 🙂",
        agent:    "Ce professeur n'existe pas (ou plus).",
        aborted:  "Réponse interrompue.",
        server:   "Le professeur IA est momentanément indisponible. Réessaie dans quelques secondes. 🛠️"
    };

    function errorFor(code, fallbackMessage) {
        return { code: code || 'server', message: ERRORS[code] || fallbackMessage || ERRORS.server };
    }

    // ============================================================
    // FILTRE DE BALISES [[PROF:xxx]]
    // Le prof signale une redirection vers un collègue par une balise.
    // Elle ne doit jamais s'afficher à l'élève, même à cheval sur
    // deux morceaux du flux — d'où la petite réserve de caractères.
    // ============================================================
    function makeTagFilter(emit) {
        const TAG = /\[\[PROF:([a-z0-9_-]+)\]\]/gi;
        // Fin de flux ressemblant au DÉBUT d'une balise : « [ », « [[ », « [[PRO », « [[PROF:sv »…
        // Les crochets ordinaires du cours (« [ça] », « [1] ») ne correspondent pas.
        const PARTIAL = /\[(?:\[(?:P(?:R(?:O(?:F(?::[a-z0-9_-]*)?)?)?)?)?)?$/i;
        let buffer = '';
        let target = null;

        function consume(chunk, isFinal) {
            buffer += chunk;
            buffer = buffer.replace(TAG, (_m, id) => { target = id.toLowerCase(); return ''; });

            if (isFinal) {
                const out = buffer;
                buffer = '';
                if (out) emit(out);
                return;
            }
            // On garde en réserve une balise possiblement coupée entre deux morceaux du flux.
            const partial = buffer.match(PARTIAL);
            if (partial) {
                const i = buffer.length - partial[0].length;
                if (i > 0) emit(buffer.slice(0, i));
                buffer = buffer.slice(i);
            } else if (buffer) {
                emit(buffer);
                buffer = '';
            }
        }

        return { consume, getTarget: () => target };
    }

    // ============================================================
    // APPEL PRINCIPAL — streaming via /api/tutor
    // ============================================================

    /**
     * Interroge un professeur IA en streaming.
     *
     * @param {Object}   opts
     * @param {string}   opts.agentId    id de l'agent (voir agents-config.js)
     * @param {Array}    opts.messages   [{role:'user'|'assistant', content:string}]
     * @param {string}   [opts.mode]     'chat' | 'interro' | 'correction'
     * @param {string}   [opts.context]  contexte app (leçon/exercice ouvert)
     * @param {Function} [opts.onToken]  (texte) → appelé à chaque morceau reçu
     * @param {Function} [opts.onDone]   ({text, switchTo, degraded}) → fin normale
     * @param {Function} [opts.onError]  ({code, message, partial}) → échec
     * @returns {{abort: Function}}
     */
    function stream({ agentId, messages, mode = 'chat', context = '', onToken, onDone, onError }) {
        abort(); // une seule conversation active à la fois

        const controller = new AbortController();
        _controller = controller;

        let fullText = '';
        const filter = makeTagFilter(text => {
            fullText += text;
            if (onToken) onToken(text);
        });

        // Minuteur relancé à chaque caractère reçu.
        let timer = null;
        const arm = ms => {
            clearTimeout(timer);
            timer = setTimeout(() => controller.abort(new DOMException('timeout', 'TimeoutError')), ms);
        };
        const disarm = () => clearTimeout(timer);

        (async () => {
            arm(FIRST_TOKEN_MS);
            try {
                const response = await fetch(ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ agentId, mode, messages, context }),
                    signal: controller.signal
                });

                // Endpoint absent (dev local) ou clés manquantes → repli navigateur.
                if (response.status === 404 || response.status === 405 || response.status === 503) {
                    disarm();
                    return await pollinationsFallback({ agentId, messages, mode, context, controller, filter, getText: () => fullText, onToken, onDone, onError });
                }

                if (!response.ok || !response.body) {
                    disarm();
                    const info = await response.json().catch(() => ({}));
                    return fail(onError, errorFor(info.code, info.error), 0);
                }

                // ── Lecture du flux SSE ──
                const reader  = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let streamError = null;
                let degraded = false;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    arm(INACTIVITY_MS);

                    buffer += decoder.decode(value, { stream: true });
                    const parts = buffer.split('\n\n');
                    buffer = parts.pop() || '';

                    for (const part of parts) {
                        const line = part.trim();
                        if (!line.startsWith('data:')) continue;
                        let payload;
                        try { payload = JSON.parse(line.slice(5).trim()); }
                        catch (_) { continue; }

                        if (payload.type === 'token')      filter.consume(payload.text, false);
                        else if (payload.type === 'error') streamError = payload;
                        else if (payload.type === 'done')  degraded = Boolean(payload.degraded);
                    }
                }

                disarm();
                filter.consume('', true);

                if (streamError) {
                    return fail(onError, errorFor(streamError.code, streamError.message), fullText.length);
                }
                if (!fullText.trim()) {
                    return fail(onError, errorFor('server'), 0);
                }
                if (onDone) onDone({ text: fullText, switchTo: filter.getTarget(), degraded });

            } catch (err) {
                disarm();
                if (controller.signal.aborted && err?.name !== 'TimeoutError') {
                    // Interruption volontaire (l'élève a fermé ou relancé) : on ne signale rien.
                    if (fullText && onDone) onDone({ text: fullText, switchTo: filter.getTarget(), aborted: true });
                    return;
                }
                if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
                    return fail(onError, errorFor('timeout'), fullText.length);
                }
                // La fonction serverless est injoignable → dernier repli navigateur.
                try {
                    return await pollinationsFallback({ agentId, messages, mode, context, controller, filter, getText: () => fullText, onToken, onDone, onError });
                } catch (_) {
                    return fail(onError, errorFor('network'), fullText.length);
                }
            } finally {
                if (_controller === controller) _controller = null;
            }
        })();

        return { abort: () => controller.abort() };
    }

    function fail(onError, info, partialLength) {
        if (onError) onError({ ...info, partial: partialLength > 0 });
    }

    // ============================================================
    // DERNIER REPLI — Pollinations (navigateur, sans streaming)
    // Utilisé uniquement si /api/tutor est injoignable (dev local,
    // déploiement sans clé). Le prompt système est alors reconstruit
    // côté client à partir de la même configuration.
    // ============================================================
    async function pollinationsFallback({ agentId, messages, mode, context, controller, filter, onToken, onDone, onError }) {
        const cfg   = typeof AgentsConfig !== 'undefined' ? AgentsConfig : null;
        const agent = cfg && cfg.getAgent(agentId);
        if (!agent) return fail(onError, errorFor('agent'), 0);

        const timer = setTimeout(() => controller.abort(), POLLINATIONS_MS);
        try {
            const response = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai',
                    temperature: 0.7,
                    max_tokens: 800,
                    private: true,
                    messages: [
                        { role: 'system', content: cfg.buildSystemPrompt(agent, mode, context) },
                        ...messages.filter(m => m.role === 'user' || m.role === 'assistant')
                    ]
                }),
                signal: controller.signal
            });
            clearTimeout(timer);
            if (!response.ok) throw new Error(`Pollinations ${response.status}`);

            const raw = await response.text();
            let text = raw;
            try {
                const json = JSON.parse(raw);
                text = json.choices?.[0]?.message?.content || json.content || raw;
            } catch (_) { /* réponse en texte brut */ }

            text = String(text).trim();
            if (!text) throw new Error('Réponse vide');

            // On passe par le même filtre de balises, puis on livre d'un bloc.
            filter.consume(text, true);
            if (onDone) onDone({ text, switchTo: filter.getTarget(), degraded: true });

        } catch (err) {
            clearTimeout(timer);
            if (err?.name === 'AbortError') return fail(onError, errorFor('timeout'), 0);
            return fail(onError, errorFor('network'), 0);
        }
    }

    // ============================================================
    // DIVERS
    // ============================================================

    /** Interrompt la requête en cours, s'il y en a une. */
    function abort() {
        if (_controller) {
            _controller.abort();
            _controller = null;
        }
    }

    /** Vrai si une réponse est en cours de génération. */
    function isBusy() {
        return Boolean(_controller);
    }

    return { stream, abort, isBusy, ERRORS };
})();
