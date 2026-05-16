import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Inline styles for keyframe animations ─────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  .font-bebas { font-family: 'Bebas Neue', sans-serif; }
  .font-raj   { font-family: 'Rajdhani', sans-serif; }

  @keyframes zoomIn {
    from { transform: scale(0.88) translateY(20px); opacity: 0; }
    to   { transform: scale(1)    translateY(0);    opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(60px) scale(0.95); opacity: 0; }
    to   { transform: translateX(0)    scale(1);    opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-60px) scale(0.95); opacity: 0; }
    to   { transform: translateX(0)     scale(1);    opacity: 1; }
  }
  @keyframes fadeUp {
    from { transform: translateY(18px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes charFloat {
    0%,100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-10px) scale(1.02); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-glow {
    0%,100% { opacity: 0.6; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.08); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes progress-fill {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes particle-up {
    0%   { transform: translateY(0)    scale(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.7; }
    100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(400%); }
  }

  .anim-zoom-in    { animation: zoomIn      0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
  .anim-slide-r    { animation: slideInRight 0.6s  cubic-bezier(0.22,1,0.36,1) forwards; }
  .anim-slide-l    { animation: slideInLeft  0.6s  cubic-bezier(0.22,1,0.36,1) forwards; }
  .anim-fade-up-1  { animation: fadeUp 0.55s 0.10s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-fade-up-2  { animation: fadeUp 0.55s 0.22s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-fade-up-3  { animation: fadeUp 0.55s 0.34s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-fade-up-4  { animation: fadeUp 0.55s 0.46s cubic-bezier(0.22,1,0.36,1) both; }
  .char-float      { animation: charFloat 4s ease-in-out infinite; }
  .pulse-glow      { animation: pulse-glow 2.5s ease-in-out infinite; }
  .spin-slow       { animation: spin-slow 18s linear infinite; }
  .shimmer-line {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    background-size: 200% auto;
    animation: shimmer 2.8s linear infinite;
  }
`;

/* ─── Slide Data ─────────────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    title: "INVINCIBLE",
    titleAccent: "VS",
    accentBg: "linear-gradient(135deg,#ef4444,#991b1b)",
    badge: "B 23039865",
    badgeBg: "linear-gradient(135deg,#22c55e,#16a34a)",
    badgeShadow: "0 0 16px rgba(34,197,94,0.5)",
    platform: "PC",
    tag: "Own CSF",
    year: "2026",
    desc: "A brutal superhero 3v3 tag fighting game set in the Invincible universe. Battle to the death as fan-favorite characters in iconic locations. Unleash bone-breaking combos through fast combat and smart defensive tactics.",
    orb1: "rgba(59,130,246,0.22)",
    orb2: "rgba(99,102,241,0.12)",
    bgGrad:
      "radial-gradient(ellipse at 75% 45%, #0d1f4a 0%, #05090f 55%, #020305 100%)",
    btnColor: "linear-gradient(135deg,#3b82f6,#2563eb)",
    btnShadow: "0 6px 24px rgba(59,130,246,0.5)",
    accentColor: "#60a5fa",
    progColor: "linear-gradient(90deg,#3b82f6,#60a5fa)",
    progGlow: "rgba(59,130,246,0.7)",
    CharSVG: InvincibleSVG,
  },
  {
    id: 1,
    title: "STELLAR",
    titleAccent: "VOID",
    accentBg: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    badge: "B 23041220",
    badgeBg: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    badgeShadow: "0 0 16px rgba(139,92,246,0.5)",
    platform: "PC · PS5",
    tag: "Space RPG",
    year: "2026",
    desc: "Navigate the void between dying stars. Command a fleet of rogue vessels, forge alliances, and unravel the ancient mystery consuming entire solar systems in this open-world space epic.",
    orb1: "rgba(139,92,246,0.25)",
    orb2: "rgba(59,130,246,0.1)",
    bgGrad:
      "radial-gradient(ellipse at 72% 45%, #1a0d35 0%, #0d0a1a 45%, #030206 100%)",
    btnColor: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    btnShadow: "0 6px 24px rgba(139,92,246,0.5)",
    accentColor: "#a78bfa",
    progColor: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
    progGlow: "rgba(139,92,246,0.7)",
    CharSVG: StellarSVG,
  },
  {
    id: 2,
    title: "IRON",
    titleAccent: "BASTION",
    accentBg: "linear-gradient(135deg,#ef4444,#b91c1c)",
    badge: "B 23042110",
    badgeBg: "linear-gradient(135deg,#ef4444,#b91c1c)",
    badgeShadow: "0 0 16px rgba(239,68,68,0.5)",
    platform: "PC · Xbox",
    tag: "Action RPG",
    year: "2026",
    desc: "Forge your legend in a dying empire. Master 300+ weapons, lead armies against demonic hordes, and rewrite the fate of a continent standing on the brink of eternal darkness.",
    orb1: "rgba(239,68,68,0.2)",
    orb2: "rgba(220,38,38,0.1)",
    bgGrad:
      "radial-gradient(ellipse at 70% 45%, #350d0d 0%, #1a0505 45%, #040101 100%)",
    btnColor: "linear-gradient(135deg,#ef4444,#b91c1c)",
    btnShadow: "0 6px 24px rgba(239,68,68,0.5)",
    accentColor: "#f87171",
    progColor: "linear-gradient(90deg,#ef4444,#f87171)",
    progGlow: "rgba(239,68,68,0.7)",
    CharSVG: IronSVG,
  },
  {
    id: 3,
    title: "NEXUS",
    titleAccent: "COMMAND",
    accentBg: "linear-gradient(135deg,#10b981,#059669)",
    badge: "B 23043890",
    badgeBg: "linear-gradient(135deg,#10b981,#059669)",
    badgeShadow: "0 0 16px rgba(16,185,129,0.5)",
    platform: "PC · Mac",
    tag: "Strategy",
    year: "2026",
    desc: "Control territories, manage resources, and outwit rival commanders in a living world that evolves around your decisions. Every alliance forged and battle fought rewrites history.",
    orb1: "rgba(16,185,129,0.2)",
    orb2: "rgba(5,150,105,0.1)",
    bgGrad:
      "radial-gradient(ellipse at 70% 45%, #0d2a1a 0%, #050f0a 45%, #020503 100%)",
    btnColor: "linear-gradient(135deg,#10b981,#059669)",
    btnShadow: "0 6px 24px rgba(16,185,129,0.5)",
    accentColor: "#34d399",
    progColor: "linear-gradient(90deg,#10b981,#34d399)",
    progGlow: "rgba(16,185,129,0.7)",
    CharSVG: NexusSVG,
  },
  {
    id: 4,
    title: "DRAGON",
    titleAccent: "EPOCH",
    accentBg: "linear-gradient(135deg,#f59e0b,#d97706)",
    badge: "B 23045670",
    badgeBg: "linear-gradient(135deg,#f59e0b,#d97706)",
    badgeShadow: "0 0 16px rgba(245,158,11,0.5)",
    platform: "PC · PS5 · Xbox",
    tag: "Open World",
    year: "2026",
    desc: "Bond with ancient dragons, shape kingdoms, and become legend in a living fantasy world spanning 10,000 years of history. Your choices echo across generations.",
    orb1: "rgba(245,158,11,0.2)",
    orb2: "rgba(217,119,6,0.1)",
    bgGrad:
      "radial-gradient(ellipse at 70% 45%, #2a1a0d 0%, #100905 45%, #040201 100%)",
    btnColor: "linear-gradient(135deg,#f59e0b,#d97706)",
    btnShadow: "0 6px 24px rgba(245,158,11,0.5)",
    accentColor: "#fbbf24",
    progColor: "linear-gradient(90deg,#f59e0b,#fbbf24)",
    progGlow: "rgba(245,158,11,0.7)",
    CharSVG: DragonSVG,
  },
];

/* ─── SVG Characters ─────────────────────────────────────────────── */
function InvincibleSVG() {
  return (
    <svg
      viewBox="0 0 420 340"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="ig1" cx="55%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a8fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4a8fff" stopOpacity="0" />
        </radialGradient>
        <filter id="iglow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="210" cy="310" rx="160" ry="14" fill="rgba(0,0,0,0.45)" />
      <ellipse cx="210" cy="180" rx="200" ry="150" fill="url(#ig1)" />
      {/* Left fighter red */}
      <g filter="url(#iglow)">
        <ellipse cx="148" cy="165" rx="44" ry="52" fill="#c8302a" />
        <ellipse cx="148" cy="102" rx="31" ry="35" fill="#e8c4a0" />
        <ellipse cx="148" cy="79" rx="31" ry="15" fill="#111" />
        <path
          d="M 104 142 Q 78 205 83 268 L 110 258 Q 106 204 128 164 Z"
          fill="#8b1a1a"
        />
        <path
          d="M 192 142 Q 238 130 280 124"
          stroke="#e8c4a0"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="286" cy="122" rx="23" ry="19" fill="#c8302a" />
        <path
          d="M 104 147 Q 68 168 52 184"
          stroke="#c8302a"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 128 210 Q 118 256 112 286"
          stroke="#1a1a80"
          strokeWidth="23"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 168 210 Q 178 256 190 282"
          stroke="#1a1a80"
          strokeWidth="23"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="106" y="200" width="86" height="15" rx="5" fill="#f0c030" />
      </g>
      {/* Right fighter blue */}
      <g filter="url(#iglow)">
        <ellipse cx="282" cy="170" rx="42" ry="50" fill="#1a5ea0" />
        <ellipse cx="282" cy="111" rx="29" ry="33" fill="#e8c4a0" />
        <ellipse cx="282" cy="88" rx="29" ry="14" fill="#0a0a0a" />
        <ellipse cx="282" cy="115" rx="17" ry="11" fill="#f0c030" />
        <path
          d="M 240 152 Q 208 132 182 120"
          stroke="#1a5ea0"
          strokeWidth="21"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="178" cy="118" rx="21" ry="17" fill="#f0c030" />
        <path
          d="M 324 152 Q 356 170 372 186"
          stroke="#1a5ea0"
          strokeWidth="19"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 260 212 Q 249 257 244 285"
          stroke="#0a0a50"
          strokeWidth="23"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 302 212 Q 313 257 321 283"
          stroke="#0a0a50"
          strokeWidth="23"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 322 148 Q 364 194 368 268 L 342 259 Q 340 198 314 168 Z"
          fill="#0a3a70"
        />
      </g>
      {/* Impact */}
      <circle
        cx="264"
        cy="121"
        r="38"
        fill="rgba(255,200,0,0.12)"
        stroke="rgba(255,200,0,0.55)"
        strokeWidth="2.5"
      />
      <path
        d="M 248 98 L 264 121 L 246 130"
        stroke="#ffcc00"
        strokeWidth="2.5"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M 283 98 L 264 121 L 285 130"
        stroke="#ffcc00"
        strokeWidth="2.5"
        fill="none"
        opacity="0.75"
      />
    </svg>
  );
}

function StellarSVG() {
  return (
    <svg
      viewBox="0 0 420 340"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="sg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="180" rx="200" ry="150" fill="url(#sg1)" />
      {[
        { x: 80, y: 65, r: 2 },
        { x: 355, y: 42, r: 2.5 },
        { x: 28, y: 160, r: 1.5 },
        { x: 395, y: 200, r: 2 },
        { x: 150, y: 30, r: 1.5 },
        { x: 325, y: 280, r: 2 },
        { x: 380, y: 100, r: 1 },
        { x: 50, y: 260, r: 1 },
        { x: 300, y: 50, r: 1.5 },
      ].map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="white"
          opacity={0.5 + Math.random() * 0.4}
        />
      ))}
      <ellipse cx="210" cy="200" rx="105" ry="27" fill="#1a0a3a" />
      <path
        d="M 105 200 Q 158 128 210 115 Q 262 128 315 200 Z"
        fill="#2a0a5a"
      />
      <ellipse cx="210" cy="162" rx="48" ry="38" fill="#1a0a4a" />
      <ellipse
        cx="210"
        cy="158"
        rx="36"
        ry="30"
        fill="rgba(100,60,255,0.18)"
        stroke="rgba(150,100,255,0.45)"
        strokeWidth="2"
      />
      <ellipse cx="158" cy="210" rx="22" ry="9" fill="rgba(139,92,246,0.55)" />
      <ellipse cx="262" cy="210" rx="22" ry="9" fill="rgba(139,92,246,0.55)" />
      <ellipse cx="210" cy="215" rx="32" ry="11" fill="rgba(139,92,246,0.75)" />
      <path
        d="M 210 115 L 210 30"
        stroke="rgba(139,92,246,0.65)"
        strokeWidth="4"
        strokeDasharray="6,4"
      />
      <circle cx="210" cy="24" r="7" fill="rgba(139,92,246,0.9)" />
      <circle
        cx="210"
        cy="24"
        r="14"
        fill="none"
        stroke="rgba(139,92,246,0.35)"
        strokeWidth="2"
      />
      <circle cx="140" cy="155" r="6" fill="rgba(139,92,246,0.5)" />
      <circle cx="280" cy="155" r="6" fill="rgba(139,92,246,0.5)" />
    </svg>
  );
}

function IronSVG() {
  return (
    <svg
      viewBox="0 0 420 340"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="ir1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="310" rx="150" ry="12" fill="rgba(0,0,0,0.4)" />
      <ellipse cx="210" cy="180" rx="200" ry="150" fill="url(#ir1)" />
      <rect x="228" y="185" width="52" height="72" rx="9" fill="#3a1a1a" />
      <ellipse cx="254" cy="162" rx="34" ry="38" fill="#c8845a" />
      <path
        d="M 220 147 Q 220 108 254 106 Q 288 108 288 147 L 288 158 Q 288 142 254 142 Q 220 142 220 158 Z"
        fill="#1a1a1a"
      />
      <rect x="240" y="144" width="26" height="7" rx="2.5" fill="#8b0000" />
      <path
        d="M 228 185 Q 210 196 204 220 L 226 220 L 228 185 Z"
        fill="#2a1010"
      />
      <path
        d="M 280 185 Q 298 196 304 220 L 282 220 L 280 185 Z"
        fill="#2a1010"
      />
      <rect x="300" y="100" width="7" height="125" rx="3" fill="#b0b0b0" />
      <rect x="287" y="160" width="33" height="9" rx="3" fill="#8b6914" />
      <ellipse cx="303" cy="96" rx="7" ry="11" fill="#d0d0d0" />
      <ellipse
        cx="194"
        cy="194"
        rx="32"
        ry="40"
        fill="none"
        stroke="rgba(239,68,68,0.65)"
        strokeWidth="3.5"
      />
      <ellipse cx="194" cy="194" rx="26" ry="34" fill="rgba(139,0,0,0.55)" />
      <path
        d="M 194 168 L 194 220"
        stroke="rgba(239,68,68,0.85)"
        strokeWidth="2.5"
      />
      <path
        d="M 178 194 L 210 194"
        stroke="rgba(239,68,68,0.85)"
        strokeWidth="2.5"
      />
      <rect x="230" y="253" width="20" height="48" rx="7" fill="#1a1a1a" />
      <rect x="258" y="253" width="20" height="48" rx="7" fill="#1a1a1a" />
      <circle cx="316" cy="88" r="4" fill="#ff6b35" opacity="0.85" />
      <circle cx="332" cy="72" r="2.5" fill="#ffd700" opacity="0.75" />
      <circle cx="302" cy="76" r="2.5" fill="#ff4500" opacity="0.9" />
      <circle cx="324" cy="105" r="2" fill="#ff8c00" opacity="0.7" />
    </svg>
  );
}

function NexusSVG() {
  return (
    <svg
      viewBox="0 0 420 340"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="nx1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="180" rx="200" ry="150" fill="url(#nx1)" />
      <g opacity="0.2" stroke="#10b981" strokeWidth="0.6">
        {[65, 105, 145, 185, 225].map((y) => (
          <line key={y} x1="90" y1={y} x2="385" y2={y} />
        ))}
        {[90, 140, 190, 240, 290, 340, 385].map((x) => (
          <line key={x} x1={x} y1="65" x2={x} y2="265" />
        ))}
      </g>
      <polygon
        points="195,82 228,100 228,134 195,152 162,134 162,100"
        fill="rgba(16,185,129,0.32)"
        stroke="#10b981"
        strokeWidth="2"
      />
      <polygon
        points="248,82 281,100 281,134 248,152 215,134 215,100"
        fill="rgba(59,130,246,0.27)"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <polygon
        points="302,112 335,130 335,164 302,182 269,164 269,130"
        fill="rgba(239,68,68,0.27)"
        stroke="#ef4444"
        strokeWidth="2"
      />
      <polygon
        points="170,132 203,150 203,184 170,202 137,184 137,150"
        fill="rgba(16,185,129,0.2)"
        stroke="#10b981"
        strokeWidth="1.5"
      />
      <circle cx="195" cy="116" r="12" fill="#10b981" />
      <circle cx="248" cy="116" r="12" fill="#3b82f6" />
      <circle cx="302" cy="146" r="12" fill="#ef4444" />
      <circle
        cx="195"
        cy="116"
        r="18"
        fill="none"
        stroke="rgba(16,185,129,0.4)"
        strokeWidth="1.5"
      />
      <circle
        cx="248"
        cy="116"
        r="18"
        fill="none"
        stroke="rgba(59,130,246,0.4)"
        strokeWidth="1.5"
      />
      <line
        x1="207"
        y1="116"
        x2="236"
        y2="116"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <line
        x1="260"
        y1="116"
        x2="290"
        y2="134"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <rect
        x="168"
        y="218"
        width="84"
        height="42"
        rx="7"
        fill="rgba(16,185,129,0.4)"
        stroke="#10b981"
        strokeWidth="2"
      />
      <text
        x="210"
        y="244"
        textAnchor="middle"
        fill="#10b981"
        fontSize="11"
        fontWeight="bold"
        fontFamily="monospace"
      >
        COMMAND HQ
      </text>
    </svg>
  );
}

function DragonSVG() {
  return (
    <svg
      viewBox="0 0 420 340"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="dr1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="310" rx="145" ry="12" fill="rgba(0,0,0,0.4)" />
      <ellipse cx="210" cy="180" rx="200" ry="150" fill="url(#dr1)" />
      <path
        d="M 118 205 Q 158 122 210 102 Q 282 80 332 132 Q 384 174 372 225 Q 342 275 280 264 Q 238 262 218 243 Q 188 258 162 248 Q 118 238 118 205 Z"
        fill="rgba(180,80,0,0.72)"
        stroke="rgba(245,158,11,0.45)"
        strokeWidth="2"
      />
      <path
        d="M 158 153 Q 106 80 55 112 Q 97 144 138 174 Z"
        fill="rgba(120,50,0,0.85)"
        stroke="rgba(245,158,11,0.3)"
        strokeWidth="1.5"
      />
      <path
        d="M 302 142 Q 362 68 404 100 Q 366 142 326 168 Z"
        fill="rgba(120,50,0,0.85)"
        stroke="rgba(245,158,11,0.3)"
        strokeWidth="1.5"
      />
      <ellipse cx="336" cy="130" rx="40" ry="32" fill="#8b3a00" />
      <circle cx="350" cy="121" r="8" fill="#f59e0b" />
      <circle cx="352" cy="121" r="4.5" fill="#1a0500" />
      <path
        d="M 373 126 Q 404 114 424 103"
        stroke="#ff6b00"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 378 132 Q 412 126 434 120"
        stroke="#ffd700"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="435" cy="106" r="14" fill="rgba(255,100,0,0.4)" />
      {[
        [178, 183],
        [218, 177],
        [258, 177],
        [198, 214],
        [238, 208],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x} ${y} Q ${x + 22} ${y - 10} ${x + 44} ${y} Q ${x + 22} ${y + 6} ${x} ${y} Z`}
          fill="rgba(245,158,11,0.28)"
        />
      ))}
    </svg>
  );
}

/* ─── Download Icon ──────────────────────────────────────────────── */
const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Sidebar() {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState("right");
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progKey, setProgKey] = useState(0);
  const timerRef = useRef(null);
  const DURATION = 5000;

  const goTo = useCallback((n, dir = "right") => {
    const next = (n + slides.length) % slides.length;
    setAnimDir(dir);
    setAnimKey((k) => k + 1);
    setCurrent(next);
    setProgKey((k) => k + 1);
  }, []);

  const prev = () => goTo(current - 1, "left");
  const next = useCallback(() => goTo(current + 1, "right"), [current, goTo]);

  useEffect(() => {
    if (paused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, DURATION);
    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  const s = slides[current];
  const contentAnim = animDir === "right" ? "anim-slide-r" : "anim-slide-l";

  return (
    <>
      <style>{globalStyles}</style>
      <div className="font-raj w-[1300px] flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        {/* ── Outer wrapper ─────────────────────────── */}
        <div className="w-full" style={{ maxWidth: "2000px", width: "100%" }}>
          {/* ── Card ──────────────────────────────────── */}
          <div
            className="relative h-[600px] overflow-hidden"
            style={{
              borderRadius: 12,
              background: "#fff",
              boxShadow: `0 10px 30px rgba(2,6,23,0.08)`,
              border: "1px solid rgba(2,6,23,0.06)",
              transition: "box-shadow 0.4s",
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Background (white) */}
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{ background: "#fff" }}
            />

            {/* Scanline */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ zIndex: 2 }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "2px",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)",
                  animation: "scanline 6s linear infinite",
                }}
              />
            </div>

            {/* Glow orbs */}
            <div
              key={current + "o1"}
              className="absolute pointer-events-none"
              style={{
                width: 340,
                height: 340,
                borderRadius: "50%",
                background: s.orb1,
                filter: "blur(70px)",
                right: -40,
                top: "50%",
                transform: "translateY(-50%)",
                transition: "background 0.8s",
                zIndex: 1,
              }}
            />
            <div
              key={current + "o2"}
              className="absolute pointer-events-none"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: s.orb2,
                filter: "blur(50px)",
                right: 100,
                top: "20%",
                transition: "background 0.8s",
                zIndex: 1,
              }}
            />

            {/* (removed dark overlay for white background) */}

            {/* Character Art */}
            <div
              key={animKey + "char"}
              className="absolute pointer-events-none  animate-zoom-in char-float"
              style={{
                right: "-2%",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(240px,50%,450px)",
                height: "clamp(200px,90%,380px)",
                zIndex: 5,
                filter: `drop-shadow(0 20px 50px rgba(0,0,0,0.85)) drop-shadow(0 0 30px ${s.accentColor}33)`,
              }}
            >
              <s.CharSVG />
            </div>

            {/* Content */}
            <div
              className="relative top-22"
              style={{
                zIndex: 10,
                padding: "clamp(24px,5vw,44px) clamp(22px,5vw,48px)",
              }}
            >
              <div key={animKey + "content"} className={contentAnim}>
                {/* Title */}
                <div
                  className="anim-fade-up-1 font-bebas mb-3"
                  style={{
                    fontSize: "clamp(36px,7vw,62px)",
                    lineHeight: 1,
                    color: "#0b1220",
                    textShadow: "none",
                    letterSpacing: 2,
                  }}
                >
                  {s.title}{" "}
                  <span
                    className="inline-block px-3 py-0 rounded-lg ml-1"
                    style={{
                      background: s.accentBg,
                      letterSpacing: 4,
                      fontSize: "clamp(32px,6.5vw,56px)",
                    }}
                  >
                    {s.titleAccent}
                  </span>
                </div>

                {/* Badges */}
                <div className="anim-fade-up-2 flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{
                      background: s.badgeBg,
                      color: "#fff",
                      boxShadow: s.badgeShadow,
                      letterSpacing: 0.5,
                    }}
                  >
                    {s.badge}
                  </span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{
                      background: "rgba(0,0,0,0.05)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      color: "#0b1220",
                    }}
                  >
                    {s.platform}
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-lg"
                    style={{
                      border: "1px solid rgba(0,0,0,0.08)",
                      color: "#333",
                    }}
                  >
                    {s.tag}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "rgba(0,0,0,0.45)" }}
                  >
                    {s.year}
                  </span>
                </div>

                {/* Shimmer divider */}
                <div
                  className="anim-fade-up-2 shimmer-line rounded-full mb-4"
                  style={{
                    height: 2,
                    maxWidth: 340,
                    background:
                      "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
                    backgroundSize: "200% auto",
                  }}
                />

                {/* Description */}
                <p
                  className="anim-fade-up-3 mb-7 leading-relaxed"
                  style={{
                    color: "rgba(0,0,0,0.72)",
                    fontSize: "clamp(12px,1.7vw,15px)",
                    maxWidth: 370,
                  }}
                >
                  {s.desc}
                </p>

                {/* Buttons */}
                <div className="anim-fade-up-4 flex flex-wrap items-center gap-4">
                  <button
                    className="flex items-center gap-2 font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      padding: "12px 26px",
                      background: s.btnColor,
                      color: "#fff",
                      boxShadow: s.btnShadow,
                      fontSize: "clamp(13px,1.8vw,16px)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Rajdhani',sans-serif",
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    <DownloadIcon /> Download Now
                  </button>
                  <button
                    className="flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      padding: "12px 22px",
                      background: "rgba(0,0,0,0.06)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      color: "#0b1220",
                      fontSize: "clamp(13px,1.8vw,16px)",
                      cursor: "pointer",
                      fontFamily: "'Rajdhani',sans-serif",
                      letterSpacing: 0.4,
                    }}
                  >
                    Details <ArrowIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: 3, background: "rgba(0,0,0,0.06)", zIndex: 20 }}
            >
              <div
                key={progKey}
                style={{
                  height: "100%",
                  background: s.progColor,
                  boxShadow: `0 0 10px ${s.progGlow}`,
                  animation: paused
                    ? "none"
                    : `progress-fill ${DURATION}ms linear forwards`,
                  borderRadius: "0 2px 2px 0",
                }}
              />
            </div>

            {/* Dots - centered bottom inside carousel */}
            <div
              className="absolute flex items-center gap-2"
              style={{
                bottom: 18,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
              }}
            >
              {slides.map((sl, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "right" : "left")}
                  style={{
                    width: i === current ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === current ? s.accentColor : "rgba(0,0,0,0.12)",
                    boxShadow:
                      i === current ? `0 0 10px ${s.progGlow}` : "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Left arrow — inside carousel */}
            <button
              onClick={prev}
              className="absolute flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
                color: "#0b1220",
                fontSize: 24,
                fontWeight: 700,
                cursor: "pointer",
                zIndex: 25,
              }}
            >
              ‹
            </button>

            {/* Right arrow — inside carousel */}
            <button
              onClick={next}
              className="absolute flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
                color: "#0b1220",
                fontSize: 24,
                fontWeight: 700,
                cursor: "pointer",
                zIndex: 25,
              }}
            >
              ›
            </button>
          </div>
          {/* end card */}
        </div>
      </div>
    </>
  );
}
