/**
 * ============================================================================
 * Process Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers, SortOrder } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for process queries

/** Require authentication + process:read permission */
const processReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["process:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single process by ID
 * Requires authentication to read process data
 */
const processResolver: QueryResolvers["process"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.process.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch process: ${error}`);
  }
};

/**
 * List processes with filtering and pagination
 * Supports filtering by status, company
 */
const processesResolver: QueryResolvers["processes"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // Convert filter input to service format
    const serviceFilter = filter
      ? {
          companyId: filter.companyId ?? undefined,
          status: filter.status ?? undefined,
          search: filter.search ?? undefined,
        }
      : undefined;

    // Convert pagination input to service format
    // Map GraphQL enum values to Prisma field names
    const sortFieldMap: Record<string, string> = {
      CREATED_AT: "createdAt",
      UPDATED_AT: "updatedAt",
      TITLE: "title",
      PLANNED_HOURS: "plannedHours",
      STATUS: "status",
    };

    const servicePagination = pagination
      ? {
          offset: pagination.skip || 0,
          limit: pagination.take || 20,
          sortBy:
            sortFieldMap[pagination.orderBy?.field || "CREATED_AT"] ||
            "createdAt",
          sortOrder: pagination.orderBy?.order || ("ASC" as SortOrder),
        }
      : {
          offset: 0,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "ASC" as SortOrder,
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
};

/**
 * Get tasks assigned to a specific process
 */
const processTasksResolver: QueryResolvers["processTasks"] = async (
  _parent,
  { processId },
  context,
) => {
  try {
    return await context.services.taskAssignment.findByProcess(processId);
  } catch (error) {
    throw new Error(`Failed to fetch process tasks: ${error}`);
  }
};

/**
 * Get process with associated metrics
 * Includes: completion rate, task count, total load, etc.
 */
const processWithMetricsResolver: QueryResolvers["processWithMetrics"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    const process = await context.services.process.getById(id);
    if (!process) return null;

    const tasks = await context.services.taskAssignment.findByProcess(id);
    const totalLoad = tasks.reduce(
      (sum, task) => sum + (task.plannedHours || 0),
      0,
    );
    const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

    return {
      process,
      taskCount: tasks.length,
      activeTaskCount: tasks.filter((t) => t.status !== "COMPLETED").length,
      totalCapacityRequired: Math.round(totalLoad),
      averageResourcesAllocated: Math.round(
        tasks.length > 0 ? totalLoad / tasks.length : 0,
      ),
      completionRate:
        tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0,
      utilizationRate:
        tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0,
    };
  } catch (error) {
    throw new Error(`Failed to fetch process metrics: ${error}`);
  }
};

/**
 * Get metrics for all processes in a company
 */
const companyProcessMetricsResolver: QueryResolvers["companyProcessMetrics"] =
  async (_parent, { companyId }, context) => {
    try {
      const processes = await context.services.process.findByCompany(companyId);

      const metrics = await Promise.all(
        processes.map(async (process) => {
          const tasks = await context.services.taskAssignment.findByProcess(
            process.id,
          );
          const totalLoad = tasks.reduce(
            (sum, task) => sum + (task.plannedHours || 0),
            0,
          );
          const completedCount = tasks.filter(
            (t) => t.status === "COMPLETED",
          ).length;

          return {
            process,
            taskCount: tasks.length,
            activeTaskCount: tasks.filter((t) => t.status !== "COMPLETED")
              .length,
            totalCapacityRequired: Math.round(totalLoad),
            averageResourcesAllocated: Math.round(
              tasks.length > 0 ? totalLoad / tasks.length : 0,
            ),
            completionRate:
              tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0,
            utilizationRate:
              tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0,
          };
        }),
      );

      return metrics;
    } catch (error) {
      throw new Error(`Failed to fetch company process metrics: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedProcess = withMiddleware(processResolver, processReadMiddleware);

const wrappedProcesses = withMiddleware(
  processesResolver,
  processReadMiddleware,
);

const wrappedProcessTasks = withMiddleware(
  processTasksResolver,
  processReadMiddleware,
);

const wrappedProcessWithMetrics = withMiddleware(
  processWithMetricsResolver,
  processReadMiddleware,
);

const wrappedCompanyProcessMetrics = withMiddleware(
  companyProcessMetricsResolver,
  processReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const processQueries: Pick<
  QueryResolvers,
  | "process"
  | "processes"
  | "processTasks"
  | "processWithMetrics"
  | "companyProcessMetrics"
> = {
  process: wrappedProcess,
  processes: wrappedProcesses,
  processTasks: wrappedProcessTasks,
  processWithMetrics: wrappedProcessWithMetrics,
  companyProcessMetrics: wrappedCompanyProcessMetrics,
};

export default processQueries;
