// ============================================================
// /api/tutor — Professeurs IA (fonction serverless Vercel)
// ------------------------------------------------------------
// Point d'entrée UNIQUE des agents-profs. Reçoit un agentId, un
// mode et l'historique, reconstruit le prompt système CÔTÉ SERVEUR
// depuis agents-config.js, puis renvoie la réponse en streaming (SSE).
//
// Sécurité : les clés API ne quittent jamais le serveur, et le client
// ne peut pas injecter de prompt système — il n'envoie qu'un agentId
// qui doit exister dans la configuration.
//
// Chaîne de repli : Claude → Groq. (Le 3ᵉ repli, Pollinations, est
// côté client dans ai-core.js, pour couvrir le cas où cette fonction
// elle-même est injoignable.)
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import AgentsConfig from '../agents-config.js';

const { MODES, buildSystemPrompt, getAgent } = AgentsConfig;

// ── Réglages ───────────────────────────────────────────────
const CLAUDE_MODEL = 'claude-opus-5';        // ← modèle des profs (voir README / .env.example)

// Groq retire régulièrement ses modèles (llama-3.1-8b-instant a disparu et
// renvoie désormais un 404). On demande donc la liste à Groq et on prend le
// premier modèle disponible dans cet ordre de préférence.
const GROQ_PREFERENCES = ['llama-3.3-70b', 'llama-3.1-8b', 'llama-4', 'llama-3', 'mixtral', 'gemma'];
const MAX_HISTORY  = 24;                     // nombre de messages d'historique conservés
const MAX_CHARS    = 6000;                   // taille max d'un message élève (photo décrite, devoir collé…)

// Repli serveur d'Anthropic en cas de refus de sécurité du modèle.
// Si le compte n'a pas accès à cette bêta, on réessaie automatiquement sans (voir plus bas).
const USE_REFUSAL_FALLBACK = true;

// Durée max d'exécution (le streaming d'une correction de devoir peut dépasser 10 s).
export const config = { maxDuration: 60 };

// ============================================================
// UTILITAIRES SSE
// ============================================================
function openStream(res) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // évite la mise en tampon par le proxy
    res.flushHeaders?.();
}

function send(res, payload) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

// ============================================================
// VALIDATION DES ENTRÉES
// ============================================================

/**
 * Nettoie l'historique reçu du navigateur :
 * - ne garde que les rôles user/assistant (un prompt système client serait ignoré) ;
 * - tronque les messages trop longs ;
 * - supprime les messages vides et les messages assistant en tête ;
 * - fusionne deux messages consécutifs de même rôle (refusé par l'API).
 */
function normalizeMessages(raw) {
    const cleaned = [];
    for (const m of raw) {
        if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
        const content = String(m.content ?? '').trim().slice(0, MAX_CHARS);
        if (!content) continue;
        if (cleaned.length === 0 && m.role !== 'user') continue; // doit commencer par l'élève
        const last = cleaned[cleaned.length - 1];
        if (last && last.role === m.role) last.content += '\n\n' + content;
        else cleaned.push({ role: m.role, content });
    }
    return cleaned.slice(-MAX_HISTORY);
}

// ============================================================
// FOURNISSEUR 1 — CLAUDE
// ============================================================
function claudeParams(agent, mode, system, messages, withFallback) {
    const params = {
        model: CLAUDE_MODEL,
        max_tokens: mode.maxTokens,
        system,
        messages,
        // Réponses courtes et pédagogiques : pas besoin d'une réflexion profonde en mode discussion.
        output_config: { effort: mode.effort }
    };
    if (withFallback) {
        params.betas = ['server-side-fallback-2026-07-01'];
        params.fallbacks = 'default';
    }
    return params;
}

/**
 * Diffuse la réponse de Claude. Renvoie le nombre de caractères envoyés
 * (0 = rien n'est parti, on peut encore basculer sur Groq proprement).
 */
async function streamClaude({ res, agent, mode, system, messages, state }) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    async function run(withFallback) {
        const stream = client.beta.messages.stream(
            claudeParams(agent, mode, system, messages, withFallback)
        );
        for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                send(res, { type: 'token', text: event.delta.text });
                state.sent += event.delta.text.length;
            }
        }
        const final = await stream.finalMessage();
        // Le modèle (et sa chaîne de repli) a décliné la demande.
        if (final.stop_reason === 'refusal' && state.sent === 0) {
            throw new Error('REFUSAL');
        }
        return final.model;
    }

    try {
        return await run(USE_REFUSAL_FALLBACK);
    } catch (err) {
        // Le compte n'a pas accès à la bêta « server-side-fallback » → on réessaie sans.
        const isBetaRejection =
            USE_REFUSAL_FALLBACK &&
            state.sent === 0 &&
            err instanceof Anthropic.BadRequestError &&
            /fallback|beta/i.test(err.message || '');
        if (isBetaRejection) return await run(false);
        throw err;
    }
}

// ============================================================
// FOURNISSEUR 2 — GROQ (repli)
// ============================================================

/** Modèle Groq retenu, mémorisé le temps de vie de la fonction. */
let _groqModel = null;

/** Demande à Groq la liste de ses modèles et retient le plus adapté. */
async function resolveGroqModel(key) {
    if (_groqModel) return _groqModel;

    const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` }
    });
    if (!r.ok) throw new Error(`Groq /models ${r.status}`);

    const ids = ((await r.json()).data || []).map(m => m.id);
    // Écarte ce qui n'est pas conversationnel (transcription, synthèse vocale, modération).
    const conversationnels = ids.filter(id => !/whisper|tts|guard|embed|vision/i.test(id));

    for (const pref of GROQ_PREFERENCES) {
        const trouve = conversationnels.find(id => id.includes(pref));
        if (trouve) { _groqModel = trouve; return trouve; }
    }
    if (!conversationnels.length) throw new Error('Groq : aucun modèle conversationnel disponible');
    _groqModel = conversationnels[0];
    return _groqModel;
}

async function streamGroq({ res, mode, system, messages, state }) {
    const key = process.env.GROQ_API_KEY;
    const model = await resolveGroqModel(key);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: system }, ...messages],
            temperature: 0.7,
            max_tokens: Math.min(mode.maxTokens, 2000),
            stream: true
        })
    });

    if (!response.ok || !response.body) {
        // Modèle retiré entre-temps : on oublie le choix mémorisé pour le prochain appel.
        if (response.status === 404) _groqModel = null;
        const detail = await response.text().catch(() => '');
        throw new Error(`Groq ${response.status} (${model}) : ${detail.slice(0, 300)}`);
    }

    // Groq parle le SSE d'OpenAI : on le retraduit dans notre format.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
                const text = JSON.parse(data).choices?.[0]?.delta?.content;
                if (text) {
                    send(res, { type: 'token', text });
                    state.sent += text.length;
                }
            } catch (_) { /* fragment incomplet : ignoré */ }
        }
    }
    return model;
}

// ============================================================
// TRADUCTION DES ERREURS → MESSAGE LISIBLE PAR UN ÉLÈVE
// ============================================================
function describeError(err) {
    if (err instanceof Anthropic.RateLimitError) {
        return { code: 'quota', message: "Trop de demandes en même temps. Attends une minute et relance." };
    }
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
        return { code: 'auth', message: "La clé du professeur IA est invalide. Préviens ton enseignant." };
    }
    if (err instanceof Anthropic.APIConnectionError) {
        return { code: 'network', message: "Impossible de joindre le professeur IA. Vérifie ta connexion." };
    }
    if (err?.status === 402 || err?.type === 'billing_error') {
        return { code: 'quota', message: "Le crédit du professeur IA est épuisé. Préviens ton enseignant." };
    }
    if (err?.message === 'REFUSAL') {
        return { code: 'refusal', message: "Je préfère ne pas répondre à cette demande. Reformule-la autrement." };
    }
    return { code: 'server', message: "Le professeur IA est momentanément indisponible. Réessaie dans quelques secondes." };
}

// ============================================================
// HANDLER
// ============================================================
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed', code: 'method' });

    // ── 1. Validation (avant d'ouvrir le flux : on peut encore répondre en JSON) ──
    const { agentId, mode: modeId, messages, context } = req.body || {};

    const agent = getAgent(agentId);
    if (!agent) {
        return res.status(400).json({ error: "Ce professeur n'existe pas.", code: 'agent' });
    }

    const mode = MODES[modeId] || MODES.chat;

    if (!Array.isArray(messages)) {
        return res.status(400).json({ error: 'Historique de conversation invalide.', code: 'messages' });
    }
    const history = normalizeMessages(messages);
    if (history.length === 0) {
        return res.status(400).json({ error: 'Aucun message à envoyer.', code: 'empty' });
    }

    const hasClaude = Boolean(process.env.ANTHROPIC_API_KEY);
    const hasGroq   = Boolean(process.env.GROQ_API_KEY);
    if (!hasClaude && !hasGroq) {
        return res.status(503).json({
            error: "Le professeur IA n'est pas configuré (aucune clé API). Préviens ton enseignant.",
            code: 'no_key'
        });
    }

    // Le prompt système est reconstruit ici, jamais reçu du navigateur.
    const system = buildSystemPrompt(
        agent,
        mode.id,
        typeof context === 'string' ? context.slice(0, 2000) : ''
    );

    // ── 2. Streaming ──
    openStream(res);
    const state = { sent: 0 };
    let lastError = null;

    if (hasClaude) {
        try {
            const model = await streamClaude({ res, agent, mode, system, messages: history, state });
            send(res, { type: 'done', model });
            return res.end();
        } catch (err) {
            lastError = err;
            console.error('[tutor] Claude a échoué :', err?.message);
            // Si des tokens sont déjà partis, on ne peut plus repartir de zéro proprement.
            if (state.sent > 0) {
                send(res, { type: 'error', ...describeError(err), partial: true });
                return res.end();
            }
        }
    }

    if (hasGroq) {
        try {
            const model = await streamGroq({ res, mode, system, messages: history, state });
            send(res, { type: 'done', model, degraded: hasClaude });
            return res.end();
        } catch (err) {
            lastError = err;
            console.error('[tutor] Groq a échoué :', err?.message);
        }
    }

    send(res, { type: 'error', ...describeError(lastError), partial: state.sent > 0 });
    return res.end();
}
