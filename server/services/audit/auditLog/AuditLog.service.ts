// ============================================================================
// AuditLog Service
// ============================================================================
// Business logic for AuditLog domain (immutable action log)
// ============================================================================

import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";

import { AuditLogRepository } from "./AuditLog.repository";

export class AuditLogService extends BaseService {
  readonly domain = "auditLog";
  private repository: AuditLogRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new AuditLogRepository(context.prisma);
  }

  async getById(id: string) {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByEntity(entityType: string, entityId: string) {
    const cacheKey = this.listCacheKey({ entityType, entityId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByEntity(entityType, entityId),
    );
  }

  async getAll() {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  /**
   * Find audit logs with filtering and pagination
   */
  async find(
    filter?: FilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedResult<any>> {
    const filterKey = filter ? JSON.stringify(filter) : "none";
    const paginationKey = pagination
      ? `${pagination.skip || 0}-${pagination.take || 20}`
      : "0-20";
    const cacheKey = this.queryCacheKey(`find:${filterKey}:${paginationKey}`);

    return this.getOrFetch(cacheKey, () =>
      this.repository.find(filter, pagination),
    );
  }

  // ==================== MUTATIONS ====================

  async recordAction(
    action: string,
    entityType: string,
    entityId: string,
    changes: any,
  ) {
    // Get company context from user or use default
    const companyId = this.context.user?.id || "default-company";

    const item = await this.repository.create({
      action,
      entityType,
      entityId,
      companyId,
      changedBy: this.context.userId || "anonymous",
      changedAt: new Date(),
      oldValues: undefined,
      newValues: changes || {},
    });
    this.invalidateAll();
    return item;
  }
}
