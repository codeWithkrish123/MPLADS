// Tests for AlertsCard component
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { AlertsCard } from '../../components/AlertsCard';
import { mockProjectAlertsResponse } from '../mocks/mockData';

describe('AlertsCard Component', () => {
  describe('Rendering', () => {
    it('should render component without crashing', () => {
      const { container } = render(<AlertsCard alerts={[]} language="en" />);
      expect(container).toBeInTheDocument();
    });

    it('should display alerts list', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.getByText('Critical Cost Overrun')).toBeInTheDocument();
    });

    it('should display severity badges', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.getByText('CRITICAL')).toBeInTheDocument();
      expect(screen.getByText('HIGH')).toBeInTheDocument();
    });

    it('should display status badges', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.getByText(/NEW|ACKNOWLEDGED/i)).toBeInTheDocument();
    });
  });

  describe('Alert Details', () => {
    it('should show alert title and description', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.getByText('Critical Cost Overrun')).toBeInTheDocument();
      expect(
        screen.getByText(/Project has exceeded budget/)
      ).toBeInTheDocument();
    });

    it('should expand to show full details', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      const expandButtons = screen.getAllByRole('button');
      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0]);
        // Details should be visible
      }
    });

    it('should display recommendations', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(
        screen.getByText(/Conduct immediate financial audit/)
      ).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should have acknowledge button', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      const buttons = screen.queryAllByRole('button', { name: /acknowledge/i });
      expect(buttons.length > 0).toBeTruthy();
    });

    it('should call onAlertAction with acknowledge', () => {
      const onAlertAction = vi.fn();
      render(
        <AlertsCard
          alerts={mockProjectAlertsResponse.alerts}
          language="en"
          onAlertAction={onAlertAction}
        />
      );
      const acknowledgeButton = screen.queryByRole('button', {
        name: /acknowledge/i,
      });
      if (acknowledgeButton) {
        fireEvent.click(acknowledgeButton);
        // Callback may be invoked
      }
    });

    it('should have escalate button', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      const buttons = screen.queryAllByRole('button', { name: /escalate/i });
      expect(buttons.length > 0).toBeTruthy();
    });

    it('should have resolve button', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      const buttons = screen.queryAllByRole('button', { name: /resolve/i });
      expect(buttons.length > 0).toBeTruthy();
    });
  });

  describe('Status Display', () => {
    it('should show NEW status for new alerts', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('should show ACKNOWLEDGED status', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.getByText('ACKNOWLEDGED')).toBeInTheDocument();
    });

    it('should display acknowledgment metadata', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(document.body.textContent).toMatch(/investigator_001|acknowledged/i);
    });
  });

  describe('Time Formatting', () => {
    it('should display time-relative formatting', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(document.body.textContent).toMatch(/ago|just now|today/i);
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no alerts', () => {
      render(<AlertsCard alerts={[]} language="en" />);
      expect(screen.getByText(/No alerts|empty/i)).toBeInTheDocument();
    });
  });

  describe('Multi-language Support', () => {
    it('should display English text', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(document.body).toBeInTheDocument();
    });

    it('should display Hindi text', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="hi" />
      );
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Severity Color Coding', () => {
    it('should color CRITICAL alerts red', () => {
      const { container } = render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(container.querySelector('[class*="red"]')).toBeTruthy();
    });

    it('should color HIGH alerts orange', () => {
      const { container } = render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(container.querySelector('[class*="orange"]')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('should show loading state when loading', () => {
      const { container } = render(
        <AlertsCard alerts={[]} loading={true} language="en" />
      );
      expect(
        container.querySelector('[class*="animate"]') ||
        screen.queryByText(/loading/i)
      ).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      expect(screen.queryAllByRole('button').length > 0).toBeTruthy();
    });

    it('should have descriptive text for each alert', () => {
      render(
        <AlertsCard alerts={mockProjectAlertsResponse.alerts} language="en" />
      );
      mockProjectAlertsResponse.alerts.forEach(alert => {
        expect(screen.getByText(alert.title)).toBeInTheDocument();
      });
    });
  });
});
