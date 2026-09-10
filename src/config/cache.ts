/**
 * Cache Configuration and Strategy
 * Defines TTLs and caching behavior for all ML API endpoints
 * Phase 6: Performance Optimization
 */

/**
 * Cache Entry Configuration - Optimized for Real-Time Monitoring
 * 
 * CRITICAL: TTLs must align with polling interval (5 seconds) to ensure
 * fresh data. Stale cache was causing "old data after login" issue.
 * Reduced from 30-60s to 2-10s for real-time responsiveness.
 */
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Max number of entries
  evictionPolicy?: 'LRU' | 'FIFO' | 'LFU';
  description: string;
}

/**
 * Global cache configuration for all endpoints
 * These TTLs are SHORT to ensure real-time data with 5s polling
 */
export const CACHE_CONFIG: Record<string, CacheConfig> = {
  // Monitoring Endpoints - CRITICAL for real-time
  'command_center': {
    ttl: 5000, // 5 seconds (CHANGED from 30s)
    maxSize: 50,
    evictionPolicy: 'LRU',
    description: 'Command Center metrics - real-time critical',
  },

  'attention_queue': {
    ttl: 3000, // 3 seconds (CHANGED from 15s)
    maxSize: 100,
    evictionPolicy: 'LRU',
    description: 'Attention Queue - high frequency real-time updates',
  },

  // Project-specific endpoints - Must be fresh for risk monitoring
  'project_signals': {
    ttl: 3000, // 3 seconds (CHANGED from 10s)
    maxSize: 200,
    evictionPolicy: 'LRU',
    description: 'Project Signals - real-time risk alerts need freshness',
  },

  'project_alerts': {
    ttl: 2000, // 2 seconds (NEW - ultra-fresh for alerts)
    maxSize: 200,
    evictionPolicy: 'LRU',
    description: 'Project Alerts - CRITICAL, cannot be stale',
  },

  'project_investigation': {
    ttl: 20000, // 20 seconds
    maxSize: 100,
    evictionPolicy: 'LRU',
    description: 'Investigation Cases - moderately dynamic',
  },

  'project_documents': {
    ttl: 30000, // 30 seconds
    maxSize: 100,
    evictionPolicy: 'LRU',
    description: 'Project Documents - less frequently updated',
  },

  // Analysis endpoints
  'analysis_project': {
    ttl: 60000, // 60 seconds
    maxSize: 100, // ML analysis is expensive, cache longer
    evictionPolicy: 'LRU',
    description: 'Real-time Analysis - expensive computation, longer cache',
  },

  // Utility endpoints
  'ml_health': {
    ttl: 5000, // 5 seconds
    maxSize: 1,
    evictionPolicy: 'FIFO',
    description: 'ML API Health Check - quick refreshes',
  },
};

/**
 * Cache Statistics and Monitoring
 */
export interface CacheStats {
  name: string;
  hits: number;
  misses: number;
  evictions: number;
  currentSize: number;
  maxSize?: number;
  hitRate: number;
  lastAccessTime?: Date;
  totalAccessTime: number;
}

/**
 * In-Memory Cache Implementation with LRU eviction
 */
export class CacheManager {
  private cache: Map<string, { value: any; timestamp: number; accessCount: number }> = new Map();
  private stats: Map<string, CacheStats> = new Map();
  private config: Record<string, CacheConfig>;

  constructor(config: Record<string, CacheConfig> = CACHE_CONFIG) {
    this.config = config;
  }

  /**
   * Get value from cache
   */
  get(cacheKey: string, namespace: string): any | null {
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      this.recordMiss(namespace);
      return null;
    }

    const cacheConfig = this.config[namespace];
    if (!cacheConfig) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > cacheConfig.ttl) {
      this.cache.delete(cacheKey);
      this.recordMiss(namespace);
      return null;
    }

    entry.accessCount++;
    this.recordHit(namespace);
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(cacheKey: string, value: any, namespace: string): void {
    const cacheConfig = this.config[namespace];
    if (!cacheConfig) {
      console.warn(`Unknown cache namespace: ${namespace}`);
      return;
    }

    // Check size limit and evict if necessary
    if (cacheConfig.maxSize && this.cache.size >= cacheConfig.maxSize) {
      this.evictOne(namespace, cacheConfig.evictionPolicy || 'LRU');
    }

    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
      accessCount: 0,
    });
  }

  /**
   * Remove item from cache
   */
  delete(cacheKey: string): void {
    this.cache.delete(cacheKey);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      // Find namespace from key (key format: namespace:...)
      const namespace = key.split(':')[0];
      const config = this.config[namespace];

      if (config && now - entry.timestamp > config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict one entry based on policy
   */
  private evictOne(namespace: string, policy: 'LRU' | 'FIFO' | 'LFU'): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string | null = null;

    if (policy === 'LRU') {
      // Find least recently used (oldest access time)
      let oldestTime = Infinity;
      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          keyToEvict = key;
        }
      }
    } else if (policy === 'FIFO') {
      // First in, first out - oldest entry
      keyToEvict = this.cache.keys().next().value;
    } else if (policy === 'LFU') {
      // Least frequently used (lowest access count)
      let lowestCount = Infinity;
      for (const [key, entry] of this.cache.entries()) {
        if (entry.accessCount < lowestCount) {
          lowestCount = entry.accessCount;
          keyToEvict = key;
        }
      }
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      const stats = this.stats.get(namespace);
      if (stats) {
        stats.evictions++;
      }
    }
  }

  /**
   * Record cache hit
   */
  private recordHit(namespace: string): void {
    let stat = this.stats.get(namespace);
    if (!stat) {
      stat = {
        name: namespace,
        hits: 0,
        misses: 0,
        evictions: 0,
        currentSize: 0,
        hitRate: 0,
        totalAccessTime: 0,
      };
      this.stats.set(namespace, stat);
    }
    stat.hits++;
    stat.hitRate = stat.hits / (stat.hits + stat.misses);
    stat.lastAccessTime = new Date();
  }

  /**
   * Record cache miss
   */
  private recordMiss(namespace: string): void {
    let stat = this.stats.get(namespace);
    if (!stat) {
      stat = {
        name: namespace,
        hits: 0,
        misses: 0,
        evictions: 0,
        currentSize: 0,
        hitRate: 0,
        totalAccessTime: 0,
      };
      this.stats.set(namespace, stat);
    }
    stat.misses++;
    stat.hitRate = stat.hits / (stat.hits + stat.misses);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats[] {
    return Array.from(this.stats.values());
  }

  /**
   * Get specific namespace statistics
   */
  getStatsByNamespace(namespace: string): CacheStats | null {
    return this.stats.get(namespace) || null;
  }

  /**
   * Print cache statistics
   */
  printStats(): void {
    console.group('📊 Cache Statistics');
    const stats = this.getStats();
    if (stats.length === 0) {
      console.log('No cache statistics available');
    } else {
      console.table(
        stats.map((s) => ({
          namespace: s.name,
          hits: s.hits,
          misses: s.misses,
          hitRate: `${(s.hitRate * 100).toFixed(2)}%`,
          size: s.currentSize,
          evictions: s.evictions,
        }))
      );
    }
    console.groupEnd();
  }

  /**
   * Get cache status summary
   */
  getStatusSummary(): {
    totalSize: number;
    totalHits: number;
    totalMisses: number;
    overallHitRate: number;
  } {
    const stats = this.getStats();
    const totalHits = stats.reduce((sum, s) => sum + s.hits, 0);
    const totalMisses = stats.reduce((sum, s) => sum + s.misses, 0);

    return {
      totalSize: this.cache.size,
      totalHits,
      totalMisses,
      overallHitRate: totalHits / (totalHits + totalMisses || 1),
    };
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Optimization Recommendations based on cache metrics
 */
export function generateCacheOptimizationRecommendations(): string[] {
  const recommendations: string[] = [];
  const summary = cacheManager.getStatusSummary();

  if (summary.overallHitRate < 0.7) {
    recommendations.push(
      `⚠️  Overall cache hit rate is low (${(summary.overallHitRate * 100).toFixed(2)}%). Consider increasing TTL values.`
    );
  }

  if (summary.totalSize > 500) {
    recommendations.push(
      `⚠️  Cache size is large (${summary.totalSize} entries). Consider reducing TTL values or implementing better eviction.`
    );
  }

  const stats = cacheManager.getStats();
  stats.forEach((stat) => {
    if (stat.hitRate < 0.5 && stat.hits + stat.misses > 10) {
      recommendations.push(
        `🔴 Low hit rate for ${stat.name} (${(stat.hitRate * 100).toFixed(2)}%). Review TTL configuration.`
      );
    }
    if (stat.evictions > 100) {
      recommendations.push(
        `🟡 High eviction rate for ${stat.name} (${stat.evictions} evictions). Consider increasing maxSize.`
      );
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('✅ Cache performance is optimal.');
  }

  return recommendations;
}
