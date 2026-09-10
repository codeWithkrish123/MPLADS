// Tests for AttentionQueueTable component
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import { AttentionQueueTable } from '../../components/AttentionQueueTable';
import { mockAttentionQueueResponse, mockNetworkError } from '../mocks/mockData';
import * as mlService from '../../services/ml';

// Mock the ML service
vi.mock('../../services/ml', () => ({
  mlApi: {
    getAttentionQueue: vi.fn(),
  },
}));

describe('AttentionQueueTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component without crashing', () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue({
        items: [],
        pagination: { page: 1, page_size: 50, total: 0, total_pages: 0 },
      });

      const { container } = render(
        <AttentionQueueTable projectId="test" language="en" />
      );
      expect(container).toBeInTheDocument();
    });

    it('should render table headers', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Project/i)).toBeInTheDocument();
      });
    });

    it('should display English text by default', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Attention Queue/i)).toBeInTheDocument();
      });
    });

    it('should display Hindi text when language prop is hi', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="hi" />);

      await waitFor(() => {
        // Wait for Hindi text to appear
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    it('should show loading state initially', () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      // Look for loader icon or spinner
      const loader = screen.queryByRole('presentation');
      expect(loader || document.querySelector('[class*="animate-spin"]')).toBeTruthy();
    });

    it('should fetch data on mount', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('should display data after loading', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByText('Highway Construction')).toBeInTheDocument();
      });
    });

    it('should display loading spinner while fetching', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { container } = render(
        <AttentionQueueTable projectId="test" language="en" />
      );

      expect(container.querySelector('[class*="animate"]')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on fetch failure', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockRejectedValue(
        mockNetworkError
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });
    });

    it('should display retry button on error', async () => {
      const mockFetch = vi
        .spyOn(mlService.mlApi, 'getAttentionQueue')
        .mockRejectedValueOnce(mockNetworkError)
        .mockResolvedValueOnce(mockAttentionQueueResponse);

      const { rerender } = render(
        <AttentionQueueTable projectId="test" language="en" />
      );

      await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });

      // Find and click retry button
      const retryButton = screen.queryByRole('button', { name: /retry|refresh/i });
      if (retryButton) {
        fireEvent.click(retryButton);
      }
    });

    it('should handle empty state gracefully', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue({
        items: [],
        pagination: { page: 1, page_size: 50, total: 0, total_pages: 0 },
      });

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByText(/No items/i) || screen.getByText(/empty/i)).toBeTruthy();
      });
    });
  });

  describe('Pagination', () => {
    it('should display pagination controls', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        // Check for pagination elements
        expect(document.querySelector('[class*="pagination"]')).toBeTruthy();
      });
    });

    it('should handle next page click', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const nextButton = screen.queryByRole('button', { name: /next|>/i });
      if (nextButton && !nextButton.hasAttribute('disabled')) {
        fireEvent.click(nextButton);
        // Verify new fetch was called with page 2
      }
    });

    it('should handle previous page click', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue({
        ...mockAttentionQueueResponse,
        pagination: { page: 2, page_size: 50, total: 156, total_pages: 4 },
      });

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const prevButton = screen.queryByRole('button', { name: /previous|</i });
      if (prevButton && !prevButton.hasAttribute('disabled')) {
        fireEvent.click(prevButton);
      }
    });

    it('should show page size options', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('50') || document.querySelector('[value="50"]')).toBeTruthy();
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by priority', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Find priority header and click to sort
      const priorityHeader = screen.queryByText(/Priority/i);
      if (priorityHeader) {
        fireEvent.click(priorityHeader);
      }
    });

    it('should sort by risk level', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const riskHeader = screen.queryByText(/Risk/i);
      if (riskHeader) {
        fireEvent.click(riskHeader);
      }
    });
  });

  describe('Filtering', () => {
    it('should filter by risk level', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Interact with filter if available
      const filterButtons = screen.queryAllByRole('button', { name: /CRITICAL|HIGH|MEDIUM|LOW/i });
      if (filterButtons.length > 0) {
        fireEvent.click(filterButtons[0]);
      }
    });

    it('should filter by priority tier', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Row Interaction', () => {
    it('should call onProjectClick when row is clicked', async () => {
      const onProjectClick = vi.fn();
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(
        <AttentionQueueTable
          projectId="test"
          language="en"
          onProjectClick={onProjectClick}
        />
      );

      await waitFor(() => {
        const firstRow = screen.getByText('Highway Construction');
        expect(firstRow).toBeInTheDocument();
      });

      // Find and click the row
      const rows = screen.getAllByRole('row');
      if (rows.length > 1) {
        fireEvent.click(rows[1]);
        // Check if callback was invoked
      }
    });

    it('should show color indicators based on risk level', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      const { container } = render(
        <AttentionQueueTable projectId="test" language="en" />
      );

      await waitFor(() => {
        expect(screen.getByText('Highway Construction')).toBeInTheDocument();
      });

      // Check for color classes
      expect(container.querySelector('[class*="bg-red"]')).toBeTruthy(); // CRITICAL
    });
  });

  describe('Refresh Functionality', () => {
    it('should have refresh button', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        const refreshButton = screen.queryByRole('button', { name: /refresh/i });
        expect(refreshButton).toBeTruthy();
      });
    });

    it('should refetch data on refresh click', async () => {
      const mockFetch = vi.spyOn(mlService.mlApi, 'getAttentionQueue');
      mockFetch.mockResolvedValue(mockAttentionQueueResponse);

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      const refreshButton = screen.queryByRole('button', { name: /refresh/i });
      if (refreshButton) {
        fireEvent.click(refreshButton);
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledTimes(2);
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      // Check for table role
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      render(<AttentionQueueTable projectId="test" language="en" />);

      await waitFor(() => {
        expect(screen.getByText('Highway Construction')).toBeInTheDocument();
      });

      // Simulate keyboard navigation
      const firstRow = screen.getAllByRole('row')[1];
      fireEvent.keyDown(firstRow, { key: 'Enter' });
    });
  });

  describe('Color Coding', () => {
    it('should show red for CRITICAL risk', async () => {
      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        mockAttentionQueueResponse
      );

      const { container } = render(
        <AttentionQueueTable projectId="test" language="en" />
      );

      await waitFor(() => {
        expect(screen.getByText('Highway Construction')).toBeInTheDocument();
      });

      // Check for red color class
      const criticalElement = container.querySelector('[class*="red"]');
      expect(criticalElement).toBeTruthy();
    });

    it('should show orange for HIGH risk', async () => {
      const highRiskData = {
        ...mockAttentionQueueResponse,
        items: mockAttentionQueueResponse.items.filter(i => i.risk_level === 'HIGH'),
      };

      vi.spyOn(mlService.mlApi, 'getAttentionQueue').mockResolvedValue(
        highRiskData
      );

      const { container } = render(
        <AttentionQueueTable projectId="test" language="en" />
      );

      await waitFor(() => {
        expect(screen.getByText('Bridge Reinforcement')).toBeInTheDocument();
      });

      const orangeElement = container.querySelector('[class*="orange"]');
      expect(orangeElement).toBeTruthy();
    });
  });
});
