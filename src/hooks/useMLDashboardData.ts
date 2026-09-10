/**
 * useMLDashboardData Hook
 * 
 * Fetches and manages ML API dashboard data
 * Handles loading, error, and caching states
 * Integrates with response mappers for type-safe data
 */

import { useState, useEffect, useCallback } from 'react';
import * as mlService from '../services/ml';
import { ResponseMappers } from '../utils/ml-response-mappers';

export interface DashboardData {
  commandCenter: any;
  attentionQueue: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface DashboardFilters {
  state?: string;
  district?: string;
  mp?: string;
  risk_level?: string;
  page?: number;
  page_size?: number;
}

/**
 * Hook to fetch and manage dashboard data
 */
export function useMLDashboardData(filters?: DashboardFilters) {
  const [commandCenter, setCommandCenter] = useState<any>(null);
  const [attentionQueue, setAttentionQueue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch dashboard data from backend
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📊 Fetching dashboard data...');

      // Fetch both endpoints in parallel for better performance
      const [centerData, queueData] = await Promise.all([
        mlService.getMonitoringCommandCenter(filters),
        mlService.getAttentionQueue({
          page: filters?.page || 1,
          page_size: filters?.page_size || 50,
          ...filters
        })
      ]);

      setCommandCenter(centerData);
      setAttentionQueue(queueData);

      console.log('✅ Dashboard data loaded successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load dashboard data';
      console.error('❌ Error fetching dashboard:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Fetch data on component mount and when filters change
   */
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    commandCenter,
    attentionQueue,
    loading,
    error,
    refetch
  };
}

/**
 * Hook to fetch project-specific data
 */
export interface ProjectData {
  signals: any[];
  alerts: any[];
  investigation: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMLProjectData(projectId: string) {
  const [signals, setSignals] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [investigation, setInvestigation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch project data from backend
   */
  const fetchProjectData = useCallback(async () => {
    if (!projectId) {
      setError('Project ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📊 Fetching project data...', { projectId });

      // Fetch all endpoints in parallel
      const [signalsData, alertsData, investigationData] = await Promise.all([
        mlService.getProjectSignals(projectId),
        mlService.getProjectAlerts(projectId),
        mlService.getProjectInvestigation(projectId)
      ]);

      setSignals(signalsData);
      setAlerts(alertsData);
      setInvestigation(investigationData);

      console.log('✅ Project data loaded successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load project data';
      console.error('❌ Error fetching project data:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Fetch data on component mount and when projectId changes
   */
  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    await fetchProjectData();
  }, [fetchProjectData]);

  return {
    signals,
    alerts,
    investigation,
    loading,
    error,
    refetch
  };
}

/**
 * Hook to fetch and analyze a project
 */
export interface AnalysisData {
  analysis: any;
  loading: boolean;
  error: string | null;
  analyze: (projectData: any) => Promise<void>;
}

export function useMLAnalysis() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze a project
   */
  const analyze = useCallback(async (projectData: any) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔬 Analyzing project...', projectData);

      const result = await mlService.analyzeProject(projectData);
      setAnalysis(result);

      console.log('✅ Analysis completed successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze project';
      console.error('❌ Error analyzing project:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysis,
    loading,
    error,
    analyze
  };
}

/**
 * Hook to manage monitoring events
 */
export interface MonitoringEventManager {
  loading: boolean;
  error: string | null;
  ingestEvent: (event: any) => Promise<void>;
  ingestBulkEvents: (events: any[]) => Promise<void>;
  triggerSweep: () => Promise<void>;
}

export function useMonitoringEvents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ingest a single monitoring event
   */
  const ingestEvent = useCallback(async (event: any) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Ingesting monitoring event...');
      await mlService.ingestMonitoringEvent(event);
      console.log('✅ Event ingested successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to ingest event';
      console.error('❌ Error ingesting event:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ingest bulk monitoring events
   */
  const ingestBulkEvents = useCallback(async (events: any[]) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Ingesting bulk monitoring events...', { count: events.length });
      await mlService.ingestBulkMonitoringEvents(events);
      console.log('✅ Bulk events ingested successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to ingest bulk events';
      console.error('❌ Error ingesting bulk events:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Trigger monitoring sweep
   */
  const triggerSweep = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Triggering monitoring sweep...');
      await mlService.triggerMonitoringSweep();
      console.log('✅ Monitoring sweep completed');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to trigger sweep';
      console.error('❌ Error triggering sweep:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    ingestEvent,
    ingestBulkEvents,
    triggerSweep
  };
}

export default useMLDashboardData;

