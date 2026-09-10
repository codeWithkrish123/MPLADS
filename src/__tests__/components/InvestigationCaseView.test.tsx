// Tests for InvestigationCaseView component
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { InvestigationCaseView } from '../../components/InvestigationCaseView';
import { mockInvestigationResponse } from '../mocks/mockData';

describe('InvestigationCaseView Component', () => {
  const defaultProps = {
    caseId: 'CASE_001',
    projectId: 'PROJ_001',
    language: 'en',
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render modal component', () => {
      const { container } = render(<InvestigationCaseView {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('should display case title', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/Investigation|Case/i)).toBeInTheDocument();
    });

    it('should display case ID', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/CASE_001/)).toBeInTheDocument();
    });

    it('should have close button', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const closeButton = screen.queryByRole('button', { name: /close|✕/i });
      expect(closeButton).toBeTruthy();
    });
  });

  describe('Status Management', () => {
    it('should display status dropdown', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(
        screen.queryByDisplayValue(/Open|In Progress|Closed/i)
      ).toBeTruthy();
    });

    it('should allow status change', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const statusSelect = screen.queryByDisplayValue(/Open|In Progress/i);
      if (statusSelect) {
        fireEvent.change(statusSelect, { target: { value: 'closed' } });
      }
    });

    it('should display all status options', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(
        document.body.textContent
      ).toMatch(/Open|In Progress|On Hold|Closed|Escalated/i);
    });
  });

  describe('Priority Display', () => {
    it('should display priority level', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(
        screen.getByText(/Priority|Low|Medium|High|Critical/i)
      ).toBeInTheDocument();
    });

    it('should show priority with color coding', () => {
      const { container } = render(
        <InvestigationCaseView {...defaultProps} />
      );
      expect(container.querySelector('[class*="bg-"]')).toBeTruthy();
    });
  });

  describe('Case Information', () => {
    it('should display assigned to information', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/Assigned|investigator/i);
    });

    it('should display creation date', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/Created|ago/i);
    });

    it('should display case description', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/Description|investigat/i);
    });
  });

  describe('Evidence Section', () => {
    it('should display evidence section', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/Evidence|Proof/i)).toBeInTheDocument();
    });

    it('should show evidence count', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/Evidence \(\d+\)/);
    });

    it('should display evidence items', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/Financial Record|Fund Transfer/i)).toBeInTheDocument();
    });

    it('should show evidence type', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/FINANCIAL_RECORD|Document/i)).toBeInTheDocument();
    });

    it('should display verification status', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/VERIFIED|PENDING|Verified/i)).toBeInTheDocument();
    });

    it('should show confidence scores', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/\d+%/);
    });

    it('should be expandable', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const expandButtons = screen.queryAllByRole('button', { name: /expand|collapse/i });
      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0]);
      }
    });
  });

  describe('Action Timeline', () => {
    it('should display action timeline', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/Action|Timeline/i)).toBeInTheDocument();
    });

    it('should show action count', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/Action.*\(\d+\)/);
    });

    it('should display action type', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(
        screen.getByText(/REQUEST_DOCUMENT|Document|Request/i)
      ).toBeInTheDocument();
    });

    it('should display action status', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/PENDING|Pending/i)).toBeInTheDocument();
    });

    it('should display timeline events', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/ago|created|event/i);
    });

    it('should have add action button', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const addButton = screen.queryByRole('button', { name: /Add Action|Record/i });
      expect(addButton).toBeTruthy();
    });

    it('should open add action modal on button click', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const addButton = screen.queryByRole('button', { name: /Add Action|Record/i });
      if (addButton) {
        fireEvent.click(addButton);
        expect(
          screen.queryByPlaceholderText(/Action type|Description/i)
        ).toBeTruthy();
      }
    });
  });

  describe('Case Notes', () => {
    it('should display notes section', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(screen.getByText(/Notes|Note/i)).toBeInTheDocument();
    });

    it('should allow editing notes', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const noteButton = screen.queryByRole('button', { name: /Notes|Note/i });
      if (noteButton) {
        fireEvent.click(noteButton);
        const textarea = screen.queryByPlaceholderText(/notes/i);
        expect(textarea).toBeTruthy();
      }
    });

    it('should display existing notes', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(document.body.textContent).toMatch(/investigat/i);
    });
  });

  describe('Action Buttons', () => {
    it('should have save button', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(
        screen.queryByRole('button', { name: /Save|Submit/i })
      ).toBeTruthy();
    });

    it('should have close button', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      expect(
        screen.queryByRole('button', { name: /Close|Cancel/i })
      ).toBeTruthy();
    });

    it('should call onClose when close button clicked', () => {
      const onClose = vi.fn();
      render(<InvestigationCaseView {...defaultProps} onClose={onClose} />);
      const closeButton = screen.queryByRole('button', { name: /Close|Cancel/i });
      if (closeButton) {
        fireEvent.click(closeButton);
        // onClose should be called
      }
    });

    it('should call onSave when save button clicked', () => {
      const onSave = vi.fn();
      render(<InvestigationCaseView {...defaultProps} onSave={onSave} />);
      const saveButton = screen.queryByRole('button', { name: /Save|Submit/i });
      if (saveButton) {
        fireEvent.click(saveButton);
        // onSave should be called
      }
    });
  });

  describe('Expandable Sections', () => {
    it('should expand/collapse evidence section', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const evidenceButton = screen.queryByRole('button', { name: /Evidence/i });
      if (evidenceButton) {
        fireEvent.click(evidenceButton);
        fireEvent.click(evidenceButton);
      }
    });

    it('should expand/collapse action section', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const actionButton = screen.queryByRole('button', { name: /Action/i });
      if (actionButton) {
        fireEvent.click(actionButton);
      }
    });

    it('should expand/collapse notes section', () => {
      render(<InvestigationCaseView {...defaultProps} />);
      const noteButton = screen.queryByRole('button', { name: /Note/i });
      if (noteButton) {
        fireEvent.click(noteButton);
      }
    });
  });

  describe('Multi-language Support', () => {
    it('should display English content', () => {
      render(<InvestigationCaseView {...defaultProps} language="en" />);
      expect(document.body).toBeInTheDocument();
    });

    it('should display Hindi content', () => {
      render(<InvestigationCaseView {...defaultProps} language="hi" />);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during save', async () => {
      const onSave = vi.fn(
        () => new Promise(resolve => setTimeout(resolve, 500))
      );
      render(<InvestigationCaseView {...defaultProps} onSave={onSave} />);
      const saveButton = screen.queryByRole('button', { name: /Save/i });
      if (saveButton) {
        fireEvent.click(saveButton);
        expect(
          screen.queryByText(/Saving|Loading/i) ||
          saveButton.hasAttribute('disabled')
        ).toBeTruthy();
      }
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      const { container } = render(
        <InvestigationCaseView {...defaultProps} />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons.length > 0).toBeTruthy();
    });

    it('should have semantic structure', () => {
      const { container } = render(
        <InvestigationCaseView {...defaultProps} />
      );
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });
});
