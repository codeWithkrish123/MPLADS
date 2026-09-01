import { Router, Request, Response, NextFunction } from "express";
import { db } from "../services/db.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { AuditService } from "../services/audit.service.js";

const router = Router();

// GET /api/audit-logs - List audit log entries
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, entity, limit } = req.query;
    const logs = await db.getAuditLogs({
      action: action as string,
      entity: entity as string,
      limit: limit ? parseInt(limit as string, 10) : 100,
    });

    return res.json({
      status: "success",
      data: logs,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/audit-logs/verify - Cryptographic ledger verification
router.get("/verify", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const verification = await AuditService.verifyChain();
    return res.json({
      status: "success",
      data: verification,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
