import { Request, Response, NextFunction } from "express";
import { AuthService, TokenPayload } from "../services/auth.service.js";
import { AppError } from "./error.middleware.js";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For local dev convenience, allow guest/demo fallback if not provided
    req.user = {
      userId: "demo-user-id",
      email: "demo@mplads.gov.in",
      role: "MINISTRY",
      fullName: "National Administrator",
    };
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return next(err);
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required", "UNAUTHORIZED"));
    }

    const userRole = req.user.role.toUpperCase();
    const hasRole = allowedRoles.map((r) => r.toUpperCase()).includes(userRole) || userRole === "MINISTRY";

    if (!hasRole) {
      return next(new AppError(403, "Insufficient permissions for this action", "FORBIDDEN"));
    }

    return next();
  };
}
