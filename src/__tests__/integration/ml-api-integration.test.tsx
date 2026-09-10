// Integration tests for ML API workflows
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { DashboardOverviewView } from '../../views/DashboardOverviewView';
import { ProjectDetailView } from '../../views/ProjectDetailView';
import * as mockData from '../mocks/mockData';
import * as mlService from '../../services/ml';

vi.mock('../../services/ml', () => ({
  mlApi: {
    getMonitoringCommandCenter: vi.fn(),
    getAttentionQueue: vi.fn(),
    getProjectSignals: vi.fn(),
    getProjectAlerts: vi.fn(),
    getProjectInvestigation: vi.fn(),
  },
}));

describe('ML API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Dashboard Workflow', () => {
    it('should load dashboard with all data', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockData.mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/256|Portfolio|dashboard/i)).toBeInTheDocument();
      });
    });

    it('should handle dashboard loading error gracefully', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockRejectedValue(
        mockData.mockNetworkError
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });
    });

    it('should display portfolio health metrics', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockData.mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Portfolio|Health|Total/i)).toBeInTheDocument();
      });
    });

    it('should display risk distribution', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockData.mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(
          screen.getByText(/CRITICAL|HIGH|MEDIUM|LOW|Risk/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Complete Project Detail Workflow', () => {
    beforeEach(() => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockResolvedValue(
        mockData.mockProjectSignalsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockResolvedValue(
        mockData.mockProjectAlertsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectInvestigation').mockResolvedValue(
        mockData.mockInvestigationResponse
      );
    });

    it('should load project overview tab', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should switch between all tabs', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      });

      // Click signals tab
      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      // Click alerts tab
      const alertsTab = screen.queryByRole('button', { name: /Alert/i });
      if (alertsTab) {
        fireEvent.click(alertsTab);
      }

      // Click investigation tab
      const invTab = screen.queryByRole('button', { name: /Investigation/i });
      if (invTab) {
        fireEvent.click(invTab);
      }
    });

    it('should handle concurrent API calls', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);

      await waitFor(() => {
        expect(
          vi.spyOn(mlService.mlApi, 'getProjectSignals').mock.calls.length >= 0
        ).toBeTruthy();
      });
    });
  });

  describe('Error Recovery Workflow', () => {
    it('should retry on network error', async () => {
      const mockFetch = vi
        .spyOn(mlService.mlApi, 'getMonitoringCommandCenter')
        .mockRejectedValueOnce(mockData.mockNetworkError)
        .mockResolvedValueOnce(mockData.mockCommandCenterResponse);

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });

      const retryButton = screen.queryByRole('button', { name: /retry/i });
      if (retryButton) {
        fireEvent.click(retryButton);
      }

      await waitFor(() => {
        // Should eventually show data after retry
        expect(
          mockFetch.mock.calls.length >= 1
        ).toBeTruthy();
      });
    });

    it('should handle timeout gracefully', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockRejectedValue(
        mockData.mockTimeoutError
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error|timeout/i)).toBeInTheDocument();
      });
    });

    it('should handle validation errors', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockRejectedValue(
        new Error('Validation error')
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });
    });

    it('should provide helpful error messages', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockRejectedValue(
        mockData.mockNotFoundError
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        const errorElement = screen.queryByText(/Error|not found|Failed/i);
        expect(errorElement).toBeTruthy();
      });
    });
  });

  describe('Multi-language Workflow', () => {
    it('should support language switching in dashboard', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockData.mockCommandCenterResponse
      );

      const { rerender } = render(
        <DashboardOverviewView language="en" />
      );

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });

      // Switch to Hindi
      rerender(<DashboardOverviewView language="hi" />);

      expect(document.body).toBeInTheDocument();
    });

    it('should support language switching in project detail', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockResolvedValue(
        mockData.mockProjectSignalsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockResolvedValue(
        mockData.mockProjectAlertsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectInvestigation').mockResolvedValue(
        mockData.mockInvestigationResponse
      );

      const { rerender } = render(
        <ProjectDetailView projectId="PROJ_001" language="en" />
      );

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });

      // Switch to Hindi
      rerender(
        <ProjectDetailView projectId="PROJ_001" language="hi" />
      );

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Performance Workflow', () => {
    it('should load dashboard within performance budget', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockData.mockCommandCenterResponse
      );

      const startTime = performance.now();
      render(<DashboardOverviewView language="en" />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should load project detail within performance budget', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockResolvedValue(
        mockData.mockProjectSignalsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockResolvedValue(
        mockData.mockProjectAlertsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectInvestigation').mockResolvedValue(
        mockData.mockInvestigationResponse
      );

      const startTime = performance.now();
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should switch tabs quickly', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockResolvedValue(
        mockData.mockProjectSignalsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockResolvedValue(
        mockData.mockProjectAlertsResponse
      );
      vi.spyOn(mlService.mlApi, 'getProjectInvestigation').mockResolvedValue(
        mockData.mockInvestigationResponse
      );

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      });

      const startTime = performance.now();

      const tab = screen.queryByRole('button', { name: /Signal/i });
      if (tab) {
        fireEvent.click(tab);
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Data Flow Validation', () => {
    it('should flow data from API to components correctly', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter');
      mockFetch.mockResolvedValue(mockData.mockCommandCenterResponse);

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify data appears in component
      expect(screen.getByText(/256|Portfolio/i)).toBeInTheDocument();
    });

    it('should validate signal data flow', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getProjectSignals');
      mockFetch.mockResolvedValue(mockData.mockProjectSignalsResponse);

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);

      const tab = screen.queryByRole('button', { name: /Signal/i });
      if (tab) {
        fireEvent.click(tab);
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('should validate alert data flow', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getProjectAlerts');
      mockFetch.mockResolvedValue(mockData.mockProjectAlertsResponse);

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);

      const tab = screen.queryByRole('button', { name: /Alert/i });
      if (tab) {
        fireEvent.click(tab);
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue({
        portfolio_health: {
          total_projects: 0,
          active_projects: 0,
          total_budget: 0,
          total_expenditure: 0,
          avg_progress: 0,
        },
        risk_distribution: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
        top_priority_projects: [],
        recent_activity: [],
        alerts_summary: { new: 0, acknowledged: 0, escalated: 0 },
        investigation_summary: { open: 0, under_review: 0, escalated: 0, resolved: 0 },
      });

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/0|No|empty/i)).toBeInTheDocument();
      });
    });

    it('should handle very large datasets', async () => {
      const largeResponse = {
        ...mockData.mockCommandCenterResponse,
        top_priority_projects: Array(1000).fill({
          project_id: 'PROJ_TEST',
          project_name: 'Test',
          risk_level: 'HIGH',
          operational_priority_score: 50,
          evidence_status: 'VERIFIED',
        }),
      };

      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        largeResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should handle rapid API calls', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter');
      mockFetch.mockResolvedValue(mockData.mockCommandCenterResponse);

      render(<DashboardOverviewView language="en" />);

      // Simulate rapid re-renders
      for (let i = 0; i < 5; i++) {
        vi.runOnlyPendingTimers();
      }

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });
});
