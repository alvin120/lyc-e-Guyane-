// ============================================================
// DYNAMICS — toasts, confetti, compteurs, ripple, reveal
// ============================================================

// --- Toast notifications ---
function showToast(msg, type = "success", duration = 3500) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    const icons = { success: "✅", error: "❌", info: "ℹ️", warn: "⚠️" };
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || "💬"}</span><span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("toast-out");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, duration);
}

// --- Compteur animé ---
function animateCount(el, target, duration = 900, suffix = "") {
    if (!el) return;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
}

// --- Confettis ---
function launchConfetti(pct) {
    if (pct < 60) return;
    const old = document.getElementById("confetti-canvas");
    if (old) old.remove();
    const canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const count = pct === 100 ? 200 : 100;
    const colors = ["#22c55e","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#ec4899","#06b6d4","#fff"];
    const pieces = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 120,
        w: Math.random() * 12 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3.5 + 1.5,
        vx: (Math.random() - 0.5) * 3.5,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.14,
        opacity: 1
    }));
    let frame = 0;
    const maxFrames = pct === 100 ? 260 : 180;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            if (frame > maxFrames * 0.65) p.opacity -= 0.018;
            if (p.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.vrot;
            p.vy += 0.07;
        });
        frame++;
        if (frame < maxFrames) requestAnimationFrame(draw);
        else canvas.remove();
    }
    draw();
}

// --- Animation staggerée sur une liste ---
function staggerIn(container, selector) {
    if (!container) return;
    const items = container.querySelectorAll(selector);
    items.forEach((el, i) => {
        el.classList.remove("stagger-in");
        el.style.animationDelay = `${i * 55}ms`;
        void el.offsetWidth;
        el.classList.add("stagger-in");
    });
}

// --- Ripple effect sur les boutons ---
function initRipple() {
    document.addEventListener("click", e => {
        const btn = e.target.closest(
            ".btn-primary, .btn-secondary, .quiz-opt, .sidebar-item, .fc-btn, .quiz-item-card .btn-primary"
        );
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const ripple = document.createElement("span");
        ripple.className = "ripple-circle";
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
        btn.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
}

// --- Scroll reveal ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    const targets = document.querySelectorAll(
        ".stats-section, .prog-overview, .subject-bars, .badges-grid, .section-sub"
    );
    targets.forEach(el => {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

// --- Orbes animés dans le hero ---
function initHeroOrbs() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const orbs = [
        { size: 320, style: "top:-90px;left:-70px;animation-delay:0s" },
        { size: 220, style: "bottom:-70px;right:100px;animation-delay:2.2s" },
        { size: 160, style: "top:55%;left:42%;animation-delay:1.1s" }
    ];
    orbs.forEach(o => {
        const orb = document.createElement("div");
        orb.className = "hero-bg-orb";
        orb.style.cssText = `width:${o.size}px;height:${o.size}px;${o.style}`;
        hero.insertBefore(orb, hero.firstChild);
    });
}

// --- Init global ---
document.addEventListener("DOMContentLoaded", () => {
    initRipple();
    initHeroOrbs();
    setTimeout(initScrollReveal, 200);
});
