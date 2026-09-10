/**
 * MPLADS API Service Layer - Enhanced with JWT & Error Handling
 * 
 * Features:
 * - JWT authentication interceptor
 * - Automatic retry logic (3 attempts)
 * - Detailed error handling
 * - Request logging
 * - Response validation
 */

import {
  WorkRecord,
  NearDuplicatePair,
  RiskAlert,
  DistrictSummary,
  StateSummary,
  ImplementingAgency,
  ComplianceRule,
  AuditLogEntry,
} from "../types";

// Configure API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_API_URL || "https://mplads-backend-gateway.aditya93193.workers.dev/api";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

// ==================== TYPES ====================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

// ==================== ERROR HANDLING ====================

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  isNetworkError(): boolean {
    return this.status === 0 || this.message.includes("Network");
  }
}

// ==================== CORE API FUNCTION ====================

/**
 * Make an API request with retry logic and error handling
 * @param endpoint API endpoint (e.g., "/projects")
 * @param options Request options
 * @returns Promise<T> Parsed response data
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<T> {
  const {
    timeout = 30000,
    retries = MAX_RETRIES,
    skipAuth = false,
    ...fetchOptions
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  // Build headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  // Add JWT token if available and not skipped
  if (!skipAuth) {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: ApiError | null = null;
  let attempt = 0;

  while (attempt < retries) {
    try {
      attempt++;
      console.log(`[API] Attempt ${attempt}/${retries} - ${options.method || "GET"} ${endpoint}`);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new ApiError(
          response.status,
          errorData.error || response.statusText || "Unknown error",
          errorData
        );

        // Handle auth errors - redirect to login
        if (error.isAuthError()) {
          console.warn("[API] Authentication error - redirecting to login");
          localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token");
          localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY || "auth_user");
          window.location.href = "/login";
        }

        throw error;
      }

      // Parse and return response
      const data = (await response.json()) as T;
      console.log(`✓ [${response.status}] ${options.method || "GET"} ${endpoint}`);
      return data;
    } catch (error) {
      lastError = error as ApiError;

      // Check if it's actually an ApiError with the method
      const isRetryable =
        (lastError && typeof lastError.isNetworkError === 'function' && lastError.isNetworkError()) ||
        (lastError && typeof lastError.isServerError === 'function' && lastError.isServerError() && lastError.status !== 503);

      if (!isRetryable || attempt >= retries) {
        clearTimeout(timeoutId);
        console.error(`✗ [${lastError?.status || 'unknown'}] ${options.method || "GET"} ${endpoint}`, lastError?.message || error);
        throw lastError;
      }

      // Wait before retry
      const delay = RETRY_DELAY * attempt;
      console.log(`[API] Retry in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  clearTimeout(timeoutId);
  throw lastError || new ApiError(500, "Unknown error occurred");
}

// ==================== AUTHENTICATION ====================

export const authApi = {
  login: async (email: string, password: string, role: string) => {
    // Ensure role is lowercase (backend expects lowercase)
    const normalizedRole = role.toLowerCase();
    
    console.log(`[API] Login request:`, { email, role: normalizedRole });
    
    const response = await apiCall<{
      token: string;
      user: { id: string; email: string; role: string; name?: string };
    }>("/auth/login-with-role", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password, role: normalizedRole }),
    });

    // Note: Token storage is handled in AuthContext.login() to avoid duplication
    // This ensures consistent state management through React Context

    return response;
  },

  logout: async () => {
    try {
      await apiCall("/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token");
      localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY || "auth_user");
    }
  },

  getProfile: async () => {
    return apiCall("/auth/profile");
  },

  refreshToken: async () => {
    const response = await apiCall<{ token: string }>("/auth/refresh-token", {
      method: "POST",
    });

    localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token", response.token);
    return response.token;
  },
};

// ==================== DATA ENDPOINTS ====================

export const projectApi = {
  getAll: async (filters?: {
    state?: string;
    district?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.state) params.append("state", filters.state);
    if (filters?.district) params.append("district", filters.district);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const res = await apiCall<{
      data?: WorkRecord[];
      projects?: WorkRecord[];
      total?: number;
      page?: number;
      limit?: number;
    }>(`/data/projects?${params.toString()}`);

    const projectsList = res.data || res.projects || [];
    return {
      data: projectsList,
      projects: projectsList,
      total: res.total || projectsList.length,
      page: res.page || 1,
      limit: res.limit || 50,
    };
  },

  getById: async (projectId: string) => {
    return apiCall<WorkRecord>(`/data/projects/${projectId}`);
  },

  create: async (data: Partial<WorkRecord>) => {
    return apiCall<WorkRecord>("/data/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (projectId: string, data: Partial<WorkRecord>) => {
    return apiCall<WorkRecord>(`/data/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (projectId: string) => {
    return apiCall(`/data/projects/${projectId}`, { method: "DELETE" });
  },
};

// ==================== ANALYSIS ENDPOINTS ====================

export const analysisApi = {
  getDashboardSummary: async () => {
    return apiCall("/analysis/dashboard/summary");
  },

  analyzeProject: async (projectId: string) => {
    return apiCall("/analysis/project", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });
  },

  getProjectAnalysis: async (projectId: string) => {
    return apiCall(`/analysis/project/${projectId}`);
  },

  getRiskSignals: async (projectId: string) => {
    return apiCall(`/analysis/project/${projectId}/signals`);
  },

  getComplianceIssues: async (projectId: string) => {
    return apiCall(`/analysis/project/${projectId}/compliance`);
  },

  getPeerContext: async (projectId: string) => {
    return apiCall(`/analysis/project/${projectId}/peer-context`);
  },

  getRisks: async (filters?: { status?: string; severity?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.severity) params.append("severity", filters.severity);

    return apiCall<RiskAlert[]>(`/analysis/risks?${params.toString()}`);
  },
};

// ==================== ALERT ENDPOINTS ====================

export const alertApi = {
  getAll: async (filters?: { status?: string; severity?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.severity) params.append("severity", filters.severity);

    const res = await apiCall<any>(`/analysis/risks?${params.toString()}`);
    return Array.isArray(res) ? res : (res.data || res.alerts || res.risks || []);
  },

  getByProject: async (projectId: string) => {
    return apiCall<RiskAlert[]>(`/analysis/project/${projectId}/signals`);
  },

  acknowledge: async (alertId: string) => {
    return apiCall(`/analysis/risks/${alertId}/acknowledge`, {
      method: "PATCH",
    });
  },
};

// ==================== ML ENDPOINTS ====================

export const mlApi = {
  detectCostAnomalies: async () => {
    return apiCall("/ml/analysis/cost-anomaly", { method: "POST" });
  },

  getCostAnomalies: async () => {
    return apiCall("/ml/analysis/cost-anomaly");
  },

  detectDuplicates: async () => {
    return apiCall("/ml/analysis/duplicates", { method: "POST" });
  },

  getDuplicates: async () => {
    return apiCall<NearDuplicatePair[]>("/ml/analysis/duplicates");
  },

  predictDelays: async () => {
    return apiCall("/ml/analysis/delay-prediction", { method: "POST" });
  },

  getDelayPredictions: async () => {
    return apiCall("/ml/analysis/delay-prediction");
  },

  detectSignals: async (projectId: string) => {
    return apiCall("/ml/signals/detect", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });
  },

  getActiveSignals: async () => {
    return apiCall("/ml/signals/active");
  },

  getRecommendations: async (projectId: string) => {
    return apiCall(`/ml/recommendations/${projectId}`);
  },

  getInvestigationPriorities: async () => {
    return apiCall("/ml/investigations/priority");
  },
};

// ==================== AUDIT ENDPOINTS ====================

export const auditApi = {
  getLogs: async (filters?: { user?: string; action?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.user) params.append("user", filters.user);
    if (filters?.action) params.append("action", filters.action);
    if (filters?.limit) params.append("limit", String(filters.limit));

    return apiCall(`/audit/logs?${params.toString()}`);
  },

  getById: async (logId: string) => {
    return apiCall(`/audit/logs/${logId}`);
  },
};

// ==================== STATE & DISTRICT ENDPOINTS ====================

export const stateApi = {
  getAll: async () => {
    const res = await apiCall<any>("/data/states");
    return Array.isArray(res) ? res : (res.data || []);
  },

  getById: async (stateName: string) => {
    return apiCall<StateSummary>(`/data/states/${stateName}`);
  },
};

export const districtApi = {
  getByState: async (stateName: string) => {
    const res = await apiCall<any>(`/data/districts/${stateName}`);
    return Array.isArray(res) ? res : (res.data || []);
  },

  getById: async (stateName: string, districtName: string) => {
    return apiCall<DistrictSummary>(`/data/districts/${stateName}/${districtName}`);
  },
};

// ==================== SYSTEM ENDPOINTS ====================

export const systemApi = {
  getHealth: async () => {
    try {
      return await apiCall("/system/health", { skipAuth: true });
    } catch (error) {
      return { status: "error", message: "Backend unavailable" };
    }
  },

  getConfig: async () => {
    return apiCall("/system/config");
  },
};

// ==================== LEGACY ALIASES ====================

export const activityApi = {
  log: async (action: string, data: any) => {
    return apiCall("/activity/logs", {
      method: "POST",
      body: JSON.stringify({ action, ...data }),
    });
  },
};

export const duplicateApi = {
  getAll: async () => {
    return mlApi.getDuplicates();
  },

  getSuspicious: async () => {
    return mlApi.getDuplicates();
  },
};
