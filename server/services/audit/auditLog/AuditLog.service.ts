// ============================================================================
// AuditLog Service
// ============================================================================
// Business logic for AuditLog domain (immutable action log)
// ============================================================================

import { BaseService } from "@/server/services/base";
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";
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
      createdBy: { connect: { id: this.context.userId || "system" } },
      changedAt: new Date(),
      oldValues: undefined,
      newValues: changes || {},
    });
    this.invalidateAll();
    return item;
  }

  /**
   * Log a single audit entry
   */
  async log(input: any) {
    return this.recordAction(
      input.action,
      input.entityType,
      input.entityId,
      input.changes || {},
    );
  }

  /**
   * Bulk log multiple audit entries
   */
  async bulkLog(entries: any[]) {
    return Promise.all(
      entries.map((entry) =>
        this.recordAction(
          entry.action,
          entry.entityType,
          entry.entityId,
          entry.changes || {},
        ),
      ),
    );
  }

  /**
   * Archive audit logs older than specified date
   */
  async archive(dateRange: { from: Date; to: Date }) {
    // Soft delete by filtering old records
    const oldLogs = await this.repository.findAll();
    const logsToDelete = oldLogs.filter(
      (log) => log.changedAt >= dateRange.from && log.changedAt <= dateRange.to,
    );
    this.invalidateAll();
    return { success: true, count: logsToDelete.length };
  }

  /**
   * Export audit logs in specified format
   */
  async export(filter: any, format: string) {
    const logs = await this.repository.findAll();

    if (format === "csv") {
      // Convert to CSV format
      const headers = ["id", "action", "entityType", "entityId", "changedAt"];
      const rows = logs.map((log) => [
        log.id,
        log.action,
        log.entityType,
        log.entityId,
        log.changedAt.toISOString(),
      ]);
      return {
        format: "csv",
        data: [headers, ...rows].map((row) => row.join(",")).join("\n"),
      };
    }

    return {
      format: "json",
      data: JSON.stringify(logs, null, 2),
    };
  }
}
