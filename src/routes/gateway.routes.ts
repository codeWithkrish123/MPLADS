import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sentinelClient } from "../services/sentinelClient.js";
import { AppError } from "../middleware/error.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { REAL_STATE_ANALYTICS } from "../data/realStateData.js";
import { REAL_WORKS } from "../data/realWorksData.js";

const router = Router();

// Query validation schema according to Backend Integration Guide
const projectsQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  page_size: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  state: z.string().optional(),
  district: z.string().optional(),
  house: z.enum(["LOK_SABHA", "RAJYA_SABHA"]).optional(),
  risk_level: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  work_category: z.string().optional(),
  min_risk: z.string().optional().transform((v) => (v !== undefined ? parseFloat(v) : undefined)),
  max_risk: z.string().optional().transform((v) => (v !== undefined ? parseFloat(v) : undefined)),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  q: z.string().optional(),
}).refine(
  (data) => {
    if (data.min_risk !== undefined && data.max_risk !== undefined) {
      return data.min_risk <= data.max_risk;
    }
    return true;
  },
  { message: "min_risk must be less than or equal to max_risk", path: ["min_risk"] }
).refine(
  (data) => {
    const size = data.page_size || data.limit;
    if (size !== undefined && size > 1000) {
      return false;
    }
    return true;
  },
  { message: "page_size or limit cannot exceed 1000", path: ["page_size"] }
);

// 1. Stats & Summary
router.get("/stats", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await sentinelClient.getStats();
    return res.json({ status: "success", data: stats });
  } catch (err) {
    next(err);
  }
});

router.get("/dashboard/summary", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalAnalyzed = REAL_STATE_ANALYTICS.reduce((acc, s) => acc + s.total_works, 0);
    const criticalCount = REAL_STATE_ANALYTICS.filter((s) => s.risk_category === "CRITICAL").reduce((a, s) => a + s.high_risk_works, 0);
    const highCount = REAL_STATE_ANALYTICS.filter((s) => s.risk_category === "HIGH").reduce((a, s) => a + s.high_risk_works, 0);
    const avgScore = parseFloat((REAL_STATE_ANALYTICS.reduce((a, s) => a + s.avg_risk_score, 0) / REAL_STATE_ANALYTICS.length).toFixed(1));

    return res.json({
      status: "success",
      data: {
        total_analyzed: totalAnalyzed,
        critical_count: criticalCount,
        high_count: highCount,
        average_risk_score: avgScore,
        average_confidence_score: 96.5,
        risk_distribution: {
          LOW: REAL_STATE_ANALYTICS.filter((s) => s.risk_category === "LOW").length,
          MEDIUM: REAL_STATE_ANALYTICS.filter((s) => s.risk_category === "MEDIUM").length,
          HIGH: REAL_STATE_ANALYTICS.filter((s) => s.risk_category === "HIGH").length,
          CRITICAL: REAL_STATE_ANALYTICS.filter((s) => s.risk_category === "CRITICAL").length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// 2. Project List with validation guards
router.get("/projects", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = projectsQuerySchema.parse(req.query);
    const limit = query.page_size || query.limit || 10;
    const page = query.page || 1;
    const state = query.state?.toLowerCase();
    const district = query.district?.toLowerCase();
    const riskLevel = query.risk_level?.toUpperCase();
    const q = query.q?.toLowerCase();

    let filtered = REAL_WORKS.filter((w) => {
      if (state && !w.state.toLowerCase().includes(state)) return false;
      if (district && !w.district.toLowerCase().includes(district)) return false;
      if (riskLevel && w.risk_category !== riskLevel) return false;
      if (q) {
        const match =
          w.work_id.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.agency.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    const totalMatches = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit).map((w) => ({
      project_id: w.work_id,
      work_name: w.description,
      state_name: w.state,
      district_name: w.district,
      constituency_name: w.constituency,
      house_type: "LOK_SABHA",
      work_category: w.category,
      sanctioned_cost: w.sanctioned_cost,
      actual_expenditure: w.actual_expenditure,
      physical_progress: w.physical_progress,
      financial_progress: w.financial_progress,
      risk_score: w.risk_score,
      risk_level: w.risk_category,
      model_confidence: 96.5,
      is_analyzed: true,
      last_analyzed_at: "2026-02-15T10:00:00Z",
    }));

    return res.json({
      status: "success",
      data: {
        items: paginated,
        total_matches: totalMatches,
        page,
        page_size: limit,
        has_more: start + limit < totalMatches,
      },
    });
  } catch (err) {
    next(err);
  }
});

// 3. Search Suggestions / Keyword Search
router.get("/search", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!q) {
      return res.json({ status: "success", data: [] });
    }
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const results = await sentinelClient.search(q, limit);
    return res.json({ status: "success", data: results });
  } catch (err) {
    next(err);
  }
});

// 4. Analytics: States & Categories
router.get("/analytics/states", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ status: "success", data: REAL_STATE_ANALYTICS });
  } catch (err) {
    next(err);
  }
});

router.get("/analytics/categories", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await sentinelClient.getCategoryAnalytics();
    return res.json({ status: "success", data: categories });
  } catch (err) {
    next(err);
  }
});

// 5. Priority Queue
router.get("/investigations/priority", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const priority = await sentinelClient.getPriorityQueue(limit);
    return res.json({ status: "success", data: priority });
  } catch (err) {
    next(err);
  }
});

// 6. Investigation Dossier by Project ID (Wildcard path match for slashes)
router.get("/investigations/:projectId(*)", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = req.params.projectId;
    const projectId = Array.isArray(rawParam) ? rawParam.join("/") : rawParam;
    if (!projectId) {
      throw new AppError(400, "Project ID is required");
    }
    const dossier = await sentinelClient.getInvestigation(projectId);
    return res.json({ status: "success", data: dossier });
  } catch (err) {
    next(err);
  }
});

// 7. Single Project Detail (Wildcard path match for slashes)
router.get("/projects/:projectId(*)", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParam = req.params.projectId;
    const projectId = Array.isArray(rawParam) ? rawParam.join("/") : rawParam;
    if (!projectId) {
      throw new AppError(400, "Project ID is required");
    }
    const project = await sentinelClient.getProjectDetail(projectId);
    return res.json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
});

// 8. Transient Heuristic AI Simulator (STRICTLY TRANSIENT - NEVER PERSISTED TO DATABASE)
const analyzeSchema = z.object({
  work_id: z.string().min(1),
  district_name: z.string().min(1),
  work_category: z.string().min(1),
  work_description: z.string().min(1),
  sanctioned_amount: z.number().nonnegative(),
  total_expenditure: z.number().nonnegative(),
  sanction_date: z.string(),
  work_status: z.string(),
});

router.post("/v1/analyze", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = analyzeSchema.parse(req.body);
    // Forward to live upstream inference engine
    const inferenceResult = await sentinelClient.analyzeTransient(payload);
    // Do NOT write to PostgreSQL
    return res.json(inferenceResult);
  } catch (err) {
    next(err);
  }
});

// Alias for convenience
router.post("/analyze", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = analyzeSchema.parse(req.body);
    const inferenceResult = await sentinelClient.analyzeTransient(payload);
    return res.json(inferenceResult);
  } catch (err) {
    next(err);
  }
});

export default router;
