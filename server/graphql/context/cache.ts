// ============================================================================
// Cache Manager Implementation
// ============================================================================
// Handles request-scoped and persistent caching
// Services use this to invalidate caches after mutations
// ============================================================================

import type { CacheManager } from "@/server/types/context";

/**
 * Request-scoped cache with optional TTL
 * Stores data for duration of request + optional persistence
 */
export class CacheService implements CacheManager {
  private requestCache: Map<string, { value: any; expiresAt?: Date }> =
    new Map();
  private persistentCache: Map<string, { value: any; expiresAt?: Date }> =
    new Map();

  constructor(private cachePrefix = "graphql") {}

  /**
   * Get cache key for a domain/id combination
   * Format: "domain:id" or "domain:subkey:id"
   */
  getCacheKey(domain: string, id: string): string {
    return `${this.cachePrefix}:${domain}:${id}`;
  }

  /**
   * Set value in cache with optional TTL
   * @param ttlMs - Time to live in milliseconds (optional)
   */
  set(key: string, value: any, ttlMs?: number): void {
    const expiresAt = ttlMs ? new Date(Date.now() + ttlMs) : undefined;

    // Store in request cache (ephemeral)
    this.requestCache.set(key, { value, expiresAt });

    // Also store in persistent cache if TTL provided
    if (ttlMs) {
      this.persistentCache.set(key, { value, expiresAt });
    }
  }

  /**
   * Get value from cache
   * Returns null if expired or not found
   */
  get(key: string): any {
    // Check request cache first
    let entry = this.requestCache.get(key);

    if (!entry) {
      // Check persistent cache
      entry = this.persistentCache.get(key);
    }

    if (!entry) {
      return null;
    }

    // Check expiration
    if (entry.expiresAt && entry.expiresAt < new Date()) {
      this.requestCache.delete(key);
      this.persistentCache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Invalidate specific cache keys
   * Call after mutations to ensure fresh data
   */
  invalidate(keys: string[]): void {
    for (const key of keys) {
      this.requestCache.delete(key);
      this.persistentCache.delete(key);
    }
  }

  /**
   * Clear all caches (request-scoped and persistent)
   * Usually called at end of request
   */
  clear(): void {
    this.requestCache.clear();
    // Don't clear persistent cache - it should outlive request
  }

  /**
   * Clear only persistent cache
   * Use for lifecycle events like app shutdown
   */
  clearPersistent(): void {
    this.persistentCache.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  stats() {
    return {
      requestCacheSize: this.requestCache.size,
      persistentCacheSize: this.persistentCache.size,
    };
  }
}

/**
 * Utility function for generating common cache keys
 */
export const cacheKeyBuilder = {
  // Entity by ID: "entity:user:123"
  entity: (type: string, id: string) => `entity:${type}:${id}`,

  // Query result: "query:getUsers:all"
  query: (name: string, params?: string) =>
    `query:${name}:${params || "default"}`,

  // Aggregation: "agg:employee:loadIndex:123"
  aggregation: (type: string, operation: string, id: string) =>
    `agg:${type}:${operation}:${id}`,

  // List: "list:employees:departmentId:123"
  list: (type: string, filter?: Record<string, string>) => {
    if (!filter) return `list:${type}:all`;
    const params = Object.entries(filter)
      .map(([k, v]) => `${k}:${v}`)
      .join(":");
    return `list:${type}:${params}`;
  },

  // Relationship: "rel:employee:123:department"
  relationship: (sourceType: string, sourceId: string, relationType: string) =>
    `rel:${sourceType}:${sourceId}:${relationType}`,
};
