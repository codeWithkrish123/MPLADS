import { Router, Request, Response, NextFunction } from "express";
import { db } from "../services/db.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/agencies - List implementing agencies
router.get("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agencies = await db.getAgencies();
    return res.json({
      status: "success",
      data: agencies,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/agencies/:id
router.get("/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const agency = await db.getAgencyById(id);
    return res.json({
      status: "success",
      data: agency,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
