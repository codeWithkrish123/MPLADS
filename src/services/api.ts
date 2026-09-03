/**
 * MPLADS API Service Layer
 * This module handles all API communication with the backend
 * Replace API_BASE_URL with your actual backend endpoint
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
  CategoryAnalyticsRow,
  DashboardSummary,
  ProjectListItem,
  SearchSuggestion,
  StateAnalyticsRow,
} from "../types";

// Configure this with your backend endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// API Response wrapper for consistency
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public detail?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Helper function to make API requests
 * @param endpoint - The API endpoint path (e.g., "/api/projects")
 * @param options - RequestInit options (method, headers, body, etc.)
 * @returns Promise with the API response data
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Network error: ${error}`);
  }
}

// Export authApi and activityApi for compatibility
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; role: string }> => {
    return apiCall<{ token: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

export const activityApi = {
  log: async (action: string, data: any): Promise<any> => {
    return apiCall<any>("/activity/log", {
      method: "POST",
      body: JSON.stringify({ action, ...data }),
    });
  },
};

/**
 * State API endpoints
 */
export const stateApi = {
  getAll: async (): Promise<StateSummary[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<StateSummary[]>("/states");
    return [];
  },

  getById: async (stateCode: string): Promise<StateSummary | null> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<StateSummary>(`/states/${stateCode}`);
    return null;
  },
};

/**
 * District API endpoints
 */
export const districtApi = {
  getAll: async (): Promise<DistrictSummary[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<DistrictSummary[]>("/districts");
    return [];
  },

  getByState: async (stateName: string): Promise<DistrictSummary[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<DistrictSummary[]>(`/districts?state=${stateName}`);
    return [];
  },

  getById: async (districtId: string): Promise<DistrictSummary | null> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<DistrictSummary>(`/districts/${districtId}`);
    return null;
  },
};

/**
 * Work Record API endpoints
 */
export const workApi = {
  getAll: async (filters?: {
    state?: string;
    district?: string;
    category?: string;
  }): Promise<WorkRecord[]> => {
    // TODO: Replace with actual API call when backend is ready
    // const params = new URLSearchParams();
    // if (filters?.state) params.append("state", filters.state);
    // if (filters?.district) params.append("district", filters.district);
    // if (filters?.category) params.append("category", filters.category);
    // return apiCall<WorkRecord[]>(`/works?${params.toString()}`);
    return [];
  },

  getById: async (workId: string): Promise<WorkRecord | null> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<WorkRecord>(`/works/${workId}`);
    return null;
  },

  search: async (query: string): Promise<WorkRecord[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<WorkRecord[]>(`/works/search?q=${query}`);
    return [];
  },
};

/**
 * Alert API endpoints
 */
export const alertApi = {
  getAll: async (): Promise<RiskAlert[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<RiskAlert[]>("/alerts");
    return [];
  },

  getByStatus: async (status: string): Promise<RiskAlert[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<RiskAlert[]>(`/alerts?status=${status}`);
    return [];
  },

  create: async (alert: Partial<RiskAlert>): Promise<RiskAlert> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<RiskAlert>("/alerts", {
    //   method: "POST",
    //   body: JSON.stringify(alert),
    // });
    throw new Error("Create alert not yet implemented");
  },

  update: async (alertId: string, data: Partial<RiskAlert>): Promise<RiskAlert> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<RiskAlert>(`/alerts/${alertId}`, {
    //   method: "PATCH",
    //   body: JSON.stringify(data),
    // });
    throw new Error("Update alert not yet implemented");
  },
};

/**
 * Agency API endpoints
 */
export const agencyApi = {
  getAll: async (): Promise<ImplementingAgency[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<ImplementingAgency[]>("/agencies");
    return [];
  },

  getById: async (agencyId: string): Promise<ImplementingAgency | null> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<ImplementingAgency>(`/agencies/${agencyId}`);
    return null;
  },
};

/**
 * Compliance Rules API endpoints
 */
export const complianceApi = {
  getAll: async (): Promise<ComplianceRule[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<ComplianceRule[]>("/compliance/rules");
    return [];
  },

  getByCategory: async (category: string): Promise<ComplianceRule[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<ComplianceRule[]>(`/compliance/rules?category=${category}`);
    return [];
  },
};

/**
 * Audit Log API endpoints
 */
export const auditApi = {
  getAll: async (filters?: { user?: string; action?: string }): Promise<AuditLogEntry[]> => {
    // TODO: Replace with actual API call when backend is ready
    // const params = new URLSearchParams();
    // if (filters?.user) params.append("user", filters.user);
    // if (filters?.action) params.append("action", filters.action);
    // return apiCall<AuditLogEntry[]>(`/audit-logs?${params.toString()}`);
    return [];
  },

  getById: async (logId: string): Promise<AuditLogEntry | null> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<AuditLogEntry>(`/audit-logs/${logId}`);
    return null;
  },
};

/**
 * Duplicate Detection API endpoints
 */
export const duplicateApi = {
  getAll: async (): Promise<NearDuplicatePair[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<NearDuplicatePair[]>("/duplicates");
    return [];
  },

  getSuspicious: async (): Promise<NearDuplicatePair[]> => {
    // TODO: Replace with actual API call when backend is ready
    // return apiCall<NearDuplicatePair[]>("/duplicates/suspicious");
    return [];
  },
};

export const sentinelApi = {
  getDashboardSummary: () => apiCall<DashboardSummary>("/ml/dashboard/summary"),
  getStateAnalytics: () => apiCall<StateAnalyticsRow[]>("/analytics/states"),
  getCategoryAnalytics: () => apiCall<CategoryAnalyticsRow[]>("/analytics/categories"),
  getProjects: async (filters: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    const response = await apiCall<{
      total_matches?: number;
      data?: ProjectListItem[];
      items?: ProjectListItem[];
    }>(`/ml/projects?${params.toString()}`);
    return {
      total_matches: response.total_matches ?? 0,
      items: response.items ?? response.data ?? [],
    };
  },
  search: async (query: string, limit: number): Promise<SearchSuggestion[]> => {
    const response = await apiCall<SearchSuggestion[]>(`/ml/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response;
  },
};
