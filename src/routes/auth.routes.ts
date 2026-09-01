import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  role: z.string().optional(),
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);
    const result = await AuthService.login(email, password, role);
    return res.json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

export default router;
