/**
 * Performance Profiler
 * Comprehensive profiling of dashboard components and API endpoints
 * Phase 6.1 Performance Profiling
 */

import { performanceMonitor } from './performanceMonitor';
import { cacheManager, generateCacheOptimizationRecommendations } from '../config/cache';

interface EndpointPerformanceProfile {
  endpoint: string;
  averageTime: number;
  minTime: number;
  maxTime: number;
  totalCalls: number;
  successRate: number;
  cacheHitRate: number;
  status: 'OK' | 'WARNING' | 'CRITICAL';
  target: number;
}

interface PerformanceProfile {
  timestamp: Date;
  totalMetricsCollected: number;
  componentProfiles: Record<string, any>;
  endpointProfiles: EndpointPerformanceProfile[];
  cacheStats: Record<string, any>;
  systemRecommendations: string[];
  summary: {
    dashboardLoadTime: number;
    averageComponentRenderTime: number;
    averageApiResponseTime: number;
    overallHealthScore: number; // 0-100
  };
}

/**
 * Performance Profiler Class
 */
export class PerformanceProfiler {
  private profiles: PerformanceProfile[] = [];

  /**
   * Create a new performance profile snapshot
   */
  createProfileSnapshot(): PerformanceProfile {
    const allMetrics = performanceMonitor.getMetrics();

    // Component profiles
    const componentMetrics = allMetrics.filter((m) => m.type === 'render');
    const componentProfiles: Record<string, any> = {};

    new Set(componentMetrics.map((m) => m.name)).forEach((name) => {
      const metrics = allMetrics.filter((m) => m.name === name);
      componentProfiles[name] = {
        renderCount: metrics.length,
        averageTime: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
        minTime: Math.min(...metrics.map((m) => m.duration)),
        maxTime: Math.max(...metrics.map((m) => m.duration)),
        status: this.getComponentStatus(
          metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length
        ),
      };
    });

    // Endpoint profiles
    const apiMetrics = allMetrics.filter((m) => m.type === 'api');
    const endpointProfiles: EndpointPerformanceProfile[] = [];

    new Set(apiMetrics.map((m) => m.name)).forEach((name) => {
      const metrics = apiMetrics.filter((m) => m.name === name);
      const successCount = metrics.filter((m) => !m.details?.error).length;

      endpointProfiles.push({
        endpoint: name,
        averageTime: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
        minTime: Math.min(...metrics.map((m) => m.duration)),
        maxTime: Math.max(...metrics.map((m) => m.duration)),
        totalCalls: metrics.length,
        successRate: successCount / metrics.length,
        cacheHitRate: this.estimateCacheHitRate(name),
        status: this.getEndpointStatus(name),
        target: this.getEndpointTarget(name),
      });
    });

    // Cache statistics
    const cacheStats = cacheManager.getStatusSummary();

    // System recommendations
    const systemRecommendations = [
      ...this.generatePerformanceRecommendations(componentProfiles, endpointProfiles),
      ...generateCacheOptimizationRecommendations(),
    ];

    // Calculate summary metrics
    const dashboardLoadTime =
      componentMetrics.reduce((sum, m) => sum + m.duration, 0) / Math.max(componentMetrics.length, 1);
    const averageComponentRenderTime = Object.values(componentProfiles).reduce(
      (sum: any, p: any) => sum + p.averageTime,
      0
    ) / Math.max(Object.keys(componentProfiles).length, 1);
    const averageApiResponseTime =
      apiMetrics.reduce((sum, m) => sum + m.duration, 0) / Math.max(apiMetrics.length, 1);

    const overallHealthScore = this.calculateHealthScore({
      averageComponentRenderTime,
      averageApiResponseTime,
      cacheHitRate: cacheStats.overallHitRate,
      errorRate: 1 - (successCount(apiMetrics) / Math.max(apiMetrics.length, 1)),
    });

    const profile: PerformanceProfile = {
      timestamp: new Date(),
      totalMetricsCollected: allMetrics.length,
      componentProfiles,
      endpointProfiles,
      cacheStats: {
        totalSize: cacheStats.totalSize,
        totalHits: cacheStats.totalHits,
        totalMisses: cacheStats.totalMisses,
        overallHitRate: cacheStats.overallHitRate,
      },
      systemRecommendations,
      summary: {
        dashboardLoadTime,
        averageComponentRenderTime,
        averageApiResponseTime,
        overallHealthScore,
      },
    };

    this.profiles.push(profile);
    return profile;
  }

  /**
   * Get component performance status
   */
  private getComponentStatus(avgTime: number): 'OK' | 'WARNING' | 'CRITICAL' {
    if (avgTime < 50) return 'OK';
    if (avgTime < 100) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Get endpoint performance status
   */
  private getEndpointStatus(endpoint: string): 'OK' | 'WARNING' | 'CRITICAL' {
    const metrics = performanceMonitor.getMetricsByName(endpoint);
    if (metrics.length === 0) return 'OK';

    const avgTime = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const target = this.getEndpointTarget(endpoint);

    if (avgTime < target * 0.75) return 'OK';
    if (avgTime < target * 1.25) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Get endpoint performance target
   */
  private getEndpointTarget(endpoint: string): number {
    // Different targets for different endpoints
    if (endpoint.includes('command-center')) return 200;
    if (endpoint.includes('attention-queue')) return 300;
    if (endpoint.includes('signals')) return 300;
    if (endpoint.includes('analysis')) return 1000;
    return 500; // Default target
  }

  /**
   * Estimate cache hit rate for endpoint
   */
  private estimateCacheHitRate(endpoint: string): number {
    // In a real implementation, this would track actual cache hits
    const metrics = performanceMonitor.getMetricsByName(endpoint);
    if (metrics.length < 2) return 0;

    // Assume subsequent calls are from cache if significantly faster
    const sortedByTime = [...metrics].sort((a, b) => a.duration - b.duration);
    const fastCalls = sortedByTime.filter((m) => m.duration < 100);
    return fastCalls.length / metrics.length;
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(
    componentProfiles: Record<string, any>,
    endpointProfiles: EndpointPerformanceProfile[]
  ): string[] {
    const recommendations: string[] = [];

    // Check component performance
    Object.entries(componentProfiles).forEach(([name, profile]: [string, any]) => {
      if (profile.status === 'CRITICAL') {
        recommendations.push(
          `🔴 CRITICAL: Component ${name} rendering slow (avg ${profile.averageTime.toFixed(2)}ms). Consider memoization or code splitting.`
        );
      } else if (profile.status === 'WARNING') {
        recommendations.push(
          `🟡 WARNING: Component ${name} render time above target (avg ${profile.averageTime.toFixed(2)}ms).`
        );
      }
    });

    // Check endpoint performance
    endpointProfiles.forEach((ep) => {
      if (ep.status === 'CRITICAL') {
        recommendations.push(
          `🔴 CRITICAL: Endpoint ${ep.endpoint} exceeds target (avg ${ep.averageTime.toFixed(2)}ms > target ${ep.target}ms).`
        );
      } else if (ep.status === 'WARNING') {
        recommendations.push(
          `🟡 WARNING: Endpoint ${ep.endpoint} approaching target (avg ${ep.averageTime.toFixed(2)}ms, target ${ep.target}ms).`
        );
      }
    });

    // Check cache effectiveness
    const endpoints = endpointProfiles.filter((ep) => ep.cacheHitRate < 0.5);
    if (endpoints.length > 0) {
      recommendations.push(
        `🟡 Low cache hit rates for: ${endpoints.map((ep) => ep.endpoint).join(', ')}. Review cache TTL configuration.`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All performance metrics within acceptable targets.');
    }

    return recommendations;
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(metrics: {
    averageComponentRenderTime: number;
    averageApiResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  }): number {
    let score = 100;

    // Component render time (target: < 100ms)
    if (metrics.averageComponentRenderTime > 100) {
      score -= Math.min(20, (metrics.averageComponentRenderTime - 100) / 10);
    }

    // API response time (target: < 300ms)
    if (metrics.averageApiResponseTime > 300) {
      score -= Math.min(30, (metrics.averageApiResponseTime - 300) / 10);
    }

    // Cache hit rate (target: > 70%)
    if (metrics.cacheHitRate < 0.7) {
      score -= (0.7 - metrics.cacheHitRate) * 20;
    }

    // Error rate (target: 0%)
    score -= metrics.errorRate * 30;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Print performance profile
   */
  printProfile(profile?: PerformanceProfile): void {
    const p = profile || this.getLatestProfile();
    if (!p) {
      console.log('No performance profiles available');
      return;
    }

    console.group('📊 Performance Profile');

    console.group('📈 Summary');
    console.table({
      'Dashboard Load Time': `${p.summary.dashboardLoadTime.toFixed(2)}ms`,
      'Avg Component Render': `${p.summary.averageComponentRenderTime.toFixed(2)}ms`,
      'Avg API Response Time': `${p.summary.averageApiResponseTime.toFixed(2)}ms`,
      'Health Score': `${p.summary.overallHealthScore.toFixed(2)}/100`,
    });
    console.groupEnd();

    console.group('🏗️  Component Profiles');
    console.table(p.componentProfiles);
    console.groupEnd();

    console.group('🔌 Endpoint Profiles');
    console.table(
      p.endpointProfiles.map((ep) => ({
        endpoint: ep.endpoint,
        avg: `${ep.averageTime.toFixed(2)}ms`,
        min: `${ep.minTime.toFixed(2)}ms`,
        max: `${ep.maxTime.toFixed(2)}ms`,
        calls: ep.totalCalls,
        success: `${(ep.successRate * 100).toFixed(1)}%`,
        cache: `${(ep.cacheHitRate * 100).toFixed(1)}%`,
        status: ep.status,
      }))
    );
    console.groupEnd();

    console.group('💾 Cache Statistics');
    console.table(p.cacheStats);
    console.groupEnd();

    console.group('💡 Recommendations');
    p.systemRecommendations.forEach((r) => console.log(r));
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * Get latest profile
   */
  getLatestProfile(): PerformanceProfile | null {
    return this.profiles.length > 0 ? this.profiles[this.profiles.length - 1] : null;
  }

  /**
   * Export profile as JSON
   */
  exportProfile(profile?: PerformanceProfile): string {
    const p = profile || this.getLatestProfile();
    if (!p) return '{}';
    return JSON.stringify(p, null, 2);
  }

  /**
   * Compare two profiles
   */
  compareProfiles(profile1: PerformanceProfile, profile2: PerformanceProfile): void {
    console.group('📊 Profile Comparison');

    console.log('📈 Summary Comparison:');
    console.table({
      Metric: [
        'Dashboard Load Time',
        'Avg Component Render',
        'Avg API Response Time',
        'Health Score',
      ],
      'Profile 1': [
        `${profile1.summary.dashboardLoadTime.toFixed(2)}ms`,
        `${profile1.summary.averageComponentRenderTime.toFixed(2)}ms`,
        `${profile1.summary.averageApiResponseTime.toFixed(2)}ms`,
        `${profile1.summary.overallHealthScore.toFixed(2)}`,
      ],
      'Profile 2': [
        `${profile2.summary.dashboardLoadTime.toFixed(2)}ms`,
        `${profile2.summary.averageComponentRenderTime.toFixed(2)}ms`,
        `${profile2.summary.averageApiResponseTime.toFixed(2)}ms`,
        `${profile2.summary.overallHealthScore.toFixed(2)}`,
      ],
      'Difference': [
        `${(profile2.summary.dashboardLoadTime - profile1.summary.dashboardLoadTime).toFixed(2)}ms`,
        `${(profile2.summary.averageComponentRenderTime - profile1.summary.averageComponentRenderTime).toFixed(2)}ms`,
        `${(profile2.summary.averageApiResponseTime - profile1.summary.averageApiResponseTime).toFixed(2)}ms`,
        `${(profile2.summary.overallHealthScore - profile1.summary.overallHealthScore).toFixed(2)}`,
      ],
    });

    console.groupEnd();
  }
}

/**
 * Helper function to count successes
 */
function successCount(metrics: any[]): number {
  return metrics.filter((m) => !m.details?.error).length;
}

// Export singleton instance
export const performanceProfiler = new PerformanceProfiler();
