/**
 * React Hook for Performance Monitoring
 * Automatically tracks component render times and effects
 * Used in Phase 6 for performance profiling
 */

import { useEffect, useRef } from 'react';
import { performanceMonitor } from '../utils/performanceMonitor';

interface UsePerformanceMonitoringOptions {
  componentName: string;
  logToConsole?: boolean;
  trackEffects?: boolean;
}

/**
 * Hook to monitor component rendering performance
 */
export function usePerformanceMonitoring({
  componentName,
  logToConsole = true,
  trackEffects = true,
}: UsePerformanceMonitoringOptions): void {
  const renderTimeRef = useRef<number | null>(null);
  const mountTimeRef = useRef<number | null>(null);

  // Track component mount time
  useEffect(() => {
    const componentKey = `${componentName}:mount`;
    performanceMonitor.startTimer(componentKey);
    mountTimeRef.current = performance.now();

    return () => {
      const duration = performanceMonitor.endTimer(componentKey, 'render', {
        phase: 'mount',
      });

      if (logToConsole) {
        console.log(`⏱️  ${componentName} mounted in ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName, logToConsole]);

  // Track component render time
  useEffect(() => {
    renderTimeRef.current = performance.now();

    return () => {
      if (renderTimeRef.current) {
        const duration = performance.now() - renderTimeRef.current;
        performanceMonitor.recordMetric(`${componentName}:render`, duration, 'render', {
          phase: 'render',
        });

        if (logToConsole && duration > 50) {
          console.log(`⏱️  ${componentName} rendered in ${duration.toFixed(2)}ms`);
        }
      }
    };
  });

  // Track effect execution if enabled
  if (trackEffects) {
    useEffect(() => {
      // This effect runs after every render to measure effect overhead
      const startTime = performance.now();

      return () => {
        const duration = performance.now() - startTime;
        performanceMonitor.recordMetric(`${componentName}:effect-overhead`, duration, 'render', {
          phase: 'effect-cleanup',
        });
      };
    });
  }
}

/**
 * Hook to measure async operations (API calls, etc.)
 */
export function useMeasureAsync(
  name: string,
  fn: () => Promise<any>,
  dependencies: any[] = []
): void {
  useEffect(() => {
    const measure = async () => {
      try {
        await performanceMonitor.measure(name, fn, 'api');
      } catch (error) {
        console.error(`Error in ${name}:`, error);
      }
    };

    measure();
  }, dependencies);
}

/**
 * Hook to track data loading performance
 */
export function useDataLoadingPerformance(
  dataName: string,
  loading: boolean,
  error: any
): void {
  const loadingStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      loadingStartRef.current = performance.now();
      performanceMonitor.startTimer(`data:${dataName}:load`);
    } else if (loadingStartRef.current) {
      const duration = performanceMonitor.endTimer(`data:${dataName}:load`, 'api', {
        hasError: !!error,
      });

      if (error) {
        console.warn(`⚠️  Data loading failed for ${dataName} after ${duration.toFixed(2)}ms`);
      } else {
        console.log(`✅ Data loaded for ${dataName} in ${duration.toFixed(2)}ms`);
      }

      loadingStartRef.current = null;
    }
  }, [loading, error, dataName]);
}

/**
 * Hook to track tab/section switching performance
 */
export function useTabSwitchingPerformance(activeTab: string | number, tabName: string): void {
  const previousTabRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (previousTabRef.current !== null && previousTabRef.current !== activeTab) {
      const switchKey = `tab-switch:${previousTabRef.current}->${activeTab}`;
      performanceMonitor.recordMetric(switchKey, 0, 'navigation', {
        tab: tabName,
        from: previousTabRef.current,
        to: activeTab,
      });

      performanceMonitor.startTimer(switchKey);

      return () => {
        const duration = performanceMonitor.endTimer(switchKey, 'navigation');
        console.log(`📑 Tab switch (${previousTabRef.current} → ${activeTab}) took ${duration.toFixed(2)}ms`);
      };
    }

    previousTabRef.current = activeTab;
  }, [activeTab, tabName]);
}
