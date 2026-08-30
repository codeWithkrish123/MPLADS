/**
 * MPLADS API Service Layer
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

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

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
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw await parseError(response);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
    work_description: str(pick(rec, ["work_description", "description", "title"])),
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
    work_description: str(pick(rec, ["work_description", "description", "title"])),
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
  const recs = pick(rec, ["recommendations", "checks", "checklist"]);
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
    const page_size = query.page_size ?? 10;
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
          str(pick(rec, ["label", "work_description", "description", "title"])) || id,
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

export const stateApi = {
  getAll: async (): Promise<StateSummary[]> => [],
  getById: async (_stateCode: string): Promise<StateSummary | null> => null,
};

export const districtApi = {
  getAll: async (): Promise<DistrictSummary[]> => [],
  getByState: async (_stateName: string): Promise<DistrictSummary[]> => [],
  getById: async (_districtId: string): Promise<DistrictSummary | null> => null,
};

export const workApi = {
  getAll: async (_filters?: { state?: string; district?: string; category?: string }): Promise<WorkRecord[]> => [],
  getById: async (_workId: string): Promise<WorkRecord | null> => null,
  search: async (_query: string): Promise<WorkRecord[]> => [],
};

export const alertApi = {
  getAll: async (): Promise<RiskAlert[]> => [],
  getByStatus: async (_status: string): Promise<RiskAlert[]> => [],
  create: async (_alert: Partial<RiskAlert>): Promise<RiskAlert> => {
    throw new Error("Create alert not yet implemented");
  },
  update: async (_alertId: string, _data: Partial<RiskAlert>): Promise<RiskAlert> => {
    throw new Error("Update alert not yet implemented");
  },
};

export const agencyApi = {
  getAll: async (): Promise<ImplementingAgency[]> => [],
  getById: async (_agencyId: string): Promise<ImplementingAgency | null> => null,
};

export const complianceApi = {
  getAll: async (): Promise<ComplianceRule[]> => [],
  getByCategory: async (_category: string): Promise<ComplianceRule[]> => [],
};

export const auditApi = {
  getAll: async (_filters?: { user?: string; action?: string }): Promise<AuditLogEntry[]> => [],
  getById: async (_logId: string): Promise<AuditLogEntry | null> => null,
};

export const duplicateApi = {
  getAll: async (): Promise<NearDuplicatePair[]> => [],
  getSuspicious: async (): Promise<NearDuplicatePair[]> => [],
};
