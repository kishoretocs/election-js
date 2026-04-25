import { randomUUID } from "crypto";
import type {
  District,
  Constituency,
  Area,
  Round,
  VoteRecord,
  Reporter,
  InsertVote,
  ConstituencySummary,
  RoundVoteDetails,
  AreaVoteDetails,
  Party,
  VoteTally,
  PollingStats,
} from "@shared/schema";
import { PARTIES } from "@shared/schema";
import { TAMIL_NADU_DISTRICTS, generateConstituencies, generateAreas } from "@shared/tamilnadu-data";

export interface AnalyticsData {
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
    cumulativeEligibleVoters: number;
  }>;
  boothWiseData: Array<{
    areaId: string;
    areaName: string;
    votes: Record<Party, number>;
    totalVotes: number;
    eligibleVoters: number;
    pollingPercentage: number;
    cumulativeEligibleVoters: number;
  }>;
  roundWiseData: Array<{
    round: number;
    votes: Record<Party, number>;
    totalVotes: number;
  }>;
  totalVotes: number;
  totalConstituencies: number;
  roundsCompleted: number;
  totalRounds: number;
  partyVotes: Record<Party, number>;
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

export interface IStorage {
  getDistricts(): Promise<{ id: string; name: string; leadingParty: Party | null; totalVotes: number; eligibleVoters: number }[]>;
  getDistrict(id: string): Promise<District | undefined>;
  getConstituenciesByDistrict(districtId: string): Promise<ConstituencySummary[]>;
  getConstituency(id: string): Promise<Constituency | undefined>;
  getConstituencyDetails(id: string): Promise<{
    summary: ConstituencySummary;
    rounds: RoundVoteDetails[];
    areas: AreaVoteDetails[];
  } | undefined>;
  getRoundsByConstituency(constituencyId: string): Promise<Round[]>;
  getAreasByConstituency(constituencyId: string): Promise<Area[]>;
  submitVote(vote: InsertVote, reporterId: string): Promise<VoteRecord>;
  getVotesByRound(roundId: string): Promise<VoteRecord[]>;
  getReporter(id: string): Promise<Reporter | undefined>;
  getReporterByUsername(username: string): Promise<Reporter | undefined>;
  validateReporter(username: string, password: string): Promise<Reporter | undefined>;
  getAnalytics(districtId?: string, constituencyId?: string): Promise<AnalyticsData>;
  getPollingStats(): Promise<PollingStats>;
  resetVotes(): Promise<void>;
}

export class MemStorage implements IStorage {
  private districts: Map<string, District>;
  private constituencies: Map<string, Constituency>;
  private areas: Map<string, Area>;
  private rounds: Map<string, Round>;
  private votes: Map<string, VoteRecord>;
  private reporters: Map<string, Reporter>;

  constructor() {
    this.districts = new Map();
    this.constituencies = new Map();
    this.areas = new Map();
    this.rounds = new Map();
    this.votes = new Map();
    this.reporters = new Map();

    this.seedData();
  }

  private seedData() {
    for (const district of TAMIL_NADU_DISTRICTS) {
      this.districts.set(district.id, {
        id: district.id,
        name: district.name,
        tamilName: district.tamilName,
      });

      const constituencyData = generateConstituencies(district.id);
      for (const constData of constituencyData) {
        const eligibleVoters = 120000 + Math.floor(Math.random() * 80000);
        const constituency: Constituency = {
          id: constData.id,
          districtId: district.id,
          name: constData.name,
          tamilName: constData.tamilName,
          eligibleVoters,
        };
        this.constituencies.set(constData.id, constituency);

        const areaData = generateAreas(constData.id);
        for (const area of areaData) {
          this.areas.set(area.id, {
            id: area.id,
            constituencyId: constData.id,
            name: area.name,
            type: area.type,
          });
        }

        for (let i = 1; i <= 5; i++) {
          const roundId = `${constData.id}-round-${i}`;
          this.rounds.set(roundId, {
            id: roundId,
            constituencyId: constData.id,
            roundNumber: i,
            status: i <= 2 ? "completed" : i === 3 ? "counting" : "pending",
          });
        }
      }
    }

    const demoReporters: Reporter[] = [
      { id: "r1", username: "reporter1", password: "password123", name: "John Reporter", assignedDistrict: "chennai" },
      { id: "r2", username: "reporter2", password: "password123", name: "Jane Reporter", assignedDistrict: "coimbatore" },
      { id: "r3", username: "admin", password: "admin123", name: "Admin User" },
    ];
    for (const reporter of demoReporters) {
      this.reporters.set(reporter.id, reporter);
    }

    this.seedInitialVotes();
  }

  private seedInitialVotes() {
    const sampleConstituencies = Array.from(this.constituencies.values()).slice(0, 20);
    
    for (const constituency of sampleConstituencies) {
      const constRounds = Array.from(this.rounds.values()).filter(
        r => r.constituencyId === constituency.id && r.status !== "pending"
      );
      
      const constAreas = Array.from(this.areas.values()).filter(
        a => a.constituencyId === constituency.id && a.type === "booth"
      ).slice(0, 5);

      for (const round of constRounds) {
        for (const area of constAreas) {
          const voteId = randomUUID();
          const tallies: VoteTally[] = PARTIES.map(party => ({
            party,
            votes: Math.floor(Math.random() * 500) + 100,
          }));

          this.votes.set(voteId, {
            id: voteId,
            roundId: round.id,
            areaId: area.id,
            constituencyId: constituency.id,
            tallies,
            timestamp: new Date().toISOString(),
            reporterId: "r1",
          });
        }
      }
    }
  }

  async getDistricts(): Promise<{ id: string; name: string; leadingParty: Party | null; totalVotes: number; eligibleVoters: number }[]> {
    const districts = Array.from(this.districts.values());
    
    return districts.map(district => {
      const districtConstituencies = Array.from(this.constituencies.values()).filter(
        c => c.districtId === district.id
      );
      
      const partyTotals: Record<Party, number> = {} as Record<Party, number>;
      for (const party of PARTIES) {
        partyTotals[party] = 0;
      }

      let totalVotes = 0;
      let eligibleVoters = 0;

      for (const constituency of districtConstituencies) {
        eligibleVoters += constituency.eligibleVoters || 150000;
        const constVotes = Array.from(this.votes.values()).filter(
          v => v.constituencyId === constituency.id
        );
        
        for (const vote of constVotes) {
          for (const tally of vote.tallies) {
            partyTotals[tally.party] += tally.votes;
            totalVotes += tally.votes;
          }
        }
      }

      let leadingParty: Party | null = null;
      let maxVotes = 0;
      for (const party of PARTIES) {
        if (partyTotals[party] > maxVotes) {
          maxVotes = partyTotals[party];
          leadingParty = party;
        }
      }

      return {
        id: district.id,
        name: district.name,
        leadingParty: totalVotes > 0 ? leadingParty : null,
        totalVotes,
        eligibleVoters,
      };
    });
  }

  async getDistrict(id: string): Promise<District | undefined> {
    return this.districts.get(id);
  }

  async getConstituenciesByDistrict(districtId: string): Promise<ConstituencySummary[]> {
    const constituencies = Array.from(this.constituencies.values()).filter(
      c => c.districtId === districtId
    );

    return constituencies.map(constituency => this.calculateConstituencySummary(constituency));
  }

  private calculateConstituencySummary(constituency: Constituency): ConstituencySummary {
    const constVotes = Array.from(this.votes.values()).filter(
      v => v.constituencyId === constituency.id
    );
    
    const constRounds = Array.from(this.rounds.values()).filter(
      r => r.constituencyId === constituency.id
    );

    const partyTotals: Record<Party, number> = {} as Record<Party, number>;
    for (const party of PARTIES) {
      partyTotals[party] = 0;
    }

    let totalVotes = 0;
    for (const vote of constVotes) {
      for (const tally of vote.tallies) {
        partyTotals[tally.party] += tally.votes;
        totalVotes += tally.votes;
      }
    }

    let leadingParty: Party | null = null;
    let maxVotes = 0;
    for (const party of PARTIES) {
      if (partyTotals[party] > maxVotes) {
        maxVotes = partyTotals[party];
        leadingParty = party;
      }
    }

    const eligibleVoters = constituency.eligibleVoters || 150000;
    const pollingPercentage = eligibleVoters > 0 ? (totalVotes / eligibleVoters) * 100 : 0;

    return {
      constituencyId: constituency.id,
      constituencyName: constituency.name,
      districtId: constituency.districtId,
      totalVotes,
      eligibleVoters,
      pollingPercentage: Math.round(pollingPercentage * 100) / 100,
      partyTotals,
      leadingParty: totalVotes > 0 ? leadingParty : null,
      roundsCompleted: constRounds.filter(r => r.status === "completed").length,
      totalRounds: constRounds.length,
    };
  }

  async getConstituency(id: string): Promise<Constituency | undefined> {
    return this.constituencies.get(id);
  }

  async getConstituencyDetails(id: string): Promise<{
    summary: ConstituencySummary;
    rounds: RoundVoteDetails[];
    areas: AreaVoteDetails[];
  } | undefined> {
    const constituency = this.constituencies.get(id);
    if (!constituency) return undefined;

    const summary = this.calculateConstituencySummary(constituency);

    const constRounds = Array.from(this.rounds.values())
      .filter(r => r.constituencyId === id)
      .sort((a, b) => a.roundNumber - b.roundNumber);

    const rounds: RoundVoteDetails[] = constRounds.map(round => {
      const roundVotes = Array.from(this.votes.values()).filter(
        v => v.roundId === round.id
      );

      const partyVotes: Record<Party, number> = {} as Record<Party, number>;
      for (const party of PARTIES) {
        partyVotes[party] = 0;
      }

      let totalVotes = 0;
      for (const vote of roundVotes) {
        for (const tally of vote.tallies) {
          partyVotes[tally.party] += tally.votes;
          totalVotes += tally.votes;
        }
      }

      return {
        roundId: round.id,
        roundNumber: round.roundNumber,
        status: round.status,
        partyVotes,
        totalVotes,
      };
    });

    const constAreas = Array.from(this.areas.values()).filter(
      a => a.constituencyId === id
    );

    const areas: AreaVoteDetails[] = constAreas.map(area => {
      const areaVotes = Array.from(this.votes.values()).filter(
        v => v.areaId === area.id
      );

      const partyVotes: Record<Party, number> = {} as Record<Party, number>;
      for (const party of PARTIES) {
        partyVotes[party] = 0;
      }

      let totalVotes = 0;
      for (const vote of areaVotes) {
        for (const tally of vote.tallies) {
          partyVotes[tally.party] += tally.votes;
          totalVotes += tally.votes;
        }
      }

      // Generate eligible voters based on area type
      // Booths: 800-1500 voters, Taluks: 25000-40000 voters
      const baseEligible = area.type === "booth" 
        ? 800 + Math.floor(Math.random() * 700) 
        : 25000 + Math.floor(Math.random() * 15000);
      
      // Use a seeded random based on area id for consistency
      const seed = area.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const eligibleVoters = area.type === "booth" 
        ? 800 + (seed % 700) 
        : 25000 + (seed % 15000);
      
      // Polling percentage is the counted votes vs votes that would have been polled
      // Assume 72.5% average polling turnout for consistency
      const polledVotes = Math.floor(eligibleVoters * 0.725);
      const pollingPercentage = polledVotes > 0 
        ? Math.min(100, Math.round((totalVotes / polledVotes) * 1000) / 10)
        : 0;

      return {
        areaId: area.id,
        areaName: area.name,
        areaType: area.type,
        partyVotes,
        totalVotes,
        eligibleVoters,
        pollingPercentage,
      };
    });

    return { summary, rounds, areas };
  }

  async getRoundsByConstituency(constituencyId: string): Promise<Round[]> {
    return Array.from(this.rounds.values())
      .filter(r => r.constituencyId === constituencyId)
      .sort((a, b) => a.roundNumber - b.roundNumber);
  }

  async getAreasByConstituency(constituencyId: string): Promise<Area[]> {
    return Array.from(this.areas.values()).filter(
      a => a.constituencyId === constituencyId
    );
  }

  async submitVote(vote: InsertVote, reporterId: string): Promise<VoteRecord> {
    const id = randomUUID();
    
    if (!this.rounds.has(vote.roundId)) {
      const roundNum = parseInt(vote.roundId.split('-').pop() || "1");
      this.rounds.set(vote.roundId, {
        id: vote.roundId,
        constituencyId: vote.constituencyId,
        roundNumber: roundNum,
        status: "counting",
      });
    }

    if (!this.areas.has(vote.areaId)) {
      this.areas.set(vote.areaId, {
        id: vote.areaId,
        constituencyId: vote.constituencyId,
        name: vote.areaId.split('-').pop() || "Unknown",
        type: "booth",
      });
    }

    const voteRecord: VoteRecord = {
      id,
      roundId: vote.roundId,
      areaId: vote.areaId,
      constituencyId: vote.constituencyId,
      tallies: vote.tallies,
      timestamp: new Date().toISOString(),
      reporterId,
    };

    this.votes.set(id, voteRecord);
    return voteRecord;
  }

  async getVotesByRound(roundId: string): Promise<VoteRecord[]> {
    return Array.from(this.votes.values()).filter(v => v.roundId === roundId);
  }

  async getReporter(id: string): Promise<Reporter | undefined> {
    return this.reporters.get(id);
  }

  async getReporterByUsername(username: string): Promise<Reporter | undefined> {
    return Array.from(this.reporters.values()).find(r => r.username === username);
  }

  async validateReporter(username: string, password: string): Promise<Reporter | undefined> {
    const reporter = await this.getReporterByUsername(username);
    if (reporter && reporter.password === password) {
      return reporter;
    }
    return undefined;
  }

  async getAnalytics(districtId?: string, constituencyId?: string): Promise<AnalyticsData> {
    let relevantVotes = Array.from(this.votes.values());
    let relevantConstituencies = Array.from(this.constituencies.values());

    if (constituencyId && constituencyId !== "all") {
      relevantVotes = relevantVotes.filter(v => v.constituencyId === constituencyId);
      relevantConstituencies = relevantConstituencies.filter(c => c.id === constituencyId);
    } else if (districtId && districtId !== "all") {
      relevantConstituencies = relevantConstituencies.filter(c => c.districtId === districtId);
      const constIds = new Set(relevantConstituencies.map(c => c.id));
      relevantVotes = relevantVotes.filter(v => constIds.has(v.constituencyId));
    }

    const roundVotesMap: Record<number, { partyVotes: Record<Party, number>; totalVotes: number }> = {};
    const boothVotesMap: Record<string, { boothName: string; partyVotes: Record<Party, number>; totalVotes: number }> = {};
    const partyTotals: Record<Party, number> = { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 };
    const constituencyLeaders: Record<string, Party> = {};

    for (const vote of relevantVotes) {
      const round = this.rounds.get(vote.roundId);
      const roundNum = round?.roundNumber || 1;
      
      if (!roundVotesMap[roundNum]) {
        roundVotesMap[roundNum] = { 
          partyVotes: { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 }, 
          totalVotes: 0 
        };
      }
      
      const area = this.areas.get(vote.areaId);
      const boothName = area?.name || vote.areaId;
      if (!boothVotesMap[vote.areaId]) {
        boothVotesMap[vote.areaId] = { 
          boothName, 
          partyVotes: { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 }, 
          totalVotes: 0 
        };
      }

      for (const tally of vote.tallies) {
        roundVotesMap[roundNum].partyVotes[tally.party] += tally.votes;
        roundVotesMap[roundNum].totalVotes += tally.votes;
        
        boothVotesMap[vote.areaId].partyVotes[tally.party] += tally.votes;
        boothVotesMap[vote.areaId].totalVotes += tally.votes;
        
        partyTotals[tally.party] += tally.votes;
      }
    }

    for (const constituency of relevantConstituencies) {
      const constVotes = relevantVotes.filter(v => v.constituencyId === constituency.id);
      const constPartyTotals: Record<Party, number> = { DMK: 0, AIADMK: 0, TVK: 0, "Naam Tamilar": 0, Others: 0 };
      
      for (const vote of constVotes) {
        for (const tally of vote.tallies) {
          constPartyTotals[tally.party] += tally.votes;
        }
      }
      
      let maxVotes = 0;
      let leader: Party = "DMK";
      for (const party of PARTIES) {
        if (constPartyTotals[party] > maxVotes) {
          maxVotes = constPartyTotals[party];
          leader = party;
        }
      }
      if (maxVotes > 0) {
        constituencyLeaders[constituency.id] = leader;
      }
    }

    const roundWiseCumulative: AnalyticsData["roundWiseCumulative"] = [];
    let cumulativeTotal = 0;
    const sortedRounds = Object.keys(roundVotesMap).map(Number).sort((a, b) => a - b);
    
    for (const roundNum of sortedRounds) {
      const data = roundVotesMap[roundNum];
      cumulativeTotal += data.totalVotes;
      roundWiseCumulative.push({
        round: roundNum,
        partyVotes: data.partyVotes,
        totalVotes: data.totalVotes,
        cumulativeTotal,
      });
    }

    // Calculate cumulative eligible voters as booths are added
    let cumulativeEligibleVotersTracker = 0;
    const boothWiseCumulative: AnalyticsData["boothWiseCumulative"] = Object.entries(boothVotesMap)
      .map(([boothId, data]) => {
        // Generate eligible voters based on booth id seed for consistency
        const seed = boothId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const eligibleVoters = 800 + (seed % 700); // 800-1500 voters per booth
        cumulativeEligibleVotersTracker += eligibleVoters;
        const polledVotes = Math.floor(eligibleVoters * 0.725); // 72.5% average polling
        const pollingPercentage = polledVotes > 0 
          ? Math.min(100, Math.round((data.totalVotes / polledVotes) * 1000) / 10)
          : 0;
        
        return {
          boothId,
          boothName: data.boothName,
          partyVotes: data.partyVotes,
          totalVotes: data.totalVotes,
          eligibleVoters,
          pollingPercentage,
          cumulativeEligibleVoters: cumulativeEligibleVotersTracker,
        };
      })
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 20);
    
    // Map to frontend format (boothWiseData with areaId/areaName instead of boothId/boothName)
    const boothWiseData: AnalyticsData["boothWiseData"] = boothWiseCumulative.map(booth => ({
      areaId: booth.boothId,
      areaName: booth.boothName,
      votes: booth.partyVotes,
      totalVotes: booth.totalVotes,
      eligibleVoters: booth.eligibleVoters,
      pollingPercentage: booth.pollingPercentage,
      cumulativeEligibleVoters: booth.cumulativeEligibleVoters,
    }));
    
    // Map round data to frontend format
    const roundWiseData: AnalyticsData["roundWiseData"] = roundWiseCumulative.map(round => ({
      round: round.round,
      votes: round.partyVotes,
      totalVotes: round.totalVotes,
    }));

    const totalVotes = Object.values(partyTotals).reduce((sum, v) => sum + v, 0);
    const partyWiseCumulative: AnalyticsData["partyWiseCumulative"] = {} as AnalyticsData["partyWiseCumulative"];
    
    for (const party of PARTIES) {
      const leadingIn = Object.values(constituencyLeaders).filter(p => p === party).length;
      partyWiseCumulative[party] = {
        totalVotes: partyTotals[party],
        percentage: totalVotes > 0 ? (partyTotals[party] / totalVotes) * 100 : 0,
        leadingIn,
      };
    }

    const totalBooths = Object.keys(boothVotesMap).length;
    const estimatedTotalBooths = relevantConstituencies.length * 10;
    const countingProgress = estimatedTotalBooths > 0 ? (totalBooths / estimatedTotalBooths) * 100 : 0;

    return {
      roundWiseCumulative,
      boothWiseCumulative,
      partyWiseCumulative,
      pollingPercentage: Math.round(countingProgress * 10) / 10,
      voterCount: {
        totalRegistered: estimatedTotalBooths,
        totalPolled: totalBooths,
        totalCounted: totalVotes,
      },
      // Frontend-compatible field names
      boothWiseData,
      roundWiseData,
      totalVotes,
      totalConstituencies: relevantConstituencies.length,
      roundsCompleted: sortedRounds.length,
      totalRounds: 10,
      partyVotes: partyTotals,
    };
  }

  async getPollingStats(): Promise<PollingStats> {
    const constituencies = Array.from(this.constituencies.values());
    const votes = Array.from(this.votes.values());

    let totalEligibleVoters = 0;
    let totalVotesCounted = 0;
    const constituenciesWithVotes = new Set<string>();

    for (const constituency of constituencies) {
      totalEligibleVoters += constituency.eligibleVoters || 150000;
    }

    for (const vote of votes) {
      constituenciesWithVotes.add(vote.constituencyId);
      for (const tally of vote.tallies) {
        totalVotesCounted += tally.votes;
      }
    }

    const pollingPercentage = 72.5;
    const totalVotesPolled = Math.floor(totalEligibleVoters * (pollingPercentage / 100));
    const countingPercentage = totalVotesPolled > 0 ? (totalVotesCounted / totalVotesPolled) * 100 : 0;

    return {
      totalEligibleVoters,
      totalVotesPolled,
      totalVotesCounted,
      pollingPercentage,
      countingPercentage: Math.round(countingPercentage * 100) / 100,
      totalConstituencies: constituencies.length,
      constituenciesCounted: constituenciesWithVotes.size,
      lastUpdated: new Date().toISOString(),
    };
  }

  async resetVotes(): Promise<void> {
    this.votes.clear();
  }
}

export const storage = new MemStorage();
