// ============================================================================
// AuditLog Repository
// ============================================================================
// Handles ALL database access for AuditLog domain
// ============================================================================

import type { AuditLog, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

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

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data });
  }
}
