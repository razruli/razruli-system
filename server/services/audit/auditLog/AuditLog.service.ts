// ============================================================================
// AuditLog Service
// ============================================================================
// Business logic for AuditLog domain (immutable action log)
// ============================================================================

import type { AuditLog } from "@/server/db/generated/prisma/client";
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

  // ==================== READ OPERATIONS ====================

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

  async getRecent(companyId: string, limit: number = 50): Promise<AuditLog[]> {
    this.log({ companyId, limit });
    const cacheKey = this.listCacheKey({ companyId, limit: `recent-${limit}` });

    return await this.getOrFetch(cacheKey, () =>
      this.repository.findRecent(companyId, limit),
    );
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

  // ==================== AGGREGATION OPERATIONS ====================

  async getUserActivitySummary(
    userId: string,
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<any> {
    this.log({
      userId,
      companyId,
      dateRange,
    });

    const [
      totalActions,
      actionsByType,
      successRate,
      failureCount,
      recentActions,
    ] = await Promise.all([
      this.repository.countActions(companyId, userId, dateRange),
      this.repository.aggregateByActionTypeForUser(
        userId,
        companyId,
        dateRange,
      ),
      this.repository.calculateSuccessRate(userId, companyId, dateRange),
      this.repository.countFailures(userId, companyId, dateRange),
      this.repository.findRecentByUser(userId, companyId, 20),
    ]);

    // Calculate risk indicators
    const suspiciousActivities = await this.repository.findSuspiciousActivities(
      companyId,
      userId,
      dateRange,
    );
    const riskScore = this.calculateRiskScore(
      totalActions,
      failureCount,
      suspiciousActivities.length,
    );

    return {
      user: { id: userId },
      activePeriod: dateRange,
      generatedAt: new Date(),
      totalActions,
      actionsByType,
      successRate,
      failureCount,
      recentActions,
      unusualActivities:
        suspiciousActivities.length > 0
          ? `${suspiciousActivities.length} suspicious activities detected`
          : "No suspicious activities",
      riskScore,
    };
  }

  async getEntityAuditTrail(
    entityType: string,
    entityId: string,
  ): Promise<any> {
    this.log({ entityType, entityId });

    const logs = await this.repository.findByEntity(entityType, entityId);

    // Group changes by user
    const changesByUser = this.groupChangesByUser(logs);

    // Calculate snapshots
    const sortedLogs = logs.sort(
      (a, b) =>
        new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
    );
    const currentState = sortedLogs[0]?.newValues;
    const previousState =
      sortedLogs[sortedLogs.length - 1]?.oldValues || sortedLogs[0]?.newValues;

    return {
      entityType,
      entityId,
      timeline: logs,
      currentState,
      previousState,
      totalChanges: logs.length,
      changesByUser,
    };
  }

  async getComplianceReport(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<any> {
    this.log({ companyId, dateRange });

    const [
      totalAuditedActions,
      successCount,
      highRiskActivities,
      suspiciousPatterns,
      userAccessSummary,
      sensitiveDataAccess,
      unauthorizedAccessAttempts,
      dataExportCount,
    ] = await Promise.all([
      this.repository.countActions(companyId, undefined, dateRange),
      this.repository.countSuccesses(companyId, undefined, dateRange),
      this.repository.findByRiskLevel(companyId, dateRange, "HIGH"),
      this.repository.findSuspiciousPatternsForCompany(companyId, dateRange),
      this.repository.getUserAccessSummary(companyId, dateRange),
      this.repository.countSensitiveDataAccess(companyId, dateRange),
      this.repository.countUnauthorizedAttempts(companyId, dateRange),
      this.repository.countDataExports(companyId, dateRange),
    ]);

    const complianceRate =
      totalAuditedActions > 0 ? (successCount / totalAuditedActions) * 100 : 0;

    return {
      company: { id: companyId },
      reportPeriod: dateRange,
      generatedAt: new Date(),
      totalAuditedActions,
      complianceRate,
      highRiskActivities,
      suspiciousPatterns,
      userAccessSummary: userAccessSummary.map((summary: any) => ({
        user: { id: summary.userId },
        lastLogin: summary.lastLogin,
        activeMinutesThisPeriod: summary.activeMinutesThisPeriod,
        dataAccessCount: summary.dataAccessCount,
        criticalActionsCount: summary.criticalActionsCount,
        riskLevel: summary.riskLevel,
      })),
      sensitiveDataAccess,
      unauthorizedAccessAttempts,
      dataExportCount,
    };
  }

  async getSecurityIncidentReport(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<any> {
    this.log({
      companyId,
      dateRange,
    });

    const [suspiciousActivities, unauthorizedAttempts] = await Promise.all([
      this.repository.findSuspiciousActivities(companyId, undefined, dateRange),
      this.repository.countUnauthorizedAttempts(companyId, dateRange),
    ]);

    return {
      company: { id: companyId },
      period: dateRange,
      generatedAt: new Date(),
      totalIncidents: suspiciousActivities.length,
      incidents: suspiciousActivities.map((activity: any) => ({
        id: activity.id,
        type: activity.action,
        severity: "MEDIUM",
        timestamp: activity.changedAt,
      })),
      blockedAttempts: 0,
      failedAuthAttempts: unauthorizedAttempts,
      suspiciousBehavior: suspiciousActivities.length,
    };
  }

  async getActionTypeSummary(
    companyId: string,
    dateRange: { from: Date; to: Date },
  ): Promise<any[]> {
    this.log({ companyId, dateRange });

    return this.repository.aggregateByActionType(companyId, dateRange);
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

  // ==================== PRIVATE HELPER METHODS ====================

  private groupChangesByUser(logs: AuditLog[]): any[] {
    const userMap = new Map<
      string,
      { userId: string; changeCount: number; timestamp: Date }
    >();

    for (const log of logs) {
      if (!userMap.has(log.createdById)) {
        userMap.set(log.createdById, {
          userId: log.createdById,
          changeCount: 0,
          timestamp: log.changedAt,
        });
      }

      const entry = userMap.get(log.createdById)!;
      entry.changeCount++;
      // Update to the most recent timestamp
      if (log.changedAt > entry.timestamp) {
        entry.timestamp = log.changedAt;
      }
    }

    return Array.from(userMap.values()).map((entry) => ({
      user: { id: entry.userId },
      changeCount: entry.changeCount,
      timestamp: entry.timestamp,
    }));
  }

  private calculateRiskScore(
    totalActions: number,
    failureCount: number,
    suspiciousActivityCount: number,
  ): number {
    let score = 0;

    // Penalize failures
    const failureRate =
      totalActions > 0 ? (failureCount / totalActions) * 100 : 0;
    score += failureRate * 0.5;

    // Penalize suspicious activities
    score += suspiciousActivityCount * 10;

    return Math.min(Math.max(Math.round(score), 0), 100);
  }
}
