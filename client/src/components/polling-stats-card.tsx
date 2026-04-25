import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Vote, Percent, BarChart3, Building2, Clock } from "lucide-react";
import type { PollingStats } from "@shared/schema";

interface PollingStatsCardProps {
  variant?: "default" | "compact" | "display";
  className?: string;
}

export function PollingStatsCard({ variant = "default", className = "" }: PollingStatsCardProps) {
  const { data: stats, isLoading } = useQuery<PollingStats>({
    queryKey: ["/api/polling-stats"],
    refetchInterval: 30000,
  });

  if (isLoading || !stats) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Eligible Voters</p>
                <p className="text-lg font-bold tabular-nums">
                  {(stats.totalEligibleVoters / 10000000).toFixed(2)} Cr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Votes Polled</p>
                <p className="text-lg font-bold tabular-nums">
                  {(stats.totalVotesPolled / 10000000).toFixed(2)} Cr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Polling %</p>
                <p className="text-lg font-bold tabular-nums">
                  {stats.pollingPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Counted</p>
                <p className="text-lg font-bold tabular-nums">
                  {stats.totalVotesCounted.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "display") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-300 text-sm">Total Eligible Voters</p>
              <p className="text-2xl font-black text-white tabular-nums">
                {(stats.totalEligibleVoters / 10000000).toFixed(2)} Cr
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Vote className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-green-300 text-sm">Votes Polled</p>
              <p className="text-2xl font-black text-white tabular-nums">
                {(stats.totalVotesPolled / 10000000).toFixed(2)} Cr
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Percent className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-300 text-sm">Polling Percentage</p>
              <p className="text-2xl font-black text-white tabular-nums">
                {stats.pollingPercentage}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-orange-300 text-sm">Votes Counted</p>
              <p className="text-2xl font-black text-white tabular-nums">
                {stats.totalVotesCounted.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur-xl border border-cyan-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-cyan-300 text-sm">Constituencies Counted</p>
              <p className="text-2xl font-black text-white tabular-nums">
                {stats.constituenciesCounted} / {stats.totalConstituencies}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 backdrop-blur-xl border border-pink-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-pink-400" />
            </div>
            <div>
              <p className="text-pink-300 text-sm">Counting Progress</p>
              <p className="text-2xl font-black text-white tabular-nums">
                {stats.countingPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={className} data-testid="card-polling-stats">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Polling Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Eligible Voters</p>
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalEligibleVoters.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">
              ({(stats.totalEligibleVoters / 10000000).toFixed(2)} Crore)
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Votes Polled</p>
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalVotesPolled.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">
              ({(stats.totalVotesPolled / 10000000).toFixed(2)} Crore)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Polling Percentage</span>
            <span className="font-bold text-green-600 dark:text-green-400">{stats.pollingPercentage}%</span>
          </div>
          <Progress value={stats.pollingPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Votes Counted</p>
            <p className="text-xl font-bold tabular-nums">
              {stats.totalVotesCounted.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Counting Progress</p>
            <p className="text-xl font-bold tabular-nums text-primary">
              {stats.countingPercentage}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Constituencies Counted</span>
            <span className="font-bold">{stats.constituenciesCounted} / {stats.totalConstituencies}</span>
          </div>
          <Progress 
            value={(stats.constituenciesCounted / stats.totalConstituencies) * 100} 
            className="h-2" 
          />
        </div>
      </CardContent>
    </Card>
  );
}
