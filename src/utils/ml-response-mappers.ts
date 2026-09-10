/**
 * Frontend ML API Response Mappers
 * 
 * Maps backend responses to component-ready format
 * Ensures type safety and data consistency
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface MappedSignal {
  id: string;
  name: string;
  code: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  evidence: string[];
  createdAt: string;
  status: string;
}

export interface MappedAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
  acknowledgedAt?: string;
}

export interface MappedProject {
  id: string;
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priority: number;
  state: string;
  district: string;
  alertCount: number;
  signalCount: number;
}

export interface MappedInvestigation {
  caseId: string;
  projectId: string;
  projectName: string;
  status: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: MappedSignal[];
  evidence: MappedEvidence[];
  auditTrail: MappedAuditEntry[];
}

export interface MappedEvidence {
  id: string;
  type: string;
  name: string;
  status: string;
  verificationStatus: string;
  uploadedAt: string;
}

export interface MappedAuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: any;
}

export interface MappedDashboard {
  portfolioHealth: {
    totalProjects: number;
    activeProjects: number;
    totalBudget: number;
    totalExpenditure: number;
    avgProgress: number;
  };
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topPriorities: MappedProject[];
  recentActivity: any[];
}

// ==========================================
// SIGNAL MAPPERS
// ==========================================

export function mapSignalsResponse(data: any): MappedSignal[] {
  if (!data || !data.signals) {
    return [];
  }

  return data.signals.map((signal: any) => ({
    id: signal.signal_id || signal.id || generateId(),
    name: signal.signal_name || signal.name || 'Unknown Signal',
    code: signal.reason_code || signal.code || 'UNKNOWN',
    severity: normalizeSeverity(signal.severity),
    confidence: normalizeScore(signal.confidence || 0),
    evidence: Array.isArray(signal.evidence) ? signal.evidence : [],
    createdAt: signal.created_at || new Date().toISOString(),
    status: signal.status || 'ACTIVE'
  }));
}

export function mapSignalsSummary(data: any) {
  if (!data || !data.signal_summary) {
    return { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  }

  return {
    CRITICAL: data.signal_summary.by_severity?.CRITICAL || 0,
    HIGH: data.signal_summary.by_severity?.HIGH || 0,
    MEDIUM: data.signal_summary.by_severity?.MEDIUM || 0,
    LOW: data.signal_summary.by_severity?.LOW || 0
  };
}

// ==========================================
// ALERT MAPPERS
// ==========================================

export function mapAlertsResponse(data: any): MappedAlert[] {
  if (!data || !data.alerts) {
    return [];
  }

  return data.alerts.map((alert: any) => ({
    id: alert.alert_id || alert.id || generateId(),
    type: alert.alert_type || alert.type || 'RISK_ALERT',
    title: alert.title || alert.message || 'Alert',
    description: alert.description || '',
    severity: normalizeSeverity(alert.severity),
    status: (alert.status || 'ACTIVE').toUpperCase() as 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED',
    createdAt: alert.created_at || new Date().toISOString(),
    acknowledgedAt: alert.acknowledged_at
  }));
}

export function mapAlertsSummary(data: any) {
  if (!data || !data.alert_summary) {
    return { total: 0, active: 0, acknowledged: 0, resolved: 0 };
  }

  return {
    total: data.alert_summary.total || 0,
    active: data.alert_summary.active || 0,
    acknowledged: data.alert_summary.acknowledged || 0,
    resolved: data.alert_summary.resolved || 0
  };
}

// ==========================================
// PROJECT MAPPERS
// ==========================================

export function mapProjectsResponse(data: any): MappedProject[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(project => ({
    id: project.project_id || project.id || project.work_id || generateId(),
    name: project.project_name || project.name || project.title || 'Untitled',
    riskLevel: normalizeSeverity(project.risk_level),
    priority: normalizeScore(project.operational_priority_score || 0),
    state: project.state || 'Unknown',
    district: project.district || 'Unknown',
    alertCount: project.alerts_count || 0,
    signalCount: project.signals_count || 0
  }));
}

export function mapProjectDetail(data: any): MappedProject {
  return {
    id: data.project_id || data.id || data.work_id || generateId(),
    name: data.project_name || data.name || data.title || 'Untitled',
    riskLevel: normalizeSeverity(data.risk_level),
    priority: normalizeScore(data.operational_priority_score || 0),
    state: data.state || 'Unknown',
    district: data.district || 'Unknown',
    alertCount: data.alerts_count || 0,
    signalCount: data.signals_count || 0
  };
}

// ==========================================
// INVESTIGATION MAPPERS
// ==========================================

export function mapInvestigationResponse(data: any): MappedInvestigation {
  return {
    caseId: data.case_id || data.id || generateId(),
    projectId: data.project_id || data.id || generateId(),
    projectName: data.project_name || data.title || 'Untitled',
    status: data.status || 'OPEN',
    riskLevel: normalizeSeverity(data.risk_level),
    
    signals: Array.isArray(data.signals)
      ? data.signals.map((signal: any) => ({
          id: signal.signal_id || signal.id || generateId(),
          name: signal.signal_name || signal.name || 'Unknown',
          code: signal.reason_code || signal.code || 'UNKNOWN',
          severity: normalizeSeverity(signal.severity),
          confidence: normalizeScore(signal.confidence || 0),
          evidence: signal.evidence || [],
          createdAt: signal.created_at || new Date().toISOString(),
          status: signal.status || 'ACTIVE'
        }))
      : [],
    
    evidence: Array.isArray(data.evidence_items)
      ? data.evidence_items.map((evidence: any) => ({
          id: evidence.evidence_id || evidence.id || generateId(),
          type: evidence.type || 'DOCUMENT',
          name: evidence.name || evidence.title || 'Evidence',
          status: evidence.status || 'VERIFIED',
          verificationStatus: evidence.verification_status || 'PENDING',
          uploadedAt: evidence.uploaded_at || new Date().toISOString()
        }))
      : [],
    
    auditTrail: Array.isArray(data.audit_trail)
      ? data.audit_trail.map((entry: any) => ({
          id: entry.entry_id || entry.id || generateId(),
          action: entry.action || entry.event_type || 'UNKNOWN',
          actor: entry.actor || 'SYSTEM',
          timestamp: entry.timestamp || new Date().toISOString(),
          details: entry.details || {}
        }))
      : []
  };
}

// ==========================================
// DASHBOARD MAPPERS
// ==========================================

export function mapCommandCenterResponse(data: any): MappedDashboard {
  return {
    portfolioHealth: {
      totalProjects: data.portfolio_health?.total_projects || 0,
      activeProjects: data.portfolio_health?.active_projects || 0,
      totalBudget: data.portfolio_health?.total_budget || 0,
      totalExpenditure: data.portfolio_health?.total_expenditure || 0,
      avgProgress: data.portfolio_health?.avg_progress || 0
    },
    
    riskDistribution: {
      critical: data.risk_distribution?.CRITICAL || 0,
      high: data.risk_distribution?.HIGH || 0,
      medium: data.risk_distribution?.MEDIUM || 0,
      low: data.risk_distribution?.LOW || 0
    },
    
    topPriorities: mapProjectsResponse(data.top_priority_projects || []),
    
    recentActivity: Array.isArray(data.recent_activity)
      ? data.recent_activity.map((activity: any) => ({
          id: activity.activity_id || generateId(),
          type: activity.activity_type || activity.type,
          projectId: activity.project_id,
          description: activity.description || activity.message,
          timestamp: activity.timestamp || new Date().toISOString(),
          severity: normalizeSeverity(activity.severity || 'LOW')
        }))
      : []
  };
}

export function mapAttentionQueueResponse(data: any) {
  return {
    items: Array.isArray(data.items)
      ? data.items.map((item: any) => ({
          projectId: item.project_id || item.id || generateId(),
          projectName: item.project_name || item.name || 'Untitled',
          priority: normalizeScore(item.operational_priority_score || 0),
          riskLevel: normalizeSeverity(item.risk_level),
          evidenceStatus: item.evidence_status || 'PENDING',
          recommendation: item.recommendation || 'Monitor closely',
          state: item.state || 'Unknown',
          alertCount: item.alerts_count || 0
        }))
      : [],
    
    pagination: {
      page: data.pagination?.page || 1,
      pageSize: data.pagination?.page_size || 50,
      total: data.pagination?.total || 0,
      totalPages: data.pagination?.total_pages || 1
    },
    
    summary: {
      critical: data.summary?.critical_count || 0,
      high: data.summary?.high_count || 0,
      medium: data.summary?.medium_count || 0
    }
  };
}

// ==========================================
// ANALYSIS MAPPERS
// ==========================================

export function mapAnalysisResponse(data: any) {
  return {
    projectId: data.project_id,
    riskScore: normalizeScore(data.risk_assessment?.composite_risk_score || 0),
    riskLevel: normalizeSeverity(data.risk_assessment?.risk_level),
    
    componentScores: {
      cost: normalizeScore(data.risk_assessment?.component_scores?.cost_risk || 0),
      delay: normalizeScore(data.risk_assessment?.component_scores?.delay_risk || 0),
      progress: normalizeScore(data.risk_assessment?.component_scores?.progress_risk || 0),
      duplicate: normalizeScore(data.risk_assessment?.component_scores?.duplicate_risk || 0),
      compliance: normalizeScore(data.risk_assessment?.component_scores?.compliance_risk || 0)
    },
    
    anomalies: Array.isArray(data.detected_anomalies)
      ? data.detected_anomalies.map((anomaly: any) => ({
          id: anomaly.anomaly_id || generateId(),
          type: anomaly.type || 'ANOMALY',
          severity: normalizeSeverity(anomaly.severity),
          description: anomaly.description || '',
          confidence: normalizeScore(anomaly.confidence || 0),
          deviation: anomaly.deviation || 0
        }))
      : [],
    
    signals: mapSignalsResponse(data),
    
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    
    confidence: normalizeScore(data.confidence_score || 0),
    
    dataQuality: {
      completeness: normalizeScore(data.data_quality?.completeness || 0),
      recency: data.data_quality?.recency || 'CURRENT',
      limitations: data.data_quality?.limitations || []
    }
  };
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function normalizeSeverity(severity: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (!severity) return 'MEDIUM';
  
  const normalized = String(severity).toUpperCase();
  
  if (normalized.includes('CRITICAL')) return 'CRITICAL';
  if (normalized.includes('HIGH')) return 'HIGH';
  if (normalized.includes('MEDIUM')) return 'MEDIUM';
  if (normalized.includes('LOW')) return 'LOW';
  
  return 'MEDIUM';
}

function normalizeScore(score: any): number {
  const num = parseFloat(String(score || 0));
  
  if (isNaN(num)) return 0;
  if (num > 100) return 100;
  if (num < 0) return 0;
  
  return Math.round(num * 100) / 100;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// EXPORTS
// ==========================================

export const ResponseMappers = {
  mapSignalsResponse,
  mapSignalsSummary,
  mapAlertsResponse,
  mapAlertsSummary,
  mapProjectsResponse,
  mapProjectDetail,
  mapInvestigationResponse,
  mapCommandCenterResponse,
  mapAttentionQueueResponse,
  mapAnalysisResponse
};

export default ResponseMappers;

