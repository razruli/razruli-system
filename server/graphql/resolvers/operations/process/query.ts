/**
 * ============================================================================
 * Process Domain - Query Resolvers
 * ============================================================================
 * Handles all process-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const processQueries: Pick<QueryResolvers, "process" | "processes"> = {
  /**
   * Get a single process by ID
   * Requires authentication to read process data
   */
  process: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.process.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch process: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:read"],
    },
  ),

  /**
   * List processes with filtering and pagination
   * Supports filtering by status, company
   */
  processes: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              companyId: filter.companyId,
              status: filter.status,
              search: filter.search,
            }
          : {};

        // Convert pagination input to service format
        const servicePagination = pagination
          ? {
              offset: pagination.offset || 0,
              limit: pagination.limit || 20,
              sortBy: pagination.sortBy || "createdAt",
              sortOrder: pagination.sortOrder || "ASC",
            }
          : {
              offset: 0,
              limit: 20,
              sortBy: "createdAt",
              sortOrder: "ASC",
            };

        const result = await context.services.process.find(
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
        throw new Error(`Failed to list processes: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:read"],
    },
  ),
};

export default processQueries;
