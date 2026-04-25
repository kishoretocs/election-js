import { useState } from "react";
import { generateConstituencies, TAMIL_NADU_DISTRICTS } from "@/lib/tamilnadu-map-data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ConstituencySummary, Party } from "@shared/schema";
import { PARTY_COLORS } from "@shared/schema";

interface ConstituencyMapProps {
  districtId: string;
  districtName: string;
  onConstituencyClick: (constituencyId: string, constituencyName: string) => void;
  onBack: () => void;
  constituencySummaries?: Record<string, { leadingParty: Party | null; totalVotes: number }>;
  selectedConstituencyId?: string;
  hideHeader?: boolean;
}

export function ConstituencyMap({
  districtId,
  districtName,
  onConstituencyClick,
  onBack,
  constituencySummaries = {},
  selectedConstituencyId,
  hideHeader = false,
}: ConstituencyMapProps) {
  const [hoveredConstituency, setHoveredConstituency] = useState<string | null>(null);
  const constituencies = generateConstituencies(districtId);
  const district = TAMIL_NADU_DISTRICTS.find(d => d.id === districtId);

  const getConstituencyColor = (constituencyId: string): string => {
    const summary = constituencySummaries[constituencyId];
    if (summary?.leadingParty) {
      return PARTY_COLORS[summary.leadingParty];
    }
    return "hsl(var(--muted))";
  };

  if (!district) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">District not found</p>
      </div>
    );
  }

  // Calculate view box based on constituency positions
  const minX = Math.min(...constituencies.map(c => c.labelX)) - 30;
  const minY = Math.min(...constituencies.map(c => c.labelY)) - 30;
  const maxX = Math.max(...constituencies.map(c => c.labelX)) + 60;
  const maxY = Math.max(...constituencies.map(c => c.labelY)) + 60;

  return (
    <div className="relative w-full h-full flex flex-col">
      {!hideHeader && (
        <div className="flex items-center gap-2 p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back-to-districts"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="font-semibold">{districtName}</h3>
            <p className="text-xs text-muted-foreground">
              {constituencies.length} constituencies
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 p-4">
        <svg
          viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
          className="w-full h-full"
          data-testid="constituency-map"
        >
          <defs>
            <filter id="const-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          {constituencies.map((constituency) => {
            const isHovered = hoveredConstituency === constituency.id;
            const isSelected = selectedConstituencyId === constituency.id;
            const color = getConstituencyColor(constituency.id);
            const summary = constituencySummaries[constituency.id];

            return (
              <Tooltip key={constituency.id}>
                <TooltipTrigger asChild>
                  <g
                    onClick={() => onConstituencyClick(constituency.id, constituency.name)}
                    onMouseEnter={() => setHoveredConstituency(constituency.id)}
                    onMouseLeave={() => setHoveredConstituency(null)}
                    className="cursor-pointer"
                    data-testid={`constituency-${constituency.id}`}
                  >
                    <rect
                      x={constituency.labelX - 45}
                      y={constituency.labelY - 15}
                      width={90}
                      height={30}
                      rx={4}
                      fill={color}
                      fillOpacity={isSelected ? 1 : isHovered ? 0.9 : 0.7}
                      stroke={isSelected ? "hsl(var(--foreground))" : isHovered ? "hsl(var(--foreground) / 0.5)" : "hsl(var(--border))"}
                      strokeWidth={isSelected ? 2 : 1}
                      filter="url(#const-shadow)"
                      className="transition-all duration-200"
                    />
                    <text
                      x={constituency.labelX}
                      y={constituency.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="pointer-events-none select-none"
                      style={{
                        fontSize: "7px",
                        fontWeight: isSelected || isHovered ? 600 : 500,
                        fill: "hsl(var(--foreground))",
                      }}
                    >
                      {constituency.name.length > 14 
                        ? constituency.name.substring(0, 12) + "..." 
                        : constituency.name}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent side="right" className="z-50">
                  <div className="space-y-1">
                    <p className="font-semibold">{constituency.name}</p>
                    {summary?.leadingParty && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: PARTY_COLORS[summary.leadingParty] }}
                        />
                        <span className="text-xs">{summary.leadingParty} leading</span>
                      </div>
                    )}
                    {summary?.totalVotes ? (
                      <p className="text-xs">
                        {summary.totalVotes.toLocaleString()} votes
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Click to view results</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
