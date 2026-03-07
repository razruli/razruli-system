/**
 * ============================================================================
 * TaskAssignment Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for task assignment queries

/** Require authentication + taskAssignment:read permission */
const taskAssignmentReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["taskAssignment:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single task assignment by ID
 * Requires authentication to read assignment data
 */
const taskAssignmentResolver: QueryResolvers["taskAssignment"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.taskAssignment.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch task assignment: ${error}`);
  }
};

/**
 * List task assignments with filtering and pagination
 * Supports filtering by employee, process, status
 */
const taskAssignmentsResolver: QueryResolvers["taskAssignments"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
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
};

/**
 * Get blocked tasks (tasks that are blocked by other tasks)
 */
const blockedTasksResolver: QueryResolvers["blockedTasks"] = async (
  _parent,
  { employeeId },
  context,
) => {
  try {
    const tasks = await context.prisma.taskAssignment.findMany({
      where: {
        status: "BLOCKED",
        ...(employeeId && { employeeId }),
      },
      include: { employee: true, process: true },
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to fetch blocked tasks: ${error}`);
  }
};

/**
 * Get overdue tasks (tasks past due date)
 */
const overdueTasksResolver: QueryResolvers["overdueTasks"] = async (
  _parent,
  { employeeId },
  context,
) => {
  try {
    const now = new Date();
    const tasks = await context.prisma.taskAssignment.findMany({
      where: {
        dueDate: {
          lt: now,
        },
        status: { not: "COMPLETED" },
        ...(employeeId && { employeeId }),
      },
      include: { employee: true, process: true },
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to fetch overdue tasks: ${error}`);
  }
};

/**
 * Get task assignment with associated metrics
 * Includes: completion progress, time remaining, load impact, etc.
 */
const taskWithMetricsResolver: QueryResolvers["taskWithMetrics"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    const task = await context.services.taskAssignment.getById(id);
    if (!task) return null;

    const now = new Date();
    const isOverdue =
      task.dueDate && task.dueDate < now && task.status !== "COMPLETED";
    const timeRemaining = task.dueDate
      ? Math.max(0, task.dueDate.getTime() - now.getTime())
      : null;

    return {
      task,
      completionPercentage:
        task.status === "COMPLETED"
          ? 100
          : task.status === "IN_PROGRESS"
            ? 50
            : task.status === "BLOCKED"
              ? 0
              : 25,
      isOverdue,
      timeRemaining,
      estimatedLoad: task.plannedHours || 0,
      priority: task.priority || "MEDIUM",
    };
  } catch (error) {
    throw new Error(`Failed to fetch task metrics: ${error}`);
  }
};

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedTaskAssignment = withMiddleware(
  taskAssignmentResolver,
  taskAssignmentReadMiddleware,
);

const wrappedTaskAssignments = withMiddleware(
  taskAssignmentsResolver,
  taskAssignmentReadMiddleware,
);

const wrappedBlockedTasks = withMiddleware(
  blockedTasksResolver,
  taskAssignmentReadMiddleware,
);

const wrappedOverdueTasks = withMiddleware(
  overdueTasksResolver,
  taskAssignmentReadMiddleware,
);

const wrappedTaskWithMetrics = withMiddleware(
  taskWithMetricsResolver,
  taskAssignmentReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const taskAssignmentQueries: Pick<
  QueryResolvers,
  | "taskAssignment"
  | "taskAssignments"
  | "blockedTasks"
  | "overdueTasks"
  | "taskWithMetrics"
> = {
  taskAssignment: wrappedTaskAssignment,
  taskAssignments: wrappedTaskAssignments,
  blockedTasks: wrappedBlockedTasks,
  overdueTasks: wrappedOverdueTasks,
  taskWithMetrics: wrappedTaskWithMetrics,
};

export default taskAssignmentQueries;
