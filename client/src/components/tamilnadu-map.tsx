import { useState } from "react";
import { motion } from "framer-motion";
import { TAMIL_NADU_DISTRICTS, type DistrictMapData } from "@/lib/tamilnadu-map-data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Party } from "@shared/schema";
import { PARTY_COLORS } from "@shared/schema";

interface TamilNaduMapProps {
  onDistrictClick: (districtId: string, districtName: string) => void;
  districtSummaries?: Record<string, { leadingParty: Party | null; totalVotes: number }>;
  highlightedDistrictId?: string;
  showGlowEffects?: boolean;
}

// Vibrant color palette for 38 districts - arranged by region for visual harmony
const DISTRICT_COLORS: Record<string, string> = {
  // Northern Districts - Blues & Teals
  chennai: "#4FC3F7",
  tiruvallur: "#29B6F6",
  kancheepuram: "#26C6DA",
  chengalpattu: "#00BCD4",
  ranipet: "#00ACC1",
  vellore: "#0097A7",
  tirupattur: "#00838F",
  tiruvannamalai: "#006064",
  
  // Western Districts - Greens
  krishnagiri: "#66BB6A",
  dharmapuri: "#4CAF50",
  salem: "#43A047",
  namakkal: "#388E3C",
  erode: "#2E7D32",
  tiruppur: "#1B5E20",
  coimbatore: "#81C784",
  nilgiris: "#A5D6A7",
  
  // Central Districts - Yellows & Oranges
  karur: "#FFCA28",
  dindigul: "#FFA726",
  tiruchirappalli: "#FF9800",
  perambalur: "#FB8C00",
  ariyalur: "#F57C00",
  
  // Eastern Coastal Districts - Purples & Pinks
  cuddalore: "#AB47BC",
  villupuram: "#9C27B0",
  kallakurichi: "#8E24AA",
  mayiladuthurai: "#7B1FA2",
  nagapattinam: "#6A1B9A",
  thanjavur: "#BA68C8",
  tiruvarur: "#CE93D8",
  
  // Southern Districts - Reds & Corals
  pudukkottai: "#EF5350",
  sivaganga: "#E53935",
  ramanathapuram: "#D32F2F",
  madurai: "#C62828",
  theni: "#B71C1C",
  virudhunagar: "#FF7043",
  thoothukudi: "#FF5722",
  tirunelveli: "#F4511E",
  tenkasi: "#E64A19",
  kanyakumari: "#D84315",
};

export function TamilNaduMap({ 
  onDistrictClick, 
  districtSummaries = {}, 
  highlightedDistrictId,
  showGlowEffects = false 
}: TamilNaduMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const getDistrictColor = (districtId: string): string => {
    const summary = districtSummaries[districtId];
    // If there are votes and a leading party, show party color
    if (summary?.leadingParty && summary.totalVotes > 0) {
      return PARTY_COLORS[summary.leadingParty];
    }
    // Otherwise show the vibrant district color
    return DISTRICT_COLORS[districtId] || "#78909C";
  };

  const getDistrictOpacity = (districtId: string): number => {
    const summary = districtSummaries[districtId];
    if (summary?.totalVotes && summary.totalVotes > 0) {
      return 0.9;
    }
    return 0.85;
  };

  const getGlowColor = (districtId: string): string => {
    const summary = districtSummaries[districtId];
    if (summary?.leadingParty && summary.totalVotes > 0) {
      return PARTY_COLORS[summary.leadingParty];
    }
    return DISTRICT_COLORS[districtId] || "rgba(255, 255, 255, 0.3)";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 10 380 610"
        className="w-full h-full"
        style={{ maxWidth: "450px", maxHeight: "700px" }}
        data-testid="tamilnadu-map"
      >
        <defs>
          <filter id="district-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
          <filter id="district-hover-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glassmorphism" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feColorMatrix in="blur" type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
            <feBlend in="SourceGraphic" in2="glow" mode="normal" />
          </filter>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
            <stop offset="100%" stopColor="hsl(var(--secondary) / 0.1)" />
          </linearGradient>
          {showGlowEffects && (
            <>
              <filter id="neon-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feFlood floodColor="currentColor" floodOpacity="0.5" result="color"/>
                <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </>
          )}
        </defs>

        {TAMIL_NADU_DISTRICTS.map((district) => {
          const isHovered = hoveredDistrict === district.id;
          const isHighlighted = highlightedDistrictId === district.id;
          const color = getDistrictColor(district.id);
          const opacity = getDistrictOpacity(district.id);
          const summary = districtSummaries[district.id];
          const isActive = isHovered || isHighlighted;
          const hasVotes = summary?.totalVotes && summary.totalVotes > 0;

          return (
            <Tooltip key={district.id}>
              <TooltipTrigger asChild>
                <motion.g
                  onClick={() => onDistrictClick(district.id, district.name)}
                  onMouseEnter={() => setHoveredDistrict(district.id)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  className="cursor-pointer"
                  data-testid={`district-${district.id}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.03 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ transformOrigin: `${district.labelX}px ${district.labelY}px` }}
                >
                  <motion.path
                    d={district.path}
                    fill={color}
                    fillOpacity={isHighlighted ? 1 : opacity}
                    stroke={isActive ? "#ffffff" : "#1a1a2e"}
                    strokeWidth={isHighlighted ? 2.5 : isHovered ? 2 : 1.2}
                    strokeLinejoin="round"
                    filter={showGlowEffects && hasVotes ? "url(#neon-glow)" : isActive ? "url(#district-hover-glow)" : "url(#district-shadow)"}
                    initial={false}
                    animate={{
                      fillOpacity: isHighlighted ? 1 : opacity,
                      strokeWidth: isHighlighted ? 2.5 : isHovered ? 2 : 1.2,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      filter: showGlowEffects && hasVotes 
                        ? `drop-shadow(0 0 ${isActive ? '8px' : '4px'} ${getGlowColor(district.id)})`
                        : undefined
                    }}
                  />
                  <text
                    x={district.labelX}
                    y={district.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{
                      fontSize: "6.5px",
                      fontWeight: isActive ? 700 : 600,
                      fill: "#1a1a2e",
                      textShadow: "0 0 3px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5)"
                    }}
                  >
                    {district.name.length > 12 
                      ? district.name.substring(0, 10) + "..." 
                      : district.name}
                  </text>
                </motion.g>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className={`z-50 ${showGlowEffects ? 'bg-background/80 backdrop-blur-md border-primary/30' : ''}`}
              >
                <div className="space-y-1.5">
                  <p className="font-semibold text-base">{district.name}</p>
                  <p className="text-xs text-muted-foreground">{district.tamilName}</p>
                  {summary?.leadingParty && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ 
                          backgroundColor: PARTY_COLORS[summary.leadingParty],
                          boxShadow: showGlowEffects ? `0 0 6px ${PARTY_COLORS[summary.leadingParty]}` : undefined
                        }}
                      />
                      <span className="text-sm font-medium">{summary.leadingParty} leading</span>
                    </div>
                  )}
                  {summary?.totalVotes ? (
                    <p className="text-sm font-medium">
                      {summary.totalVotes.toLocaleString()} votes counted
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No votes yet</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </svg>
    </div>
  );
}
