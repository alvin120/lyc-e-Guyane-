// ============================================================
// DONNÉES — 17 MATIÈRES LYCÉE GUYANE
// ============================================================

const CATEGORIES = [
    { id: "all",       label: "Toutes",           icon: "🎓" },
    { id: "lettres",   label: "Lettres & Langues", icon: "📚" },
    { id: "sciences",  label: "Sciences",           icon: "🔬" },
    { id: "humaines",  label: "Sciences Humaines",  icon: "🌍" },
    { id: "numerique", label: "Numérique",           icon: "💻" },
    { id: "arts",      label: "Arts & Sport",        icon: "🎨" },
];

const MATIERES_DATA = [
    {
        id: "francais",
        titre: "Français",
        icon: "📖",
        categorie: "lettres",
        couleur: ["#7c3aed", "#5b21b6"],
        niveaux: ["Seconde", "Première"],
        description: "Littérature, expression écrite, analyse de textes et préparation au bac de français.",
        programme: {
            Seconde:   ["Les grands genres littéraires", "Expression écrite et orale", "Textes fondateurs", "Poésie et versification", "Roman et nouvelles"],
            Première:  ["Roman et récit du Moyen Âge au XXIe siècle", "La littérature d'idées", "Le théâtre du XVIIe au XXIe siècle", "La poésie du XIXe au XXIe siècle", "Préparation EAF"],
        },
        ressources: [
            { titre: "Méthode de la dissertation", type: "pdf", taille: "1.2 Mo" },
            { titre: "Méthode du commentaire de texte", type: "pdf", taille: "980 Ko" },
            { titre: "Fiches auteurs au programme", type: "pdf", taille: "2.4 Mo" },
            { titre: "Grammaire et orthographe", type: "pdf", taille: "3.1 Mo" },
        ],
        videos: [
            { titre: "Les mouvements littéraires expliqués", duree: "18 min", niveau: "Première" },
            { titre: "Réussir le commentaire de texte", duree: "22 min", niveau: "Première" },
            { titre: "La poésie de Baudelaire", duree: "15 min", niveau: "Première" },
        ],
        devoirs: [
            { titre: "Dissertation : le roman du XIXe siècle", echeance: "15/06", rendu: false },
            { titre: "Commentaire : poème de Rimbaud", echeance: "08/06", rendu: true },
        ],
    },
    {
        id: "maths",
        titre: "Mathématiques",
        icon: "📐",
        categorie: "sciences",
        couleur: ["#2563eb", "#1e40af"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Algèbre, géométrie, analyse, probabilités et statistiques du secondaire.",
        programme: {
            Seconde:   ["Ensembles et raisonnement", "Fonctions", "Géométrie repérée", "Statistiques et probabilités", "Arithmétique"],
            Première:  ["Second degré", "Suites numériques", "Dérivation", "Trigonométrie", "Exponentielle"],
            Terminale: ["Analyse", "Algèbre", "Probabilités", "Géométrie dans l'espace", "Grands théorèmes"],
        },
        ressources: [
            { titre: "Formulaire complet de maths", type: "pdf", taille: "2.8 Mo" },
            { titre: "Exercices corrigés Terminale", type: "pdf", taille: "5.2 Mo" },
            { titre: "Annales bac 2015-2024", type: "pdf", taille: "12 Mo" },
        ],
        videos: [
            { titre: "Les fonctions dérivées — cours complet", duree: "35 min", niveau: "Première" },
            { titre: "Probabilités conditionnelles", duree: "28 min", niveau: "Terminale" },
            { titre: "Tableaux de signes et variations", duree: "20 min", niveau: "Première" },
        ],
        devoirs: [
            { titre: "DM n°8 : suites récurrentes", echeance: "20/06", rendu: false },
            { titre: "Contrôle : intégrales", echeance: "05/06", rendu: true },
        ],
    },
    {
        id: "histgeo",
        titre: "Histoire-Géographie",
        icon: "🗺️",
        categorie: "humaines",
        couleur: ["#ea580c", "#c2410c"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Histoire mondiale contemporaine et géographie humaine, économique et physique.",
        programme: {
            Seconde:   ["L'Antiquité et ses héritages", "XVe–XVIIIe siècle : expansions", "La Révolution française", "Géographie : mondialisation"],
            Première:  ["La France entre 1900 et 1940", "Les totalitarismes", "De Gaulle et la France Libre", "Géographie : France et Europe"],
            Terminale: ["La Guerre Froide", "La décolonisation", "La mondialisation", "Les enjeux géopolitiques"],
        },
        ressources: [
            { titre: "Chronologie illustrée XXe siècle", type: "pdf", taille: "4.1 Mo" },
            { titre: "Cartes du monde vierges", type: "pdf", taille: "1.8 Mo" },
            { titre: "Méthode composition histoire", type: "pdf", taille: "900 Ko" },
        ],
        videos: [
            { titre: "La Première Guerre Mondiale", duree: "25 min", niveau: "Première" },
            { titre: "Géographie de la Guyane", duree: "18 min", niveau: "Seconde" },
            { titre: "Les grandes puissances mondiales", duree: "30 min", niveau: "Terminale" },
        ],
        devoirs: [
            { titre: "Composition : la décolonisation", echeance: "22/06", rendu: false },
        ],
    },
    {
        id: "anglais",
        titre: "Anglais",
        icon: "🇬🇧",
        categorie: "lettres",
        couleur: ["#dc2626", "#991b1b"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Expression orale et écrite, compréhension, civilisation britannique et américaine.",
        programme: {
            Seconde:   ["Identités et échanges", "Voyages et migrations", "Fiction et réalité", "Langues et communication"],
            Première:  ["L'art de vivre ensemble", "Territoire et mémoire", "Le monde en marche", "Expression autonome B2"],
            Terminale: ["Expression écrite C1", "Grand oral en anglais", "Civilisation UK/USA", "Littérature anglophone"],
        },
        ressources: [
            { titre: "Liste de vocabulaire thématique", type: "pdf", taille: "1.5 Mo" },
            { titre: "Grammaire anglaise avancée", type: "pdf", taille: "3.2 Mo" },
            { titre: "Expressions idiomatiques", type: "pdf", taille: "800 Ko" },
        ],
        videos: [
            { titre: "How to write a perfect essay", duree: "20 min", niveau: "Terminale" },
            { titre: "American civilization overview", duree: "22 min", niveau: "Première" },
            { titre: "Listening comprehension practice", duree: "15 min", niveau: "Seconde" },
        ],
        devoirs: [
            { titre: "Essay: social media impact", echeance: "18/06", rendu: false },
            { titre: "Commentaire texte: The Great Gatsby", echeance: "04/06", rendu: true },
        ],
    },
    {
        id: "espagnol",
        titre: "Espagnol",
        icon: "🇪🇸",
        categorie: "lettres",
        couleur: ["#f59e0b", "#d97706"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Langue vivante 2 — expression, compréhension et civilisation hispanophones.",
        programme: {
            Seconde:   ["Vivir juntos", "La ciudad y el campo", "Memorias", "El arte y la cultura"],
            Première:  ["Sueños y miedos", "Arte y poder", "Independencias", "Ciudadanos del mundo"],
            Terminale: ["Hispanidad", "Frontera y identidad", "El progreso", "Continuité et ruptura"],
        },
        ressources: [
            { titre: "Vocabulaire essentiel espagnol", type: "pdf", taille: "1.1 Mo" },
            { titre: "Conjugaison espagnole complète", type: "pdf", taille: "1.8 Mo" },
        ],
        videos: [
            { titre: "La civilisation hispanique", duree: "16 min", niveau: "Première" },
            { titre: "El subjuntivo — cours pratique", duree: "14 min", niveau: "Terminale" },
        ],
        devoirs: [
            { titre: "Redacción: la identidad latina", echeance: "25/06", rendu: false },
        ],
    },
    {
        id: "portugais",
        titre: "Portugais",
        icon: "🇧🇷",
        categorie: "lettres",
        couleur: ["#16a34a", "#15803d"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Langue vivante — portugais brésilien et lusitanien, culture amazonienne.",
        programme: {
            Seconde:   ["Identidade cultural", "Amazônia e biodiversidade", "Migração e fronteiras"],
            Première:  ["Arte brasileira", "História e memória", "Mundo lusófono"],
            Terminale: ["Expressão autônoma C1", "Literatura lusófona", "Questões contemporâneas"],
        },
        ressources: [
            { titre: "Vocabulário essencial português", type: "pdf", taille: "980 Ko" },
            { titre: "Gramática do português", type: "pdf", taille: "2.1 Mo" },
        ],
        videos: [
            { titre: "A cultura amazônica em Guiana", duree: "20 min", niveau: "Seconde" },
            { titre: "O Brasil contemporâneo", duree: "18 min", niveau: "Première" },
        ],
        devoirs: [],
    },
    {
        id: "physchim",
        titre: "Physique-Chimie",
        icon: "⚗️",
        categorie: "sciences",
        couleur: ["#0891b2", "#0e7490"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Mécanique, optique, électricité, thermodynamique et chimie organique.",
        programme: {
            Seconde:   ["Constitution et transformation de la matière", "Mouvement et interactions", "Ondes et signaux", "L'énergie"],
            Première:  ["Constitution de la matière", "Modélisation des transformations", "Ondes", "Mécanique"],
            Terminale: ["Chimie organique", "Thermodynamique", "Optique", "Électromagnétisme"],
        },
        ressources: [
            { titre: "Formulaire physique-chimie", type: "pdf", taille: "3.4 Mo" },
            { titre: "TP corrigés — électricité", type: "pdf", taille: "2.2 Mo" },
            { titre: "Annales bac 2018-2024", type: "pdf", taille: "9.8 Mo" },
        ],
        videos: [
            { titre: "Les lois de Newton expliquées", duree: "25 min", niveau: "Première" },
            { titre: "Chimie organique — bases", duree: "30 min", niveau: "Terminale" },
            { titre: "Sons et ondes — cours complet", duree: "22 min", niveau: "Seconde" },
        ],
        devoirs: [
            { titre: "TP : mesure d'une vitesse", echeance: "12/06", rendu: false },
            { titre: "Exercices : cinématique", echeance: "02/06", rendu: true },
        ],
    },
    {
        id: "svt",
        titre: "SVT",
        icon: "🌿",
        categorie: "sciences",
        couleur: ["#16a34a", "#166534"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Biodiversité, génétique, corps humain, écologie et sciences de la vie en Guyane.",
        programme: {
            Seconde:   ["La Terre dans l'univers", "La cellule", "La biodiversité", "Corps humain et santé"],
            Première:  ["Génétique et évolution", "Fonctionnement de l'organisme", "Écologie", "Géologie"],
            Terminale: ["Neurosciences", "Immunologie", "Évolution", "Environnement et développement durable"],
        },
        ressources: [
            { titre: "Biodiversité amazonienne — guide", type: "pdf", taille: "5.6 Mo" },
            { titre: "Schémas cellule eucaryote", type: "pdf", taille: "1.4 Mo" },
            { titre: "Génétique — exercices corrigés", type: "pdf", taille: "2.8 Mo" },
        ],
        videos: [
            { titre: "La forêt amazonienne de Guyane", duree: "24 min", niveau: "Seconde" },
            { titre: "La division cellulaire — mitose/méiose", duree: "20 min", niveau: "Première" },
            { titre: "Le système immunitaire", duree: "28 min", niveau: "Terminale" },
        ],
        devoirs: [
            { titre: "SVT : évolution des espèces", echeance: "19/06", rendu: false },
        ],
    },
    {
        id: "philo",
        titre: "Philosophie",
        icon: "🤔",
        categorie: "humaines",
        couleur: ["#4f46e5", "#4338ca"],
        niveaux: ["Terminale"],
        description: "Les grandes notions, les auteurs majeurs et la dissertation philosophique.",
        programme: {
            Terminale: ["La conscience", "La liberté", "Le droit et la justice", "La vérité", "La raison", "L'art", "La nature", "Le bonheur"],
        },
        ressources: [
            { titre: "Notions du programme — fiches", type: "pdf", taille: "4.2 Mo" },
            { titre: "Les grands philosophes", type: "pdf", taille: "3.8 Mo" },
            { titre: "Méthode dissertation philo", type: "pdf", taille: "1.1 Mo" },
        ],
        videos: [
            { titre: "La conscience selon Descartes", duree: "18 min", niveau: "Terminale" },
            { titre: "Liberté et déterminisme", duree: "22 min", niveau: "Terminale" },
            { titre: "Réussir la dissertation philo", duree: "30 min", niveau: "Terminale" },
        ],
        devoirs: [
            { titre: "Dissertation : qu'est-ce que la liberté ?", echeance: "28/06", rendu: false },
        ],
    },
    {
        id: "eps",
        titre: "EPS",
        icon: "🏃",
        categorie: "arts",
        couleur: ["#f97316", "#ea580c"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Éducation physique, sportive et pratiques en milieu tropical guyanais.",
        programme: {
            Seconde:   ["Sports collectifs", "Athlétisme", "Natation", "Arts du cirque"],
            Première:  ["Activités individuelles", "Plein air Guyane", "Coopération", "Santé"],
            Terminale: ["Projet personnel EPS", "Préparation bac", "Activités de pleine nature"],
        },
        ressources: [
            { titre: "Règles des sports collectifs", type: "pdf", taille: "900 Ko" },
            { titre: "Programmes d'entraînement", type: "pdf", taille: "1.6 Mo" },
        ],
        videos: [
            { titre: "Préparation physique en zone tropicale", duree: "12 min", niveau: "Seconde" },
            { titre: "Sports traditionnels guyanais", duree: "15 min", niveau: "Première" },
        ],
        devoirs: [],
    },
    {
        id: "ses",
        titre: "SES",
        icon: "📊",
        categorie: "humaines",
        couleur: ["#0d9488", "#0f766e"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Sciences économiques, sociologiques et politiques pour comprendre le monde.",
        programme: {
            Seconde:   ["Qui produit la richesse ?", "Comment les marchés fonctionnent ?", "Comment la société est-elle organisée ?"],
            Première:  ["Économie", "Sociologie", "Science politique", "Regards croisés"],
            Terminale: ["Croissance et développement", "Marchés et prix", "Justice sociale", "Démocratie"],
        },
        ressources: [
            { titre: "Fiches notions SES", type: "pdf", taille: "3.5 Mo" },
            { titre: "Données économiques France/Monde 2024", type: "pdf", taille: "2.1 Mo" },
        ],
        videos: [
            { titre: "Le PIB expliqué simplement", duree: "14 min", niveau: "Seconde" },
            { titre: "Inégalités et stratification sociale", duree: "20 min", niveau: "Première" },
        ],
        devoirs: [
            { titre: "Dissertation : la mobilité sociale", echeance: "23/06", rendu: false },
        ],
    },
    {
        id: "nsi",
        titre: "NSI",
        icon: "💻",
        categorie: "numerique",
        couleur: ["#1e40af", "#1e3a8a"],
        niveaux: ["Première", "Terminale"],
        description: "Numérique et Sciences Informatiques : algorithmique, Python, réseaux et bases de données.",
        programme: {
            Première:  ["Représentation des données", "Traitements en tables", "Interactions HTML/CSS/JS", "Algorithmique", "Langages (Python)"],
            Terminale: ["Structures de données", "Bases de données SQL", "Algorithmique avancée", "Réseaux", "Systèmes"],
        },
        ressources: [
            { titre: "Python — guide de référence", type: "pdf", taille: "4.8 Mo" },
            { titre: "SQL pour débutants", type: "pdf", taille: "2.6 Mo" },
            { titre: "Algorithmique et structures", type: "pdf", taille: "3.1 Mo" },
        ],
        videos: [
            { titre: "Introduction à Python", duree: "40 min", niveau: "Première" },
            { titre: "Les réseaux informatiques", duree: "25 min", niveau: "Terminale" },
            { titre: "Bases de données et SQL", duree: "35 min", niveau: "Terminale" },
        ],
        devoirs: [
            { titre: "Projet Python : algorithme de tri", echeance: "30/06", rendu: false },
        ],
    },
    {
        id: "snt",
        titre: "SNT",
        icon: "🌐",
        categorie: "numerique",
        couleur: ["#7c3aed", "#6d28d9"],
        niveaux: ["Seconde"],
        description: "Sciences Numériques et Technologie — internet, données, photo, cartographie.",
        programme: {
            Seconde: ["Internet et réseaux", "Le Web", "Les données et leur traitement", "Localisation et cartographie", "Informatique embarquée", "Photo numérique", "Réseaux sociaux"],
        },
        ressources: [
            { titre: "Le fonctionnement d'internet", type: "pdf", taille: "1.8 Mo" },
            { titre: "Protection des données personnelles", type: "pdf", taille: "900 Ko" },
        ],
        videos: [
            { titre: "Comment fonctionne internet ?", duree: "18 min", niveau: "Seconde" },
            { titre: "Vie privée et réseaux sociaux", duree: "15 min", niveau: "Seconde" },
        ],
        devoirs: [],
    },
    {
        id: "techno",
        titre: "Technologie",
        icon: "⚙️",
        categorie: "numerique",
        couleur: ["#475569", "#334155"],
        niveaux: ["Seconde"],
        description: "Systèmes techniques, conception, fabrication et innovation technologique.",
        programme: {
            Seconde: ["Analyse des systèmes", "Modélisation 3D", "Électronique", "Programmation systèmes", "Projet pluridisciplinaire"],
        },
        ressources: [
            { titre: "Introduction CAO / modélisation 3D", type: "pdf", taille: "3.2 Mo" },
            { titre: "Électronique numérique — bases", type: "pdf", taille: "2.4 Mo" },
        ],
        videos: [
            { titre: "Modélisation 3D avec FreeCAD", duree: "28 min", niveau: "Seconde" },
        ],
        devoirs: [],
    },
    {
        id: "arts",
        titre: "Arts Plastiques",
        icon: "🎨",
        categorie: "arts",
        couleur: ["#db2777", "#be185d"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Pratique artistique, histoire de l'art, création plastique et analyse d'œuvres.",
        programme: {
            Seconde:   ["La représentation", "L'œuvre, l'espace et le spectateur", "La matérialité et le médium"],
            Première:  ["La création et la production", "L'œuvre en contexte", "Art et réalités"],
            Terminale: ["Autonomie artistique", "Art et technique", "Démarche de projet"],
        },
        ressources: [
            { titre: "Histoire de l'art — timeline", type: "pdf", taille: "6.4 Mo" },
            { titre: "Techniques artistiques expliquées", type: "pdf", taille: "2.8 Mo" },
        ],
        videos: [
            { titre: "L'art contemporain expliqué", duree: "20 min", niveau: "Terminale" },
            { titre: "Techniques de peinture", duree: "16 min", niveau: "Seconde" },
        ],
        devoirs: [
            { titre: "Projet artistique : nature guyanaise", echeance: "27/06", rendu: false },
        ],
    },
    {
        id: "musique",
        titre: "Musique",
        icon: "🎵",
        categorie: "arts",
        couleur: ["#9333ea", "#7e22ce"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Éducation musicale, pratique instrumentale, analyse d'œuvres et cultures musicales.",
        programme: {
            Seconde:   ["Écoute et analyse", "Pratique vocale et instrumentale", "Musiques du monde", "Musiques de Guyane"],
            Première:  ["Musique et techniques", "Composition assistée", "Histoire de la musique"],
            Terminale: ["Projet musical personnel", "Musiques actuelles", "Analyse approfondie"],
        },
        ressources: [
            { titre: "Solfège et théorie musicale", type: "pdf", taille: "2.2 Mo" },
            { titre: "Musiques traditionnelles de Guyane", type: "pdf", taille: "1.8 Mo" },
        ],
        videos: [
            { titre: "Les rythmes afro-guyanais", duree: "18 min", niveau: "Seconde" },
            { titre: "Initiation à la composition musicale", duree: "25 min", niveau: "Première" },
        ],
        devoirs: [],
    },
    {
        id: "creole",
        titre: "Créole Guyanais",
        icon: "🌺",
        categorie: "lettres",
        couleur: ["#b45309", "#92400e"],
        niveaux: ["Seconde", "Première", "Terminale"],
        description: "Lang kreyòl — langue, culture, littérature et identité guyanaise.",
        programme: {
            Seconde:   ["Phonologie et grammaire kreyòl", "Littérature orale", "Contes et légendes de Guyane"],
            Première:  ["Expression écrite en kreyòl", "Poésie guyanaise", "Identité créole"],
            Terminale: ["Littérature créole contemporaine", "Francophonie caribéenne", "Projet culturel"],
        },
        ressources: [
            { titre: "Dictionnaire français-créole guyanais", type: "pdf", taille: "4.6 Mo" },
            { titre: "Grammaire du créole guyanais", type: "pdf", taille: "3.1 Mo" },
            { titre: "Contes traditionnels de Guyane", type: "pdf", taille: "2.4 Mo" },
        ],
        videos: [
            { titre: "Histoire de la langue créole", duree: "20 min", niveau: "Seconde" },
            { titre: "Poètes guyanais contemporains", duree: "16 min", niveau: "Première" },
            { titre: "Carnaval et culture créole", duree: "22 min", niveau: "Seconde" },
        ],
        devoirs: [
            { titre: "Dissertation : identité créole et francophonie", echeance: "24/06", rendu: false },
        ],
    },
];

// Données démo : tableau de bord élève
const DEMO_NOTES = [
    { matiere: "Mathématiques", note: 14.5, coeff: 6, date: "15/05" },
    { matiere: "Français",      note: 13,   coeff: 4, date: "12/05" },
    { matiere: "Histoire-Géo",  note: 15.5, coeff: 3, date: "10/05" },
    { matiere: "Anglais",       note: 16,   coeff: 3, date: "08/05" },
    { matiere: "Physique-Chim", note: 11.5, coeff: 5, date: "06/05" },
    { matiere: "SVT",           note: 13,   coeff: 4, date: "04/05" },
    { matiere: "SES",           note: 17,   coeff: 4, date: "02/05" },
    { matiere: "NSI",           note: 18,   coeff: 4, date: "29/04" },
];

const DEMO_EMPLOI = [
    { jour: "Lundi",    cours: [{ h:"8h-9h", mat:"Mathématiques", salle:"B12" }, { h:"9h-10h", mat:"Français", salle:"A04" }, { h:"10h15-12h", mat:"Histoire-Géo", salle:"A08" }, { h:"14h-15h", mat:"Anglais", salle:"C02" }, { h:"15h-16h", mat:"NSI", salle:"Info1" }] },
    { jour: "Mardi",    cours: [{ h:"8h-9h", mat:"SVT", salle:"Labo2" }, { h:"9h-10h", mat:"Physique-Chimie", salle:"Labo1" }, { h:"10h15-12h", mat:"SES", salle:"A11" }, { h:"14h-16h", mat:"EPS", salle:"Gymnase" }] },
    { jour: "Mercredi", cours: [{ h:"8h-10h", mat:"Mathématiques", salle:"B12" }, { h:"10h15-12h", mat:"Philosophie", salle:"A06" }] },
    { jour: "Jeudi",    cours: [{ h:"8h-9h", mat:"Anglais", salle:"C02" }, { h:"9h-10h", mat:"Espagnol", salle:"C05" }, { h:"10h15-12h", mat:"Physique-Chimie", salle:"Labo1" }, { h:"14h-16h", mat:"Arts Plastiques", salle:"ArtRoom" }] },
    { jour: "Vendredi", cours: [{ h:"8h-10h", mat:"Français", salle:"A04" }, { h:"10h15-12h", mat:"SVT", salle:"Labo2" }, { h:"14h-15h", mat:"NSI", salle:"Info1" }] },
];

const DEMO_MESSAGES = [
    { de: "M. Lebrun (Maths)", objet: "Correction DM n°7", date: "Hier", lu: false },
    { de: "Mme Rosière (Français)", objet: "Bac blanc — résultats", date: "Il y a 2j", lu: false },
    { de: "Direction", objet: "Réunion parents d'élèves", date: "Il y a 3j", lu: true },
    { de: "M. Chen (NSI)", objet: "Projet Python — instructions", date: "Il y a 5j", lu: true },
];
