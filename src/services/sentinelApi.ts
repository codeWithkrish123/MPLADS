/**
 * ML Sentinel API Service - Real-time Monitoring Dashboard
 * 
 * Features:
 * - Command Center: Live portfolio metrics and overview
 * - Attention Queue: Top priority projects for immediate action
 * - Monitoring Events: Real-time event ingestion
 * - Analytics: State and category level analytics
 * 
 * Target Response Times:
 * - Command Center: <500ms
 * - Attention Queue: <300ms
 * - Dashboard: <2s (parallel fetch)
 */

import { apiCall } from './api';

export interface SentinelDashboardData {
  commandCenter: any;
  attentionQueue: any;
  overview: any;
  timestamp: string;
  responseTime: number;
}

export interface MonitoringEvent {
  project_id: string;
  event_type: string;
  event_timestamp?: string;
  payload: Record<string, any>;
  [key: string]: any;
}

export interface DashboardMetrics {
  totalProjects: number;
  atRiskCount: number;
  underInvestigationCount: number;
  criticalCount: number;
  averageRiskScore: number;
  riskDistribution: Record<string, number>;
}

/**
 * Sentinel API Service
 * Integrates with backend ML routes for real-time monitoring
 */
export const sentinelApi = {
  /**
   * Get live sentinel dashboard data
   * Aggregates command center, attention queue, and portfolio overview
   * Response time: <2 seconds (target: <500ms for each component)
   * 
   * @param filters Optional filters (state, district, risk_level)
   * @returns Dashboard with all real-time metrics
   */
  getDashboard: async (filters?: {
    state?: string;
    district?: string;
    risk_level?: string;
  }): Promise<{ success: boolean; data: SentinelDashboardData }> => {
    const params = new URLSearchParams();
    if (filters?.state) params.append('state', filters.state);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.risk_level) params.append('risk_level', filters.risk_level);

    return apiCall(`/ml/sentinel/dashboard${params.toString() ? '?' + params.toString() : ''}`);
  },

  /**
   * Get monitoring/metrics data for live updates
   * Includes command center, investigations, and analytics
   * 
   * @param filters Optional location/risk filters
   * @returns Monitoring data
   */
  getMonitoring: async (filters?: {
    state?: string;
    district?: string;
    risk_level?: string;
  }): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.state) params.append('state', filters.state);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.risk_level) params.append('risk_level', filters.risk_level);

    return apiCall(`/ml/sentinel/monitoring${params.toString() ? '?' + params.toString() : ''}`);
  },

  /**
   * Ingest a real-time monitoring event
   * Sends event to ML API for immediate processing
   * 
   * @param event Monitoring event with project_id and event_type
   * @returns Response from ML API
   */
  ingestEvent: async (event: MonitoringEvent): Promise<any> => {
    return apiCall('/ml/sentinel/ingest', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  /**
   * Get command center overview
   * Portfolio-level health metrics and aggregated risk
   * Response time target: <500ms
   * 
   * @returns Command center data
   */
  getCommandCenter: async (): Promise<any> => {
    return apiCall('/ml/monitoring/command-center');
  },

  /**
   * Get attention queue
   * Top priority projects requiring immediate attention
   * Response time target: <300ms
   * 
   * @param page Page number (default: 1)
   * @param pageSize Items per page (default: 50)
   * @returns Attention queue items
   */
  getAttentionQueue: async (
    page: number = 1,
    pageSize: number = 50
  ): Promise<any> => {
    return apiCall(
      `/ml/monitoring/attention-queue?page=${page}&page_size=${pageSize}`
    );
  },

  /**
   * Get project intelligence summary
   * Complete ML analysis for a single project
   * Includes signals, alerts, investigation, timeline, evidence, health, summary
   * Response time target: <1000ms
   * 
   * @param projectId Work ID or project ID
   * @returns Complete project intelligence
   */
  getProjectIntelligence: async (projectId: string): Promise<any> => {
    return apiCall(`/ml/projects/${projectId}`);
  },

  /**
   * Get project risk score and analysis
   * Quick risk assessment with key metrics
   * 
   * @param projectId Work ID or project ID
   * @returns Project detail with risk analysis
   */
  getProjectAnalysis: async (projectId: string): Promise<any> => {
    return apiCall(`/ml/projects/${projectId}`);
  },

  /**
   * Search projects by keyword
   * Full-text search across project data
   * 
   * @param query Search query
   * @param limit Max results (default: 100, max: 1000)
   * @returns Matching projects
   */
  searchProjects: async (
    query: string,
    limit: number = 100
  ): Promise<any> => {
    return apiCall(`/ml/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },

  /**
   * Get all projects with filters
   * List all projects with pagination and sorting
   * 
   * @param params Filter, pagination, and sort parameters
   * @returns Paginated project list
   */
  getAllProjects: async (params?: {
    page?: number;
    page_size?: number;
    state?: string;
    district?: string;
    risk_level?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.page_size) queryParams.append('page_size', String(params.page_size));
    if (params?.state) queryParams.append('state', params.state);
    if (params?.district) queryParams.append('district', params.district);
    if (params?.risk_level) queryParams.append('risk_level', params.risk_level);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    return apiCall(
      `/ml/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    );
  },

  /**
   * Get priority investigations
   * High-risk projects flagged for investigation
   * 
   * @returns Priority investigations list
   */
  getPriorityInvestigations: async (): Promise<any> => {
    return apiCall('/ml/investigations/priority');
  },

  /**
   * Get state-level analytics
   * Aggregated metrics by state
   * 
   * @returns State analytics data
   */
  getStateAnalytics: async (): Promise<any> => {
    return apiCall('/ml/analytics/states');
  },

  /**
   * Get category-level analytics
   * Aggregated metrics by work category
   * 
   * @returns Category analytics data
   */
  getCategoryAnalytics: async (): Promise<any> => {
    return apiCall('/ml/analytics/categories');
  },

  /**
   * Get dashboard summary
   * High-level KPIs and overview
   * 
   * @returns Dashboard summary metrics
   */
  getDashboardSummary: async (): Promise<any> => {
    return apiCall('/ml/dashboard-summary');
  },

  /**
   * Check ML API health
   * Verify ML service availability
   * 
   * @returns Health status
   */
  getHealth: async (): Promise<any> => {
    return apiCall('/ml/health');
  },

  /**
   * Get model status
   * Retrieve ML model metadata and performance
   * 
   * @returns Model status information
   */
  getModelStatus: async (): Promise<any> => {
    return apiCall('/ml/model-status');
  },

  /**
   * Analyze project (simulator/sandbox)
   * Non-persisting analysis for "what-if" scenarios
   * 
   * @param projectData Project information for analysis
   * @returns Analysis results
   */
  analyzeProject: async (projectData: {
    work_id: string;
    state: string;
    district?: string;
    house?: string;
    work_category: string;
    sanctioned_amount: number;
    total_expenditure: number;
    work_description: string;
    [key: string]: any;
  }): Promise<any> => {
    return apiCall('/ml/analyze', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Detect cost anomalies for a project
   * 
   * @param projectId Work ID
   * @returns Anomalies detected
   */
  detectCostAnomalies: async (projectId: string): Promise<any> => {
    return apiCall('/ml/detect-anomalies', {
      method: 'POST',
      body: JSON.stringify({ projectId, features: ['budget', 'expenses'] }),
    });
  },

  /**
   * Predict project delays
   * 
   * @param projectId Work ID
   * @returns Delay prediction with confidence
   */
  predictDelays: async (projectId: string): Promise<any> => {
    return apiCall('/ml/predict-delays', {
      method: 'POST',
      body: JSON.stringify({ projectId, includeRiskFactors: true }),
    });
  },

  /**
   * Calculate composite risk score
   * 
   * @param projectId Work ID
   * @returns Risk score with component breakdown
   */
  calculateRiskScore: async (projectId: string): Promise<any> => {
    return apiCall('/ml/risk-score', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    });
  },
};

export default sentinelApi;
