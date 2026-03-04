/**
 * ============================================================================
 * EmployeeHistory Domain - Query Resolvers
 * ============================================================================
 * Handles all employee history-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const employeeHistoryQueries: Pick<
  QueryResolvers,
  "employeeHistory" | "employeeHistories" | "employeeChangeHistory" | "employeeHistoryList"
> = {
  /**
   * Get a single employee history record by ID
   * Requires authentication to read history data
   */
  employeeHistory: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.employeeHistory.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch employee history: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employeeHistory:read"],
    },
  ),

  /**
   * List employee history records with filtering and pagination
   * Supports filtering by employee, date range
   */
  employeeHistories: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              employeeId: filter.employeeId,
              changeType: filter.changeType,
              dateFrom: filter.dateFrom,
              dateTo: filter.dateTo,
            }
          : {};

        // Convert pagination input to service format
        const servicePagination = pagination
          ? {
              offset: pagination.offset || 0,
              limit: pagination.limit || 20,
              sortBy: pagination.sortBy || "changedAt",
              sortOrder: pagination.sortOrder || "DESC",
            }
          : {
              offset: 0,
              limit: 20,
              sortBy: "changedAt",
              sortOrder: "DESC",
            };

        const result = await context.services.employeeHistory.find(
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
        throw new Error(`Failed to list employee histories: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employeeHistory:read"],
    },
  ),

  /**
   * Get history for a specific employee
   */
  employeeChangeHistory: withMiddleware(
    async (_parent, { employeeId }, context) => {
      try {
        return await context.services.employeeHistory.findByEmployee(
          employeeId,
        );
      } catch (error) {
        throw new Error(`Failed to fetch employee change history: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employeeHistory:read"],
    },
  ),

  /**
   * Get full history for an employee with pagination
   */
  employeeHistoryList: withMiddleware(
    async (_parent, { employeeId, filter, pagination }, context) => {
      try {
        // Build service filter
        const serviceFilter = {
          employeeId,
          ...(filter && {
            changeType: filter.changeType,
            changedBy: filter.changedBy,
            dateFrom: filter.dateRange?.from,
            dateTo: filter.dateRange?.to,
          }),
        };

        // Convert pagination input to service format
        const servicePagination = pagination
          ? {
              skip: pagination.skip || 0,
              take: pagination.take || 20,
              sortBy: pagination.orderBy?.field || "changedAt",
              sortOrder: pagination.orderBy?.order || "DESC",
            }
          : {
              skip: 0,
              take: 20,
              sortBy: "changedAt",
              sortOrder: "DESC",
            };

        const result = await context.services.employeeHistory.find(
          serviceFilter,
          servicePagination,
        );

        return {
          nodes: result.data,
          totalCount: result.total,
          pageInfo: {
            total: result.total,
            hasMore: (servicePagination.skip || 0) + (servicePagination.take || 20) < result.total,
            offset: servicePagination.skip || 0,
            limit: servicePagination.take || 20,
          },
        };
      } catch (error) {
        throw new Error(`Failed to fetch employee history list: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employeeHistory:read"],
    },
  ),
};

export default employeeHistoryQueries;
