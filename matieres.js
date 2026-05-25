// ============================================================
// MATIÈRES SCOLAIRES — UI complète
// ============================================================

let matCurrentSearch = "";
let matCurrentCat    = "all";
let matCurrentDetail = null;
let matCurrentTab    = "programme";
let matCurrentNiveau = "Seconde";
let matEspaceTab     = "eleve";

// ---- RENDU PRINCIPAL ----
function renderMatieres() {
    const view = document.getElementById("view-matieres");
    if (!view) return;
    view.innerHTML = `
        ${buildMatHero()}
        ${buildMatSearchBar()}
        ${buildMatCategoryFilter()}
        <div class="mat-grid" id="mat-grid"></div>
    `;
    renderMatGrid();
    bindMatSearch();
    bindMatCategories();
    initScrollReveal();
}

function buildMatHero() {
    return `
    <div class="mat-hero">
        <div class="mat-hero-bg"></div>
        <div class="mat-hero-content">
            <span class="mat-hero-badge">🎓 Lycée en Guyane française</span>
            <h1>Toutes les <span class="mat-gradient-text">Matières</span></h1>
            <p>17 disciplines enseignées au lycée — cours, ressources, vidéos et exercices interactifs pour réussir le baccalauréat.</p>
            <div class="mat-hero-stats">
                <div class="mat-hs"><strong>17</strong><span>Matières</span></div>
                <div class="mat-hs"><strong>80+</strong><span>Ressources PDF</span></div>
                <div class="mat-hs"><strong>40+</strong><span>Vidéos</span></div>
                <div class="mat-hs"><strong>3</strong><span>Niveaux</span></div>
            </div>
        </div>
    </div>`;
}

function buildMatSearchBar() {
    return `
    <div class="mat-search-wrap">
        <div class="mat-search-box">
            <span class="mat-search-icon">🔍</span>
            <input type="text" id="mat-search" placeholder="Rechercher une matière…" autocomplete="off" maxlength="50">
            <button class="mat-search-clear hidden" id="mat-search-clear">✕</button>
        </div>
        <div id="mat-count" class="mat-count">17 matières disponibles</div>
    </div>`;
}

function buildMatCategoryFilter() {
    return `
    <div class="mat-cats" id="mat-cats">
        ${CATEGORIES.map(c => `
            <button class="mat-cat-btn ${c.id === matCurrentCat ? "active" : ""}" data-cat="${c.id}">
                <span>${c.icon}</span> ${c.label}
            </button>`).join("")}
    </div>`;
}

function getFilteredMatieres() {
    return MATIERES_DATA.filter(m => {
        const matchCat    = matCurrentCat === "all" || m.categorie === matCurrentCat;
        const matchSearch = !matCurrentSearch ||
            m.titre.toLowerCase().includes(matCurrentSearch.toLowerCase()) ||
            m.description.toLowerCase().includes(matCurrentSearch.toLowerCase());
        return matchCat && matchSearch;
    });
}

function renderMatGrid() {
    const grid    = document.getElementById("mat-grid");
    const count   = document.getElementById("mat-count");
    if (!grid) return;
    const items   = getFilteredMatieres();
    if (count) count.textContent = `${items.length} matière${items.length > 1 ? "s" : ""} trouvée${items.length > 1 ? "s" : ""}`;

    if (items.length === 0) {
        grid.innerHTML = `<div class="mat-empty">😕 Aucune matière ne correspond à ta recherche.</div>`;
        return;
    }

    grid.innerHTML = items.map((m, i) => `
        <div class="mat-card reveal" data-id="${m.id}" style="animation-delay:${i * 0.05}s">
            <div class="mat-card-header" style="background:linear-gradient(135deg, ${m.couleur[0]}, ${m.couleur[1]})">
                <span class="mat-icon">${m.icon}</span>
                <span class="mat-cat-tag">${CATEGORIES.find(c => c.id === m.categorie)?.label || ""}</span>
            </div>
            <div class="mat-card-body">
                <h3>${m.titre}</h3>
                <p>${m.description}</p>
                <div class="mat-niveaux">
                    ${m.niveaux.map(n => `<span class="mat-niv">${n}</span>`).join("")}
                </div>
            </div>
            <div class="mat-card-footer">
                <button class="mat-btn-prog" data-id="${m.id}">📋 Programme</button>
                <button class="mat-btn-cours btn-primary" data-id="${m.id}">Cours →</button>
            </div>
        </div>
    `).join("");

    grid.querySelectorAll(".mat-btn-prog, .mat-btn-cours, .mat-card-header").forEach(el => {
        el.addEventListener("click", () => openMatiereDetail(el.closest("[data-id]")?.dataset.id || el.dataset.id));
    });

    setTimeout(() => initScrollReveal(), 50);
}

function bindMatSearch() {
    const input = document.getElementById("mat-search");
    const clear = document.getElementById("mat-search-clear");
    if (!input) return;
    input.addEventListener("input", () => {
        matCurrentSearch = input.value;
        clear?.classList.toggle("hidden", !input.value);
        renderMatGrid();
    });
    clear?.addEventListener("click", () => {
        input.value = ""; matCurrentSearch = "";
        clear.classList.add("hidden");
        renderMatGrid();
        input.focus();
    });
}

function bindMatCategories() {
    document.querySelectorAll(".mat-cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            matCurrentCat = btn.dataset.cat;
            document.querySelectorAll(".mat-cat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderMatGrid();
        });
    });
}

// ---- DETAIL MATIÈRE ----
function openMatiereDetail(id) {
    const m = MATIERES_DATA.find(x => x.id === id);
    if (!m) return;
    matCurrentDetail = m;
    matCurrentTab    = "programme";
    matCurrentNiveau = m.niveaux[0];
    navigateTo("matiere-detail");
}

function renderMatiereDetail() {
    const view = document.getElementById("view-matiere-detail");
    const m    = matCurrentDetail;
    if (!view || !m) { navigateTo("matieres"); return; }

    const tabs = [
        { id: "programme",      icon: "📋", label: "Programme" },
        { id: "ressources",     icon: "📄", label: "Ressources PDF" },
        { id: "videos",         icon: "🎬", label: "Vidéos" },
        { id: "devoirs",        icon: "✏️", label: "Devoirs" },
        { id: "quiz",           icon: "🎯", label: "Quiz" },
        { id: "telechargement", icon: "⬇️", label: "Télécharger" },
    ];

    view.innerHTML = `
        <!-- En-tête matière -->
        <div class="mat-detail-hero" style="background:linear-gradient(135deg, ${m.couleur[0]}, ${m.couleur[1]})">
            <button class="mat-back-btn" id="mat-back">← Retour aux matières</button>
            <div class="mat-detail-header">
                <span class="mat-detail-icon">${m.icon}</span>
                <div>
                    <div class="mat-detail-cat">${CATEGORIES.find(c => c.id === m.categorie)?.label}</div>
                    <h1>${m.titre}</h1>
                    <p>${m.description}</p>
                    <div class="mat-niveaux" style="margin-top:10px">
                        ${m.niveaux.map(n => `<span class="mat-niv mat-niv-white">${n}</span>`).join("")}
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mat-detail-tabs" id="mat-detail-tabs">
            ${tabs.map(t => `
                <button class="mat-detail-tab ${t.id === matCurrentTab ? "active" : ""}" data-tab="${t.id}">
                    ${t.icon} ${t.label}
                </button>`).join("")}
        </div>

        <!-- Contenu tab -->
        <div class="mat-detail-content" id="mat-detail-content">
            ${buildTabContent(m)}
        </div>
    `;

    document.getElementById("mat-back").addEventListener("click", () => navigateTo("matieres"));
    document.querySelectorAll(".mat-detail-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            matCurrentTab = btn.dataset.tab;
            document.querySelectorAll(".mat-detail-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("mat-detail-content").innerHTML = buildTabContent(m);
            bindTabEvents(m);
        });
    });
    bindTabEvents(m);
}

function buildTabContent(m) {
    switch (matCurrentTab) {
        case "programme":      return buildTabProgramme(m);
        case "ressources":     return buildTabRessources(m);
        case "videos":         return buildTabVideos(m);
        case "devoirs":        return buildTabDevoirs(m);
        case "quiz":           return buildTabQuiz(m);
        case "telechargement": return buildTabTelechargement(m);
        default:               return buildTabProgramme(m);
    }
}

function buildTabProgramme(m) {
    return `
    <div class="mat-prog-wrap">
        <div class="mat-prog-niveaux">
            ${m.niveaux.map(n => `
                <button class="mat-prog-niv-btn ${n === matCurrentNiveau ? "active" : ""}" data-niv="${n}">${n}</button>
            `).join("")}
        </div>
        <div class="mat-prog-list" id="mat-prog-list">
            ${(m.programme[matCurrentNiveau] || []).map((item, i) => `
                <div class="mat-prog-item reveal" style="animation-delay:${i*0.06}s">
                    <span class="mat-prog-num">${i + 1}</span>
                    <span>${item}</span>
                </div>`).join("")}
        </div>
    </div>`;
}

function buildTabRessources(m) {
    return `
    <div class="mat-ressources">
        <h3>📄 Ressources disponibles</h3>
        <div class="mat-res-grid">
            ${m.ressources.map(r => `
                <div class="mat-res-card">
                    <div class="mat-res-icon">📑</div>
                    <div class="mat-res-info">
                        <strong>${r.titre}</strong>
                        <span>${r.type.toUpperCase()} · ${r.taille}</span>
                    </div>
                    <button class="mat-res-dl" title="Télécharger">⬇️</button>
                </div>`).join("")}
        </div>
        ${m.ressources.length === 0 ? '<p class="mat-empty-small">Aucune ressource disponible pour le moment.</p>' : ""}
    </div>`;
}

function buildTabVideos(m) {
    return `
    <div class="mat-videos">
        <h3>🎬 Vidéos éducatives</h3>
        <div class="mat-vid-grid">
            ${m.videos.map(v => `
                <div class="mat-vid-card">
                    <div class="mat-vid-thumb" style="background:linear-gradient(135deg,${m.couleur[0]},${m.couleur[1]})">
                        <span class="mat-vid-play">▶</span>
                        <span class="mat-vid-dur">${v.duree}</span>
                    </div>
                    <div class="mat-vid-info">
                        <strong>${v.titre}</strong>
                        <span class="mat-niv">${v.niveau}</span>
                    </div>
                </div>`).join("")}
        </div>
        ${m.videos.length === 0 ? '<p class="mat-empty-small">Aucune vidéo disponible pour le moment.</p>' : ""}
        <div class="mat-vid-notice">
            💡 Les vidéos seront bientôt disponibles en streaming sur la plateforme.
        </div>
    </div>`;
}

function buildTabDevoirs(m) {
    const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
    if (!user) return `<div class="mat-login-prompt">🔒 <a href="#" id="mat-login-link">Connecte-toi</a> pour voir tes devoirs.</div>`;
    return `
    <div class="mat-devoirs">
        <h3>✏️ Devoirs à rendre</h3>
        ${m.devoirs.length === 0
            ? '<div class="mat-empty-small">✅ Aucun devoir en attente pour cette matière.</div>'
            : m.devoirs.map(d => `
                <div class="mat-devoir-item ${d.rendu ? "rendu" : ""}">
                    <div class="mat-dv-status">${d.rendu ? "✅" : "⏳"}</div>
                    <div class="mat-dv-info">
                        <strong>${d.titre}</strong>
                        <span>Échéance : ${d.echeance}</span>
                    </div>
                    <span class="mat-dv-badge ${d.rendu ? "badge-ok" : "badge-todo"}">${d.rendu ? "Rendu" : "À rendre"}</span>
                </div>`).join("")}
    </div>`;
}

function buildTabQuiz(m) {
    const relatedQuiz = typeof QUIZZES !== "undefined"
        ? QUIZZES.filter(q => q.subject === m.id)
        : [];
    return `
    <div class="mat-quiz-section">
        <h3>🎯 Quiz interactifs</h3>
        ${relatedQuiz.length > 0
            ? `<div class="mat-quiz-list">
                ${relatedQuiz.map(q => `
                    <div class="mat-quiz-item">
                        <span>${q.title}</span>
                        <button class="btn-primary" data-qid="${q.id}">Commencer</button>
                    </div>`).join("")}
               </div>`
            : `<div class="mat-empty-small">Quiz bientôt disponibles pour ${m.titre}.</div>`}
        <div class="mat-quiz-cta">
            <button class="btn-secondary" onclick="navigateTo('quiz')">Voir tous les quiz →</button>
        </div>
    </div>`;
}

function buildTabTelechargement(m) {
    return `
    <div class="mat-dl-section">
        <h3>⬇️ Télécharger les cours</h3>
        <div class="mat-dl-grid">
            ${m.niveaux.map(n => `
                <div class="mat-dl-card">
                    <div class="mat-dl-icon">📦</div>
                    <div>
                        <strong>${m.titre} — ${n}</strong>
                        <span>Tous les cours, fiches et exercices</span>
                    </div>
                    <button class="mat-dl-btn" onclick="showToast('Téléchargement bientôt disponible !','info')">⬇️ Télécharger</button>
                </div>`).join("")}
        </div>
        <div class="mat-dl-notice">
            📱 Les fichiers sont optimisés pour une utilisation hors-ligne sur mobile.
        </div>
    </div>`;
}

function bindTabEvents(m) {
    document.querySelectorAll(".mat-prog-niv-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            matCurrentNiveau = btn.dataset.niv;
            document.querySelectorAll(".mat-prog-niv-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const list = document.getElementById("mat-prog-list");
            if (list) list.innerHTML = (m.programme[matCurrentNiveau] || []).map((item, i) => `
                <div class="mat-prog-item reveal" style="animation-delay:${i*0.06}s">
                    <span class="mat-prog-num">${i + 1}</span>
                    <span>${item}</span>
                </div>`).join("");
            initScrollReveal();
        });
    });
    const loginLink = document.getElementById("mat-login-link");
    if (loginLink) loginLink.addEventListener("click", e => { e.preventDefault(); openAuthModal(); });
    document.querySelectorAll("[data-qid]").forEach(btn => {
        btn.addEventListener("click", () => { navigateTo("quiz"); startQuiz(btn.dataset.qid); });
    });
    initScrollReveal();
}

// ---- ESPACES UTILISATEURS ----
function renderEspaces() {
    const view = document.getElementById("view-espaces");
    if (!view) return;
    const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

    view.innerHTML = `
        <div class="esp-hero">
            <div class="esp-hero-content">
                <h1>Espaces <span class="mat-gradient-text">Utilisateurs</span></h1>
                <p>Accédez à votre espace personnalisé selon votre profil.</p>
            </div>
        </div>
        <div class="esp-tabs-bar" id="esp-tabs-bar">
            <button class="esp-tab ${matEspaceTab==="eleve"?"active":""}" data-esp="eleve">🎓 Espace Élève</button>
            <button class="esp-tab ${matEspaceTab==="prof"?"active":""}" data-esp="prof">👨‍🏫 Espace Professeur</button>
            <button class="esp-tab ${matEspaceTab==="parent"?"active":""}" data-esp="parent">👨‍👩‍👧 Espace Parent</button>
        </div>
        <div id="esp-content">${buildEspaceContent(user)}</div>
    `;
    document.querySelectorAll(".esp-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            matEspaceTab = btn.dataset.esp;
            document.querySelectorAll(".esp-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("esp-content").innerHTML = buildEspaceContent(user);
            initScrollReveal();
        });
    });
    initScrollReveal();
}

function buildEspaceContent(user) {
    if (!user) return buildEspaceLogin();
    switch (matEspaceTab) {
        case "eleve":  return buildEspaceEleve(user);
        case "prof":   return buildEspaceProf(user);
        case "parent": return buildEspaceParent(user);
        default:       return buildEspaceEleve(user);
    }
}

function buildEspaceLogin() {
    return `
    <div class="esp-login-prompt">
        <div class="esp-login-card">
            <div style="font-size:3rem;margin-bottom:16px">🔐</div>
            <h2>Connexion requise</h2>
            <p>Connecte-toi à ton compte EduGuyane pour accéder à ton espace personnalisé.</p>
            <button class="btn-primary" style="margin-top:16px" onclick="openAuthModal()">Se connecter</button>
            <p style="margin-top:12px;font-size:0.85rem;color:#94a3b8">Pas encore de compte ? <a href="#" onclick="openAuthModal()" style="color:var(--green)">Créer un compte</a></p>
        </div>
    </div>`;
}

function buildEspaceEleve(user) {
    const moy = (DEMO_NOTES.reduce((s, n) => s + n.note * n.coeff, 0) / DEMO_NOTES.reduce((s, n) => s + n.coeff, 0)).toFixed(1);
    const totalDevoirs = MATIERES_DATA.flatMap(m => m.devoirs).filter(d => !d.rendu).length;

    return `
    <div class="esp-dashboard">
        <!-- Bienvenue -->
        <div class="esp-welcome">
            <span style="font-size:2.5rem">${user.avatar}</span>
            <div>
                <h2>Bonjour, ${user.name} ! 👋</h2>
                <p>Voici un aperçu de ta progression</p>
            </div>
        </div>

        <!-- KPIs -->
        <div class="esp-kpis">
            <div class="esp-kpi" style="border-top:4px solid #2563eb">
                <span class="esp-kpi-icon">📊</span>
                <strong>${moy}</strong>
                <small>Moyenne générale</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #ea580c">
                <span class="esp-kpi-icon">✏️</span>
                <strong>${totalDevoirs}</strong>
                <small>Devoirs à rendre</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #16a34a">
                <span class="esp-kpi-icon">📝</span>
                <strong>${Object.keys((typeof state !== "undefined" ? state.quizDone : {})).length}</strong>
                <small>Quiz complétés</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #7c3aed">
                <span class="esp-kpi-icon">💬</span>
                <strong>${DEMO_MESSAGES.filter(m => !m.lu).length}</strong>
                <small>Messages non lus</small>
            </div>
        </div>

        <div class="esp-cols">
            <!-- Notes -->
            <div class="esp-card">
                <h3>📊 Mes dernières notes</h3>
                <div class="esp-notes-list">
                    ${DEMO_NOTES.map(n => {
                        const color = n.note >= 14 ? "#16a34a" : n.note >= 10 ? "#f59e0b" : "#dc2626";
                        const w     = Math.round((n.note / 20) * 100);
                        return `<div class="esp-note-row">
                            <span class="esp-note-mat">${n.matiere}</span>
                            <div class="esp-note-bar-wrap">
                                <div class="esp-note-bar" style="width:${w}%;background:${color}"></div>
                            </div>
                            <span class="esp-note-val" style="color:${color}">${n.note}/20</span>
                        </div>`;
                    }).join("")}
                </div>
            </div>

            <!-- Emploi du temps -->
            <div class="esp-card">
                <h3>📅 Emploi du temps — semaine</h3>
                <div class="esp-edt">
                    ${DEMO_EMPLOI.map(j => `
                        <div class="esp-edt-jour">
                            <div class="esp-edt-day">${j.jour}</div>
                            <div class="esp-edt-cours">
                                ${j.cours.map(c => `
                                    <div class="esp-cours-item">
                                        <span class="esp-cours-h">${c.h}</span>
                                        <span class="esp-cours-mat">${c.mat}</span>
                                        <span class="esp-cours-salle">${c.salle}</span>
                                    </div>`).join("")}
                            </div>
                        </div>`).join("")}
                </div>
            </div>
        </div>

        <!-- Messagerie -->
        <div class="esp-card esp-msgs">
            <h3>💬 Messagerie scolaire</h3>
            <div class="esp-msg-list">
                ${DEMO_MESSAGES.map(m => `
                    <div class="esp-msg-item ${m.lu ? "" : "non-lu"}">
                        <div class="esp-msg-dot ${m.lu ? "lu" : ""}"></div>
                        <div class="esp-msg-content">
                            <strong>${m.de}</strong>
                            <span>${m.objet}</span>
                        </div>
                        <span class="esp-msg-date">${m.date}</span>
                    </div>`).join("")}
            </div>
            <button class="btn-secondary" style="margin-top:12px;width:100%" onclick="showToast('Messagerie complète bientôt disponible !','info')">
                Voir tous les messages →
            </button>
        </div>
    </div>`;
}

function buildEspaceProf(user) {
    return `
    <div class="esp-dashboard">
        <div class="esp-welcome">
            <span style="font-size:2.5rem">👨‍🏫</span>
            <div>
                <h2>Espace Professeur</h2>
                <p>Gérez vos cours, devoirs et communications avec les élèves et parents.</p>
            </div>
        </div>
        <div class="esp-kpis">
            <div class="esp-kpi" style="border-top:4px solid #2563eb">
                <span class="esp-kpi-icon">👥</span><strong>124</strong><small>Élèves suivis</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #16a34a">
                <span class="esp-kpi-icon">📚</span><strong>5</strong><small>Classes</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #ea580c">
                <span class="esp-kpi-icon">✏️</span><strong>8</strong><small>Devoirs actifs</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #7c3aed">
                <span class="esp-kpi-icon">💬</span><strong>3</strong><small>Messages</small>
            </div>
        </div>
        <div class="esp-prof-actions">
            ${[
                ["📋 Créer un devoir", "info"],
                ["📊 Saisir les notes", "info"],
                ["📅 Mon emploi du temps", "info"],
                ["💬 Messagerie", "info"],
                ["📄 Déposer une ressource", "info"],
                ["🎯 Créer un quiz", "info"],
            ].map(([label, t]) => `
                <button class="esp-action-btn" onclick="showToast('${label} — disponible prochainement','${t}')">
                    ${label}
                </button>`).join("")}
        </div>
        <div class="esp-card" style="margin-top:20px">
            <h3>ℹ️ Fonctionnalités à venir</h3>
            <p style="color:#64748b;font-size:0.9rem;line-height:1.6">L'espace professeur complet avec gestion des notes, devoirs, messagerie et emploi du temps sera disponible dans la prochaine mise à jour de la plateforme.</p>
        </div>
    </div>`;
}

function buildEspaceParent(user) {
    const moy = (DEMO_NOTES.reduce((s, n) => s + n.note * n.coeff, 0) / DEMO_NOTES.reduce((s, n) => s + n.coeff, 0)).toFixed(1);
    return `
    <div class="esp-dashboard">
        <div class="esp-welcome">
            <span style="font-size:2.5rem">👨‍👩‍👧</span>
            <div>
                <h2>Espace Parent</h2>
                <p>Suivez la scolarité et la progression de votre enfant.</p>
            </div>
        </div>
        <div class="esp-kpis">
            <div class="esp-kpi" style="border-top:4px solid #2563eb">
                <span class="esp-kpi-icon">📊</span><strong>${moy}</strong><small>Moyenne générale</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #16a34a">
                <span class="esp-kpi-icon">✅</span><strong>94%</strong><small>Assiduité</small>
            </div>
            <div class="esp-kpi" style="border-top:4px solid #ea580c">
                <span class="esp-kpi-icon">✏️</span><strong>${MATIERES_DATA.flatMap(m=>m.devoirs).filter(d=>!d.rendu).length}</strong><small>Devoirs en cours</small>
            </div>
        </div>
        <div class="esp-card">
            <h3>📊 Bulletin simplifié</h3>
            <div class="esp-notes-list">
                ${DEMO_NOTES.map(n => {
                    const c = n.note >= 14 ? "#16a34a" : n.note >= 10 ? "#f59e0b" : "#dc2626";
                    return `<div class="esp-note-row">
                        <span class="esp-note-mat">${n.matiere}</span>
                        <div class="esp-note-bar-wrap"><div class="esp-note-bar" style="width:${Math.round(n.note/20*100)}%;background:${c}"></div></div>
                        <span class="esp-note-val" style="color:${c}">${n.note}/20</span>
                    </div>`;
                }).join("")}
            </div>
        </div>
        <div class="esp-card" style="margin-top:16px">
            <h3>💬 Contacter un professeur</h3>
            <p style="color:#64748b;font-size:0.9rem;margin-bottom:12px">Envoyer un message directement à l'équipe pédagogique.</p>
            <button class="btn-primary" onclick="showToast('Messagerie parent disponible prochainement','info')">Envoyer un message</button>
        </div>
    </div>`;
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
}
