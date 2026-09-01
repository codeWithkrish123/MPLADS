import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public detail?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Invalid request payload or query parameters",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle Custom Application & Gateway Errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.code || "APP_ERROR",
      message: err.message,
      detail: err.detail,
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "An internal server error occurred",
  });
}
