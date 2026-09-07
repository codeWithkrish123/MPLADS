/**
 * Analysis Service Layer
 * 
 * Handles:
 * - Dashboard metrics and KPI calculations
 * - Project analysis and risk scoring
 * - ML-driven anomaly detection
 * - Alert management
 * - Activity logging
 */

import { analysisApi, alertApi, mlApi, auditApi } from './api';

// ==================== DASHBOARD ====================

export const dashboardService = {
  /**
   * Get comprehensive dashboard summary with KPI metrics
   */
  getSummary: async () => {
    try {
      console.log('[DashboardService] Fetching dashboard summary...');
      
      const data = await analysisApi.getDashboardSummary();
      
      console.log('[DashboardService] Summary loaded:', {
        projects: data.totalProjects,
        budget: data.totalBudget,
      });
      
      return data;
    } catch (error) {
      console.error('[DashboardService] Failed to fetch summary:', error);
      throw error;
    }
  },
};

// ==================== PROJECT ANALYSIS ====================

export const projectAnalysisService = {
  /**
   * Get project analysis results
   */
  get: async (projectId: string) => {
    try {
      console.log(`[AnalysisService] Getting analysis for project ${projectId}`);
      
      const analysis = await analysisApi.getProjectAnalysis(projectId);
      
      console.log(`[AnalysisService] Analysis retrieved for ${projectId}`);
      return analysis;
    } catch (error) {
      console.error(`[AnalysisService] Failed to get analysis for ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Get risk signals for project
   */
  getRiskSignals: async (projectId: string) => {
    try {
      console.log(`[AnalysisService] Fetching risk signals for ${projectId}`);
      
      const signals = await analysisApi.getRiskSignals(projectId);
      
      console.log(`[AnalysisService] Found ${signals?.length || 0} signals`);
      return signals || [];
    } catch (error) {
      console.error(`[AnalysisService] Failed to get signals for ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Get compliance issues
   */
  getComplianceIssues: async (projectId: string) => {
    try {
      console.log(`[AnalysisService] Checking compliance for ${projectId}`);
      
      const issues = await analysisApi.getComplianceIssues(projectId);
      
      console.log(`[AnalysisService] Compliance check complete`);
      return issues || [];
    } catch (error) {
      console.error(`[AnalysisService] Compliance check failed:`, error);
      throw error;
    }
  },

  /**
   * Get peer context (similar projects for benchmarking)
   */
  getPeerContext: async (projectId: string) => {
    try {
      console.log(`[AnalysisService] Fetching peer context for ${projectId}`);
      
      const context = await analysisApi.getPeerContext(projectId);
      
      console.log(`[AnalysisService] Peer context retrieved`);
      return context || [];
    } catch (error) {
      console.error(`[AnalysisService] Failed to get peer context:`, error);
      throw error;
    }
  },
};

// ==================== ML SERVICES ====================

export const mlService = {
  /**
   * Detect cost anomalies
   */
  detectCostAnomalies: async () => {
    try {
      console.log('[MLService] Triggering cost anomaly detection...');
      
      const result = await mlApi.detectCostAnomalies();
      
      console.log('[MLService] Cost anomaly detection started');
      return result;
    } catch (error) {
      console.error('[MLService] Cost anomaly detection failed:', error);
      throw error;
    }
  },

  /**
   * Get cost anomaly results
   */
  getCostAnomalies: async () => {
    try {
      console.log('[MLService] Fetching cost anomaly results...');
      
      const data = await mlApi.getCostAnomalies();
      
      console.log('[MLService] Cost anomalies loaded');
      return data || [];
    } catch (error) {
      console.error('[MLService] Failed to get cost anomalies:', error);
      throw error;
    }
  },

  /**
   * Detect duplicate projects
   */
  detectDuplicates: async () => {
    try {
      console.log('[MLService] Triggering duplicate detection...');
      
      const result = await mlApi.detectDuplicates();
      
      console.log('[MLService] Duplicate detection started');
      return result;
    } catch (error) {
      console.error('[MLService] Duplicate detection failed:', error);
      throw error;
    }
  },

  /**
   * Get duplicate detection results
   */
  getDuplicates: async () => {
    try {
      console.log('[MLService] Fetching duplicate results...');
      
      const data = await mlApi.getDuplicates();
      
      console.log(`[MLService] Found ${data?.length || 0} duplicate pairs`);
      return data || [];
    } catch (error) {
      console.error('[MLService] Failed to get duplicates:', error);
      throw error;
    }
  },

  /**
   * Predict project delays
   */
  predictDelays: async () => {
    try {
      console.log('[MLService] Triggering delay prediction...');
      
      const result = await mlApi.predictDelays();
      
      console.log('[MLService] Delay prediction started');
      return result;
    } catch (error) {
      console.error('[MLService] Delay prediction failed:', error);
      throw error;
    }
  },

  /**
   * Get delay prediction results
   */
  getDelayPredictions: async () => {
    try {
      console.log('[MLService] Fetching delay predictions...');
      
      const data = await mlApi.getDelayPredictions();
      
      console.log('[MLService] Delay predictions loaded');
      return data || [];
    } catch (error) {
      console.error('[MLService] Failed to get delay predictions:', error);
      throw error;
    }
  },

  /**
   * Detect risk signals
   */
  detectSignals: async (projectId: string) => {
    try {
      console.log(`[MLService] Detecting signals for ${projectId}`);
      
      const result = await mlApi.detectSignals(projectId);
      
      console.log('[MLService] Signal detection complete');
      return result;
    } catch (error) {
      console.error('[MLService] Signal detection failed:', error);
      throw error;
    }
  },

  /**
   * Get active risk signals
   */
  getActiveSignals: async () => {
    try {
      console.log('[MLService] Fetching active signals...');
      
      const data = await mlApi.getActiveSignals();
      
      console.log(`[MLService] Found ${data?.length || 0} active signals`);
      return data || [];
    } catch (error) {
      console.error('[MLService] Failed to get active signals:', error);
      throw error;
    }
  },

  /**
   * Get ML recommendations
   */
  getRecommendations: async (projectId: string) => {
    try {
      console.log(`[MLService] Getting recommendations for ${projectId}`);
      
      const data = await mlApi.getRecommendations(projectId);
      
      console.log('[MLService] Recommendations retrieved');
      return data || [];
    } catch (error) {
      console.error('[MLService] Failed to get recommendations:', error);
      throw error;
    }
  },

  /**
   * Get investigation priorities
   */
  getInvestigationPriorities: async () => {
    try {
      console.log('[MLService] Fetching investigation priorities...');
      
      const data = await mlApi.getInvestigationPriorities();
      
      console.log('[MLService] Priorities loaded');
      return data || [];
    } catch (error) {
      console.error('[MLService] Failed to get priorities:', error);
      throw error;
    }
  },
};

// ==================== ALERTS ====================

export const alertService = {
  /**
   * Get all risk alerts
   */
  getAll: async (filters?: { status?: string; severity?: string }) => {
    try {
      console.log('[AlertService] Fetching alerts...');
      
      const data = await alertApi.getAll(filters);
      
      console.log(`[AlertService] Found ${data?.length || 0} alerts`);
      return data || [];
    } catch (error) {
      console.error('[AlertService] Failed to get alerts:', error);
      throw error;
    }
  },

  /**
   * Get alerts for specific project
   */
  getByProject: async (projectId: string) => {
    try {
      console.log(`[AlertService] Fetching alerts for ${projectId}`);
      
      const data = await alertApi.getByProject(projectId);
      
      console.log(`[AlertService] Found ${data?.length || 0} alerts`);
      return data || [];
    } catch (error) {
      console.error('[AlertService] Failed to get project alerts:', error);
      throw error;
    }
  },

  /**
   * Acknowledge alert
   */
  acknowledge: async (alertId: string) => {
    try {
      console.log(`[AlertService] Acknowledging alert ${alertId}`);
      
      await alertApi.acknowledge(alertId);
      
      console.log('[AlertService] Alert acknowledged');
    } catch (error) {
      console.error('[AlertService] Failed to acknowledge alert:', error);
      throw error;
    }
  },
};

// ==================== ACTIVITY & AUDIT ====================

export const auditService = {
  /**
   * Get activity logs
   */
  getActivityLogs: async (filters?: { user?: string; limit?: number }) => {
    try {
      console.log('[AuditService] Fetching activity logs...');
      
      const data = await auditApi.getLogs(filters);
      
      console.log(`[AuditService] Found ${data?.length || 0} logs`);
      return data || [];
    } catch (error) {
      console.error('[AuditService] Failed to get logs:', error);
      throw error;
    }
  },

  /**
   * Get specific audit log
   */
  getLog: async (logId: string) => {
    try {
      console.log(`[AuditService] Fetching log ${logId}`);
      
      const data = await auditApi.getById(logId);
      
      console.log('[AuditService] Log retrieved');
      return data;
    } catch (error) {
      console.error('[AuditService] Failed to get log:', error);
      throw error;
    }
  },
};
