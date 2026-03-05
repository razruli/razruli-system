/**
 * ============================================================================
 * Process Domain - Query Resolvers
 * ============================================================================
 * Handles all process-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const processQueries: Pick<
  QueryResolvers,
  "process" | "processes" | "processTasks" | "processWithMetrics" | "companyProcessMetrics"
> = {
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

  /**
   * Get tasks assigned to a specific process
   */
  processTasks: withMiddleware(
    async (_parent, { processId }, context) => {
      try {
        return await context.services.taskAssignment.findByProcess(processId);
      } catch (error) {
        throw new Error(`Failed to fetch process tasks: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:read"],
    },
  ),

  /**
   * Get process with associated metrics
   * Includes: completion rate, task count, total load, etc.
   */
  processWithMetrics: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        const process = await context.services.process.getById(id);
        if (!process) return null;

        const tasks = await context.services.taskAssignment.findByProcess(id);
        const totalLoad = tasks.reduce(
          (sum, task) => sum + (task.plannedHours || 0),
          0,
        );

        return {
          process,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.status === "COMPLETED").length,
          totalPlannedHours: totalLoad,
          avgTaskLoad: tasks.length > 0 ? totalLoad / tasks.length : 0,
          completionRate:
            tasks.length > 0
              ? (tasks.filter((t) => t.status === "COMPLETED").length /
                  tasks.length) *
                100
              : 0,
        };
      } catch (error) {
        throw new Error(`Failed to fetch process metrics: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:read"],
    },
  ),

  /**
   * Get metrics for all processes in a company
   */
  companyProcessMetrics: withMiddleware(
    async (_parent, { companyId }, context) => {
      try {
        const processes = await context.prisma.process.findMany({
          where: { companyId },
        });

        const metrics = await Promise.all(
          processes.map(async (process) => {
            const tasks = await context.services.taskAssignment.findByProcess(
              process.id,
            );
            const totalLoad = tasks.reduce(
              (sum, task) => sum + (task.plannedHours || 0),
              0,
            );

            return {
              process,
              totalTasks: tasks.length,
              completedTasks: tasks.filter((t) => t.status === "COMPLETED")
                .length,
              totalPlannedHours: totalLoad,
              avgTaskLoad: tasks.length > 0 ? totalLoad / tasks.length : 0,
              completionRate:
                tasks.length > 0
                  ? (tasks.filter((t) => t.status === "COMPLETED").length /
                      tasks.length) *
                    100
                  : 0,
            };
          }),
        );

        return metrics;
      } catch (error) {
        throw new Error(`Failed to fetch company process metrics: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:read"],
    },
  ),
};

export default processQueries;
