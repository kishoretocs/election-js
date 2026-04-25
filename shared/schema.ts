import { z } from "zod";

// Party definitions
export const PARTIES = ["DMK", "AIADMK", "TVK", "Naam Tamilar", "Others"] as const;
export type Party = typeof PARTIES[number];

// Party colors for visualization
export const PARTY_COLORS: Record<Party, string> = {
  "DMK": "#E31E24",
  "AIADMK": "#00843D",
  "TVK": "#FFC107",
  "Naam Tamilar": "#8B0000",
  "Others": "#6B7280"
};

// District Schema
export const districtSchema = z.object({
  id: z.string(),
  name: z.string(),
  tamilName: z.string().optional(),
});
export type District = z.infer<typeof districtSchema>;

// Constituency Schema
export const constituencySchema = z.object({
  id: z.string(),
  districtId: z.string(),
  name: z.string(),
  tamilName: z.string().optional(),
  eligibleVoters: z.number().default(150000),
});
export type Constituency = z.infer<typeof constituencySchema>;

// Area (Taluk/Booth) Schema
export const areaSchema = z.object({
  id: z.string(),
  constituencyId: z.string(),
  name: z.string(),
  type: z.enum(["taluk", "booth"]),
});
export type Area = z.infer<typeof areaSchema>;

// Counting Round Schema
export const roundSchema = z.object({
  id: z.string(),
  constituencyId: z.string(),
  roundNumber: z.number(),
  status: z.enum(["pending", "counting", "completed"]),
});
export type Round = z.infer<typeof roundSchema>;

// Vote Tally Schema
export const voteTallySchema = z.object({
  party: z.enum(PARTIES),
  votes: z.number().min(0),
});
export type VoteTally = z.infer<typeof voteTallySchema>;

// Vote Record Schema
export const voteRecordSchema = z.object({
  id: z.string(),
  roundId: z.string(),
  areaId: z.string(),
  constituencyId: z.string(),
  tallies: z.array(voteTallySchema),
  timestamp: z.string(),
  reporterId: z.string(),
});
export type VoteRecord = z.infer<typeof voteRecordSchema>;

// Entry mode for vote submission
export const ENTRY_MODES = ["booth", "round"] as const;
export type EntryMode = typeof ENTRY_MODES[number];

// Insert schemas
export const insertVoteSchema = z.object({
  roundId: z.string(),
  areaId: z.string(),
  constituencyId: z.string(),
  tallies: z.array(voteTallySchema),
  entryMode: z.enum(ENTRY_MODES).optional(),
});
export type InsertVote = z.infer<typeof insertVoteSchema>;

// Reporter Schema
export const reporterSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  assignedDistrict: z.string().optional(),
});
export type Reporter = z.infer<typeof reporterSchema>;

export const insertReporterSchema = reporterSchema.omit({ id: true });
export type InsertReporter = z.infer<typeof insertReporterSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginCredentials = z.infer<typeof loginSchema>;

// Aggregated vote summary per constituency
export const constituencySummarySchema = z.object({
  constituencyId: z.string(),
  constituencyName: z.string(),
  districtId: z.string(),
  totalVotes: z.number(),
  eligibleVoters: z.number(),
  pollingPercentage: z.number(),
  partyTotals: z.record(z.enum(PARTIES), z.number()),
  leadingParty: z.enum(PARTIES).nullable(),
  roundsCompleted: z.number(),
  totalRounds: z.number(),
});
export type ConstituencySummary = z.infer<typeof constituencySummarySchema>;

// Overall polling statistics
export const pollingStatsSchema = z.object({
  totalEligibleVoters: z.number(),
  totalVotesPolled: z.number(),
  totalVotesCounted: z.number(),
  pollingPercentage: z.number(),
  countingPercentage: z.number(),
  totalConstituencies: z.number(),
  constituenciesCounted: z.number(),
  lastUpdated: z.string(),
});
export type PollingStats = z.infer<typeof pollingStatsSchema>;

// Area vote details
export const areaVoteDetailsSchema = z.object({
  areaId: z.string(),
  areaName: z.string(),
  areaType: z.enum(["taluk", "booth"]),
  partyVotes: z.record(z.enum(PARTIES), z.number()),
  totalVotes: z.number(),
  eligibleVoters: z.number(),
  pollingPercentage: z.number(),
});
export type AreaVoteDetails = z.infer<typeof areaVoteDetailsSchema>;

// Round vote details
export const roundVoteDetailsSchema = z.object({
  roundId: z.string(),
  roundNumber: z.number(),
  status: z.enum(["pending", "counting", "completed"]),
  partyVotes: z.record(z.enum(PARTIES), z.number()),
  totalVotes: z.number(),
});
export type RoundVoteDetails = z.infer<typeof roundVoteDetailsSchema>;

// WebSocket message types
export const wsMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("vote:update"),
    payload: z.object({
      constituencyId: z.string(),
      roundId: z.string(),
      areaId: z.string(),
      tallies: z.array(voteTallySchema),
    }),
  }),
  z.object({
    type: z.literal("round:status"),
    payload: z.object({
      roundId: z.string(),
      status: z.enum(["pending", "counting", "completed"]),
    }),
  }),
  z.object({
    type: z.literal("connected"),
    payload: z.object({
      message: z.string(),
    }),
  }),
]);
export type WSMessage = z.infer<typeof wsMessageSchema>;

// Keep backward compatibility for users table
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
