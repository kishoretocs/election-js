import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { 
  Vote, Loader2, LogOut, BarChart3, Users, Percent, 
  TrendingUp, Clock, MapPin, Building2, ChartPie, RotateCcw, Plus, Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PARTIES, PARTY_COLORS, type Reporter, type Party } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { generateConstituencies, generateAreas, TAMIL_NADU_DISTRICTS } from "@/lib/tamilnadu-map-data";
import { PartySymbol } from "@/components/party-symbols";
import { PollingStatsCard } from "@/components/polling-stats-card";

interface AnalyticsData {
  roundWiseCumulative: Array<{
    round: number;
    partyVotes: Record<Party, number>;
    totalVotes: number;
    cumulativeTotal: number;
  }>;
  boothWiseCumulative: Array<{
    boothId: string;
    boothName: string;
    partyVotes: Record<Party, number>;
    totalVotes: number;
    eligibleVoters: number;
    pollingPercentage: number;
  }>;
  partyWiseCumulative: Record<Party, {
    totalVotes: number;
    percentage: number;
    leadingIn: number;
  }>;
  pollingPercentage: number;
  voterCount: {
    totalRegistered: number;
    totalPolled: number;
    totalCounted: number;
  };
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>("");
  const [activeView, setActiveView] = useState<string>("entry");
  
  // Vote entry state
  const [voteDistrictId, setVoteDistrictId] = useState<string>("");
  const [voteConstituencyId, setVoteConstituencyId] = useState<string>("");
  const [voteBoothId, setVoteBoothId] = useState<string>("");
  const [voteRound, setVoteRound] = useState<string>("1");
  const [partyVotes, setPartyVotes] = useState<Record<Party, number>>({
    DMK: 0,
    AIADMK: 0,
    TVK: 0,
    "Naam Tamilar": 0,
    Others: 0,
  });

  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuery<{ authenticated: boolean; reporter: Reporter }>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    if (!isAuthLoading && (!authData?.authenticated || authError)) {
      setLocation("/reporter/login");
    }
  }, [authData, isAuthLoading, authError, setLocation]);

  const analyticsUrl = `/api/admin/analytics?districtId=${selectedDistrictId || "all"}&constituencyId=${selectedConstituencyId || "all"}`;
  
  const { data: analyticsData, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useQuery<AnalyticsData>({
    queryKey: [analyticsUrl],
    enabled: !!authData?.authenticated,
  });

  // WebSocket for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    ws.onopen = () => {
      console.log("Admin Dashboard WebSocket connected");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Admin WebSocket message received:", data.type);
        if (data.type === "vote:update" || data.type === "votes:reset") {
          // Invalidate all analytics queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
          refetchAnalytics();
        }
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };
    
    ws.onerror = (error) => {
      console.error("Admin WebSocket error:", error);
    };
    
    ws.onclose = () => {
      console.log("Admin Dashboard WebSocket disconnected");
    };
    
    return () => ws.close();
  }, [refetchAnalytics]);

  const districts = TAMIL_NADU_DISTRICTS;
  const constituencies = selectedDistrictId 
    ? generateConstituencies(selectedDistrictId) 
    : [];
  
  // Vote entry helpers
  const voteConstituencies = voteDistrictId ? generateConstituencies(voteDistrictId) : [];
  const voteBooths = voteConstituencyId ? generateAreas(voteConstituencyId) : [];

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/reporter/login");
    },
  });

  const resetVotesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/reset-votes");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [analyticsUrl] });
      toast({
        title: "Votes Reset",
        description: "All vote counters have been cleared successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset votes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitVoteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/votes", {
        constituencyId: voteConstituencyId,
        boothId: voteBoothId,
        round: parseInt(voteRound),
        votes: partyVotes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [analyticsUrl] });
      toast({
        title: "Vote Submitted",
        description: "Vote data has been recorded and synced to displays.",
      });
      // Reset form
      setPartyVotes({ DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authData?.authenticated) {
    return null;
  }

  const isAdmin = authData.reporter.username === "admin";

  const emptyAnalytics: AnalyticsData = {
    roundWiseCumulative: [],
    boothWiseCumulative: [],
    partyWiseCumulative: {
      DMK: { totalVotes: 0, percentage: 0, leadingIn: 0 },
      AIADMK: { totalVotes: 0, percentage: 0, leadingIn: 0 },
      TVK: { totalVotes: 0, percentage: 0, leadingIn: 0 },
      "Naam Tamilar": { totalVotes: 0, percentage: 0, leadingIn: 0 },
      Others: { totalVotes: 0, percentage: 0, leadingIn: 0 },
    },
    pollingPercentage: 0,
    voterCount: {
      totalRegistered: 0,
      totalPolled: 0,
      totalCounted: 0,
    },
  };

  const data = analyticsData || emptyAnalytics;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Analytics</h1>
          </div>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {authData.reporter.name}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="link-view-results">
              View Map
            </Button>
          </Link>
          <Link href="/reporter/dashboard">
            <Button variant="outline" size="sm" data-testid="link-reporter-dashboard">
              Vote Entry
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={selectedDistrictId}
                onValueChange={(value) => {
                  setSelectedDistrictId(value);
                  setSelectedConstituencyId("");
                }}
              >
                <SelectTrigger data-testid="select-filter-district">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={selectedConstituencyId}
                onValueChange={setSelectedConstituencyId}
                disabled={!selectedDistrictId || selectedDistrictId === "all"}
              >
                <SelectTrigger data-testid="select-filter-constituency">
                  <SelectValue placeholder="All Constituencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Constituencies</SelectItem>
                  {constituencies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetchAnalytics()}
              data-testid="button-refresh-analytics"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm("Are you sure you want to reset all votes? This action cannot be undone.")) {
                  resetVotesMutation.mutate();
                }
              }}
              disabled={resetVotesMutation.isPending}
              data-testid="button-reset-votes"
            >
              {resetVotesMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Reset Votes
            </Button>
          </div>

          {isAnalyticsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading analytics...</span>
            </div>
          )}

          <PollingStatsCard variant="compact" className="mb-4" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="card-total-votes">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Vote className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Votes Counted</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {data.voterCount.totalCounted.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-total-booths">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booths Reported</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {data.voterCount.totalPolled.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-counting-progress">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Counting Progress</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {data.pollingPercentage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-rounds-completed">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rounds Completed</p>
                    <p className="text-2xl font-bold tabular-nums">
                      {data.roundWiseCumulative.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="entry" data-testid="tab-vote-entry">
                <Plus className="h-4 w-4 mr-2 hidden sm:inline" />
                Vote Entry
              </TabsTrigger>
              <TabsTrigger value="overview" data-testid="tab-overview">
                <ChartPie className="h-4 w-4 mr-2 hidden sm:inline" />
                Party-wise
              </TabsTrigger>
              <TabsTrigger value="rounds" data-testid="tab-rounds">
                <Clock className="h-4 w-4 mr-2 hidden sm:inline" />
                Round-wise
              </TabsTrigger>
              <TabsTrigger value="booths" data-testid="tab-booths">
                <Building2 className="h-4 w-4 mr-2 hidden sm:inline" />
                Booth-wise
              </TabsTrigger>
              <TabsTrigger value="voters" data-testid="tab-voters">
                <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                Voter Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entry" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Enter Vote Results
                  </CardTitle>
                  <CardDescription>
                    Enter votes for a specific booth and round. Data syncs to Display Dashboard in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>District</Label>
                      <Select
                        value={voteDistrictId}
                        onValueChange={(value) => {
                          setVoteDistrictId(value);
                          setVoteConstituencyId("");
                          setVoteBoothId("");
                        }}
                      >
                        <SelectTrigger data-testid="select-vote-district">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Constituency</Label>
                      <Select
                        value={voteConstituencyId}
                        onValueChange={(value) => {
                          setVoteConstituencyId(value);
                          setVoteBoothId("");
                        }}
                        disabled={!voteDistrictId}
                      >
                        <SelectTrigger data-testid="select-vote-constituency">
                          <SelectValue placeholder="Select Constituency" />
                        </SelectTrigger>
                        <SelectContent>
                          {voteConstituencies.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Booth</Label>
                      <Select
                        value={voteBoothId}
                        onValueChange={setVoteBoothId}
                        disabled={!voteConstituencyId}
                      >
                        <SelectTrigger data-testid="select-vote-booth">
                          <SelectValue placeholder="Select Booth" />
                        </SelectTrigger>
                        <SelectContent>
                          {voteBooths.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Round</Label>
                      <Select value={voteRound} onValueChange={setVoteRound}>
                        <SelectTrigger data-testid="select-vote-round">
                          <SelectValue placeholder="Select Round" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                            <SelectItem key={r} value={r.toString()}>
                              Round {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Party-wise Votes</h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      {PARTIES.map((party) => (
                        <div key={party} className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <PartySymbol party={party} size={20} />
                            {party}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={partyVotes[party]}
                            onChange={(e) =>
                              setPartyVotes((prev) => ({
                                ...prev,
                                [party]: parseInt(e.target.value) || 0,
                              }))
                            }
                            data-testid={`input-votes-${party}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4">
                    <div className="text-sm text-muted-foreground">
                      Total Votes: <span className="font-semibold tabular-nums">
                        {Object.values(partyVotes).reduce((a, b) => a + b, 0).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      onClick={() => submitVoteMutation.mutate()}
                      disabled={
                        !voteConstituencyId ||
                        !voteBoothId ||
                        submitVoteMutation.isPending ||
                        Object.values(partyVotes).every((v) => v === 0)
                      }
                      data-testid="button-submit-votes"
                    >
                      {submitVoteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Submit Votes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartPie className="h-5 w-5" />
                      Vote Share Distribution
                    </CardTitle>
                    <CardDescription>
                      Visual representation of party-wise vote percentage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]" data-testid="chart-party-pie">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={PARTIES.map((party) => ({
                              name: party,
                              value: data.partyWiseCumulative[party].totalVotes,
                              percentage: data.partyWiseCumulative[party].percentage,
                            })).filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                            labelLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
                          >
                            {PARTIES.map((party) => (
                              <Cell 
                                key={party} 
                                fill={PARTY_COLORS[party]} 
                                stroke="hsl(var(--background))"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [value.toLocaleString(), "Votes"]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Party-wise Details
                    </CardTitle>
                    <CardDescription>
                      Total votes and leading constituencies for each party
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {PARTIES.map((party) => {
                        const stats = data.partyWiseCumulative[party];
                        const maxVotes = Math.max(
                          ...Object.values(data.partyWiseCumulative).map(p => p.totalVotes)
                        );
                        return (
                          <div key={party} className="space-y-2" data-testid={`party-stats-${party}`}>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <PartySymbol party={party} size={32} />
                                <span className="font-medium truncate">{party}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm flex-shrink-0">
                                <span className="tabular-nums font-semibold">
                                  {stats.totalVotes.toLocaleString()}
                                </span>
                                <Badge variant="outline" className="tabular-nums">
                                  {stats.percentage.toFixed(1)}%
                                </Badge>
                                <Badge 
                                  variant="secondary"
                                  className="tabular-nums"
                                >
                                  Leading: {stats.leadingIn}
                                </Badge>
                              </div>
                            </div>
                            <Progress 
                              value={maxVotes > 0 ? (stats.totalVotes / maxVotes) * 100 : 0} 
                              className="h-2"
                              style={{ 
                                "--progress-background": PARTY_COLORS[party] 
                              } as React.CSSProperties}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rounds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Round-wise Cumulative Votes
                  </CardTitle>
                  <CardDescription>
                    Vote counts per round with cumulative totals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {data.roundWiseCumulative.map((round) => (
                        <Card key={round.round} className="bg-muted/30" data-testid={`round-${round.round}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between gap-4">
                              <CardTitle className="text-base">Round {round.round}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="tabular-nums">
                                  Round: {round.totalVotes.toLocaleString()}
                                </Badge>
                                <Badge className="tabular-nums">
                                  Cumulative: {round.cumulativeTotal.toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {PARTIES.map((party) => (
                                <div 
                                  key={party} 
                                  className="flex items-center gap-2 p-2 rounded-md bg-background"
                                >
                                  <div
                                    className="h-3 w-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: PARTY_COLORS[party] }}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground truncate">{party}</p>
                                    <p className="text-sm font-semibold tabular-nums">
                                      {round.partyVotes[party].toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booths" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Booth-wise Cumulative Results
                  </CardTitle>
                  <CardDescription>
                    Vote breakdown by polling booth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      <div className="grid grid-cols-7 gap-2 pb-2 border-b text-sm font-medium text-muted-foreground sticky top-0 bg-card">
                        <div className="col-span-2">Booth</div>
                        {PARTIES.map((party) => (
                          <div key={party} className="text-center truncate text-xs">
                            {party.length > 5 ? party.substring(0, 4) + "." : party}
                          </div>
                        ))}
                      </div>
                      {data.boothWiseCumulative.map((booth) => {
                        const maxPartyVotes = Math.max(...Object.values(booth.partyVotes));
                        const leadingParty = Object.entries(booth.partyVotes).find(
                          ([, v]) => v === maxPartyVotes
                        )?.[0] as Party;
                        
                        return (
                          <div 
                            key={booth.boothId} 
                            className="grid grid-cols-7 gap-2 items-center py-2 border-b border-border/50"
                            data-testid={`booth-${booth.boothId}`}
                          >
                            <div className="col-span-2 flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: PARTY_COLORS[leadingParty] }}
                              />
                              <span className="text-sm font-medium truncate">{booth.boothName}</span>
                            </div>
                            {PARTIES.map((party) => (
                              <div 
                                key={party} 
                                className="text-center text-sm tabular-nums"
                                style={{ 
                                  fontWeight: booth.partyVotes[party] === maxPartyVotes ? 600 : 400,
                                  color: booth.partyVotes[party] === maxPartyVotes 
                                    ? PARTY_COLORS[party] 
                                    : undefined
                                }}
                              >
                                {booth.partyVotes[party].toLocaleString()}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voters" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Counting Statistics
                    </CardTitle>
                    <CardDescription>
                      Booths reported and votes counted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Booths</span>
                        <span className="font-semibold tabular-nums">
                          {data.voterCount.totalRegistered.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Booths Reported</span>
                        <span className="font-semibold tabular-nums">
                          {data.voterCount.totalPolled.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={data.voterCount.totalRegistered > 0 ? (data.voterCount.totalPolled / data.voterCount.totalRegistered) * 100 : 0} 
                        className="h-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Votes Counted</span>
                        <span className="font-semibold tabular-nums">
                          {data.voterCount.totalCounted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Percent className="h-5 w-5" />
                      Counting Progress
                    </CardTitle>
                    <CardDescription>
                      Booth coverage and pending areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="12"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="12"
                            strokeDasharray={`${data.pollingPercentage * 2.51} 251`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold tabular-nums">
                            {data.pollingPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Reported</p>
                        <p className="text-lg font-bold text-primary tabular-nums">
                          {data.voterCount.totalPolled.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-lg font-bold text-muted-foreground tabular-nums">
                          {Math.max(0, data.voterCount.totalRegistered - data.voterCount.totalPolled).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
