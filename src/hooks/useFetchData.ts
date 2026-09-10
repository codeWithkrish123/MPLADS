/**
 * Custom Hook for Data Fetching
 * 
 * Handles:
 * - Loading state
 * - Error state
 * - Retry logic
 * - Auto-refresh capability
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProjects } from '../services/projectService';
import { alertService } from '../services/analysisService';

export interface UseFetchOptions {
  refetchInterval?: number; // milliseconds
  retryCount?: number;
  onError?: (error: Error) => void;
  skip?: boolean;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic data fetching hook
 * @param fetcher - Async function that returns data
 * @param options - Configuration options
 * @returns Data, loading state, error, and refetch function
 */
export function useFetchData<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const {
    refetchInterval,
    retryCount = 3,
    onError,
    skip = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);
  const retryRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false); // Prevent duplicate fetches in StrictMode
  const fetcherRef = useRef(fetcher);

  // Update fetcher ref without causing effect re-runs
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const fetchData = useCallback(async () => {
    if (skip || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    retryRef.current = 0;

    const attemptFetch = async () => {
      try {
        console.log('[useFetchData] Fetching data (attempt', retryRef.current + 1, ')');
        
        const result = await fetcherRef.current();
        
        setData(result);
        setError(null);
        retryRef.current = 0;
        
        console.log('[useFetchData] Fetch successful');
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (retryRef.current < retryCount) {
          retryRef.current++;
          console.log(`[useFetchData] Retry ${retryRef.current}/${retryCount}...`);
          
          // Wait before retry (exponential backoff)
          await new Promise(r => setTimeout(r, 1000 * retryRef.current));
          return attemptFetch();
        }

        setError(error);
        console.error('[useFetchData] Fetch failed:', error.message);
        onError?.(error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    await attemptFetch();
  }, [retryCount, skip, onError]);

  // Initial fetch on mount only (with ref to prevent StrictMode double-fetch)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    // In StrictMode, useEffect runs twice. Only fetch once on mount.
    if (!hasInitializedRef.current && !skip) {
      hasInitializedRef.current = true;
      fetchData();
    }
  }, []); // Empty dependency array - run only once on mount

  // Auto-refresh interval (separate from initial fetch)
  useEffect(() => {
    if (!refetchInterval || skip) return;

    console.log(`[useFetchData] Auto-refresh enabled (${refetchInterval}ms)`);

    intervalRef.current = setInterval(() => {
      console.log('[useFetchData] Auto-refreshing data');
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refetchInterval, skip, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}


/**
 * Specialized hook for projects data
 * Only fetches if explicitly enabled (prevents auto-fetch before login)
 */
export function useFetchProjects(filters?: any) {
  return useFetchData<{
    projects: any[];
    total: number;
    page: number;
    limit: number;
  }>(
    () => fetchProjects(filters),
    {
      skip: false, // ✅ FIX: Allow initial fetch (App.tsx controls when to call)
      refetchInterval: 60000, // Refresh every minute
      retryCount: 3,
    }
  );
}

/**
 * Specialized hook for alerts
 * Only fetches if explicitly enabled (prevents auto-fetch before login)
 */
export function useFetchAlerts() {
  return useFetchData<any[]>(
    () => alertService.getAll(),
    {
      skip: false, // ✅ FIX: Allow initial fetch (App.tsx controls when to call)
      refetchInterval: undefined, // Disabled: was causing 4-8 requests/30s with retries
      retryCount: 1, // Reduced from 3 to prevent retry storm on 404
    }
  );
}

/**
 * Specialized hook for dashboard metrics
 * Fetches real monitoring data from backend ML API
 */
export function useFetchDashboardMetrics() {
  const { mlApi } = require('../services/ml');
  const { ResponseMappers } = require('../utils/ml-response-mappers');

  return useFetchData(
    async () => {
      try {
        // Fetch command center data from new ML API
        const response = await mlApi.getMonitoringCommandCenter();
        
        // Map to dashboard format expected by component
        return {
          totalProjects: response.portfolioHealth?.totalProjects || 0,
          activeProjects: response.portfolioHealth?.activeProjects || 0,
          totalBudget: response.portfolioHealth?.totalBudget || 0,
          totalExpenditure: response.portfolioHealth?.totalExpenditure || 0,
          completionRate: response.portfolioHealth?.avgProgress || 0,
          delayedProjects: response.riskDistribution?.HIGH || 0,
          riskAlerts: response.riskDistribution?.CRITICAL || 0,
          // Additional mapped data
          commandCenter: response,
        };
      } catch (error) {
        console.error('[useFetchDashboardMetrics] Error:', error);
        throw error;
      }
    },
    {
      refetchInterval: 30000, // Refresh every 30 seconds (cache TTL is 30s)
      retryCount: 3,
    }
  );
}

/**
 * Specialized hook for ML anomalies
 */
export function useFetchCostAnomalies() {
  const { mlService } = require('../services/analysisService');

  return useFetchData(
    () => mlService.getCostAnomalies(),
    {
      refetchInterval: 60000, // Refresh every minute
      retryCount: 3,
    }
  );
}

/**
 * Specialized hook for ML duplicates
 */
export function useFetchDuplicates() {
  const { mlService } = require('../services/analysisService');

  return useFetchData(
    () => mlService.getDuplicates(),
    {
      refetchInterval: 60000, // Refresh every minute
      retryCount: 3,
    }
  );
}

/**
 * Specialized hook for ML delay predictions
 */
export function useFetchDelayPredictions() {
  const { mlService } = require('../services/analysisService');

  return useFetchData(
    () => mlService.getDelayPredictions(),
    {
      refetchInterval: 60000, // Refresh every minute
      retryCount: 3,
    }
  );
}
