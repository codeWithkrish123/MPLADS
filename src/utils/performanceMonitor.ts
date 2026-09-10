/**
 * Performance Monitoring Service
 * Tracks component render times, API call times, and overall performance metrics
 * Used for Phase 6 Performance Optimization
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  type: 'render' | 'api' | 'navigation' | 'interaction';
  details?: Record<string, any>;
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  averages: Record<string, number>;
  slowestOperations: PerformanceMetric[];
  summary: {
    totalMetricsCollected: number;
    timeRange: [Date, Date];
    recommendations: string[];
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();
  private reportThresholds = {
    render: 100,    // ms - target max render time
    api: 800,       // ms - target max API call (uncached)
    apiCached: 200, // ms - target max API call (cached)
    navigation: 500, // ms - target max navigation time
  };

  /**
   * Start tracking a metric
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  /**
   * End tracking a metric and record it
   */
  endTimer(
    name: string,
    type: 'render' | 'api' | 'navigation' | 'interaction' = 'render',
    details?: Record<string, any>
  ): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer "${name}" was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.push({
      name,
      duration,
      timestamp: new Date(),
      type,
      details,
    });

    this.timers.delete(name);

    // Log if exceeds threshold
    const threshold = this.reportThresholds[type] || 1000;
    if (duration > threshold) {
      console.warn(
        `⚠️  Performance: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`,
        details
      );
    }

    return duration;
  }

  /**
   * Measure a function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T,
    type: 'render' | 'api' | 'navigation' | 'interaction' = 'render',
    details?: Record<string, any>
  ): Promise<T> {
    this.startTimer(name);
    try {
      const result = await Promise.resolve(fn());
      this.endTimer(name, type, details);
      return result;
    } catch (error) {
      this.endTimer(name, type, { ...details, error: String(error) });
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    type: 'render' | 'api' | 'navigation' | 'interaction' = 'render',
    details?: Record<string, any>
  ): T {
    this.startTimer(name);
    try {
      const result = fn();
      this.endTimer(name, type, details);
      return result;
    } catch (error) {
      this.endTimer(name, type, { ...details, error: String(error) });
      throw error;
    }
  }

  /**
   * Record a metric directly
   */
  recordMetric(
    name: string,
    duration: number,
    type: 'render' | 'api' | 'navigation' | 'interaction' = 'render',
    details?: Record<string, any>
  ): void {
    this.metrics.push({
      name,
      duration,
      timestamp: new Date(),
      type,
      details,
    });
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by type
   */
  getMetricsByType(type: 'render' | 'api' | 'navigation' | 'interaction'): PerformanceMetric[] {
    return this.metrics.filter((m) => m.type === type);
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Calculate average duration for metrics matching criteria
   */
  getAverageDuration(type?: string, name?: string): number {
    let filtered = this.metrics;

    if (type) {
      filtered = filtered.filter((m) => m.type === type);
    }

    if (name) {
      filtered = filtered.filter((m) => m.name === name);
    }

    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
    return sum / filtered.length;
  }

  /**
   * Get slowest N operations
   */
  getSlowestOperations(n: number = 10): PerformanceMetric[] {
    return [...this.metrics].sort((a, b) => b.duration - a.duration).slice(0, n);
  }

  /**
   * Get fastest N operations
   */
  getFastestOperations(n: number = 10): PerformanceMetric[] {
    return [...this.metrics].sort((a, b) => a.duration - b.duration).slice(0, n);
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const averages: Record<string, number> = {};
    const types = new Set(this.metrics.map((m) => m.type));

    types.forEach((type) => {
      averages[`${type}Average`] = this.getAverageDuration(type);
    });

    // Get unique metric names
    const names = new Set(this.metrics.map((m) => m.name));
    names.forEach((name) => {
      averages[`${name}Average`] = this.getAverageDuration(undefined, name);
    });

    const timeRange: [Date, Date] | undefined =
      this.metrics.length > 0
        ? [
            new Date(Math.min(...this.metrics.map((m) => m.timestamp.getTime()))),
            new Date(Math.max(...this.metrics.map((m) => m.timestamp.getTime()))),
          ]
        : undefined;

    const recommendations = this.generateRecommendations();

    return {
      metrics: this.metrics,
      averages,
      slowestOperations: this.getSlowestOperations(10),
      summary: {
        totalMetricsCollected: this.metrics.length,
        timeRange: timeRange || [new Date(), new Date()],
        recommendations,
      },
    };
  }

  /**
   * Generate optimization recommendations based on metrics
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Analyze render times
    const renderMetrics = this.getMetricsByType('render');
    if (renderMetrics.length > 0) {
      const avgRender = this.getAverageDuration('render');
      if (avgRender > this.reportThresholds.render) {
        recommendations.push(
          `🔴 Render times exceed target (avg: ${avgRender.toFixed(2)}ms, target: ${this.reportThresholds.render}ms). Consider memoization or code splitting.`
        );
      }
    }

    // Analyze API times
    const apiMetrics = this.getMetricsByType('api');
    if (apiMetrics.length > 0) {
      const avgApi = this.getAverageDuration('api');
      if (avgApi > this.reportThresholds.api) {
        recommendations.push(
          `🟡 API response times exceed target (avg: ${avgApi.toFixed(2)}ms, target: ${this.reportThresholds.api}ms). Consider caching or pagination.`
        );
      }

      // Check for slow individual endpoints
      const slowest = this.getSlowestOperations(3);
      slowest.forEach((op) => {
        if (op.type === 'api' && op.duration > this.reportThresholds.api * 1.5) {
          recommendations.push(
            `🟡 Slow endpoint: ${op.name} (${op.duration.toFixed(2)}ms). Consider implementing cache or optimizing ML API call.`
          );
        }
      });
    }

    // Analyze navigation times
    const navMetrics = this.getMetricsByType('navigation');
    if (navMetrics.length > 0) {
      const avgNav = this.getAverageDuration('navigation');
      if (avgNav > this.reportThresholds.navigation) {
        recommendations.push(
          `🟡 Navigation times exceed target (avg: ${avgNav.toFixed(2)}ms, target: ${this.reportThresholds.navigation}ms). Consider lazy loading routes.`
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All performance metrics within acceptable thresholds.');
    }

    return recommendations;
  }

  /**
   * Print report to console
   */
  printReport(): void {
    const report = this.generateReport();

    console.group('📊 Performance Report');
    console.table(report.averages);

    console.group('🐢 Top 10 Slowest Operations');
    console.table(
      report.slowestOperations.map((m) => ({
        name: m.name,
        duration: `${m.duration.toFixed(2)}ms`,
        type: m.type,
      }))
    );
    console.groupEnd();

    console.group('📋 Recommendations');
    report.summary.recommendations.forEach((r) => console.log(r));
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * Export report as JSON
   */
  exportReport(): string {
    const report = this.generateReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * Clear metrics older than specified time
   */
  clearOldMetrics(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;
    this.metrics = this.metrics.filter((m) => m.timestamp.getTime() > cutoffTime);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export type
export type { PerformanceMetric, PerformanceReport };
