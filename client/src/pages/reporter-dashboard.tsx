import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Vote, Loader2, LogOut, Check, Send, Clock, MapPin, Building2, Layers } from "lucide-react";
import { PARTIES, PARTY_COLORS, type Reporter, type District, type Constituency, type Round, type Area, type InsertVote, type Party } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateConstituencies, generateAreas, TAMIL_NADU_DISTRICTS } from "@/lib/tamilnadu-map-data";
import { PartySymbol } from "@/components/party-symbols";
import { PollingStatsCard } from "@/components/polling-stats-card";

const boothEntrySchema = z.object({
  districtId: z.string().min(1, "Please select a district"),
  constituencyId: z.string().min(1, "Please select a constituency"),
  roundId: z.string().min(1, "Please select a round"),
  areaId: z.string().min(1, "Please select a booth"),
  dmkVotes: z.number().min(0, "Votes cannot be negative"),
  aiadmkVotes: z.number().min(0, "Votes cannot be negative"),
  tvkVotes: z.number().min(0, "Votes cannot be negative"),
  naamTamilarVotes: z.number().min(0, "Votes cannot be negative"),
  othersVotes: z.number().min(0, "Votes cannot be negative"),
});

const roundEntrySchema = z.object({
  districtId: z.string().min(1, "Please select a district"),
  constituencyId: z.string().min(1, "Please select a constituency"),
  roundId: z.string().min(1, "Please select a round"),
  areaId: z.string().optional(),
  dmkVotes: z.number().min(0, "Votes cannot be negative"),
  aiadmkVotes: z.number().min(0, "Votes cannot be negative"),
  tvkVotes: z.number().min(0, "Votes cannot be negative"),
  naamTamilarVotes: z.number().min(0, "Votes cannot be negative"),
  othersVotes: z.number().min(0, "Votes cannot be negative"),
});

const voteEntrySchema = boothEntrySchema;

type VoteEntryForm = z.infer<typeof voteEntrySchema>;

type EntryMode = "booth" | "round";

export default function ReporterDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [entryMode, setEntryMode] = useState<EntryMode>("booth");

  // Check authentication
  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuery<{ authenticated: boolean; reporter: Reporter }>({
    queryKey: ["/api/auth/me"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && (!authData?.authenticated || authError)) {
      setLocation("/reporter/login");
    }
  }, [authData, isAuthLoading, authError, setLocation]);

  // WebSocket for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    ws.onopen = () => {
      console.log("Reporter Dashboard WebSocket connected");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Reporter WebSocket message received:", data.type);
        if (data.type === "vote:update" || data.type === "votes:reset") {
          // Invalidate all analytics queries when votes are updated
          queryClient.invalidateQueries({ predicate: (query) => {
            const key = query.queryKey[0];
            return typeof key === 'string' && (key.includes('/api/admin/analytics') || key.includes('/api/districts') || key.includes('/api/constituencies'));
          }});
        }
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };
    
    ws.onerror = (error) => {
      console.error("Reporter WebSocket error:", error);
    };
    
    ws.onclose = () => {
      console.log("Reporter Dashboard WebSocket disconnected");
    };
    
    return () => ws.close();
  }, [queryClient]);

  const currentSchema = entryMode === "booth" ? boothEntrySchema : roundEntrySchema;
  
  const form = useForm<VoteEntryForm>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      districtId: "",
      constituencyId: "",
      roundId: "",
      areaId: "",
      dmkVotes: 0,
      aiadmkVotes: 0,
      tvkVotes: 0,
      naamTamilarVotes: 0,
      othersVotes: 0,
    },
  });

  const selectedDistrictId = form.watch("districtId");
  const selectedConstituencyId = form.watch("constituencyId");

  // Get districts from static data
  const districts = TAMIL_NADU_DISTRICTS;

  // Get constituencies based on selected district
  const constituencies = selectedDistrictId 
    ? generateConstituencies(selectedDistrictId) 
    : [];

  // Fetch rounds for constituency
  const { data: rounds = [] } = useQuery<Round[]>({
    queryKey: ["/api/constituencies", selectedConstituencyId, "rounds"],
    enabled: !!selectedConstituencyId,
  });

  // Get areas for constituency
  const areas = selectedConstituencyId 
    ? generateAreas(selectedConstituencyId).filter(a => a.type === "booth")
    : [];

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/reporter/login");
    },
  });

  // Submit votes mutation
  const submitVotesMutation = useMutation({
    mutationFn: async (data: VoteEntryForm) => {
      const vote: InsertVote = {
        roundId: data.roundId,
        areaId: entryMode === "booth" ? data.areaId : `round-aggregate-${data.roundId}`,
        constituencyId: data.constituencyId,
        tallies: [
          { party: "DMK", votes: data.dmkVotes },
          { party: "AIADMK", votes: data.aiadmkVotes },
          { party: "TVK", votes: data.tvkVotes },
          { party: "Naam Tamilar", votes: data.naamTamilarVotes },
          { party: "Others", votes: data.othersVotes },
        ],
        entryMode: entryMode,
      };
      const response = await apiRequest("POST", "/api/votes", vote);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Votes Submitted",
        description: "Your vote entry has been recorded successfully.",
      });
      form.reset({
        districtId: form.getValues("districtId"),
        constituencyId: form.getValues("constituencyId"),
        roundId: form.getValues("roundId"),
        areaId: "",
        dmkVotes: 0,
        aiadmkVotes: 0,
        tvkVotes: 0,
        naamTamilarVotes: 0,
        othersVotes: 0,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit votes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VoteEntryForm) => {
    submitVotesMutation.mutate(data);
  };

  // Calculate total votes
  const totalVotes = 
    (form.watch("dmkVotes") || 0) +
    (form.watch("aiadmkVotes") || 0) +
    (form.watch("tvkVotes") || 0) +
    (form.watch("naamTamilarVotes") || 0) +
    (form.watch("othersVotes") || 0);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Reporter Dashboard</h1>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Badge variant="secondary">
            {authData.reporter.name}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              View Results
            </Button>
          </Link>
          {authData.reporter.username === "admin" && (
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" data-testid="link-admin-dashboard">
                Admin Analytics
              </Button>
            </Link>
          )}
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

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Entry Mode Selector */}
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${entryMode === "booth" ? "ring-2 ring-primary" : "opacity-70"}`}
              onClick={() => {
                setEntryMode("booth");
                form.setValue("areaId", "");
              }}
              data-testid="button-mode-booth"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${entryMode === "booth" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Booth-wise Entry</h3>
                  <p className="text-sm text-muted-foreground">Enter votes for individual booths</p>
                </div>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer transition-all ${entryMode === "round" ? "ring-2 ring-primary" : "opacity-70"}`}
              onClick={() => {
                setEntryMode("round");
                form.setValue("areaId", "");
              }}
              data-testid="button-mode-round"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${entryMode === "round" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Layers className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Round-wise Entry</h3>
                  <p className="text-sm text-muted-foreground">Enter aggregate votes (14 booths = 1 round)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
          {/* Vote Entry Form */}
          <Card data-testid="vote-entry-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {entryMode === "booth" ? <Building2 className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                {entryMode === "booth" ? "Booth-wise Entry" : "Round-wise Entry"}
              </CardTitle>
              <CardDescription>
                {entryMode === "booth" 
                  ? "Enter votes for a single booth" 
                  : "Enter aggregate votes for all 14 booths in a round"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Location Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="districtId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("constituencyId", "");
                              form.setValue("roundId", "");
                              form.setValue("areaId", "");
                            }}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-district">
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                  {d.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="constituencyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Constituency</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("roundId", "");
                              form.setValue("areaId", "");
                            }}
                            disabled={!selectedDistrictId}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-constituency">
                                <SelectValue placeholder="Select constituency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {constituencies.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="roundId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Round</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedConstituencyId}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-round">
                                <SelectValue placeholder="Select round" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rounds.length === 0 ? (
                                <>
                                  <SelectItem value="round-1">Round 1</SelectItem>
                                  <SelectItem value="round-2">Round 2</SelectItem>
                                  <SelectItem value="round-3">Round 3</SelectItem>
                                </>
                              ) : (
                                rounds.map((r) => (
                                  <SelectItem key={r.id} value={r.id}>
                                    Round {r.roundNumber}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {entryMode === "booth" && (
                      <FormField
                        control={form.control}
                        name="areaId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Booth</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!selectedConstituencyId}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-area">
                                  <SelectValue placeholder="Select booth" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {areas.map((a) => (
                                  <SelectItem key={a.id} value={a.id}>
                                    {a.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Vote Inputs */}
                  <div className="space-y-3">
                    {[
                      { name: "dmkVotes" as const, party: "DMK" as Party },
                      { name: "aiadmkVotes" as const, party: "AIADMK" as Party },
                      { name: "tvkVotes" as const, party: "TVK" as Party },
                      { name: "naamTamilarVotes" as const, party: "Naam Tamilar" as Party },
                      { name: "othersVotes" as const, party: "Others" as Party },
                    ].map(({ name, party }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <PartySymbol party={party} size={32} />
                              <FormLabel className="flex-1 min-w-0">{party}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  className="w-24 text-right"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid={`input-${name}`}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <Separator />

                  {/* Total and Submit */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      Total: <span className="tabular-nums">{totalVotes.toLocaleString()}</span>
                    </div>
                    <Button
                      type="submit"
                      disabled={submitVotesMutation.isPending || totalVotes === 0}
                      data-testid="button-submit-votes"
                    >
                      {submitVotesMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Submit Votes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <PollingStatsCard />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quick Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Select Location</p>
                    <p className="text-sm text-muted-foreground">
                      Choose your district, constituency, round, and booth
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Enter Vote Counts</p>
                    <p className="text-sm text-muted-foreground">
                      Input the vote counts for each party
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Submit</p>
                    <p className="text-sm text-muted-foreground">
                      Verify and submit - results update in real-time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Reporter Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{authData.reporter.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-medium">{authData.reporter.username}</span>
                  </div>
                  {authData.reporter.assignedDistrict && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned District</span>
                      <span className="font-medium">{authData.reporter.assignedDistrict}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
