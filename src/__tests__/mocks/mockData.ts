// Mock data for testing

export const mockCommandCenterResponse = {
  portfolio_health: {
    total_projects: 256,
    active_projects: 198,
    total_budget: 450000000,
    total_expenditure: 285000000,
    avg_progress: 63,
  },
  risk_distribution: {
    CRITICAL: 12,
    HIGH: 34,
    MEDIUM: 89,
    LOW: 121,
  },
  top_priority_projects: [
    {
      project_id: 'PROJ_001',
      project_name: 'Highway Construction Phase 2',
      risk_level: 'CRITICAL',
      operational_priority_score: 95,
      evidence_status: 'VERIFIED',
    },
    {
      project_id: 'PROJ_002',
      project_name: 'Bridge Reinforcement',
      risk_level: 'HIGH',
      operational_priority_score: 87,
      evidence_status: 'VERIFIED',
    },
  ],
  recent_activity: [
    {
      activity_id: 'ACT_001',
      project_id: 'PROJ_001',
      activity_type: 'alert_triggered',
      description: 'Cost overrun detected',
      timestamp: new Date().toISOString(),
    },
  ],
  alerts_summary: {
    new: 45,
    acknowledged: 23,
    escalated: 8,
  },
  investigation_summary: {
    open: 12,
    under_review: 5,
    escalated: 2,
    resolved: 28,
  },
};

export const mockAttentionQueueResponse = {
  items: [
    {
      project_id: 'PROJ_001',
      project_name: 'Highway Construction',
      operational_priority_score: 95,
      risk_level: 'CRITICAL',
      evidence_status: 'VERIFIED',
      priority_tier: 'URGENT_ACTION',
      recommendation: 'Immediate audit required',
      state: 'Maharashtra',
      district: 'Pune',
      mp_name: 'MP Name',
      last_updated: new Date().toISOString(),
    },
    {
      project_id: 'PROJ_002',
      project_name: 'Bridge Reinforcement',
      operational_priority_score: 87,
      risk_level: 'HIGH',
      evidence_status: 'VERIFIED',
      priority_tier: 'ELEVATED_ATTENTION',
      recommendation: 'Review timeline and budget',
      state: 'Maharashtra',
      district: 'Mumbai',
      mp_name: 'MP Name 2',
      last_updated: new Date().toISOString(),
    },
  ],
  pagination: {
    page: 1,
    page_size: 50,
    total: 156,
    total_pages: 4,
  },
};

export const mockProjectSignalsResponse = {
  project_id: 'PROJ_001',
  signals: [
    {
      signal_id: 'SIG_001',
      signal_name: 'Cost Overrun Detected',
      severity: 'CRITICAL',
      confidence_score: 0.92,
      reason_code: 'COST_VARIANCE',
      description: 'Project expenditure exceeds sanctioned amount by 25%',
      evidence_links: ['doc_001', 'doc_002'],
      created_at: new Date().toISOString(),
      status: 'ACTIVE',
    },
    {
      signal_id: 'SIG_002',
      signal_name: 'Timeline Delay',
      severity: 'HIGH',
      confidence_score: 0.85,
      reason_code: 'DELAY_PATTERN',
      description: 'Project is 6 months behind schedule',
      evidence_links: ['doc_003'],
      created_at: new Date(Date.now() - 3600000).toISOString(),
      status: 'ACTIVE',
    },
  ],
  total_count: 2,
  timestamp: new Date().toISOString(),
};

export const mockProjectAlertsResponse = {
  project_id: 'PROJ_001',
  alerts: [
    {
      alert_id: 'ALERT_001',
      alert_type: 'cost_anomaly',
      severity: 'CRITICAL',
      title: 'Critical Cost Overrun',
      description: 'Project has exceeded budget by ₹25 lakhs',
      triggered_by_signal: 'SIG_001',
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      acknowledged_by: null,
      status: 'NEW',
      recommendation: 'Conduct immediate financial audit',
    },
    {
      alert_id: 'ALERT_002',
      alert_type: 'timeline_delay',
      severity: 'HIGH',
      title: 'Project Delay Alert',
      description: 'Project completion delayed by 6 months',
      triggered_by_signal: 'SIG_002',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: 'investigator_001',
      status: 'ACKNOWLEDGED',
      recommendation: 'Review project timeline and resources',
    },
  ],
  total_count: 2,
  timestamp: new Date().toISOString(),
};

export const mockInvestigationResponse = {
  case_id: 'CASE_001',
  project_id: 'PROJ_001',
  case_title: 'Financial Anomaly Investigation',
  case_description: 'Investigate discrepancies in fund utilization',
  status: 'OPEN',
  created_at: new Date(Date.now() - 86400000).toISOString(),
  updated_at: new Date().toISOString(),
  assigned_to: 'investigator_001',
  risk_level: 'CRITICAL',
  composite_risk_score: 82.5,
  evidence: [
    {
      evidence_id: 'EV_001',
      evidence_type: 'FINANCIAL_RECORD',
      title: 'Fund Transfer Log',
      source: 'Bank Records',
      verification_status: 'VERIFIED',
      collected_at: new Date(Date.now() - 3600000).toISOString(),
      created_by: 'system',
    },
  ],
  timeline: [
    {
      event_id: 'EVT_001',
      event_type: 'case_created',
      description: 'Investigation case created',
      occurred_at: new Date(Date.now() - 86400000).toISOString(),
      recorded_by: 'system',
    },
  ],
  actions_requested: [
    {
      action_id: 'ACT_001',
      action_type: 'REQUEST_DOCUMENT',
      status: 'PENDING',
      due_date: new Date(Date.now() + 604800000).toISOString(),
      requested_by: 'investigator_001',
    },
  ],
};

export const mockAnalysisResponse = {
  project_id: 'PROJ_001',
  analysis_timestamp: new Date().toISOString(),
  risk_assessment: {
    overall_risk_score: 72.5,
    risk_level: 'HIGH',
    cost_anomaly_score: 85,
    delay_risk_score: 65,
    duplicate_risk_score: 45,
    flag_signals: ['COST_VARIANCE', 'DELAY_PATTERN'],
  },
  feature_analysis: {
    budget_utilization: 63.3,
    progress_vs_timeline: 58.5,
    cost_per_beneficiary: 125000,
    financial_health: 'AT_RISK',
  },
  recommendations: [
    {
      recommendation_id: 'REC_001',
      title: 'Conduct Financial Audit',
      description: 'Comprehensive audit of all financial transactions',
      priority: 'HIGH',
      action_type: 'audit',
    },
    {
      recommendation_id: 'REC_002',
      title: 'Review Project Timeline',
      description: 'Reassess timeline and identify delays',
      priority: 'MEDIUM',
      action_type: 'timeline_review',
    },
  ],
};

// Error mock data
export const mockNetworkError = new Error('Network error: Failed to fetch');
export const mockTimeoutError = new Error('Request timeout: 1000ms');
export const mockValidationError = {
  statusCode: 422,
  message: 'Validation error: Invalid project ID format',
};
export const mockNotFoundError = {
  statusCode: 404,
  message: 'Project not found',
};
export const mockServerError = {
  statusCode: 500,
  message: 'Internal server error',
};

// Loading state simulators
export const simulateLoading = async (duration = 100) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export const simulateError = async (error: Error) => {
  throw error;
};
