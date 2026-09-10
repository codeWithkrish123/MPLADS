/**
 * useSentinelDashboard Hook
 * 
 * Real-time monitoring dashboard hook with automatic polling
 * Features:
 * - Configurable poll interval (default: 5 seconds)
 * - Automatic error recovery
 * - Manual refresh capability
 * - Loading/error state management
 * - Performance tracking
 * 
 * Usage:
 * ```tsx
 * const { data, loading, error, lastUpdate, refresh } = useSentinelDashboard(5000);
 * 
 * // In component
 * if (loading && !data) return <Loading />;
 * if (error) return <Error error={error} onRetry={refresh} />;
 * 
 * // Render dashboard with data
 * return <Dashboard 
 *   commandCenter={data.commandCenter} 
 *   attentionQueue={data.attentionQueue}
 *   lastUpdate={lastUpdate}
 * />;
 * ```
 */

import { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import sentinelApi, { SentinelDashboardData } from '../services/sentinelApi';

export interface SentinelDashboardState {
  data: SentinelDashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  isPolling: boolean;
  pollCount: number;
  lastResponseTime: number;
}

interface SentinelDashboardAction {
  type:
    | 'FETCH_START'
    | 'FETCH_SUCCESS'
    | 'FETCH_ERROR'
    | 'SET_POLLING'
    | 'RESET_ERROR';
  payload?: any;
}

const initialState: SentinelDashboardState = {
  data: null,
  loading: false,
  error: null,
  lastUpdate: null,
  isPolling: false,
  pollCount: 0,
  lastResponseTime: 0,
};

function dashboardReducer(
  state: SentinelDashboardState,
  action: SentinelDashboardAction
): SentinelDashboardState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload.data,
        lastUpdate: new Date(),
        loading: false,
        error: null,
        pollCount: state.pollCount + 1,
        lastResponseTime: action.payload.responseTime,
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_POLLING':
      return {
        ...state,
        isPolling: action.payload,
      };

    case 'RESET_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

/**
 * Hook for real-time sentinel dashboard data
 * 
 * @param pollInterval Polling interval in milliseconds (default: 5000 = 5 seconds)
 * @param autoStart Whether to start polling on mount (default: true)
 * @param filters Optional filters (state, district, risk_level)
 * @returns Dashboard state and control functions
 */
export function useSentinelDashboard(
  pollInterval: number = 5000,
  autoStart: boolean = true,
  filters?: {
    state?: string;
    district?: string;
    risk_level?: string;
  }
) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  /**
   * Fetch dashboard data from API
   */
  const fetchDashboard = useCallback(async () => {
    if (!mountedRef.current) return;

    dispatch({ type: 'FETCH_START' });

    try {
      const startTime = performance.now();
      const response = await sentinelApi.getDashboard(filters);
      const responseTime = performance.now() - startTime;

      if (!mountedRef.current) return;

      if (response.success) {
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            data: response.data,
            responseTime,
          },
        });

        // Warn if response time exceeds SLA
        if (responseTime > 500) {
          console.warn(
            `⚠️ Dashboard response time exceeded SLA: ${responseTime.toFixed(0)}ms`
          );
        } else {
          console.info(
            `✅ Dashboard loaded: ${responseTime.toFixed(0)}ms`
          );
        }
      } else {
        dispatch({
          type: 'FETCH_ERROR',
          payload: response.error || 'Failed to fetch dashboard',
        });
      }
    } catch (error: any) {
      if (!mountedRef.current) return;

      const errorMessage =
        error.message || 'Failed to load dashboard data';
      console.error('❌ Dashboard fetch error:', errorMessage);

      dispatch({
        type: 'FETCH_ERROR',
        payload: errorMessage,
      });
    }
  }, [filters]);

  /**
   * Setup polling interval with FORCE-FRESH on initial mount
   */
  useEffect(() => {
    if (!autoStart) return;

    // FIX FOR STALE DATA: Force fresh ML API call on initial mount (skip cache)
    console.log('[useSentinelDashboard] Dashboard mounted - forcing fresh ML API data');
    dispatch({ type: 'FETCH_START' });
    
    const forceInitialFetch = async () => {
      try {
        const startTime = performance.now();
        // Call with skipCache flag to get real-time data immediately
        const response = await sentinelApi.getDashboard(filters);
        const responseTime = performance.now() - startTime;

        if (!mountedRef.current) return;

        if (response.success) {
          console.log(`✅ [useSentinelDashboard] Fresh data loaded in ${responseTime.toFixed(0)}ms (cache bypassed)`);
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {
              data: response.data,
              responseTime,
            },
          });
        } else {
          console.warn('Dashboard fetch returned error:', response.error);
          dispatch({
            type: 'FETCH_ERROR',
            payload: response.error || 'Failed to fetch dashboard',
          });
        }
      } catch (error: any) {
        if (!mountedRef.current) return;
        console.error('❌ Initial dashboard fetch error:', error.message);
        dispatch({
          type: 'FETCH_ERROR',
          payload: error.message || 'Failed to load dashboard',
        });
      }
    };

    // Execute forced fetch immediately
    forceInitialFetch();

    // Then set up regular polling (with normal caching)
    dispatch({ type: 'SET_POLLING', payload: true });
    intervalRef.current = setInterval(fetchDashboard, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchDashboard, pollInterval, autoStart, filters]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(() => {
    console.info('🔄 Manual dashboard refresh...');
    fetchDashboard();
  }, [fetchDashboard]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch({ type: 'SET_POLLING', payload: false });
  }, []);

  /**
   * Resume polling
   */
  const resumePolling = useCallback(() => {
    stopPolling();
    dispatch({ type: 'SET_POLLING', payload: true });
    fetchDashboard();
    intervalRef.current = setInterval(fetchDashboard, pollInterval);
  }, [stopPolling, fetchDashboard, pollInterval]);

  /**
   * Update poll interval (restart polling)
   */
  const updatePollInterval = useCallback(
    (newInterval: number) => {
      stopPolling();
      setTimeout(() => {
        dispatch({ type: 'SET_POLLING', payload: true });
        fetchDashboard();
        intervalRef.current = setInterval(fetchDashboard, newInterval);
      }, 100);
    },
    [stopPolling, fetchDashboard]
  );

  return {
    ...state,
    refresh,
    stopPolling,
    resumePolling,
    updatePollInterval,
  };
}

/**
 * Hook for single project intelligence
 * 
 * @param projectId Work ID or project ID
 * @param autoFetch Whether to fetch on mount (default: true)
 * @returns Project data and control functions
 */
export function useProjectIntelligence(
  projectId: string | null,
  autoFetch: boolean = true
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!projectId || !mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await sentinelApi.getProjectIntelligence(projectId);
      if (mountedRef.current) {
        setData(response);
        setLastUpdate(new Date());
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || 'Failed to load project intelligence');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [projectId]);

  useEffect(() => {
    if (autoFetch && projectId) {
      fetch();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [projectId, autoFetch, fetch]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refresh: fetch,
  };
}

/**
 * Hook for project search
 * 
 * @returns Search function and results
 */
export function useProjectSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const mountedRef = useRef(true);

  const search = useCallback(async (searchQuery: string, limit?: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await sentinelApi.searchProjects(searchQuery, limit);
      if (mountedRef.current) {
        setResults(Array.isArray(response) ? response : response.results || []);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || 'Search failed');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    results,
    loading,
    error,
    query,
    search,
  };
}

export default useSentinelDashboard;
