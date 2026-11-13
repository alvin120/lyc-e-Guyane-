// ============================================================
// PARCOURS — Les leçons se lisent étape par étape, comme un niveau de jeu
// La leçon (HTML déjà affiché) est découpée à chaque sous-titre <h3>.
// L'élève avance avec « Continuer » ; au bout, la leçon est validée
// et il gagne ses XP. Une leçon sans sous-titres reste affichée d'un bloc.
// ============================================================

const Parcours = (() => {

    const MIN_ETAPES = 2;

    // Regroupe le contenu : [intro] puis une étape par <h3>
    function decouper(conteneur) {
        const intro = [], etapes = [];
        let courante = null;
        [...conteneur.childNodes].forEach(n => {
            if (n.nodeType === 3 && !n.textContent.trim()) return; // espaces entre balises
            if (n.nodeType === 1 && n.tagName === "H3") { courante = [n]; etapes.push(courante); }
            else (courante || intro).push(n);
        });
        return { intro, etapes };
    }

    function quizConseille(matiere) {
        if (typeof QUIZZES === "undefined") return null;
        const liste = QUIZZES.filter(q => q.subject === matiere);
        const faits = typeof state !== "undefined" ? (state.quizDone || {}) : {};
        return liste.find(q => !faits[q.id]) || liste[0] || null;
    }

    // Retourne true si le parcours est monté, false si la leçon reste telle quelle.
    // options : { dejaLue: bool, terminer: fn appelée une seule fois à la fin }
    function monter(conteneur, lecon, options) {
        const { intro, etapes } = decouper(conteneur);
        if (etapes.length < MIN_ETAPES) return false;

        const total = etapes.length;
        let position = 0;              // index de la dernière étape visible
        let fini = !!options.dejaLue;

        // --- Barre d'avancement (reste visible en haut pendant la lecture) ---
        const barre = document.createElement("div");
        barre.className = "parcours-barre";
        barre.innerHTML = `
            <span class="parcours-compteur" id="parcours-compteur" aria-live="polite"></span>
            <div class="parcours-segments" aria-hidden="true">
                ${etapes.map(() => `<span class="parcours-seg"></span>`).join("")}
            </div>
            <button type="button" class="parcours-tout" id="parcours-tout">Tout afficher</button>`;

        // --- Sections ---
        const frag = document.createDocumentFragment();
        const secIntro = document.createElement("section");
        secIntro.className = "parcours-intro";
        intro.forEach(n => secIntro.appendChild(n));

        const sections = etapes.map((noeuds, i) => {
            const s = document.createElement("section");
            s.className = "parcours-etape";
            const puce = document.createElement("span");
            puce.className = "parcours-puce";
            puce.textContent = `Étape ${i + 1}`;
            s.appendChild(puce);
            noeuds.forEach(n => s.appendChild(n));
            return s;
        });

        // --- Bouton Continuer ---
        const suite = document.createElement("div");
        suite.className = "parcours-suite";
        suite.innerHTML = `<button type="button" class="btn-primary parcours-continuer" id="parcours-continuer"></button>`;

        // --- Écran de fin ---
        const fin = document.createElement("div");
        fin.className = "parcours-fin hidden";

        frag.append(secIntro, barre, ...sections, suite, fin);
        conteneur.innerHTML = "";
        conteneur.appendChild(frag);

        const compteur = barre.querySelector("#parcours-compteur");
        const segs = [...barre.querySelectorAll(".parcours-seg")];
        const btnTout = barre.querySelector("#parcours-tout");
        const btnSuite = suite.querySelector("#parcours-continuer");

        function afficherFin(vientDeFinir) {
            const quiz = quizConseille(lecon.subject);
            fin.innerHTML = `
                <div class="parcours-fin-emoji" aria-hidden="true">${vientDeFinir ? "🎉" : "✅"}</div>
                <h3>${vientDeFinir ? "Leçon terminée, bravo !" : "Leçon déjà terminée"}</h3>
                <p>${vientDeFinir
                    ? "Tu as lu toutes les étapes. Vérifie maintenant ce que tu as retenu."
                    : "Tu peux la relire quand tu veux pour réviser."}</p>
                <div class="parcours-fin-actions">
                    ${quiz ? `<button type="button" class="btn-primary" id="parcours-quiz">🎯 Faire le quiz</button>` : ""}
                    <button type="button" class="btn-secondary" id="parcours-retour">← Retour aux leçons</button>
                </div>`;
            fin.classList.remove("hidden");
            if (vientDeFinir) { fin.classList.remove("parcours-pop"); void fin.offsetWidth; fin.classList.add("parcours-pop"); }

            const bQuiz = fin.querySelector("#parcours-quiz");
            if (bQuiz) bQuiz.addEventListener("click", () => {
                if (typeof navigateTo !== "function" || typeof startQuiz !== "function") return;
                navigateTo("quiz");
                startQuiz(quiz.id);
            });
            fin.querySelector("#parcours-retour").addEventListener("click", () => {
                const retour = document.getElementById("back-to-list");
                if (retour) retour.click();
                if (typeof renderCoursList === "function") renderCoursList(); // met à jour l'étiquette « Lu »
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        function rafraichir() {
            sections.forEach((s, i) => s.classList.toggle("a-venir", i > position));
            segs.forEach((s, i) => s.classList.toggle("fait", i <= position));
            compteur.textContent = `Étape ${position + 1} sur ${total}`;
            const dernier = position >= total - 1;
            suite.classList.toggle("hidden", dernier);
            btnTout.classList.toggle("hidden", dernier);
            if (!dernier) btnSuite.textContent = position === total - 2 ? "Dernière étape →" : "Continuer →";
        }

        function terminer() {
            const vientDeFinir = !fini;
            if (vientDeFinir) {
                fini = true;
                if (typeof options.terminer === "function") options.terminer();
            }
            afficherFin(vientDeFinir);
        }

        function avancer() {
            if (position >= total - 1) return;
            position++;
            rafraichir();
            const s = sections[position];
            s.classList.remove("parcours-entree");
            void s.offsetWidth;
            s.classList.add("parcours-entree");
            s.scrollIntoView({ behavior: "smooth", block: "start" });
            if (position === total - 1) terminer();
        }

        btnSuite.addEventListener("click", avancer);
        btnTout.addEventListener("click", () => {
            position = total - 1;
            rafraichir();
            terminer();
        });

        // Leçon déjà lue : tout est ouvert d'emblée, pour réviser sans cliquer
        if (fini) { position = total - 1; rafraichir(); afficherFin(false); }
        else rafraichir();

        return true;
    }

    return { monter };
})();
