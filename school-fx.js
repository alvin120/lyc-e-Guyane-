// ============================================================
// SCHOOL FX — Particules scolaires & animations visuelles
// ============================================================

// --- Particules flottantes en arrière-plan ---
(function initSchoolParticles() {
    const symbols = ['✏️','📚','⭐','📐','🌿','⚗️','🏆','🧮','💡','🔬','📝','🎯'];
    const container = document.body;

    symbols.forEach((sym, i) => {
        const el = document.createElement('span');
        el.className = 'school-particle';
        el.textContent = sym;
        el.setAttribute('aria-hidden', 'true');

        const left  = 5 + Math.random() * 90;
        const dur   = 10 + Math.random() * 14;
        const delay = Math.random() * -20;
        const tx    = (Math.random() - 0.5) * 120;
        const rr    = Math.random() > 0.5 ? 180 : -180;
        const op    = 0.04 + Math.random() * 0.04;
        const fs    = 0.9 + Math.random() * 0.7;

        el.style.cssText = [
            `left:${left}%`,
            `--dur:${dur}s`,
            `--delay:${delay}s`,
            `--tx:${tx}px`,
            `--rr:${rr}deg`,
            `--op:${op}`,
            `--fs:${fs}rem`,
            `font-size:${fs}rem`,
            `animation-delay:${delay}s`,
        ].join(';');

        container.appendChild(el);
    });
})();

// --- Compteur animé pour les .stat-num ---
function animateCounter(el, from, to, duration) {
    const start = performance.now();
    const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(from + (to - from) * eased);
        el.textContent = el.dataset.suffix ? value + el.dataset.suffix : value;
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

function initStatCounters() {
    const statNums = document.querySelectorAll('.stats-section .stat-num');
    if (!statNums.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.counted) return;
            el.dataset.counted = '1';

            const raw = el.textContent.trim();
            const suffix = raw.replace(/[\d]/g, '');
            const num = parseInt(raw.replace(/\D/g, ''), 10);
            if (isNaN(num)) return;

            el.dataset.suffix = suffix;
            animateCounter(el, 0, num, 1400);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
}

// --- Scroll-triggered class sur le header ---
(function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
})();

// --- Décalage entrée des quiz item cards ---
function staggerQuizCards() {
    document.querySelectorAll('.quiz-item-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.08}s`;
    });
}

// --- Décalage entrée des subject cards ---
function staggerSubjectCards() {
    document.querySelectorAll('.subject-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.07}s`;
        card.style.animation = `staggerFade 0.42s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both`;
    });
}

// --- Init général ---
document.addEventListener('DOMContentLoaded', () => {
    initStatCounters();
    staggerSubjectCards();
});

// Exposer pour que dynamics.js/script.js puisse les appeler après rendu dynamique
window.schoolFx = {
    staggerQuizCards,
    initStatCounters,
};
