// ============================================================
// DATA — Cours, Quiz, Forum
// ============================================================

const SUBJECTS = {
    maths:    { label: "Mathématiques", icon: "📐", color: "#3b82f6" },
    francais: { label: "Français",       icon: "📖", color: "#8b5cf6" },
    histgeo:  { label: "Histoire-Géo",   icon: "🗺️", color: "#f59e0b" },
    svt:      { label: "SVT",            icon: "🌿", color: "#22c55e" },
    physchim: { label: "Physique-Chimie",icon: "⚗️", color: "#ef4444" },
    anglais:  { label: "Anglais",        icon: "🌍", color: "#06b6d4" },
    ses:      { label: "SES",            icon: "📊", color: "#ec4899" },
    philo:    { label: "Philosophie",    icon: "🤔", color: "#6366f1" },
};

// ---- COURS ----
const COURSES = [
    // MATHS
    {
        id: "m1", subject: "maths", title: "Les fonctions affines",
        level: "2nde", duration: "20 min",
        summary: "Une fonction affine est de la forme f(x) = ax + b, où a est la pente et b l'ordonnée à l'origine.",
        content: `
<h2>📐 Les fonctions affines</h2>
<div class="lesson-meta"><span>2nde</span><span>20 min</span></div>
${LESSON_ANIMS.m1 || ''}
<h3>Définition</h3>
<p>Une <strong>fonction affine</strong> est une fonction de la forme :</p>
<div class="formula">f(x) = ax + b</div>
<ul>
  <li><strong>a</strong> : le coefficient directeur (pente de la droite)</li>
  <li><strong>b</strong> : l'ordonnée à l'origine</li>
</ul>

<h3>Représentation graphique</h3>
<p>La courbe représentative d'une fonction affine est une <strong>droite</strong>.</p>
<ul>
  <li>Si a > 0 : la droite monte</li>
  <li>Si a < 0 : la droite descend</li>
  <li>Si a = 0 : la droite est horizontale (fonction constante)</li>
</ul>

<h3>Exemple concret – Guyane</h3>
<p>Un taxi à Cayenne facture 2,50€ de prise en charge + 1,20€ par km.</p>
<div class="formula">f(x) = 1,20x + 2,50</div>
<p>Pour 10 km : f(10) = 1,20 × 10 + 2,50 = <strong>14,50€</strong></p>

<h3>Méthode – Lire le coefficient directeur</h3>
<p>Pour deux points A(x₁; y₁) et B(x₂; y₂) sur la droite :</p>
<div class="formula">a = (y₂ - y₁) / (x₂ - x₁)</div>

<div class="lesson-tip">💡 <strong>Astuce bac</strong> : Pour trouver l'équation d'une droite, utilise toujours deux points dont tu connais les coordonnées.</div>
`
    },
    {
        id: "m2", subject: "maths", title: "Les probabilités de base",
        level: "1ère", duration: "25 min",
        summary: "Calcul de probabilités simples, événements, union et intersection.",
        content: `
<h2>📐 Les probabilités de base</h2>
<div class="lesson-meta"><span>1ère</span><span>25 min</span></div>
${LESSON_ANIMS.m2 || ''}
<h3>Définition</h3>
<p>La <strong>probabilité</strong> d'un événement A est le rapport :</p>
<div class="formula">P(A) = Nombre de cas favorables / Nombre de cas possibles</div>

<h3>Propriétés fondamentales</h3>
<ul>
  <li>0 ≤ P(A) ≤ 1</li>
  <li>P(événement certain) = 1</li>
  <li>P(événement impossible) = 0</li>
  <li>P(Ā) = 1 − P(A) (événement contraire)</li>
</ul>

<h3>Exemple – Faune de Guyane</h3>
<p>Dans un groupe de 20 animaux observés en forêt amazonienne : 8 oiseaux, 5 reptiles, 4 mammifères, 3 insectes.</p>
<p>P(tirer un oiseau au hasard) = 8/20 = <strong>0,4 soit 40%</strong></p>

<div class="lesson-tip">💡 La somme de toutes les probabilités d'un univers équiprobable vaut toujours 1.</div>
`
    },
    {
        id: "m3", subject: "maths", title: "Dérivées — Introduction",
        level: "Terminale", duration: "30 min",
        summary: "Définition de la dérivée, règles de dérivation des fonctions usuelles.",
        content: `
<h2>📐 Les dérivées — Introduction</h2>
<div class="lesson-meta"><span>Terminale</span><span>30 min</span></div>
${LESSON_ANIMS.m3 || ''}
<h3>Définition</h3>
<p>La dérivée f'(a) mesure le <strong>taux de variation</strong> de f au voisinage de a :</p>
<div class="formula">f'(a) = lim(h→0) [ f(a+h) − f(a) ] / h</div>

<h3>Dérivées usuelles</h3>
<table class="lesson-table">
  <tr><th>Fonction f(x)</th><th>Dérivée f'(x)</th></tr>
  <tr><td>xⁿ</td><td>n·xⁿ⁻¹</td></tr>
  <tr><td>√x</td><td>1 / (2√x)</td></tr>
  <tr><td>sin(x)</td><td>cos(x)</td></tr>
  <tr><td>cos(x)</td><td>−sin(x)</td></tr>
  <tr><td>eˣ</td><td>eˣ</td></tr>
  <tr><td>ln(x)</td><td>1/x</td></tr>
</table>

<div class="lesson-tip">💡 La dérivée en un point = la pente de la tangente à la courbe en ce point.</div>
`
    },

    // HISTOIRE-GEO
    {
        id: "hg1", subject: "histgeo", title: "La Guyane : territoire et enjeux",
        level: "2nde", duration: "30 min",
        summary: "Géographie physique et humaine de la Guyane française, un territoire d'Outre-Mer unique.",
        content: `
<h2>🗺️ La Guyane : territoire et enjeux</h2>
<div class="lesson-meta"><span>2nde</span><span>30 min</span></div>
${LESSON_ANIMS.hg1 || ''}
<h3>Un territoire d'exception</h3>
<p>La Guyane est un <strong>département et région d'outre-mer (DROM)</strong> français situé en Amérique du Sud. Avec ses 83 534 km², c'est le plus grand territoire de France métropolitaine ou non.</p>

<h3>Caractéristiques physiques</h3>
<ul>
  <li>🌿 <strong>90% de forêt amazonienne</strong> couvrant le territoire</li>
  <li>🌊 Bordé par l'Océan Atlantique au nord</li>
  <li>Frontières : Brésil au sud et à l'est, Suriname à l'ouest</li>
  <li>Fleuves majeurs : Maroni, Oyapock, Mana</li>
</ul>

<h3>Population et villes</h3>
<ul>
  <li>Environ <strong>300 000 habitants</strong> (recensement 2023)</li>
  <li><strong>Cayenne</strong> : capitale et ville principale (~60 000 hab.)</li>
  <li>Saint-Laurent-du-Maroni : 2ème ville en croissance rapide</li>
  <li>Kourou : connue pour le Centre Spatial Guyanais (CSG)</li>
</ul>

<h3>Les enjeux majeurs</h3>
<ul>
  <li>🚀 Le <strong>Centre Spatial de Kourou</strong> (lanceur Ariane)</li>
  <li>🥇 L'orpaillage légal et illégal (chercheurs d'or)</li>
  <li>🌱 La préservation de la biodiversité amazonienne</li>
  <li>📈 La pression démographique et l'immigration</li>
</ul>

<div class="lesson-tip">💡 La Guyane est le seul territoire de l'Union Européenne situé sur le continent américain.</div>
`
    },
    {
        id: "hg2", subject: "histgeo", title: "La Seconde Guerre mondiale",
        level: "1ère", duration: "35 min",
        summary: "Les grandes phases du conflit, la France libre et la résistance.",
        content: `
<h2>🗺️ La Seconde Guerre mondiale</h2>
<div class="lesson-meta"><span>1ère</span><span>35 min</span></div>
${LESSON_ANIMS.hg2 || ''}
<h3>Les grandes dates</h3>
<ul>
  <li><strong>1er septembre 1939</strong> : invasion de la Pologne par l'Allemagne nazie</li>
  <li><strong>Juin 1940</strong> : défaite française, armistice de Pétain</li>
  <li><strong>18 juin 1940</strong> : Appel du Général de Gaulle depuis Londres</li>
  <li><strong>22 juin 1941</strong> : opération Barbarossa (invasion de l'URSS)</li>
  <li><strong>7 déc. 1941</strong> : attaque de Pearl Harbor, entrée des USA</li>
  <li><strong>6 juin 1944</strong> : Débarquement en Normandie (D-Day)</li>
  <li><strong>8 mai 1945</strong> : capitulation de l'Allemagne nazie</li>
  <li><strong>2 sept. 1945</strong> : capitulation du Japon → fin de la guerre</li>
</ul>

<h3>La Guyane pendant la guerre</h3>
<p>La Guyane a d'abord suivi le régime de Vichy avant de basculer vers la France Libre en <strong>mars 1943</strong>, grâce à l'action du gouverneur Félix Eboué, né en Guyane.</p>

<div class="lesson-tip">💡 Félix Eboué, né à Cayenne en 1884, fut le premier haut fonctionnaire colonial noir à rallier de Gaulle dès 1940. Il repose au Panthéon.</div>
`
    },

    // SVT
    {
        id: "svt1", subject: "svt", title: "La biodiversité amazonienne",
        level: "2nde", duration: "25 min",
        summary: "La forêt amazonienne guyanaise abrite une des plus grandes biodiversités du monde.",
        content: `
<h2>🌿 La biodiversité amazonienne en Guyane</h2>
<div class="lesson-meta"><span>2nde</span><span>25 min</span></div>
${LESSON_ANIMS.svt1 || ''}
<h3>Qu'est-ce que la biodiversité ?</h3>
<p>La <strong>biodiversité</strong> désigne la variété du vivant à trois niveaux :</p>
<ul>
  <li>Diversité des <strong>espèces</strong></li>
  <li>Diversité <strong>génétique</strong> au sein d'une espèce</li>
  <li>Diversité des <strong>écosystèmes</strong></li>
</ul>

<h3>La forêt guyanaise en chiffres</h3>
<ul>
  <li>🌳 Plus de <strong>5 000 espèces végétales</strong> recensées</li>
  <li>🦜 Plus de <strong>700 espèces d'oiseaux</strong> (dont l'Ara rouge)</li>
  <li>🐆 Mammifères emblématiques : jaguar, tapir, loutre géante</li>
  <li>🐠 Plus de <strong>500 espèces de poissons</strong> d'eau douce</li>
  <li>🐸 Grenouilles dendrobates (grenouilles venimeuses)</li>
</ul>

<h3>Les menaces</h3>
<ul>
  <li>🪵 La déforestation (routes, orpaillage)</li>
  <li>☠️ La pollution au mercure des fleuves (orpaillage illégal)</li>
  <li>🌡️ Le changement climatique</li>
  <li>La fragmentation des habitats</li>
</ul>

<h3>La protection</h3>
<p>Le <strong>Parc Amazonien de Guyane</strong> (créé en 2007) est le plus grand parc national de France avec 3,4 millions d'hectares. Il protège une biodiversité exceptionnelle.</p>

<div class="lesson-tip">💡 La Guyane abrite environ 10% de la biodiversité mondiale sur moins de 0,1% de la surface terrestre.</div>
`
    },
    {
        id: "svt2", subject: "svt", title: "La cellule — Unité du vivant",
        level: "2nde", duration: "20 min",
        summary: "Structure et fonction de la cellule, cellule procaryote vs eucaryote.",
        content: `
<h2>🌿 La cellule — Unité du vivant</h2>
<div class="lesson-meta"><span>2nde</span><span>20 min</span></div>
${LESSON_ANIMS.svt2 || ''}
<h3>La théorie cellulaire</h3>
<ul>
  <li>Tout être vivant est composé d'<strong>une ou plusieurs cellules</strong></li>
  <li>La cellule est l'<strong>unité fonctionnelle</strong> du vivant</li>
  <li>Toute cellule provient d'une cellule préexistante</li>
</ul>

<h3>Cellule procaryote vs eucaryote</h3>
<table class="lesson-table">
  <tr><th></th><th>Procaryote</th><th>Eucaryote</th></tr>
  <tr><td>Noyau</td><td>Absent</td><td>Présent</td></tr>
  <tr><td>Taille</td><td>1–10 µm</td><td>10–100 µm</td></tr>
  <tr><td>Exemples</td><td>Bactéries</td><td>Animaux, plantes, champignons</td></tr>
</table>

<h3>Organites principaux (cellule eucaryote)</h3>
<ul>
  <li><strong>Noyau</strong> : contient l'ADN (information génétique)</li>
  <li><strong>Mitochondries</strong> : production d'énergie (ATP)</li>
  <li><strong>Chloroplastes</strong> : photosynthèse (cellules végétales)</li>
  <li><strong>Ribosome</strong> : synthèse des protéines</li>
</ul>

<div class="lesson-tip">💡 Un être humain est composé d'environ 37 000 milliards de cellules.</div>
`
    },

    // FRANÇAIS
    {
        id: "fr1", subject: "francais", title: "Le commentaire littéraire",
        level: "1ère", duration: "40 min",
        summary: "Méthode complète pour rédiger un commentaire littéraire en deux axes.",
        content: `
<h2>📖 Le commentaire littéraire — Méthode</h2>
<div class="lesson-meta"><span>1ère</span><span>40 min</span></div>
${LESSON_ANIMS.fr1 || ''}
<h3>Structure générale</h3>
<p>Le commentaire littéraire se compose de :</p>
<ul>
  <li>Une <strong>introduction</strong> (amorce, présentation du texte, problématique, annonce du plan)</li>
  <li>Deux ou trois <strong>axes de lecture</strong> avec sous-parties</li>
  <li>Une <strong>conclusion</strong> (bilan + ouverture)</li>
</ul>

<h3>L'introduction</h3>
<ol>
  <li><strong>Amorce</strong> : situer le texte dans son contexte (auteur, époque, mouvement)</li>
  <li><strong>Présentation</strong> : titre, genre, thème principal</li>
  <li><strong>Problématique</strong> : la question à laquelle ton plan répond</li>
  <li><strong>Annonce du plan</strong> : "Dans un premier temps... puis..."</li>
</ol>

<h3>Rédiger un axe</h3>
<p>Chaque sous-partie suit le schéma :</p>
<div class="formula">IDÉE → CITATION → ANALYSE</div>
<ul>
  <li><strong>Idée</strong> : formule ton argument clairement</li>
  <li><strong>Citation</strong> : extrait précis entre guillemets avec ligne</li>
  <li><strong>Analyse</strong> : explique pourquoi cette citation prouve ton idée, identifie les procédés stylistiques</li>
</ul>

<h3>Procédés stylistiques à connaître</h3>
<ul>
  <li><strong>Métaphore</strong> : comparaison sans outil de comparaison</li>
  <li><strong>Anaphore</strong> : répétition en début de phrase</li>
  <li><strong>Oxymore</strong> : association de termes contraires</li>
  <li><strong>Hyperbole</strong> : exagération expressive</li>
  <li><strong>Champ lexical</strong> : ensemble de mots liés à un thème</li>
</ul>

<div class="lesson-tip">💡 La problématique doit être une vraie question ouverte, pas une question avec "oui" ou "non" comme réponse.</div>
`
    },

    // PHYSIQUE-CHIMIE
    {
        id: "pc1", subject: "physchim", title: "Les lois de Newton",
        level: "1ère", duration: "30 min",
        summary: "Les trois lois fondamentales de la mécanique classique.",
        content: `
<h2>⚗️ Les lois de Newton</h2>
<div class="lesson-meta"><span>1ère</span><span>30 min</span></div>
${LESSON_ANIMS.pc1 || ''}
<h3>Première loi — Principe d'inertie</h3>
<p>Tout corps persiste dans son état de <strong>repos</strong> ou de <strong>mouvement rectiligne uniforme</strong> s'il n'est soumis à aucune force ou à des forces qui se compensent.</p>
<div class="formula">ΣF = 0 ⟺ mouvement uniforme</div>

<h3>Deuxième loi — Principe fondamental</h3>
<p>L'accélération d'un objet est proportionnelle à la somme des forces appliquées :</p>
<div class="formula">ΣF⃗ = m × a⃗</div>
<p>Où m est la masse (kg) et a est l'accélération (m/s²)</p>

<h3>Troisième loi — Action–Réaction</h3>
<p>Si A exerce une force sur B, alors B exerce sur A une force <strong>égale en intensité, opposée en direction</strong>.</p>

<h3>Application — Lancer depuis Kourou</h3>
<p>Ariane 6 (masse ≈ 530 000 kg) produit une poussée de 13 MN au décollage.</p>
<div class="formula">a = F/m = 13×10⁶ / 530 000 ≈ 24,5 m/s²</div>

<div class="lesson-tip">💡 La base de lancement de Kourou a été choisie car sa proximité avec l'équateur (5°N) permet de profiter au maximum de la rotation terrestre.</div>
`
    },

    // ANGLAIS
    {
        id: "en1", subject: "anglais", title: "Le présent parfait (Present Perfect)",
        level: "2nde", duration: "20 min",
        summary: "Formation et emplois du present perfect en anglais.",
        content: `
<h2>🌍 Le Present Perfect</h2>
<div class="lesson-meta"><span>2nde</span><span>20 min</span></div>
${LESSON_ANIMS.en1 || ''}
<h3>Formation</h3>
<div class="formula">Subject + have/has + past participle</div>
<ul>
  <li>I <strong>have visited</strong> Cayenne.</li>
  <li>She <strong>has seen</strong> a jaguar in the Amazon.</li>
</ul>

<h3>Emplois principaux</h3>
<ul>
  <li><strong>Expérience de vie</strong> : I have never seen snow.</li>
  <li><strong>Résultat présent</strong> : She has lost her keys. (les clés sont toujours perdues)</li>
  <li><strong>Récence</strong> : avec <em>just, recently, lately</em></li>
  <li><strong>Durée</strong> : avec <em>for, since</em> → I have lived here <em>for</em> 5 years.</li>
</ul>

<h3>Present Perfect vs Prétérit</h3>
<table class="lesson-table">
  <tr><th>Present Perfect</th><th>Prétérit</th></tr>
  <tr><td>Lien avec le présent</td><td>Passé révolu, date précise</td></tr>
  <tr><td>I have eaten</td><td>I ate (yesterday)</td></tr>
</table>

<div class="lesson-tip">💡 Avec "yesterday", "last year", "in 2020" → toujours le prétérit, jamais le present perfect.</div>
`
    },

    // SES
    {
        id: "ses1", subject: "ses", title: "L'offre et la demande",
        level: "2nde", duration: "25 min",
        summary: "Mécanismes de base du marché : courbes d'offre, de demande et prix d'équilibre.",
        content: `
<h2>📊 L'offre et la demande</h2>
<div class="lesson-meta"><span>2nde</span><span>25 min</span></div>
${LESSON_ANIMS.ses1 || ''}
<h3>Le marché</h3>
<p>Un <strong>marché</strong> est un lieu (physique ou virtuel) où se rencontrent l'offre et la demande pour fixer un prix.</p>

<h3>La demande</h3>
<ul>
  <li>Relation inverse entre prix et quantité demandée</li>
  <li>Si le prix ↑ → la demande ↓ (loi de la demande)</li>
  <li>Déterminants : revenu, prix des biens substituts, goûts</li>
</ul>

<h3>L'offre</h3>
<ul>
  <li>Relation directe entre prix et quantité offerte</li>
  <li>Si le prix ↑ → l'offre ↑ (loi de l'offre)</li>
  <li>Déterminants : coûts de production, technologie</li>
</ul>

<h3>L'équilibre de marché</h3>
<p>Le <strong>prix d'équilibre</strong> est atteint quand l'offre = la demande. C'est le prix qui "vide" le marché.</p>

<h3>Exemple — Marché du bois en Guyane</h3>
<p>L'exploitation forestière encadrée crée un marché du bois local. La régulation du Parc Amazonien limite l'offre, ce qui influence le prix.</p>

<div class="lesson-tip">💡 Un bien "inférieur" est un bien dont la demande baisse quand le revenu augmente (ex: manioc local vs produits importés).</div>
`
    },

    // PHILO
    {
        id: "ph1", subject: "philo", title: "La liberté — Notion centrale",
        level: "Terminale", duration: "35 min",
        summary: "Définition philosophique de la liberté, libre arbitre, déterminisme.",
        content: `
<h2>🤔 La Liberté — Notion centrale</h2>
<div class="lesson-meta"><span>Terminale</span><span>35 min</span></div>
${LESSON_ANIMS.ph1 || ''}
<h3>Définitions</h3>
<ul>
  <li><strong>Liberté naturelle</strong> : absence de contrainte physique</li>
  <li><strong>Libre arbitre</strong> : capacité à choisir sans être déterminé</li>
  <li><strong>Liberté politique</strong> : droit de faire ce que la loi autorise</li>
</ul>

<h3>Le problème du déterminisme</h3>
<p><strong>Thèse déterministe</strong> : Tout événement est la conséquence nécessaire de causes antérieures. Si c'est vrai, le libre arbitre est une illusion.</p>
<p><strong>Thèse libertarienne</strong> (philosophique) : Il existe une causalité par liberté, irréductible aux causes naturelles.</p>

<h3>Les auteurs clés</h3>
<ul>
  <li><strong>Descartes</strong> : le libre arbitre est infini, c'est ce qui nous rend à l'image de Dieu</li>
  <li><strong>Spinoza</strong> : la liberté est la nécessité comprise — "les hommes se croient libres parce qu'ils ignorent les causes"</li>
  <li><strong>Sartre</strong> : "L'existence précède l'essence" — l'homme est "condamné à être libre"</li>
  <li><strong>Kant</strong> : la liberté morale est la soumission volontaire à la loi morale</li>
</ul>

<h3>Citations à retenir</h3>
<blockquote>"L'homme est condamné à être libre." — Jean-Paul Sartre</blockquote>
<blockquote>"La liberté consiste à faire ce que l'on veut." — Rousseau</blockquote>

<div class="lesson-tip">💡 Ne confonds pas liberté et libertinage. La liberté philosophique implique toujours une responsabilité.</div>
`
    },
];

// ---- QUIZ ----
const QUIZZES = [
    {
        id: "qm1", subject: "maths", title: "Fonctions affines",
        questions: [
            {
                q: "Quelle est la forme générale d'une fonction affine ?",
                options: ["f(x) = ax²+b", "f(x) = ax+b", "f(x) = a/x", "f(x) = aˣ"],
                answer: 1,
                explication: "Une fonction affine est toujours de la forme f(x) = ax + b, où a est la pente et b l'ordonnée à l'origine."
            },
            {
                q: "Un taxi facture 3€ + 1,50€/km. Quel est le coefficient directeur ?",
                options: ["3", "1,50", "4,50", "0"],
                answer: 1,
                explication: "Le coefficient directeur a représente le tarif au km, soit 1,50€. Le 3€ est l'ordonnée à l'origine b."
            },
            {
                q: "Si a < 0 dans f(x) = ax + b, la droite est :",
                options: ["Horizontale", "Montante", "Descendante", "Verticale"],
                answer: 2,
                visual: QUIZ_VISUALS['qm1-2'],
                explication: "Quand a < 0, la fonction décroît : la droite descend de gauche à droite."
            },
            {
                q: "Quelle est l'image de x = 4 par f(x) = 2x − 1 ?",
                options: ["6", "7", "8", "9"],
                answer: 1,
                explication: "f(4) = 2×4 − 1 = 8 − 1 = 7."
            },
            {
                q: "Deux points A(0;3) et B(2;7). Quel est le coefficient directeur ?",
                options: ["2", "3", "4", "1"],
                answer: 0,
                explication: "a = (7−3)/(2−0) = 4/2 = 2."
            }
        ]
    },
    {
        id: "qm2", subject: "maths", title: "Probabilités",
        questions: [
            {
                q: "P(A) = 0,3. Quelle est la probabilité de l'événement contraire ?",
                options: ["0,3", "0,7", "1,3", "0"],
                answer: 1,
                explication: "P(Ā) = 1 − P(A) = 1 − 0,3 = 0,7."
            },
            {
                q: "Dans une classe de 30 élèves, 12 sont des filles. P(tirer une fille au hasard) ?",
                options: ["0,3", "0,4", "0,5", "0,6"],
                answer: 1,
                explication: "P = 12/30 = 0,4."
            },
            {
                q: "La probabilité d'un événement certain vaut :",
                options: ["0", "0,5", "1", "Elle varie"],
                answer: 2,
                explication: "Un événement certain a une probabilité de 1."
            },
            {
                q: "On lance un dé à 6 faces. P(obtenir un nombre pair) ?",
                options: ["1/6", "1/3", "1/2", "2/3"],
                answer: 2,
                visual: QUIZ_VISUALS['qm2-3'],
                explication: "Nombres pairs : 2, 4, 6 → 3 cas favorables sur 6. P = 3/6 = 1/2."
            },
            {
                q: "On tire une carte dans un jeu de 52 cartes. P(obtenir un as) ?",
                options: ["1/52", "1/13", "1/4", "4/52"],
                answer: 1,
                explication: "Il y a 4 as dans 52 cartes. P = 4/52 = 1/13."
            }
        ]
    },
    {
        id: "qhg1", subject: "histgeo", title: "La Guyane",
        questions: [
            {
                q: "Quelle est la superficie de la Guyane ?",
                options: ["43 000 km²", "63 000 km²", "83 534 km²", "100 000 km²"],
                answer: 2,
                explication: "La Guyane couvre 83 534 km², ce qui en fait le plus grand territoire de France."
            },
            {
                q: "Quel pourcentage du territoire guyanais est recouvert de forêt ?",
                options: ["50%", "70%", "80%", "90%"],
                answer: 3,
                explication: "Environ 90% du territoire guyanais est couvert par la forêt amazonienne."
            },
            {
                q: "Quelle ville abrite le Centre Spatial Guyanais ?",
                options: ["Cayenne", "Saint-Laurent", "Kourou", "Maripasoula"],
                answer: 2,
                visual: QUIZ_VISUALS['qhg1-2'],
                explication: "Le Centre Spatial Guyanais (CSG) est situé à Kourou, sur la côte atlantique."
            },
            {
                q: "Qui est Félix Eboué ?",
                options: [
                    "Un explorateur du 18e siècle",
                    "Un gouverneur né à Cayenne qui rallia de Gaulle en 1940",
                    "Un orpailleur célèbre",
                    "Le fondateur de Cayenne"
                ],
                answer: 1,
                explication: "Félix Eboué, né à Cayenne en 1884, fut le premier haut fonctionnaire colonial à rallier la France Libre. Il repose au Panthéon."
            },
            {
                q: "Quel fleuve forme la frontière avec le Brésil ?",
                options: ["Maroni", "Mana", "Oyapock", "Approuague"],
                answer: 2,
                visual: QUIZ_VISUALS['qhg1-4'],
                explication: "L'Oyapock forme la frontière entre la Guyane et le Brésil. Le Maroni sépare la Guyane du Suriname."
            }
        ]
    },
    {
        id: "qsvt1", subject: "svt", title: "Biodiversité en Guyane",
        questions: [
            {
                q: "Combien d'espèces végétales sont recensées en Guyane ?",
                options: ["500", "1000", "5000", "10000"],
                answer: 2,
                explication: "La Guyane compte plus de 5 000 espèces végétales recensées, témoignant de sa biodiversité exceptionnelle."
            },
            {
                q: "Quel est le plus grand parc national de France ?",
                options: ["Parc des Écrins", "Parc Amazonien de Guyane", "Parc de la Vanoise", "Parc des Pyrénées"],
                answer: 1,
                explication: "Le Parc Amazonien de Guyane, créé en 2007, couvre 3,4 millions d'hectares."
            },
            {
                q: "Le mercure dans les fleuves de Guyane provient principalement de :",
                options: ["Usines industrielles", "Agriculture", "Orpaillage illégal", "Déchets ménagers"],
                answer: 2,
                explication: "L'orpaillage illégal (chercheurs d'or) utilise le mercure pour amalgamer l'or, polluant ainsi les cours d'eau."
            },
            {
                q: "La cellule est l'unité ______ du vivant.",
                options: ["chimique", "fonctionnelle", "optique", "magnétique"],
                answer: 1,
                explication: "La cellule est l'unité fonctionnelle et structurale du vivant (théorie cellulaire)."
            },
            {
                q: "Les mitochondries sont responsables de :",
                options: ["La photosynthèse", "La synthèse des protéines", "La production d'énergie (ATP)", "La division cellulaire"],
                answer: 2,
                visual: QUIZ_VISUALS['qsvt1-4'],
                explication: "Les mitochondries produisent l'ATP (adénosine triphosphate), la molécule énergétique de la cellule, via la respiration cellulaire."
            }
        ]
    },
    {
        id: "qfr1", subject: "francais", title: "Commentaire littéraire",
        questions: [
            {
                q: "Quelle est la structure d'un commentaire littéraire ?",
                options: [
                    "Intro + 3 axes + conclusion",
                    "Résumé + opinion + citation",
                    "Intro + développement + morale",
                    "Plan + brouillon + rédaction"
                ],
                answer: 0,
                explication: "Le commentaire littéraire comprend une introduction, deux ou trois axes de lecture (avec sous-parties), et une conclusion."
            },
            {
                q: "Qu'est-ce qu'une anaphore ?",
                options: [
                    "Une comparaison sans outil",
                    "Une répétition en début de phrase",
                    "Une exagération expressive",
                    "Une association de termes contraires"
                ],
                answer: 1,
                visual: QUIZ_VISUALS['qfr1-1'],
                explication: "L'anaphore est la répétition d'un mot ou groupe de mots en début de vers ou de phrase (ex: «Je veux...», «Je peux...», «Je dois...»)."
            },
            {
                q: "Dans un axe, après l'idée et la citation, que faut-il faire ?",
                options: ["Citer un autre auteur", "Analyser la citation", "Passer à l'axe suivant", "Résumer"],
                answer: 1,
                explication: "La méthode est : IDÉE → CITATION → ANALYSE. L'analyse explique le procédé stylistique et prouve l'idée."
            },
            {
                q: "Un oxymore est :",
                options: [
                    "Une question rhétorique",
                    "Une comparaison avec 'comme'",
                    "Une association de termes contraires",
                    "Une répétition de sons"
                ],
                answer: 2,
                explication: "L'oxymore associe deux termes de sens opposés (ex: «obscure clarté», «douce violence»)."
            },
            {
                q: "La problématique d'un commentaire doit être :",
                options: [
                    "Une question fermée (oui/non)",
                    "Un résumé du texte",
                    "Une question ouverte sur l'enjeu du texte",
                    "Le titre de l'œuvre"
                ],
                answer: 2,
                explication: "La problématique pose une question ouverte sur l'enjeu littéraire ou thématique du texte, à laquelle le plan répond."
            }
        ]
    },
    {
        id: "qpc1", subject: "physchim", title: "Lois de Newton",
        questions: [
            {
                q: "La 2ème loi de Newton établit la relation :",
                options: ["F = mv", "F = ma", "F = m/a", "F = v/t"],
                answer: 1,
                visual: QUIZ_VISUALS['qpc1-0'],
                explication: "Le principe fondamental de la dynamique : ΣF = m × a. La somme des forces est égale à la masse multipliée par l'accélération."
            },
            {
                q: "Un objet en mouvement rectiligne uniforme est soumis à :",
                options: [
                    "Une force nette non nulle",
                    "Aucune force",
                    "Des forces qui se compensent (ΣF = 0)",
                    "Une accélération constante"
                ],
                answer: 2,
                explication: "D'après le principe d'inertie (1ère loi), si ΣF = 0 alors le mouvement est rectiligne uniforme."
            },
            {
                q: "Si A exerce une force de 10 N sur B, quelle force B exerce sur A ?",
                options: ["0 N", "5 N", "10 N dans le même sens", "10 N dans le sens opposé"],
                answer: 3,
                explication: "3ème loi de Newton (action-réaction) : les forces sont égales en intensité et opposées en direction."
            },
            {
                q: "Pourquoi la base spatiale est-elle à Kourou et non en France métropolitaine ?",
                options: [
                    "Le climat est meilleur",
                    "Proximité de l'équateur pour profiter de la rotation terrestre",
                    "Le terrain est moins cher",
                    "Pour éviter la pollution"
                ],
                answer: 1,
                explication: "La rotation terrestre à l'équateur (~1 670 km/h) donne une vitesse initiale gratuite aux fusées, économisant du carburant."
            },
            {
                q: "Une voiture de 1 000 kg accélère à 3 m/s². Quelle est la force motrice (en N) ?",
                options: ["333", "1 000", "3 000", "3 003"],
                answer: 2,
                visual: QUIZ_VISUALS['qpc1-4'],
                explication: "F = m × a = 1000 × 3 = 3 000 N."
            }
        ]
    },
];

// ---- FORUM ----
let FORUM_POSTS = [
    {
        id: 1, author: "Marie_Cayenne", cat: "maths",
        title: "Comment trouver l'équation d'une droite avec deux points ?",
        body: "J'ai du mal à comprendre la méthode pour trouver a et b quand on a deux points. Est-ce que quelqu'un peut m'expliquer step by step ?",
        date: "2026-05-08", likes: 5, replies: [
            { author: "Prof_Maths", text: "Salut ! Tu calcules d'abord a = (y2-y1)/(x2-x1), puis tu remplaces dans y = ax + b avec l'un des points pour trouver b.", date: "2026-05-08" }
        ]
    },
    {
        id: 2, author: "Kevin_SLM", cat: "svt",
        title: "Quelles espèces d'animaux vivent dans la forêt guyanaise ?",
        body: "Je dois faire un exposé sur la biodiversité de la Guyane. Des ressources ou des infos à me donner ?",
        date: "2026-05-07", likes: 8, replies: [
            { author: "Anais_Bio", text: "Il y a le jaguar, le tapir, la loutre géante, plein d'oiseaux comme l'Ara rouge et le Toucan toco. Le Parc Amazonien a un super site web !", date: "2026-05-07" }
        ]
    },
    {
        id: 3, author: "Theo_Kourou", cat: "histgeo",
        title: "Qui était vraiment Félix Eboué ?",
        body: "On en parle dans notre cours mais je veux en savoir plus sur lui. C'était vraiment important ce qu'il a fait ?",
        date: "2026-05-05", likes: 12, replies: [
            { author: "Laure_Histoire", text: "Oui, énorme ! Il est né à Cayenne, a rallié de Gaulle dès 1940, et a été le 1er gouverneur noir d'une grande colonie française. Il repose au Panthéon.", date: "2026-05-06" }
        ]
    },
    {
        id: 4, author: "Nadia_Mana", cat: "francais",
        title: "Comment choisir une problématique pour le commentaire ?",
        body: "Je sèche toujours sur la problématique. Je ne sais jamais comment la formuler. Des conseils ?",
        date: "2026-05-04", likes: 7, replies: []
    },
    {
        id: 5, author: "Lucas_973", cat: "physchim",
        title: "Pourquoi on envoie les fusées depuis Kourou et pas Paris ?",
        body: "Je voulais comprendre le lien avec la physique. C'est quoi l'avantage d'être près de l'équateur ?",
        date: "2026-05-03", likes: 15, replies: [
            { author: "Alex_Physique", text: "À l'équateur la Terre tourne plus vite (~1670 km/h vs ~1000 km/h à la latitude de Paris). Les fusées récupèrent cette vitesse gratuitement !", date: "2026-05-03" }
        ]
    },
];
