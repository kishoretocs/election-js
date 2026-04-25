import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PARTIES, PARTY_COLORS, type RoundVoteDetails } from "@shared/schema";
import { Clock, CheckCircle2, Loader2 } from "lucide-react";
import { PartySymbol } from "./party-symbols";

interface RoundStatusProps {
  rounds: RoundVoteDetails[];
  isLoading?: boolean;
}

export function RoundStatus({ rounds, isLoading = false }: RoundStatusProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Round-wise Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rounds.length) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Round-wise Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No counting rounds yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="round-status-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Round-wise Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rounds.map((round) => (
          <RoundCard key={round.roundId} round={round} />
        ))}
      </CardContent>
    </Card>
  );
}

interface RoundCardProps {
  round: RoundVoteDetails;
}

function RoundCard({ round }: RoundCardProps) {
  const StatusIcon = round.status === "completed" ? CheckCircle2 : round.status === "counting" ? Loader2 : Clock;
  const statusColor = round.status === "completed" ? "bg-green-500/10 text-green-600 border-green-500/20" 
    : round.status === "counting" ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
    : "bg-muted text-muted-foreground";

  return (
    <div
      className={`p-4 rounded-lg border ${
        round.status === "counting" ? "ring-2 ring-primary/30" : ""
      }`}
      data-testid={`round-card-${round.roundNumber}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Round {round.roundNumber}</span>
          <Badge variant="outline" className={statusColor}>
            <StatusIcon className={`h-3 w-3 mr-1 ${round.status === "counting" ? "animate-spin" : ""}`} />
            {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {round.totalVotes.toLocaleString()} votes
        </span>
      </div>

      <div className="space-y-2">
        {PARTIES.map((party) => {
          const votes = round.partyVotes[party] || 0;
          const percentage = round.totalVotes > 0 ? (votes / round.totalVotes) * 100 : 0;

          return (
            <div key={party} className="flex items-center gap-3">
              <PartySymbol party={party} size={16} />
              <span className="text-xs w-24 truncate">{party}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: PARTY_COLORS[party],
                  }}
                />
              </div>
              <span className="text-xs tabular-nums w-16 text-right">
                {votes.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
