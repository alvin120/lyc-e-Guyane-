// ============================================================
// EXERCICES LYCÉE — Grilles et schémas SVG interactifs
// ============================================================

const ROW_H = 44;

// f(x)=0 fixed, c(orrect) = student fill
const EXERCISES = [

    // ---- 1. TABLEAU DE SIGNES  (Maths 1ère) ----
    {
        id: "e1", subject: "maths", emoji: "📐",
        title: "Tableau de signes",
        subtitle: "f(x) = (x + 1)(x − 3)",
        level: "Première",
        intro: "Complète le tableau de signes de f(x) = (x + 1)(x − 3). Clique une case vide, puis + ou −.",
        type: "grid",
        palette: ["+", "−"],
        labelW: 110, colW: 72,
        headers: ["", "(−∞, −1)", "x = −1", "(−1, 3)", "x = 3", "(3, +∞)"],
        rows: [
            { label: "(x + 1)", cells: [
                { c:"−" }, { v:"0", f:1 }, { c:"+" }, { c:"+" }, { c:"+" }
            ]},
            { label: "(x − 3)", cells: [
                { c:"−" }, { c:"−" }, { c:"−" }, { v:"0", f:1 }, { c:"+" }
            ]},
            { label: "f(x)", bold:1, cells: [
                { c:"+" }, { v:"0", f:1 }, { c:"−" }, { v:"0", f:1 }, { c:"+" }
            ]},
        ]
    },

    // ---- 2. TABLEAU DE VALEURS  (Maths 2de) ----
    {
        id: "e2", subject: "maths", emoji: "📊",
        title: "Tableau de valeurs",
        subtitle: "f(x) = x² − 1",
        level: "Seconde",
        intro: "Calcule f(x) = x² − 1 pour chaque valeur de x. Clique une case, puis choisis la bonne réponse.",
        type: "grid",
        palette: ["3", "0", "−1", "8"],
        labelW: 80, colW: 64,
        headers: ["x =", "−2", "−1", "0", "1", "3"],
        rows: [
            { label: "f(x) =", cells: [
                { c:"3" }, { c:"0" }, { c:"−1" }, { c:"0" }, { c:"8" }
            ]}
        ]
    },

    // ---- 3. SCHÉMA CELLULE  (SVT 2de) ----
    {
        id: "e3", subject: "svt", emoji: "🌿",
        title: "La cellule eucaryote",
        subtitle: "Légender les organites",
        level: "Seconde",
        intro: "Clique un numéro sur le schéma, puis sélectionne le bon nom dans la palette.",
        type: "diagram",
        palette: ["Noyau", "Mitochondrie", "Membrane plasmique", "Cytoplasme", "Réticulum endoplasmique"],
        zones: [
            { id:"z1", x:200, y:152, correct:"Noyau",                     label:"1" },
            { id:"z2", x:315, y:110, correct:"Mitochondrie",               label:"2" },
            { id:"z3", x:356, y:188, correct:"Membrane plasmique",         label:"3" },
            { id:"z4", x: 98, y:190, correct:"Cytoplasme",                 label:"4" },
            { id:"z5", x:248, y:108, correct:"Réticulum endoplasmique",    label:"5" },
        ]
    },

    // ---- 4. SONS ET FRÉQUENCES  (Physique-Chimie 2de) ----
    {
        id: "e4", subject: "physchim", emoji: "⚗️",
        title: "Sons et fréquences",
        subtitle: "Infrason, audible ou ultrason ?",
        level: "Seconde",
        intro: "Classe chaque son selon sa fréquence. Infrason < 20 Hz | Audible 20 Hz–20 kHz | Ultrason > 20 kHz.",
        type: "grid",
        palette: ["Infrason", "Audible", "Ultrason"],
        labelW: 158, colW: 118,
        headers: ["Source sonore", "Fréquence", "Catégorie"],
        rows: [
            { label:"Tremblement de terre", cells:[{ v:"8 Hz",      f:1 }, { c:"Infrason"  }] },
            { label:"Note La (diapason)",   cells:[{ v:"440 Hz",    f:1 }, { c:"Audible"   }] },
            { label:"Voix humaine",         cells:[{ v:"300 Hz",    f:1 }, { c:"Audible"   }] },
            { label:"Sonar de dauphin",     cells:[{ v:"60 000 Hz", f:1 }, { c:"Ultrason"  }] },
            { label:"Chant de baleine",     cells:[{ v:"15 Hz",     f:1 }, { c:"Infrason"  }] },
            { label:"Échographie médicale", cells:[{ v:"3 MHz",     f:1 }, { c:"Ultrason"  }] },
        ]
    },

    // ---- 5. PASSÉ COMPOSÉ  (Français 2de) ----
    {
        id: "e5", subject: "francais", emoji: "📖",
        title: "Passé composé",
        subtitle: "Verbe ALLER — auxiliaire être",
        level: "Seconde",
        intro: "Complète le tableau avec les formes du passé composé du verbe ALLER.",
        type: "grid",
        palette: ["suis allé(e)", "es allé(e)", "est allé(e)", "sommes allé(e)s", "êtes allé(e)s", "sont allé(e)s"],
        labelW: 115, colW: 152,
        headers: ["Pronom", "Passé composé"],
        rows: [
            { label:"Je",           cells:[{ c:"suis allé(e)"     }] },
            { label:"Tu",           cells:[{ c:"es allé(e)"       }] },
            { label:"Il / Elle",    cells:[{ c:"est allé(e)"      }] },
            { label:"Nous",         cells:[{ c:"sommes allé(e)s"  }] },
            { label:"Vous",         cells:[{ c:"êtes allé(e)s"    }] },
            { label:"Ils / Elles",  cells:[{ c:"sont allé(e)s"    }] },
        ]
    }
];

// ============================================================
// MERGE BUILT-IN + CUSTOM
// ============================================================
function getAllExercises() {
    return [...EXERCISES, ...getCustomExercises()];
}

// ============================================================
// STATE
// ============================================================
let exoCurrent  = null;
let exoAnswers  = {};   // cid/zid → valeur
let exoSelected = null;
let exoChecked  = false;

const SUBJECT_LABELS = {
    maths:"Mathématiques", svt:"SVT", physchim:"Physique-Chimie",
    francais:"Français",   histgeo:"Histoire-Géo"
};

// ============================================================
// ILLUSTRATIONS SVG VECTORIELLES PAR MATIÈRE
// ============================================================
const EXO_ANIMATIONS = {

    maths: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="150" fill="#eff6ff"/>
        <!-- Grille légère -->
        ${[1,2,3,4,5].map(i=>`<line x1="${i*80+20}" y1="10" x2="${i*80+20}" y2="140" stroke="#dbeafe" stroke-width="1"/>`).join('')}
        ${[1,2].map(i=>`<line x1="20" y1="${i*50}" x2="480" y2="${i*50}" stroke="#dbeafe" stroke-width="1"/>`).join('')}
        <!-- Axes -->
        <line x1="40" y1="130" x2="460" y2="130" stroke="#2563eb" stroke-width="2"/>
        <line x1="250" y1="15" x2="250" y2="135" stroke="#2563eb" stroke-width="2"/>
        <polygon points="460,126 470,130 460,134" fill="#2563eb"/>
        <polygon points="246,15 250,5 254,15" fill="#2563eb"/>
        <!-- Parabole animée -->
        <path d="M100,128 Q250,10 400,128" fill="none" stroke="#2563eb" stroke-width="3"
              stroke-dasharray="500" stroke-dashoffset="500" stroke-linecap="round">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="1.4s" fill="freeze"/>
        </path>
        <!-- Zéros -->
        <circle cx="100" cy="128" r="5" fill="white" stroke="#2563eb" stroke-width="2.5" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.2s" fill="freeze"/>
        </circle>
        <circle cx="400" cy="128" r="5" fill="white" stroke="#2563eb" stroke-width="2.5" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.3s" fill="freeze"/>
        </circle>
        <!-- Signes + / − animés -->
        <text x="152" y="118" font-size="22" fill="#dc2626" font-weight="900" font-family="Inter,sans-serif" opacity="0">
            −<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.4s" fill="freeze"/>
        </text>
        <text x="265" y="90" font-size="22" fill="#dc2626" font-weight="900" font-family="Inter,sans-serif" opacity="0">
            −<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.5s" fill="freeze"/>
        </text>
        <text x="360" y="118" font-size="22" fill="#16a34a" font-weight="900" font-family="Inter,sans-serif" opacity="0">
            +<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.6s" fill="freeze"/>
        </text>
        <!-- Labels axes -->
        <text x="474" y="134" font-size="14" fill="#2563eb" font-style="italic" font-family="serif">x</text>
        <text x="256" y="13" font-size="14" fill="#2563eb" font-style="italic" font-family="serif">y</text>
    </svg>`,

    svt: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="150" fill="#f0fdf4"/>
        <!-- Membrane externe (pulsante) -->
        <ellipse cx="250" cy="75" rx="185" ry="62" fill="#d1fae5" stroke="#16a34a" stroke-width="2.5">
            <animate attributeName="rx" values="185;190;185" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="ry" values="62;65;62" dur="2.5s" repeatCount="indefinite"/>
        </ellipse>
        <!-- Réticulum -->
        <path d="M172,80 Q188,68 205,80 Q222,92 239,80" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <path d="M170,95 Q187,83 204,95 Q221,107 238,95" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
        <!-- Mitochondrie -->
        <ellipse cx="340" cy="55" rx="30" ry="14" fill="#fed7aa" stroke="#ea580c" stroke-width="2" transform="rotate(-20,340,55)"/>
        <line x1="312" y1="54" x2="368" y2="54" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="5,3" transform="rotate(-20,340,55)"/>
        <!-- Noyau (pulsant) -->
        <ellipse cx="250" cy="76" rx="58" ry="46" fill="#bfdbfe" stroke="#2563eb" stroke-width="2.5">
            <animate attributeName="rx" values="58;61;58" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        <!-- Nucléole -->
        <ellipse cx="244" cy="79" rx="17" ry="14" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.5"/>
        <!-- Ribosomes -->
        <circle cx="160" cy="90" r="4" fill="#fbbf24"><animate attributeName="cy" values="90;85;90" dur="1.6s" repeatCount="indefinite"/></circle>
        <circle cx="320" cy="105" r="3.5" fill="#fbbf24"><animate attributeName="cy" values="105;100;105" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="290" cy="48" r="3" fill="#fbbf24"><animate attributeName="cy" values="48;43;48" dur="1.8s" repeatCount="indefinite"/></circle>
        <!-- Marqueurs numérotés -->
        <circle cx="250" cy="76" r="12" fill="#2563eb" opacity="0.85"/>
        <text x="250" y="81" text-anchor="middle" font-size="11" fill="white" font-weight="800" font-family="Inter,sans-serif">1</text>
        <circle cx="342" cy="52" r="12" fill="#ea580c" opacity="0.85"/>
        <text x="342" y="57" text-anchor="middle" font-size="11" fill="white" font-weight="800" font-family="Inter,sans-serif">2</text>
        <circle cx="415" cy="78" r="12" fill="#16a34a" opacity="0.85"/>
        <text x="415" y="83" text-anchor="middle" font-size="11" fill="white" font-weight="800" font-family="Inter,sans-serif">3</text>
    </svg>`,

    physchim: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="150" fill="#ecfeff"/>
        <!-- Ligne centrale -->
        <line x1="80" y1="75" x2="420" y2="75" stroke="#cffafe" stroke-width="1.5" stroke-dasharray="6,4"/>
        <!-- Ondes concentriques -->
        ${[1,2,3,4,5].map(i=>`
        <ellipse cx="120" cy="75" rx="${i*48}" ry="${i*26}" fill="none"
            stroke="#0891b2" stroke-width="${2.2 - i*0.3}" opacity="${1.1 - i*0.18}">
            <animate attributeName="rx" values="${i*48};${i*48+6};${i*48}" dur="${1.2+i*0.25}s" repeatCount="indefinite"/>
            <animate attributeName="ry" values="${i*26};${i*26+4};${i*26}" dur="${1.2+i*0.25}s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="${1.1-i*0.18};${0.9-i*0.18};${1.1-i*0.18}" dur="${1.2+i*0.25}s" repeatCount="indefinite"/>
        </ellipse>`).join('')}
        <!-- Source sonore -->
        <circle cx="120" cy="75" r="14" fill="#0e7490">
            <animate attributeName="r" values="14;16;14" dur="0.9s" repeatCount="indefinite"/>
        </circle>
        <text x="120" y="80" text-anchor="middle" font-size="13" fill="white" font-family="Inter,sans-serif">♪</text>
        <!-- Fréquences étiquettes -->
        <text x="280" y="40" font-size="11" fill="#0891b2" font-weight="700" font-family="Inter,sans-serif">Infrason &lt; 20 Hz</text>
        <text x="280" y="78" font-size="11" fill="#0891b2" font-weight="700" font-family="Inter,sans-serif">Audible 20 Hz–20 kHz</text>
        <text x="280" y="116" font-size="11" fill="#0891b2" font-weight="700" font-family="Inter,sans-serif">Ultrason &gt; 20 kHz</text>
        <!-- Séparateurs -->
        <line x1="270" y1="50" x2="480" y2="50" stroke="#a5f3fc" stroke-width="1" stroke-dasharray="4,3"/>
        <line x1="270" y1="90" x2="480" y2="90" stroke="#a5f3fc" stroke-width="1" stroke-dasharray="4,3"/>
    </svg>`,

    francais: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="150" fill="#f5f3ff"/>
        <!-- Livre ouvert -->
        <rect x="80" y="25" width="130" height="100" rx="6" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
        <rect x="210" y="25" width="130" height="100" rx="6" fill="white" stroke="#7c3aed" stroke-width="2"/>
        <line x1="210" y1="25" x2="210" y2="125" stroke="#7c3aed" stroke-width="3"/>
        <!-- Lignes page gauche -->
        ${[45,60,75,90,105].map((y,i)=>`<line x1="96" y1="${y}" x2="194" y2="${y}" stroke="#ddd6fe" stroke-width="1.5" opacity="${0.4+i*0.1}"/>`).join('')}
        <!-- Lignes page droite animées -->
        ${[45,60,75,90,105].map((y,i)=>`
        <line x1="226" y1="${y}" x2="226" y2="${y}" stroke="#7c3aed" stroke-width="1.8">
            <animate attributeName="x2" from="226" to="324" dur="0.35s" begin="${i*0.12}s" fill="freeze"/>
        </line>`).join('')}
        <!-- Stylo qui écrit -->
        <g>
            <animateTransform attributeName="transform" type="translate"
                values="226,45; 324,45; 324,60; 226,60; 226,75; 324,75"
                keyTimes="0; 0.17; 0.34; 0.5; 0.67; 1"
                dur="1.5s" begin="0s" fill="freeze"/>
            <ellipse cx="0" cy="0" rx="5" ry="3" fill="#7c3aed" transform="rotate(-30)"/>
            <line x1="0" y1="0" x2="-10" y2="8" stroke="#4c1d95" stroke-width="2"/>
        </g>
        <!-- Conjugaison animée -->
        <text x="370" y="50" font-size="12" fill="#7c3aed" font-weight="700" font-family="Inter,sans-serif" opacity="0">
            Je suis allé(e)<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.3s" fill="freeze"/>
        </text>
        <text x="370" y="70" font-size="12" fill="#7c3aed" font-weight="700" font-family="Inter,sans-serif" opacity="0">
            Tu es allé(e)<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.6s" fill="freeze"/>
        </text>
        <text x="370" y="90" font-size="12" fill="#7c3aed" font-weight="700" font-family="Inter,sans-serif" opacity="0">
            Il est allé<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.9s" fill="freeze"/>
        </text>
        <text x="370" y="110" font-size="12" fill="#7c3aed" font-weight="700" font-family="Inter,sans-serif" opacity="0">
            Nous sommes…<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.2s" fill="freeze"/>
        </text>
    </svg>`,

    histgeo: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="150" fill="#fff7ed"/>
        <!-- Globe terrestre -->
        <circle cx="120" cy="75" r="58" fill="#dbeafe" stroke="#ea580c" stroke-width="2.5"/>
        <!-- Méridiens animés (rotation) -->
        <g style="transform-origin:120px 75px">
            <animateTransform attributeName="transform" type="rotate" values="0 120 75;360 120 75" dur="12s" repeatCount="indefinite"/>
            <ellipse cx="120" cy="75" rx="22" ry="58" fill="none" stroke="#ea580c" stroke-width="1.5" opacity="0.6"/>
            <ellipse cx="120" cy="75" rx="44" ry="58" fill="none" stroke="#ea580c" stroke-width="1" opacity="0.4"/>
        </g>
        <!-- Parallèles -->
        <ellipse cx="120" cy="75" rx="58" ry="22" fill="none" stroke="#ea580c" stroke-width="1.5" opacity="0.6"/>
        <ellipse cx="120" cy="55" rx="48" ry="14" fill="none" stroke="#ea580c" stroke-width="1" opacity="0.4"/>
        <ellipse cx="120" cy="95" rx="48" ry="14" fill="none" stroke="#ea580c" stroke-width="1" opacity="0.4"/>
        <!-- Continents simplifiés -->
        <ellipse cx="105" cy="68" rx="18" ry="22" fill="#86efac" opacity="0.6"/>
        <ellipse cx="130" cy="72" rx="14" ry="18" fill="#86efac" opacity="0.55"/>
        <!-- Epingle Guyane -->
        <circle cx="112" cy="72" r="5" fill="#ea580c">
            <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite"/>
        </circle>
        <!-- Timeline à droite -->
        <line x1="230" y1="30" x2="230" y2="130" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
        ${[["1635","Colonisation",30],["1848","Abolition esclavage",60],["1946","DOM",90],["1969","Kourou",118]].map(([yr,ev,y])=>`
        <circle cx="230" cy="${y}" r="6" fill="#ea580c" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${(y-30)/88*0.8}s" fill="freeze"/>
        </circle>
        <text x="244" y="${y+4}" font-size="11" fill="#ea580c" font-weight="700" font-family="Inter,sans-serif" opacity="0">
            ${yr}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${(y-30)/88*0.8}s" fill="freeze"/>
        </text>
        <text x="276" y="${y+4}" font-size="10" fill="#78350f" font-family="Inter,sans-serif" opacity="0">
            ${ev}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${(y-30)/88*0.8+0.1}s" fill="freeze"/>
        </text>`).join('')}
    </svg>`,

    default: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="150" fill="#f0fdf4"/>
        <!-- Icônes flottantes -->
        ${[["📐",80,50],["📖",200,60],["🌿",320,45],["⚗️",430,55]].map(([ic,x,y])=>`
        <text x="${x}" y="${y}" font-size="36" text-anchor="middle" opacity="0.8">
            ${ic}<animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="${1.5+Math.random()}s" repeatCount="indefinite"/>
        </text>`).join('')}
        <text x="250" y="115" text-anchor="middle" font-size="15" fill="#16a34a" font-weight="700" font-family="Inter,sans-serif">
            Bonne chance ! Tu vas réussir 💪
        </text>
    </svg>`
};

function getExoAnimation(subject) {
    return EXO_ANIMATIONS[subject] || EXO_ANIMATIONS.default;
}

// ============================================================
// LISTE
// ============================================================
function renderExercicesList() {
    const home = document.getElementById("exercices-home");
    const game = document.getElementById("sudoku-game");
    if (!home) return;
    home.classList.remove("hidden");
    game.classList.add("hidden");

    const diffClass = lvl => lvl === "Seconde" ? "diff-facile" : lvl === "Terminale" ? "diff-hard" : "diff-moyen";

    home.innerHTML = `<div class="exo-grid">
        ${getAllExercises().map(e => `
            <div class="exo-card" data-subj="${e.subject}">
                <div class="exo-card-banner">${getExoAnimation(e.subject)}</div>
                <div class="exo-card-body">
                    <div style="display:flex;align-items:center;gap:8px">
                        <span class="exo-card-icon">${e.emoji}</span>
                        <span class="exo-card-subject">${SUBJECT_LABELS[e.subject] || e.subject}</span>
                    </div>
                    <h3>${e.title}</h3>
                    <p class="exo-card-sub">${e.subtitle}</p>
                    <span class="exo-diff ${diffClass(e.level)}">${e.level}</span>
                    <button class="btn-primary" type="button" data-eid="${e.id}">Commencer →</button>
                </div>
            </div>`).join("")}
    </div>`;

    home.querySelectorAll("[data-eid]").forEach(btn =>
        btn.addEventListener("click", () => startExercice(btn.dataset.eid))
    );

    // Bouton admin "Ajouter un exercice" visible uniquement pour l'admin
    const addBtn = document.getElementById("btn-add-exo-sidebar");
    if (addBtn) {
        const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
        addBtn.classList.toggle("hidden", !(user && user.role === "admin"));
    }
}

// ============================================================
// DÉMARRER
// ============================================================
function startExercice(id) {
    exoCurrent  = EXERCISES.find(e => e.id === id);
    if (!exoCurrent) return;
    exoAnswers  = {};
    exoSelected = null;
    exoChecked  = false;

    document.getElementById("exercices-home").classList.add("hidden");
    const game = document.getElementById("sudoku-game");
    game.classList.remove("hidden");

    const lvlClass = exoCurrent.level === "Seconde" ? "diff-facile" : exoCurrent.level === "Terminale" ? "diff-hard" : "diff-moyen";

    game.innerHTML = `
    <div class="sudoku-header">
        <button class="back-btn" type="button" id="exo-back">← Exercices</button>
        <div class="su-title-block">
            <span class="exo-card-icon" style="font-size:1.8rem">${exoCurrent.emoji}</span>
            <div>
                <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b;margin-bottom:2px">
                    ${SUBJECT_LABELS[exoCurrent.subject] || exoCurrent.subject}
                </div>
                <h2>${exoCurrent.title}</h2>
            </div>
            <span class="exo-diff ${lvlClass}" style="margin-left:8px">${exoCurrent.level}</span>
        </div>
        <button class="btn-sm" type="button" id="exo-reset">🔄 Reset</button>
    </div>
    <div class="exo-anim-banner">${getExoAnimation(exoCurrent.subject)}</div>
    <p class="exo-intro">${exoCurrent.intro}</p>
    <div class="exo-layout">
        <div class="exo-svg-wrap" id="exo-svg-wrap"></div>
        <div class="exo-controls">
            <p class="su-tip">Choisir une réponse :</p>
            <div class="exo-palette" id="exo-palette">
                ${exoCurrent.palette.map(v =>
                    `<button class="exo-pal-btn" type="button" data-val="${v}">${v}</button>`
                ).join("")}
            </div>
            <button class="btn-primary btn-full" type="button" id="exo-check" style="margin-top:12px">🔍 Vérifier</button>
            <div class="su-hint" id="exo-hint"></div>
        </div>
    </div>`;

    if (exoCurrent.type === "grid") drawExoGrid();
    else                             drawExoDiagram();

    document.getElementById("exo-back").addEventListener("click", renderExercicesList);
    document.getElementById("exo-reset").addEventListener("click", () => startExercice(id));
    document.getElementById("exo-palette").addEventListener("click", e => {
        const btn = e.target.closest(".exo-pal-btn");
        if (btn) placeExoValue(btn.dataset.val);
    });
    document.getElementById("exo-check").addEventListener("click", checkExo);
}

// ============================================================
// RENDU GRILLE SVG
// ============================================================
function drawExoGrid() {
    const exo    = exoCurrent;
    const labelW = exo.labelW || 120;
    const colW   = exo.colW   || 85;
    const numCols = exo.headers.length - 1;
    const numRows = exo.rows.length;
    const W = labelW + numCols * colW;
    const H = (numRows + 1) * ROW_H;

    let bg = "", fg = "", lines = "";

    // En-tête
    exo.headers.forEach((h, ci) => {
        const x = ci === 0 ? 0 : labelW + (ci - 1) * colW;
        const w = ci === 0 ? labelW : colW;
        bg += `<rect x="${x}" y="0" width="${w}" height="${ROW_H}" fill="#e2e8f0"/>`;
        const fs = h.length > 9 ? 10 : 12;
        fg += `<text x="${x+w/2}" y="${ROW_H/2}" text-anchor="middle" dominant-baseline="middle"
            font-size="${fs}" font-weight="600" fill="#334155" pointer-events="none">${h}</text>`;
    });

    // Lignes de données
    exo.rows.forEach((row, ri) => {
        const y   = (ri + 1) * ROW_H;
        const alt = ri % 2 === 1;
        const rowBg = alt ? "#f8fafc" : "#ffffff";

        // Label
        bg += `<rect x="0" y="${y}" width="${labelW}" height="${ROW_H}" fill="${rowBg}"/>`;
        const lfs = row.label.length > 16 ? 9 : row.label.length > 11 ? 11 : 13;
        fg += `<text x="${labelW/2}" y="${y+ROW_H/2}" text-anchor="middle" dominant-baseline="middle"
            font-size="${lfs}" font-weight="${row.bold?'700':'500'}" fill="#1e293b"
            pointer-events="none">${row.label}</text>`;

        // Cellules
        row.cells.forEach((cell, ci) => {
            const x   = labelW + ci * colW;
            const cid = `${ri}_${ci}`;
            const isF = !!cell.f;
            const isC = cell.c !== undefined;
            const val = isF ? cell.v : (exoAnswers[cid] ?? "");
            const sel = exoSelected === cid;

            let fill = isF ? "#f1f5f9" : rowBg;
            if (isC && sel) fill = "#bbf7d0";
            if (exoChecked && isC) {
                if (val === cell.c) fill = "#dcfce7";
                else if (val)       fill = "#fee2e2";
                else                fill = "#fef9c3";
            }

            bg += `<rect class="${isC?'exo-cell':''}" x="${x}" y="${y}" width="${colW}" height="${ROW_H}"
                fill="${fill}" ${isC?`data-cid="${cid}"`:''}
                style="cursor:${isC?'pointer':'default'};transition:fill .15s"/>`;

            if (val) {
                const vfs = val.length > 9 ? 9 : val.length > 5 ? 11 : 14;
                fg += `<text x="${x+colW/2}" y="${y+ROW_H/2}" text-anchor="middle"
                    dominant-baseline="middle" font-size="${vfs}"
                    font-weight="${isF?'400':'700'}" fill="${isF?'#64748b':'#1e293b'}"
                    pointer-events="none">${val}</text>`;
            }
        });
    });

    // Lignes de grille
    for (let ri = 0; ri <= numRows + 1; ri++) {
        const y = ri * ROW_H, sw = (ri === 0 || ri === 1 || ri === numRows+1) ? 2 : 1;
        lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#e2e8f0" stroke-width="${sw}"/>`;
    }
    lines += `<line x1="${labelW}" y1="0" x2="${labelW}" y2="${H}" stroke="#94a3b8" stroke-width="2"/>`;
    for (let ci = 1; ci <= numCols; ci++) {
        const x = labelW + ci * colW;
        lines += `<line x1="${x}" y1="${ROW_H}" x2="${x}" y2="${H}" stroke="#e2e8f0" stroke-width="1"/>`;
    }

    document.getElementById("exo-svg-wrap").innerHTML =
        `<svg viewBox="0 0 ${W} ${H}" class="exo-table-svg" xmlns="http://www.w3.org/2000/svg">
            ${bg}${lines}${fg}
            <rect x="1" y="1" width="${W-2}" height="${H-2}" fill="none" stroke="#94a3b8" stroke-width="2" rx="6"/>
        </svg>`;

    document.querySelector(".exo-table-svg").addEventListener("click", e => {
        const cell = e.target.closest(".exo-cell");
        if (cell) selectExoCell(cell.dataset.cid);
    });
}

// ============================================================
// RENDU SCHÉMA CELLULE SVG
// ============================================================
function drawExoDiagram() {
    const exo = exoCurrent;
    const W = 400, H = 280;

    const markerColor = (zid) => {
        const sel = exoSelected === zid;
        if (sel) return "#16a34a";
        if (exoChecked) {
            const z = exo.zones.find(z => z.id === zid);
            const ans = exoAnswers[zid] || "";
            if (ans === z.correct) return "#15803d";
            if (ans)               return "#dc2626";
        }
        return "#334155";
    };

    const markers = exo.zones.map(z => {
        const mc  = markerColor(z.id);
        const ans = exoAnswers[z.id] || "";
        const short = ans.length > 13 ? ans.slice(0, 12) + "…" : ans;
        return `
        <circle class="exo-zone" data-cid="${z.id}" cx="${z.x}" cy="${z.y}" r="15"
            fill="${mc}" style="cursor:pointer;transition:fill .15s"/>
        <text x="${z.x}" y="${z.y}" text-anchor="middle" dominant-baseline="middle"
            font-size="13" font-weight="800" fill="white" pointer-events="none">${z.label}</text>
        ${ans ? `<text x="${z.x}" y="${z.y+24}" text-anchor="middle" font-size="9"
            font-style="italic" fill="${mc}" pointer-events="none">${short}</text>` : ""}`;
    }).join("");

    document.getElementById("exo-svg-wrap").innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="exo-diagram-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- fond -->
        <rect width="${W}" height="${H}" fill="#f0fdf4" rx="12"/>

        <!-- Membrane plasmique (zone 3 = contour) -->
        <ellipse cx="200" cy="150" rx="176" ry="128" fill="#d1fae5" stroke="#16a34a" stroke-width="3"/>

        <!-- Réticulum endoplasmique — lignes ondulées près du noyau -->
        <path d="M163,135 Q179,124 196,135 Q213,146 230,135" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M161,152 Q178,141 195,152 Q212,163 229,152" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M163,169 Q179,158 196,169 Q213,180 230,169" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Mitochondrie -->
        <g transform="rotate(-28,316,110)">
            <ellipse cx="316" cy="110" rx="28" ry="14" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
            <line x1="288" y1="110" x2="344" y2="110" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4,3"/>
        </g>

        <!-- Noyau -->
        <ellipse cx="200" cy="152" rx="56" ry="44" fill="#bfdbfe" stroke="#2563eb" stroke-width="2.5"/>
        <!-- Nucléole -->
        <ellipse cx="194" cy="156" rx="16" ry="13" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.2"/>

        <!-- Ribosomes (petits ronds) -->
        <circle cx="270" cy="190" r="3.5" fill="#fbbf24"/>
        <circle cx="280" cy="178" r="3.5" fill="#fbbf24"/>
        <circle cx="140" cy="165" r="3.5" fill="#fbbf24"/>
        <circle cx="152" cy="180" r="3.5" fill="#fbbf24"/>
        <circle cx="260" cy="205" r="3.5" fill="#fbbf24"/>

        <!-- Marqueurs cliquables numérotés -->
        ${markers}
    </svg>`;

    document.querySelector(".exo-diagram-svg").addEventListener("click", e => {
        const z = e.target.closest(".exo-zone");
        if (z) selectExoCell(z.dataset.cid);
    });
}

// ============================================================
// ACTIONS
// ============================================================
function selectExoCell(cid) {
    exoSelected = cid;
    exoChecked  = false;
    const hint = document.getElementById("exo-hint");
    if (hint) hint.textContent = "";
    if (exoCurrent.type === "grid") drawExoGrid();
    else                             drawExoDiagram();
}

function placeExoValue(value) {
    if (!exoSelected) {
        if (typeof showToast === "function") showToast("Clique d'abord une case vide !", "warn");
        return;
    }
    exoAnswers[exoSelected] = value;
    exoChecked = false;
    const hint = document.getElementById("exo-hint");
    if (hint) hint.textContent = "";

    if (exoCurrent.type === "grid") drawExoGrid();
    else                             drawExoDiagram();

    // micro flash
    const wrap = document.getElementById("exo-svg-wrap");
    if (wrap) {
        wrap.style.transition = "opacity .08s";
        wrap.style.opacity = "0.72";
        setTimeout(() => { wrap.style.opacity = "1"; }, 130);
    }
}

function checkExo() {
    exoChecked = true;
    let total = 0, correct = 0;

    if (exoCurrent.type === "grid") {
        exoCurrent.rows.forEach((row, ri) => {
            row.cells.forEach((cell, ci) => {
                if (!cell.f && cell.c !== undefined) {
                    total++;
                    if ((exoAnswers[`${ri}_${ci}`] || "") === cell.c) correct++;
                }
            });
        });
        drawExoGrid();
    } else {
        exoCurrent.zones.forEach(z => {
            total++;
            if ((exoAnswers[z.id] || "") === z.correct) correct++;
        });
        drawExoDiagram();
    }

    const pct  = Math.round((correct / total) * 100);
    const hint = document.getElementById("exo-hint");

    if (correct === total) {
        if (hint) hint.innerHTML = `<span class="su-success">🏆 Parfait ! ${correct}/${total} — Bravo !</span>`;
        if (typeof launchConfetti === "function") launchConfetti(100);
        if (typeof showToast      === "function") showToast("🏆 Exercice réussi ! Félicitations !", "success");
    } else {
        if (hint) hint.innerHTML =
            `<span class="su-error">${correct}/${total} correctes (${pct}%) — Cases rouges = erreurs.</span>` +
            `<button class="ai-help-inline-btn" id="ai-help-exo-btn">🤖 Demander de l'aide au Professeur IA</button>`;
        if (typeof showToast === "function")
            showToast(`${correct}/${total} réponses correctes`, pct >= 60 ? "info" : "warn");
        setTimeout(() => {
            document.getElementById("ai-help-exo-btn")?.addEventListener("click", () => {
                if (typeof AiTutor !== "undefined") {
                    AiTutor.open();
                    AiTutor.suggestHelp();
                }
            });
        }, 0);
    }
}
