/**
 * ============================================================================
 * AuditLog Domain - Query Resolvers
 * ============================================================================
 * Handles all audit log-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const auditLogQueries: Pick<QueryResolvers, "auditLog" | "auditLogs"> = {
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
};

export default auditLogQueries;
