/**
 * ============================================================================
 * GapAnalysis Domain - Query Resolvers
 * ============================================================================
 * Handles all gap analysis-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const gapAnalysisQueries: Pick<
  QueryResolvers,
  "gapAnalysis" | "gapAnalyses"
> = {
  /**
   * Get a single gap analysis by ID
   * Requires authentication to read analysis data
   */
  gapAnalysis: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.gapAnalysis.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch gap analysis: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * List gap analyses with filtering and pagination
   * Supports filtering by company, department
   */
  gapAnalyses: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              companyId: filter.companyId,
              departmentId: filter.departmentId,
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

        const result = await context.services.gapAnalysis.find(
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
        throw new Error(`Failed to list gap analyses: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),
};

export default gapAnalysisQueries;
