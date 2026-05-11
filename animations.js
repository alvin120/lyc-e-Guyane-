// ============================================================
// ANIMATIONS VECTORIELLES — une par leçon
// ============================================================

const LESSON_ANIMS = {

// ── m1 : Fonctions affines ──────────────────────────────────
m1: `<div class="lesson-anim">
<svg viewBox="0 0 420 230" xmlns="http://www.w3.org/2000/svg">
<style>
.g{stroke:#e2e8f0;stroke-width:1}
.ax{stroke:#334155;stroke-width:2.5}
.fn{stroke:#16a34a;stroke-width:3;stroke-linecap:round;stroke-dasharray:310;stroke-dashoffset:310;animation:dr 1.6s ease forwards .3s}
.pt{opacity:0;animation:fd .3s ease forwards 1.8s}
.lb{font:11px Inter,sans-serif;fill:#64748b}
.lg{font:13px Inter,sans-serif;fill:#16a34a;font-weight:700;opacity:0;animation:fd .5s ease forwards 2s}
.lr{font:11px Inter,sans-serif;fill:#ef4444;font-weight:700;opacity:0;animation:fd .5s ease forwards 2.3s}
.lb2{font:11px Inter,sans-serif;fill:#3b82f6;font-weight:700;opacity:0;animation:fd .5s ease forwards 2.6s}
.slope{stroke:#3b82f6;stroke-width:1.5;stroke-dasharray:4 3;opacity:0;animation:fd .4s ease forwards 2.9s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes fd{to{opacity:1}}
</style>
<!-- Grille verticale x=1..7 (origine=45,195, échelle=45px) -->
<line class="g" x1="90"  y1="10" x2="90"  y2="195"/>
<line class="g" x1="135" y1="10" x2="135" y2="195"/>
<line class="g" x1="180" y1="10" x2="180" y2="195"/>
<line class="g" x1="225" y1="10" x2="225" y2="195"/>
<line class="g" x1="270" y1="10" x2="270" y2="195"/>
<line class="g" x1="315" y1="10" x2="315" y2="195"/>
<!-- Grille horizontale y=1,2,3 -->
<line class="g" x1="35" y1="150" x2="370" y2="150"/>
<line class="g" x1="35" y1="105" x2="370" y2="105"/>
<line class="g" x1="35" y1="60"  x2="370" y2="60"/>
<!-- Axes -->
<line class="ax" x1="40" y1="195" x2="375" y2="195"/>
<line class="ax" x1="45" y1="200" x2="45"  y2="8"/>
<polygon points="375,192 368,198 368,192" fill="#334155"/>
<polygon points="42,8 45,2 48,8" fill="#334155"/>
<!-- Étiquettes axes -->
<text class="lb" x="28"  y="199">0</text>
<text class="lb" x="367" y="209">x</text>
<text class="lb" x="50"  y="6">y</text>
<text class="lb" x="87"  y="210">1</text>
<text class="lb" x="132" y="210">2</text>
<text class="lb" x="177" y="210">3</text>
<text class="lb" x="222" y="210">4</text>
<text class="lb" x="267" y="210">5</text>
<text class="lb" x="312" y="210">6</text>
<text class="lb" x="28"  y="154">1</text>
<text class="lb" x="28"  y="109">2</text>
<text class="lb" x="28"  y="64">3</text>
<!-- f(x)=0,5x+0,5 : x=0→(45,173) x=6→(315,38) longueur≈302 -->
<line class="fn" x1="45" y1="173" x2="315" y2="38"/>
<!-- Point b (ordonnée à l'origine) -->
<circle class="pt" cx="45" cy="173" r="7" fill="#ef4444" stroke="white" stroke-width="2"/>
<!-- Triangle pente (run=45px, rise=22.5px) -->
<line class="slope" x1="180" y1="127.5" x2="225" y2="127.5"/>
<line class="slope" x1="225" y1="127.5" x2="225" y2="105"/>
<!-- Étiquettes -->
<text class="lg"  x="220" y="88">f(x) = 0,5x + 0,5</text>
<text class="lr"  x="52"  y="165">b = 0,5</text>
<text class="lb2" x="185" y="143">Δx</text>
<text class="lb2" x="230" y="120">Δy</text>
<text class="lb2" x="120" y="110" style="font-size:12px">a = Δy/Δx = 0,5</text>
</svg>
<p class="anim-caption">La droite se trace de gauche à droite — <strong>a</strong> = pente · <strong>b</strong> = ordonnée à l'origine</p>
</div>`,

// ── m2 : Probabilités ──────────────────────────────────────
m2: `<div class="lesson-anim">
<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
<style>
.bg-b{fill:#f1f5f9;rx:5}
.lb{font:12px Inter,sans-serif;fill:#334155}
.lv{font:13px Inter,sans-serif;font-weight:700}
</style>
<!-- Barre 1 : P(oiseau)=8/20=40% -->
<text class="lb" x="10" y="34">P(oiseau) = 8/20</text>
<rect x="185" y="16" width="190" height="26" rx="5" fill="#e2e8f0"/>
<rect x="185" y="16" height="26" rx="5" fill="#16a34a" width="0">
  <animate attributeName="width" from="0" to="76" dur="1s" fill="freeze" begin="0.3s"/>
</rect>
<text class="lb lv" x="269" y="34" fill="#16a34a" opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.2s"/>40%</text>

<!-- Barre 2 : P(pair)=3/6=50% -->
<text class="lb" x="10" y="76">P(nombre pair) = 3/6</text>
<rect x="185" y="58" width="190" height="26" rx="5" fill="#e2e8f0"/>
<rect x="185" y="58" height="26" rx="5" fill="#3b82f6" width="0">
  <animate attributeName="width" from="0" to="95" dur="1s" fill="freeze" begin="0.6s"/>
</rect>
<text class="lb lv" x="287" y="76" fill="#3b82f6" opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.5s"/>50%</text>

<!-- Barre 3 : P(as)=4/52≈8% -->
<text class="lb" x="10" y="118">P(as) = 4/52</text>
<rect x="185" y="100" width="190" height="26" rx="5" fill="#e2e8f0"/>
<rect x="185" y="100" height="26" rx="5" fill="#f59e0b" width="0">
  <animate attributeName="width" from="0" to="15" dur="1s" fill="freeze" begin="0.9s"/>
</rect>
<text class="lb lv" x="206" y="118" fill="#f59e0b" opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.8s"/>≈ 8%</text>

<!-- Formule -->
<rect x="10" y="138" width="380" height="18" rx="4" fill="#f0fdf4"/>
<text x="200" y="151" font-size="12" font-family="Inter,sans-serif" fill="#16a34a" font-weight="700" text-anchor="middle">P = cas favorables / cas possibles</text>
</svg>
<p class="anim-caption">Trois exemples de probabilité — la barre représente la proportion</p>
</div>`,

// ── m3 : Dérivées ──────────────────────────────────────────
m3: `<div class="lesson-anim">
<svg viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg">
<style>
.g{stroke:#e2e8f0;stroke-width:1}
.ax{stroke:#334155;stroke-width:1.8}
.prbl{fill:none;stroke:#3b82f6;stroke-width:2.5;stroke-dasharray:360;stroke-dashoffset:360;animation:dr 1.8s ease forwards .2s}
.tng{fill:none;stroke:#ef4444;stroke-width:2;stroke-dasharray:220;stroke-dashoffset:220;animation:dr 1s ease forwards 2s}
.pt{opacity:0;animation:fd .3s ease forwards 3s}
.lb{font:11px Inter,sans-serif;fill:#64748b}
.lred{font:12px Inter,sans-serif;fill:#ef4444;font-weight:700;opacity:0;animation:fd .5s ease forwards 3.1s}
.lblue{font:12px Inter,sans-serif;fill:#3b82f6;font-weight:700;opacity:0;animation:fd .5s ease forwards .5s}
.dash{stroke:#ef4444;stroke-width:1.5;stroke-dasharray:4 3;opacity:0;animation:fd .4s ease forwards 3.3s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes fd{to{opacity:1}}
</style>
<!-- Grille -->
<line class="g" x1="0"   y1="50"  x2="360" y2="50"/>
<line class="g" x1="0"   y1="100" x2="360" y2="100"/>
<line class="g" x1="0"   y1="150" x2="360" y2="150"/>
<line class="g" x1="100" y1="0"   x2="100" y2="200"/>
<line class="g" x1="160" y1="0"   x2="160" y2="200"/>
<line class="g" x1="220" y1="0"   x2="220" y2="200"/>
<line class="g" x1="280" y1="0"   x2="280" y2="200"/>
<!-- Axes -->
<line class="ax" x1="10"  y1="196" x2="350" y2="196"/>
<line class="ax" x1="160" y1="205" x2="160" y2="8"/>
<polygon points="350,193 343,199 343,193" fill="#334155"/>
<polygon points="157,8 160,2 163,8" fill="#334155"/>
<!-- Étiquettes -->
<text class="lb" x="154" y="210">0</text>
<text class="lb" x="215" y="210">1</text>
<text class="lb" x="275" y="210">2</text>
<text class="lb" x="99"  y="210">-1</text>
<!-- Parabole y=x² origine(160,196) échelle=18
  x=-3→(106,34) x=-2→(124,124) x=-1→(142,178) x=0→(160,196) x=1→(178,178) x=2→(196,124) x=3→(214,34) -->
<polyline class="prbl" points="106,34 115,79 124,124 133,169 142,178 151,187 160,196 169,187 178,178 187,169 196,124 205,79 214,34"/>
<!-- Tangente en x=1 (f'=2) : de (169,196) à (260,14)
  pente pixel = 2 → pour +1px_x → -2px_y -->
<line class="tng" x1="165" y1="196" x2="255" y2="16"/>
<!-- Point de tangence (178,178) -->
<circle class="pt" cx="178" cy="178" r="6" fill="#ef4444" stroke="white" stroke-width="2"/>
<!-- Triangle pente : base (178→196, y=178), hauteur (196, 178→142) -->
<line class="dash" x1="178" y1="178" x2="196" y2="178"/>
<line class="dash" x1="196" y1="178" x2="196" y2="142"/>
<!-- Labels -->
<text class="lblue" x="215" y="145">y = x²</text>
<text class="lred"  x="262" y="90">Tangente</text>
<text class="lred"  x="262" y="105">f'(1) = 2</text>
<text class="lb"    x="183" y="193" style="fill:#ef4444;opacity:0;animation:fd .4s ease forwards 3.4s">Δx=1</text>
<text class="lb"    x="200" y="163" style="fill:#ef4444;opacity:0;animation:fd .4s ease forwards 3.5s">Δy=2</text>
</svg>
<p class="anim-caption">Tangente à y = x² en x=1 — la pente de la tangente est f'(1) = 2·1 = 2</p>
</div>`,

// ── hg1 : La Guyane ────────────────────────────────────────
hg1: `<div class="lesson-anim">
<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">
<style>
.guyane{fill:#dcfce7;stroke:#16a34a;stroke-width:2;stroke-dasharray:600;stroke-dashoffset:600;animation:dr 2s ease forwards .2s}
.ocean{fill:#dbeafe}
.city{fill:#ef4444;opacity:0}
.city1{animation:pp .4s ease forwards 2.3s}
.city2{animation:pp .4s ease forwards 2.6s}
.city3{animation:pp .4s ease forwards 2.9s}
.city4{animation:pp .4s ease forwards 3.2s}
.lbl{font:11px Inter,sans-serif;fill:#334155;opacity:0}
.lbl1{animation:pp .4s ease forwards 2.4s}
.lbl2{animation:pp .4s ease forwards 2.7s}
.lbl3{animation:pp .4s ease forwards 3s}
.lbl4{animation:pp .4s ease forwards 3.3s}
.ocean-lbl{font:11px Inter,sans-serif;fill:#3b82f6;font-weight:600;opacity:0;animation:pp .5s ease forwards 2.2s}
.border-lbl{font:10px Inter,sans-serif;fill:#94a3b8;opacity:0;animation:pp .5s ease forwards 3.5s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes pp{to{opacity:1}}
</style>
<!-- Océan Atlantique -->
<rect x="240" y="0" width="180" height="240" fill="#dbeafe" rx="0"/>
<text class="ocean-lbl" x="310" y="30" text-anchor="middle">Océan Atlantique</text>
<!-- Fond continent -->
<rect x="0" y="0" width="240" height="240" fill="#fafaf9"/>
<!-- Forme simplifiée de la Guyane (polygone approximatif)
  Nord: côte Atlantique (haut)
  Ouest: Suriname (gauche)
  Est: Oyapock/Brésil (droite)
  Sud: Brésil (bas) -->
<path class="guyane" d="
  M 245,15
  L 400,15 L 415,35 L 415,80
  L 380,100 L 370,130 L 350,160
  L 310,180 L 280,200 L 260,220
  L 235,235 L 210,235 L 190,220
  L 165,210 L 140,215 L 115,205
  L 95,185  L 80,160  L 70,130
  L 60,100  L 55,70   L 65,45
  L 90,25   L 130,15
  Z"/>
<!-- Frontières labelisées -->
<text class="border-lbl" x="42" y="120" transform="rotate(-85,42,120)">← Suriname</text>
<text class="border-lbl" x="300" y="230">↑ Brésil</text>
<!-- Villes : Cayenne, Kourou, Saint-Laurent, Maripasoula -->
<circle class="city city1" cx="350" cy="80"  r="7" fill="#ef4444" stroke="white" stroke-width="2"/>
<circle class="city city2" cx="290" cy="60"  r="6" fill="#f59e0b" stroke="white" stroke-width="2"/>
<circle class="city city3" cx="110" cy="65"  r="6" fill="#8b5cf6" stroke="white" stroke-width="2"/>
<circle class="city city4" cx="170" cy="140" r="5" fill="#06b6d4" stroke="white" stroke-width="2"/>
<!-- Labels villes -->
<text class="lbl lbl1" x="358" y="77"  style="fill:#ef4444;font-weight:700">Cayenne 🏛️</text>
<text class="lbl lbl2" x="255" y="55"  style="fill:#f59e0b;font-weight:700">Kourou 🚀</text>
<text class="lbl lbl3" x="72"  y="58"  style="fill:#8b5cf6;font-weight:700">St-Laurent</text>
<text class="lbl lbl4" x="130" y="135" style="fill:#06b6d4;font-weight:600">Forêt 🌿</text>
<!-- % forêt -->
<text x="210" y="170" font-size="13" font-family="Inter,sans-serif" fill="#16a34a" font-weight="700" text-anchor="middle" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="3.5s"/>90% forêt amazonienne</text>
</svg>
<p class="anim-caption">Carte de la Guyane — 83 534 km², plus grand territoire français</p>
</div>`,

// ── hg2 : Seconde Guerre mondiale ──────────────────────────
hg2: `<div class="lesson-anim">
<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
<style>
.tl{stroke:#e2e8f0;stroke-width:3;stroke-linecap:round}
.tl-fill{stroke:#334155;stroke-width:3;stroke-linecap:round;stroke-dasharray:340;stroke-dashoffset:340;animation:dr 2s ease forwards .3s}
.dot{fill:#ef4444;opacity:0}
.d0{animation:pp .3s ease forwards .5s}
.d1{animation:pp .3s ease forwards .9s}
.d2{animation:pp .3s ease forwards 1.3s}
.d3{animation:pp .3s ease forwards 1.7s}
.d4{animation:pp .3s ease forwards 2.1s}
.d5{animation:pp .3s ease forwards 2.5s}
.d6{animation:pp .3s ease forwards 2.9s}
.ev{font:10px Inter,sans-serif;fill:#334155;opacity:0}
.e0{animation:pp .3s ease forwards .6s}
.e1{animation:pp .3s ease forwards 1s}
.e2{animation:pp .3s ease forwards 1.4s}
.e3{animation:pp .3s ease forwards 1.8s}
.e4{animation:pp .3s ease forwards 2.2s}
.e5{animation:pp .3s ease forwards 2.6s}
.e6{animation:pp .3s ease forwards 3s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes pp{to{opacity:1}}
</style>
<!-- Ligne du temps -->
<line class="tl"      x1="30" y1="115" x2="400" y2="115"/>
<line class="tl-fill" x1="30" y1="115" x2="400" y2="115"/>
<polygon points="400,112 393,118 393,112" fill="#334155" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".3s" fill="freeze" begin="2.2s"/></polygon>

<!-- Événements : positions X -->
<!-- 1939=40, 1940=90, 1941=155, 1943=235, 1944=315, 1945≈380 -->
<circle class="dot d0" cx="40"  cy="115" r="7"/>
<circle class="dot d1" cx="90"  cy="115" r="7" fill="#f59e0b"/>
<circle class="dot d2" cx="155" cy="115" r="7" fill="#3b82f6"/>
<circle class="dot d3" cx="235" cy="115" r="6" fill="#8b5cf6"/>
<circle class="dot d4" cx="305" cy="115" r="7" fill="#16a34a"/>
<circle class="dot d5" cx="365" cy="115" r="8" fill="#16a34a"/>

<!-- Années -->
<text class="ev e0" x="26"  y="135" style="font-weight:700;fill:#ef4444">1939</text>
<text class="ev e1" x="76"  y="135" style="font-weight:700;fill:#f59e0b">1940</text>
<text class="ev e2" x="141" y="135" style="font-weight:700;fill:#3b82f6">1941</text>
<text class="ev e3" x="221" y="135" style="font-weight:700;fill:#8b5cf6">1943</text>
<text class="ev e4" x="291" y="135" style="font-weight:700;fill:#16a34a">1944</text>
<text class="ev e5" x="351" y="135" style="font-weight:700;fill:#16a34a">1945</text>

<!-- Descriptions au-dessus et en-dessous en alternance -->
<text class="ev e0" x="40"  y="100" text-anchor="middle">Invasion</text>
<text class="ev e0" x="40"  y="110" text-anchor="middle">Pologne</text>

<text class="ev e1" x="90"  y="155" text-anchor="middle">Défaite FR</text>
<text class="ev e1" x="90"  y="165" text-anchor="middle">Appel 18/06</text>

<text class="ev e2" x="155" y="98"  text-anchor="middle">Barbarossa</text>
<text class="ev e2" x="155" y="108" text-anchor="middle">Pearl Harbor</text>

<text class="ev e3" x="235" y="155" text-anchor="middle">Guyane</text>
<text class="ev e3" x="235" y="165" text-anchor="middle">→ Fr. Libre</text>

<text class="ev e4" x="305" y="98"  text-anchor="middle">D-Day</text>
<text class="ev e4" x="305" y="108" text-anchor="middle">6 juin</text>

<text class="ev e5" x="365" y="155" text-anchor="middle">Fin</text>
<text class="ev e5" x="365" y="165" text-anchor="middle">8 mai</text>
</svg>
<p class="anim-caption">Chronologie de la Seconde Guerre mondiale (1939–1945)</p>
</div>`,

// ── svt1 : Biodiversité amazonienne ────────────────────────
svt1: `<div class="lesson-anim">
<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
<style>
.sky{fill:#e0f2fe}
.ground{fill:#86efac}
.tree{fill:#16a34a;opacity:0}
.trunk{fill:#92400e;opacity:0}
.t1{animation:pp .4s ease forwards .3s}.t2{animation:pp .4s ease forwards .6s}
.t3{animation:pp .4s ease forwards .9s}.t4{animation:pp .4s ease forwards 1.2s}
.t5{animation:pp .4s ease forwards 1.5s}.t6{animation:pp .4s ease forwards 1.8s}
.animal{opacity:0}
.a1{animation:pp .5s ease forwards 2.2s}
.a2{animation:pp .5s ease forwards 2.6s}
.a3{animation:pp .5s ease forwards 3s}
.lbl{font:11px Inter,sans-serif;fill:#334155;opacity:0;font-weight:600}
.l1{animation:pp .4s ease forwards 2.4s}
.l2{animation:pp .4s ease forwards 2.8s}
.l3{animation:pp .4s ease forwards 3.2s}
.stat{font:12px Inter,sans-serif;fill:#16a34a;font-weight:700;opacity:0;animation:pp .5s ease forwards 3.5s}
@keyframes pp{to{opacity:1}}
</style>
<!-- Ciel et sol -->
<rect class="sky"    x="0"   y="0"   width="420" height="160"/>
<rect class="ground" x="0"   y="155" width="420" height="45"/>
<rect fill="#22c55e" x="0"   y="148" width="420" height="15" rx="3"/>

<!-- Arbres (triangle + rectangle tronc) -->
<!-- Arbre 1 -->
<polygon class="tree t1" points="40,155 70,60 100,155"/>
<rect    class="trunk t1" x="63" y="130" width="14" height="30"/>
<!-- Arbre 2 (plus grand) -->
<polygon class="tree t2" points="100,155 140,40 180,155"/>
<rect    class="trunk t2" x="133" y="120" width="16" height="38"/>
<!-- Arbre 3 -->
<polygon class="tree t3" points="175,155 205,70 235,155"/>
<rect    class="trunk t3" x="198" y="128" width="13" height="28"/>
<!-- Arbre 4 (grand) -->
<polygon class="tree t4" points="225,155 270,35 315,155"/>
<rect    class="trunk t4" x="263" y="115" width="17" height="42"/>
<!-- Arbre 5 -->
<polygon class="tree t5" points="310,155 340,75 370,155"/>
<rect    class="trunk t5" x="333" y="128" width="13" height="28"/>
<!-- Arbre 6 (derrière) -->
<polygon class="tree t6" points="360,155 395,50 420,155" fill="#15803d"/>
<rect    class="trunk t6" x="388" y="125" width="14" height="30" fill="#78350f"/>

<!-- Animaux silhouettes -->
<!-- Oiseau (ara) en vol - simple -->
<g class="animal a1">
  <path d="M 80,80 Q 90,70 100,80 Q 110,70 120,80" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
  <circle cx="100" cy="78" r="4" fill="#ef4444"/>
  <text class="lbl l1" x="90" y="66" style="opacity:1;fill:#ef4444;font-size:10px">🦜 Ara rouge</text>
</g>
<!-- Jaguar -->
<g class="animal a2">
  <ellipse cx="220" cy="152" rx="22" ry="10" fill="#f59e0b"/>
  <circle  cx="240" cy="148" r="8" fill="#f59e0b"/>
  <circle  cx="243" cy="146" r="2" fill="#1c1917"/>
  <!-- taches -->
  <circle cx="222" cy="150" r="3" fill="#78350f" opacity=".7"/>
  <circle cx="210" cy="154" r="2.5" fill="#78350f" opacity=".7"/>
  <text class="lbl l2" x="193" y="168" style="opacity:1;fill:#92400e;font-size:10px">🐆 Jaguar</text>
</g>
<!-- Grenouille dendrobate -->
<g class="animal a3">
  <ellipse cx="350" cy="154" rx="10" ry="8" fill="#3b82f6"/>
  <circle  cx="343" cy="148" r="4" fill="#3b82f6"/>
  <circle  cx="341" cy="147" r="2" fill="#1e3a8a"/>
  <circle  cx="357" cy="148" r="4" fill="#3b82f6"/>
  <circle  cx="359" cy="147" r="2" fill="#1e3a8a"/>
  <text class="lbl l3" x="328" y="170" style="opacity:1;fill:#1d4ed8;font-size:10px">🐸 Dendrobate</text>
</g>

<!-- Stat en bas -->
<text class="stat" x="210" y="192" text-anchor="middle">5 000 espèces végétales · 700 espèces d'oiseaux · 90% du territoire</text>
</svg>
<p class="anim-caption">La forêt guyanaise — une des plus grandes biodiversités de la planète</p>
</div>`,

// ── svt2 : La cellule ───────────────────────────────────────
svt2: `<div class="lesson-anim">
<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
<style>
.cell-bg{fill:#f0fdf4;stroke:#16a34a;stroke-width:2.5;stroke-dasharray:700;stroke-dashoffset:700;animation:dr 2s ease forwards .2s}
.noyau{fill:#bfdbfe;stroke:#3b82f6;stroke-width:2;opacity:0;animation:pp .5s ease forwards 2.2s}
.mito{fill:#fde68a;stroke:#f59e0b;stroke-width:1.5;opacity:0}
.m1{animation:pp .4s ease forwards 2.6s}
.m2{animation:pp .4s ease forwards 2.9s}
.ribo{fill:#fbcfe8;opacity:0}
.r1{animation:pp .3s ease forwards 3.2s}
.r2{animation:pp .3s ease forwards 3.3s}
.r3{animation:pp .3s ease forwards 3.4s}
.lbl{font:11px Inter,sans-serif;fill:#334155;font-weight:600;opacity:0}
.ln{animation:pp .4s ease forwards 2.4s}
.lm{animation:pp .4s ease forwards 3s}
.lr{animation:pp .4s ease forwards 3.5s}
.arrow{stroke:#94a3b8;stroke-width:1.5;fill:none;opacity:0}
.an{animation:pp .4s ease forwards 2.5s}
.am{animation:pp .4s ease forwards 3.1s}
.ar{animation:pp .4s ease forwards 3.6s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes pp{to{opacity:1}}
</style>
<!-- Membrane cellulaire (ellipse) -->
<ellipse class="cell-bg" cx="210" cy="115" rx="190" ry="100"/>

<!-- Noyau -->
<ellipse class="noyau" cx="210" cy="105" rx="55" ry="45"/>
<text x="210" y="108" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#1d4ed8" font-weight="700" opacity="0" class="ln" style="animation:pp .4s ease forwards 2.3s">ADN</text>

<!-- Mitochondries -->
<ellipse class="mito m1" cx="115" cy="145" rx="28" ry="16"/>
<ellipse class="mito m2" cx="310" cy="80"  rx="24" ry="13"/>

<!-- Ribosomes (petits ronds) -->
<circle class="ribo r1" cx="145" cy="90"  r="5" fill="#f9a8d4"/>
<circle class="ribo r2" cx="285" cy="145" r="5" fill="#f9a8d4"/>
<circle class="ribo r3" cx="165" cy="165" r="5" fill="#f9a8d4"/>

<!-- Flèches et labels -->
<!-- Noyau -->
<line class="arrow an" x1="260" y1="70" x2="300" y2="45"/>
<text class="lbl ln" x="302" y="43">Noyau (ADN)</text>
<!-- Mitochondrie -->
<line class="arrow am" x1="140" y1="133" x2="110" y2="108"/>
<text class="lbl lm" x="22" y="106">Mitochondrie</text>
<text class="lbl lm" x="22" y="118" style="font-weight:400;font-size:9px">(énergie ATP)</text>
<!-- Ribosome -->
<line class="arrow ar" x1="150" y1="90" x2="165" y2="55"/>
<text class="lbl lr" x="100" y="52">Ribosome</text>
<text class="lbl lr" x="100" y="64" style="font-weight:400;font-size:9px">(protéines)</text>
<!-- Membrane -->
<text x="25" y="145" font-size="10" font-family="Inter,sans-serif" fill="#16a34a" font-weight="600" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2.1s"/>Membrane</text>
<text x="28" y="157" font-size="9" font-family="Inter,sans-serif" fill="#16a34a" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2.1s"/>cellulaire</text>
</svg>
<p class="anim-caption">Structure d'une cellule eucaryote — noyau, mitochondries et ribosomes</p>
</div>`,

// ── fr1 : Commentaire littéraire ───────────────────────────
fr1: `<div class="lesson-anim">
<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
<style>
.box{rx:8;opacity:0}
.b0{animation:pp .4s ease forwards .3s}
.b1{animation:pp .4s ease forwards .9s}
.b2{animation:pp .4s ease forwards 1.5s}
.b3{animation:pp .4s ease forwards 2.1s}
.arrow{stroke:#94a3b8;stroke-width:2.5;stroke-linecap:round;opacity:0}
.arr1{animation:pp .3s ease forwards .6s}
.arr2{animation:pp .3s ease forwards 1.2s}
.arr3{animation:pp .3s ease forwards 1.8s}
.lbl{font:12px Inter,sans-serif;font-weight:700;opacity:0}
.sub{font:10px Inter,sans-serif;font-weight:400;fill:#64748b;opacity:0}
.l0{animation:pp .4s ease forwards .4s}
.l1{animation:pp .4s ease forwards 1s}
.l2{animation:pp .4s ease forwards 1.6s}
.l3{animation:pp .4s ease forwards 2.2s}
.tip{font:10px Inter,sans-serif;fill:#94a3b8;opacity:0;animation:pp .5s ease forwards 2.8s}
@keyframes pp{to{opacity:1}}
</style>

<!-- 1. Introduction -->
<rect class="box b0" x="10"  y="20"  width="90" height="55" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="8"/>
<text class="lbl l0" x="55" y="44"  text-anchor="middle" fill="#1d4ed8">Intro</text>
<text class="sub l0" x="55" y="57"  text-anchor="middle">Amorce</text>
<text class="sub l0" x="55" y="68"  text-anchor="middle">Problématique</text>

<!-- Flèche → -->
<line class="arrow arr1" x1="102" y1="47" x2="118" y2="47"/>
<polygon points="118,44 125,47 118,50" fill="#94a3b8" opacity="0" class="arr1"/>

<!-- 2. Axe I -->
<rect class="box b1" x="125" y="10" width="80" height="75" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" rx="8"/>
<text class="lbl l1" x="165" y="38"  text-anchor="middle" fill="#15803d">Axe I</text>
<text class="sub l1" x="165" y="52"  text-anchor="middle">Idée</text>
<text class="sub l1" x="165" y="63"  text-anchor="middle">→ Citation</text>
<text class="sub l1" x="165" y="74"  text-anchor="middle">→ Analyse</text>

<!-- Flèche → -->
<line class="arrow arr2" x1="207" y1="47" x2="223" y2="47"/>
<polygon points="223,44 230,47 223,50" fill="#94a3b8" opacity="0" class="arr2"/>

<!-- 3. Axe II -->
<rect class="box b2" x="230" y="10" width="80" height="75" fill="#fff7ed" stroke="#f59e0b" stroke-width="2" rx="8"/>
<text class="lbl l2" x="270" y="38"  text-anchor="middle" fill="#d97706">Axe II</text>
<text class="sub l2" x="270" y="52"  text-anchor="middle">Idée</text>
<text class="sub l2" x="270" y="63"  text-anchor="middle">→ Citation</text>
<text class="sub l2" x="270" y="74"  text-anchor="middle">→ Analyse</text>

<!-- Flèche → -->
<line class="arrow arr3" x1="312" y1="47" x2="328" y2="47"/>
<polygon points="328,44 335,47 328,50" fill="#94a3b8" opacity="0" class="arr3"/>

<!-- 4. Conclusion -->
<rect class="box b3" x="335" y="20" width="78" height="55" fill="#fdf4ff" stroke="#8b5cf6" stroke-width="2" rx="8"/>
<text class="lbl l3" x="374" y="44"  text-anchor="middle" fill="#7c3aed">Ccl.</text>
<text class="sub l3" x="374" y="57"  text-anchor="middle">Bilan</text>
<text class="sub l3" x="374" y="68"  text-anchor="middle">Ouverture</text>

<!-- Méthode sous les blocs -->
<rect x="125" y="100" width="185" height="30" rx="6" fill="#f0fdf4" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2.5s"/></rect>
<text x="218" y="112" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#16a34a" font-weight="700" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2.6s"/>IDÉE → CITATION → ANALYSE</text>
<text x="218" y="124" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#64748b" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2.7s"/>Répéter pour chaque sous-partie</text>

<text class="tip" x="210" y="165" text-anchor="middle">💡 Utilise des connecteurs logiques entre tes axes : "Dans un premier temps… En outre… Enfin…"</text>
</svg>
<p class="anim-caption">Structure du commentaire littéraire — les 4 grandes parties</p>
</div>`,

// ── pc1 : Lois de Newton ────────────────────────────────────
pc1: `<div class="lesson-anim">
<svg viewBox="0 0 420 210" xmlns="http://www.w3.org/2000/svg">
<style>
.sol{fill:#e2e8f0;rx:4}
.bloc{fill:#3b82f6;rx:6;opacity:0;animation:pp .4s ease forwards .3s}
.f-push{stroke:#16a34a;stroke-width:3;stroke-linecap:round;marker-end:url(#ga);opacity:0;animation:pp .4s ease forwards .8s}
.f-fric{stroke:#ef4444;stroke-width:3;stroke-linecap:round;marker-end:url(#ra);opacity:0;animation:pp .4s ease forwards 1s}
.f-weight{stroke:#f59e0b;stroke-width:3;stroke-linecap:round;marker-end:url(#ya);opacity:0;animation:pp .4s ease forwards 1.2s}
.f-normal{stroke:#8b5cf6;stroke-width:3;stroke-linecap:round;marker-end:url(#pa);opacity:0;animation:pp .4s ease forwards 1.4s}
.lbl{font:12px Inter,sans-serif;font-weight:700;opacity:0}
.lg{fill:#16a34a;animation:pp .4s ease forwards .9s}
.lr{fill:#ef4444;animation:pp .4s ease forwards 1.1s}
.ly{fill:#d97706;animation:pp .4s ease forwards 1.3s}
.lp{fill:#7c3aed;animation:pp .4s ease forwards 1.5s}
.eq{font:14px Inter,sans-serif;font-weight:700;opacity:0;animation:pp .5s ease forwards 2s}
.rocket{opacity:0;animation:pp .5s ease forwards 2.5s}
@keyframes pp{to{opacity:1}}
</style>
<defs>
<marker id="ga" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#16a34a"/></marker>
<marker id="ra" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#ef4444"/></marker>
<marker id="ya" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#f59e0b"/></marker>
<marker id="pa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#8b5cf6"/></marker>
</defs>
<!-- Sol -->
<rect class="sol" x="60" y="148" width="220" height="16" rx="4"/>
<line stroke="#94a3b8" stroke-width="1.5" x1="60" y1="164" x2="80" y2="178"/>
<line stroke="#94a3b8" stroke-width="1.5" x1="100" y1="164" x2="120" y2="178"/>
<line stroke="#94a3b8" stroke-width="1.5" x1="140" y1="164" x2="160" y2="178"/>
<line stroke="#94a3b8" stroke-width="1.5" x1="180" y1="164" x2="200" y2="178"/>
<line stroke="#94a3b8" stroke-width="1.5" x1="220" y1="164" x2="240" y2="178"/>
<!-- Bloc -->
<rect class="bloc" x="120" y="100" width="80" height="48" rx="6"/>
<text x="160" y="130" text-anchor="middle" font-size="12" font-family="Inter,sans-serif" fill="white" font-weight="700" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin=".4s"/>m</text>
<!-- Flèches forces -->
<!-- Poussée (droite) -->
<line class="f-push" x1="60" y1="124" x2="118" y2="124"/>
<!-- Frottement (gauche) -->
<line class="f-fric" x1="202" y1="136" x2="260" y2="136"/>
<!-- Poids (bas) -->
<line class="f-weight" x1="160" y1="149" x2="160" y2="195"/>
<!-- Réaction normale (haut) -->
<line class="f-normal" x1="160" y1="100" x2="160" y2="54"/>
<!-- Labels forces -->
<text class="lbl lg" x="35"  y="115">F (poussée)</text>
<text class="lbl lr" x="262" y="128">f (frottement)</text>
<text class="lbl ly" x="165" y="192">P = mg</text>
<text class="lbl lp" x="163" y="50">N (normale)</text>
<!-- Équation -->
<rect x="290" y="90" width="120" height="55" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2s"/></rect>
<text class="eq" x="350" y="113" text-anchor="middle" fill="#15803d">ΣF = m·a</text>
<text x="350" y="132" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#64748b" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".4s" fill="freeze" begin="2.2s"/>2ème loi Newton</text>
<!-- Rocket Kourou -->
<g class="rocket">
  <polygon points="370,60 360,90 380,90" fill="#334155"/>
  <rect x="362" y="88" width="16" height="30" fill="#64748b"/>
  <polygon points="362,118 355,135 369,118" fill="#ef4444"/>
  <polygon points="378,118 385,135 371,118" fill="#ef4444"/>
  <ellipse cx="370" cy="130" rx="5" ry="8" fill="#f59e0b" opacity=".8"/>
  <text x="390" y="85" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Ariane 6</text>
  <text x="390" y="96" font-size="9" font-family="Inter,sans-serif" fill="#64748b">Kourou 🚀</text>
</g>
</svg>
<p class="anim-caption">2ème loi de Newton — ΣF = m·a s'applique à chaque objet en mouvement</p>
</div>`,

// ── en1 : Present Perfect ───────────────────────────────────
en1: `<div class="lesson-anim">
<svg viewBox="0 0 420 190" xmlns="http://www.w3.org/2000/svg">
<style>
.tl{stroke:#e2e8f0;stroke-width:3}
.tl-fill{stroke:#334155;stroke-width:3;stroke-dasharray:360;stroke-dashoffset:360;animation:dr 1.5s ease forwards .2s}
.dot-past{fill:#ef4444;opacity:0;animation:pp .4s ease forwards 1.7s}
.dot-now{fill:#16a34a;opacity:0;animation:pp .4s ease forwards 2.5s}
.link{stroke:#3b82f6;stroke-width:2.5;stroke-dasharray:140;stroke-dashoffset:140;animation:dr 1s ease forwards 2s}
.lbl{font:12px Inter,sans-serif;fill:#334155;opacity:0}
.l1{animation:pp .4s ease forwards 1.8s}
.l2{animation:pp .4s ease forwards 2.6s}
.l3{animation:pp .4s ease forwards 2.2s}
.ex{font:11px Inter,sans-serif;fill:#64748b;opacity:0;animation:pp .5s ease forwards 3s}
.pp-box{fill:#dbeafe;stroke:#3b82f6;stroke-width:2;opacity:0;animation:pp .5s ease forwards 3.2s}
.simple-box{fill:#fef3c7;stroke:#f59e0b;stroke-width:2;opacity:0;animation:pp .4s ease forwards 3.6s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes pp{to{opacity:1}}
</style>
<!-- Ligne du temps -->
<line class="tl"      x1="30" y1="95" x2="400" y2="95"/>
<line class="tl-fill" x1="30" y1="95" x2="400" y2="95"/>
<polygon points="400,92 393,98 393,92" fill="#334155" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".3s" fill="freeze" begin="1.6s"/></polygon>
<!-- Etiquettes temporelles -->
<text x="30"  y="115" font-size="11" font-family="Inter,sans-serif" fill="#94a3b8" text-anchor="middle" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".3s" fill="freeze" begin=".5s"/>Passé</text>
<text x="390" y="115" font-size="11" font-family="Inter,sans-serif" fill="#16a34a" text-anchor="middle" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".3s" fill="freeze" begin="1.5s"/>Maintenant</text>
<!-- Événement passé -->
<circle class="dot-past" cx="150" cy="95" r="10"/>
<text class="lbl l1" x="150" y="77" text-anchor="middle" fill="#ef4444" font-weight="700">Événement passé</text>
<text class="lbl l1" x="150" y="134" text-anchor="middle" fill="#ef4444">She lost her keys</text>
<!-- Lien avec le présent -->
<line class="link" x1="160" y1="95" x2="370" y2="95" stroke="#3b82f6"/>
<text class="lbl l3" x="265" y="82" text-anchor="middle" fill="#3b82f6" font-weight="600">lien avec le présent</text>
<!-- Maintenant -->
<circle class="dot-now" cx="375" cy="95" r="10" fill="#16a34a" stroke="white" stroke-width="2"/>
<text class="lbl l2" x="360" y="77" text-anchor="middle" fill="#16a34a" font-weight="700">Résultat présent</text>
<text class="lbl l2" x="365" y="134" text-anchor="middle" fill="#16a34a">(les clés sont perdues)</text>

<!-- Comparaison PP vs Prétérit -->
<rect class="pp-box" x="20" y="150" width="180" height="32" rx="6"/>
<text x="110" y="163" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#1d4ed8" font-weight="700" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="3.3s"/>Present Perfect</text>
<text x="110" y="176" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#3b82f6" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="3.4s"/>She HAS lost her keys.</text>

<rect class="simple-box" x="220" y="150" width="180" height="32" rx="6"/>
<text x="310" y="163" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#d97706" font-weight="700" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="3.7s"/>Prétérit (date précise)</text>
<text x="310" y="176" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#f59e0b" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="3.8s"/>She LOST them yesterday.</text>
</svg>
<p class="anim-caption">Le Present Perfect relie un événement passé à un résultat présent</p>
</div>`,

// ── ses1 : Offre et demande ─────────────────────────────────
ses1: `<div class="lesson-anim">
<svg viewBox="0 0 420 230" xmlns="http://www.w3.org/2000/svg">
<style>
.g{stroke:#e2e8f0;stroke-width:1}
.ax{stroke:#334155;stroke-width:2.5}
.demand{fill:none;stroke:#ef4444;stroke-width:3;stroke-linecap:round;stroke-dasharray:280;stroke-dashoffset:280;animation:dr 1.5s ease forwards .5s}
.supply{fill:none;stroke:#16a34a;stroke-width:3;stroke-linecap:round;stroke-dasharray:280;stroke-dashoffset:280;animation:dr 1.5s ease forwards 1s}
.eq-dot{fill:#f59e0b;opacity:0;animation:pp .5s ease forwards 2.5s}
.eq-v{stroke:#f59e0b;stroke-width:1.5;stroke-dasharray:5 4;opacity:0;animation:pp .4s ease forwards 2.6s}
.lbl{font:12px Inter,sans-serif;fill:#64748b}
.ld{font:13px Inter,sans-serif;fill:#ef4444;font-weight:700;opacity:0;animation:pp .4s ease forwards 1.4s}
.ls{font:13px Inter,sans-serif;fill:#16a34a;font-weight:700;opacity:0;animation:pp .4s ease forwards 1.9s}
.le{font:12px Inter,sans-serif;fill:#d97706;font-weight:700;opacity:0;animation:pp .5s ease forwards 2.7s}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes pp{to{opacity:1}}
</style>
<!-- Grille -->
<line class="g" x1="55" y1="40"  x2="380" y2="40"/>
<line class="g" x1="55" y1="80"  x2="380" y2="80"/>
<line class="g" x1="55" y1="120" x2="380" y2="120"/>
<line class="g" x1="55" y1="160" x2="380" y2="160"/>
<line class="g" x1="120" y1="20" x2="120" y2="200"/>
<line class="g" x1="190" y1="20" x2="190" y2="200"/>
<line class="g" x1="260" y1="20" x2="260" y2="200"/>
<line class="g" x1="330" y1="20" x2="330" y2="200"/>
<!-- Axes (origine 55,200, scale Q horizontal, P vertical) -->
<line class="ax" x1="50"  y1="200" x2="390" y2="200"/>
<line class="ax" x1="55"  y1="205" x2="55"  y2="15"/>
<polygon points="390,197 383,203 383,197" fill="#334155"/>
<polygon points="52,15 55,9 58,15" fill="#334155"/>
<!-- Labels axes -->
<text class="lbl" x="385" y="215">Q</text>
<text class="lbl" x="59"  y="13">P</text>
<!-- Étiquettes Q et P -->
<text class="lbl" x="117" y="215">1</text>
<text class="lbl" x="187" y="215">2</text>
<text class="lbl" x="257" y="215">3</text>
<text class="lbl" x="327" y="215">4</text>
<text class="lbl" x="35"  y="44">4</text>
<text class="lbl" x="35"  y="84">3</text>
<text class="lbl" x="35"  y="124">2</text>
<text class="lbl" x="35"  y="164">1</text>

<!-- Courbe de demande (décroissante) : Q=1→P=4, Q=4→P=1
  Points: (120,40) (190,80) (260,120) (330,160) -->
<polyline class="demand" points="120,40 190,80 260,120 330,160"/>

<!-- Courbe d'offre (croissante) : Q=1→P=1, Q=4→P=4
  Points: (120,160) (190,120) (260,80) (330,40) -->
<polyline class="supply" points="120,160 190,120 260,80 330,40"/>

<!-- Point d'équilibre (Q=2.5, P=2.5) → pixel (225, 100) -->
<line class="eq-v" x1="225" y1="100" x2="225" y2="200"/>
<line class="eq-v" x1="55"  y1="100" x2="225" y2="100"/>
<circle class="eq-dot" cx="225" cy="100" r="9"/>
<circle cx="225" cy="100" r="5" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="2.5s"/></circle>

<!-- Labels courbes -->
<text class="ld" x="335" y="175">Demande</text>
<text class="ls" x="335" y="38">Offre</text>
<text class="le" x="232" y="95">Équilibre</text>
<text class="le" x="232" y="108" style="font-size:10px">(P*,Q*)</text>
</svg>
<p class="anim-caption">L'offre (↗) et la demande (↘) se croisent au prix d'équilibre du marché</p>
</div>`,

// ── ph1 : La liberté ────────────────────────────────────────
ph1: `<div class="lesson-anim">
<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
<style>
.path-road{fill:#e2e8f0;opacity:0;animation:pp .5s ease forwards .2s}
.road-left{fill:#d1fae5;stroke:#16a34a;stroke-width:2;opacity:0;animation:pp .6s ease forwards .8s}
.road-right{fill:#fee2e2;stroke:#ef4444;stroke-width:2;opacity:0;animation:pp .6s ease forwards 1.2s}
.person{opacity:0;animation:pp .5s ease forwards .3s}
.sign{opacity:0;animation:pp .4s ease forwards 2s}
.lbl{font:11px Inter,sans-serif;fill:#334155;opacity:0}
.l1{animation:pp .5s ease forwards .9s}
.l2{animation:pp .5s ease forwards 1.3s}
.bubble{fill:white;stroke:#334155;stroke-width:2;opacity:0;animation:pp .5s ease forwards 2.4s}
.bubble-text{font:11px Inter,sans-serif;fill:#334155;font-weight:600;opacity:0;animation:pp .5s ease forwards 2.5s}
.quote{font:10px Inter,sans-serif;fill:#64748b;font-style:italic;opacity:0;animation:pp .5s ease forwards 3.2s}
@keyframes pp{to{opacity:1}}
</style>

<!-- Route principale (bas) -->
<polygon class="path-road" points="160,195 200,130 220,130 260,195"/>

<!-- Fourche gauche (vers liberté/choix) -->
<polygon class="road-left" points="200,130 160,60 185,60 220,130"/>

<!-- Fourche droite (déterminisme) -->
<polygon class="road-right" points="220,130 235,60 260,60 260,195" opacity="0">
  <animate attributeName="opacity" from="0" to="0.85" dur=".6s" fill="freeze" begin="1.2s"/>
</polygon>
<polygon class="road-right" points="220,130 235,60 260,60 250,130"/>

<!-- Personnage au carrefour -->
<g class="person">
  <circle cx="210" cy="118" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <line x1="210" y1="128" x2="210" y2="155" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <line x1="210" y1="133" x2="197" y2="145" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="210" y1="133" x2="223" y2="145" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="210" y1="155" x2="200" y2="170" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="210" y1="155" x2="220" y2="170" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
</g>

<!-- Panneaux directionnels -->
<g class="sign">
  <rect x="148" y="68" width="70" height="24" rx="4" fill="#d1fae5" stroke="#16a34a" stroke-width="2"/>
  <text x="183" y="84" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#15803d" font-weight="700">Libre arbitre</text>
  <rect x="242" y="68" width="75" height="24" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
  <text x="279" y="84" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#dc2626" font-weight="700">Déterminisme</text>
</g>

<!-- Labels auteurs -->
<text class="lbl l1" x="105" y="56" style="fill:#16a34a;font-weight:700">Sartre :</text>
<text class="lbl l1" x="105" y="68">"Condamné</text>
<text class="lbl l1" x="105" y="80">à être libre"</text>
<text class="lbl l2" x="322" y="56" style="fill:#ef4444;font-weight:700">Spinoza :</text>
<text class="lbl l2" x="322" y="68">"Les causes</text>
<text class="lbl l2" x="322" y="80">nous guident"</text>

<!-- Bulle de pensée -->
<ellipse class="bubble" cx="245" cy="98" rx="30" ry="18"/>
<path d="M 215,108 Q 218,115 222,112 Q 219,118 224,116" fill="white" stroke="#334155" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="2.4s"/></path>
<text class="bubble-text" x="245" y="95" text-anchor="middle">CHOIX ?</text>
<text class="bubble-text" x="245" y="108" text-anchor="middle" style="font-size:9px">LIBERTÉ ?</text>

<!-- Citation Sartre en bas -->
<rect x="10" y="178" width="400" height="20" rx="4" fill="#f0fdf4" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" fill="freeze" begin="3.2s"/></rect>
<text class="quote" x="210" y="192" text-anchor="middle">« L'existence précède l'essence » — Sartre · « La liberté, c'est la nécessité comprise » — Spinoza</text>
</svg>
<p class="anim-caption">La liberté — entre libre arbitre (Sartre) et déterminisme (Spinoza)</p>
</div>`,

};
