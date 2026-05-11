// ============================================================
// AUTH — Système d'authentification (localStorage)
// ============================================================

const DEFAULT_USERS = [
    {
        id: 1,
        username: "admin",
        password: "Admin123!",
        role: "admin",
        name: "Administrateur",
        avatar: "👨‍💼",
        createdAt: "01/01/2026"
    },
    {
        id: 2,
        username: "demo",
        password: "Demo123!",
        role: "user",
        name: "Élève Démo",
        avatar: "🎓",
        createdAt: "01/01/2026"
    }
];

function authInit() {
    if (!localStorage.getItem("eduguyane_users")) {
        localStorage.setItem("eduguyane_users", JSON.stringify(DEFAULT_USERS));
    }
}

function getUsers() {
    const saved = localStorage.getItem("eduguyane_users");
    return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
    localStorage.setItem("eduguyane_users", JSON.stringify(users));
}

function getCurrentUser() {
    const s = localStorage.getItem("eduguyane_session");
    return s ? JSON.parse(s) : null;
}

function authLogin(username, password) {
    const users = getUsers();
    const user = users.find(u =>
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!user) return null;
    const session = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        avatar: user.avatar
    };
    localStorage.setItem("eduguyane_session", JSON.stringify(session));
    return session;
}

function authLogout() {
    localStorage.removeItem("eduguyane_session");
}

function authRegister(username, name, password, avatar) {
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { error: "Ce nom d'utilisateur est déjà pris." };
    }
    if (username.length < 3) return { error: "Le pseudo doit faire au moins 3 caractères." };
    if (password.length < 6) return { error: "Le mot de passe doit faire au moins 6 caractères." };
    const newUser = {
        id: Date.now(),
        username: username.trim(),
        password,
        name: name.trim() || username.trim(),
        avatar: avatar || "🎓",
        role: "user",
        createdAt: new Date().toLocaleDateString("fr-FR")
    };
    users.push(newUser);
    saveUsers(users);
    return { user: newUser };
}

function getUserProgress(userId) {
    const key = userId ? `eduguyane_state_${userId}` : "eduguyane_state";
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : { quizDone: {}, lessonsRead: {} };
}

function saveUserProgress(userId, stateData) {
    const key = userId ? `eduguyane_state_${userId}` : "eduguyane_state";
    localStorage.setItem(key, JSON.stringify(stateData));
}

function getAllUsersWithStats() {
    return getUsers().map(u => {
        const prog = getUserProgress(u.id);
        const done = Object.values(prog.quizDone || {});
        const totalScore = done.reduce((s, d) => s + d.score, 0);
        const totalQ = done.reduce((s, d) => s + d.total, 0);
        return {
            ...u,
            quizCount: done.length,
            accuracy: totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : null,
            lessonsRead: Object.keys(prog.lessonsRead || {}).length
        };
    });
}

function updateUserProfile(userId, changes) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    if (changes.name)     users[idx].name     = changes.name;
    if (changes.avatar)   users[idx].avatar   = changes.avatar;
    if (changes.password) users[idx].password = changes.password;
    if (changes.role)     users[idx].role     = changes.role;
    saveUsers(users);
    const session = getCurrentUser();
    if (session && session.id === userId) {
        if (changes.name)   session.name   = changes.name;
        if (changes.avatar) session.avatar = changes.avatar;
        if (changes.role)   session.role   = changes.role;
        localStorage.setItem("eduguyane_session", JSON.stringify(session));
    }
    return true;
}

function deleteUser(userId) {
    const users = getUsers().filter(u => u.id !== userId);
    saveUsers(users);
}
