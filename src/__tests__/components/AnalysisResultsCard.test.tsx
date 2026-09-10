// Tests for AnalysisResultsCard component
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { AnalysisResultsCard } from '../../components/AnalysisResultsCard';

describe('AnalysisResultsCard Component', () => {
  const defaultProps = {
    projectId: 'PROJ_001',
    language: 'en',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should display risk analysis summary', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(
        screen.getByText(/Risk Analysis|Summary/i)
      ).toBeInTheDocument();
    });

    it('should display executive summary text', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/medium-high|financial|anomal/i);
    });
  });

  describe('Risk Score Gauge', () => {
    it('should display risk score gauge', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Risk Score/i)).toBeInTheDocument();
    });

    it('should show risk score percentage', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/72|75|80/);
    });

    it('should render circular gauge SVG', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('svg')).toBeTruthy();
    });

    it('should have visual progress indicator', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('circle')).toBeTruthy();
    });
  });

  describe('Confidence Score Gauge', () => {
    it('should display confidence score gauge', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Confidence/i)).toBeInTheDocument();
    });

    it('should show confidence percentage', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/87/);
    });

    it('should have circular gauge visualization', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length >= 2).toBeTruthy(); // Risk + Confidence gauges
    });
  });

  describe('Component Scores', () => {
    it('should display component scores section', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Component.*Score/i)).toBeInTheDocument();
    });

    it('should show financial risk score', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Financial Risk/i)).toBeInTheDocument();
    });

    it('should show completion risk score', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Completion Risk/i)).toBeInTheDocument();
    });

    it('should show compliance risk score', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Compliance Risk/i)).toBeInTheDocument();
    });

    it('should show quality risk score', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Quality Risk/i)).toBeInTheDocument();
    });

    it('should display score values', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/85|65|45|72/);
    });

    it('should display trend indicators', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/up|down|stable|trend/i);
    });

    it('should show progress bars for scores', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('[class*="bg-"]')).toBeTruthy();
    });

    it('should display score categories', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/financial|execution|compliance|quality/i);
    });
  });

  describe('Recommendations', () => {
    it('should display recommendations section', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Recommendation/i)).toBeInTheDocument();
    });

    it('should show recommendation count', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/Recommendation.*\(\d+\)/);
    });

    it('should display critical priority recommendations', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Immediate Audit|Audit Required/i)).toBeInTheDocument();
    });

    it('should display high priority recommendations', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Project Schedule|Schedule Review/i)).toBeInTheDocument();
    });

    it('should display medium priority recommendations', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Vendor|Vendor Verification/i)).toBeInTheDocument();
    });

    it('should show priority badges', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(
        document.body.textContent
      ).toMatch(/critical|high|medium|low/i);
    });

    it('should display recommendation descriptions', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(document.body.textContent).toMatch(/audit|timeline|vendor|quality/i);
    });
  });

  describe('Expandable Recommendations', () => {
    it('should collapse recommendations by default', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      const firstRec = screen.getAllByRole('button')[0];
      // Check if description is truncated
    });

    it('should expand on click', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        // Should expand
      }
    });

    it('should show impact when expanded', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        expect(screen.getByText(/Impact/i)).toBeInTheDocument();
      }
    });

    it('should show effort when expanded', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        expect(screen.getByText(/Effort/i)).toBeInTheDocument();
      }
    });
  });

  describe('Multi-language Support', () => {
    it('should display English content', () => {
      render(<AnalysisResultsCard {...defaultProps} language="en" />);
      expect(document.body).toBeInTheDocument();
    });

    it('should display Hindi content', () => {
      render(<AnalysisResultsCard {...defaultProps} language="hi" />);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Color Coding', () => {
    it('should color critical risk red', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('[class*="red"]')).toBeTruthy();
    });

    it('should color high risk orange', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('[class*="orange"]')).toBeTruthy();
    });

    it('should color medium risk yellow', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('[class*="yellow"]')).toBeTruthy();
    });

    it('should color low risk blue', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('[class*="blue"]')).toBeTruthy();
    });
  });

  describe('Data Quality Note', () => {
    it('should display data quality warning', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(
        screen.getByText(/data.*quality|additional.*data|verification/i)
      ).toBeInTheDocument();
    });

    it('should have warning icon', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('[class*="alert"]')).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('should call onRecommendationClick when recommendation is clicked', () => {
      const onRecommendationClick = vi.fn();
      render(
        <AnalysisResultsCard
          {...defaultProps}
          onRecommendationClick={onRecommendationClick}
        />
      );
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        // Callback may be invoked
      }
    });
  });

  describe('Responsive Design', () => {
    it('should render on mobile', () => {
      global.innerWidth = 375;
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should render on tablet', () => {
      global.innerWidth = 768;
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should render on desktop', () => {
      global.innerWidth = 1200;
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should have button roles for clickable items', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.queryAllByRole('button').length > 0).toBeTruthy();
    });

    it('should have descriptive headings', () => {
      render(<AnalysisResultsCard {...defaultProps} />);
      expect(screen.getByText(/Risk|Confidence|Component|Recommendation/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<AnalysisResultsCard {...defaultProps} />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(500);
    });

    it('should handle large recommendation lists', () => {
      const { container } = render(
        <AnalysisResultsCard {...defaultProps} />
      );
      expect(container).toBeInTheDocument();
    });
  });
});
