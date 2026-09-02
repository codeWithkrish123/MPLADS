/**
 * MPLADS API Service Layer
 * Connects to the Node.js + PostgreSQL API Gateway (Port 5000)
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
  DashboardSummary,
  StateAnalyticsRow,
  CategoryAnalyticsRow,
  ProjectListQuery,
  ProjectListResponse,
  ProjectListItem,
  SearchSuggestion,
  ProjectDetail,
  InvestigationDossier,
  InvestigationCheck,
  AnalyzePayload,
  AnalyzeResult,
  RiskFactor,
} from "../types";

export const DIRECT_ML_URL = "https://sih-2026-23oy.onrender.com/api";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && window.location.hostname !== "20.20.6.200"
    ? DIRECT_ML_URL
    : typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : "http://localhost:5000/api");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public detail?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isInsufficientData(): boolean {
    if (this.status !== 422) return false;
    const blob = JSON.stringify(this.detail ?? this.code ?? this.message).toUpperCase();
    return blob.includes("INSUFFICIENT_ANALYTICAL_DATA") || this.code === "INSUFFICIENT_ANALYTICAL_DATA";
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function num(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function str(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const s = String(value).trim();
  return s.length ? s : undefined;
}

function pick(obj: Record<string, unknown> | null, keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function unwrapData(payload: unknown): unknown {
  const rec = asRecord(payload);
  if (rec && rec.data !== undefined && (Array.isArray(rec.data) || typeof rec.data === "object")) {
    return rec.data;
  }
  return payload;
}

async function parseError(response: Response): Promise<ApiError> {
  let body: unknown = undefined;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }
  const rec = asRecord(body);
  const detail = rec?.detail ?? rec?.error ?? rec?.message ?? body;
  const detailRec = asRecord(detail);
  const code =
    str(rec?.code) ||
    str(detailRec?.code) ||
    str(detailRec?.error_code) ||
    (typeof detail === "string" && detail.includes("INSUFFICIENT_ANALYTICAL_DATA")
      ? "INSUFFICIENT_ANALYTICAL_DATA"
      : undefined);
  const message =
    str(detailRec?.message) ||
    (typeof detail === "string" ? detail : undefined) ||
    str(rec?.message) ||
    `API Error: ${response.status} ${response.statusText}`;
  return new ApiError(response.status, message, code, detail ?? body);
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${cleanEndpoint}`;

  const executeFetch = async (targetUrl: string) => {
    const token = localStorage.getItem("mplads_auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(targetUrl, {
      ...options,
      headers,
    });
    if (!response.ok) {
      throw await parseError(response);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  };

  try {
    return await executeFetch(url);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Fallback: If gateway is unreachable, try direct live Render ML API
    if (API_BASE_URL !== DIRECT_ML_URL) {
      try {
        return await executeFetch(`${DIRECT_ML_URL}${cleanEndpoint}`);
      } catch (fallbackError) {
        if (fallbackError instanceof ApiError) throw fallbackError;
      }
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "ALL") return;
    sp.append(key, String(value));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export function encodeProjectId(rawProjectId: string): string {
  return encodeURIComponent(rawProjectId);
}

function toRiskDistribution(raw: unknown): Record<string, number> {
  const rec = asRecord(raw);
  if (rec) {
    const out: Record<string, number> = {};
    Object.entries(rec).forEach(([k, v]) => {
      const n = num(v);
      if (n !== undefined) out[String(k).toUpperCase()] = n;
    });
    if (Object.keys(out).length) return out;
  }
  if (Array.isArray(raw)) {
    const out: Record<string, number> = {};
    raw.forEach((item) => {
      const r = asRecord(item);
      const level = str(pick(r, ["level", "risk_level", "name", "category"])) || "UNKNOWN";
      const count = num(pick(r, ["count", "value", "total"])) ?? 0;
      out[level.toUpperCase()] = count;
    });
    return out;
  }
  return {};
}

function normalizeSummary(payload: unknown): DashboardSummary {
  const rec = asRecord(unwrapData(payload)) || {};
  return {
    total_analyzed: num(pick(rec, ["total_analyzed", "totalAnalyzed", "total"])) ?? 0,
    critical_count: num(pick(rec, ["critical_count", "criticalCount", "critical"])) ?? 0,
    high_count: num(pick(rec, ["high_count", "highCount", "high"])) ?? 0,
    average_risk_score: num(pick(rec, ["average_risk_score", "avg_risk_score", "averageRiskScore"])) ?? 0,
    average_confidence_score:
      num(pick(rec, ["average_confidence_score", "avg_confidence_score", "averageConfidenceScore"])) ?? 0,
    risk_distribution: toRiskDistribution(pick(rec, ["risk_distribution", "riskDistribution", "distribution"])),
  };
}

function normalizeStateRow(item: unknown): StateAnalyticsRow {
  const rec = asRecord(item) || {};
  return {
    state_name: str(pick(rec, ["state_name", "state", "name"])) || "Unknown",
    project_count: num(pick(rec, ["project_count", "projects", "count", "total"])) ?? 0,
    average_risk_score: num(pick(rec, ["average_risk_score", "avg_risk_score", "averageRiskScore"])) ?? 0,
    high_risk_count: num(pick(rec, ["high_risk_count", "highRiskCount", "high_count"])) ?? 0,
  };
}

function normalizeCategoryRow(item: unknown): CategoryAnalyticsRow {
  const rec = asRecord(item) || {};
  return {
    category_name: str(pick(rec, ["category_name", "work_category", "category", "name"])) || "Unknown",
    project_count: num(pick(rec, ["project_count", "projects", "count", "total"])) ?? 0,
    average_risk_score: num(pick(rec, ["average_risk_score", "avg_risk_score", "averageRiskScore"])) ?? 0,
    critical_count: num(pick(rec, ["critical_count", "criticalCount", "critical"])) ?? 0,
  };
}

function asList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  const rec = asRecord(unwrapData(payload));
  const list = pick(rec, ["items", "results", "states", "categories", "projects", "data", "suggestions"]);
  return Array.isArray(list) ? list : [];
}

function normalizeProjectItem(item: unknown): ProjectListItem {
  const rec = asRecord(item) || {};
  const id = str(pick(rec, ["project_id", "work_id", "id"])) || "";
  return {
    project_id: id,
    state: str(pick(rec, ["state", "state_name"])) || "—",
    district: str(pick(rec, ["district", "district_name"])) || "—",
    house: str(pick(rec, ["house", "house_type"])),
    work_category: str(pick(rec, ["work_category", "category", "category_name"])) || "—",
    sanctioned_amount: num(pick(rec, ["sanctioned_amount", "sanctioned_cost", "sanctioned"])),
    total_expenditure: num(pick(rec, ["total_expenditure", "actual_expenditure", "expenditure"])),
    risk_score: (() => {
      const v = pick(rec, ["risk_score", "composite_risk_score"]);
      return v === null ? null : num(v);
    })(),
    risk_level: str(pick(rec, ["risk_level", "risk_category"])) || null,
    project_status: str(pick(rec, ["project_status", "work_status", "status"])),
    work_description: str(pick(rec, ["work_description", "project_name", "description", "title"])),
  };
}

function normalizeProjectList(payload: unknown, fallbackPage: number, fallbackSize: number): ProjectListResponse {
  const rec = asRecord(payload);
  const data = asRecord(unwrapData(payload));
  const itemsRaw = asList(payload);
  const total =
    num(pick(rec, ["total_matches", "total", "count", "total_count"])) ??
    num(pick(data, ["total_matches", "total", "count", "total_count"])) ??
    itemsRaw.length;
  return {
    items: itemsRaw.map(normalizeProjectItem),
    total_matches: total ?? 0,
    page: num(pick(rec, ["page"])) ?? num(pick(data, ["page"])) ?? fallbackPage,
    page_size: num(pick(rec, ["page_size", "pageSize", "limit"])) ?? num(pick(data, ["page_size"])) ?? fallbackSize,
  };
}

function normalizeFactors(raw: unknown): RiskFactor[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const rec = asRecord(item) || {};
    return {
      type: str(pick(rec, ["type", "code", "factor", "name"])) || "INDICATOR",
      score: num(pick(rec, ["score", "points", "value"])),
      reason: str(pick(rec, ["reason", "explanation", "description"])),
    };
  });
}

function normalizeCoords(rec: Record<string, unknown> | null): { lat?: number; lng?: number } {
  const viz = asRecord(pick(rec, ["mock_visualization", "visualization", "location", "geo"]));
  const lat = num(pick(viz, ["lat", "latitude"])) ?? num(pick(rec, ["lat", "latitude"]));
  const lng = num(pick(viz, ["lng", "longitude", "lon"])) ?? num(pick(rec, ["lng", "longitude", "lon"]));
  return { lat, lng };
}

function normalizeProjectDetail(payload: unknown, fallbackId: string): ProjectDetail {
  const rec = asRecord(unwrapData(payload)) || asRecord(payload) || {};
  const coords = normalizeCoords(rec);
  const viz = asRecord(pick(rec, ["mock_visualization"]));
  const reserved = new Set([
    "project_id", "work_id", "id", "state", "district", "house", "work_category", "category",
    "sanctioned_amount", "total_expenditure", "risk_score", "risk_level", "project_status",
    "work_status", "status", "mock_visualization", "factors", "lat", "lng", "metadata",
  ]);
  const metadata: Record<string, unknown> = { ...(asRecord(rec.metadata) || {}) };
  Object.entries(rec).forEach(([k, v]) => {
    if (!reserved.has(k) && typeof v !== "object") metadata[k] = v;
  });
  return {
    project_id: str(pick(rec, ["project_id", "work_id", "id"])) || fallbackId,
    state: str(pick(rec, ["state", "state_name"])) || "—",
    district: str(pick(rec, ["district", "district_name"])) || "—",
    house: str(pick(rec, ["house", "house_type"])),
    work_category: str(pick(rec, ["work_category", "category"])) || "—",
    work_description: str(pick(rec, ["work_description", "project_name", "description", "title"])),
    sanctioned_amount: num(pick(rec, ["sanctioned_amount", "sanctioned_cost"])),
    total_expenditure: num(pick(rec, ["total_expenditure", "actual_expenditure"])),
    risk_score: (() => {
      const v = pick(rec, ["risk_score", "composite_risk_score"]);
      return v === null ? null : num(v);
    })(),
    risk_level: str(pick(rec, ["risk_level", "risk_category"])) || null,
    project_status: str(pick(rec, ["project_status", "work_status", "status"])),
    work_status: str(pick(rec, ["work_status", "status"])),
    mp_name: str(pick(rec, ["mp_name", "mp"])),
    sanction_date: str(pick(rec, ["sanction_date", "start_date"])),
    metadata,
    factors: normalizeFactors(pick(rec, ["factors", "risk_factors", "indicators"])),
    mock_visualization: viz
      ? { lat: num(viz.lat) ?? coords.lat, lng: num(viz.lng) ?? coords.lng }
      : coords,
    lat: coords.lat,
    lng: coords.lng,
    data_sufficient: true,
  };
}

function normalizeInvestigation(payload: unknown, projectId: string): InvestigationDossier {
  const rec = asRecord(unwrapData(payload)) || asRecord(payload) || {};
  const recs = pick(rec, ["recommendations", "recommended_checks", "checks", "checklist"]);
  const limits = pick(rec, ["data_limitations", "limitations", "warnings"]);
  const recommendations: InvestigationCheck[] = Array.isArray(recs)
    ? recs.map((item) => {
        if (typeof item === "string") return { check_type: "Review", action: item };
        const r = asRecord(item) || {};
        return {
          check_type: str(pick(r, ["check_type", "type", "title"])) || "Review",
          action: str(pick(r, ["action", "description", "text"])) || "Requires validation",
        };
      })
    : [];
  const data_limitations: string[] = Array.isArray(limits)
    ? limits.map((item) => (typeof item === "string" ? item : str(asRecord(item)?.message) || JSON.stringify(item)))
    : [];
  return { project_id: projectId, recommendations, data_limitations };
}

function normalizeAnalyze(payload: unknown): AnalyzeResult {
  const rec = asRecord(unwrapData(payload)) || asRecord(payload) || {};
  const scoreRaw = pick(rec, ["composite_risk_score", "risk_score"]);
  return {
    composite_risk_score: scoreRaw === null ? null : num(scoreRaw) ?? null,
    risk_level: str(pick(rec, ["risk_level", "risk_category"])) || null,
    factors: normalizeFactors(pick(rec, ["factors", "risk_factors"])),
  };
}

export const sentinelApi = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const data = await apiCall<unknown>("/dashboard/summary");
    return normalizeSummary(data);
  },

  getStateAnalytics: async (): Promise<StateAnalyticsRow[]> => {
    const data = await apiCall<unknown>("/analytics/states");
    return asList(data).map(normalizeStateRow);
  },

  getCategoryAnalytics: async (): Promise<CategoryAnalyticsRow[]> => {
    const data = await apiCall<unknown>("/analytics/categories");
    return asList(data).map(normalizeCategoryRow);
  },

  getProjects: async (query: ProjectListQuery = {}): Promise<ProjectListResponse> => {
    const page = query.page ?? 1;
    const page_size = query.page_size ?? 100;
    const qs = buildQuery({
      q: query.q,
      state: query.state,
      district: query.district,
      house: query.house,
      risk_level: query.risk_level,
      work_category: query.work_category,
      min_risk: query.min_risk,
      max_risk: query.max_risk,
      sort_by: query.sort_by,
      sort_order: query.sort_order,
      page,
      page_size,
    });
    const data = await apiCall<unknown>(`/projects${qs}`);
    return normalizeProjectList(data, page, page_size);
  },

  search: async (q: string, limit = 8): Promise<SearchSuggestion[]> => {
    if (!q.trim()) return [];
    const data = await apiCall<unknown>(`/search${buildQuery({ q: q.trim(), limit })}`);
    return asList(data).map((item) => {
      const rec = asRecord(item) || {};
      const id = str(pick(rec, ["project_id", "work_id", "id"])) || "";
      return {
        project_id: id,
        label:
          str(pick(rec, ["label", "work_description", "project_name", "description", "title"])) || id,
        state: str(pick(rec, ["state"])),
        district: str(pick(rec, ["district"])),
      };
    });
  },

  getProject: async (rawProjectId: string): Promise<ProjectDetail> => {
    const encodedId = encodeURIComponent(rawProjectId);
    const data = await apiCall<unknown>(`/projects/${encodedId}`);
    return normalizeProjectDetail(data, rawProjectId);
  },

  getInvestigation: async (rawProjectId: string): Promise<InvestigationDossier> => {
    const encodedId = encodeURIComponent(rawProjectId);
    const data = await apiCall<unknown>(`/investigations/${encodedId}`);
    return normalizeInvestigation(data, rawProjectId);
  },

  analyzePreview: async (payload: AnalyzePayload): Promise<AnalyzeResult> => {
    const data = await apiCall<unknown>("/v1/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return normalizeAnalyze(data);
  },
};

export const alertApi = {
  getAll: async (filters?: { status?: string; severity?: string; state?: string }): Promise<RiskAlert[]> => {
    const qs = buildQuery(filters || {});
    const data = await apiCall<unknown>(`/alerts${qs}`);
    return (asList(data) as any[]).map((a) => ({
      id: a.id,
      severity: a.severity,
      work_id: a.workId || a.work_id,
      work_name: a.workName || a.work_name,
      state: a.state,
      district: a.district,
      category: a.category,
      reason: a.reason,
      detected_at: a.detectedAt || a.detected_at,
      confidence: 0.95,
      status: a.status,
      assigned_to: a.assignedTo?.fullName || a.assignedTo?.email,
      risk_score: Number(a.riskScore || a.risk_score || 0),
      anomaly_type: a.anomalyType || a.anomaly_type,
    }));
  },
  getByStatus: async (status: string): Promise<RiskAlert[]> => {
    return alertApi.getAll({ status });
  },
  create: async (alert: Partial<RiskAlert>): Promise<RiskAlert> => {
    return apiCall<RiskAlert>("/alerts", {
      method: "POST",
      body: JSON.stringify({
        workId: alert.work_id,
        workName: alert.work_name,
        state: alert.state,
        district: alert.district,
        category: alert.category,
        severity: alert.severity,
        riskScore: alert.risk_score,
        anomalyType: alert.anomaly_type,
        reason: alert.reason,
      }),
    });
  },
  update: async (alertId: string, data: Partial<RiskAlert>): Promise<RiskAlert> => {
    return apiCall<RiskAlert>(`/alerts/${alertId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: data.status,
      }),
    });
  },
};

export const duplicateApi = {
  getAll: async (): Promise<NearDuplicatePair[]> => {
    const data = await apiCall<unknown>("/duplicates");
    return (asList(data) as any[]).map((d) => ({
      id: d.id,
      work_a: {
        id: d.workAId || d.work_a_id,
        name: d.workAName || d.work_a_name,
        location: `${d.district || ""}, ${d.state || ""}`,
        cost: 0,
        agency: "PWD",
        sanction_date: "2024-09-11",
        category: "Infrastructure",
      },
      work_b: {
        id: d.workBId || d.work_b_id,
        name: d.workBName || d.work_b_name,
        location: `${d.district || ""}, ${d.state || ""}`,
        cost: 0,
        agency: "PWD",
        sanction_date: "2024-09-11",
        category: "Infrastructure",
      },
      overall_similarity: Number(d.similarityScore || d.similarity_score || 0),
      breakdown: {
        text_similarity: Number(d.similarityScore || 0),
        location_similarity: 90,
        cost_similarity: 85,
        category_similarity: 100,
      },
      status: d.status,
      geo_distance_meters: Number(d.geoDistanceMeters || 100),
      ai_notes: d.reviewNotes || "Similar work detected in the same administrative area.",
    }));
  },
  resolve: async (id: string, status: string, notes?: string) => {
    return apiCall(`/duplicates/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, reviewNotes: notes }),
    });
  },
};

export const complianceApi = {
  getAll: async (): Promise<ComplianceRule[]> => {
    const data = await apiCall<unknown>("/compliance/rules");
    return (asList(data) as any[]).map((r) => ({
      rule_id: r.ruleId || r.rule_id,
      title: r.title,
      category: r.category,
      affected_works: r.affectedWorksCount || r.affected_works_count || 0,
      severity: r.severity,
      status: r.status,
      policy_version: r.policyVersion || r.policy_version,
      effective_date: r.effectiveDate || r.effective_date,
      source_document: r.sourceDocument || r.source_document,
      policy_statement: r.policyStatement || r.policy_statement,
      threshold_description: r.thresholdDescription || r.threshold_description,
      detection_logic: r.detectionLogic || r.detection_logic,
    }));
  },
};

export const agencyApi = {
  getAll: async (): Promise<ImplementingAgency[]> => {
    const data = await apiCall<unknown>("/agencies");
    return (asList(data) as any[]).map((a) => ({
      id: a.id,
      name: a.name,
      short_name: a.shortName || a.short_name,
      type: a.type,
      total_works: a.totalWorks || a.total_works,
      completed_works: a.completedWorks || a.completed_works,
      delayed_works: a.delayedWorks || a.delayed_works,
      high_risk_works: a.highRiskWorks || a.high_risk_works,
      avg_completion_rate: 65,
      avg_risk_score: Number(a.avgRiskScore || a.avg_risk_score || 0),
      avg_cost_overrun_pct: 12.5,
      risk_category: a.riskCategory || a.risk_category,
      active_expenditure_cr: Number(a.activeExpenditureCr || a.active_expenditure_cr || 0),
      monthly_trend: [],
    }));
  },
};

export const auditApi = {
  getAll: async (filters?: { user?: string; action?: string }): Promise<AuditLogEntry[]> => {
    const qs = buildQuery(filters || {});
    const data = await apiCall<unknown>(`/audit-logs${qs}`);
    return (asList(data) as any[]).map((l) => ({
      id: l.id,
      timestamp: l.timestamp,
      user: l.userName || l.user_name,
      role: l.role,
      action: l.action,
      entity: l.entity,
      entity_id: l.entityId || l.entity_id,
      old_value: JSON.stringify(l.oldValue || l.old_value || {}),
      new_value: JSON.stringify(l.newValue || l.new_value || {}),
      ip_device: l.ipAddress || l.ip_address || "127.0.0.1",
      status: l.status,
      hash_signature: l.hashSignature || l.hash_signature,
    }));
  },
  verifyChain: async () => {
    return apiCall<{ valid: boolean; verifiedCount: number; brokenAtId?: string }>("/audit-logs/verify");
  },
};

export const datasetApi = {
  getMps: async (params?: { page?: number; limit?: number; state?: string; search?: string }) => {
    const qs = buildQuery(params || {});
    return apiCall<{ items: any[]; total: number; page: number; pageSize: number }>(`/datasets/mps${qs}`);
  },
  getCalamities: async () => {
    return apiCall<any[]>("/datasets/calamities");
  },
};

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  state?: string | null;
  district?: string | null;
  constituency?: string | null;
}

export const authApi = {
  login: async (email: string, password?: string, role?: string): Promise<{ token: string; user: AuthUser }> => {
    const res = await apiCall<{ status: string; data: { token: string; user: AuthUser } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
    const { token, user } = res.data;
    localStorage.setItem("mplads_auth_token", token);
    localStorage.setItem("mplads_user", JSON.stringify(user));
    return { token, user };
  },
  getCurrentUser: (): AuthUser | null => {
    try {
      const stored = localStorage.getItem("mplads_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem("mplads_auth_token");
    localStorage.removeItem("mplads_user");
    localStorage.removeItem("mplads_role");
  },
  getMe: async (): Promise<AuthUser> => {
    const res = await apiCall<{ status: string; data: { user: AuthUser } }>("/auth/me");
    return res.data.user;
  },
};
