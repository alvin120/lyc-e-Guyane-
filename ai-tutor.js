// ============================================================
// PROFESSEUR IA — Assistant pédagogique EduGuyane
// ============================================================

const AiTutor = (() => {
    let chatMessages = [];
    let isTyping = false;

    function getApiKey() {
        return localStorage.getItem('eduguyane_ai_key') || '';
    }

    function setApiKey(key) {
        localStorage.setItem('eduguyane_ai_key', key.trim());
    }

    function getExerciseContext() {
        if (typeof exoCurrent === 'undefined' || !exoCurrent) return null;
        let ctx = `Exercice actuel : "${exoCurrent.title}"`;
        if (exoCurrent.subtitle) ctx += ` — ${exoCurrent.subtitle}`;
        ctx += `\nMatière : ${(typeof SUBJECT_LABELS !== 'undefined' && SUBJECT_LABELS[exoCurrent.subject]) || exoCurrent.subject}`;
        ctx += `\nNiveau : ${exoCurrent.level}`;
        ctx += `\nConsigne : ${exoCurrent.intro}`;
        if (exoCurrent.type === 'grid') {
            ctx += `\nColonnes du tableau : ${exoCurrent.headers.join(' | ')}`;
            ctx += `\nLignes : ${exoCurrent.rows.map(r => r.label).join(', ')}`;
        } else if (exoCurrent.type === 'diagram') {
            ctx += `\nZones à légender : ${exoCurrent.zones.map(z => z.correct).join(', ')}`;
        }
        return ctx;
    }

    function safeEscape(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderMessages() {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        if (chatMessages.length === 0) {
            const hasExo = typeof exoCurrent !== 'undefined' && exoCurrent;
            container.innerHTML = `
                <div class="ai-welcome">
                    <div class="ai-welcome-icon">🤖</div>
                    <p>Bonjour ! Je suis ton <strong>Professeur IA</strong>.<br>
                    ${hasExo
                        ? `Je vois que tu travailles sur <strong>"${safeEscape(exoCurrent.title)}"</strong>. Pose-moi ta question !`
                        : "Tu bloques sur un exercice ? Pose-moi ta question, je suis là pour t'aider !"
                    }</p>
                </div>`;
            return;
        }

        container.innerHTML = chatMessages.map(m => `
            <div class="ai-msg ${m.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}">
                ${m.role === 'assistant' ? '<span class="ai-msg-icon">🤖</span>' : ''}
                <div class="ai-msg-bubble">${safeEscape(m.content).replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        if (isTyping) {
            container.innerHTML += `
                <div class="ai-msg ai-msg-bot">
                    <span class="ai-msg-icon">🤖</span>
                    <div class="ai-msg-bubble ai-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>`;
        }

        container.scrollTop = container.scrollHeight;
    }

    async function sendMessage(text) {
        if (!text.trim() || isTyping) return;

        chatMessages.push({ role: 'user', content: text.trim() });
        renderMessages();

        const inputEl = document.getElementById('ai-input');
        if (inputEl) inputEl.value = '';

        isTyping = true;
        renderMessages();

        const exoContext = getExerciseContext();
        const systemPrompt = [
            'Tu es "Professeur IA", un assistant pédagogique de la plateforme EduGuyane pour les lycéens de Guyane (France).',
            'Ton rôle : guider l\'élève sans jamais donner directement la réponse finale.',
            'Tu utilises la méthode socratique : pose des questions, donne des indices progressifs, explique les concepts.',
            'Tu réponds en français, avec un ton encourageant et adapté à des lycéens de 15-18 ans.',
            'Sois concis : 3-5 phrases maximum par réponse. Utilise quelques emojis pour être plus expressif.',
            'Si l\'élève est proche de la bonne réponse, encourage-le. S\'il fait fausse route, redirige-le doucement.',
            exoContext ? `\nContexte de l'exercice en cours :\n${exoContext}` : ''
        ].join('\n');

        try {
            const response = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...chatMessages.map(m => ({ role: m.role, content: m.content }))
                    ],
                    model: 'openai',
                    temperature: 0.7,
                    max_tokens: 350,
                    private: true
                })
            });

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const reply = await response.text();

            isTyping = false;
            chatMessages.push({ role: 'assistant', content: reply.trim() || "Désolé, je n'ai pas pu répondre." });
            renderMessages();

        } catch (err) {
            isTyping = false;
            let errMsg = "⚠️ ";
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                errMsg += "Impossible de joindre l'IA. Vérifie ta connexion internet.";
            } else {
                errMsg += "Service temporairement indisponible. Réessaie dans quelques secondes.";
            }
            chatMessages.push({ role: 'assistant', content: errMsg });
            renderMessages();
        }
    }

    function suggestHelp(customText) {
        const text = customText || (
            typeof exoCurrent !== 'undefined' && exoCurrent
                ? `J'ai du mal avec l'exercice "${exoCurrent.title}". Peux-tu m'aider à comprendre ?`
                : "Je n'arrive pas à comprendre cet exercice. Peux-tu m'expliquer ?"
        );
        const inputEl = document.getElementById('ai-input');
        if (inputEl) {
            inputEl.value = text;
            inputEl.focus();
        }
    }

    function showConfigPanel() {
        const cfg = document.getElementById('ai-config');
        const area = document.getElementById('ai-input-area');
        if (cfg) cfg.classList.remove('hidden');
        if (area) area.classList.add('hidden');
        const inp = document.getElementById('ai-api-key-input');
        if (inp) { inp.value = getApiKey(); setTimeout(() => inp.focus(), 50); }
    }

    function hideConfigPanel() {
        const cfg = document.getElementById('ai-config');
        const area = document.getElementById('ai-input-area');
        if (cfg) cfg.classList.add('hidden');
        if (area) area.classList.remove('hidden');
    }

    function clearChat() {
        chatMessages = [];
        renderMessages();
    }

    function open() {
        const panel = document.getElementById('ai-tutor-panel');
        const btn   = document.getElementById('ai-tutor-btn');
        if (!panel) return;
        panel.classList.remove('hidden');
        btn?.classList.add('ai-btn-active');
        renderMessages();
        setTimeout(() => {
            const inp = document.getElementById('ai-input');
            if (inp) inp.focus();
        }, 120);
    }

    function close() {
        const panel = document.getElementById('ai-tutor-panel');
        const btn   = document.getElementById('ai-tutor-btn');
        panel?.classList.add('hidden');
        btn?.classList.remove('ai-btn-active');
    }

    function toggle() {
        const panel = document.getElementById('ai-tutor-panel');
        if (panel?.classList.contains('hidden')) open();
        else close();
    }

    function init() {
        const btn = document.getElementById('ai-tutor-btn');
        if (!btn) return;

        btn.addEventListener('click', toggle);

        document.getElementById('ai-close-btn')?.addEventListener('click', close);

        document.getElementById('ai-cfg-btn')?.addEventListener('click', () => {
            const cfg = document.getElementById('ai-config');
            if (cfg?.classList.contains('hidden')) showConfigPanel();
            else hideConfigPanel();
        });

        document.getElementById('ai-clear-btn')?.addEventListener('click', () => {
            clearChat();
            if (typeof showToast === 'function') showToast('Conversation effacée.', 'info');
        });

        document.getElementById('ai-save-key')?.addEventListener('click', () => {
            const val = document.getElementById('ai-api-key-input')?.value.trim();
            if (val && val.length > 10) {
                setApiKey(val);
                hideConfigPanel();
                if (typeof showToast === 'function') showToast('🔑 Clé API enregistrée !', 'success');
            } else {
                if (typeof showToast === 'function') showToast('Clé invalide. Elle doit commencer par AIza…', 'warn');
            }
        });

        document.getElementById('ai-cancel-cfg')?.addEventListener('click', hideConfigPanel);

        document.getElementById('ai-api-key-input')?.addEventListener('keydown', e => {
            if (e.key === 'Enter') document.getElementById('ai-save-key')?.click();
        });

        document.getElementById('ai-send-btn')?.addEventListener('click', () => {
            sendMessage(document.getElementById('ai-input')?.value || '');
        });

        document.getElementById('ai-input')?.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e.target.value);
            }
        });
    }

    return { init, open, close, toggle, sendMessage, suggestHelp, clearChat };
})();

document.addEventListener('DOMContentLoaded', () => AiTutor.init());
