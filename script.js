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

// Cache pour les données Supabase (évite de rendre les renderers synchrones async)
let _customCourses   = [];
let _customExercises = [];
let _forumPosts      = [];

async function loadCustomContent() {
    [_customCourses, _customExercises] = await Promise.all([
        getCustomCourses(),
        getCustomExercises()
    ]);
}

async function loadState() {
    const user = getCurrentUser();
    const saved = await getUserProgress(user ? user.id : null);
    Object.assign(state, saved);
}

function saveState() {
    const user = getCurrentUser();
    saveUserProgress(user ? user.id : null, state); // fire-and-forget
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

    if (view === "cours")          renderCoursList();
    if (view === "quiz")           renderQuizGrid();
    if (view === "progression")    renderProgression();
    if (view === "forum")          renderForum();
    if (view === "accueil")        updateHeroStats();
    if (view === "profil")         renderProfile();
    if (view === "admin")          renderAdmin();
    if (view === "exercices")      renderExercicesList();
    if (view === "matieres")       renderMatieres();
    if (view === "matiere-detail") renderMatiereDetail();
    if (view === "espaces")        renderEspaces();
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

    const addCourseBtn = document.getElementById("btn-add-course-sidebar");
    if (user) {
        loginBtn.classList.add("hidden");
        userMenu.classList.remove("hidden");
        document.getElementById("user-avatar-hdr").textContent = user.avatar;
        document.getElementById("user-name-hdr").textContent   = user.name;
        const addExoBtn = document.getElementById("btn-add-exo-sidebar");
        if (user.role === "admin") {
            adminLink.classList.remove("hidden");
            if (addCourseBtn) addCourseBtn.classList.remove("hidden");
            if (addExoBtn)    addExoBtn.classList.remove("hidden");
        } else {
            adminLink.classList.add("hidden");
            if (addCourseBtn) addCourseBtn.classList.add("hidden");
            if (addExoBtn)    addExoBtn.classList.add("hidden");
        }
    } else {
        loginBtn.classList.remove("hidden");
        userMenu.classList.add("hidden");
        if (addCourseBtn) addCourseBtn.classList.add("hidden");
        const addExoBtn = document.getElementById("btn-add-exo-sidebar");
        if (addExoBtn) addExoBtn.classList.add("hidden");
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

async function handleLogin() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const errEl    = document.getElementById("login-error");
    const btn      = document.getElementById("submit-login");
    btn.disabled = true;
    btn.textContent = "Connexion…";
    const user = await authLogin(username, password);
    btn.disabled = false;
    btn.textContent = "Se connecter";
    if (!user) {
        errEl.textContent = "Identifiants incorrects.";
        errEl.classList.remove("hidden");
        return;
    }
    errEl.classList.add("hidden");
    resetState();
    await loadState();
    closeAuthModal();
    renderHeaderAuth();
    updateHeroStats();
    if (currentView === "progression") renderProgression();
    if (currentView === "quiz") renderQuizGrid();
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    showToast(`Bienvenue ${user.name} !`, "success");
}

async function handleRegister() {
    const username = document.getElementById("reg-username").value.trim();
    const name     = document.getElementById("reg-name").value.trim();
    const password = document.getElementById("reg-password").value;
    const errEl    = document.getElementById("reg-error");
    const btn      = document.getElementById("submit-register");
    btn.disabled = true;
    btn.textContent = "Création…";
    const result = await authRegister(username, name, password, selectedAvatar);
    btn.disabled = false;
    btn.textContent = "Créer mon compte";
    if (result.error) {
        errEl.textContent = result.error;
        errEl.classList.remove("hidden");
        return;
    }
    errEl.classList.add("hidden");
    resetState();
    await loadState();
    closeAuthModal();
    renderHeaderAuth();
    document.getElementById("reg-username").value = "";
    document.getElementById("reg-name").value     = "";
    document.getElementById("reg-password").value = "";
    showToast(`Bienvenue ${result.user.name} ! 🎉`, "success");
}

async function handleLogout() {
    await authLogout();
    resetState();
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

async function saveProfile() {
    const user = getCurrentUser();
    if (!user) return;
    const name     = document.getElementById("edit-name").value.trim();
    const password = document.getElementById("edit-password").value;
    const changes  = {};
    if (name)     changes.name     = name;
    if (password) changes.password = password;
    changes.avatar = selectedAvatar;

    await updateUserProfile(user.id, changes);
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
function getAllCourses() {
    return [...COURSES, ..._customCourses];
}

function renderCoursList() {
    const list   = document.getElementById("cours-list");
    const detail = document.getElementById("lesson-detail");
    list.classList.remove("hidden");
    detail.classList.add("hidden");

    const lessons = getAllCourses().filter(c => c.subject === currentSubject);
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
    const lesson = getAllCourses().find(c => c.id === id);
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
const CAT_LABELS = {
    maths: "📐 Maths", francais: "📖 Français", histgeo: "🗺️ Histoire-Géo",
    svt: "🌿 SVT", physchim: "⚗️ Physique-Chimie", anglais: "🌍 Anglais", autre: "💬 Autre"
};

function renderForum() {
    const forumPostsEl = document.getElementById("forum-posts");
    forumPostsEl.innerHTML = '<p class="empty-msg" style="opacity:.5">⏳ Chargement du forum…</p>';
    getForumPosts().then(posts => {
        _forumPosts = posts;
        _renderForumPosts(posts);
    });
}

function _renderForumPosts(allPosts) {
    const search = document.getElementById("forum-search").value.toLowerCase();
    const posts  = allPosts
        .filter(p => forumFilter === "all" || p.cat === forumFilter)
        .filter(p => !search || p.title.toLowerCase().includes(search) || p.body.toLowerCase().includes(search));

    const user    = getCurrentUser();
    const isAdmin = user && user.role === "admin";
    const forumPostsEl = document.getElementById("forum-posts");

    forumPostsEl.innerHTML = posts.length ? posts.map(p => `
        <div class="forum-post">
            <div class="fp-header">
                <span class="fp-cat">${CAT_LABELS[p.cat] || p.cat}</span>
                <div style="display:flex;align-items:center;gap:8px">
                    <span class="fp-date">${p.date}</span>
                    ${isAdmin || p.author_id === user?.id ? `<button class="fp-delete" data-id="${p.id}" title="Supprimer">🗑️</button>` : ""}
                </div>
            </div>
            <h3 class="fp-title">${escapeHtml(p.title)}</h3>
            <p class="fp-body">${escapeHtml(p.body)}</p>
            <div class="fp-footer">
                <span class="fp-author">${escapeHtml(p.author_avatar || "👤")} ${escapeHtml(p.author)}</span>
                <button class="fp-like" data-id="${p.id}" data-likes="${p.likes}">❤️ ${p.likes}</button>
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

    forumPostsEl.querySelectorAll(".fp-like").forEach(btn => {
        btn.addEventListener("click", async () => {
            const currentLikes = parseInt(btn.dataset.likes);
            btn.disabled = true;
            await likeForumPost(btn.dataset.id, currentLikes);
            renderForum();
        });
    });
    forumPostsEl.querySelectorAll(".fp-delete").forEach(btn => {
        btn.addEventListener("click", async () => {
            btn.disabled = true;
            await deleteForumPost(btn.dataset.id);
            showToast("Discussion supprimée.", "info");
            renderForum();
        });
    });
}

async function addPost(author, cat, title, body) {
    const user = getCurrentUser();
    await addForumPost({
        author,
        authorAvatar: user?.avatar || "🎓",
        authorId:     user?.id    || null,
        cat, title, body
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

    if (tab === "overview")  renderAdminOverview();
    if (tab === "users")     renderAdminUsers();
    if (tab === "forum")     renderAdminForum();
    if (tab === "courses")   renderAdminCourses();
    if (tab === "exercices") renderAdminExercices();
}

function renderAdminOverview() {
    const el = document.getElementById("admin-overview");
    el.innerHTML = '<p class="empty-msg" style="opacity:.5">⏳ Chargement…</p>';
    Promise.all([getAllUsersWithStats(), getForumPosts()]).then(([users, posts]) => {
        const allDone = users.reduce((s, u) => s + u.quizCount, 0);
        const allLess = users.reduce((s, u) => s + u.lessonsRead, 0);
        el.innerHTML = `
        <div class="admin-stats-grid">
            <div class="admin-stat-card"><div class="asc-icon">👥</div><div class="asc-val">${users.length}</div><div class="asc-label">Utilisateurs inscrits</div></div>
            <div class="admin-stat-card"><div class="asc-icon">📝</div><div class="asc-val">${allDone}</div><div class="asc-label">Quiz complétés (total)</div></div>
            <div class="admin-stat-card"><div class="asc-icon">📖</div><div class="asc-val">${allLess}</div><div class="asc-label">Leçons lues (total)</div></div>
            <div class="admin-stat-card"><div class="asc-icon">💬</div><div class="asc-val">${posts.length}</div><div class="asc-label">Discussions forum</div></div>
            <div class="admin-stat-card"><div class="asc-icon">📚</div><div class="asc-val">${getAllCourses().length}</div><div class="asc-label">Leçons disponibles</div></div>
            <div class="admin-stat-card"><div class="asc-icon">🎯</div><div class="asc-val">${QUIZZES.length}</div><div class="asc-label">Quiz disponibles</div></div>
        </div>`;
    });
}

function renderAdminUsers() {
    const el = document.getElementById("admin-users");
    el.innerHTML = '<p class="empty-msg" style="opacity:.5">⏳ Chargement…</p>';
    getAllUsersWithStats().then(users => {
        const me = getCurrentUser();
        el.innerHTML = `
        <div class="admin-table-wrap">
            <table class="admin-table">
                <thead><tr>
                    <th>Utilisateur</th><th>Rôle</th><th>Quiz faits</th>
                    <th>Précision</th><th>Leçons lues</th><th>Membre depuis</th><th>Actions</th>
                </tr></thead>
                <tbody>
                ${users.map(u => `
                    <tr class="${u.id === me?.id ? "me-row" : ""}">
                        <td>
                            <span class="at-avatar">${u.avatar}</span>
                            <div><strong>${escapeHtml(u.name)}</strong><small>@${escapeHtml(u.username)}</small></div>
                        </td>
                        <td><span class="role-badge ${u.role === "admin" ? "admin" : ""}">${u.role === "admin" ? "🛠️ Admin" : "🎓 Élève"}</span></td>
                        <td>${u.quizCount} / ${QUIZZES.length}</td>
                        <td>${u.accuracy !== null ? u.accuracy + "%" : "—"}</td>
                        <td>${u.lessonsRead} / ${getAllCourses().length}</td>
                        <td>${new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                        <td>
                            ${u.id !== me?.id ? `
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
            btn.addEventListener("click", async () => {
                const newRole = btn.dataset.role === "admin" ? "user" : "admin";
                btn.disabled = true;
                await updateUserProfile(btn.dataset.uid, { role: newRole });
                renderAdminUsers();
            });
        });
        el.querySelectorAll(".admin-del-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                btn.disabled = true;
                await deleteUser(btn.dataset.uid);
                renderAdminUsers();
                renderAdminOverview();
                showToast("Utilisateur supprimé.", "info");
            });
        });
    });
}

function renderAdminForum() {
    const el = document.getElementById("admin-forum");
    el.innerHTML = '<p class="empty-msg" style="opacity:.5">⏳ Chargement…</p>';
    getForumPosts().then(posts => {
        el.innerHTML = `
        <div class="admin-forum-list">
            ${posts.map(p => `
            <div class="admin-post-row">
                <div class="apr-info">
                    <span class="fp-cat">${CAT_LABELS[p.cat] || p.cat}</span>
                    <strong>${escapeHtml(p.title)}</strong>
                    <span>par ${escapeHtml(p.author)} · ${p.date} · ❤️ ${p.likes} · 💬 ${p.replies.length}</span>
                </div>
                <button class="btn-sm admin-del-post" data-id="${p.id}" style="background:#fef2f2;color:#ef4444">🗑️ Supprimer</button>
            </div>`).join("") || '<p class="empty-msg">Aucune discussion.</p>'}
        </div>`;

        el.querySelectorAll(".admin-del-post").forEach(btn => {
            btn.addEventListener("click", async () => {
                btn.disabled = true;
                await deleteForumPost(btn.dataset.id);
                renderAdminForum();
                renderAdminOverview();
                showToast("Discussion supprimée.", "info");
            });
        });
    });
}

// ============================================================
// ADMIN — COURS
// ============================================================
function renderAdminCourses() {
    const el = document.getElementById("admin-courses");
    const custom = getCustomCourses();
    el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="font-size:1.05rem;font-weight:700">Cours disponibles (${getAllCourses().length})</h3>
        <button class="btn-primary" type="button" id="open-new-course">+ Nouveau cours</button>
    </div>
    <div class="admin-courses-list">
        ${getAllCourses().map(c => {
            const isCustom = custom.some(cc => cc.id === c.id);
            return `
        <div class="admin-course-row">
            <div class="acr-info">
                <span class="lc-icon">${SUBJECTS[c.subject] ? SUBJECTS[c.subject].icon : "📚"}</span>
                <div>
                    <strong>${escapeHtml(c.title)}</strong>
                    <small>${c.level || ""} · ${c.duration || ""}</small>
                </div>
            </div>
            <div class="acr-actions">
                ${isCustom ? `
                <button class="btn-sm acr-edit" data-cid="${c.id}">✏️ Modifier</button>
                <button class="btn-sm acr-del" data-cid="${c.id}" style="background:#fef2f2;color:#ef4444">🗑️ Suppr.</button>
                ` : `<span style="color:#94a3b8;font-size:0.8rem">cours de base</span>`}
            </div>
        </div>`;
        }).join("")}
    </div>`;

    el.querySelector("#open-new-course").addEventListener("click", () => openCourseModal(null));
    el.querySelectorAll(".acr-edit").forEach(btn => {
        btn.addEventListener("click", () => openCourseModal(btn.dataset.cid));
    });
    el.querySelectorAll(".acr-del").forEach(btn => {
        btn.addEventListener("click", async () => {
            btn.disabled = true;
            await deleteCustomCourse(btn.dataset.cid);
            _customCourses = await getCustomCourses();
            renderAdminCourses();
            renderAdminOverview();
            showToast("Cours supprimé.", "info");
        });
    });
}

function openCourseModal(id) {
    const modal = document.getElementById("course-modal");
    const titleEl = document.getElementById("course-modal-title");
    document.getElementById("cm-id").value = "";
    document.getElementById("cm-title").value = "";
    document.getElementById("cm-summary").value = "";
    document.getElementById("cm-intro").value = "";
    document.getElementById("cm-formula").value = "";
    document.getElementById("cm-tip").value = "";
    document.getElementById("cm-error").classList.add("hidden");
    document.querySelectorAll(".cm-sec-title").forEach(el => el.value = "");
    document.querySelectorAll(".cm-sec-body").forEach(el => el.value = "");

    if (id) {
        const course = getCustomCourses().find(c => c.id === id);
        if (!course) return;
        titleEl.textContent = "Modifier le cours";
        document.getElementById("cm-id").value      = course.id;
        document.getElementById("cm-subject").value = course.subject;
        document.getElementById("cm-level").value   = course.level || "Seconde";
        document.getElementById("cm-duration").value= course.duration || "";
        document.getElementById("cm-title").value   = course.title;
        document.getElementById("cm-summary").value = course.summary || "";
        if (course._raw) {
            document.getElementById("cm-intro").value   = course._raw.intro || "";
            document.getElementById("cm-formula").value = course._raw.formula || "";
            document.getElementById("cm-tip").value     = course._raw.tip || "";
            (course._raw.sections || []).forEach((sec, i) => {
                const blocks = document.querySelectorAll(".cm-section-block");
                if (blocks[i]) {
                    blocks[i].querySelector(".cm-sec-title").value = sec.title || "";
                    blocks[i].querySelector(".cm-sec-body").value  = sec.body  || "";
                }
            });
        }
    } else {
        titleEl.textContent = "Nouveau cours";
    }
    modal.classList.remove("hidden");
}

async function saveCourseFromModal() {
    const title   = document.getElementById("cm-title").value.trim();
    const subject = document.getElementById("cm-subject").value;
    const level   = document.getElementById("cm-level").value;
    if (!title || !subject) {
        document.getElementById("cm-error").classList.remove("hidden");
        return;
    }
    document.getElementById("cm-error").classList.add("hidden");

    const intro   = document.getElementById("cm-intro").value.trim();
    const formula = document.getElementById("cm-formula").value.trim();
    const tip     = document.getElementById("cm-tip").value.trim();
    const sections = [...document.querySelectorAll(".cm-section-block")].map(block => ({
        title: block.querySelector(".cm-sec-title").value.trim(),
        body:  block.querySelector(".cm-sec-body").value.trim()
    })).filter(s => s.title || s.body);

    let html = "";
    if (intro)    html += `<p>${escapeHtml(intro)}</p>`;
    sections.forEach(sec => {
        html += `<h3>${escapeHtml(sec.title)}</h3><p>${escapeHtml(sec.body).replace(/\n/g, "<br>")}</p>`;
    });
    if (formula)  html += `<div class="lesson-formula">${escapeHtml(formula)}</div>`;
    if (tip)      html += `<div class="lesson-tip">💡 ${escapeHtml(tip)}</div>`;

    const existingId = document.getElementById("cm-id").value;
    const course = {
        id:       existingId || `custom_${Date.now()}`,
        subject,
        level,
        duration: document.getElementById("cm-duration").value.trim() || "20 min",
        title,
        summary:  document.getElementById("cm-summary").value.trim(),
        content:  html,
        _raw: { intro, formula, tip, sections }
    };

    await saveCustomCourse(course);
    _customCourses = await getCustomCourses();
    document.getElementById("course-modal").classList.add("hidden");
    renderAdminCourses();
    renderAdminOverview();
    showToast(existingId ? "Cours mis à jour !" : "Cours créé !", "success");
}

// ============================================================
// ADMIN — EXERCICES
// ============================================================
function renderAdminExercices() {
    const el     = document.getElementById("admin-exercices");
    const custom = _customExercises;
    const all    = typeof getAllExercises === "function" ? getAllExercises() : [];
    el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="font-size:1.05rem;font-weight:700">Exercices disponibles (${all.length})</h3>
        <button class="btn-primary" type="button" id="open-new-exo">+ Nouvel exercice</button>
    </div>
    <div class="admin-courses-list">
        ${all.map(e => {
            const isCustom = custom.some(ce => ce.id === e.id);
            return `
            <div class="admin-course-row">
                <div class="acr-info">
                    <span class="lc-icon">${e.emoji || "🎮"}</span>
                    <div>
                        <strong>${escapeHtml(e.title)}</strong>
                        <small>${escapeHtml(e.subtitle || "")} · ${e.level || ""}</small>
                    </div>
                </div>
                <div class="acr-actions">
                    ${isCustom ? `
                    <button class="btn-sm acr-edit-exo" data-eid="${e.id}">✏️ Modifier</button>
                    <button class="btn-sm acr-del-exo"  data-eid="${e.id}" style="background:#fef2f2;color:#ef4444">🗑️ Suppr.</button>
                    ` : `<span style="color:#94a3b8;font-size:0.8rem">exercice de base</span>`}
                </div>
            </div>`;
        }).join("")}
    </div>`;

    el.querySelector("#open-new-exo").addEventListener("click", () => openExoModal(null));
    el.querySelectorAll(".acr-edit-exo").forEach(btn =>
        btn.addEventListener("click", () => openExoModal(btn.dataset.eid))
    );
    el.querySelectorAll(".acr-del-exo").forEach(btn =>
        btn.addEventListener("click", async () => {
            btn.disabled = true;
            await deleteCustomExercise(btn.dataset.eid);
            _customExercises = await getCustomExercises();
            renderAdminExercices();
            showToast("Exercice supprimé.", "info");
        })
    );
}

function openExoModal(id) {
    const modal = document.getElementById("exo-modal");
    document.getElementById("exo-modal-title").textContent = id ? "Modifier l'exercice" : "Nouvel exercice";
    document.getElementById("em-id").value      = "";
    document.getElementById("em-title").value   = "";
    document.getElementById("em-subtitle").value = "";
    document.getElementById("em-intro").value   = "";
    document.getElementById("em-palette").value = "";
    document.getElementById("em-headers").value = "";
    document.getElementById("em-error").classList.add("hidden");
    buildExoRowsUI([]);

    if (id) {
        const exo = getCustomExercises().find(e => e.id === id);
        if (!exo) return;
        document.getElementById("em-id").value       = exo.id;
        document.getElementById("em-subject").value  = exo.subject;
        document.getElementById("em-level").value    = exo.level;
        document.getElementById("em-title").value    = exo.title;
        document.getElementById("em-subtitle").value = exo.subtitle || "";
        document.getElementById("em-intro").value    = exo.intro    || "";
        document.getElementById("em-palette").value  = (exo.palette || []).join("\n");
        document.getElementById("em-headers").value  = (exo.headers || []).join("\n");
        buildExoRowsUI(exo.rows || []);
    }
    modal.classList.remove("hidden");
}

function buildExoRowsUI(rows) {
    const container = document.getElementById("em-rows-list");
    container.innerHTML = "";
    rows.forEach(row => {
        const cellsText = (row.cells || []).map(c => c.f ? `!${c.v}` : (c.c || "")).join("\n");
        addExoRowBlock(row.label || "", cellsText);
    });
}

function addExoRowBlock(label, cells) {
    const container = document.getElementById("em-rows-list");
    const div = document.createElement("div");
    div.className = "em-row-block";
    div.innerHTML = `
    <div class="em-row-inner">
        <div class="form-group" style="flex:1;min-width:100px">
            <label>Label</label>
            <input type="text" class="em-row-label" value="${escapeHtml(label || "")}" placeholder="Ex: (x+1)" maxlength="40">
        </div>
        <div class="form-group" style="flex:2;min-width:140px">
            <label>Cellules</label>
            <textarea class="em-row-cells" rows="3" placeholder="!valeur_fixe\nréponse_attendue">${escapeHtml(cells || "")}</textarea>
        </div>
        <button class="em-del-row" type="button" title="Supprimer la ligne">✕</button>
    </div>`;
    div.querySelector(".em-del-row").addEventListener("click", () => div.remove());
    container.appendChild(div);
}

async function saveExoFromModal() {
    const title   = document.getElementById("em-title").value.trim();
    const palette = document.getElementById("em-palette").value.trim()
                        .split("\n").map(s => s.trim()).filter(Boolean);
    const headers = document.getElementById("em-headers").value.trim()
                        .split("\n").map(s => s.trim()).filter(Boolean);

    if (!title || palette.length === 0 || headers.length < 2) {
        document.getElementById("em-error").classList.remove("hidden");
        return;
    }
    document.getElementById("em-error").classList.add("hidden");

    const rows = [...document.querySelectorAll(".em-row-block")].map(block => {
        const lbl   = block.querySelector(".em-row-label").value.trim();
        const lines = block.querySelector(".em-row-cells").value.trim()
                           .split("\n").map(s => s.trim()).filter(Boolean);
        const cells = lines.map(l => l.startsWith("!") ? { v: l.slice(1), f: 1 } : { c: l });
        return { label: lbl, cells };
    }).filter(r => r.label);

    if (rows.length === 0) {
        document.getElementById("em-error").classList.remove("hidden");
        return;
    }

    const existingId = document.getElementById("em-id").value;
    const exo = {
        id:       existingId || `cexo_${Date.now()}`,
        subject:  document.getElementById("em-subject").value,
        level:    document.getElementById("em-level").value,
        emoji:    "📝",
        title,
        subtitle: document.getElementById("em-subtitle").value.trim(),
        intro:    document.getElementById("em-intro").value.trim(),
        type:     "grid",
        palette,
        headers,
        labelW:   140,
        colW:     110,
        rows,
    };

    await saveCustomExercise(exo);
    _customExercises = await getCustomExercises();
    document.getElementById("exo-modal").classList.add("hidden");
    renderAdminExercices();
    showToast(existingId ? "Exercice mis à jour !" : "Exercice créé !", "success");
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
document.addEventListener("DOMContentLoaded", async () => {
    await authInit();
    await loadState();
    await loadCustomContent();
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
    document.getElementById("submit-post").addEventListener("click", async () => {
        const author = document.getElementById("post-author").value.trim();
        const cat    = document.getElementById("post-cat").value;
        const title  = document.getElementById("post-title").value.trim();
        const body   = document.getElementById("post-body").value.trim();
        if (!author || !title || !body) {
            showToast("Merci de remplir tous les champs.", "warn");
            return;
        }
        const btn = document.getElementById("submit-post");
        btn.disabled = true;
        await addPost(author, cat, title, body);
        btn.disabled = false;
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

    // --- Bouton ajouter un cours (sidebar cours) ---
    document.getElementById("btn-add-course-sidebar").addEventListener("click", () => openCourseModal(null));

    // --- Bouton ajouter un exercice (page exercices) ---
    document.getElementById("btn-add-exo-sidebar").addEventListener("click", () => openExoModal(null));

    // --- Course modal ---
    document.getElementById("close-course-modal").addEventListener("click", () => {
        document.getElementById("course-modal").classList.add("hidden");
    });
    document.getElementById("course-modal").addEventListener("click", e => {
        if (e.target === document.getElementById("course-modal"))
            document.getElementById("course-modal").classList.add("hidden");
    });
    document.getElementById("submit-course").addEventListener("click", saveCourseFromModal);

    // --- Modal exercice ---
    document.getElementById("close-exo-modal").addEventListener("click", () =>
        document.getElementById("exo-modal").classList.add("hidden")
    );
    document.getElementById("exo-modal").addEventListener("click", e => {
        if (e.target === document.getElementById("exo-modal"))
            document.getElementById("exo-modal").classList.add("hidden");
    });
    document.getElementById("submit-exo").addEventListener("click", saveExoFromModal);
    document.getElementById("em-add-row").addEventListener("click", () => addExoRowBlock("", ""));

    updateHeroStats();
});
