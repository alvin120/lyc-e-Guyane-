// ============================================================
// JEU 3D — Niveaux, points d'expérience (XP) et cartes en relief
// Les XP sont calculés à partir de la progression déjà sauvegardée
// (leçons lues, quiz réussis) : rien de nouveau n'est stocké.
// ============================================================

const Jeu = (() => {

    const XP_LECON = 20, XP_BONNE_REPONSE = 10, XP_QUIZ_PARFAIT = 30;
    const TITRES = ["Graine", "Jeune pousse", "Explorateur", "Pagayeur du Maroni", "Guide de la forêt",
                    "Gardien de l'Amazonie", "Pilote d'Ariane", "Légende de Guyane"];

    // XP total nécessaire pour atteindre le niveau n (niveau 1 = 0 XP)
    const seuil = n => 100 * (n - 1) + 25 * (n - 1) * (n - 2);
    const titre = n => TITRES[Math.min(n, TITRES.length) - 1];

    function calculerXp() {
        if (typeof state === "undefined") return 0;
        const lecons = Object.keys(state.lessonsRead || {}).length;
        const quiz = Object.values(state.quizDone || {}).reduce((s, q) => {
            const score = Number(q.score) || 0, total = Number(q.total) || 0;
            return s + score * XP_BONNE_REPONSE + (total > 0 && score === total ? XP_QUIZ_PARFAIT : 0);
        }, 0);
        const exos = typeof Epreuves !== "undefined" ? Epreuves.xpExercices() : 0; // 15 XP par étoile
        return lecons * XP_LECON + quiz + exos;
    }

    function niveau(xp) {
        let n = 1;
        while (xp >= seuil(n + 1)) n++;
        return n;
    }

    let dernierXp = null;

    // ---------- Carte « joueur » de l'accueil ----------
    function afficher() {
        const carte = document.querySelector(".hero-card");
        if (!carte) return;
        let bloc = document.getElementById("hc-niveau");
        if (!bloc) {
            bloc = document.createElement("div");
            bloc.id = "hc-niveau";
            bloc.className = "hc-niveau";
            bloc.innerHTML = `
                <div class="hc-niv-haut">
                    <span class="hc-niv-badge" id="hc-niv-badge"></span>
                    <span class="hc-niv-titre" id="hc-niv-titre"></span>
                </div>
                <div class="hc-xp-barre" role="progressbar" aria-label="Progression vers le niveau suivant" aria-valuemin="0" aria-valuemax="100">
                    <div id="hc-xp-jauge"></div>
                </div>
                <div class="hc-xp-texte" id="hc-xp-texte"></div>`;
            carte.insertBefore(bloc, carte.firstChild);
        }
        const xp = calculerXp(), n = niveau(xp);
        const debut = seuil(n), fin = seuil(n + 1);
        const pct = Math.round(((xp - debut) / (fin - debut)) * 100);
        document.getElementById("hc-niv-badge").textContent = `Niveau ${n}`;
        document.getElementById("hc-niv-titre").textContent = titre(n);
        document.getElementById("hc-xp-jauge").style.width = pct + "%";
        bloc.querySelector(".hc-xp-barre").setAttribute("aria-valuenow", pct);
        document.getElementById("hc-xp-texte").textContent = `${xp} XP · encore ${fin - xp} pour le niveau ${n + 1}`;
    }

    // ---------- Bulle « +20 XP » ----------
    function bulle(texte) {
        const el = document.createElement("div");
        el.className = "xp-bulle";
        el.setAttribute("role", "status");
        el.textContent = texte;
        document.body.appendChild(el);
        el.addEventListener("animationend", () => el.remove(), { once: true });
        setTimeout(() => el.remove(), 2600); // filet de sécurité
    }

    // Progression rechargée (ouverture du site, connexion, déconnexion) : on recale sans fêter
    function synchroniser() {
        dernierXp = calculerXp();
        afficher();
    }

    // Progression enregistrée : si des XP ont été gagnés, on le montre
    function surProgression() {
        const xp = calculerXp();
        if (dernierXp === null) { synchroniser(); return; }
        const gain = xp - dernierXp, avant = niveau(dernierXp), apres = niveau(xp);
        dernierXp = xp;
        afficher();
        if (gain <= 0) return;
        bulle(`+${gain} XP`);
        if (typeof Scene3D !== "undefined") Scene3D.celebrer();
        if (apres > avant && typeof showToast === "function") {
            showToast(`🚀 Niveau ${apres} atteint : ${titre(apres)} !`, "success", 4500);
        }
    }

    // ---------- Cartes en relief : elles s'inclinent sous la souris ----------
    const CARTES = ".subject-card, .quiz-item-card, .exo-card, .mat-card, .prof-card";

    function initRelief() {
        if (!window.matchMedia) return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return; // pas au doigt
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let courante = null;
        const relacher = c => { c.style.transform = ""; c.classList.remove("tilt-3d"); };

        document.addEventListener("pointermove", e => {
            if (e.pointerType !== "mouse") return;
            const c = e.target && e.target.closest ? e.target.closest(CARTES) : null;
            if (c !== courante) {
                if (courante) relacher(courante);
                courante = c;
            }
            if (!c) return;

            // Une animation d'entrée encore en cours ? On attend qu'elle finisse.
            // Terminée, elle bloque encore `transform` : on la libère.
            const anims = c.getAnimations ? c.getAnimations() : [];
            if (anims.some(a => a.playState === "running")) return;
            anims.forEach(a => a.cancel());
            c.classList.add("tilt-3d");

            const r = c.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            c.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 9).toFixed(2)}deg) rotateY(${((x - 0.5) * 11).toFixed(2)}deg) translateY(-6px) scale(1.02)`;
            c.style.setProperty("--reflet-x", (x * 100).toFixed(1) + "%");
            c.style.setProperty("--reflet-y", (y * 100).toFixed(1) + "%");
        }, { passive: true });

        document.addEventListener("pointerleave", () => { if (courante) { relacher(courante); courante = null; } });
        window.addEventListener("blur", () => { if (courante) { relacher(courante); courante = null; } });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initRelief();
        afficher();
    });

    return { synchroniser, surProgression, calculerXp, niveau };
})();
