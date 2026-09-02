export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type WorkStatus = 
  | "Recommended" 
  | "Sanctioned" 
  | "In Progress" 
  | "Completed" 
  | "Delayed" 
  | "Requires Review" 
  | "On Hold";

export type UserRole = 
  | "Ministry" 
  | "State Nodal Authority" 
  | "District Authority" 
  | "Member of Parliament"
  | "Citizen";

export type Language = "en" | "hi";

export type GovTheme = "nic-blue" | "digital-emerald" | "finance-indigo" | "high-contrast" | "red-rose";

export interface WorkRecord {
  work_id: string;
  mp_id: string;
  mp_name: string;
  state: string;
  district: string;
  constituency: string;
  category: 
    | "Drinking Water Facility" 
    | "Rural Road Improvement" 
    | "School Building Renovation" 
    | "Primary Health Centre Upgrade" 
    | "Public Sanitation Facility" 
    | "Street Lighting & Solar" 
    | "Community Infrastructure" 
    | "Sports & Youth Facility" 
    | "Irrigation & Drainage";
  agency: string;
  recommended_cost: number;
  sanctioned_cost: number;
  actual_expenditure: number;
  physical_progress: number; // 0 - 100%
  financial_progress: number; // 0 - 100%
  start_date: string;
  expected_completion: string;
  predicted_completion: string;
  status: WorkStatus;
  risk_score: number; // 0 - 100
  risk_category: RiskSeverity;
  cost_anomaly_score: number; // 0 - 100
  delay_score: number; // 0 - 100
  duplicate_score: number; // 0 - 100
  compliance_score: number; // 0 - 100
  latitude: number;
  longitude: number;
  description: string;
  anomaly_types: string[];
  evidence?: {
    peer_benchmark_cost: number;
    district_median_cost: number;
    national_median_cost: number;
    cost_deviation_percent: number;
    financial_physical_delta: number;
    predicted_delay_days: number;
    duplicate_match_id?: string;
    duplicate_match_name?: string;
    duplicate_similarity_percent?: number;
    flagged_reasons: {
      factor: string;
      points: number;
      explanation: string;
    }[];
    policy_citations: {
      rule_id: string;
      clause: string;
      title: string;
    }[];
  };
}

export interface NearDuplicatePair {
  id: string;
  work_a: {
    id: string;
    name: string;
    location: string;
    cost: number;
    agency: string;
    sanction_date: string;
    category: string;
  };
  work_b: {
    id: string;
    name: string;
    location: string;
    cost: number;
    agency: string;
    sanction_date: string;
    category: string;
  };
  overall_similarity: number;
  breakdown: {
    text_similarity: number;
    location_similarity: number;
    cost_similarity: number;
    category_similarity: number;
  };
  status: "Requires Human Review" | "Verified Distinct" | "Merged & Corrected";
  geo_distance_meters: number;
  ai_notes: string;
}

export interface RiskAlert {
  id: string;
  severity: RiskSeverity;
  work_id: string;
  work_name: string;
  state: string;
  district: string;
  category: string;
  reason: string;
  detected_at: string;
  confidence: number;
  status: "Open" | "Under Investigation" | "Acknowledge" | "Acknowledged" | "Resolved";
  assigned_to?: string;
  risk_score: number;
  anomaly_type: "Cost" | "Delay" | "Duplicate" | "Financial" | "Compliance" | "Agency" | "Progress";
}

export interface DistrictSummary {
  rank: number;
  district: string;
  state: string;
  works_count: number;
  expenditure_cr: number;
  risk_score: number;
  risk_category: RiskSeverity;
  high_risk_works: number;
  completion_rate: number;
  delayed_works: number;
  cost_anomaly_score: number;
  delay_risk_score: number;
  progress_mismatch_score: number;
  duplicate_similarity_score: number;
  compliance_score: number;
  trend: number[]; // past 6 months
}

export interface StateSummary {
  name?: string;
  state: string;
  code: string;
  total_works: number;
  completed_works?: number;
  sanctioned_works?: number;
  recommended_works?: number;
  allocated_cr?: number;
  sanctioned_cr?: number;
  expenditure_cr?: number;
  total_expenditure_cr: number;
  risk_signals: number;
  high_risk_works: number;
  avg_risk_score: number;
  completion_rate: number;
  districts_count: number;
  risk_category: RiskSeverity;
  coordinates: [number, number];
}

export interface ImplementingAgency {
  id: string;
  name: string;
  short_name: string;
  type: "PWD" | "Rural Works" | "Water Supply" | "Municipal" | "Irrigation" | "Energy";
  total_works: number;
  completed_works: number;
  delayed_works: number;
  high_risk_works: number;
  avg_completion_rate: number;
  avg_risk_score: number;
  avg_cost_overrun_pct: number;
  risk_category: RiskSeverity;
  active_expenditure_cr: number;
  monthly_trend: { month: string; risk: number; completion: number }[];
  state?: string;
  district?: string;
}

export interface ComplianceRule {
  rule_id: string;
  title: string;
  category: "Implementation" | "Financial" | "Compliance" | "Asset Management" | "Procurement";
  affected_works: number;
  severity: RiskSeverity;
  status: "Active Policy" | "Under Revision" | "Advisory";
  policy_version: string;
  effective_date: string;
  source_document: string;
  policy_statement?: string;
  threshold_description: string;
  detection_logic: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entity_id: string;
  old_value: string;
  new_value: string;
  ip_device: string;
  status: "Logged" | "Verified" | "Flagged";
  hash_signature: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  evidence?: string[];
  citations?: string[];
}

export interface GlobalFilterState {
  state: string;
  district: string;
  financialYear: string;
  role: UserRole;
  searchQuery: string;
  categoryFilter: string;
  riskSeverityFilter: string;
  language: Language;
}

export type HouseType = "LOK_SABHA" | "RAJYA_SABHA";

export interface DashboardSummary {
  total_analyzed: number;
  critical_count: number;
  high_count: number;
  average_risk_score: number;
  average_confidence_score: number;
  risk_distribution: Record<string, number>;
}

export interface StateAnalyticsRow {
  state_name: string;
  project_count: number;
  average_risk_score: number;
  high_risk_count: number;
}

export interface CategoryAnalyticsRow {
  category_name: string;
  project_count: number;
  average_risk_score: number;
  critical_count: number;
}

export interface ProjectListItem {
  project_id: string;
  state: string;
  district: string;
  house?: string;
  work_category: string;
  sanctioned_amount?: number;
  total_expenditure?: number;
  risk_score?: number | null;
  risk_level?: string | null;
  project_status?: string;
  work_description?: string;
}

export interface ProjectListResponse {
  items: ProjectListItem[];
  total_matches: number;
  page: number;
  page_size: number;
}

export interface ProjectListQuery {
  q?: string;
  state?: string;
  district?: string;
  house?: string;
  risk_level?: string;
  work_category?: string;
  min_risk?: number | string;
  max_risk?: number | string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface SearchSuggestion {
  project_id: string;
  label: string;
  state?: string;
  district?: string;
}

export interface ProjectDetail {
  project_id: string;
  state: string;
  district: string;
  house?: string;
  work_category: string;
  work_description?: string;
  sanctioned_amount?: number;
  total_expenditure?: number;
  risk_score?: number | null;
  risk_level?: string | null;
  project_status?: string;
  work_status?: string;
  mp_name?: string;
  sanction_date?: string;
  metadata: Record<string, unknown>;
  factors: RiskFactor[];
  mock_visualization?: { lat?: number; lng?: number };
  lat?: number;
  lng?: number;
  data_sufficient: boolean;
}

export interface RiskFactor {
  type: string;
  score?: number;
  reason?: string;
}

export interface InvestigationCheck {
  check_type: string;
  action: string;
}

export interface InvestigationDossier {
  project_id: string;
  recommendations: InvestigationCheck[];
  data_limitations: string[];
}

export interface AnalyzePayload {
  work_id: string;
  district_name: string;
  work_category: string;
  work_description: string;
  sanctioned_amount: number;
  total_expenditure: number;
  sanction_date: string;
  work_status: string;
}

export interface AnalyzeResult {
  composite_risk_score: number | null;
  risk_level: string | null;
  factors: RiskFactor[];
}
