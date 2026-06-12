// ============================================================
// AUTH — Supabase (comptes persistants, multi-appareils)
// ============================================================

const SUPABASE_URL  = 'https://ifpofidkugvkaayxkdvq.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcG9maWRrdWd2a2FheXhrZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTMyNDgsImV4cCI6MjA5Njg2OTI0OH0.i7l3LXYkxKgAj7WL_bpgzzVg8DnZV45WA0olaxNH5eI';
const EMAIL_DOMAIN  = '@eduguyane.school';

const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let _currentUser = null;

// ── Session ────────────────────────────────────────────────
function getCurrentUser() { return _currentUser; }

async function authInit() {
    const { data: { session } } = await _sb.auth.getSession();
    if (session?.user) {
        const { data } = await _sb.from('profiles').select('*').eq('id', session.user.id).single();
        _currentUser = data || null;
    }
    // Réagir aux changements de session (onglet / token refresh)
    _sb.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const { data } = await _sb.from('profiles').select('*').eq('id', session.user.id).single();
            _currentUser = data || null;
        } else {
            _currentUser = null;
        }
        if (typeof renderHeaderAuth === 'function') renderHeaderAuth();
    });
}

// ── Connexion ──────────────────────────────────────────────
async function authLogin(username, password) {
    const email = username.toLowerCase().trim() + EMAIL_DOMAIN;
    const { data, error } = await _sb.auth.signInWithPassword({ email, password });
    if (error || !data.user) return null;
    const { data: profile } = await _sb.from('profiles').select('*').eq('id', data.user.id).single();
    _currentUser = profile || null;
    return _currentUser;
}

// ── Inscription ────────────────────────────────────────────
async function authRegister(username, name, password, avatar) {
    const trimUser = username.trim();
    if (trimUser.length < 3) return { error: 'Le pseudo doit faire au moins 3 caractères.' };
    if (password.length < 6) return { error: 'Le mot de passe doit faire au moins 6 caractères.' };

    // Vérifier unicité du pseudo
    const { data: existing } = await _sb.from('profiles').select('username').eq('username', trimUser.toLowerCase()).maybeSingle();
    if (existing) return { error: "Ce nom d'utilisateur est déjà pris." };

    const email = trimUser.toLowerCase() + EMAIL_DOMAIN;
    const { error: signUpErr } = await _sb.auth.signUp({ email, password });
    if (signUpErr) return { error: signUpErr.message };

    // Connexion immédiate (auto-confirm par trigger SQL)
    const { data: signIn, error: signInErr } = await _sb.auth.signInWithPassword({ email, password });
    if (signInErr || !signIn?.user) return { error: "Erreur lors de la connexion après inscription." };

    const profile = {
        id: signIn.user.id,
        username: trimUser.toLowerCase(),
        name: name.trim() || trimUser,
        avatar: avatar || '🎓',
        role: 'user'
    };
    await _sb.from('profiles').insert(profile);
    _currentUser = { ...profile };
    return { user: _currentUser };
}

// ── Déconnexion ────────────────────────────────────────────
async function authLogout() {
    await _sb.auth.signOut();
    _currentUser = null;
}

// ── Progression ────────────────────────────────────────────
async function getUserProgress(userId) {
    if (!userId) return { quizDone: {}, lessonsRead: {} };
    const { data } = await _sb.from('progress').select('*').eq('user_id', userId).maybeSingle();
    return data
        ? { quizDone: data.quiz_done || {}, lessonsRead: data.lessons_read || {} }
        : { quizDone: {}, lessonsRead: {} };
}

async function saveUserProgress(userId, stateData) {
    if (!userId) return;
    await _sb.from('progress').upsert({
        user_id: userId,
        quiz_done: stateData.quizDone || {},
        lessons_read: stateData.lessonsRead || {},
        updated_at: new Date().toISOString()
    });
}

// ── Utilisateurs (admin) ───────────────────────────────────
async function getAllUsersWithStats() {
    const { data: profiles } = await _sb.from('profiles').select('*').order('created_at');
    const { data: progressAll } = await _sb.from('progress').select('*');
    const progMap = {};
    (progressAll || []).forEach(p => { progMap[p.user_id] = p; });

    return (profiles || []).map(u => {
        const prog = progMap[u.id];
        const done = Object.values(prog?.quiz_done || {});
        const totalScore = done.reduce((s, d) => s + d.score, 0);
        const totalQ     = done.reduce((s, d) => s + d.total,  0);
        return {
            ...u,
            quizCount:   done.length,
            accuracy:    totalQ > 0 ? Math.round((totalScore / totalQ) * 100) : null,
            lessonsRead: Object.keys(prog?.lessons_read || {}).length
        };
    });
}

async function updateUserProfile(userId, changes) {
    const update = {};
    if (changes.name)   update.name   = changes.name;
    if (changes.avatar) update.avatar = changes.avatar;
    if (changes.role)   update.role   = changes.role;
    await _sb.from('profiles').update(update).eq('id', userId);
    if (changes.password && _currentUser?.id === userId) {
        await _sb.auth.updateUser({ password: changes.password });
    }
    if (_currentUser?.id === userId) Object.assign(_currentUser, update);
    return true;
}

async function deleteUser(userId) {
    await _sb.from('profiles').delete().eq('id', userId);
}

// ── Forum ──────────────────────────────────────────────────
async function getForumPosts() {
    const { data } = await _sb
        .from('forum_posts')
        .select('*, forum_replies(*)')
        .order('created_at', { ascending: false });
    return (data || []).map(p => ({
        id:            p.id,
        author:        p.author_name,
        author_avatar: p.author_avatar,
        author_id:     p.author_id,
        cat:           p.cat,
        title:         p.title,
        body:          p.body,
        likes:         p.likes,
        date:          new Date(p.created_at).toLocaleDateString('fr-FR'),
        replies:       (p.forum_replies || []).map(r => ({
            id:     r.id,
            author: r.author_name,
            text:   r.text,
            date:   new Date(r.created_at).toLocaleDateString('fr-FR')
        }))
    }));
}

async function addForumPost({ author, authorAvatar, authorId, cat, title, body }) {
    const { data } = await _sb.from('forum_posts').insert({
        author_name:   author,
        author_avatar: authorAvatar || '🎓',
        author_id:     authorId || null,
        cat, title, body, likes: 0
    }).select().single();
    return data;
}

async function deleteForumPost(postId) {
    await _sb.from('forum_posts').delete().eq('id', postId);
}

async function likeForumPost(postId, currentLikes) {
    await _sb.from('forum_posts').update({ likes: currentLikes + 1 }).eq('id', postId);
}

// ── Cours personnalisés (admin) ────────────────────────────
async function getCustomCourses() {
    const { data } = await _sb.from('custom_courses').select('data').order('created_at');
    return (data || []).map(r => r.data);
}

async function saveCustomCourse(course) {
    await _sb.from('custom_courses').upsert({
        id: course.id, data: course, created_by: _currentUser?.id || null
    });
}

async function deleteCustomCourse(id) {
    await _sb.from('custom_courses').delete().eq('id', id);
}

// ── Exercices personnalisés (admin) ────────────────────────
async function getCustomExercises() {
    const { data } = await _sb.from('custom_exercises').select('data').order('created_at');
    return (data || []).map(r => r.data);
}

async function saveCustomExercise(exo) {
    await _sb.from('custom_exercises').upsert({
        id: exo.id, data: exo, created_by: _currentUser?.id || null
    });
}

async function deleteCustomExercise(id) {
    await _sb.from('custom_exercises').delete().eq('id', id);
}
