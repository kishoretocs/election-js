import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { storage } from "./storage";
import { insertVoteSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

// Extend session to include reporter
declare module "express-session" {
  interface SessionData {
    reporterId?: string;
  }
}

// Store connected WebSocket clients
const wsClients = new Set<WebSocket>();

// Broadcast message to all connected clients
function broadcast(message: { type: string; payload?: unknown }) {
  const data = JSON.stringify(message);
  console.log(`Broadcasting to ${wsClients.size} clients:`, message.type);
  wsClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.reporterId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "election-secret-key-change-in-prod",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    wsClients.add(ws);
    
    ws.send(JSON.stringify({
      type: "connected",
      payload: { message: "Connected to Election Results Live Updates" },
    }));

    ws.on("close", () => {
      wsClients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      wsClients.delete(ws);
    });
  });

  // ============ AUTH ROUTES ============

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const reporter = await storage.validateReporter(credentials.username, credentials.password);
      
      if (!reporter) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.reporterId = reporter.id;
      
      res.json({
        success: true,
        reporter: {
          id: reporter.id,
          username: reporter.username,
          name: reporter.name,
          assignedDistrict: reporter.assignedDistrict,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.reporterId) {
      return res.json({ authenticated: false });
    }

    const reporter = await storage.getReporter(req.session.reporterId);
    if (!reporter) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      reporter: {
        id: reporter.id,
        username: reporter.username,
        name: reporter.name,
        assignedDistrict: reporter.assignedDistrict,
      },
    });
  });

  // ============ DISTRICT ROUTES ============

  // Get all districts with summaries
  app.get("/api/districts", async (req, res) => {
    try {
      const districts = await storage.getDistricts();
      res.json(districts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch districts" });
    }
  });

  // Get district by ID
  app.get("/api/districts/:id", async (req, res) => {
    try {
      const district = await storage.getDistrict(req.params.id);
      if (!district) {
        return res.status(404).json({ error: "District not found" });
      }
      res.json(district);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch district" });
    }
  });

  // Get constituencies by district
  app.get("/api/districts/:id/constituencies", async (req, res) => {
    try {
      const constituencies = await storage.getConstituenciesByDistrict(req.params.id);
      res.json(constituencies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch constituencies" });
    }
  });

  // ============ CONSTITUENCY ROUTES ============

  // Get constituency details (summary + rounds + areas)
  app.get("/api/constituencies/:id", async (req, res) => {
    try {
      const details = await storage.getConstituencyDetails(req.params.id);
      if (!details) {
        return res.status(404).json({ error: "Constituency not found" });
      }
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch constituency details" });
    }
  });

  // Get rounds by constituency
  app.get("/api/constituencies/:id/rounds", async (req, res) => {
    try {
      const rounds = await storage.getRoundsByConstituency(req.params.id);
      res.json(rounds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rounds" });
    }
  });

  // Get areas by constituency
  app.get("/api/constituencies/:id/areas", async (req, res) => {
    try {
      const areas = await storage.getAreasByConstituency(req.params.id);
      res.json(areas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch areas" });
    }
  });

  // ============ VOTE ROUTES ============

  // Submit votes (requires auth)
  app.post("/api/votes", requireAuth, async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      const voteRecord = await storage.submitVote(voteData, req.session.reporterId!);

      // Broadcast vote update to all connected clients
      broadcast({
        type: "vote:update",
        payload: {
          constituencyId: voteRecord.constituencyId,
          roundId: voteRecord.roundId,
          areaId: voteRecord.areaId,
          tallies: voteRecord.tallies,
        },
      });

      res.json({ success: true, vote: voteRecord });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Vote submission error:", error);
      res.status(500).json({ error: "Failed to submit vote" });
    }
  });

  // Get votes by round
  app.get("/api/rounds/:id/votes", async (req, res) => {
    try {
      const votes = await storage.getVotesByRound(req.params.id);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  });

  // ============ POLLING STATS ============

  // Get polling statistics (public)
  app.get("/api/polling-stats", async (req, res) => {
    try {
      const stats = await storage.getPollingStats();
      res.json(stats);
    } catch (error) {
      console.error("Polling stats error:", error);
      res.status(500).json({ error: "Failed to fetch polling stats" });
    }
  });

  // ============ PUBLIC ANALYTICS FOR DISPLAY DASHBOARD ============

  // Get analytics data (public - for display dashboard)
  app.get("/api/display/analytics", async (req, res) => {
    try {
      const { districtId, constituencyId } = req.query;
      const analytics = await storage.getAnalytics(
        districtId as string | undefined,
        constituencyId as string | undefined
      );
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ============ ADMIN ANALYTICS ROUTES ============

  // Get analytics data (requires auth)
  app.get("/api/admin/analytics", requireAuth, async (req, res) => {
    try {
      const { districtId, constituencyId } = req.query;
      const analytics = await storage.getAnalytics(
        districtId as string | undefined,
        constituencyId as string | undefined
      );
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Reset all votes (admin only)
  app.post("/api/admin/reset-votes", requireAuth, async (req, res) => {
    try {
      const reporter = await storage.getReporter(req.session.reporterId!);
      if (!reporter || reporter.username !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      await storage.resetVotes();
      
      // Broadcast reset to all connected clients
      broadcast({ type: "votes:reset" });
      
      res.json({ success: true, message: "All votes have been reset" });
    } catch (error) {
      console.error("Reset votes error:", error);
      res.status(500).json({ error: "Failed to reset votes" });
    }
  });

  return httpServer;
}
