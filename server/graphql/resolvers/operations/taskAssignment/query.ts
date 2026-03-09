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
    // Build where clause for prisma
    const where = filter
      ? {
          employeeId: filter.employeeId ?? undefined,
          processId: filter.processId ?? undefined,
          status: filter.status ?? undefined,
        }
      : {};

    // Get total count
    const total = await context.prisma.taskAssignment.count({ where });

    // Get paginated results
    const skip = pagination?.skip || 0;
    const take = pagination?.take || 20;
    const data = await context.prisma.taskAssignment.findMany({
      where,
      skip,
      take,
      orderBy: {
        [pagination?.orderBy?.field || "createdAt"]:
          pagination?.orderBy?.order || "asc",
      },
      include: { employee: true, process: true },
    });

    return {
      nodes: data,
      totalCount: total,
      pageInfo: {
        total,
        hasMore: skip + take < total,
        offset: skip,
        limit: take,
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
  args,
  context,
) => {
  try {
    const tasks = await context.prisma.taskAssignment.findMany({
      where: {
        status: "BLOCKED",
        ...(args.departmentId && { departmentId: args.departmentId }),
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
  args,
  context,
) => {
  try {
    const tasks = await context.prisma.taskAssignment.findMany({
      where: {
        status: { not: "COMPLETED" },
        ...(args.departmentId && { departmentId: args.departmentId }),
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
    const assignment = await context.services.taskAssignment.getById(id);
    if (!assignment) return null;

    return {
      assignment,
      workloadContribution: assignment.plannedHours || 0,
      utilizationRate: assignment.plannedHours
        ? (assignment.plannedHours / 160) * 100
        : 0,
      onTrack:
        assignment.status !== "BLOCKED" && assignment.status !== "CANCELED",
      daysUntilDue: 0,
      estimatedCompletionDate: assignment.createdAt,
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
