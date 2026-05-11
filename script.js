// ============================================================
// AVATARS
// ============================================================
const AVATARS = ["🎓","👨‍🎓","👩‍🎓","🦁","🐯","🦊","🐻","🐼","🦋","🌺","⭐","🚀","🌊","🦜","🐸","🌴","🔥","💡","🎯","🏆"];

// ============================================================
// STATE — par utilisateur
// ============================================================
let currentView = "accueil";
let currentSubject = "maths";
let currentQuiz = null;
let currentQuestion = 0;
let quizAnswers = [];
let forumFilter = "all";
let selectedAvatar = "🎓";

const state = {
    quizDone: {},
    lessonsRead: {},
};

function loadState() {
    const user = getCurrentUser();
    const saved = getUserProgress(user ? user.id : null);
    Object.assign(state, saved);
}

function saveState() {
    const user = getCurrentUser();
    saveUserProgress(user ? user.id : null, state);
}

function resetState() {
    state.quizDone = {};
    state.lessonsRead = {};
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(view) {
    if (view === "admin") {
        const user = getCurrentUser();
        if (!user || user.role !== "admin") {
            openAuthModal();
            return;
        }
    }
    if (view === "profil") {
        if (!getCurrentUser()) { openAuthModal(); return; }
    }

    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    const el = document.getElementById(`view-${view}`);
    if (el) {
        el.style.animation = "none";
        void el.offsetHeight;
        el.style.animation = "";
        el.classList.add("active");
    }
    const link = document.querySelector(`.nav-link[data-view="${view}"]`);
    if (link) link.classList.add("active");

    currentView = view;
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeUserDropdown();
    closeNav();

    if (view === "cours")       renderCoursList();
    if (view === "quiz")        renderQuizGrid();
    if (view === "progression") renderProgression();
    if (view === "forum")       renderForum();
    if (view === "accueil")     updateHeroStats();
    if (view === "profil")      renderProfile();
    if (view === "admin")       renderAdmin();
}

function closeNav() {
    document.getElementById("nav").classList.remove("open");
    document.getElementById("burger").classList.remove("active");
}

// ============================================================
// AUTH UI
// ============================================================
function renderHeaderAuth() {
    const user = getCurrentUser();
    const loginBtn  = document.getElementById("btn-login");
    const userMenu  = document.getElementById("user-menu");
    const adminLink = document.getElementById("ud-admin-link");

    if (user) {
        loginBtn.classList.add("hidden");
        userMenu.classList.remove("hidden");
        document.getElementById("user-avatar-hdr").textContent = user.avatar;
        document.getElementById("user-name-hdr").textContent   = user.name;
        if (user.role === "admin") adminLink.classList.remove("hidden");
        else                       adminLink.classList.add("hidden");
    } else {
        loginBtn.classList.remove("hidden");
        userMenu.classList.add("hidden");
    }
}

function openAuthModal() {
    document.getElementById("auth-modal").classList.remove("hidden");
    switchAuthTab("login");
    document.getElementById("login-username").focus();
}

function closeAuthModal() {
    document.getElementById("auth-modal").classList.add("hidden");
    document.getElementById("login-error").classList.add("hidden");
    document.getElementById("reg-error").classList.add("hidden");
}

function switchAuthTab(tab) {
    document.querySelectorAll(".auth-tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.atab === tab);
    });
    document.getElementById("auth-login-form").classList.toggle("hidden",    tab !== "login");
    document.getElementById("auth-register-form").classList.toggle("hidden", tab !== "register");
    if (tab === "register") renderAvatarGrid("avatar-grid-reg");
}

function handleLogin() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const errEl = document.getElementById("login-error");
    const user = authLogin(username, password);
    if (!user) {
        errEl.textContent = "Identifiants incorrects.";
        errEl.classList.remove("hidden");
        return;
    }
    errEl.classList.add("hidden");
    resetState();
    loadState();
    closeAuthModal();
    renderHeaderAuth();
    updateHeroStats();
    if (currentView === "progression") renderProgression();
    if (currentView === "quiz") renderQuizGrid();
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    showToast(`Bienvenue ${user.name} !`, "success");
}

function handleRegister() {
    const username = document.getElementById("reg-username").value.trim();
    const name     = document.getElementById("reg-name").value.trim();
    const password = document.getElementById("reg-password").value;
    const errEl    = document.getElementById("reg-error");
    const result   = authRegister(username, name, password, selectedAvatar);
    if (result.error) {
        errEl.textContent = result.error;
        errEl.classList.remove("hidden");
        return;
    }
    errEl.classList.add("hidden");
    // Auto-login after register
    authLogin(username, password);
    resetState();
    loadState();
    closeAuthModal();
    renderHeaderAuth();
    document.getElementById("reg-username").value = "";
    document.getElementById("reg-name").value = "";
    document.getElementById("reg-password").value = "";
}

function handleLogout() {
    authLogout();
    resetState();
    loadState();
    renderHeaderAuth();
    updateHeroStats();
    if (currentView === "profil" || currentView === "admin") navigateTo("accueil");
    if (currentView === "progression") renderProgression();
    if (currentView === "quiz") renderQuizGrid();
    closeUserDropdown();
    showToast("À bientôt !", "info");
}

function closeUserDropdown() {
    document.getElementById("user-dropdown").classList.add("hidden");
}

// ============================================================
// AVATAR GRID
// ============================================================
function renderAvatarGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = AVATARS.map(av => `
        <button class="avatar-opt ${av === selectedAvatar ? "selected" : ""}" data-av="${av}">${av}</button>
    `).join("");
    container.querySelectorAll(".avatar-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedAvatar = btn.dataset.av;
            document.querySelectorAll(".avatar-opt").forEach(b => b.classList.remove("selected"));
            document.querySelectorAll(`.avatar-opt[data-av="${selectedAvatar}"]`).forEach(b => b.classList.add("selected"));
        });
    });
}

// ============================================================
// PROFIL
// ============================================================
function renderProfile() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("profile-avatar-display").textContent   = user.avatar;
    document.getElementById("profile-display-name").textContent     = user.name;
    document.getElementById("profile-username-display").textContent = `@${user.username}`;
    const roleBadge = document.getElementById("profile-role-badge");
    roleBadge.textContent = user.role === "admin" ? "🛠️ Administrateur" : "🎓 Élève";
    roleBadge.className = "profile-role-badge " + (user.role === "admin" ? "admin" : "");

    const prog = state;
    const done = Object.values(prog.quizDone || {});
    const totalQ = done.reduce((s, d) => s + d.total, 0);
    const totalS = done.reduce((s, d) => s + d.score, 0);
    document.getElementById("pm-quiz").textContent    = done.length;
    document.getElementById("pm-lessons").textContent = Object.keys(prog.lessonsRead || {}).length;
    document.getElementById("pm-score").textContent   = totalQ > 0 ? Math.round((totalS / totalQ) * 100) + "%" : "—";

    document.getElementById("edit-name").value    = user.name;
    selectedAvatar = user.avatar;
    renderAvatarGrid("avatar-grid-profile");
}

function saveProfile() {
    const user = getCurrentUser();
    if (!user) return;
    const name     = document.getElementById("edit-name").value.trim();
    const password = document.getElementById("edit-password").value;
    const changes  = {};
    if (name)     changes.name     = name;
    if (password) changes.password = password;
    changes.avatar = selectedAvatar;

    updateUserProfile(user.id, changes);
    const successEl = document.getElementById("edit-success");
    successEl.classList.remove("hidden");
    setTimeout(() => successEl.classList.add("hidden"), 3000);
    renderHeaderAuth();
    renderProfile();
    document.getElementById("edit-password").value = "";
}

// ============================================================
// COURS
// ============================================================
function renderCoursList() {
    const list   = document.getElementById("cours-list");
    const detail = document.getElementById("lesson-detail");
    list.classList.remove("hidden");
    detail.classList.add("hidden");

    const lessons = COURSES.filter(c => c.subject === currentSubject);
    list.innerHTML = lessons.map(l => `
        <div class="lesson-card ${state.lessonsRead[l.id] ? "read" : ""}" data-id="${l.id}">
            <div class="lc-left">
                <span class="lc-icon">${SUBJECTS[l.subject].icon}</span>
                <div>
                    <h4>${l.title}</h4>
                    <p>${l.summary}</p>
                    <div class="lc-meta">
                        <span class="tag">${l.level}</span>
                        <span class="tag">⏱ ${l.duration}</span>
                        ${state.lessonsRead[l.id] ? '<span class="tag tag-done">✓ Lu</span>' : ""}
                    </div>
                </div>
            </div>
            <button class="btn-sm">Lire →</button>
        </div>
    `).join("") || `<p class="empty-msg">Aucune leçon disponible pour cette matière pour l'instant.</p>`;

    staggerIn(list, ".lesson-card");

    list.querySelectorAll(".lesson-card").forEach(card => {
        card.addEventListener("click", () => openLesson(card.dataset.id));
    });
}

function openLesson(id) {
    const lesson = COURSES.find(c => c.id === id);
    if (!lesson) return;
    state.lessonsRead[lesson.id] = true;
    saveState();
    document.getElementById("cours-list").classList.add("hidden");
    const detail = document.getElementById("lesson-detail");
    detail.classList.remove("hidden");
    document.getElementById("lesson-content").innerHTML = lesson.content;
}

// ============================================================
// QUIZ
// ============================================================
function renderQuizGrid() {
    document.getElementById("quiz-home").classList.remove("hidden");
    document.getElementById("quiz-runner").classList.add("hidden");
    document.getElementById("quiz-result").classList.add("hidden");

    const grid = document.getElementById("quiz-grid");
    grid.innerHTML = QUIZZES.map(q => {
        const done = state.quizDone[q.id];
        const pct  = done ? Math.round((done.score / done.total) * 100) : null;
        const color = pct !== null ? (pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444") : null;
        return `
        <div class="quiz-item-card">
            <div class="qic-top">
                <span class="qic-icon">${SUBJECTS[q.subject].icon}</span>
                <span class="qic-subject">${SUBJECTS[q.subject].label}</span>
            </div>
            <h4>${q.title}</h4>
            <p>${q.questions.length} questions</p>
            ${done
                ? `<div class="qic-score" style="color:${color}">${pct}% — ${done.score}/${done.total}</div>`
                : `<div class="qic-score qic-new">Pas encore fait</div>`}
            <button class="btn-primary" data-qid="${q.id}">${done ? "Recommencer" : "Commencer"}</button>
        </div>`;
    }).join("");

    staggerIn(grid, ".quiz-item-card");

    grid.querySelectorAll("[data-qid]").forEach(btn => {
        btn.addEventListener("click", () => startQuiz(btn.dataset.qid));
    });
}

function startQuiz(id) {
    currentQuiz = QUIZZES.find(q => q.id === id);
    if (!currentQuiz) return;
    currentQuestion = 0;
    quizAnswers = [];
    document.getElementById("quiz-home").classList.add("hidden");
    document.getElementById("quiz-result").classList.add("hidden");
    document.getElementById("quiz-runner").classList.remove("hidden");
    renderQuestion();
}

function renderQuestion() {
    const q     = currentQuiz.questions[currentQuestion];
    const total = currentQuiz.questions.length;
    document.getElementById("quiz-subject-label").textContent = `${SUBJECTS[currentQuiz.subject].icon} ${SUBJECTS[currentQuiz.subject].label}`;
    document.getElementById("quiz-counter").textContent       = `${currentQuestion + 1} / ${total}`;
    document.getElementById("quiz-bar").style.width           = `${(currentQuestion / total) * 100}%`;
    const qEl = document.getElementById("quiz-question");
    qEl.classList.remove("quiz-q-enter");
    void qEl.offsetWidth;
    qEl.textContent = q.q;
    qEl.classList.add("quiz-q-enter");
    document.getElementById("quiz-feedback").classList.add("hidden");
    document.getElementById("quiz-next").style.display        = "none";

    const visualEl = document.getElementById("quiz-visual");
    visualEl.onclick = null;
    if (q.visual) {
        visualEl.innerHTML = q.visual;
        visualEl.classList.remove("hidden");
        visualEl.onclick = function(e) {
            const zone = e.target.closest("[data-quiz-idx]");
            if (!zone) return;
            answerQuestion(parseInt(zone.dataset.quizIdx));
        };
    } else {
        visualEl.innerHTML = "";
        visualEl.classList.add("hidden");
    }

    const opts = document.getElementById("quiz-options");
    opts.innerHTML = q.options.map((o, i) => `<button class="quiz-opt" data-idx="${i}">${o}</button>`).join("");
    opts.querySelectorAll(".quiz-opt").forEach(btn => {
        btn.addEventListener("click", () => answerQuestion(parseInt(btn.dataset.idx)));
    });
}

function answerQuestion(chosen) {
    const q       = currentQuiz.questions[currentQuestion];
    const correct = chosen === q.answer;
    quizAnswers.push({ chosen, correct });

    document.querySelectorAll(".quiz-opt").forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer)           btn.classList.add("correct");
        else if (i === chosen && !correct) btn.classList.add("wrong");
    });

    const visualEl = document.getElementById("quiz-visual");
    visualEl.querySelectorAll(".qz").forEach(zone => {
        zone.style.pointerEvents = "none";
        const idx = parseInt(zone.dataset.quizIdx);
        if (idx === q.answer)              zone.classList.add("vz-ok");
        else if (idx === chosen && !correct) zone.classList.add("vz-ko");
        else                               zone.classList.add("vz-dim");
    });

    const fb = document.getElementById("quiz-feedback");
    fb.classList.remove("hidden", "fb-correct", "fb-wrong");
    fb.classList.add(correct ? "fb-correct" : "fb-wrong");
    fb.innerHTML = `${correct ? "✅ Bonne réponse !" : "❌ Mauvaise réponse."}<br><em>${q.explication}</em>`;

    const nextBtn = document.getElementById("quiz-next");
    nextBtn.style.display = "block";
    nextBtn.textContent = currentQuestion + 1 < currentQuiz.questions.length ? "Question suivante →" : "Voir les résultats";
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < currentQuiz.questions.length) renderQuestion();
    else showQuizResult();
}

function showQuizResult() {
    const score = quizAnswers.filter(a => a.correct).length;
    const total = currentQuiz.questions.length;
    const pct   = Math.round((score / total) * 100);

    state.quizDone[currentQuiz.id] = { score, total, date: new Date().toLocaleDateString("fr-FR") };
    saveState();

    document.getElementById("quiz-runner").classList.add("hidden");
    document.getElementById("quiz-result").classList.remove("hidden");

    const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚";
    const title = pct === 100 ? "Parfait !" : pct >= 80 ? "Très bien !" : pct >= 50 ? "Pas mal !" : "Continue à réviser !";

    launchConfetti(pct);
    showToast(
        pct === 100 ? "🏆 Score parfait !" : pct >= 80 ? "🎉 Excellent résultat !" : pct >= 50 ? "👍 Pas mal, continue !" : "📚 Révise et recommence !",
        pct >= 80 ? "success" : pct >= 50 ? "info" : "warn"
    );
    setTimeout(() => {
        const rc = document.querySelector(".result-card");
        if (rc) { rc.classList.remove("result-card-anim"); void rc.offsetWidth; rc.classList.add("result-card-anim"); }
    }, 50);
    document.getElementById("result-emoji").textContent = emoji;
    document.getElementById("result-title").textContent = title;
    document.getElementById("result-score").textContent = `${score} / ${total} bonnes réponses (${pct}%)`;

    document.getElementById("result-details").innerHTML = currentQuiz.questions.map((q, i) => {
        const a = quizAnswers[i];
        return `<div class="rd-item ${a.correct ? "rd-ok" : "rd-ko"}">${a.correct ? "✅" : "❌"} ${q.q}</div>`;
    }).join("");
}

// ============================================================
// PROGRESSION
// ============================================================
function renderProgression() {
    const done         = Object.values(state.quizDone);
    const totalDone    = done.length;
    const totalCorrect = done.reduce((s, d) => s + d.score, 0);
    const totalQ       = done.reduce((s, d) => s + d.total, 0);
    const accuracy     = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : null;
    const pct          = Math.round((totalDone / QUIZZES.length) * 100);

    animateCount(document.getElementById("ps-quiz-done"), totalDone);
    animateCount(document.getElementById("ps-correct"), totalCorrect);
    if (accuracy !== null) animateCount(document.getElementById("ps-accuracy"), accuracy, 1000, "%");
    else document.getElementById("ps-accuracy").textContent = "—";
    animateCount(document.getElementById("prog-pct"), pct, 1200, "%");

    const arc = document.getElementById("prog-arc");
    arc.style.strokeDashoffset = 314 - (pct / 100) * 314;
    document.getElementById("stat-progress").textContent = `${pct}%`;

    const bySubject = {};
    QUIZZES.forEach(q => {
        if (state.quizDone[q.id]) {
            if (!bySubject[q.subject]) bySubject[q.subject] = { score: 0, total: 0 };
            bySubject[q.subject].score += state.quizDone[q.id].score;
            bySubject[q.subject].total += state.quizDone[q.id].total;
        }
    });
    let bestSub = null, bestPct = 0;
    Object.entries(bySubject).forEach(([sub, v]) => {
        const p = v.total > 0 ? (v.score / v.total) * 100 : 0;
        if (p > bestPct) { bestPct = p; bestSub = sub; }
    });
    document.getElementById("ps-best").textContent = bestSub ? `${SUBJECTS[bestSub].icon} ${SUBJECTS[bestSub].label}` : "—";

    document.getElementById("subject-bars").innerHTML = Object.keys(SUBJECTS).map(sub => {
        const subDone  = QUIZZES.filter(q => q.subject === sub && state.quizDone[q.id]);
        const subScore = subDone.reduce((s, q) => s + state.quizDone[q.id].score, 0);
        const subTotal = subDone.reduce((s, q) => s + state.quizDone[q.id].total, 0);
        const subPct   = subTotal > 0 ? Math.round((subScore / subTotal) * 100) : 0;
        return `
        <div class="sub-bar-row">
            <span class="sb-label">${SUBJECTS[sub].icon} ${SUBJECTS[sub].label}</span>
            <div class="sb-bar-wrap"><div class="sb-bar" style="width:${subPct}%;background:${SUBJECTS[sub].color}"></div></div>
            <span class="sb-pct">${subDone.length > 0 ? subPct + "%" : "—"}</span>
        </div>`;
    }).join("");

    const badges = [
        { icon: "🎯", name: "Premier quiz",   desc: "Terminer son 1er quiz",            unlocked: totalDone >= 1 },
        { icon: "💯", name: "Parfait !",       desc: "Obtenir 100% dans un quiz",        unlocked: done.some(d => d.score === d.total) },
        { icon: "📚", name: "Érudit",          desc: "Terminer 5 quiz",                  unlocked: totalDone >= 5 },
        { icon: "🏆", name: "Champion",        desc: "Terminer tous les quiz",           unlocked: totalDone >= QUIZZES.length },
        { icon: "🌿", name: "Guyanais",        desc: "Réussir le quiz Guyane à 80%+",    unlocked: state.quizDone["qhg1"] && (state.quizDone["qhg1"].score / state.quizDone["qhg1"].total) >= 0.8 },
        { icon: "📐", name: "Mathématicien",   desc: "Réussir tous les quiz de maths",   unlocked: QUIZZES.filter(q => q.subject === "maths").every(q => state.quizDone[q.id]) },
    ];
    document.getElementById("badges-grid").innerHTML = badges.map(b => `
        <div class="badge-card ${b.unlocked ? "unlocked" : "locked"}">
            <div class="badge-icon">${b.unlocked ? b.icon : "🔒"}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
        </div>`).join("");
}

// ============================================================
// FORUM
// ============================================================
function renderForum() {
    const search = document.getElementById("forum-search").value.toLowerCase();
    const posts  = FORUM_POSTS
        .filter(p => forumFilter === "all" || p.cat === forumFilter)
        .filter(p => !search || p.title.toLowerCase().includes(search) || p.body.toLowerCase().includes(search));

    const catLabels = {
        maths: "📐 Maths", francais: "📖 Français", histgeo: "🗺️ Histoire-Géo",
        svt: "🌿 SVT", physchim: "⚗️ Physique-Chimie", anglais: "🌍 Anglais", autre: "💬 Autre"
    };
    const user = getCurrentUser();
    const isAdmin = user && user.role === "admin";

    const forumPostsEl = document.getElementById("forum-posts");
    forumPostsEl.innerHTML = posts.length ? posts.map(p => `
        <div class="forum-post">
            <div class="fp-header">
                <span class="fp-cat">${catLabels[p.cat] || p.cat}</span>
                <div style="display:flex;align-items:center;gap:8px">
                    <span class="fp-date">${p.date}</span>
                    ${isAdmin ? `<button class="fp-delete" data-id="${p.id}" title="Supprimer">🗑️</button>` : ""}
                </div>
            </div>
            <h3 class="fp-title">${escapeHtml(p.title)}</h3>
            <p class="fp-body">${escapeHtml(p.body)}</p>
            <div class="fp-footer">
                <span class="fp-author">👤 ${escapeHtml(p.author)}</span>
                <button class="fp-like" data-id="${p.id}">❤️ ${p.likes}</button>
                <span class="fp-replies-count">💬 ${p.replies.length} réponse${p.replies.length !== 1 ? "s" : ""}</span>
            </div>
            ${p.replies.length ? `
            <div class="fp-replies-list">
                ${p.replies.map(r => `
                    <div class="fp-reply">
                        <strong>${escapeHtml(r.author)}</strong>
                        <span class="reply-date">${r.date}</span>
                        <p>${escapeHtml(r.text)}</p>
                    </div>`).join("")}
            </div>` : ""}
        </div>`).join("") : `<p class="empty-msg">Aucune discussion trouvée.</p>`;

    staggerIn(forumPostsEl, ".forum-post");

    document.querySelectorAll(".fp-like").forEach(btn => {
        btn.addEventListener("click", () => {
            const post = FORUM_POSTS.find(p => p.id === parseInt(btn.dataset.id));
            if (post) { post.likes++; renderForum(); }
        });
    });
    document.querySelectorAll(".fp-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = FORUM_POSTS.findIndex(p => p.id === parseInt(btn.dataset.id));
            if (idx !== -1) {
                FORUM_POSTS.splice(idx, 1);
                renderForum();
                showToast("Discussion supprimée.", "info");
            }
        });
    });
}

function addPost(author, cat, title, body) {
    FORUM_POSTS.unshift({
        id: Date.now(), author, cat, title, body,
        date: new Date().toLocaleDateString("fr-FR"),
        likes: 0, replies: []
    });
    renderForum();
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ============================================================
// ADMIN
// ============================================================
let currentAdminTab = "overview";

function renderAdmin() {
    switchAdminTab(currentAdminTab);
}

function switchAdminTab(tab) {
    currentAdminTab = tab;
    document.querySelectorAll(".admin-tab").forEach(b => b.classList.toggle("active", b.dataset.atab === tab));
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
    document.getElementById(`admin-${tab}`).classList.add("active");

    if (tab === "overview") renderAdminOverview();
    if (tab === "users")    renderAdminUsers();
    if (tab === "forum")    renderAdminForum();
}

function renderAdminOverview() {
    const users    = getAllUsersWithStats();
    const allDone  = users.reduce((s, u) => s + u.quizCount, 0);
    const allLess  = users.reduce((s, u) => s + u.lessonsRead, 0);
    const el = document.getElementById("admin-overview");
    el.innerHTML = `
    <div class="admin-stats-grid">
        <div class="admin-stat-card">
            <div class="asc-icon">👥</div>
            <div class="asc-val">${users.length}</div>
            <div class="asc-label">Utilisateurs inscrits</div>
        </div>
        <div class="admin-stat-card">
            <div class="asc-icon">📝</div>
            <div class="asc-val">${allDone}</div>
            <div class="asc-label">Quiz complétés (total)</div>
        </div>
        <div class="admin-stat-card">
            <div class="asc-icon">📖</div>
            <div class="asc-val">${allLess}</div>
            <div class="asc-label">Leçons lues (total)</div>
        </div>
        <div class="admin-stat-card">
            <div class="asc-icon">💬</div>
            <div class="asc-val">${FORUM_POSTS.length}</div>
            <div class="asc-label">Discussions forum</div>
        </div>
        <div class="admin-stat-card">
            <div class="asc-icon">📚</div>
            <div class="asc-val">${COURSES.length}</div>
            <div class="asc-label">Leçons disponibles</div>
        </div>
        <div class="admin-stat-card">
            <div class="asc-icon">🎯</div>
            <div class="asc-val">${QUIZZES.length}</div>
            <div class="asc-label">Quiz disponibles</div>
        </div>
    </div>`;
}

function renderAdminUsers() {
    const users = getAllUsersWithStats();
    const me    = getCurrentUser();
    const el    = document.getElementById("admin-users");
    el.innerHTML = `
    <div class="admin-table-wrap">
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Utilisateur</th>
                    <th>Rôle</th>
                    <th>Quiz faits</th>
                    <th>Précision</th>
                    <th>Leçons lues</th>
                    <th>Membre depuis</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            ${users.map(u => `
                <tr class="${u.id === me.id ? "me-row" : ""}">
                    <td>
                        <span class="at-avatar">${u.avatar}</span>
                        <div>
                            <strong>${escapeHtml(u.name)}</strong>
                            <small>@${escapeHtml(u.username)}</small>
                        </div>
                    </td>
                    <td><span class="role-badge ${u.role === "admin" ? "admin" : ""}">${u.role === "admin" ? "🛠️ Admin" : "🎓 Élève"}</span></td>
                    <td>${u.quizCount} / ${QUIZZES.length}</td>
                    <td>${u.accuracy !== null ? u.accuracy + "%" : "—"}</td>
                    <td>${u.lessonsRead} / ${COURSES.length}</td>
                    <td>${u.createdAt}</td>
                    <td>
                        ${u.id !== me.id ? `
                        <button class="btn-sm admin-role-btn" data-uid="${u.id}" data-role="${u.role}">
                            ${u.role === "admin" ? "→ Élève" : "→ Admin"}
                        </button>
                        <button class="btn-sm admin-del-btn" data-uid="${u.id}" style="background:#fef2f2;color:#ef4444">Supprimer</button>
                        ` : '<span style="color:#94a3b8;font-size:0.8rem">C\'est vous</span>'}
                    </td>
                </tr>`).join("")}
            </tbody>
        </table>
    </div>`;

    el.querySelectorAll(".admin-role-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const uid     = parseInt(btn.dataset.uid);
            const newRole = btn.dataset.role === "admin" ? "user" : "admin";
            updateUserProfile(uid, { role: newRole });
            renderAdminUsers();
        });
    });
    el.querySelectorAll(".admin-del-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            deleteUser(parseInt(btn.dataset.uid));
            renderAdminUsers();
            renderAdminOverview();
            showToast("Utilisateur supprimé.", "info");
        });
    });
}

function renderAdminForum() {
    const el = document.getElementById("admin-forum");
    const catLabels = {
        maths: "📐 Maths", francais: "📖 Français", histgeo: "🗺️ Histoire-Géo",
        svt: "🌿 SVT", physchim: "⚗️ Physique-Chimie", anglais: "🌍 Anglais", autre: "💬 Autre"
    };
    el.innerHTML = `
    <div class="admin-forum-list">
        ${FORUM_POSTS.map(p => `
        <div class="admin-post-row">
            <div class="apr-info">
                <span class="fp-cat">${catLabels[p.cat] || p.cat}</span>
                <strong>${escapeHtml(p.title)}</strong>
                <span>par ${escapeHtml(p.author)} · ${p.date} · ❤️ ${p.likes} · 💬 ${p.replies.length}</span>
            </div>
            <button class="btn-sm admin-del-post" data-id="${p.id}" style="background:#fef2f2;color:#ef4444">🗑️ Supprimer</button>
        </div>`).join("") || '<p class="empty-msg">Aucune discussion.</p>'}
    </div>`;

    el.querySelectorAll(".admin-del-post").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = FORUM_POSTS.findIndex(p => p.id === parseInt(btn.dataset.id));
            if (idx !== -1) {
                FORUM_POSTS.splice(idx, 1);
                renderAdminForum();
                renderAdminOverview();
                showToast("Discussion supprimée.", "info");
            }
        });
    });
}

// ============================================================
// HERO / STATS
// ============================================================
function updateHeroStats() {
    const done = Object.keys(state.quizDone).length;
    const heroCount = document.getElementById("hero-quiz-count");
    if (heroCount) {
        animateCount(heroCount, done, 700);
        heroCount.classList.add("stat-glow");
        setTimeout(() => heroCount.classList.remove("stat-glow"), 700);
    }
    const sp = document.getElementById("stat-progress");
    const pct = Math.round((done / QUIZZES.length) * 100);
    if (sp) animateCount(sp, pct, 700, "%");
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    authInit();
    loadState();
    renderHeaderAuth();

    // --- Nav links ---
    document.querySelectorAll(".nav-link").forEach(l => {
        l.addEventListener("click", e => { e.preventDefault(); navigateTo(l.dataset.view); });
    });

    // --- Burger menu ---
    document.getElementById("burger").addEventListener("click", () => {
        document.getElementById("nav").classList.toggle("open");
        document.getElementById("burger").classList.toggle("active");
    });

    // --- Data-nav buttons ---
    document.addEventListener("click", e => {
        const btn = e.target.closest("[data-nav]");
        if (btn && !btn.closest(".modal-overlay")) {
            e.preventDefault();
            navigateTo(btn.dataset.nav);
        }
    });

    // --- Subject cards (home) ---
    document.querySelectorAll(".subject-card[data-subject]").forEach(card => {
        card.addEventListener("click", () => {
            currentSubject = card.dataset.subject;
            navigateTo("cours");
        });
    });

    // --- Cours sidebar ---
    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            currentSubject = item.dataset.filter;
            renderCoursList();
        });
    });

    // --- Back to lesson list ---
    document.getElementById("back-to-list").addEventListener("click", () => {
        document.getElementById("cours-list").classList.remove("hidden");
        document.getElementById("lesson-detail").classList.add("hidden");
    });

    // --- Quiz ---
    document.getElementById("quiz-next").addEventListener("click", nextQuestion);
    document.getElementById("retry-quiz").addEventListener("click", () => startQuiz(currentQuiz.id));
    document.getElementById("other-quiz").addEventListener("click", () => {
        document.getElementById("quiz-result").classList.add("hidden");
        document.getElementById("quiz-home").classList.remove("hidden");
        renderQuizGrid();
    });

    // --- Forum ---
    document.querySelectorAll(".fc-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".fc-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            forumFilter = btn.dataset.cat;
            renderForum();
        });
    });
    document.getElementById("forum-search").addEventListener("input", renderForum);

    document.getElementById("new-post-btn").addEventListener("click", () => {
        const user = getCurrentUser();
        if (user) {
            const authorField = document.getElementById("post-author");
            authorField.value = user.name;
            authorField.readOnly = true;
        } else {
            document.getElementById("post-author").readOnly = false;
        }
        document.getElementById("post-modal").classList.remove("hidden");
    });
    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("post-modal").classList.add("hidden");
    });
    document.getElementById("post-modal").addEventListener("click", e => {
        if (e.target === document.getElementById("post-modal"))
            document.getElementById("post-modal").classList.add("hidden");
    });
    document.getElementById("submit-post").addEventListener("click", () => {
        const author = document.getElementById("post-author").value.trim();
        const cat    = document.getElementById("post-cat").value;
        const title  = document.getElementById("post-title").value.trim();
        const body   = document.getElementById("post-body").value.trim();
        if (!author || !title || !body) {
            showToast("Merci de remplir tous les champs.", "warn");
            return;
        }
        addPost(author, cat, title, body);
        document.getElementById("post-modal").classList.add("hidden");
        document.getElementById("post-title").value = "";
        document.getElementById("post-body").value  = "";
        showToast("Discussion publiée !", "success");
    });

    // --- Auth — login button ---
    document.getElementById("btn-login").addEventListener("click", openAuthModal);

    // --- Auth — close modal ---
    document.getElementById("close-auth-modal").addEventListener("click", closeAuthModal);
    document.getElementById("auth-modal").addEventListener("click", e => {
        if (e.target === document.getElementById("auth-modal")) closeAuthModal();
    });

    // --- Auth — tab switch ---
    document.querySelectorAll(".auth-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => switchAuthTab(btn.dataset.atab));
    });

    // --- Auth — submit login ---
    document.getElementById("submit-login").addEventListener("click", handleLogin);
    document.getElementById("login-password").addEventListener("keydown", e => {
        if (e.key === "Enter") handleLogin();
    });

    // --- Auth — submit register ---
    document.getElementById("submit-register").addEventListener("click", handleRegister);

    // --- Auth — logout ---
    document.getElementById("btn-logout").addEventListener("click", handleLogout);

    // --- User dropdown toggle ---
    document.getElementById("user-btn").addEventListener("click", e => {
        e.stopPropagation();
        document.getElementById("user-dropdown").classList.toggle("hidden");
    });
    document.addEventListener("click", e => {
        if (!e.target.closest(".user-menu")) closeUserDropdown();
    });

    // --- Profile ---
    document.getElementById("save-profile").addEventListener("click", saveProfile);

    // --- Admin tabs ---
    document.querySelectorAll(".admin-tab").forEach(btn => {
        btn.addEventListener("click", () => switchAdminTab(btn.dataset.atab));
    });

    updateHeroStats();
});
