// ============================================================
// ÉPREUVES — Quiz et exercices en mode jeu
// Quiz : séries de bonnes réponses, bascule 3D entre les questions,
//        réponses au clavier (A-D ou 1-4, Entrée pour continuer).
// Exercices : avancement en direct, étoiles selon le nombre d'essais, XP.
// Les étoiles sont gardées sur l'appareil (localStorage) : la base
// Supabase n'est pas modifiée.
// ============================================================

const Epreuves = (() => {

    const XP_PAR_ETOILE = 15;
    const LETTRES = ["A", "B", "C", "D", "E", "F"];

    const rejouer = (el, classe) => {
        if (!el) return;
        el.classList.remove(classe);
        void el.offsetWidth;
        el.classList.add(classe);
    };

    // ========================================================
    // QUIZ
    // ========================================================
    let serie = 0, meilleureSerie = 0;

    function badgeSerie() {
        let b = document.getElementById("quiz-serie");
        if (!b) {
            const haut = document.querySelector("#quiz-runner .quiz-top");
            if (!haut) return null;
            b = document.createElement("span");
            b.id = "quiz-serie";
            b.className = "quiz-serie hidden";
            b.setAttribute("aria-live", "polite");
            haut.insertBefore(b, document.getElementById("quiz-counter"));
        }
        return b;
    }

    function quizDebut() {
        serie = 0;
        meilleureSerie = 0;
        const b = badgeSerie();
        if (b) b.classList.add("hidden");
    }

    // Nouvelle question affichée : la carte bascule, les réponses reçoivent une lettre
    function quizQuestion() {
        const carte = document.querySelector("#quiz-runner .quiz-card");
        if (carte) {
            carte.classList.remove("quiz-secousse", "quiz-bravo");
            rejouer(carte, "quiz-bascule");
        }
        document.querySelectorAll("#quiz-options .quiz-opt").forEach((btn, i) => {
            const l = document.createElement("span");
            l.className = "quiz-lettre";
            l.setAttribute("aria-hidden", "true");
            l.textContent = LETTRES[i] || "";
            btn.insertBefore(l, btn.firstChild);
            btn.style.animationDelay = `${80 + i * 70}ms`;
            btn.classList.add("quiz-opt-entree");
        });
    }

    function quizReponse(correct) {
        const carte = document.querySelector("#quiz-runner .quiz-card");
        const b = badgeSerie();
        if (correct) {
            serie++;
            meilleureSerie = Math.max(meilleureSerie, serie);
            rejouer(carte, "quiz-bravo");
        } else {
            serie = 0;
            rejouer(carte, "quiz-secousse");
        }
        if (!b) return;
        if (serie >= 2) {
            b.textContent = `🔥 Série de ${serie}`;
            b.classList.remove("hidden");
            rejouer(b, "quiz-serie-pop");
        } else {
            b.classList.add("hidden");
        }
    }

    function quizFin() {
        const score = document.getElementById("result-score");
        if (!score) return;
        let ligne = document.getElementById("result-serie");
        if (!ligne) {
            ligne = document.createElement("p");
            ligne.id = "result-serie";
            ligne.className = "result-serie";
            score.insertAdjacentElement("afterend", ligne);
        }
        ligne.textContent = meilleureSerie >= 2 ? `🔥 Meilleure série : ${meilleureSerie} bonnes réponses d'affilée` : "";
        ligne.classList.toggle("hidden", meilleureSerie < 2);
    }

    // Clavier : A-D ou 1-4 pour répondre, Entrée pour passer à la suite
    function initClavier() {
        document.addEventListener("keydown", e => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const runner = document.getElementById("quiz-runner");
            if (!runner || runner.classList.contains("hidden")) return;
            if (!document.getElementById("view-quiz").classList.contains("active")) return;
            const cible = e.target;
            if (cible && (cible.tagName === "INPUT" || cible.tagName === "TEXTAREA" || cible.tagName === "SELECT" || cible.isContentEditable)) return;

            const opts = [...document.querySelectorAll("#quiz-options .quiz-opt")];
            const repondu = opts.some(o => o.disabled);
            if (e.key === "Enter") {
                const suivant = document.getElementById("quiz-next");
                // si le bouton a déjà le focus, le navigateur le déclenche tout seul
                if (repondu && suivant && suivant.style.display !== "none" && document.activeElement !== suivant
                    && !(document.activeElement && document.activeElement.tagName === "BUTTON")) {
                    e.preventDefault();
                    suivant.click();
                }
                return;
            }
            if (repondu) return;
            const k = e.key.toLowerCase();
            let idx = "abcdef".indexOf(k);
            if (k.length !== 1 || idx < 0) idx = /^[1-6]$/.test(k) ? Number(k) - 1 : -1;
            if (idx >= 0 && opts[idx]) { e.preventDefault(); opts[idx].click(); }
        });
    }

    // ========================================================
    // EXERCICES
    // ========================================================
    const tentatives = {}; // id d'exercice → nombre de vérifications depuis l'ouverture

    function cleStockage() {
        const u = typeof getCurrentUser === "function" ? getCurrentUser() : null;
        return "eduguyane_exos_" + (u && u.id ? u.id : "invite");
    }
    function lireExos() {
        try { return JSON.parse(localStorage.getItem(cleStockage()) || "{}") || {}; }
        catch (_) { return {}; }
    }
    function ecrireExos(donnees) {
        try { localStorage.setItem(cleStockage(), JSON.stringify(donnees)); } catch (_) { /* stockage indisponible */ }
    }

    function xpExercices() {
        return Object.values(lireExos()).reduce((s, e) => s + (Number(e.etoiles) || 0) * XP_PAR_ETOILE, 0);
    }

    const etoilesHtml = n => [1, 2, 3].map(i => `<span class="etoile ${i <= n ? "pleine" : ""}" aria-hidden="true">★</span>`).join("");

    // Cases à remplir / déjà remplies de l'exercice ouvert
    function compter() {
        if (typeof exoCurrent === "undefined" || !exoCurrent) return { total: 0, remplies: 0 };
        const ids = [];
        if (exoCurrent.type === "grid") {
            exoCurrent.rows.forEach((row, ri) => row.cells.forEach((cell, ci) => {
                if (!cell.f && cell.c !== undefined) ids.push(`${ri}_${ci}`);
            }));
        } else {
            (exoCurrent.zones || []).forEach(z => ids.push(z.id));
        }
        return { total: ids.length, remplies: ids.filter(id => exoAnswers[id]).length };
    }

    // Liste : étoiles obtenues sur chaque carte
    function exoListe() {
        const faits = lireExos();
        document.querySelectorAll("#exercices-home .exo-card").forEach(carte => {
            const btn = carte.querySelector("[data-eid]");
            if (!btn) return;
            const res = faits[btn.dataset.eid];
            if (!res) return;
            carte.classList.add("exo-reussi");
            const rang = document.createElement("div");
            rang.className = "exo-etoiles";
            rang.setAttribute("aria-label", `Réussi avec ${res.etoiles} étoile${res.etoiles > 1 ? "s" : ""} sur 3`);
            rang.innerHTML = etoilesHtml(res.etoiles);
            btn.insertAdjacentElement("beforebegin", rang);
            btn.textContent = "Rejouer →";
        });
    }

    function exoDebut() {
        const jeu = document.getElementById("sudoku-game");
        const plan = jeu && jeu.querySelector(".exo-layout");
        if (!plan) return;
        const bande = document.createElement("div");
        bande.className = "exo-avancement";
        bande.innerHTML = `
            <span id="exo-av-texte" aria-live="polite"></span>
            <div class="exo-av-barre" aria-hidden="true"><div id="exo-av-jauge"></div></div>
            <span class="exo-av-essais" id="exo-av-essais"></span>`;
        plan.insertAdjacentElement("beforebegin", bande);
        exoMaj();
    }

    function exoMaj() {
        const texte = document.getElementById("exo-av-texte");
        if (!texte) return;
        const { total, remplies } = compter();
        texte.textContent = `${remplies} / ${total} cases remplies`;
        document.getElementById("exo-av-jauge").style.width = (total ? (remplies / total) * 100 : 0) + "%";
        const n = (exoCurrent && tentatives[exoCurrent.id]) || 0;
        document.getElementById("exo-av-essais").textContent = n ? `Essai n°${n + 1}` : "3 étoiles si tu réussis du premier coup";
        const verif = document.getElementById("exo-check");
        if (verif) verif.classList.toggle("exo-pret", total > 0 && remplies === total);
    }

    function exoVerifie(correctes, total) {
        if (typeof exoCurrent === "undefined" || !exoCurrent) return;
        const id = exoCurrent.id;
        tentatives[id] = (tentatives[id] || 0) + 1;
        const jeu = document.getElementById("sudoku-game");
        const ancienne = jeu.querySelector(".exo-victoire");
        if (ancienne) ancienne.remove();

        if (correctes !== total) {
            rejouer(document.getElementById("exo-svg-wrap"), "exo-secousse");
            exoMaj();
            return;
        }

        const etoiles = tentatives[id] === 1 ? 3 : tentatives[id] === 2 ? 2 : 1;
        delete tentatives[id];
        const faits = lireExos();
        const record = faits[id] ? Math.max(faits[id].etoiles || 0, etoiles) : etoiles;
        faits[id] = { etoiles: record, date: new Date().toLocaleDateString("fr-FR") };
        ecrireExos(faits);
        if (typeof Jeu !== "undefined") Jeu.surProgression();

        const liste = typeof getAllExercises === "function" ? getAllExercises() : [];
        const suivant = liste.find(e => e.id !== id && !faits[e.id]);
        const panneau = document.createElement("div");
        panneau.className = "exo-victoire";
        panneau.innerHTML = `
            <div class="exo-victoire-etoiles" role="img" aria-label="${etoiles} étoile${etoiles > 1 ? "s" : ""} sur 3">${etoilesHtml(etoiles)}</div>
            <h3>${etoiles === 3 ? "Sans faute du premier coup !" : etoiles === 2 ? "Réussi au deuxième essai !" : "Exercice réussi !"}</h3>
            <p>${etoiles === 3 ? "Tu maîtrises cet exercice." : "Rejoue-le pour décrocher les 3 étoiles."}</p>
            <div class="exo-victoire-actions">
                ${suivant ? `<button type="button" class="btn-primary" id="exo-suivant">Exercice suivant →</button>` : ""}
                <button type="button" class="btn-secondary" id="exo-liste">← Tous les exercices</button>
            </div>`;
        jeu.appendChild(panneau);
        panneau.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const bSuivant = panneau.querySelector("#exo-suivant");
        if (bSuivant) bSuivant.addEventListener("click", () => { startExercice(suivant.id); window.scrollTo({ top: 0, behavior: "smooth" }); });
        panneau.querySelector("#exo-liste").addEventListener("click", () => { renderExercicesList(); window.scrollTo({ top: 0, behavior: "smooth" }); });
        exoMaj();
    }

    document.addEventListener("DOMContentLoaded", initClavier);

    return { quizDebut, quizQuestion, quizReponse, quizFin, exoListe, exoDebut, exoMaj, exoVerifie, xpExercices };
})();
