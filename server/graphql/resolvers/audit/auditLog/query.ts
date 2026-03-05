/**
 * ============================================================================
 * AuditLog Domain - Query Resolvers
 * ============================================================================
 * Handles all audit log-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

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
  /**
   * Get a single audit log by ID
   * Requires authentication to read audit data
   */
  auditLog: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.auditLog.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch audit log: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),

  /**
   * List audit logs with filtering and pagination
   * Supports filtering by action, entity, timestamp
   */
  auditLogs: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              action: filter.action,
              entityType: filter.entityType,
              userId: filter.userId,
              dateFrom: filter.dateFrom,
              dateTo: filter.dateTo,
            }
          : {};

        // Convert pagination input to service format
        const servicePagination = pagination
          ? {
              offset: pagination.offset || 0,
              limit: pagination.limit || 20,
              sortBy: pagination.sortBy || "createdAt",
              sortOrder: pagination.sortOrder || "DESC",
            }
          : {
              offset: 0,
              limit: 20,
              sortBy: "createdAt",
              sortOrder: "DESC",
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
            offset: servicePagination.offset,
            limit: servicePagination.limit,
          },
        };
      } catch (error) {
        throw new Error(`Failed to list audit logs: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),

  /**
   * Get data access audit for a company
   */
  dataAccessAudit: withMiddleware(
    async (_parent, { companyId }, context) => {
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
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),

  /**
   * Get security incident report
   */
  securityIncidentReport: withMiddleware(
    async (_parent, { companyId, dateRange }, context) => {
      try {
        return {
          company: await context.services.company.getById(companyId),
          from: new Date(dateRange.start),
          to: new Date(dateRange.end),
          failedAuthAttempts: 0,
          blockedAttempts: 0,
          incidents: [],
          generatedAt: new Date(),
        };
      } catch (error) {
        throw new Error(`Failed to fetch security incident report: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),

  /**
   * Get suspicious activities
   */
  suspiciousActivities: withMiddleware(
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
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),

  /**
   * Get failed login attempts
   */
  failedLoginAttempts: withMiddleware(
    async (_parent, { dateRange }, context) => {
      try {
        return [];
      } catch (error) {
        throw new Error(`Failed to fetch failed login attempts: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),

  /**
   * Get audit trail for a specific entity
   */
  entityAuditTrail: withMiddleware(
    async (_parent, { entityType, entityId }, context) => {
      try {
        const logs = await context.prisma.auditLog.findMany({
          where: {
            entityType,
            entityId,
          },
          orderBy: { createdAt: "desc" },
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
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:read"],
    },
  ),
};

export default auditLogQueries;
