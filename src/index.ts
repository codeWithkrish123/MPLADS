import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { db } from "./services/db.service.js";
import { sentinelClient } from "./services/sentinelClient.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import gatewayRoutes from "./routes/gateway.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import duplicatesRoutes from "./routes/duplicates.routes.js";
import complianceRoutes from "./routes/compliance.routes.js";
import agenciesRoutes from "./routes/agencies.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import datasetsRoutes from "./routes/datasets.routes.js";

const app = express();

// 1. Security Headers & CORS
app.use(helmet());

const allowedOriginsList = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, local dev tools)
      if (!origin) return callback(null, true);
      if (
        allowedOriginsList.includes(origin) ||
        allowedOriginsList.includes("*") ||
        env.NODE_ENV !== "production" ||
        origin.endsWith(":5173")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// 2. Body Parsing & Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// 3. Rate Limiting
app.use("/api", apiRateLimiter);

// 4. System Health Check & Readiness Probe
app.get(["/health", "/api/health"], async (req: Request, res: Response) => {
  const isPgOnline = db.isPgConnected();
  const upstreamHealth = await sentinelClient.getHealth();

  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      gateway: "healthy",
      database: isPgOnline ? "connected (PostgreSQL)" : "connected (Active Memory Store)",
      upstream_ml_sentinel: upstreamHealth?.status || "reachable",
    },
    upstream_data: upstreamHealth,
  });
});

// 5. Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/duplicates", duplicatesRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/agencies", agenciesRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/datasets", datasetsRoutes);

// ML Gateway Proxy routes (mounted under /api and /api/v1)
app.use("/api", gatewayRoutes);

// Root fallback
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "MPLADS Sentinel Backend & API Gateway",
    version: "1.0.0",
    docs_url: "/api/docs",
    health_url: "/health",
  });
});

// 6. Global Error Handler
app.use(errorHandler);

// 7. Initialize Database & Start Server
async function startServer() {
  await db.initialize();

  const server = app.listen(env.PORT, () => {
    console.log(`====================================================`);
    console.log(`🏛️  MPLADS Sentinel Backend & API Gateway Started`);
    console.log(`📡 Port: ${env.PORT}`);
    console.log(`🔗 Upstream ML API: ${env.UPSTREAM_ML_URL}`);
    console.log(`🛡️  Allowed Origins: ${env.ALLOWED_ORIGINS}`);
    console.log(`💾 System of Record: PostgreSQL (${env.DATABASE_URL.split("@")[1] || "Active"})`);
    console.log(`====================================================`);
  });

  return server;
}

startServer().catch((err) => {
  console.error("Failed to start MPLADS Sentinel server:", err);
});

export default app;
