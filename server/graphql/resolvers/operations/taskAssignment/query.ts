/**
 * ============================================================================
 * TaskAssignment Domain - Query Resolvers
 * ============================================================================
 * Handles all task assignment-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const taskAssignmentQueries: Pick<
  QueryResolvers,
  "taskAssignment" | "taskAssignments"
> = {
  /**
   * Get a single task assignment by ID
   * Requires authentication to read assignment data
   */
  taskAssignment: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.taskAssignment.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch task assignment: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["taskAssignment:read"],
    },
  ),

  /**
   * List task assignments with filtering and pagination
   * Supports filtering by employee, process, status
   */
  taskAssignments: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              employeeId: filter.employeeId,
              processId: filter.processId,
              status: filter.status,
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

        const result = await context.services.taskAssignment.find(
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
        throw new Error(`Failed to list task assignments: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["taskAssignment:read"],
    },
  ),

  /**
   * Get task assignments for a specific employee
   */
  // employeeTaskAssignments: withMiddleware(
  //   async (_parent, { employeeId }, context) => {
  //     try {
  //       return await context.services.taskAssignment.findByEmployee(employeeId);
  //     } catch (error) {
  //       throw new Error(`Failed to fetch employee task assignments: ${error}`);
  //     }
  //   },
  //   {
  //     requireAuth: true,
  //     requiredPermissions: ["taskAssignment:read"],
  //   },
  // ),
};

export default taskAssignmentQueries;
