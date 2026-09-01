import { Router, Request, Response, NextFunction } from "express";
import { db } from "../services/db.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/datasets/mps - List MP Allocations with filters and pagination
router.get("/mps", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { state, search, page = "1", limit = "100" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const result = await db.getMPs({
      state: state as string,
      search: search as string,
      page: pageNum,
      limit: limitNum,
    });

    return res.json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/datasets/calamities - List Disaster Relief Calamity Consents
router.get("/calamities", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calamities = await db.getCalamities();
    return res.json({
      status: "success",
      data: calamities,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
