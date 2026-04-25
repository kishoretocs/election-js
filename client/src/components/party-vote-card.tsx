import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PARTY_COLORS, type Party } from "@shared/schema";
import { PartySymbol } from "./party-symbols";

interface PartyVoteCardProps {
  party: Party;
  votes: number;
  percentage: number;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  isLeading?: boolean;
}

export function PartyVoteCard({
  party,
  votes,
  percentage,
  trend = "stable",
  trendValue = 0,
  isLeading = false,
}: PartyVoteCardProps) {
  const color = PARTY_COLORS[party];
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <Card
      className={`p-4 transition-all ${
        isLeading ? "ring-2 ring-offset-2" : ""
      }`}
      style={{
        borderColor: isLeading ? color : undefined,
        "--tw-ring-color": isLeading ? color : undefined,
      } as React.CSSProperties}
      data-testid={`party-card-${party.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <PartySymbol party={party} size={32} />
          <div>
            <p className="font-medium text-sm leading-tight">{party}</p>
            {isLeading && (
              <span className="text-xs font-medium" style={{ color }}>
                Leading
              </span>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          {trend !== "stable" && (
            <span className="text-xs font-medium">
              {trendValue > 0 ? "+" : ""}{trendValue}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className="text-2xl font-bold tabular-nums"
            data-testid={`vote-count-${party.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {votes.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
