import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";

class SentinelClientService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.UPSTREAM_ML_URL.replace(/\/$/, ""),
      timeout: env.ML_READ_TIMEOUT_MS, // 5000ms timeout
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  private handleAxiosError(error: unknown, context: string): never {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>;
      const status = axiosErr.response?.status || 502;
      const data = axiosErr.response?.data;

      // Handle 404: Invalid / Not Found Project ID
      if (status === 404) {
        throw new AppError(404, `Project not found: ${context}`, "PROJECT_NOT_FOUND", data);
      }

      // Handle 422: INSUFFICIENT_ANALYTICAL_DATA (Excluded due to lifecycle chronological corruption)
      if (status === 422) {
        const detail = data?.detail || {};
        const isInsufficient =
          JSON.stringify(detail).toUpperCase().includes("INSUFFICIENT_ANALYTICAL_DATA") ||
          detail?.analysis_status === "INSUFFICIENT_ANALYTICAL_DATA";

        if (isInsufficient) {
          throw new AppError(
            422,
            detail?.data_limitation || "Project excluded from analysis due to chronological timeline contradictions or missing required dates.",
            "INSUFFICIENT_ANALYTICAL_DATA",
            detail
          );
        }

        throw new AppError(422, "Validation error in upstream ML Sentinel request", "UNPROCESSABLE_ENTITY", detail);
      }

      // Handle 502/503/504 Upstream failures
      if (status >= 500 || axiosErr.code === "ECONNABORTED") {
        throw new AppError(
          502,
          `ML Sentinel upstream service unavailable or timed out: ${axiosErr.message}`,
          "UPSTREAM_UNAVAILABLE",
          data
        );
      }

      throw new AppError(status, data?.message || data?.detail || "ML Sentinel request failed", "GATEWAY_ERROR", data);
    }

    throw new AppError(500, `Internal error in Sentinel gateway: ${String(error)}`);
  }

  public async getHealth(): Promise<any> {
    try {
      // Try /api/v1/health first, fallback to /health or root
      try {
        const res = await this.client.get("/api/v1/health");
        return res.data;
      } catch {
        const res = await this.client.get("/health");
        return res.data;
      }
    } catch (err) {
      return { status: "unhealthy", error: String(err) };
    }
  }

  public async getStats(): Promise<any> {
    try {
      const res = await this.client.get("/api/v1/stats");
      return res.data;
    } catch (err) {
      // Fallback or retry
      try {
        const res = await this.client.get("/stats");
        return res.data;
      } catch (innerErr) {
        this.handleAxiosError(innerErr, "Stats");
      }
    }
  }

  public async getProjects(params: {
    limit?: number;
    risk_level?: string;
    state?: string;
    district?: string;
    house?: string;
    work_category?: string;
    min_risk?: number;
    max_risk?: number;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    page_size?: number;
  }): Promise<any> {
    try {
      // Support both /api/v1/projects and /api/projects
      try {
        const res = await this.client.get("/api/v1/projects", { params });
        return res.data;
      } catch {
        const res = await this.client.get("/api/projects", { params });
        return res.data;
      }
    } catch (err) {
      this.handleAxiosError(err, "Get Projects");
    }
  }

  public async getProjectDetail(rawProjectId: string): Promise<any> {
    try {
      // Pass raw projectId through untouched or cleanly encoded
      const encoded = encodeURIComponent(rawProjectId);
      try {
        const res = await this.client.get(`/api/v1/projects/${encoded}`);
        return res.data;
      } catch (firstErr: any) {
        if (firstErr?.response?.status === 404 || firstErr?.response?.status === 422) {
          // Try /api/projects/:id as fallback
          try {
            const res = await this.client.get(`/api/projects/${encoded}`);
            return res.data;
          } catch (secondErr) {
            this.handleAxiosError(secondErr, rawProjectId);
          }
        }
        this.handleAxiosError(firstErr, rawProjectId);
      }
    } catch (err) {
      this.handleAxiosError(err, rawProjectId);
    }
  }

  public async getInvestigation(rawProjectId: string): Promise<any> {
    try {
      const encoded = encodeURIComponent(rawProjectId);
      try {
        const res = await this.client.get(`/api/investigations/${encoded}`);
        return res.data;
      } catch {
        // If investigation endpoint is not present on upstream, construct dossier from project detail
        const project = await this.getProjectDetail(rawProjectId);
        return {
          project_id: rawProjectId,
          composite_risk_score: project?.risk_score ?? 0,
          risk_level: project?.risk_level ?? "LOW",
          evidence_confidence_score: (project?.confidence ?? 0.9) * 100,
          evidence_completeness_state: project?.data_completeness ? "SUFFICIENT" : "INSUFFICIENT",
          active_signals: {
            cost_anomaly_detected: project?.factors?.some((f: any) => f.type === "cost") ?? false,
            progress_delay_detected: project?.factors?.some((f: any) => f.type === "delay" || f.type === "progress") ?? false,
          },
          recommendations: (project?.recommended_checks || []).map((rec: string) => ({
            check_type: "AUDIT_CHECK",
            action: rec,
          })),
          data_limitations: [],
        };
      }
    } catch (err) {
      this.handleAxiosError(err, rawProjectId);
    }
  }

  public async search(q: string, limit = 100): Promise<any> {
    try {
      try {
        const res = await this.client.get("/api/search", { params: { q, limit } });
        return res.data;
      } catch {
        // Search by filtering projects
        const res = await this.getProjects({ limit: 100 });
        const all: any[] = res?.data || res?.items || [];
        const lowerQ = q.toLowerCase();
        const matches = all.filter(
          (p) =>
            p.project_id?.toLowerCase().includes(lowerQ) ||
            p.project_name?.toLowerCase().includes(lowerQ) ||
            p.district?.toLowerCase().includes(lowerQ) ||
            p.state?.toLowerCase().includes(lowerQ)
        );
        return matches.slice(0, limit);
      }
    } catch (err) {
      this.handleAxiosError(err, `Search: ${q}`);
    }
  }

  public async getPriorityQueue(limit = 100): Promise<any> {
    try {
      try {
        const res = await this.client.get("/api/investigations/priority", { params: { limit } });
        return res.data;
      } catch {
        return this.getProjects({ limit, risk_level: "HIGH" });
      }
    } catch (err) {
      this.handleAxiosError(err, "Priority Queue");
    }
  }

  public async getStateAnalytics(): Promise<any> {
    try {
      try {
        const res = await this.client.get("/api/analytics/states");
        return res.data;
      } catch {
        const res = await this.getProjects({ limit: 100 });
        const data: any[] = res?.data || [];
        const stateMap: Record<string, { count: number; totalRisk: number; highRisk: number }> = {};
        data.forEach((p) => {
          const s = p.state || "Unknown";
          if (!stateMap[s]) stateMap[s] = { count: 0, totalRisk: 0, highRisk: 0 };
          stateMap[s].count++;
          stateMap[s].totalRisk += Number(p.risk_score || 0);
          if (p.risk_level === "HIGH" || p.risk_level === "CRITICAL") stateMap[s].highRisk++;
        });
        return Object.entries(stateMap).map(([state, v]) => ({
          state,
          count: v.count,
          average_risk_score: parseFloat((v.totalRisk / v.count).toFixed(2)),
          high_risk_count: v.highRisk,
        }));
      }
    } catch (err) {
      this.handleAxiosError(err, "State Analytics");
    }
  }

  public async getCategoryAnalytics(): Promise<any> {
    try {
      try {
        const res = await this.client.get("/api/analytics/categories");
        return res.data;
      } catch {
        const res = await this.getProjects({ limit: 100 });
        const data: any[] = res?.data || [];
        const catMap: Record<string, { count: number; totalRisk: number; criticalCount: number }> = {};
        data.forEach((p) => {
          const c = p.work_category || "General Infrastructure";
          if (!catMap[c]) catMap[c] = { count: 0, totalRisk: 0, criticalCount: 0 };
          catMap[c].count++;
          catMap[c].totalRisk += Number(p.risk_score || 0);
          if (p.risk_level === "CRITICAL") catMap[c].criticalCount++;
        });
        return Object.entries(catMap).map(([work_category, v]) => ({
          work_category,
          count: v.count,
          average_risk_score: parseFloat((v.totalRisk / v.count).toFixed(2)),
          critical_count: v.criticalCount,
        }));
      }
    } catch (err) {
      this.handleAxiosError(err, "Category Analytics");
    }
  }

  public async analyzeTransient(payload: {
    work_id: string;
    district_name: string;
    work_category: string;
    work_description: string;
    sanctioned_amount: number;
    total_expenditure: number;
    sanction_date: string;
    work_status: string;
  }): Promise<any> {
    try {
      // POST to /api/v1/analyze or /api/v1/analyze
      const res = await this.client.post("/api/v1/analyze", payload);
      return res.data;
    } catch (err) {
      this.handleAxiosError(err, "Analyze Transient");
    }
  }
}

export const sentinelClient = new SentinelClientService();
