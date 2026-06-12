// ============================================================
// PROFESSEUR IA — Assistant pédagogique EduGuyane
// ============================================================

const AiTutor = (() => {
    let chatMessages = [];
    let isTyping = false;

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
                        : "Tu as une question sur le cours ? Pose-la moi, je suis là pour t'aider !"
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

    async function callAI(messages) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        try {
            // Priorité : fonction serverless Vercel (Groq, fiable)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (response.status === 503) {
                // Clé Groq non configurée → repli Pollinations
                return await callPollinations(messages);
            }

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const data = await response.json();
            if (!data.reply) throw new Error('Réponse vide');
            return data.reply;

        } catch (err) {
            clearTimeout(timeout);
            if (err.name === 'AbortError') throw err;
            // Repli Pollinations si la fonction Vercel n'est pas disponible (dev local, etc.)
            return await callPollinations(messages);
        }
    }

    async function callPollinations(messages) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages, model: 'openai', temperature: 0.7, max_tokens: 500, private: true }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!response.ok) throw new Error(`Pollinations HTTP ${response.status}`);
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                if (json.choices?.[0]?.message?.content) return json.choices[0].message.content.trim();
                if (json.content) return String(json.content).trim();
            } catch (_) {}
            if (text.trim()) return text.trim();
            throw new Error('Réponse vide');
        } catch (err) {
            clearTimeout(timeout);
            throw err;
        }
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
            'Ton rôle : répondre clairement et complètement à toutes les questions sur les cours, les exercices et les notions du programme lycée.',
            'Tu expliques les concepts, donnes des exemples concrets, corriges les erreurs et fournis les réponses aux questions posées.',
            'Tu réponds en français, avec un ton encourageant et adapté à des lycéens de 15-18 ans.',
            'Sois clair et précis. Utilise des listes ou étapes numérotées quand c\'est utile. Quelques emojis pour dynamiser.',
            exoContext ? `\nContexte de l'exercice en cours :\n${exoContext}` : ''
        ].filter(Boolean).join('\n');

        try {
            const reply = await callAI([
                { role: 'system', content: systemPrompt },
                ...chatMessages.map(m => ({ role: m.role, content: m.content }))
            ]);

            isTyping = false;
            chatMessages.push({ role: 'assistant', content: reply });
            renderMessages();

        } catch (err) {
            isTyping = false;
            let errMsg;
            if (err.name === 'AbortError') {
                errMsg = '⚠️ La requête a pris trop de temps. Vérifie ta connexion et réessaie.';
            } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                errMsg = '⚠️ Impossible de joindre le Professeur IA. Vérifie ta connexion internet.';
            } else {
                errMsg = '⚠️ Service temporairement indisponible. Réessaie dans quelques secondes.';
            }
            chatMessages.push({ role: 'assistant', content: errMsg });
            renderMessages();
        }
    }

    function suggestHelp(customText) {
        const text = customText || (
            typeof exoCurrent !== 'undefined' && exoCurrent
                ? `J'ai du mal avec l'exercice "${exoCurrent.title}". Peux-tu m'expliquer ?`
                : "Je n'arrive pas à comprendre cette notion. Peux-tu m'expliquer ?"
        );
        const inputEl = document.getElementById('ai-input');
        if (inputEl) {
            inputEl.value = text;
            inputEl.focus();
        }
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

        document.getElementById('ai-clear-btn')?.addEventListener('click', () => {
            clearChat();
            if (typeof showToast === 'function') showToast('Conversation effacée.', 'info');
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
