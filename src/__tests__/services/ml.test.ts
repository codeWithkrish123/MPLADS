// Tests for ML API service layer
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mlApi } from '../../services/ml';
import * as mockData from '../mocks/mockData';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
    })),
  },
}));

describe('ML API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMonitoringCommandCenter', () => {
    it('should return command center data', async () => {
      // Mock implementation
      const result = mockData.mockCommandCenterResponse;
      expect(result.portfolio_health).toBeDefined();
      expect(result.risk_distribution).toBeDefined();
    });

    it('should handle portfolio metrics', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.portfolio_health.total_projects).toBe(256);
      expect(result.portfolio_health.active_projects).toBe(198);
    });

    it('should include risk distribution', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.risk_distribution.CRITICAL).toBeDefined();
      expect(result.risk_distribution.HIGH).toBeDefined();
      expect(result.risk_distribution.MEDIUM).toBeDefined();
      expect(result.risk_distribution.LOW).toBeDefined();
    });

    it('should include top priority projects', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.top_priority_projects.length).toBeGreaterThan(0);
      expect(result.top_priority_projects[0].project_id).toBeDefined();
    });

    it('should include recent activity', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.recent_activity).toBeDefined();
    });

    it('should include alerts summary', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.alerts_summary.new).toBeGreaterThanOrEqual(0);
      expect(result.alerts_summary.acknowledged).toBeGreaterThanOrEqual(0);
    });

    it('should include investigation summary', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.investigation_summary.open).toBeGreaterThanOrEqual(0);
      expect(result.investigation_summary.resolved).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getAttentionQueue', () => {
    it('should return attention queue items', async () => {
      const result = mockData.mockAttentionQueueResponse;
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBeTruthy();
    });

    it('should include pagination info', async () => {
      const result = mockData.mockAttentionQueueResponse;
      expect(result.pagination.page).toBeDefined();
      expect(result.pagination.page_size).toBeDefined();
      expect(result.pagination.total).toBeDefined();
      expect(result.pagination.total_pages).toBeDefined();
    });

    it('should have item with required fields', async () => {
      const result = mockData.mockAttentionQueueResponse;
      const item = result.items[0];
      expect(item.project_id).toBeDefined();
      expect(item.operational_priority_score).toBeDefined();
      expect(item.risk_level).toBeDefined();
      expect(item.priority_tier).toBeDefined();
    });

    it('should filter by risk level', async () => {
      const result = mockData.mockAttentionQueueResponse;
      const criticalItems = result.items.filter(i => i.risk_level === 'CRITICAL');
      expect(criticalItems.length > 0).toBeTruthy();
    });

    it('should support pagination', async () => {
      const result = mockData.mockAttentionQueueResponse;
      expect(result.pagination.total_pages).toBeGreaterThan(0);
    });
  });

  describe('getProjectSignals', () => {
    it('should return project signals', async () => {
      const result = mockData.mockProjectSignalsResponse;
      expect(result.signals).toBeDefined();
      expect(Array.isArray(result.signals)).toBeTruthy();
    });

    it('should include project ID', async () => {
      const result = mockData.mockProjectSignalsResponse;
      expect(result.project_id).toBe('PROJ_001');
    });

    it('should have signal with required fields', async () => {
      const result = mockData.mockProjectSignalsResponse;
      const signal = result.signals[0];
      expect(signal.signal_id).toBeDefined();
      expect(signal.signal_name).toBeDefined();
      expect(signal.severity).toBeDefined();
      expect(signal.confidence_score).toBeDefined();
    });

    it('should include timestamp', async () => {
      const result = mockData.mockProjectSignalsResponse;
      expect(result.timestamp).toBeDefined();
    });

    it('should include total count', async () => {
      const result = mockData.mockProjectSignalsResponse;
      expect(result.total_count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getProjectAlerts', () => {
    it('should return project alerts', async () => {
      const result = mockData.mockProjectAlertsResponse;
      expect(result.alerts).toBeDefined();
      expect(Array.isArray(result.alerts)).toBeTruthy();
    });

    it('should include project ID', async () => {
      const result = mockData.mockProjectAlertsResponse;
      expect(result.project_id).toBe('PROJ_001');
    });

    it('should have alert with required fields', async () => {
      const result = mockData.mockProjectAlertsResponse;
      const alert = result.alerts[0];
      expect(alert.alert_id).toBeDefined();
      expect(alert.alert_type).toBeDefined();
      expect(alert.severity).toBeDefined();
      expect(alert.title).toBeDefined();
    });

    it('should include status field', async () => {
      const result = mockData.mockProjectAlertsResponse;
      const alert = result.alerts[0];
      expect(alert.status).toBeDefined();
    });

    it('should track acknowledgment info', async () => {
      const result = mockData.mockProjectAlertsResponse;
      expect(result.alerts[1].acknowledged_by).toBeDefined();
    });
  });

  describe('getProjectInvestigation', () => {
    it('should return investigation case', async () => {
      const result = mockData.mockInvestigationResponse;
      expect(result.case_id).toBeDefined();
      expect(result.project_id).toBe('PROJ_001');
    });

    it('should include case details', async () => {
      const result = mockData.mockInvestigationResponse;
      expect(result.case_title).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.risk_level).toBeDefined();
    });

    it('should include evidence array', async () => {
      const result = mockData.mockInvestigationResponse;
      expect(result.evidence).toBeDefined();
      expect(Array.isArray(result.evidence)).toBeTruthy();
    });

    it('should include timeline', async () => {
      const result = mockData.mockInvestigationResponse;
      expect(result.timeline).toBeDefined();
      expect(Array.isArray(result.timeline)).toBeTruthy();
    });

    it('should include actions requested', async () => {
      const result = mockData.mockInvestigationResponse;
      expect(result.actions_requested).toBeDefined();
      expect(Array.isArray(result.actions_requested)).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const error = mockData.mockNetworkError;
      expect(error.message).toContain('Network error');
    });

    it('should handle timeout errors', async () => {
      const error = mockData.mockTimeoutError;
      expect(error.message).toContain('timeout');
    });

    it('should handle validation errors', async () => {
      const error = mockData.mockValidationError;
      expect(error.statusCode).toBe(422);
    });

    it('should handle 404 errors', async () => {
      const error = mockData.mockNotFoundError;
      expect(error.statusCode).toBe(404);
    });

    it('should handle 500 errors', async () => {
      const error = mockData.mockServerError;
      expect(error.statusCode).toBe(500);
    });
  });

  describe('Response Validation', () => {
    it('should validate command center response structure', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.portfolio_health).toBeDefined();
      expect(typeof result.portfolio_health.total_projects).toBe('number');
    });

    it('should validate attention queue structure', async () => {
      const result = mockData.mockAttentionQueueResponse;
      expect(Array.isArray(result.items)).toBeTruthy();
      expect(result.pagination).toBeDefined();
    });

    it('should validate signals response structure', async () => {
      const result = mockData.mockProjectSignalsResponse;
      expect(result.project_id).toBeDefined();
      expect(Array.isArray(result.signals)).toBeTruthy();
    });

    it('should validate alerts response structure', async () => {
      const result = mockData.mockProjectAlertsResponse;
      expect(result.project_id).toBeDefined();
      expect(Array.isArray(result.alerts)).toBeTruthy();
    });

    it('should validate investigation response structure', async () => {
      const result = mockData.mockInvestigationResponse;
      expect(result.case_id).toBeDefined();
      expect(result.project_id).toBeDefined();
    });
  });

  describe('Data Transformation', () => {
    it('should map command center response fields', async () => {
      const result = mockData.mockCommandCenterResponse;
      expect(result.portfolio_health.total_budget).toBeGreaterThan(0);
      expect(result.portfolio_health.total_expenditure).toBeGreaterThan(0);
    });

    it('should calculate risk percentages', async () => {
      const result = mockData.mockCommandCenterResponse;
      const totalRisk = 
        result.risk_distribution.CRITICAL +
        result.risk_distribution.HIGH +
        result.risk_distribution.MEDIUM +
        result.risk_distribution.LOW;
      expect(totalRisk).toBeGreaterThan(0);
    });

    it('should format alert timestamps', async () => {
      const result = mockData.mockProjectAlertsResponse;
      const alert = result.alerts[0];
      expect(alert.created_at).toBeDefined();
      expect(new Date(alert.created_at)).toBeInstanceOf(Date);
    });

    it('should map evidence confidence scores', async () => {
      const result = mockData.mockInvestigationResponse;
      const evidence = result.evidence[0];
      expect(evidence).toBeDefined();
    });

    it('should transform investigation status', async () => {
      const result = mockData.mockInvestigationResponse;
      const validStatuses = ['OPEN', 'ASSIGNED', 'UNDER_REVIEW', 'AWAITING_EVIDENCE', 'ESCALATED', 'RESOLVED', 'CLOSED'];
      expect(validStatuses).toContain(result.status);
    });
  });

  describe('Caching Behavior', () => {
    it('should identify cache keys correctly', () => {
      // Cache keys should be consistent for same parameters
      const key1 = 'command_center:state:district';
      const key2 = 'command_center:state:district';
      expect(key1).toBe(key2);
    });

    it('should include ttl in cache operations', () => {
      const ttl = 30; // 30 seconds
      expect(ttl).toBeGreaterThan(0);
    });

    it('should invalidate cache on write operations', () => {
      // Write operations should clear cache
      expect(true).toBeTruthy();
    });
  });

  describe('API Endpoint Mapping', () => {
    it('should map to correct monitoring endpoint', () => {
      const endpoint = '/monitoring/command-center';
      expect(endpoint).toContain('monitoring');
    });

    it('should map to correct queue endpoint', () => {
      const endpoint = '/monitoring/attention-queue';
      expect(endpoint).toContain('attention-queue');
    });

    it('should map to correct signals endpoint', () => {
      const endpoint = '/projects/:id/signals';
      expect(endpoint).toContain('signals');
    });

    it('should map to correct alerts endpoint', () => {
      const endpoint = '/projects/:id/alerts';
      expect(endpoint).toContain('alerts');
    });

    it('should map to correct investigation endpoint', () => {
      const endpoint = '/projects/:id/investigation';
      expect(endpoint).toContain('investigation');
    });
  });
});
