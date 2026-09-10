/**
 * API Configuration
 * 
 * Centralized API configuration for development and production environments
 * Supports backend and frontend environment variables
 * 
 * Location: src/config/api.ts
 * Task: Phase 3.3 - API Configuration
 */

// ============================================================================
// API BASE URL CONFIGURATION
// ============================================================================

// Backend API URL - points to backend server worker
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api';

// Fallback for development
const API_BASE_URL = BACKEND_BASE_URL;

// ============================================================================
// ML API ENDPOINT PATHS
// ============================================================================

export const ML_API_ENDPOINTS = {
  // Monitoring endpoints
  MONITORING_COMMAND_CENTER: '/monitoring/command-center',
  MONITORING_ATTENTION_QUEUE: '/monitoring/attention-queue',
  MONITORING_EVENTS: '/monitoring/events',
  MONITORING_EVENTS_BULK: '/monitoring/events/bulk',
  MONITORING_SWEEP: '/monitoring/sweep',

  // Project intelligence endpoints
  PROJECT_SIGNALS: (projectId: string) => `/projects/${projectId}/signals`,
  PROJECT_ALERTS: (projectId: string) => `/projects/${projectId}/alerts`,
  PROJECT_INVESTIGATION: (projectId: string) => `/projects/${projectId}/investigation`,
  PROJECT_INVESTIGATION_ACTIONS: (projectId: string) => `/projects/${projectId}/investigation/actions`,
  PROJECT_INVESTIGATION_STATUS: (projectId: string) => `/projects/${projectId}/investigation/status`,

  // Analysis endpoints
  ANALYSIS_PROJECT: '/analysis/project',

  // Document endpoints
  PROJECT_DOCUMENTS: (projectId: string) => `/projects/${projectId}/documents`,
  PROJECT_EVIDENCE_FIELD: (projectId: string) => `/projects/${projectId}/evidence/field`,

  // Health endpoint
  HEALTH: '/ml/health'
};

// ============================================================================
// DEFAULT HEADERS
// ============================================================================

export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// ============================================================================
// ERROR HANDLING CONFIGURATION
// ============================================================================

export const ERROR_HANDLING_CONFIG = {
  // Timeout in milliseconds
  REQUEST_TIMEOUT: 10000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  
  // Retryable error codes
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  
  // Error message mappings
  ERROR_MESSAGES: {
    '400': 'Invalid request parameters',
    '401': 'Unauthorized - Please sign in',
    '403': 'Access forbidden',
    '404': 'Resource not found',
    '408': 'Request timeout',
    '429': 'Too many requests - Please wait',
    '500': 'Server error',
    '502': 'Bad gateway',
    '503': 'Service unavailable',
    '504': 'Gateway timeout'
  }
};

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const CACHE_CONFIG = {
  COMMAND_CENTER_TTL: 30000, // 30 seconds
  ATTENTION_QUEUE_TTL: 15000, // 15 seconds
  PROJECT_SIGNALS_TTL: 10000, // 10 seconds
  PROJECT_ALERTS_TTL: 15000, // 15 seconds
  PROJECT_INVESTIGATION_TTL: 20000, // 20 seconds
  ANALYSIS_TTL: 60000, // 60 seconds
  DOCUMENTS_TTL: 30000 // 30 seconds
};

// ============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATION
// ============================================================================

export const ENVIRONMENT_CONFIG = {
  // Development
  development: {
    API_BASE_URL: import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api',
    LOG_LEVEL: 'debug',
    ENABLE_MOCK_DATA: false,
    MOCK_API_DELAY: 0
  },

  // Production
  production: {
    API_BASE_URL: import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api',
    LOG_LEVEL: 'warn',
    ENABLE_MOCK_DATA: false,
    MOCK_API_DELAY: 0
  },

  // Staging
  staging: {
    API_BASE_URL: import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api',
    LOG_LEVEL: 'info',
    ENABLE_MOCK_DATA: false,
    MOCK_API_DELAY: 0
  }
};

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

const ENV = import.meta.env.MODE || 'development';
const ENV_CONFIG = ENVIRONMENT_CONFIG[ENV as keyof typeof ENVIRONMENT_CONFIG] || ENVIRONMENT_CONFIG.development;

// ============================================================================
// EXPORTED CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENV,
  ...ENV_CONFIG,
  
  // Headers
  DEFAULT_HEADERS,
  
  // Error handling
  ...ERROR_HANDLING_CONFIG,
  
  // Cache
  CACHE_CONFIG,
  
  // Endpoints
  ENDPOINTS: ML_API_ENDPOINTS,
  
  // Feature flags
  FEATURES: {
    ENABLE_REAL_TIME_UPDATES: true,
    ENABLE_CACHING: true,
    ENABLE_COMPRESSION: true,
    ENABLE_ANALYTICS: true
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get full API URL
 */
export function getApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) {
    return endpoint; // Return absolute URLs as-is
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * Get cache TTL for an endpoint
 */
export function getCacheTTL(endpoint: string): number {
  const mapping: Record<string, number> = {
    'command-center': CACHE_CONFIG.COMMAND_CENTER_TTL,
    'attention-queue': CACHE_CONFIG.ATTENTION_QUEUE_TTL,
    'signals': CACHE_CONFIG.PROJECT_SIGNALS_TTL,
    'alerts': CACHE_CONFIG.PROJECT_ALERTS_TTL,
    'investigation': CACHE_CONFIG.PROJECT_INVESTIGATION_TTL,
    'analysis': CACHE_CONFIG.ANALYSIS_TTL,
    'documents': CACHE_CONFIG.DOCUMENTS_TTL
  };

  for (const [key, ttl] of Object.entries(mapping)) {
    if (endpoint.includes(key)) {
      return ttl;
    }
  }

  return 30000; // Default 30 seconds
}

/**
 * Is error retryable
 */
export function isRetryableError(statusCode: number): boolean {
  return ERROR_HANDLING_CONFIG.RETRYABLE_STATUS_CODES.includes(statusCode);
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(statusCode: number, fallback?: string): string {
  const messages = ERROR_HANDLING_CONFIG.ERROR_MESSAGES as Record<string, string>;
  return messages[statusCode] ?? fallback ?? 'An error occurred. Please try again.';
}

// ============================================================================
// LOG CONFIGURATION
// ============================================================================

export const LOG_CONFIG = {
  LEVEL: ENV_CONFIG.LOG_LEVEL,

  LEVELS: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },

  shouldLog: (level: string): boolean => {
    const levelMap = LOG_CONFIG.LEVELS[level as keyof typeof LOG_CONFIG.LEVELS];
    const configLevel = LOG_CONFIG.LEVELS[LOG_CONFIG.LEVEL as keyof typeof LOG_CONFIG.LEVELS];
    return levelMap >= configLevel;
  }
};

export default API_CONFIG;
