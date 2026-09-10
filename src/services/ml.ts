import axios from 'axios';
import { ResponseMappers } from '../utils/ml-response-mappers';
import { ErrorHandler, parseApiError, logError, buildUserMessage } from '../utils/errorHandler';
import { API_CONFIG } from '../config/api';

/**
 * Frontend ML Service
 * 
 * Connects to backend ML API endpoints
 * Uses ResponseMappers for type-safe data conversion
 * All endpoints are schema-compliant
 */

// ML API Base URL (Render Unified Live ML Engine)
const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'https://sih-2026-23oy.onrender.com/api';

// Configure axios instance with timeout and headers
const mlApiClient = axios.create({
  baseURL: ML_API_BASE_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT || 10000,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Add response interceptor for error handling
mlApiClient.interceptors.response.use(
  response => response,
  error => {
    const apiError = parseApiError(error);
    logError(apiError);
    throw apiError;
  }
);

// ==========================================
// MONITORING ENDPOINTS
// ==========================================

/**
 * Get monitoring command center overview
 * Returns portfolio health, risk distribution, top projects, etc.
 */
export async function getMonitoringCommandCenter(filters?: {
  state?: string;
  district?: string;
  mp?: string;
  house?: string;
  work_category?: string;
  risk_level?: string;
}) {
  try {
    console.log('📊 Fetching monitoring command center...');
    const response = await mlApiClient.get('/monitoring/command-center', { params: filters });
    
    // Map response to component format
    const mapped = ResponseMappers.mapCommandCenterResponse(response.data);
    console.log('✅ Dashboard data retrieved:', mapped);
    
    return mapped;
  } catch (error: any) {
    const userMessage = buildUserMessage(error);
    console.error('❌ Error fetching command center:', userMessage);
    throw error;
  }
}

/**
 * Get attention queue with prioritized projects
 * Returns paginated list of projects ranked by operational priority
 */
export async function getAttentionQueue(filters?: {
  scope?: 'all' | 'live' | 'historical';
  risk_level?: string;
  evidence_status?: string;
  priority_tier?: string;
  state?: string;
  district?: string;
  mp?: string;
  page?: number;
  page_size?: number;
}) {
  try {
    console.log('📋 Fetching attention queue...');
    const response = await mlApiClient.get('/monitoring/attention-queue', { params: filters });
    
    // Map response to component format
    const mapped = ResponseMappers.mapAttentionQueueResponse(response.data);
    console.log('✅ Attention queue retrieved:', mapped);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Error fetching attention queue:', error.message);
    throw error;
  }
}

/**
 * Ingest a single monitoring event
 */
export async function ingestMonitoringEvent(event: any) {
  try {
    console.log('📤 Ingesting monitoring event...');
    const response = await mlApiClient.post('/monitoring/events', event);
    
    console.log('✅ Event ingested successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error ingesting event:', error.message);
    throw error;
  }
}

/**
 * Ingest bulk monitoring events
 */
export async function ingestBulkMonitoringEvents(events: any[]) {
  try {
    console.log('📤 Ingesting bulk monitoring events...', { count: events.length });
    const response = await mlApiClient.post('/monitoring/events/bulk', { events });
    
    console.log('✅ Bulk events ingested successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error ingesting bulk events:', error.message);
    throw error;
  }
}

/**
 * Trigger continuous monitoring sweep
 */
export async function triggerMonitoringSweep() {
  try {
    console.log('🔄 Triggering monitoring sweep...');
    const response = await mlApiClient.post('/monitoring/sweep', {});
    
    console.log('✅ Monitoring sweep completed');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error during monitoring sweep:', error.message);
    throw error;
  }
}

// ==========================================
// PROJECT ENDPOINTS
// ==========================================

/**
 * Get standardized risk signals for a project
 */
export async function getProjectSignals(projectId: string) {
  try {
    console.log('📊 Fetching project signals...', { projectId });
    const response = await mlApiClient.get(`/projects/${projectId}/signals`);
    
    // Map response to component format
    const mapped = ResponseMappers.mapSignalsResponse(response.data);
    console.log('✅ Project signals retrieved:', mapped);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Error fetching project signals:', error.message);
    throw error;
  }
}

/**
 * Get early warning alerts for a project
 */
export async function getProjectAlerts(projectId: string) {
  try {
    console.log('🚨 Fetching project alerts...', { projectId });
    const response = await mlApiClient.get(`/projects/${projectId}/alerts`);
    
    // Map response to component format
    const mapped = ResponseMappers.mapAlertsResponse(response.data);
    console.log('✅ Project alerts retrieved:', mapped);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Error fetching project alerts:', error.message);
    throw error;
  }
}

/**
 * Get complete investigation dossier for a project
 */
export async function getProjectInvestigation(projectId: string) {
  try {
    console.log('🔍 Fetching project investigation...', { projectId });
    const response = await mlApiClient.get(`/projects/${projectId}/investigation`);
    
    // Map response to component format
    const mapped = ResponseMappers.mapInvestigationResponse(response.data);
    console.log('✅ Project investigation retrieved:', mapped);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Error fetching project investigation:', error.message);
    throw error;
  }
}

// ==========================================
// ANALYSIS ENDPOINTS
// ==========================================

/**
 * Real-time analysis of a project
 * Updated to use new backend endpoint
 */
export async function analyzeProject(projectData: any) {
  try {
    console.log('🔬 Analyzing project in real-time...', projectData);
    const response = await mlApiClient.post('/analysis/project', projectData);
    
    // Map response to component format
    const mapped = ResponseMappers.mapAnalysisResponse(response.data.data);
    console.log('✅ Project analysis completed:', mapped);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Error analyzing project:', error.message);
    throw error;
  }
}

// ==========================================
// DOCUMENT ENDPOINTS
// ==========================================

/**
 * Upload document evidence
 */
export async function uploadDocument(projectId: string, file: File) {
  try {
    console.log('📄 Uploading document...');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await mlApiClient.post(
      `/projects/${projectId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('✅ Document uploaded successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error uploading document:', error.message);
    throw error;
  }
}

/**
 * List documents for a project
 */
export async function listProjectDocuments(projectId: string, filters?: {
  category?: string;
  verification_status?: string;
}) {
  try {
    console.log('📚 Listing project documents...', { projectId });
    const response = await mlApiClient.get(`/projects/${projectId}/documents`, { params: filters });
    
    console.log('✅ Project documents retrieved:', response.data);
    return response.data.documents || [];
  } catch (error: any) {
    console.error('❌ Error listing documents:', error.message);
    throw error;
  }
}

// ==========================================
// LEGACY ML API ENDPOINTS
// (Kept for backward compatibility)
// ==========================================

/**
 * Get all projects with ML analysis
 * @deprecated Use getMonitoringCommandCenter instead for real data
 */
export async function getAllProjectsWithAnalysis() {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching projects with analysis:', error);
    return [];
  }
}

/**
 * Get detailed analysis for a single project from ML API
 * @deprecated Use getProjectSignals/Alerts/Investigation instead
 */
export async function getProjectAnalysis(projectId: string) {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching project analysis:', error);
    return null;
  }
}

/**
 * Get dashboard summary with ML insights
 * @deprecated Use getMonitoringCommandCenter instead
 */
export async function getDashboardSummary() {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/dashboard/summary`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching dashboard summary:', error);
    return null;
  }
}

/**
 * Get priority investigations
 * @deprecated Use getAttentionQueue instead
 */
export async function getPriorityInvestigations() {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/investigations/priority`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching investigations:', error);
    return [];
  }
}

/**
 * Get state analytics
 */
export async function getStateAnalytics() {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/analytics/states`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching state analytics:', error);
    return [];
  }
}

/**
 * Get category analytics
 */
export async function getCategoryAnalytics() {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/analytics/categories`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching category analytics:', error);
    return [];
  }
}

/**
 * Search projects
 */
export async function searchProjects(query: string) {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error searching projects:', error);
    return [];
  }
}

/**
 * Get system health
 */
export async function checkHealth() {
  try {
    const response = await axios.get(`${ML_API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('⚠️ ML API health check failed:', error);
    return { status: 'unavailable' };
  }
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  try {
    const response = await mlApiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('⚠️ Backend health check failed:', error);
    return { status: 'unavailable' };
  }
}

/**
 * Record investigation action
 */
export async function recordInvestigationAction(projectId: string, action: any) {
  try {
    console.log('📝 Recording investigation action...', { projectId, action });
    const response = await mlApiClient.post(`/projects/${projectId}/investigation/actions`, action);
    
    console.log('✅ Action recorded successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error recording action:', error.message);
    throw error;
  }
}

/**
 * Update investigation status
 */
export async function updateInvestigationStatus(projectId: string, status: string) {
  try {
    console.log('📝 Updating investigation status...', { projectId, status });
    const response = await mlApiClient.patch(`/projects/${projectId}/investigation/status`, { status });
    
    // Map response to component format
    const mapped = ResponseMappers.mapInvestigationResponse(response.data);
    console.log('✅ Investigation status updated:', mapped);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Error updating investigation status:', error.message);
    throw error;
  }
}

/**
 * Escalate governance case
 */
export async function escalateGovernanceCase(projectId: string, escalation: any) {
  try {
    console.log('🏛️ Escalating governance case...', { projectId, escalation });
    const response = await mlApiClient.post(`/projects/${projectId}/governance/escalate`, escalation);
    console.log('✅ Governance case escalated successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error escalating governance case:', error.message);
    throw error;
  }
}

// Export as object for backward compatibility
export const mlApi = {
  // New methods
  getMonitoringCommandCenter,
  getAttentionQueue,
  ingestMonitoringEvent,
  ingestBulkMonitoringEvents,
  triggerMonitoringSweep,
  getProjectSignals,
  getProjectAlerts,
  getProjectInvestigation,
  recordInvestigationAction,
  updateInvestigationStatus,
  escalateGovernanceCase,
  analyzeProject,
  uploadDocument,
  listProjectDocuments,
  checkBackendHealth,
  
  // Legacy methods (backward compatibility)
  getAllProjectsWithAnalysis,
  getProjectAnalysis,
  getDashboardSummary,
  getPriorityInvestigations,
  getStateAnalytics,
  getCategoryAnalytics,
  searchProjects,
  checkHealth
};
