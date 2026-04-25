import { Party, PARTY_COLORS } from "@shared/schema";

interface PartySymbolProps {
  party: Party;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

function DMKSymbol({ size = 24 }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="0" y="0" width="100" height="50" fill="#000000" />
      <rect x="0" y="50" width="100" height="50" fill="#E31E24" />
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 - 180) * (Math.PI / 180);
        const x1 = 50 + Math.cos(angle) * 12;
        const y1 = 50 + Math.sin(angle) * 12;
        const x2 = 50 + Math.cos(angle) * 38;
        const y2 = 50 + Math.sin(angle) * 38;
        if (angle <= 0) {
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFD700"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        }
        return null;
      })}
      <circle cx="50" cy="50" r="10" fill="#FFD700" />
    </svg>
  );
}

function AIADMKSymbol({ size = 24 }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" rx="2" stroke="#000" strokeWidth="1" />
      <path
        d="M30 85 Q28 60 32 40 Q35 25 50 15 Q45 30 44 45 Q43 65 45 85 Z"
        fill="#00843D"
        stroke="#005a20"
        strokeWidth="1.5"
      />
      <path
        d="M34 80 Q36 55 40 35"
        fill="none"
        stroke="#004d1a"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M70 85 Q72 60 68 40 Q65 25 50 15 Q55 30 56 45 Q57 65 55 85 Z"
        fill="#00843D"
        stroke="#005a20"
        strokeWidth="1.5"
      />
      <path
        d="M66 80 Q64 55 60 35"
        fill="none"
        stroke="#004d1a"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

function TVKSymbol({ size = 24 }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="0" y="0" width="100" height="30" fill="#800020" />
      <rect x="0" y="30" width="100" height="40" fill="#FFD700" />
      <rect x="0" y="70" width="100" height="30" fill="#800020" />
      <g transform="translate(10, 32) scale(0.32)">
        <ellipse cx="40" cy="75" rx="30" ry="20" fill="#3d3d3d" />
        <ellipse cx="40" cy="50" rx="22" ry="18" fill="#4a4a4a" />
        <circle cx="30" cy="45" r="4" fill="#1a1a1a" />
        <circle cx="50" cy="45" r="4" fill="#1a1a1a" />
        <path d="M15 38 Q5 20 18 8 L30 30" fill="#4a4a4a" />
        <path d="M65 38 Q75 20 62 8 L50 30" fill="#4a4a4a" />
        <rect x="28" y="85" width="8" height="20" fill="#3d3d3d" />
        <rect x="44" y="85" width="8" height="20" fill="#3d3d3d" />
        <path d="M30 55 Q40 62 50 55" stroke="#333" strokeWidth="2" fill="none" />
      </g>
      <g transform="translate(52, 32) scale(0.32)">
        <ellipse cx="40" cy="75" rx="30" ry="20" fill="#3d3d3d" />
        <ellipse cx="40" cy="50" rx="22" ry="18" fill="#4a4a4a" />
        <circle cx="30" cy="45" r="4" fill="#1a1a1a" />
        <circle cx="50" cy="45" r="4" fill="#1a1a1a" />
        <path d="M15 38 Q5 20 18 8 L30 30" fill="#4a4a4a" />
        <path d="M65 38 Q75 20 62 8 L50 30" fill="#4a4a4a" />
        <rect x="28" y="85" width="8" height="20" fill="#3d3d3d" />
        <rect x="44" y="85" width="8" height="20" fill="#3d3d3d" />
        <path d="M30 55 Q40 62 50 55" stroke="#333" strokeWidth="2" fill="none" />
      </g>
      <g transform="translate(42, 42)">
        <path d="M8 18 Q8 8 12 4 L16 14 L20 4 Q24 8 24 18 Q16 24 8 18 Z" fill="#FF4500" stroke="#CC3300" strokeWidth="0.5" />
        <ellipse cx="16" cy="12" rx="4" ry="3" fill="#FFD700" opacity="0.6" />
      </g>
    </svg>
  );
}

function NaamTamilarSymbol({ size = 24 }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="0" y="0" width="100" height="100" fill="#8B0000" rx="2" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="2" />
      {[...Array(7)].map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy={14 + i * 4}
          rx="13"
          ry="1.5"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1.2"
        />
      ))}
      <rect x="45" y="48" width="10" height="24" rx="2" fill="linear-gradient(#999, #666)" />
      <defs>
        <linearGradient id="micStand" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#777" />
          <stop offset="50%" stopColor="#bbb" />
          <stop offset="100%" stopColor="#777" />
        </linearGradient>
      </defs>
      <rect x="45" y="48" width="10" height="24" rx="2" fill="url(#micStand)" />
      <ellipse cx="50" cy="78" rx="20" ry="10" fill="url(#micStand)" stroke="#555" strokeWidth="1" />
      <ellipse cx="50" cy="76" rx="15" ry="4" fill="#999" opacity="0.4" />
    </svg>
  );
}

function OthersSymbol({ size = 24 }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="0" y="0" width="100" height="100" fill="#6B7280" rx="2" />
      <rect x="22" y="22" width="56" height="60" rx="3" fill="#FFF" stroke="#333" strokeWidth="2" />
      <rect x="35" y="15" width="30" height="12" rx="2" fill="#FFF" stroke="#333" strokeWidth="2" />
      <line x1="32" y1="38" x2="58" y2="38" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="48" x2="52" y2="48" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="58" x2="62" y2="58" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="68" x2="48" y2="68" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <circle cx="72" cy="72" r="16" fill="#059669" />
      <path d="M64 72 L70 78 L81 66" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PartySymbol({ party, size = 24, className = "", showBackground = false }: PartySymbolProps) {
  const symbol = (() => {
    switch (party) {
      case "DMK":
        return <DMKSymbol size={size} />;
      case "AIADMK":
        return <AIADMKSymbol size={size} />;
      case "TVK":
        return <TVKSymbol size={size} />;
      case "Naam Tamilar":
        return <NaamTamilarSymbol size={size} />;
      case "Others":
        return <OthersSymbol size={size} />;
      default:
        return <OthersSymbol size={size} />;
    }
  })();

  if (showBackground) {
    return (
      <div 
        className={`rounded-full flex items-center justify-center ${className}`}
        style={{ 
          backgroundColor: PARTY_COLORS[party] + "20",
          width: size + 8,
          height: size + 8,
        }}
      >
        {symbol}
      </div>
    );
  }

  return <div className={className}>{symbol}</div>;
}

export function PartySymbolWithLabel({ 
  party, 
  size = 24, 
  className = "",
  labelClassName = ""
}: PartySymbolProps & { labelClassName?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <PartySymbol party={party} size={size} />
      <span className={labelClassName}>{party}</span>
    </div>
  );
}
