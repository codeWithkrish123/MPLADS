/**
 * API Error Handler Utilities
 * 
 * Provides comprehensive error handling for frontend API calls
 * Maps API errors to user-friendly messages
 * Handles network errors, timeouts, and server errors
 * 
 * Location: src/utils/errorHandler.ts
 * Task: Phase 3.4 - Error Handling Utilities
 */

import { getErrorMessage, isRetryableError } from '../config/api';

// ============================================================================
// ERROR TYPES
// ============================================================================

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// ============================================================================
// ERROR CLASS
// ============================================================================

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly isRetryable: boolean;
  public readonly originalError?: Error;
  public readonly response?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    originalError?: Error,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.type = type;
    this.isRetryable = isRetryableError(statusCode);
    this.originalError = originalError;
    this.response = response;

    // Maintain prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ============================================================================
// ERROR PARSER
// ============================================================================

/**
 * Parse API error response and create ApiError instance
 */
export function parseApiError(error: any): ApiError {
  // Handle network/timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return new ApiError(
      'Request timeout - Please check your connection',
      408,
      ErrorType.TIMEOUT_ERROR,
      error
    );
  }

  // Handle network errors
  if (error.message?.includes('Network') || error.code === 'ENOTFOUND') {
    return new ApiError(
      'Network error - Please check your connection',
      0,
      ErrorType.NETWORK_ERROR,
      error
    );
  }

  // Handle axios response errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    const message = data?.message || data?.error || getErrorMessage(status);
    const type = getErrorType(status);

    return new ApiError(message, status, type, error, data);
  }

  // Handle request errors
  if (error.request && !error.response) {
    return new ApiError(
      'Network error - No response from server',
      0,
      ErrorType.NETWORK_ERROR,
      error
    );
  }

  // Handle other errors
  return new ApiError(
    error.message || 'An unexpected error occurred',
    500,
    ErrorType.UNKNOWN_ERROR,
    error
  );
}

/**
 * Determine error type from HTTP status code
 */
export function getErrorType(statusCode: number): ErrorType {
  if (statusCode >= 400 && statusCode < 500) {
    if (statusCode === 400) return ErrorType.VALIDATION_ERROR;
    if (statusCode === 401) return ErrorType.AUTHENTICATION_ERROR;
    if (statusCode === 403) return ErrorType.AUTHORIZATION_ERROR;
    if (statusCode === 404) return ErrorType.NOT_FOUND_ERROR;
    if (statusCode === 409) return ErrorType.CONFLICT_ERROR;
  }

  if (statusCode >= 500) {
    return ErrorType.SERVER_ERROR;
  }

  if (statusCode === 0) {
    return ErrorType.NETWORK_ERROR;
  }

  if (statusCode === 408) {
    return ErrorType.TIMEOUT_ERROR;
  }

  return ErrorType.UNKNOWN_ERROR;
}

// ============================================================================
// ERROR LOGGER
// ============================================================================

/**
 * Log error with context information
 */
export function logError(
  error: any,
  context?: {
    endpoint?: string;
    method?: string;
    userId?: string;
    sessionId?: string;
  }
): void {
  const apiError = error instanceof ApiError ? error : parseApiError(error);

  const logData = {
    timestamp: new Date().toISOString(),
    type: apiError.type,
    message: apiError.message,
    statusCode: apiError.statusCode,
    isRetryable: apiError.isRetryable,
    context,
    stack: apiError.stack
  };

  // Log to console based on error type
  if (apiError.type === ErrorType.AUTHENTICATION_ERROR || apiError.type === ErrorType.AUTHORIZATION_ERROR) {
    console.error('🔐 Authorization Error:', logData);
  } else if (apiError.type === ErrorType.NETWORK_ERROR) {
    console.warn('🌐 Network Error:', logData);
  } else if (apiError.type === ErrorType.SERVER_ERROR) {
    console.error('💥 Server Error:', logData);
  } else {
    console.error('❌ Error:', logData);
  }

  // In production, send to monitoring service
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', 'exception', {
      description: apiError.message,
      fatal: false,
      error_category: apiError.type
    });
  }
}

// ============================================================================
// ERROR MESSAGE BUILDERS
// ============================================================================

/**
 * Build user-friendly error message
 */
export function buildUserMessage(error: any): string {
  const apiError = error instanceof ApiError ? error : parseApiError(error);

  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK_ERROR]: 'Connection error. Please check your internet and try again.',
    [ErrorType.TIMEOUT_ERROR]: 'Request took too long. Please try again.',
    [ErrorType.VALIDATION_ERROR]: 'Invalid request. Please check your input and try again.',
    [ErrorType.AUTHENTICATION_ERROR]: 'Session expired. Please sign in again.',
    [ErrorType.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
    [ErrorType.NOT_FOUND_ERROR]: 'The requested resource was not found.',
    [ErrorType.CONFLICT_ERROR]: 'This action conflicts with existing data.',
    [ErrorType.SERVER_ERROR]: 'Server error. Please try again later.',
    [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
  };

  return messages[apiError.type] || apiError.message || 'An error occurred';
}

/**
 * Build detailed error report
 */
export function buildErrorReport(error: any): {
  userMessage: string;
  technicalMessage: string;
  suggestions: string[];
  isRetryable: boolean;
} {
  const apiError = error instanceof ApiError ? error : parseApiError(error);

  const suggestions: Record<ErrorType, string[]> = {
    [ErrorType.NETWORK_ERROR]: [
      'Check your internet connection',
      'Disable VPN if enabled',
      'Try accessing from a different network',
      'Check if the server is running'
    ],
    [ErrorType.TIMEOUT_ERROR]: [
      'Try the request again',
      'Reduce the amount of data being requested',
      'Check your internet speed',
      'Contact support if the issue persists'
    ],
    [ErrorType.VALIDATION_ERROR]: [
      'Check that all required fields are filled',
      'Verify data format is correct',
      'Try with different input values'
    ],
    [ErrorType.AUTHENTICATION_ERROR]: [
      'Sign in with your credentials',
      'Reset your password if forgotten',
      'Clear browser cache and try again'
    ],
    [ErrorType.AUTHORIZATION_ERROR]: [
      'Contact your administrator for access',
      'Check if you have the required role',
      'Try with a different account'
    ],
    [ErrorType.NOT_FOUND_ERROR]: [
      'Verify the resource ID is correct',
      'Try refreshing the page',
      'Search for the resource instead'
    ],
    [ErrorType.CONFLICT_ERROR]: [
      'Verify the data is unique',
      'Try with different values',
      'Check if the resource already exists'
    ],
    [ErrorType.SERVER_ERROR]: [
      'Try again in a few moments',
      'Contact support if the error persists',
      'Check the system status page'
    ],
    [ErrorType.UNKNOWN_ERROR]: [
      'Try the action again',
      'Refresh the page and try again',
      'Contact support if the issue persists'
    ]
  };

  return {
    userMessage: buildUserMessage(apiError),
    technicalMessage: apiError.message,
    suggestions: suggestions[apiError.type] || [],
    isRetryable: apiError.isRetryable
  };
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

/**
 * Should retry the request
 */
export function shouldRetry(
  error: any,
  attemptNumber: number,
  maxAttempts: number = 3
): boolean {
  const apiError = error instanceof ApiError ? error : parseApiError(error);

  // Don't retry if we've exceeded max attempts
  if (attemptNumber >= maxAttempts) {
    return false;
  }

  // Only retry on retryable errors
  return apiError.isRetryable;
}

/**
 * Calculate exponential backoff delay
 */
export function getBackoffDelay(attemptNumber: number, baseDelay: number = 100): number {
  // Exponential backoff: baseDelay * 2^attemptNumber
  const delay = baseDelay * Math.pow(2, attemptNumber);

  // Add jitter to prevent thundering herd
  const jitter = Math.random() * delay * 0.1;

  // Cap at 30 seconds
  return Math.min(delay + jitter, 30000);
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate API response has required fields
 */
export function validateResponse(response: any, requiredFields: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!response) {
    errors.push('Response is empty');
    return { valid: false, errors };
  }

  for (const field of requiredFields) {
    if (!(field in response)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ErrorHandler = {
  parseApiError,
  getErrorType,
  logError,
  buildUserMessage,
  buildErrorReport,
  shouldRetry,
  getBackoffDelay,
  validateResponse
};

export default ErrorHandler;
