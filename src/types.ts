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
  | "Users";

export interface User {
  id: string;
  email: string;
  role: string;
  department?: string;
  name?: string;
}

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
  status: "Open" | "Under Investigation" | "Acknowledge" | "Resolved";
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
  state: string;
  code: string;
  total_works: number;
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
  threshold_description: string;
  detection_logic: string;
  policy_statement: string;
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

// ============================================================================
// Work Assignment & Progress Monitoring Types
// ============================================================================

export interface WorkAssignmentRecord {
  id?: string;
  project_id: string;
  work_id: string;
  work_description: string;
  assigned_date: string;
  planned_start_date: string;
  planned_end_date: string;
  assigned_quantity: number;
  unit: string;
  assigned_amount: number;
  contractor?: string;
  department?: string;
  location?: string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkProgressRecord {
  id?: string;
  project_id: string;
  work_id: string;
  report_date: string;
  completed_quantity: number;
  unit: string;
  reported_progress_percent: number;
  reported_amount_spent: number;
  calculated_progress_percent?: number;
  remarks?: string;
  reported_by?: string;
  created_at?: string;
}

export type SignalSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface WorkMonitoringSignalItem {
  id: string;
  project_id: string;
  work_id?: string;
  signal_type:
    | "WORK_PROGRESS_DELAY"
    | "FINANCIAL_PROGRESS_MISMATCH"
    | "REPORTED_PROGRESS_DISCREPANCY"
    | "WORK_ASSIGNMENT_NOT_FOUND"
    | "OVERDUE_WORK"
    | "LOW_PROGRESS_HIGH_EXPENDITURE"
    | "RAPID_EXPENDITURE_WITH_LOW_PROGRESS"
    | "NO_PROGRESS_REPORT"
    | "PROGRESS_STAGNATION"
    | "WORK_COMPLETED_AHEAD_OF_SCHEDULE"
    | "VISUAL_PROGRESS_CONTRADICTION"
    | "LABOUR_PROGRESS_CONTRADICTION"
    | "LOW_LABOUR_SUPPORT_FOR_REPORTED_PROGRESS"
    | "REPORTED_EXPENDITURE_VERIFICATION_MISMATCH"
    | "DUPLICATE_PROGRESS_REPORT";
  severity: SignalSeverity;
  signal_score: number; // 0 - 100
  signal_status: "ACTIVE" | "RESOLVED";
  detected_at: string;
  reason: string;
  evidence: Record<string, any>;
  requires_human_investigation: boolean;
  resolved_at?: string;
}

export interface MonitoringTimelineEvent {
  date: string;
  reported_progress: number;
  calculated_progress: number;
  visual_progress?: number;
  financial_progress: number;
  time_elapsed: number;
  risk_score: number;
  signals: string[];
}

export type InvestigationDecision = 
  | "NO_REVIEW_REQUIRED" 
  | "MONITOR" 
  | "HUMAN_REVIEW_RECOMMENDED" 
  | "URGENT_HUMAN_REVIEW";

export interface InvestigationRecommendation {
  project_id: string;
  decision: InvestigationDecision;
  priority: SignalSeverity;
  risk_score: number;
  signals: { type: string; severity: SignalSeverity }[];
  reasons: string[];
  recommended_checks: string[];
  requires_human_investigation: boolean;
}

export interface CSVValidationError {
  row: number;
  field: string;
  message: string;
}

export interface CSVUploadResult {
  success: boolean;
  imported_count: number;
  total_rows: number;
  errors: CSVValidationError[];
  message: string;
}

export interface MultimodalEvidenceSummary {
  project_id: string;
  domains: {
    documents: {
      verified_expenditure_percent: number;
      financial_anomaly_detected: boolean;
      total_invoices_verified: number;
      discrepancy_amount: number;
    };
    labour: {
      worker_days: number;
      labour_anomaly_detected: boolean;
      active_workers_count: number;
      muster_roll_verified: boolean;
    };
    field_images: {
      visual_progress_percent: number;
      quality_score: number;
      relevance_score: number;
      image_count: number;
      duplicate_images_detected: boolean;
    };
    work_progress: {
      physical_progress_percent: number;
      financial_progress_percent: number;
      schedule_progress_percent: number;
      calculated_vs_reported_gap: number;
    };
  };
  contradiction_detected: boolean;
  contradiction_reasons: string[];
  composite_risk_score: number;
}

