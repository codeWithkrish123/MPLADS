import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "../services/db.service.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { AuditService } from "../services/audit.service.js";
import { AppError } from "../middleware/error.middleware.js";

const router = Router();

// GET /api/duplicates - List near duplicate pairs
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const duplicates = await db.getDuplicates(status as string);

    return res.json({
      status: "success",
      data: duplicates,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/duplicates/:id - Review and resolve near duplicate pair
const resolveDuplicateSchema = z.object({
  status: z.string(),
  reviewNotes: z.string().optional(),
});

router.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const body = resolveDuplicateSchema.parse(req.body);

    const updated = await db.updateDuplicate(id, {
      status: body.status,
      review_notes: body.reviewNotes,
      reviewer_id: req.user?.userId,
    });

    if (!updated) {
      throw new AppError(404, "Duplicate record not found", "NOT_FOUND");
    }

    await AuditService.log({
      userId: req.user?.userId,
      userName: req.user?.fullName || "Auditor",
      role: req.user?.role || "MINISTRY",
      action: `DUPLICATE_RESOLVED_${body.status}`,
      entity: "NearDuplicateReview",
      entityId: id,
      newValue: updated,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
