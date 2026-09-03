import { Response } from 'express';

/**
 * Centralized Error Response Formatter
 * Follows OpenAPI 422 Validation Error format
 */

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface ErrorResponse {
  status: number;
  detail: ValidationErrorDetail[] | string;
  timestamp?: string;
  path?: string;
}

/**
 * Format validation errors in OpenAPI style
 */
export function formatValidationError(
  errors: Array<{ path: string; message: string }>
): ValidationErrorDetail[] {
  return errors.map((err) => ({
    loc: err.path.split('.'),
    msg: err.message,
    type: 'validation_error',
  }));
}

/**
 * Send error response with proper formatting
 */
export function sendError(
  res: Response,
  statusCode: number,
  message: string | ValidationErrorDetail[],
  details?: { path?: string; timestamp?: string }
): Response {
  const errorResponse: ErrorResponse = {
    status: statusCode,
    detail: message,
    timestamp: details?.timestamp || new Date().toISOString(),
    path: details?.path,
  };

  return res.status(statusCode).json(errorResponse);
}

/**
 * Send 422 Validation Error (request validation failed)
 */
export function sendValidationError(
  res: Response,
  errors: Array<{ path: string; message: string }>,
  details?: { path?: string }
): Response {
  return sendError(res, 422, formatValidationError(errors), details);
}

/**
 * Send 400 Bad Request
 */
export function sendBadRequest(
  res: Response,
  message: string,
  details?: { path?: string }
): Response {
  return sendError(res, 400, message, details);
}

/**
 * Send 404 Not Found
 */
export function sendNotFound(
  res: Response,
  resource: string,
  details?: { path?: string }
): Response {
  return sendError(res, 404, `${resource} not found`, details);
}

/**
 * Send 500 Internal Server Error
 */
export function sendInternalError(
  res: Response,
  error: Error | string,
  details?: { path?: string }
): Response {
  const message = typeof error === 'string' ? error : error.message;
  console.error('Internal Server Error:', error);
  return sendError(res, 500, message, details);
}

/**
 * Send 429 Too Many Requests
 */
export function sendRateLimitError(
  res: Response,
  retryAfter?: number,
  details?: { path?: string }
): Response {
  const response = sendError(res, 429, 'Too many requests', details);
  if (retryAfter) {
    response.set('Retry-After', retryAfter.toString());
  }
  return response;
}

/**
 * Middleware to catch all errors
 */
export function errorMiddleware(
  err: Error,
  req: any,
  res: Response,
  next: any
) {
  console.error('Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (res.headersSent) {
    return next(err);
  }

  sendInternalError(res, err, { path: req.path });
}
