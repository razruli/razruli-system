// ============================================================================
// AuditLog Repository
// ============================================================================
// Handles ALL database access for AuditLog domain
// ============================================================================

import type { AuditLog, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";

export class AuditLogRepository extends BaseRepository<AuditLog> {
  protected readonly modelName = "auditLog" as const;

  // ==================== READ OPERATIONS ====================

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { changedAt: "desc" },
    });
  }

  async findAll(): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { changedAt: "desc" },
    });
  }

  /**
   * Find audit logs with filtering and pagination
   */
  async find(
    filter?: FilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedResult<AuditLog>> {
    return this.findWithPagination(filter, pagination);
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data });
  }
}
