// Petit serveur statique de développement (uniquement local, jamais déployé).
// Différence avec `python -m http.server` : il interdit la mise en cache,
// sinon le navigateur continue de servir l'ancien script.js / style.css
// après chaque modification.
//
// Lancé automatiquement par .claude/launch.json — rien à faire à la main.
// Note : les fonctions du dossier api/ ne tournent pas ici (il faut Vercel).

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.argv[2]) || 4173;

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.mjs':  'text/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.webp': 'image/webp',
    '.ico':  'image/x-icon'
};

createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let path = decodeURIComponent(url.pathname);
    if (path === '/') path = '/index.html';

    // Empêche de remonter au-dessus de la racine du projet.
    const file = join(ROOT, normalize(path).replace(/^([/\\])+/, ''));
    if (!file.startsWith(ROOT)) {
        res.writeHead(403).end('Interdit');
        return;
    }

    try {
        const body = await readFile(file);
        res.writeHead(200, {
            'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-store, must-revalidate'
        });
        res.end(body);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 — ' + path);
    }
}).listen(PORT, () => console.log(`EduGuyane → http://localhost:${PORT}`));
