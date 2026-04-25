import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { TamilNaduMap } from "@/components/tamilnadu-map";
import { ConstituencyMap } from "@/components/constituency-map";
import { PartyVoteCard } from "@/components/party-vote-card";
import { RoundStatus } from "@/components/round-status";
import { AreaStatus } from "@/components/area-status";
import { LiveIndicator } from "@/components/live-indicator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogIn, Vote, BarChart3, Users, MapPin, X, Monitor } from "lucide-react";
import { PARTIES, PARTY_COLORS, type Party, type ConstituencySummary, type RoundVoteDetails, type AreaVoteDetails } from "@shared/schema";
import { TAMIL_NADU_DISTRICTS, generateConstituencies } from "@/lib/tamilnadu-map-data";

type ViewLevel = "state" | "district" | "constituency";

interface NavigationState {
  level: ViewLevel;
  districtId?: string;
  districtName?: string;
  constituencyId?: string;
  constituencyName?: string;
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [navState, setNavState] = useState<NavigationState>({ level: "state" });
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isDistrictDialogOpen, setIsDistrictDialogOpen] = useState(false);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      setIsWsConnected(true);
    };

    ws.onclose = () => {
      setIsWsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "vote:update") {
          setLastUpdate(new Date());
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["/api/districts"] });
          if (navState.districtId) {
            queryClient.invalidateQueries({ queryKey: ["/api/districts", navState.districtId, "constituencies"] });
          }
          if (navState.constituencyId) {
            queryClient.invalidateQueries({ queryKey: ["/api/constituencies", navState.constituencyId] });
          }
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient, navState.districtId, navState.constituencyId]);

  // Fetch district summaries
  const { data: districts = [] } = useQuery<{ id: string; name: string; leadingParty: Party | null; totalVotes: number }[]>({
    queryKey: ["/api/districts"],
  });

  // Fetch constituency summaries for selected district
  const { data: constituencies = [] } = useQuery<ConstituencySummary[]>({
    queryKey: ["/api/districts", navState.districtId, "constituencies"],
    enabled: !!navState.districtId,
  });

  // Fetch detailed results for selected constituency
  const { data: constituencyDetails, isLoading: isLoadingDetails } = useQuery<{
    summary: ConstituencySummary;
    rounds: RoundVoteDetails[];
    areas: AreaVoteDetails[];
  }>({
    queryKey: ["/api/constituencies", navState.constituencyId],
    enabled: !!navState.constituencyId,
  });

  // Build district summaries map
  const districtSummaries = districts.reduce((acc, d) => {
    acc[d.id] = { leadingParty: d.leadingParty, totalVotes: d.totalVotes };
    return acc;
  }, {} as Record<string, { leadingParty: Party | null; totalVotes: number }>);

  // Build constituency summaries map
  const constituencySummaries = constituencies.reduce((acc, c) => {
    acc[c.constituencyId] = { leadingParty: c.leadingParty, totalVotes: c.totalVotes };
    return acc;
  }, {} as Record<string, { leadingParty: Party | null; totalVotes: number }>);

  // Navigation handlers
  const handleDistrictClick = useCallback((districtId: string, districtName: string) => {
    setNavState({
      level: "district",
      districtId,
      districtName,
    });
    setIsDistrictDialogOpen(true);
  }, []);

  const handleConstituencyClick = useCallback((constituencyId: string, constituencyName: string) => {
    setIsDistrictDialogOpen(false);
    setNavState((prev) => ({
      ...prev,
      level: "constituency",
      constituencyId,
      constituencyName,
    }));
  }, []);

  const handleHomeClick = useCallback(() => {
    setNavState({ level: "state" });
    setIsDistrictDialogOpen(false);
  }, []);

  const handleBackToDistrict = useCallback(() => {
    setNavState((prev) => ({
      level: "district",
      districtId: prev.districtId,
      districtName: prev.districtName,
    }));
    setIsDistrictDialogOpen(true);
  }, []);

  const handleCloseDistrictDialog = useCallback(() => {
    setIsDistrictDialogOpen(false);
    if (navState.level === "district") {
      setNavState({ level: "state" });
    }
  }, [navState.level]);

  // Calculate totals for selected constituency
  const partyTotals = constituencyDetails?.summary?.partyTotals || {};
  const totalVotes = constituencyDetails?.summary?.totalVotes || 0;
  const leadingParty = constituencyDetails?.summary?.leadingParty;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold" data-testid="text-title">
              Election Results
            </h1>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <LiveIndicator isConnected={isWsConnected} />
          {lastUpdate && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reporter/login">
            <Button variant="outline" size="sm" data-testid="button-reporter-login">
              <LogIn className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reporter</span>
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" size="sm" data-testid="button-admin-login">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
          <Link href="/display">
            <Button variant="default" size="sm" data-testid="button-display-dashboard">
              <Monitor className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Display</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="px-4 py-2 border-b bg-card/50 flex-shrink-0">
        <Breadcrumbs
          districtName={navState.districtName}
          constituencyName={navState.constituencyName}
          onHomeClick={handleHomeClick}
          onDistrictClick={handleBackToDistrict}
        />
      </div>

      {/* District Constituency Popup */}
      <Dialog open={isDistrictDialogOpen} onOpenChange={setIsDistrictDialogOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold" data-testid="text-district-dialog-name">
                  {navState.districtName} District
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Select a constituency to view detailed results
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {navState.districtId && (
              <ConstituencyMap
                districtId={navState.districtId}
                districtName={navState.districtName || ""}
                onConstituencyClick={handleConstituencyClick}
                onBack={handleCloseDistrictDialog}
                constituencySummaries={constituencySummaries}
                selectedConstituencyId={navState.constituencyId}
                hideHeader={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Map Panel - Always shows state map */}
        <div className="lg:w-[45%] xl:w-[40%] border-b lg:border-b-0 lg:border-r bg-card h-[300px] lg:h-full">
          <TamilNaduMap
            onDistrictClick={handleDistrictClick}
            districtSummaries={districtSummaries}
            highlightedDistrictId={navState.districtId}
          />
        </div>

        {/* Results Panel */}
        <ScrollArea className="flex-1 h-full">
          <div className="p-4 lg:p-6 space-y-6">
            {navState.level === "state" && (
              <StateOverview districts={districts} />
            )}

            {navState.level === "district" && !navState.constituencyId && (
              <DistrictOverview
                districtName={navState.districtName || ""}
                constituencies={constituencies}
                onConstituencyClick={handleConstituencyClick}
              />
            )}

            {navState.level === "constituency" && navState.constituencyId && (
              <>
                {/* Constituency Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-bold" data-testid="text-constituency-name">
                      {navState.constituencyName}
                    </h2>
                    <p className="text-muted-foreground">
                      {navState.districtName} District
                    </p>
                  </div>
                  {constituencyDetails?.summary && (
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-semibold tabular-nums">
                        {totalVotes.toLocaleString()} total votes
                      </span>
                    </div>
                  )}
                </div>

                {/* Party Vote Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {PARTIES.map((party) => {
                    const votes = partyTotals[party] || 0;
                    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

                    return (
                      <PartyVoteCard
                        key={party}
                        party={party}
                        votes={votes}
                        percentage={percentage}
                        isLeading={party === leadingParty}
                      />
                    );
                  })}
                </div>

                {/* Round and Area Status */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <RoundStatus
                    rounds={constituencyDetails?.rounds || []}
                    isLoading={isLoadingDetails}
                  />
                  <AreaStatus
                    areas={constituencyDetails?.areas || []}
                    isLoading={isLoadingDetails}
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// State Overview Component
function StateOverview({ districts }: { districts: { id: string; name: string; leadingParty: Party | null; totalVotes: number }[] }) {
  const totalVotes = districts.reduce((sum, d) => sum + d.totalVotes, 0);
  const partyLeads = PARTIES.reduce((acc, party) => {
    acc[party] = districts.filter(d => d.leadingParty === party).length;
    return acc;
  }, {} as Record<Party, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tamil Nadu Assembly Elections</h2>
        <p className="text-muted-foreground">
          Click on any district to view constituency-wise results
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            State Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold tabular-nums">{districts.length}</p>
              <p className="text-sm text-muted-foreground">Districts</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold tabular-nums">{totalVotes.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Votes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50 col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold tabular-nums">{districts.filter(d => d.leadingParty).length}</p>
              <p className="text-sm text-muted-foreground">Districts with Results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Party-wise District Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PARTIES.map((party) => (
              <div
                key={party}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: PARTY_COLORS[party] }}
                >
                  {partyLeads[party]}
                </div>
                <div>
                  <p className="font-medium text-sm">{party}</p>
                  <p className="text-xs text-muted-foreground">districts</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// District Overview Component
function DistrictOverview({
  districtName,
  constituencies,
  onConstituencyClick,
}: {
  districtName: string;
  constituencies: ConstituencySummary[];
  onConstituencyClick: (id: string, name: string) => void;
}) {
  const totalVotes = constituencies.reduce((sum, c) => sum + c.totalVotes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{districtName} District</h2>
        <p className="text-muted-foreground">
          {constituencies.length} constituencies | {totalVotes.toLocaleString()} total votes
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Constituency Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {constituencies.map((constituency) => (
              <button
                key={constituency.constituencyId}
                onClick={() => onConstituencyClick(constituency.constituencyId, constituency.constituencyName)}
                className="flex items-center justify-between gap-3 p-4 rounded-lg border hover-elevate active-elevate-2 text-left transition-all"
                data-testid={`button-constituency-${constituency.constituencyId}`}
              >
                <div className="flex items-center gap-3">
                  {constituency.leadingParty && (
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: PARTY_COLORS[constituency.leadingParty] }}
                    >
                      {constituency.leadingParty.charAt(0)}
                    </div>
                  )}
                  {!constituency.leadingParty && (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      -
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{constituency.constituencyName}</p>
                    {constituency.leadingParty && (
                      <p className="text-xs text-muted-foreground">
                        {constituency.leadingParty} leading
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">
                    {constituency.totalVotes.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Round {constituency.roundsCompleted}/{constituency.totalRounds}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
