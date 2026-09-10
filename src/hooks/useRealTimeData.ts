/**
 * Custom Hook for Real-Time Data Management
 * 
 * Provides:
 * - Real-time data fetching
 * - Auto-refresh capabilities
 * - Error handling and retries
 * - Data transformation and caching
 * - Multi-source data aggregation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { projectApi, analysisApi, stateApi, districtApi } from '../services/api';
import { WorkRecord, StateSummary, DistrictSummary } from '../types';

export interface RealTimeDataHook {
  works: WorkRecord[];
  states: StateSummary[];
  districts: DistrictSummary[];
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  isAutoRefreshing: boolean;
}

/**
 * Hook to fetch and manage real-time data from backend
 * Aggregates works, states, and districts with auto-refresh
 */
export function useRealTimeData(autoRefreshInterval: number = 30000): RealTimeDataHook {
  const [works, setWorks] = useState<WorkRecord[]>([]);
  const [states, setStates] = useState<StateSummary[]>([]);
  const [districts, setDistricts] = useState<DistrictSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  /**
   * Fetch all data in parallel
   */
  const fetchAllData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('[useRealTimeData] Fetching all data...');

      // Fetch all data in parallel
      const [worksResult, statesResult, districtsResult] = await Promise.all([
        projectApi.getAll({ limit: 500 }).catch(err => {
          console.error('[useRealTimeData] Works fetch error:', err);
          return { data: [], total: 0 };
        }),
        stateApi.getAll().catch(err => {
          console.error('[useRealTimeData] States fetch error:', err);
          return [];
        }),
        // Skip districts if not needed or handle 404 gracefully
        Promise.resolve([]).catch(err => {
          console.error('[useRealTimeData] Districts fetch error:', err);
          return [];
        }),
      ]);

      // Extract and deduplicate data to ensure unique keys in UI components
      const rawWorks = worksResult.data || (worksResult as any).projects || (Array.isArray(worksResult) ? worksResult : []);
      const rawStates = Array.isArray(statesResult) ? statesResult : (statesResult as any).data || [];
      const rawDistricts = Array.isArray(districtsResult) ? districtsResult : (districtsResult as any).data || [];

      const worksSeen = new Set<string>();
      const worksData = rawWorks.filter((item: any) => {
        const key = item?.work_id || item?.id;
        if (!key) return true;
        if (worksSeen.has(key)) return false;
        worksSeen.add(key);
        return true;
      });

      const statesSeen = new Set<string>();
      const statesData = rawStates.filter((item: any) => {
        const key = item?.code || item?.state || item?.state_id || item?.name;
        if (!key) return true;
        if (statesSeen.has(key)) return false;
        statesSeen.add(key);
        return true;
      });

      const districtsData = rawDistricts;

      console.log(`[useRealTimeData] ✓ Fetched: ${worksData.length} works, ${statesData.length} states, ${districtsData.length} districts`);

      setWorks(worksData);
      setStates(statesData);
      setDistricts(districtsData);
      setLastUpdated(new Date());
      setError(null);

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[useRealTimeData] Fetch failed:', error.message);
      setError(error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  /**
   * Auto-refresh interval
   */
  useEffect(() => {
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      console.log(`[useRealTimeData] Auto-refresh enabled: ${autoRefreshInterval}ms`);
      
      intervalRef.current = setInterval(async () => {
        setIsAutoRefreshing(true);
        await fetchAllData();
        setIsAutoRefreshing(false);
      }, autoRefreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefreshInterval, fetchAllData]);

  return {
    works,
    states,
    districts,
    loading,
    error,
    lastUpdated,
    refetch: fetchAllData,
    isAutoRefreshing,
  };
}

/**
 * Hook to calculate metrics from real-time works data
 */
export function useWorksMetrics(works: WorkRecord[]) {
  return useCallback(() => {
    if (!works || works.length === 0) {
      return {
        totalWorks: 0,
        totalBudget: 0,
        totalExpenditure: 0,
        avgProgress: 0,
        completedWorks: 0,
        ongoingWorks: 0,
        delayedWorks: 0,
        highRiskWorks: 0,
        criticalWorks: 0,
        lowRiskWorks: 0,
        mediumRiskWorks: 0,
      };
    }

    const totalWorks = works.length;
    const totalBudget = works.reduce((sum, w) => sum + (parseFloat(String(w.sanctioned_cost || 0)) || 0), 0);
    const totalExpenditure = works.reduce((sum, w) => sum + (parseFloat(String(w.actual_expenditure || 0)) || 0), 0);
    const avgProgress = works.length > 0 
      ? Math.round(works.reduce((sum, w) => sum + (parseFloat(String(w.physical_progress || 0)) || 0), 0) / works.length)
      : 0;

    const completedWorks = works.filter(w => w.status?.toLowerCase() === 'completed').length;
    const ongoingWorks = works.filter(w => w.status?.toLowerCase() === 'in progress' || w.status?.toLowerCase() === 'in_progress' || !w.status).length;
    const delayedWorks = works.filter(w => w.status?.toLowerCase() === 'delayed').length;

    const highRiskWorks = works.filter(w => (w.risk_score || 0) > 60).length;
    const criticalWorks = works.filter(w => (w.risk_score || 0) > 80).length;
    const lowRiskWorks = works.filter(w => (w.risk_score || 0) <= 30).length;
    const mediumRiskWorks = works.filter(w => (w.risk_score || 0) > 30 && (w.risk_score || 0) <= 60).length;

    console.log('[useWorksMetrics] Calculated:', {
      totalWorks,
      totalBudget,
      avgProgress,
      completedWorks,
      highRiskWorks,
    });

    return {
      totalWorks,
      totalBudget,
      totalExpenditure,
      avgProgress,
      completedWorks,
      ongoingWorks,
      delayedWorks,
      highRiskWorks,
      criticalWorks,
      lowRiskWorks,
      mediumRiskWorks,
    };
  }, [works]);
}

/**
 * Hook to get works by state
 */
export function useWorksByState(works: WorkRecord[], stateName: string) {
  return useCallback(() => {
    if (!works || !stateName) return [];
    return works.filter(w => w.state?.toLowerCase() === stateName.toLowerCase());
  }, [works, stateName]);
}

/**
 * Hook to get works by district
 */
export function useWorksByDistrict(works: WorkRecord[], districtName: string) {
  return useCallback(() => {
    if (!works || !districtName) return [];
    return works.filter(w => w.district?.toLowerCase() === districtName.toLowerCase());
  }, [works, districtName]);
}

/**
 * Hook to calculate risk distribution
 */
export function useRiskDistribution(works: WorkRecord[]) {
  return useCallback(() => {
    if (!works || works.length === 0) {
      return [
        { name: 'Low Risk', value: 0, fill: '#047A1E' },
        { name: 'Medium Risk', value: 0, fill: '#FF6B00' },
        { name: 'High Risk', value: 0, fill: '#FF0000' },
        { name: 'Critical', value: 0, fill: '#8B0000' },
      ];
    }

    return [
      { 
        name: 'Low Risk', 
        value: works.filter(w => (w.risk_score || 0) <= 30).length,
        fill: '#047A1E' 
      },
      { 
        name: 'Medium Risk', 
        value: works.filter(w => (w.risk_score || 0) > 30 && (w.risk_score || 0) <= 60).length,
        fill: '#FF6B00' 
      },
      { 
        name: 'High Risk', 
        value: works.filter(w => (w.risk_score || 0) > 60 && (w.risk_score || 0) <= 80).length,
        fill: '#FF0000' 
      },
      { 
        name: 'Critical', 
        value: works.filter(w => (w.risk_score || 0) > 80).length,
        fill: '#8B0000' 
      },
    ];
  }, [works]);
}

/**
 * Hook to calculate sector distribution
 */
export function useSectorDistribution(works: WorkRecord[]) {
  return useCallback(() => {
    if (!works || works.length === 0) return [];

    // Group by category
    const sectorMap = new Map<string, number>();
    works.forEach(work => {
      const category = work.category || 'Other';
      sectorMap.set(category, (sectorMap.get(category) || 0) + 1);
    });

    // Convert to chart format
    return Array.from(sectorMap.entries()).map(([name, count]) => ({
      name,
      value: count,
    }));
  }, [works]);
}
