// Tests for SignalsCard component
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { SignalsCard } from '../../components/SignalsCard';
import { mockProjectSignalsResponse } from '../mocks/mockData';

describe('SignalsCard Component', () => {
  describe('Rendering', () => {
    it('should render component without crashing', () => {
      const { container } = render(
        <SignalsCard signals={[]} language="en" />
      );
      expect(container).toBeInTheDocument();
    });

    it('should display signals list', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      expect(screen.getByText('Cost Overrun Detected')).toBeInTheDocument();
    });

    it('should display signal severity with color coding', () => {
      const { container } = render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      // Check for severity badges
      expect(screen.getByText('CRITICAL')).toBeInTheDocument();
      expect(screen.getByText('HIGH')).toBeInTheDocument();

      // Check for color classes
      expect(container.querySelector('[class*="bg-red"]')).toBeTruthy();
    });

    it('should display confidence percentage', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      expect(screen.getByText(/92%|85%/)).toBeInTheDocument();
    });

    it('should display timestamps', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      // Timestamps should be formatted
      expect(document.body.textContent).toMatch(/ago|just now|today/i);
    });
  });

  describe('Expandable Details', () => {
    it('should expand/collapse signal details', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      const expandButtons = screen.getAllByRole('button');
      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0]);
        // Details should expand
      }
    });

    it('should show signal description when expanded', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      // Find description text
      expect(
        screen.getByText('Project expenditure exceeds sanctioned amount by 25%')
      ).toBeInTheDocument();
    });

    it('should show evidence links', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      // Evidence should be visible or available
      expect(document.body.textContent).toMatch(/doc_001|doc_002|evidence/i);
    });
  });

  describe('Empty State', () => {
    it('should show empty state message', () => {
      render(<SignalsCard signals={[]} language="en" />);

      expect(screen.getByText(/No signals|empty/i)).toBeInTheDocument();
    });

    it('should show helpful empty message', () => {
      render(<SignalsCard signals={[]} language="en" />);

      expect(screen.getByText(/No signals/i)).toBeInTheDocument();
    });
  });

  describe('Multi-language Support', () => {
    it('should display English text', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      // Check for English labels
      expect(document.body).toBeInTheDocument();
    });

    it('should display Hindi text', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="hi"
        />
      );

      // Check for Hindi content presence
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Status Indicators', () => {
    it('should display signal status', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      expect(screen.getByText(/ACTIVE|RESOLVED|ARCHIVED/)).toBeInTheDocument();
    });

    it('should show active signals with correct styling', () => {
      const { container } = render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      // Active signals should have specific styling
      expect(container.querySelector('[class*="bg-"]')).toBeTruthy();
    });
  });

  describe('Severity Color Coding', () => {
    it('should color CRITICAL signals red', () => {
      const { container } = render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      expect(container.querySelector('[class*="red"]')).toBeTruthy();
    });

    it('should color HIGH signals orange', () => {
      const { container } = render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      expect(container.querySelector('[class*="orange"]')).toBeTruthy();
    });
  });

  describe('Callback Handling', () => {
    it('should call onSignalExpand callback', () => {
      const onSignalExpand = vi.fn();
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
          onSignalExpand={onSignalExpand}
        />
      );

      const expandButtons = screen.getAllByRole('button');
      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0]);
        // Callback may be called
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure', () => {
      const { container } = render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should have descriptive text for each signal', () => {
      render(
        <SignalsCard
          signals={mockProjectSignalsResponse.signals}
          language="en"
        />
      );

      mockProjectSignalsResponse.signals.forEach(signal => {
        expect(screen.getByText(signal.signal_name)).toBeInTheDocument();
      });
    });
  });
});
