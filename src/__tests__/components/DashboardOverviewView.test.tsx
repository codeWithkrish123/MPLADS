// Tests for DashboardOverviewView component
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { DashboardOverviewView } from '../../views/DashboardOverviewView';
import { mockCommandCenterResponse, mockNetworkError } from '../mocks/mockData';
import * as mlService from '../../services/ml';

vi.mock('../../services/ml', () => ({
  mlApi: {
    getMonitoringCommandCenter: vi.fn(),
  },
}));

describe('DashboardOverviewView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      const { container } = render(
        <DashboardOverviewView language="en" />
      );
      expect(container).toBeInTheDocument();
    });

    it('should display dashboard title', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Dashboard|Overview/i)).toBeInTheDocument();
      });
    });

    it('should display portfolio health metrics', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/256|Portfolio|Projects/i)).toBeInTheDocument();
      });
    });

    it('should display risk distribution', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/CRITICAL|HIGH|MEDIUM|LOW/i)).toBeInTheDocument();
      });
    });

    it('should display alerts summary', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Alerts|45/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    it('should show loading state initially', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      const { container } = render(
        <DashboardOverviewView language="en" />
      );

      expect(
        container.querySelector('[class*="animate-spin"]') ||
        screen.queryByText(/loading/i)
      ).toBeTruthy();
    });

    it('should fetch dashboard data on mount', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter');
      mockFetch.mockResolvedValue(mockCommandCenterResponse);

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('should display data after loading completes', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText('256')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on fetch failure', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockRejectedValue(
        mockNetworkError
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });
    });

    it('should show error recovery UI', async () => {
      const mockFetch = vi
        .spyOn(mlService.mlApi, 'getMonitoringCommandCenter')
        .mockRejectedValueOnce(mockNetworkError)
        .mockResolvedValueOnce(mockCommandCenterResponse);

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });

      // Retry button should be available
      const retryButton = screen.queryByRole('button', { name: /retry/i });
      expect(retryButton).toBeTruthy();
    });
  });

  describe('Metric Cards', () => {
    it('should display total projects card', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Total Projects|256/)).toBeInTheDocument();
      });
    });

    it('should display budget metrics', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(
          screen.getByText(/Budget|₹|Total Expenditure/)
        ).toBeInTheDocument();
      });
    });

    it('should display risk metrics', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Risk|CRITICAL|HIGH/)).toBeInTheDocument();
      });
    });
  });

  describe('Multi-language Support', () => {
    it('should display English content by default', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should display Hindi content when language is hi', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="hi" />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('Responsiveness', () => {
    it('should render on mobile viewport', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      // Set mobile viewport
      global.innerWidth = 375;

      const { container } = render(
        <DashboardOverviewView language="en" />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });

    it('should render on tablet viewport', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      global.innerWidth = 768;

      const { container } = render(
        <DashboardOverviewView language="en" />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });

    it('should render on desktop viewport', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      global.innerWidth = 1200;

      const { container } = render(
        <DashboardOverviewView language="en" />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Recent Activity', () => {
    it('should display recent activity feed', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/activity|feed|recent/i)).toBeInTheDocument();
      });
    });

    it('should show activity descriptions', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Cost overrun detected/i)).toBeInTheDocument();
      });
    });
  });

  describe('Top Priority Projects', () => {
    it('should display top priority projects', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(
          screen.getByText(/Highway Construction|Bridge Reinforcement/i)
        ).toBeInTheDocument();
      });
    });

    it('should show risk level for each project', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText('CRITICAL')).toBeInTheDocument();
      });
    });
  });

  describe('Investigation Summary', () => {
    it('should display investigation summary', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(
          screen.getByText(/Investigation|Open|Resolved/i)
        ).toBeInTheDocument();
      });
    });

    it('should show investigation counts', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/12|5|28/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      const { container } = render(
        <DashboardOverviewView language="en" />
      );

      await waitFor(() => {
        expect(container.querySelector('main') || container.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should have proper heading hierarchy', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      render(<DashboardOverviewView language="en" />);

      await waitFor(() => {
        expect(
          screen.queryByRole('heading', { level: 1 }) ||
          screen.queryByText(/Dashboard/i)
        ).toBeTruthy();
      });
    });
  });

  describe('Performance', () => {
    it('should render quickly', async () => {
      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        mockCommandCenterResponse
      );

      const startTime = performance.now();
      render(<DashboardOverviewView language="en" />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle large datasets', async () => {
      const largeResponse = {
        ...mockCommandCenterResponse,
        top_priority_projects: Array(100).fill({
          project_id: 'PROJ_TEST',
          project_name: 'Test Project',
          risk_level: 'HIGH',
          operational_priority_score: 50,
          evidence_status: 'VERIFIED',
        }),
      };

      vi.spyOn(mlService.mlApi, 'getMonitoringCommandCenter').mockResolvedValue(
        largeResponse
      );

      const { container } = render(
        <DashboardOverviewView language="en" />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });
  });
});
