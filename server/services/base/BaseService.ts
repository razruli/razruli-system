// ============================================================================
// Base Service Class
// ============================================================================
// Every domain service extends this
// Provides common functionality: caching, invalidation, context access
// ============================================================================

import { cacheKeyBuilder } from "@/server/graphql/context/cache";
import type { ServiceContext } from "@/server/types/context";

import {
  ServiceError,
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from "./types";
import type { IService } from "./types";
/**
 * Abstract base class for all services
 *
 * Provides:
 * - Cache key management
 * - Cache invalidation
 * - Common patterns for CRUD operations
 * - Error handling
 *
 * Example:
 * ```typescript
 * export class UserService extends BaseService {
 *   protected readonly domain = 'user';
 *
 *   async getById(id: string) {
 *     const key = this.cacheKey(id);
 *     let user = this.context.cache.get(key);
 *
 *     if (!user) {
 *       user = await this.context.prisma.user.findUnique({ where: { id } });
 *       if (!user) throw new NotFoundError('User', id);
 *       this.context.cache.set(key, user);
 *     }

 *     return user;
 *   }
 * }
 * ```
 */
export abstract class BaseService implements IService {
  constructor(protected context: ServiceContext) {
    this.validateContext();
  }

  /**
   * Domain name - must be implemented by subclasses
   * Used for cache key generation and identification
   */
  abstract get domain(): string;

  /**
   * Validate that context has required properties
   */
  private validateContext(): void {
    if (!this.context.prisma) {
      throw new ServiceError("Prisma client not available in context");
    }

    if (!this.context.dataloaders) {
      throw new ServiceError("DataLoaders not available in context");
    }

    if (!this.context.cache) {
      throw new ServiceError("Cache not available in context");
    }
  }

  /**
   * Generate cache key for an entity
   * Format: "domain:id"
   */
  protected cacheKey(id: string | number): string {
    return this.context.cache.getCacheKey(this.domain, String(id));
  }

  /**
   * Generate cache key for a query
   * Format: "query:domain:params"
   */
  protected queryCacheKey(subkey: string): string {
    return cacheKeyBuilder.query(`${this.domain}:${subkey}`);
  }

  /**
   * Generate cache key for a list
   * Format: "list:domain:filter1:filter2"
   */
  protected listCacheKey(filters?: Record<string, string>): string {
    return cacheKeyBuilder.list(this.domain, filters);
  }

  /**
   * Invalidate cache for entity with given ID
   * Call after mutations
   */
  invalidate(id: string | number): void {
    const key = this.cacheKey(id);
    this.context.cache.invalidate([key]);
  }

  /**
   * Invalidate multiple cache entries
   */
  protected invalidateMultiple(ids: (string | number)[]): void {
    const keys = ids.map((id) => this.cacheKey(id));
    this.context.cache.invalidate(keys);
  }

  /**
   * Invalidate all caches for this domain
   * Use sparingly - prefer specific invalidation
   */
  protected invalidateAll(): void {
    // Invalidate list caches
    const listKey = this.listCacheKey();
    this.context.cache.invalidate([listKey]);
  }

  /**
   * Get from cache or return null
   */
  protected getFromCache<T>(key: string): T | null {
    return this.context.cache.get(key) || null;
  }

  /**
   * Set in cache
   */
  protected setInCache<T>(key: string, value: T, ttlMs?: number): T {
    this.context.cache.set(key, value, ttlMs);
    return value;
  }

  /**
   * Common pattern: get from cache or fetch
   */
  protected async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs?: number,
  ): Promise<T> {
    const cached = this.getFromCache<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    this.setInCache(key, value, ttlMs);
    return value;
  }

  /**
   * Validate entity exists or throw
   */
  protected async ensureExists<T>(
    entity: T | null | undefined,
    entityName: string,
    id: string | number,
  ): Promise<T> {
    if (!entity) {
      throw new NotFoundError(entityName, String(id));
    }
    return entity;
  }

  /**
   * Validate that a value exists (not null/undefined/empty string) or throw
   */
  protected validate(value: any, message: string): void {
    if (!value) {
      throw new ValidationError(message);
    }
  }

  /**
   * Validate a condition or throw
   */
  protected validateCondition(condition: boolean, message: string): void {
    if (!condition) {
      throw new ValidationError(message);
    }
  }

  /**
   * Get authenticated user ID or throw
   */
  protected requireAuth(): string {
    if (!this.context.isAuthenticated || !this.context.userId) {
      throw new ServiceError("Authentication required", "UNAUTHENTICATED", 401);
    }
    return this.context.userId;
  }

  /**
   * Check if user owns resource or throw
   */
  protected requireOwnership(ownerId: string): void {
    const currentUserId = this.requireAuth();
    if (currentUserId !== ownerId) {
      throw new ServiceError(
        "Not authorized to access this resource",
        "FORBIDDEN",
        403,
      );
    }
  }

  /**
   * Get logger for this service
   */
  protected log(
    level: "info" | "warn" | "error" | "debug",
    message: string,
    data?: any,
  ): void {
    const requestId = this.context.requestId;
    const timestamp = new Date().toISOString();
    const label = `[${timestamp}] [${requestId}] [${this.domain}Service]`;

    if (level === "error") {
      console.error(`${label} ${message}`, data || "");
    } else if (level === "warn") {
      console.warn(`${label} ${message}`, data || "");
    }
  }

  /**
   * Export common error classes
   */
  protected NotFoundError = NotFoundError;
  protected ValidationError = ValidationError;
  protected AuthorizationError = AuthorizationError;
  protected ServiceError = ServiceError;
}
