import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  customSrc?: string;
}

/**
 * High-fidelity vector rendition of the Amicale des Étudiants UFR SES UIDT Seal
 * Exactly matching the circular navy & white badge uploaded by the user:
 * Outer ring: AMICALE DES ÉTUDIANTS DE L'UFR SES
 * Center: Mortarboard graduation cap, open book, laurel wreath, and text "A-E/UFR SES UIDT"
 */
export const AmicaleLogo: React.FC<LogoProps> = ({ className = 'w-24 h-24', customSrc }) => {
  if (customSrc) {
    return (
      <img
        src={customSrc}
        alt="Logo Amicale des Étudiants UFR SES UIDT"
        className={`${className} object-contain rounded-full shadow-md`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 300 300"
      className={`${className} select-none drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle background */}
      <circle cx="150" cy="150" r="145" fill="#FFFFFF" stroke="#0f2b4c" strokeWidth="8" />
      <circle cx="150" cy="150" r="133" fill="none" stroke="#0f2b4c" strokeWidth="2.5" />
      <circle cx="150" cy="150" r="96" fill="none" stroke="#0f2b4c" strokeWidth="4" />

      {/* Circular Text: AMICALE DES ÉTUDIANTS */}
      <path
        id="textPathTop"
        d="M 45 150 A 105 105 0 0 1 255 150"
        fill="none"
      />
      <text fill="#0f2b4c" fontSize="21" fontWeight="800" letterSpacing="2.5">
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
          AMICALE DES ÉTUDIANTS
        </textPath>
      </text>

      {/* Circular Text: DE L'UFR SES */}
      <path
        id="textPathBottom"
        d="M 255 150 A 105 105 0 0 1 45 150"
        fill="none"
      />
      <text fill="#0f2b4c" fontSize="24" fontWeight="800" letterSpacing="3.5">
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
          DE L'UFR SES
        </textPath>
      </text>

      {/* Left & Right Laurel Leaves */}
      <g fill="#0f2b4c" transform="translate(18, 110)">
        <path d="M12 0 C6 10, 0 25, 6 35 C12 25, 16 10, 12 0 Z" />
        <path d="M16 18 C26 22, 28 32, 22 40 C14 36, 12 26, 16 18 Z" />
        <path d="M10 38 C4 48, 2 58, 8 68 C14 58, 16 48, 10 38 Z" />
        <path d="M16 52 C26 56, 26 68, 20 74 C14 70, 12 60, 16 52 Z" />
      </g>
      <g fill="#0f2b4c" transform="translate(254, 110)">
        <path d="M14 0 C20 10, 26 25, 20 35 C14 25, 10 10, 14 0 Z" />
        <path d="M10 18 C0 22, -2 32, 4 40 C12 36, 14 26, 10 18 Z" />
        <path d="M16 38 C22 48, 24 58, 18 68 C12 58, 10 48, 16 38 Z" />
        <path d="M10 52 C0 56, 0 68, 6 74 C12 70, 14 60, 10 52 Z" />
      </g>

      {/* Graduation Cap (Mortarboard) */}
      <g fill="#0f2b4c">
        {/* Cap Top Rhombus */}
        <polygon points="150,56 198,78 150,96 102,78" />
        {/* Cap Skull cap base */}
        <path d="M122 88 C122 108 178 108 178 88 Z" />
        {/* Tassel */}
        <path d="M192 78 Q194 92 188 108" stroke="#0f2b4c" strokeWidth="2.5" fill="none" />
        <circle cx="188" cy="110" r="3.5" />
      </g>

      {/* Open Book */}
      <g fill="#0f2b4c" transform="translate(98, 112)">
        {/* Left page */}
        <path d="M52 24 C36 12 12 14 0 20 L2 30 C14 24 36 22 52 32 Z" />
        <path d="M52 14 C36 2 12 4 0 10 L2 20 C14 14 36 12 52 22 Z" />
        {/* Right page */}
        <path d="M52 24 C68 12 92 14 104 20 L102 30 C90 24 68 22 52 32 Z" />
        <path d="M52 14 C68 2 92 4 104 10 L102 20 C90 14 68 12 52 22 Z" />
        {/* Book spine line */}
        <line x1="52" y1="12" x2="52" y2="34" stroke="#0f2b4c" strokeWidth="2" />
      </g>

      {/* Center Main Text: A-E/UFR and SES UIDT */}
      <text
        x="150"
        y="180"
        textAnchor="middle"
        fill="#0f2b4c"
        fontSize="34"
        fontWeight="900"
        letterSpacing="1"
      >
        A-E/UFR
      </text>
      <text
        x="150"
        y="218"
        textAnchor="middle"
        fill="#0f2b4c"
        fontSize="31"
        fontWeight="900"
        letterSpacing="2.5"
      >
        SES UIDT
      </text>
    </svg>
  );
};

/**
 * High-fidelity vector rendition of the famous arched entrance of
 * Université Iba Der Thiam de Thiès (UIDT)
 */
export const UidtCampusGateBanner: React.FC<{ className?: string; customSrc?: string }> = ({
  className = 'w-full h-80',
  customSrc,
}) => {
  if (customSrc) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        <img
          src={customSrc}
          alt="Portail Université Iba Der Thiam de Thiès"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 ${className}`}>
      {/* SVG Campus gate recreation */}
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="archGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="1200" height="420" fill="url(#skyGrad)" />
        {/* Sun flare */}
        <circle cx="200" cy="120" r="60" fill="#ffffff" opacity="0.4" filter="blur(20px)" />

        {/* Sand & Horizon */}
        <polygon points="0,380 1200,380 1200,450 0,450" fill="#fcd34d" opacity="0.7" />
        <polygon points="0,420 1200,420 1200,600 0,600" fill="#fbbf24" opacity="0.85" />

        {/* Distant campus buildings */}
        <rect x="520" y="320" width="80" height="70" fill="#b91c1c" rx="4" />
        <rect x="420" y="335" width="70" height="55" fill="#c2410c" rx="3" />
        <rect x="620" y="335" width="60" height="55" fill="#b91c1c" rx="3" />

        {/* Roadway leading inside */}
        <polygon points="570,390 630,390 780,600 420,600" fill="url(#roadGrad)" />
        {/* Road center dash */}
        <polygon points="597,400 603,400 605,440 595,440" fill="#ffffff" opacity="0.8" />
        <polygon points="595,460 605,460 608,520 592,520" fill="#ffffff" opacity="0.8" />
        <polygon points="592,545 608,545 612,600 588,600" fill="#ffffff" opacity="0.8" />

        {/* Sidewalks */}
        <polygon points="420,600 570,390 540,390 320,600" fill="#e2e8f0" />
        <polygon points="780,600 630,390 660,390 880,600" fill="#e2e8f0" />

        {/* Left Gate Structure with "THIES" inscription */}
        <rect x="70" y="280" width="180" height="160" fill="#c2410c" rx="6" />
        <rect x="180" y="300" width="50" height="60" fill="#1e293b" />
        <text x="145" y="380" fill="#0f2b4c" fontSize="42" fontWeight="900" letterSpacing="4">
          THIES
        </text>

        {/* Right Gate Structure with "UI-DT" inscription */}
        <rect x="950" y="280" width="180" height="160" fill="#c2410c" rx="6" />
        <rect x="970" y="300" width="50" height="60" fill="#1e293b" />
        <text x="1000" y="380" fill="#0f2b4c" fontSize="42" fontWeight="900" letterSpacing="4">
          UI-DT
        </text>

        {/* Open Blue Iron Gates */}
        <rect x="360" y="310" width="120" height="130" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="4" opacity="0.9" />
        <line x1="380" y1="310" x2="380" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="400" y1="310" x2="400" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="420" y1="310" x2="420" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="440" y1="310" x2="440" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="460" y1="310" x2="460" y2="440" stroke="#93c5fd" strokeWidth="3" />

        <rect x="720" y="310" width="120" height="130" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="4" opacity="0.9" />
        <line x1="740" y1="310" x2="740" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="760" y1="310" x2="760" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="780" y1="310" x2="780" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="800" y1="310" x2="800" y2="440" stroke="#93c5fd" strokeWidth="3" />
        <line x1="820" y1="310" x2="820" y2="440" stroke="#93c5fd" strokeWidth="3" />

        {/* The Giant Curved Orange Arch */}
        {/* Left curving pillar */}
        <path
          d="M 180 430 Q 220 220 370 190 L 370 230 Q 260 250 230 430 Z"
          fill="url(#archGrad)"
        />
        {/* Right curving pillar */}
        <path
          d="M 1020 430 Q 980 220 830 190 L 830 230 Q 940 250 970 430 Z"
          fill="url(#archGrad)"
        />

        {/* Vertical Center Post */}
        <rect x="590" y="190" width="20" height="240" fill="url(#archGrad)" />
        {/* Left vertical post */}
        <rect x="330" y="210" width="22" height="220" fill="url(#archGrad)" />
        {/* Right vertical post */}
        <rect x="850" y="210" width="22" height="220" fill="url(#archGrad)" />

        {/* Top Horizontal Arch Crossbar */}
        <path
          d="M 280 210 Q 600 130 920 210 L 920 250 Q 600 170 280 250 Z"
          fill="url(#archGrad)"
        />

        {/* The Iconic Curved Blue Signboard with Title */}
        <path
          d="M 330 195 Q 600 135 870 195 L 865 230 Q 600 170 335 230 Z"
          fill="#1e3a8a"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Blue Signboard Title Text */}
        <path
          id="signTextPath"
          d="M 345 220 Q 600 160 855 220"
          fill="none"
        />
        <text fill="#ffffff" fontSize="19" fontWeight="900" letterSpacing="2.8">
          <textPath href="#signTextPath" startOffset="50%" textAnchor="middle">
            UNIVERSITÉ IBA DER THIAM DE THIÈS
          </textPath>
        </text>

        {/* Round university seal badges on arch sides */}
        <circle cx="355" cy="195" r="14" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
        <circle cx="845" cy="195" r="14" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
      </svg>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
    </div>
  );
};
