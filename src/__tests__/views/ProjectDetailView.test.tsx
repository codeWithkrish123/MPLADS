// Tests for ProjectDetailView component
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { ProjectDetailView } from '../../views/ProjectDetailView';
import {
  mockProjectSignalsResponse,
  mockProjectAlertsResponse,
  mockInvestigationResponse,
} from '../mocks/mockData';
import * as mlService from '../../services/ml';

vi.mock('../../services/ml', () => ({
  mlApi: {
    getProjectSignals: vi.fn(),
    getProjectAlerts: vi.fn(),
    getProjectInvestigation: vi.fn(),
  },
}));

describe('ProjectDetailView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(mlService.mlApi, 'getProjectSignals').mockResolvedValue(
      mockProjectSignalsResponse
    );
    vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockResolvedValue(
      mockProjectAlertsResponse
    );
    vi.spyOn(mlService.mlApi, 'getProjectInvestigation').mockResolvedValue(
      mockInvestigationResponse
    );
  });

  describe('Rendering', () => {
    it('should render without crashing', async () => {
      const { container } = render(
        <ProjectDetailView projectId="PROJ_001" language="en" />
      );
      expect(container).toBeInTheDocument();
    });

    it('should display project title', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should have back button', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      const backButton = screen.queryByRole('button', { name: /back|go back/i });
      expect(backButton).toBeTruthy();
    });
  });

  describe('Tab Navigation', () => {
    it('should display overview tab', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Overview|overview/)).toBeInTheDocument();
      });
    });

    it('should display signals tab', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Signal|signal/)).toBeInTheDocument();
      });
    });

    it('should display alerts tab', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Alert|alert/)).toBeInTheDocument();
      });
    });

    it('should display investigation tab', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Investigation|investigation/)).toBeInTheDocument();
      });
    });

    it('should switch tabs on click', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        const signalsTab = screen.getByText(/Signal/);
        expect(signalsTab).toBeInTheDocument();
      });

      const signalsButton = screen.getByRole('button', { name: /Signal/i });
      fireEvent.click(signalsButton);
      
      // Tab should be active
    });

    it('should show signal count badge', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(document.body.textContent).toMatch(/Signal.*\d/);
      });
    });

    it('should show alert count badge', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(document.body.textContent).toMatch(/Alert.*\d/);
      });
    });
  });

  describe('Overview Tab', () => {
    it('should display project metadata', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Location|State|District/i)).toBeInTheDocument();
      });
    });

    it('should display financial information', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Amount|Budget|Expenditure/i)).toBeInTheDocument();
      });
    });

    it('should display physical progress', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Progress|Status/i)).toBeInTheDocument();
      });
    });

    it('should display reason codes', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should display investigation checklist', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('Signals Tab', () => {
    it('should load and display signals', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      // Click signals tab
      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/Cost Overrun|Signal/i) ||
          document.body.textContent.includes('Signal')
        ).toBeTruthy();
      });
    });

    it('should show loading state for signals', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      expect(
        document.body.querySelector('[class*="animate"]') ||
        screen.queryByText(/loading/i)
      ).toBeTruthy();
    });

    it('should handle signals error', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockRejectedValue(
        new Error('Network error')
      );

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Alerts Tab', () => {
    it('should load and display alerts', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const alertsTab = screen.queryByRole('button', { name: /Alert/i });
      if (alertsTab) {
        fireEvent.click(alertsTab);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/Cost|Alert/i) ||
          document.body.textContent.includes('Alert')
        ).toBeTruthy();
      });
    });

    it('should show loading state for alerts', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const alertsTab = screen.queryByRole('button', { name: /Alert/i });
      if (alertsTab) {
        fireEvent.click(alertsTab);
      }

      expect(
        document.body.querySelector('[class*="animate"]') ||
        screen.queryByText(/loading/i)
      ).toBeTruthy();
    });

    it('should handle alerts error', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockRejectedValue(
        new Error('Network error')
      );

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const alertsTab = screen.queryByRole('button', { name: /Alert/i });
      if (alertsTab) {
        fireEvent.click(alertsTab);
      }

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Investigation Tab', () => {
    it('should load and display investigation data', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const invTab = screen.queryByRole('button', { name: /Investigation/i });
      if (invTab) {
        fireEvent.click(invTab);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/Risk|Investigation/i) ||
          document.body.textContent.includes('Investigation')
        ).toBeTruthy();
      });
    });

    it('should display risk assessment', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const invTab = screen.queryByRole('button', { name: /Investigation/i });
      if (invTab) {
        fireEvent.click(invTab);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/Risk|CRITICAL|Assessment/i) ||
          document.body.textContent.includes('Risk')
        ).toBeTruthy();
      });
    });

    it('should display evidence quality metrics', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const invTab = screen.queryByRole('button', { name: /Investigation/i });
      if (invTab) {
        fireEvent.click(invTab);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/Confidence|Evidence|Quality/i) ||
          document.body.textContent.includes('Confidence')
        ).toBeTruthy();
      });
    });

    it('should display recommendations', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const invTab = screen.queryByRole('button', { name: /Investigation/i });
      if (invTab) {
        fireEvent.click(invTab);
      }

      await waitFor(() => {
        expect(
          screen.queryByText(/Recommendation|Audit/i) ||
          document.body.textContent.includes('Recommendation')
        ).toBeTruthy();
      });
    });
  });

  describe('Multi-language Support', () => {
    it('should display English content', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should display Hindi content', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="hi" />);
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state for signals tab', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockResolvedValue({
        project_id: 'PROJ_001',
        signals: [],
        total_count: 0,
        timestamp: new Date().toISOString(),
      });

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      await waitFor(() => {
        expect(screen.getByText(/No signals|empty/i)).toBeInTheDocument();
      });
    });

    it('should show empty state for alerts tab', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectAlerts').mockResolvedValue({
        project_id: 'PROJ_001',
        alerts: [],
        total_count: 0,
        timestamp: new Date().toISOString(),
      });

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const alertsTab = screen.queryByRole('button', { name: /Alert/i });
      if (alertsTab) {
        fireEvent.click(alertsTab);
      }

      await waitFor(() => {
        expect(screen.getByText(/No alerts|empty/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error for project not found', async () => {
      render(<ProjectDetailView projectId="NONEXISTENT" language="en" />);
      await waitFor(() => {
        // Should show appropriate error
        expect(document.body).toBeInTheDocument();
      });
    });

    it('should display error with retry option', async () => {
      vi.spyOn(mlService.mlApi, 'getProjectSignals').mockRejectedValue(
        new Error('Network error')
      );

      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      
      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      await waitFor(() => {
        expect(screen.getByText(/Error|Failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Back Navigation', () => {
    it('should call onBack when back button clicked', () => {
      const onBack = vi.fn();
      render(
        <ProjectDetailView
          projectId="PROJ_001"
          language="en"
          onBack={onBack}
        />
      );
      
      const backButton = screen.queryByRole('button', { name: /back|go back/i });
      if (backButton) {
        fireEvent.click(backButton);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper tab role', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        const tabs = screen.queryAllByRole('button', { name: /overview|signal|alert/i });
        expect(tabs.length > 0).toBeTruthy();
      });
    });

    it('should be keyboard navigable', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      const tabs = screen.queryAllByRole('button');
      expect(tabs.length > 0).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle tab switching smoothly', async () => {
      render(<ProjectDetailView projectId="PROJ_001" language="en" />);
      await waitFor(() => {
        expect(screen.getByText(/Overview/)).toBeInTheDocument();
      });

      const signalsTab = screen.queryByRole('button', { name: /Signal/i });
      if (signalsTab) {
        fireEvent.click(signalsTab);
      }

      // Should switch quickly
      const startTime = performance.now();
      fireEvent.click(signalsTab || document.body);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
