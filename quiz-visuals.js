// ============================================================
// QUIZ VISUELS — SVG interactifs cliquables
// Structure : QUIZ_VISUALS['quizId-questionIndex']
// Chaque zone a data-quiz-idx="N" pour correspondre à l'option
// ============================================================

// Styles partagés injectés une seule fois
const QV_STYLE = `<style>
.qz{cursor:pointer}
.qz .qz-bg{fill:#f8fafc;stroke:#e2e8f0;stroke-width:2;transition:fill .18s,stroke .18s}
.qz:hover .qz-bg{fill:#dbeafe;stroke:#3b82f6;stroke-width:2.5}
.qz.vz-ok .qz-bg{fill:#dcfce7 !important;stroke:#16a34a !important;stroke-width:3}
.qz.vz-ko .qz-bg{fill:#fef2f2 !important;stroke:#ef4444 !important;stroke-width:3}
.qz.vz-dim{opacity:.35}
.qz-lbl{font:11px Inter,sans-serif;fill:#475569;text-anchor:middle}
.qz-badge{font:11px Inter,sans-serif;fill:white;font-weight:700;text-anchor:middle;dominant-baseline:middle}
</style>`;

const QUIZ_VISUALS = {

// ── qm1 · Q2 ── "Si a<0, la droite est…" ──────────────────
// answer = 2 (Descendante)
'qm1-2': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 220" xmlns="http://www.w3.org/2000/svg">

  <!-- Zone A – Horizontale (idx=0) -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="5" y="5" width="195" height="105" rx="9"/>
    <line x1="25" y1="57" x2="185" y2="57" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="105" y1="15" x2="105" y2="99" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="28" y1="57" x2="182" y2="57" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <text class="qz-lbl" x="100" y="97">Horizontale (a = 0)</text>
    <circle cx="22" cy="20" r="11" fill="#94a3b8"/>
    <text class="qz-badge" x="22" y="20">A</text>
  </g>

  <!-- Zone B – Montante (idx=1) -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="215" y="5" width="195" height="105" rx="9"/>
    <line x1="235" y1="57" x2="395" y2="57" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="310" y1="15" x2="310" y2="99" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="238" y1="92" x2="382" y2="22" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <text class="qz-lbl" x="310" y="97">Montante (a &gt; 0)</text>
    <circle cx="232" cy="20" r="11" fill="#94a3b8"/>
    <text class="qz-badge" x="232" y="20">B</text>
  </g>

  <!-- Zone C – Descendante (idx=2) ← CORRECT -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="5" y="115" width="195" height="100" rx="9"/>
    <line x1="25" y1="165" x2="185" y2="165" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="105" y1="122" x2="105" y2="208" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="28" y1="128" x2="182" y2="200" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <text class="qz-lbl" x="100" y="207">Descendante (a &lt; 0)</text>
    <circle cx="22" cy="130" r="11" fill="#94a3b8"/>
    <text class="qz-badge" x="22" y="130">C</text>
  </g>

  <!-- Zone D – Verticale (idx=3) -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="215" y="115" width="195" height="100" rx="9"/>
    <line x1="235" y1="165" x2="395" y2="165" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="310" y1="122" x2="310" y2="208" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="310" y1="128" x2="310" y2="202" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
    <text class="qz-lbl" x="310" y="207">Verticale</text>
    <circle cx="232" cy="130" r="11" fill="#94a3b8"/>
    <text class="qz-badge" x="232" y="130">D</text>
  </g>
</svg>
<p class="qv-hint">👆 Clique sur la bonne représentation dans l'image</p>
</div>`,

// ── qm2 · Q3 ── "P(nombre pair) sur un dé ?" ──────────────
// answer = 2 (1/2)
'qm2-3': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 160" xmlns="http://www.w3.org/2000/svg">

  <!-- Dé avec numéros pairs en vert (en haut pour contexte) -->
  <text x="207" y="18" text-anchor="middle" font-size="12" font-family="Inter,sans-serif" fill="#64748b">Dé à 6 faces — combien de faces paires ?</text>
  <!-- 6 faces du dé -->
  <rect x="105" y="22" width="200" height="30" rx="5" fill="#f1f5f9"/>
  <text x="132" y="41" text-anchor="middle" font-size="14" font-family="monospace" fill="#ef4444">1</text>
  <text x="162" y="41" text-anchor="middle" font-size="14" font-family="monospace" fill="#16a34a" font-weight="700">2</text>
  <text x="192" y="41" text-anchor="middle" font-size="14" font-family="monospace" fill="#ef4444">3</text>
  <text x="222" y="41" text-anchor="middle" font-size="14" font-family="monospace" fill="#16a34a" font-weight="700">4</text>
  <text x="252" y="41" text-anchor="middle" font-size="14" font-family="monospace" fill="#ef4444">5</text>
  <text x="282" y="41" text-anchor="middle" font-size="14" font-family="monospace" fill="#16a34a" font-weight="700">6</text>
  <text x="207" y="68" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94a3b8">3 faces paires (2, 4, 6) sur 6 faces au total</text>

  <!-- Zone A – 1/6 (idx=0) -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="5" y="75" width="90" height="80" rx="9"/>
    <circle cx="50" cy="110" r="25" fill="none" stroke="#e2e8f0" stroke-width="14"/>
    <circle cx="50" cy="110" r="25" fill="none" stroke="#3b82f6" stroke-width="14"
      stroke-dasharray="26 157" stroke-dashoffset="0" transform="rotate(-90 50 110)"/>
    <text class="qz-lbl" x="50" y="149">1/6 ≈ 17%</text>
    <circle cx="20" cy="85" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="20" y="85">A</text>
  </g>

  <!-- Zone B – 1/3 (idx=1) -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="105" y="75" width="90" height="80" rx="9"/>
    <circle cx="150" cy="110" r="25" fill="none" stroke="#e2e8f0" stroke-width="14"/>
    <circle cx="150" cy="110" r="25" fill="none" stroke="#3b82f6" stroke-width="14"
      stroke-dasharray="52 157" stroke-dashoffset="0" transform="rotate(-90 150 110)"/>
    <text class="qz-lbl" x="150" y="149">1/3 ≈ 33%</text>
    <circle cx="120" cy="85" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="120" y="85">B</text>
  </g>

  <!-- Zone C – 1/2 (idx=2) ← CORRECT -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="205" y="75" width="90" height="80" rx="9"/>
    <circle cx="250" cy="110" r="25" fill="none" stroke="#e2e8f0" stroke-width="14"/>
    <circle cx="250" cy="110" r="25" fill="none" stroke="#3b82f6" stroke-width="14"
      stroke-dasharray="79 157" stroke-dashoffset="0" transform="rotate(-90 250 110)"/>
    <text class="qz-lbl" x="250" y="149">1/2 = 50%</text>
    <circle cx="220" cy="85" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="220" y="85">C</text>
  </g>

  <!-- Zone D – 2/3 (idx=3) -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="305" y="75" width="100" height="80" rx="9"/>
    <circle cx="355" cy="110" r="25" fill="none" stroke="#e2e8f0" stroke-width="14"/>
    <circle cx="355" cy="110" r="25" fill="none" stroke="#3b82f6" stroke-width="14"
      stroke-dasharray="105 157" stroke-dashoffset="0" transform="rotate(-90 355 110)"/>
    <text class="qz-lbl" x="355" y="149">2/3 ≈ 67%</text>
    <circle cx="322" cy="85" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="322" y="85">D</text>
  </g>
</svg>
<p class="qv-hint">👆 Clique sur la proportion correcte</p>
</div>`,

// ── qhg1 · Q2 ── "Quelle ville abrite le CSG ?" ────────────
// answer = 2 (Kourou)
'qhg1-2': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 230" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond carte simplifiée Guyane -->
  <path d="M240,12 L405,12 L415,40 L415,90 L380,115 L365,145 L340,170 L305,188 L270,205 L248,220 L225,220 L200,208 L170,202 L145,208 L118,198 L95,178 L78,152 L68,122 L58,90 L60,60 L75,35 L110,12 Z"
    fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <rect x="0" y="0" width="65" height="230" fill="#e0f2fe" opacity=".6"/>
  <text x="30" y="115" transform="rotate(-90,30,115)" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#3b82f6">Suriname</text>

  <!-- 4 zones villes cliquables -->

  <!-- Zone A – Cayenne (nord-est côte) idx=0 -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="298" y="62" width="110" height="46" rx="8"/>
    <circle cx="315" cy="85" r="7" fill="#ef4444" stroke="white" stroke-width="2"/>
    <text x="328" y="81" font-size="12" font-family="Inter,sans-serif" fill="#334155" font-weight="700">Cayenne</text>
    <text x="328" y="94" font-size="9"  font-family="Inter,sans-serif" fill="#94a3b8">Capitale</text>
    <circle cx="310" cy="70" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="310" y="70">A</text>
  </g>
  <!-- Dot on map for Cayenne -->
  <circle cx="315" cy="85" r="5" fill="#ef4444" pointer-events="none"/>

  <!-- Zone B – Saint-Laurent (nord-ouest) idx=1 -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="72" y="35" width="120" height="46" rx="8"/>
    <text x="108" y="53" font-size="12" font-family="Inter,sans-serif" fill="#334155" font-weight="700" text-anchor="middle">Saint-Laurent</text>
    <text x="108" y="65" font-size="9"  font-family="Inter,sans-serif" fill="#94a3b8" text-anchor="middle">2ème ville</text>
    <circle cx="84" cy="43" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="84" y="43">B</text>
  </g>
  <circle cx="145" cy="60" r="5" fill="#8b5cf6" pointer-events="none"/>

  <!-- Zone C – Kourou (côte nord) idx=2 ← CORRECT -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="195" y="20" width="95" height="46" rx="8"/>
    <text x="242" y="39" font-size="12" font-family="Inter,sans-serif" fill="#334155" font-weight="700" text-anchor="middle">Kourou</text>
    <text x="242" y="51" font-size="9"  font-family="Inter,sans-serif" fill="#94a3b8" text-anchor="middle">🚀 ???</text>
    <circle cx="207" cy="28" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="207" y="28">C</text>
  </g>
  <circle cx="225" cy="55" r="5" fill="#f59e0b" pointer-events="none"/>

  <!-- Zone D – Maripasoula (intérieur sud) idx=3 -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="115" y="145" width="115" height="46" rx="8"/>
    <text x="172" y="163" font-size="12" font-family="Inter,sans-serif" fill="#334155" font-weight="700" text-anchor="middle">Maripasoula</text>
    <text x="172" y="175" font-size="9"  font-family="Inter,sans-serif" fill="#94a3b8" text-anchor="middle">Intérieur</text>
    <circle cx="127" cy="153" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="127" y="153">D</text>
  </g>
  <circle cx="200" cy="165" r="5" fill="#06b6d4" pointer-events="none"/>

  <!-- Légende -->
  <text x="207" y="218" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94a3b8">Carte simplifiée de la Guyane — clique sur la bonne ville</text>
</svg>
<p class="qv-hint">👆 Clique sur la ville qui abrite le Centre Spatial Guyanais</p>
</div>`,

// ── qhg1 · Q4 ── "Quel fleuve forme la frontière avec le Brésil ?" ──
// answer = 2 (Oyapock)
'qhg1-4': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 230" xmlns="http://www.w3.org/2000/svg">
  <!-- Carte Guyane fond -->
  <path d="M240,12 L405,12 L415,40 L415,90 L380,115 L365,145 L340,170 L305,188 L270,205 L248,220 L225,220 L200,208 L170,202 L145,208 L118,198 L95,178 L78,152 L68,122 L58,90 L60,60 L75,35 L110,12 Z"
    fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
  <!-- Labels pays -->
  <text x="30" y="115" transform="rotate(-90,30,115)" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Suriname →</text>
  <text x="365" y="215" font-size="9" font-family="Inter,sans-serif" fill="#64748b">← Brésil</text>
  <text x="210" y="228" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Brésil ↓</text>

  <!-- Zone A – Maroni (frontière ouest Suriname) idx=0 -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="55" y="55" width="80" height="44" rx="8"/>
    <text x="95" y="72" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#334155" font-weight="700">Maroni</text>
    <text x="95" y="85" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Fleuve ouest</text>
    <circle cx="68" cy="63" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="68" y="63">A</text>
  </g>
  <!-- Tracé Maroni (frontière ouest) -->
  <path d="M 65,15 Q 72,60 68,100 Q 65,140 70,180" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="5 3" pointer-events="none"/>

  <!-- Zone B – Mana (nord intérieur) idx=1 -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="140" y="12" width="75" height="44" rx="8"/>
    <text x="177" y="30" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#334155" font-weight="700">Mana</text>
    <text x="177" y="43" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Fleuve nord</text>
    <circle cx="153" cy="20" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="153" y="20">B</text>
  </g>
  <!-- Tracé Mana -->
  <path d="M 145,12 Q 165,40 185,55 Q 200,65 220,60" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-dasharray="5 3" pointer-events="none"/>

  <!-- Zone C – Oyapock (frontière est Brésil) idx=2 ← CORRECT -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="315" y="80" width="95" height="44" rx="8"/>
    <text x="362" y="98" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#334155" font-weight="700">Oyapock</text>
    <text x="362" y="112" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Frontière est</text>
    <circle cx="328" cy="88" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="328" y="88">C</text>
  </g>
  <!-- Tracé Oyapock (frontière est) -->
  <path d="M 410,20 Q 400,60 395,100 Q 388,140 375,180 Q 360,200 345,220" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="5 3" pointer-events="none"/>

  <!-- Zone D – Approuague (centre) idx=3 -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="215" y="115" width="100" height="44" rx="8"/>
    <text x="265" y="133" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#334155" font-weight="700">Approuague</text>
    <text x="265" y="147" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Fleuve central</text>
    <circle cx="228" cy="123" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="228" y="123">D</text>
  </g>
  <!-- Tracé Approuague -->
  <path d="M 310,75 Q 290,110 270,140 Q 255,165 250,190" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 3" pointer-events="none"/>
</svg>
<p class="qv-hint">👆 Clique sur le fleuve qui forme la frontière avec le Brésil</p>
</div>`,

// ── qsvt1 · Q4 ── "Mitochondries responsables de…" ─────────
// answer = 2 (production énergie ATP)
'qsvt1-4': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 230" xmlns="http://www.w3.org/2000/svg">
  <!-- Cellule centrale (décoratif, non cliquable) -->
  <ellipse cx="207" cy="115" rx="185" ry="100" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <ellipse cx="207" cy="108" rx="48"  ry="38"  fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="207" y="112" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#1d4ed8" font-weight="600">Noyau</text>

  <!-- Zone A – Chloroplaste → Photosynthèse (idx=0) -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="8"  y="55" width="108" height="72" rx="9"/>
    <ellipse cx="62" cy="80" rx="24" ry="14" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    <line x1="42" y1="80" x2="82" y2="80" stroke="#15803d" stroke-width="1.5"/>
    <line x1="52" y1="68" x2="52" y2="92" stroke="#15803d" stroke-width="1.5"/>
    <line x1="72" y1="68" x2="72" y2="92" stroke="#15803d" stroke-width="1.5"/>
    <text class="qz-lbl" x="62" y="108">Chloroplaste</text>
    <text x="62" y="118" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Photosynthèse ☀️</text>
    <circle cx="22" cy="65" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="22" y="65">A</text>
  </g>

  <!-- Zone B – Ribosome → Protéines (idx=1) -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="8" y="148" width="108" height="72" rx="9"/>
    <circle cx="45" cy="178" r="7" fill="#f9a8d4" stroke="#ec4899" stroke-width="1.5"/>
    <circle cx="62" cy="170" r="6" fill="#f9a8d4" stroke="#ec4899" stroke-width="1.5"/>
    <circle cx="78" cy="178" r="7" fill="#f9a8d4" stroke="#ec4899" stroke-width="1.5"/>
    <circle cx="62" cy="187" r="6" fill="#f9a8d4" stroke="#ec4899" stroke-width="1.5"/>
    <text class="qz-lbl" x="62" y="206">Ribosome</text>
    <text x="62" y="216" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Synthèse protéines</text>
    <circle cx="22" cy="158" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="22" y="158">B</text>
  </g>

  <!-- Zone C – Mitochondrie → ATP (idx=2) ← CORRECT -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="300" y="55" width="110" height="72" rx="9"/>
    <ellipse cx="355" cy="80" rx="30" ry="16" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
    <!-- Crêtes mitochondriales -->
    <path d="M 330,80 Q 340,70 350,80 Q 360,90 370,80" fill="none" stroke="#d97706" stroke-width="1.5"/>
    <path d="M 333,85 Q 343,75 353,85 Q 363,95 373,85" fill="none" stroke="#d97706" stroke-width="1.2"/>
    <text class="qz-lbl" x="355" y="108">Mitochondrie</text>
    <text x="355" y="118" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Énergie ATP ⚡</text>
    <circle cx="313" cy="65" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="313" y="65">C</text>
  </g>

  <!-- Zone D – Centrosome → Division (idx=3) -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="300" y="148" width="110" height="72" rx="9"/>
    <circle cx="355" cy="178" r="10" fill="#c4b5fd" stroke="#8b5cf6" stroke-width="2"/>
    <circle cx="355" cy="178" r="5"  fill="#a78bfa"/>
    <line x1="340" y1="163" x2="370" y2="193" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3 2"/>
    <line x1="370" y1="163" x2="340" y2="193" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3 2"/>
    <text class="qz-lbl" x="355" y="206">Centrosome</text>
    <text x="355" y="216" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Division cellulaire</text>
    <circle cx="313" cy="158" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="313" y="158">D</text>
  </g>
</svg>
<p class="qv-hint">👆 Clique sur l'organite responsable de la production d'énergie</p>
</div>`,

// ── qfr1 · Q1 ── "Qu'est-ce qu'une anaphore ?" ─────────────
// answer = 1 (répétition en début de phrase)
'qfr1-1': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 220" xmlns="http://www.w3.org/2000/svg">

  <!-- Zone A – Métaphore (idx=0) -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="5" y="5" width="195" height="102" rx="9"/>
    <text x="100" y="26" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#7c3aed" font-weight="700">Métaphore</text>
    <rect x="20" y="32" width="165" height="50" rx="5" fill="#f5f3ff"/>
    <text x="102" y="50" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#334155" font-style="italic">"La vie est un long</text>
    <text x="102" y="65" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#334155" font-style="italic">fleuve tranquille."</text>
    <text x="102" y="96" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Comparaison sans outil</text>
    <circle cx="22" cy="18" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="22" y="18">A</text>
  </g>

  <!-- Zone B – Anaphore (idx=1) ← CORRECT -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="210" y="5" width="195" height="102" rx="9"/>
    <text x="307" y="26" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#16a34a" font-weight="700">Anaphore</text>
    <rect x="225" y="32" width="165" height="50" rx="5" fill="#f0fdf4"/>
    <text x="307" y="48" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#15803d" font-style="italic">"<tspan font-weight="bold">Je</tspan> veux... <tspan font-weight="bold">Je</tspan> peux...</text>
    <text x="307" y="63" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#15803d" font-style="italic"><tspan font-weight="bold">Je</tspan> dois..."</text>
    <text x="307" y="96" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Répétition en début</text>
    <circle cx="227" cy="18" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="227" y="18">B</text>
  </g>

  <!-- Zone C – Hyperbole (idx=2) -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="5" y="113" width="195" height="102" rx="9"/>
    <text x="100" y="134" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#ef4444" font-weight="700">Hyperbole</text>
    <rect x="20" y="140" width="165" height="50" rx="5" fill="#fef2f2"/>
    <text x="102" y="160" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#dc2626" font-style="italic">"Je te l'ai dit</text>
    <text x="102" y="175" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#dc2626" font-style="italic">mille fois !"</text>
    <text x="102" y="204" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Exagération expressive</text>
    <circle cx="22" cy="126" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="22" y="126">C</text>
  </g>

  <!-- Zone D – Oxymore (idx=3) -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="210" y="113" width="195" height="102" rx="9"/>
    <text x="307" y="134" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#f59e0b" font-weight="700">Oxymore</text>
    <rect x="225" y="140" width="165" height="50" rx="5" fill="#fffbeb"/>
    <text x="307" y="160" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#92400e" font-style="italic">"Cette <tspan font-weight="bold">obscure</tspan></text>
    <text x="307" y="175" text-anchor="middle" font-size="10" font-family="Georgia,serif" fill="#92400e" font-style="italic"><tspan font-weight="bold">clarté</tspan>"</text>
    <text x="307" y="204" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Termes contraires</text>
    <circle cx="227" cy="126" r="10" fill="#94a3b8"/>
    <text class="qz-badge" x="227" y="126">D</text>
  </g>
</svg>
<p class="qv-hint">👆 Clique sur la figure de style illustrée dans la zone verte</p>
</div>`,

// ── qpc1 · Q0 ── "2ème loi de Newton : relation ?" ──────────
// answer = 1 (F = ma)
'qpc1-0': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 175" xmlns="http://www.w3.org/2000/svg">
  <text x="207" y="18" text-anchor="middle" font-size="12" font-family="Inter,sans-serif" fill="#64748b">Clique sur la bonne formule — Principe fondamental de la dynamique</text>

  <!-- Zone A – F=mv (idx=0) -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="5" y="25" width="193" height="68" rx="9"/>
    <text x="101" y="57" text-anchor="middle" font-size="24" font-family="'Courier New',monospace" fill="#3b82f6" font-weight="700">F = mv</text>
    <text x="101" y="80" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94a3b8">m × vitesse</text>
    <circle cx="22" cy="38" r="10" fill="#94a3b8"/><text class="qz-badge" x="22" y="38">A</text>
  </g>

  <!-- Zone B – F=ma (idx=1) ← CORRECT -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="213" y="25" width="193" height="68" rx="9"/>
    <text x="309" y="57" text-anchor="middle" font-size="24" font-family="'Courier New',monospace" fill="#16a34a" font-weight="700">F = ma</text>
    <text x="309" y="80" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94a3b8">m × accélération</text>
    <circle cx="230" cy="38" r="10" fill="#94a3b8"/><text class="qz-badge" x="230" y="38">B</text>
  </g>

  <!-- Zone C – F=m/a (idx=2) -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="5" y="103" width="193" height="68" rx="9"/>
    <text x="101" y="138" text-anchor="middle" font-size="24" font-family="'Courier New',monospace" fill="#3b82f6" font-weight="700">F = m/a</text>
    <text x="101" y="158" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94a3b8">m divisé par a</text>
    <circle cx="22" cy="116" r="10" fill="#94a3b8"/><text class="qz-badge" x="22" y="116">C</text>
  </g>

  <!-- Zone D – F=v/t (idx=3) -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="213" y="103" width="193" height="68" rx="9"/>
    <text x="309" y="138" text-anchor="middle" font-size="24" font-family="'Courier New',monospace" fill="#3b82f6" font-weight="700">F = v/t</text>
    <text x="309" y="158" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94a3b8">vitesse / temps</text>
    <circle cx="230" cy="116" r="10" fill="#94a3b8"/><text class="qz-badge" x="230" y="116">D</text>
  </g>
</svg>
<p class="qv-hint">👆 Clique sur la formule qui correspond à la 2ème loi de Newton</p>
</div>`,

// ── qpc1 · Q4 ── "Voiture 1000kg, a=3m/s² → F=?" ───────────
// answer = 2 (3 000 N)
'qpc1-4': `<div class="quiz-visual-wrap">${QV_STYLE}
<svg viewBox="0 0 415 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Schéma de calcul -->
  <rect x="60" y="6" width="290" height="42" rx="8" fill="#f1f5f9"/>
  <text x="205" y="23" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#64748b">Voiture : m = 1 000 kg · a = 3 m/s²</text>
  <text x="205" y="40" text-anchor="middle" font-size="13" font-family="'Courier New',monospace" fill="#334155" font-weight="700">F = m × a = 1 000 × 3 = ?</text>

  <!-- Zone A – 333 N (idx=0) -->
  <g class="qz" data-quiz-idx="0">
    <rect class="qz-bg" pointer-events="all" x="5" y="55" width="193" height="68" rx="9"/>
    <text x="101" y="90" text-anchor="middle" font-size="22" font-family="'Courier New',monospace" fill="#3b82f6" font-weight="700">333 N</text>
    <text x="101" y="112" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">1 000 ÷ 3</text>
    <circle cx="22" cy="68" r="10" fill="#94a3b8"/><text class="qz-badge" x="22" y="68">A</text>
  </g>

  <!-- Zone B – 1 000 N (idx=1) -->
  <g class="qz" data-quiz-idx="1">
    <rect class="qz-bg" pointer-events="all" x="213" y="55" width="193" height="68" rx="9"/>
    <text x="309" y="90" text-anchor="middle" font-size="22" font-family="'Courier New',monospace" fill="#3b82f6" font-weight="700">1 000 N</text>
    <text x="309" y="112" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">Juste la masse</text>
    <circle cx="230" cy="68" r="10" fill="#94a3b8"/><text class="qz-badge" x="230" y="68">B</text>
  </g>

  <!-- Zone C – 3 000 N (idx=2) ← CORRECT -->
  <g class="qz" data-quiz-idx="2">
    <rect class="qz-bg" pointer-events="all" x="5" y="130" width="193" height="65" rx="9"/>
    <text x="101" y="165" text-anchor="middle" font-size="22" font-family="'Courier New',monospace" fill="#16a34a" font-weight="700">3 000 N</text>
    <text x="101" y="184" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">1 000 × 3 ✓</text>
    <circle cx="22" cy="143" r="10" fill="#94a3b8"/><text class="qz-badge" x="22" y="143">C</text>
  </g>

  <!-- Zone D – 3 003 N (idx=3) -->
  <g class="qz" data-quiz-idx="3">
    <rect class="qz-bg" pointer-events="all" x="213" y="130" width="193" height="65" rx="9"/>
    <text x="309" y="165" text-anchor="middle" font-size="22" font-family="'Courier New',monospace" fill="#3b82f6" font-weight="700">3 003 N</text>
    <text x="309" y="184" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94a3b8">1 000 + 3 × ?</text>
    <circle cx="230" cy="143" r="10" fill="#94a3b8"/><text class="qz-badge" x="230" y="143">D</text>
  </g>
</svg>
<p class="qv-hint">👆 Applique F = m × a et clique sur le bon résultat</p>
</div>`,

};
