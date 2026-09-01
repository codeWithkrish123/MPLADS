import { Router, Request, Response, NextFunction } from "express";
import { db } from "../services/db.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/compliance/rules
router.get("/rules", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await db.getComplianceRules();
    return res.json({
      status: "success",
      data: rules,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
