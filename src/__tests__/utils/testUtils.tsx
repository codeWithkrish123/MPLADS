// Test utilities and helpers
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Wrapper component for rendering with Router
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock API client
export const mockApiCall = async (url: string, data?: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data };
};

// Wait for element with custom timeout
export const waitForElementWithTimeout = async (
  callback: () => HTMLElement,
  timeout = 1000
) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      return callback();
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  throw new Error('Element not found within timeout');
};

// Create mock loader function
export const createMockLoader = <T,>(data: T, delayMs = 100) => {
  return async () => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return data;
  };
};

// Create mock error function
export const createMockErrorLoader = (error: Error, delayMs = 100) => {
  return async () => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    throw error;
  };
};

// Mock fetch response
export const mockFetchResponse = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

// Test data generator
export const generateMockProject = (overrides = {}) => ({
  project_id: 'PROJ_TEST',
  project_name: 'Test Project',
  state: 'Test State',
  district: 'Test District',
  work_category: 'Test Category',
  sanction_amount: 1000000,
  total_expenditure: 600000,
  composite_risk_score: 65,
  risk_level: 'MEDIUM',
  work_status: 'In Progress',
  physical_progress: 60,
  ...overrides,
});

export const generateMockSignal = (overrides = {}) => ({
  signal_id: 'SIG_TEST',
  signal_name: 'Test Signal',
  severity: 'MEDIUM',
  confidence_score: 0.85,
  reason_code: 'TEST_REASON',
  description: 'Test signal description',
  evidence_links: [],
  created_at: new Date().toISOString(),
  status: 'ACTIVE',
  ...overrides,
});

export const generateMockAlert = (overrides = {}) => ({
  alert_id: 'ALERT_TEST',
  alert_type: 'test_alert',
  severity: 'MEDIUM',
  title: 'Test Alert',
  description: 'Test alert description',
  triggered_by_signal: 'SIG_TEST',
  created_at: new Date().toISOString(),
  status: 'NEW',
  ...overrides,
});

// Assertion helpers
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveText = (element: HTMLElement | null, text: string) => {
  expect(element).toHaveTextContent(text);
};

export const expectToBeVisible = (element: HTMLElement | null) => {
  expect(element).toBeVisible();
};

export const expectToHaveClass = (element: HTMLElement | null, className: string) => {
  expect(element).toHaveClass(className);
};

// Mock component renderer
export const renderComponentWithProps = (Component: React.ComponentType<any>, props = {}) => {
  return render(<Component {...props} />);
};
