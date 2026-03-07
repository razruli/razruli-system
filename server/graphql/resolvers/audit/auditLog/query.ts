/**
 * ============================================================================
 * AuditLog Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for audit log queries

/** Require authentication + auditLog:read permission */
const auditLogReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["auditLog:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single audit log by ID
 * Requires authentication to read audit data
 */
const auditLogResolver: QueryResolvers["auditLog"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.auditLog.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch audit log: ${error}`);
  }
};

/**
 * List audit logs with filtering and pagination
 * Supports filtering by action, entity, timestamp
 */
const auditLogsResolver: QueryResolvers["auditLogs"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // Convert filter input to service format
    const serviceFilter = filter
      ? {
          action: filter.actionType,
          entityType: filter.entityType,
          userId: filter.userId,
          dateFrom: filter.dateRange?.from,
          dateTo: filter.dateRange?.to,
        }
      : undefined;

    // Convert pagination input to service format
    const servicePagination = pagination
      ? {
          skip: pagination.skip || 0,
          take: pagination.take || 20,
          orderBy: pagination.orderBy
            ? {
                field: pagination.orderBy.field,
                order: pagination.orderBy.order as "ASC" | "DESC",
              }
            : undefined,
        }
      : {
          skip: 0,
          take: 20,
        };

    const result = await context.services.auditLog.find(
      serviceFilter,
      servicePagination,
    );

    return {
      nodes: result.data,
      totalCount: result.total,
      pageInfo: {
        total: result.total,
        hasMore: result.hasMore,
        offset: result.skip,
        limit: result.take,
      },
    };
  } catch (error) {
    throw new Error(`Failed to list audit logs: ${error}`);
  }
};

/**
 * Get data access audit for a company
 */
const dataAccessAuditResolver: QueryResolvers["dataAccessAudit"] = async (
  _parent,
  { companyId },
  context,
) => {
  try {
    return (
      (await context.prisma.auditLog.findMany({
        where: { companyId },
        take: 100,
      })) || []
    );
  } catch (error) {
    throw new Error(`Failed to fetch data access audit: ${error}`);
  }
};

/**
 * Get security incident report
 */
const securityIncidentReportResolver: QueryResolvers["securityIncidentReport"] =
  async (_parent, { companyId, dateRange }, context) => {
    try {
      const company = await context.services.company.getById(companyId);
      return {
        company,
        from: new Date(dateRange.from),
        to: new Date(dateRange.to),
        failedAuthAttempts: 0,
        blockedAttempts: 0,
        incidents: [],
        generatedAt: new Date(),
        period: dateRange,
        suspiciousBehavior: 0,
        totalIncidents: 0,
      };
    } catch (error) {
      throw new Error(`Failed to fetch security incident report: ${error}`);
    }
  };

/**
 * Get suspicious activities
 */
const suspiciousActivitiesResolver: QueryResolvers["suspiciousActivities"] =
  async (_parent, { companyId }, context) => {
    try {
      return (
        (await context.prisma.auditLog.findMany({
          where: { companyId, action: { in: ["DELETE", "MODIFY"] } },
          take: 50,
        })) || []
      );
    } catch (error) {
      throw new Error(`Failed to fetch suspicious activities: ${error}`);
    }
  };

/**
 * Get failed login attempts
 */
const failedLoginAttemptsResolver: QueryResolvers["failedLoginAttempts"] =
  async (_parent, _args, _context) => {
    try {
      return [];
    } catch (error) {
      throw new Error(`Failed to fetch failed login attempts: ${error}`);
    }
  };

/**
 * Get audit trail for a specific entity
 */
const entityAuditTrailResolver: QueryResolvers["entityAuditTrail"] = async (
  _parent,
  { entityType, entityId },
  context,
) => {
  try {
    const logs = await context.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      // orderBy: { createdAt: "desc" },
    });

    return {
      entityType,
      entityId,
      totalChanges: logs.length,
      changes: logs,
    };
  } catch (error) {
    throw new Error(`Failed to fetch entity audit trail: ${error}`);
  }
};

// ==================== WRAPPED RESOLVERS ====================

const wrappedAuditLog = withMiddleware(
  auditLogResolver,
  auditLogReadMiddleware,
);

const wrappedAuditLogs = withMiddleware(
  auditLogsResolver,
  auditLogReadMiddleware,
);

const wrappedDataAccessAudit = withMiddleware(
  dataAccessAuditResolver,
  auditLogReadMiddleware,
);

const wrappedSecurityIncidentReport = withMiddleware(
  securityIncidentReportResolver,
  auditLogReadMiddleware,
);

const wrappedSuspiciousActivities = withMiddleware(
  suspiciousActivitiesResolver,
  auditLogReadMiddleware,
);

const wrappedFailedLoginAttempts = withMiddleware(
  failedLoginAttemptsResolver,
  auditLogReadMiddleware,
);

const wrappedEntityAuditTrail = withMiddleware(
  entityAuditTrailResolver,
  auditLogReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const auditLogQueries: Pick<
  QueryResolvers,
  | "auditLog"
  | "auditLogs"
  | "dataAccessAudit"
  | "securityIncidentReport"
  | "suspiciousActivities"
  | "failedLoginAttempts"
  | "entityAuditTrail"
> = {
  auditLog: wrappedAuditLog,
  auditLogs: wrappedAuditLogs,
  dataAccessAudit: wrappedDataAccessAudit,
  securityIncidentReport: wrappedSecurityIncidentReport,
  suspiciousActivities: wrappedSuspiciousActivities,
  failedLoginAttempts: wrappedFailedLoginAttempts,
  entityAuditTrail: wrappedEntityAuditTrail,
};

export default auditLogQueries;
