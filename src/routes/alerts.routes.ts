import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "../services/db.service.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { AuditService } from "../services/audit.service.js";
import { AppError } from "../middleware/error.middleware.js";

const router = Router();

// GET /api/alerts - List alerts
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, severity, state } = req.query;
    const alerts = await db.getAlerts({
      status: status as string,
      severity: severity as string,
      state: state as string,
    });

    return res.json({
      status: "success",
      data: alerts,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/alerts - Create alert
const createAlertSchema = z.object({
  workId: z.string(),
  workName: z.string(),
  state: z.string(),
  district: z.string(),
  category: z.string(),
  severity: z.string(),
  riskScore: z.number(),
  anomalyType: z.string(),
  reason: z.string(),
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = createAlertSchema.parse(req.body);
    const newAlert = await db.createAlert({
      work_id: body.workId,
      work_name: body.workName,
      state: body.state,
      district: body.district,
      category: body.category,
      severity: body.severity,
      risk_score: body.riskScore,
      anomaly_type: body.anomalyType,
      reason: body.reason,
    });

    await AuditService.log({
      userId: req.user?.userId,
      userName: req.user?.fullName || "System",
      role: req.user?.role || "MINISTRY",
      action: "ALERT_CREATED",
      entity: "RiskAlert",
      entityId: newAlert.id,
      newValue: newAlert,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(201).json({
      status: "success",
      data: newAlert,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/alerts/:id - Update alert status
const updateAlertSchema = z.object({
  status: z.string().optional(),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
});

router.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const body = updateAlertSchema.parse(req.body);

    const updated = await db.updateAlert(id, {
      status: body.status,
      assigned_to_id: body.assignedToId,
      notes: body.notes,
    });

    if (!updated) {
      throw new AppError(404, "Alert not found", "NOT_FOUND");
    }

    await AuditService.log({
      userId: req.user?.userId,
      userName: req.user?.fullName || "Auditor",
      role: req.user?.role || "DISTRICT_AUTHORITY",
      action: `ALERT_STATUS_${body.status || "UPDATED"}`,
      entity: "RiskAlert",
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
