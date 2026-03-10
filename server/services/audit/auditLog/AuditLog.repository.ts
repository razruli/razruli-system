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

  async findByCompanyId(
    companyId: string,
    options: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ data: AuditLog[]; total: number }> {
    const skip = options.offset || 0;
    const take = options.limit || 50;
    const orderBy = options.sortBy || "changedAt";
    const orderDirection = (options.sortOrder || "desc") as "asc" | "desc";

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { companyId },
        skip,
        take,
        orderBy: { [orderBy]: orderDirection },
      }),
      this.prisma.auditLog.count({ where: { companyId } }),
    ]);

    return { data, total };
  }

  async findRecent(companyId: string, limit: number = 50): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { companyId },
      orderBy: { changedAt: "desc" },
      take: limit,
    });
  }

  async findRecentByUser(
    userId: string,
    companyId: string,
    limit: number = 20,
  ): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { createdById: userId, companyId },
      orderBy: { changedAt: "desc" },
      take: limit,
    });
  }

  // ==================== AGGREGATION OPERATIONS ====================

  async aggregateByActionType(
    companyId: string,
    dateRange?: { from: Date; to: Date },
  ): Promise<
    Array<{
      actionType: string;
      count: number;
      successCount: number;
      failureCount: number;
    }>
  > {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        companyId,
        ...(dateRange && {
          changedAt: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        }),
      },
    });

    // Group and aggregate
    const grouped = logs.reduce(
      (acc, log) => {
        if (!acc[log.action]) {
          acc[log.action] = {
            actionType: log.action,
            count: 0,
            successCount: 0,
            failureCount: 0,
          };
        }
        acc[log.action].count++;
        acc[log.action].successCount++;
        return acc;
      },
      {} as Record<
        string,
        {
          actionType: string;
          count: number;
          successCount: number;
          failureCount: number;
        }
      >,
    );

    return Object.values(grouped);
  }

  async aggregateByActionTypeForUser(
    userId: string,
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<
    Array<{
      actionType: string;
      count: number;
      successCount: number;
      failureCount: number;
    }>
  > {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdById: userId,
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
    });

    // Group and aggregate
    const grouped = logs.reduce(
      (acc, log) => {
        if (!acc[log.action]) {
          acc[log.action] = {
            actionType: log.action,
            count: 0,
            successCount: 0,
            failureCount: 0,
          };
        }
        acc[log.action].count++;
        acc[log.action].successCount++;
        return acc;
      },
      {} as Record<
        string,
        {
          actionType: string;
          count: number;
          successCount: number;
          failureCount: number;
        }
      >,
    );

    return Object.values(grouped);
  }

  // ==================== COUNT OPERATIONS ====================

  async countActions(
    companyId: string,
    userId?: string,
    dateRange?: { from: Date; to: Date },
  ): Promise<number> {
    const where: any = { companyId };

    if (userId) {
      where.createdById = userId;
    }

    if (dateRange) {
      where.changedAt = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    return this.prisma.auditLog.count({ where });
  }

  async countSuccesses(
    companyId: string,
    userId?: string,
    dateRange?: { from: Date; to: Date },
  ): Promise<number> {
    // For AuditLog, all logged actions are considered successes
    return this.countActions(companyId, userId, dateRange);
  }

  async countFailures(
    userId: string,
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<number> {
    // For AuditLog, we don't have a "result" field, so we can't count failures
    return 0;
  }

  async calculateSuccessRate(
    userId: string,
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<number> {
    const total = await this.countActions(companyId, userId, dateRange);
    if (total === 0) return 100;

    const successCount = await this.countSuccesses(
      companyId,
      userId,
      dateRange,
    );
    return (successCount / total) * 100;
  }

  // ==================== SUSPICIOUS/RISKY OPERATIONS ====================

  async findSuspiciousActivities(
    companyId: string,
    userId?: string,
    dateRange?: { from: Date; to: Date },
  ): Promise<AuditLog[]> {
    const where: any = { companyId };

    if (userId) {
      where.createdById = userId;
    }

    if (dateRange) {
      where.changedAt = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    where.OR = [
      { action: "DELETE" },
      { action: "BULK_OPERATION" },
      { action: { not: "SUCCESS" } },
    ];

    return this.prisma.auditLog.findMany({
      where,
      take: 50,
    });
  }

  async findByRiskLevel(
    companyId: string,
    dateRange: { from: Date; to: Date },
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  ): Promise<AuditLog[]> {
    // Simplified: map risk level to action types
    const riskActions: Record<string, string[]> = {
      LOW: ["READ"],
      MEDIUM: ["CREATE", "UPDATE"],
      HIGH: ["DELETE", "PERMISSION_CHANGE"],
      CRITICAL: ["BULK_OPERATION", "CONFIGURATION_CHANGE"],
    };

    return this.prisma.auditLog.findMany({
      where: {
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
        action: { in: riskActions[riskLevel] || [] },
      },
      orderBy: { changedAt: "desc" },
    });
  }

  async findSuspiciousPatternsForCompany(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<string[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      take: 100,
    });

    // Identify patterns
    const patterns: string[] = [];

    if (logs.length > 50) {
      patterns.push("Unusual high activity volume");
    }

    const deleteOps = logs.filter((l) => l.action === "DELETE");
    if (deleteOps.length > 10) {
      patterns.push("Suspicious delete activity");
    }

    return patterns;
  }

  // ==================== COMPLIANCE OPERATIONS ====================

  async getUserAccessSummary(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<any[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      orderBy: { changedAt: "desc" },
    });

    const userMap = new Map<
      string,
      {
        userId: string;
        lastLogin: Date;
        activeMinutesThisPeriod: number;
        dataAccessCount: number;
        criticalActionsCount: number;
        riskLevel: string;
      }
    >();

    for (const log of logs) {
      if (!userMap.has(log.createdById)) {
        userMap.set(log.createdById, {
          userId: log.createdById,
          lastLogin: log.changedAt,
          activeMinutesThisPeriod: 0,
          dataAccessCount: 0,
          criticalActionsCount: 0,
          riskLevel: "LOW",
        });
      }

      const summary = userMap.get(log.createdById)!;
      summary.activeMinutesThisPeriod += 5;
      if (log.action === "READ" || log.action === "EXPORT") {
        summary.dataAccessCount++;
      }
      if (log.action === "DELETE" || log.action === "PERMISSION_CHANGE") {
        summary.criticalActionsCount++;
      }

      // Calculate risk level
      if (summary.criticalActionsCount > 10) {
        summary.riskLevel = "CRITICAL";
      } else if (summary.criticalActionsCount > 5) {
        summary.riskLevel = "HIGH";
      } else if (summary.dataAccessCount > 20) {
        summary.riskLevel = "MEDIUM";
      }
    }

    return Array.from(userMap.values());
  }

  async countSensitiveDataAccess(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<number> {
    return this.prisma.auditLog.count({
      where: {
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
        OR: [{ action: "READ" }, { action: "EXPORT" }],
      },
    });
  }

  async countUnauthorizedAttempts(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<number> {
    return this.prisma.auditLog.count({
      where: {
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
        action: { in: ["UNAUTHORIZED", "FORBIDDEN"] },
      },
    });
  }

  async countDataExports(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<number> {
    return this.prisma.auditLog.count({
      where: {
        companyId,
        changedAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
        action: "EXPORT",
      },
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
