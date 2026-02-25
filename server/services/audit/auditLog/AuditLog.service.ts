// ============================================================================
// AuditLog Service
// ============================================================================
// Business logic for AuditLog domain (immutable action log)
// ============================================================================

import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

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
