// ============================================================
// SCÈNE 3D — « La planète du savoir » (page d'accueil)
// Mini-moteur WebGL maison : aucune bibliothèque à télécharger,
// donc rien de lourd à charger sur mobile.
// Si WebGL est absent ou si l'élève a demandé moins d'animations,
// rien n'est ajouté : l'accueil reste exactement comme avant.
// ============================================================

const Scene3D = (() => {

    // ---------- Vecteurs ----------
    const sub   = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const dot   = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const norm  = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

    // ---------- Matrices 4×4 (colonnes d'abord, comme WebGL) ----------
    function mul(a, b) {
        const o = new Array(16);
        for (let c = 0; c < 4; c++) {
            for (let r = 0; r < 4; r++) {
                o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
            }
        }
        return o;
    }
    const mulAll = (...ms) => ms.reduce(mul);
    const trans  = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    const scal   = (x, y = x, z = x) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    const rotX   = a => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; };
    const rotY   = a => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; };
    const rotZ   = a => { const c = Math.cos(a), s = Math.sin(a); return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; };
    function persp(fovy, aspect, near, far) {
        const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
        return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
    }
    const point = (m, p) => [
        m[0] * p[0] + m[4] * p[1] + m[8]  * p[2] + m[12],
        m[1] * p[0] + m[5] * p[1] + m[9]  * p[2] + m[13],
        m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
    ];

    // ---------- Couleurs ----------
    const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
    const nuance = (c, k) => [Math.min(1, c[0] * k), Math.min(1, c[1] * k), Math.min(1, c[2] * k)];
    // pseudo-hasard stable (même point → même valeur)
    const hasard = p => { const s = Math.sin(p[0] * 12.9898 + p[1] * 78.233 + p[2] * 37.719) * 43758.5453; return s - Math.floor(s); };

    // ---------- Géométrie : listes de triangles [a, b, c, couleur] ----------
    // `ref` = point dont la face doit s'éloigner (garantit des normales vers l'extérieur)
    function tri(out, a, b, c, col, ref) {
        const n = cross(sub(b, a), sub(c, a));
        if (Math.hypot(n[0], n[1], n[2]) < 1e-9) return; // triangle écrasé
        const ctr = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
        if (dot(n, sub(ctr, ref || [0, 0, 0])) < 0) out.push([a, c, b, col]);
        else out.push([a, b, c, col]);
    }

    function boite(w, h, d, col) {
        const x = w / 2, y = h / 2, z = d / 2, out = [];
        const p = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]];
        [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].forEach(f => {
            tri(out, p[f[0]], p[f[1]], p[f[2]], col);
            tri(out, p[f[0]], p[f[2]], p[f[3]], col);
        });
        return out;
    }

    // Cylindre / cône (rayon haut ou bas à 0 = pointe)
    function cylindre(rHaut, rBas, h, n, col, colBout) {
        const out = [], y = h / 2;
        for (let i = 0; i < n; i++) {
            const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
            const b0 = [Math.cos(a0) * rBas, -y, Math.sin(a0) * rBas], b1 = [Math.cos(a1) * rBas, -y, Math.sin(a1) * rBas];
            const t0 = [Math.cos(a0) * rHaut, y, Math.sin(a0) * rHaut], t1 = [Math.cos(a1) * rHaut, y, Math.sin(a1) * rHaut];
            const c = i % 2 ? col : nuance(col, 0.94);
            tri(out, b0, b1, t1, c, [0, 0, 0]);
            tri(out, b0, t1, t0, c, [0, 0, 0]);
            tri(out, [0, -y, 0], b0, b1, colBout || col, [0, 0, 0]);
            tri(out, [0, y, 0], t0, t1, colBout || col, [0, 0, 0]);
        }
        return out;
    }

    function tore(R, r, seg, tube, col) {
        const out = [];
        const P = (u, v) => [(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)];
        for (let i = 0; i < seg; i++) {
            const u0 = (i / seg) * Math.PI * 2, u1 = ((i + 1) / seg) * Math.PI * 2, um = (u0 + u1) / 2;
            const centre = [R * Math.cos(um), 0, R * Math.sin(um)];
            for (let j = 0; j < tube; j++) {
                const v0 = (j / tube) * Math.PI * 2, v1 = ((j + 1) / tube) * Math.PI * 2;
                tri(out, P(u0, v0), P(u1, v0), P(u1, v1), col, centre);
                tri(out, P(u0, v0), P(u1, v1), P(u0, v1), col, centre);
            }
        }
        return out;
    }

    function octaedre(s, col) {
        const out = [], X = [s, 0, 0], x = [-s, 0, 0], Y = [0, s * 1.25, 0], y = [0, -s * 1.25, 0], Z = [0, 0, s], z = [0, 0, -s];
        [[X, Y, Z], [Z, Y, x], [x, Y, z], [z, Y, X], [X, y, Z], [Z, y, x], [x, y, z], [z, y, X]]
            .forEach((f, i) => tri(out, f[0], f[1], f[2], nuance(col, 0.82 + (i % 4) * 0.08)));
        return out;
    }

    // Sphère à facettes ; `relief(p)` donne le rayon, `couleur(centre)` la teinte
    function icosphere(niveau, relief, couleur) {
        const t = (1 + Math.sqrt(5)) / 2;
        const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(norm);
        let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
                     [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
            .map(f => [v[f[0]], v[f[1]], v[f[2]]]);
        const milieu = (a, b) => norm([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
        for (let k = 0; k < niveau; k++) {
            const suite = [];
            faces.forEach(([a, b, c]) => {
                const ab = milieu(a, b), bc = milieu(b, c), ca = milieu(c, a);
                suite.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
            });
            faces = suite;
        }
        const out = [];
        faces.forEach(([a, b, c]) => {
            const ctr = norm([a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]]);
            const pt = p => { const r = relief(p); return [p[0] * r, p[1] * r, p[2] * r]; };
            tri(out, pt(a), pt(b), pt(c), couleur(ctr));
        });
        return out;
    }

    const placer = (tris, m) => tris.map(([a, b, c, col]) => [point(m, a), point(m, b), point(m, c), col]);

    // Triangles → tampon entrelacé position / normale / couleur
    function cuire(tris) {
        const d = new Float32Array(tris.length * 27);
        let i = 0;
        tris.forEach(([a, b, c, col]) => {
            const n = norm(cross(sub(b, a), sub(c, a)));
            [a, b, c].forEach(p => {
                d[i++] = p[0]; d[i++] = p[1]; d[i++] = p[2];
                d[i++] = n[0]; d[i++] = n[1]; d[i++] = n[2];
                d[i++] = col[0]; d[i++] = col[1]; d[i++] = col[2];
            });
        });
        return { data: d, count: tris.length * 3 };
    }

    // ---------- Les objets de la scène ----------
    const BLEU = hex("#2563eb"), VIOLET = hex("#7c3aed"), AMBRE = hex("#f59e0b"), VERT = hex("#16a34a"),
          CYAN = hex("#0891b2"), ROUGE = hex("#ef4444"), SARCELLE = hex("#0d9488"), BLANC = hex("#f8fafc"),
          CREME = hex("#fef3c7"), BRUN = hex("#92400e"), ORANGE = hex("#f97316"), JAUNE = hex("#fde047");

    // Continents : bruit lisse → la forêt amazonienne émerge de l'océan
    const terre = p => Math.sin(p[0] * 2.3 + 1.3) * Math.cos(p[1] * 2.9 - 0.4) + Math.sin(p[2] * 3.1 + p[0] * 1.7) * 0.6;

    function creerPlanete() {
        return icosphere(3,
            p => 1 + (terre(p) > 0.22 ? 0.055 + hasard(p) * 0.03 : 0) ,
            c => {
                if (Math.abs(c[1]) > 0.9) return nuance(BLANC, 0.92 + hasard(c) * 0.08);
                const t = terre(c), h = hasard(c);
                if (t > 0.22) return nuance(t > 0.7 ? hex("#15803d") : hex("#22c55e"), 0.82 + h * 0.3);
                if (t > 0.12) return nuance(hex("#fcd34d"), 0.9 + h * 0.15); // plages
                return nuance(hex("#3b82f6"), 0.8 + h * 0.3);
            });
    }

    function creerAnneau() {
        return placer(tore(1.62, 0.085, 56, 6, hex("#c7d2fe")), scal(1, 0.22, 1));
    }

    function creerFusee() { // clin d'œil à Kourou
        const corps    = cylindre(0.085, 0.085, 0.5, 10, BLANC, hex("#cbd5e1"));
        const coiffe   = placer(cylindre(0, 0.085, 0.2, 10, ROUGE), trans(0, 0.35, 0));
        const bande    = placer(cylindre(0.088, 0.088, 0.05, 10, BLEU), trans(0, 0.08, 0));
        const flamme   = placer(cylindre(0.065, 0, 0.2, 8, ORANGE, JAUNE), trans(0, -0.35, 0));
        const booster  = x => [
            ...placer(cylindre(0.045, 0.045, 0.3, 8, hex("#e2e8f0")), trans(x, -0.1, 0)),
            ...placer(cylindre(0, 0.045, 0.09, 8, ROUGE), trans(x, 0.095, 0)),
            ...placer(cylindre(0.035, 0, 0.12, 6, JAUNE), trans(x, -0.31, 0)),
        ];
        return [...corps, ...coiffe, ...bande, ...flamme, ...booster(0.13), ...booster(-0.13)];
    }

    function creerArbre() {
        return [
            ...placer(cylindre(0.035, 0.045, 0.2, 6, BRUN), trans(0, -0.2, 0)),
            ...placer(cylindre(0, 0.2, 0.26, 7, VERT), trans(0, 0.02, 0)),
            ...placer(cylindre(0, 0.15, 0.24, 7, hex("#22c55e")), trans(0, 0.19, 0)),
            ...placer(cylindre(0, 0.1, 0.2, 7, hex("#4ade80")), trans(0, 0.33, 0)),
        ];
    }

    function creerLivre() {
        const livre = [
            ...placer(boite(0.42, 0.035, 0.32, VIOLET), trans(0, -0.05, 0)),
            ...placer(boite(0.37, 0.075, 0.29, CREME), trans(0.012, 0, 0)),
            ...placer(boite(0.42, 0.035, 0.32, VIOLET), trans(0, 0.05, 0)),
            ...placer(boite(0.035, 0.135, 0.32, nuance(VIOLET, 0.8)), trans(-0.2, 0, 0)),
        ];
        return placer(livre, rotZ(0.35));
    }

    function creerAtome() {
        const noyau = icosphere(1, () => 0.1, c => nuance(ROUGE, 0.85 + hasard(c) * 0.25));
        const orbite = a => placer(tore(0.29, 0.014, 28, 5, CYAN), mul(rotZ(a), rotX(Math.PI / 2)));
        const electron = (a, u) => placer(octaedre(0.035, JAUNE),
            mulAll(rotZ(a), rotX(Math.PI / 2), trans(0.29 * Math.cos(u), 0, 0.29 * Math.sin(u))));
        return [...noyau, ...orbite(0), ...orbite(Math.PI / 3), ...orbite(-Math.PI / 3),
                ...electron(0, 0.6), ...electron(Math.PI / 3, 2.6), ...electron(-Math.PI / 3, 4.4)];
    }

    function creerSablier() {
        const verre = hex("#fde68a");
        return [
            ...placer(cylindre(0.14, 0.02, 0.2, 8, verre), trans(0, 0.105, 0)),
            ...placer(cylindre(0.02, 0.14, 0.2, 8, AMBRE), trans(0, -0.105, 0)),
            ...placer(cylindre(0.17, 0.17, 0.035, 8, BRUN), trans(0, 0.22, 0)),
            ...placer(cylindre(0.17, 0.17, 0.035, 8, BRUN), trans(0, -0.22, 0)),
        ];
    }

    function creerGraphique() {
        const barre = (x, h, c) => placer(boite(0.1, h, 0.1, c), trans(x, h / 2 - 0.16, 0));
        return [
            ...placer(boite(0.46, 0.03, 0.18, hex("#334155")), trans(0, -0.175, 0)),
            ...barre(-0.14, 0.14, hex("#5eead4")), ...barre(0, 0.25, SARCELLE), ...barre(0.14, 0.38, hex("#0f766e")),
        ];
    }

    // ---------- État ----------
    let gl, prog, loc, canvas, hote, objets = [], etoiles = [], maillages = {};
    let actif = false, visible = false, raf = 0, t0 = 0, dernier = 0;
    let largeur = 1, hauteur = 1, distance = 8;
    let spin = 0.6, vitesse = 0.14, inclinaison = 0.34, lacet = 0, cibleInc = 0.34, cibleLacet = 0;
    let glisse = null, elan = 0, fete = 0;

    const VS = `
        attribute vec3 aPos; attribute vec3 aNor; attribute vec3 aCol;
        uniform mat4 uVP; uniform mat4 uM;
        varying vec3 vCol; varying vec3 vNor; varying vec3 vPos;
        void main() {
            vec4 w = uM * vec4(aPos, 1.0);
            vPos = w.xyz; vNor = mat3(uM) * aNor; vCol = aCol;
            gl_Position = uVP * w;
        }`;
    const FS = `
        precision mediump float;
        varying vec3 vCol; varying vec3 vNor; varying vec3 vPos;
        uniform vec3 uLum; uniform vec3 uOeil; uniform float uEclat;
        void main() {
            vec3 n = normalize(vNor);
            float d = max(dot(n, uLum), 0.0);
            float ciel = n.y * 0.5 + 0.5;
            vec3 c = vCol * (0.42 + 0.2 * ciel + 0.6 * d);
            vec3 v = normalize(uOeil - vPos);
            float bord = pow(1.0 - max(dot(n, v), 0.0), 3.0);
            c += bord * 0.22 * vec3(0.65, 0.8, 1.0);
            c += uEclat * 0.25;
            gl_FragColor = vec4(c, 1.0);
        }`;

    function compiler(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
    }

    function maillage(tris) {
        const { data, count } = cuire(tris);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return { buf, count };
    }

    function preparer() {
        prog = gl.createProgram();
        gl.attachShader(prog, compiler(gl.VERTEX_SHADER, VS));
        gl.attachShader(prog, compiler(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        loc = {
            pos: gl.getAttribLocation(prog, "aPos"), nor: gl.getAttribLocation(prog, "aNor"), col: gl.getAttribLocation(prog, "aCol"),
            vp: gl.getUniformLocation(prog, "uVP"), m: gl.getUniformLocation(prog, "uM"),
            lum: gl.getUniformLocation(prog, "uLum"), oeil: gl.getUniformLocation(prog, "uOeil"), eclat: gl.getUniformLocation(prog, "uEclat"),
        };
        gl.enableVertexAttribArray(loc.pos);
        gl.enableVertexAttribArray(loc.nor);
        gl.enableVertexAttribArray(loc.col);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 0);

        maillages = {
            planete: maillage(creerPlanete()), anneau: maillage(creerAnneau()),
        };

        // Satellites : un objet par grande famille de matières
        const sat = (tris, R, vit, phase, incZ, incX, taille, rot) =>
            ({ mesh: maillage(tris), R, vit, phase, plan: mul(rotZ(incZ), rotX(incX)), taille, rot });
        objets = [
            sat(octaedre(0.2, BLEU),  1.70,  0.42, 0.0,  0.30,  0.10, 1.15, [0.9, 1.3]),  // maths
            sat(creerLivre(),         1.98, -0.30, 1.1, -0.35,  0.30, 1.25, [0.5, 0.8]),  // français
            sat(creerSablier(),       1.80,  0.34, 2.3,  0.55, -0.25, 1.15, [0.0, 0.9]),  // histoire
            sat(creerArbre(),         2.06,  0.26, 3.6, -0.15, -0.45, 1.25, [0.0, 0.7]),  // SVT
            sat(creerAtome(),         1.76, -0.38, 4.6,  0.80,  0.15, 1.20, [0.8, 1.1]),  // physique-chimie
            sat(creerGraphique(),     2.02,  0.30, 5.5, -0.60,  0.05, 1.15, [0.0, 0.6]),  // SES
        ];
        objets.push({ mesh: maillage(creerFusee()), R: 2.22, vit: 0.5, phase: 0.8, plan: mul(rotZ(0.18), rotX(-0.2)), taille: 1.25, fusee: true });

        const teintes = [hex("#fbbf24"), hex("#93c5fd"), hex("#c4b5fd"), hex("#86efac"), hex("#fda4af")];
        for (let i = 0; i < 34; i++) {
            const a = hasard([i, 1, 2]) * Math.PI * 2, b = (hasard([i, 5, 9]) - 0.5) * 2.2, r = 2.6 + hasard([i, 3, 7]) * 1.4;
            etoiles.push({
                p: [Math.cos(a) * Math.cos(b) * r, Math.sin(b) * r * 0.8, Math.sin(a) * Math.cos(b) * r],
                t: teintes[i % teintes.length], ph: hasard([i, 8, 4]) * 6.28, s: 0.6 + hasard([i, 2, 6]) * 1.1,
            });
        }
        // un petit maillage d'étoile par teinte
        maillages.etoiles = teintes.map(t => maillage(octaedre(0.05, t)));
    }

    function dessiner(mesh, m, eclat) {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buf);
        gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, 36, 0);
        gl.vertexAttribPointer(loc.nor, 3, gl.FLOAT, false, 36, 12);
        gl.vertexAttribPointer(loc.col, 3, gl.FLOAT, false, 36, 24);
        gl.uniformMatrix4fv(loc.m, false, new Float32Array(m));
        gl.uniform1f(loc.eclat, eclat || 0);
        gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    }

    function redimensionner() {
        const r = canvas.getBoundingClientRect(); // le canvas, pas son conteneur (ils diffèrent sur mobile)
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        largeur = Math.max(1, Math.round(r.width * dpr));
        hauteur = Math.max(1, Math.round(r.height * dpr));
        if (canvas.width !== largeur || canvas.height !== hauteur) { canvas.width = largeur; canvas.height = hauteur; }
        gl.viewport(0, 0, largeur, hauteur);
        // la caméra recule pour que tout tienne, même dans un cadre étroit
        const aspect = largeur / hauteur;
        distance = 2.5 / (Math.tan(0.33) * Math.min(1, aspect));
    }

    const rebond = x => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

    function image(maintenant) {
        raf = 0;
        if (!actif || !visible) return;
        const t = (maintenant - t0) / 1000;
        const dt = Math.min(0.05, (maintenant - dernier) / 1000 || 0.016);
        dernier = maintenant;

        // Rotation : vitesse de croisière + élan donné au doigt / à la souris
        if (!glisse) { spin += (vitesse + elan) * dt; elan *= Math.pow(0.05, dt); }
        inclinaison += (cibleInc - inclinaison) * Math.min(1, dt * 4);
        lacet += (cibleLacet - lacet) * Math.min(1, dt * 4);
        fete = Math.max(0, fete - dt * 1.2);

        const entree = rebond(Math.min(1, t / 1.5));
        const pouls = 1 + Math.sin(fete * Math.PI) * 0.09;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const vp = mul(persp(0.66, largeur / hauteur, 0.1, 60), trans(0, 0, -distance));
        gl.uniformMatrix4fv(loc.vp, false, new Float32Array(vp));
        gl.uniform3fv(loc.lum, norm([0.45, 0.8, 0.65]));
        gl.uniform3f(loc.oeil, 0, 0, distance);

        const groupe = mulAll(rotX(inclinaison), rotY(lacet), scal(entree));
        const flotte = Math.sin(t * 0.9) * 0.05;

        dessiner(maillages.planete, mulAll(groupe, trans(0, flotte, 0), rotY(spin), scal(pouls)), fete * 0.5);
        dessiner(maillages.anneau, mulAll(groupe, trans(0, flotte, 0), rotZ(0.32), rotX(0.22), rotY(-spin * 0.6)), 0);

        objets.forEach((o, i) => {
            const a = o.phase + spin * 0.55 + t * o.vit + (1 - entree) * 2.5;
            const p = point(o.plan, [Math.cos(a) * o.R, Math.sin(t * 1.3 + i) * 0.08, Math.sin(a) * o.R]);
            let m;
            if (o.fusee) {
                // la fusée pointe dans le sens de sa course
                const sens = o.vit + vitesse * 0.55 >= 0 ? 1 : -1;
                const av = norm(sub(point(o.plan, [-Math.sin(a) * sens, 0, Math.cos(a) * sens]), point(o.plan, [0, 0, 0])));
                const ext = norm(p), dr = norm(cross(av, ext));
                m = [dr[0], dr[1], dr[2], 0, av[0], av[1], av[2], 0, ext[0], ext[1], ext[2], 0, p[0], p[1], p[2], 1];
                m = mul(m, scal(o.taille));
            } else {
                m = mulAll(trans(p[0], p[1], p[2]), rotY(t * o.rot[1] + i), rotX(t * o.rot[0] + 0.3), scal(o.taille));
            }
            dessiner(o.mesh, mul(groupe, m), fete * 0.4);
        });

        etoiles.forEach((e, i) => {
            const s = e.s * (0.6 + 0.4 * Math.sin(t * 2.2 + e.ph));
            const m = mulAll(groupe, rotY(spin * 0.12), trans(e.p[0], e.p[1], e.p[2]), rotY(t + e.ph), scal(s));
            dessiner(maillages.etoiles[i % maillages.etoiles.length], m, 0.25);
        });

        raf = requestAnimationFrame(image);
    }

    function relancer() {
        if (actif && visible && !raf && !document.hidden) { dernier = performance.now(); raf = requestAnimationFrame(image); }
    }

    function brancherInteractions(hero) {
        // Souris : la planète suit légèrement le curseur
        hero.addEventListener("pointermove", e => {
            if (e.pointerType !== "mouse" || glisse) return;
            const r = hero.getBoundingClientRect();
            cibleLacet = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
            cibleInc = 0.34 + ((e.clientY - r.top) / r.height - 0.5) * 0.3;
        });
        hero.addEventListener("pointerleave", () => { cibleLacet = 0; cibleInc = 0.34; });

        // Doigt ou clic maintenu : on fait tourner la planète
        canvas.addEventListener("pointerdown", e => {
            glisse = { x: e.clientX, t: performance.now(), v: 0 };
            canvas.classList.add("saisie");
            try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        });
        canvas.addEventListener("pointermove", e => {
            if (!glisse) return;
            const dx = e.clientX - glisse.x, now = performance.now();
            spin += dx * 0.008;
            glisse.v = (dx * 0.008) / Math.max(0.008, (now - glisse.t) / 1000);
            glisse.x = e.clientX; glisse.t = now;
        });
        const lacher = () => {
            if (!glisse) return;
            elan = Math.max(-5, Math.min(5, glisse.v));
            glisse = null;
            canvas.classList.remove("saisie");
        };
        canvas.addEventListener("pointerup", lacher);
        canvas.addEventListener("pointercancel", lacher);
    }

    function arreter() {
        actif = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (canvas) canvas.remove();
        if (hote) hote.classList.remove("scene-3d-on");
    }

    function init() {
        hote = document.querySelector(".hero-visual");
        const hero = document.querySelector(".hero");
        if (!hote || !hero || actif) return;
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        canvas = document.createElement("canvas");
        canvas.className = "scene-3d-canvas";
        canvas.setAttribute("aria-hidden", "true");
        try {
            gl = canvas.getContext("webgl", { antialias: true, alpha: true, powerPreference: "low-power" });
            if (!gl) return;
            hote.insertBefore(canvas, hote.firstChild);
            hote.classList.add("scene-3d-on");
            preparer();
        } catch (err) {
            console.warn("Scène 3D indisponible :", err);
            arreter();
            return;
        }

        actif = true;
        t0 = dernier = performance.now();
        redimensionner();
        brancherInteractions(hero);

        if (window.ResizeObserver) new ResizeObserver(() => { if (actif) redimensionner(); }).observe(canvas);
        else window.addEventListener("resize", () => { if (actif) redimensionner(); });

        // On ne dessine que lorsque la scène est réellement à l'écran
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            relancer();
        }, { threshold: 0.02 }).observe(hote);
        document.addEventListener("visibilitychange", relancer);
        canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); arreter(); });
    }

    // Petit « boum » de la planète quand l'élève gagne des points
    function celebrer() {
        if (!actif) return;
        fete = 1;
        elan += 2.2;
    }

    document.addEventListener("DOMContentLoaded", init);

    return { init, celebrer };
})();
