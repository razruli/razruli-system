/**
 * ============================================================================
 * Employee Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for employee queries

/** Require authentication + employee:read permission */
const employeeReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:read"] },
);

/** Require authentication + employee:read + department:read permissions */
const employeeWithDepartmentMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:read", "department:read"] },
);

/** Require authentication + employee:read + analytics:read permissions */
const employeeWithAnalyticsMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:read", "analytics:read"] },
);

/** Require authentication + employee:read + taskAssignment:read permissions */
const employeeWithTasksMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:read", "taskAssignment:read"] },
);

/** Require authentication + employee:read + audit:read permissions */
const employeeWithAuditMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:read", "audit:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single employee by ID
 * Requires authentication to read employee data
 */
const employeeResolver: QueryResolvers["employee"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.employee.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch employee: ${error}`);
  }
};

/**
 * List employees with filtering and pagination
 * Supports filtering by department, status, efficiency
 */
const employeesResolver: QueryResolvers["employees"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // Convert filter input to service format
    const serviceFilter = filter
      ? {
          companyId: filter.companyId,
          departmentId: filter.departmentId,
          gradeId: filter.gradeId,
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

    const result = await context.services.employee.find(
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
    throw new Error(`Failed to list employees: ${error}`);
  }
};

/**
 * Get employees in a specific department
 * Returns all active employees in that department
 */
const departmentEmployeesResolver: QueryResolvers["departmentEmployees"] =
  async (_parent, { departmentId }, context) => {
    try {
      const employees =
        await context.services.employee.getByDepartment(departmentId);

      return employees;
    } catch (error) {
      throw new Error(`Failed to fetch department employees: ${error}`);
    }
  };

/**
 * Get employee capacity as percentage
 * Returns current capacity utilization (0-200)
 */
const employeeCapacityResolver: QueryResolvers["employeeCapacity"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    // Verify employee exists
    await context.services.employee.getByIdOrThrow(id);

    // Calculate capacity as percentage
    // This is the allocated load / available capacity
    const capacity = await context.services.employee.calculateCapacity(id);

    return capacity;
  } catch (error) {
    throw new Error(`Failed to fetch employee capacity: ${error}`);
  }
};

/**
 * Get employee load index for workload analysis
 * Returns load as percentage for the given period
 */
const employeeLoadIndexResolver: QueryResolvers["employeeLoadIndex"] = async (
  _parent,
  { id, periodStart, periodEnd },
  context,
) => {
  try {
    // Make sure dates are in the right order
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    if (start > end) {
      throw new Error("periodStart must be before periodEnd");
    }

    // Calculate load index for the period
    const loadIndex = await context.services.employee.calculateLoadIndex(
      id,
      start,
      end,
    );

    return loadIndex;
  } catch (error) {
    throw new Error(`Failed to fetch employee load index: ${error}`);
  }
};

/**
 * Get tasks assigned to an employee
 */
const employeeTasksResolver: QueryResolvers["employeeTasks"] = async (
  _parent,
  { employeeId },
  context,
) => {
  try {
    const tasks =
      await context.services.taskAssignment.findByEmployee(employeeId);
    return tasks;
  } catch (error) {
    throw new Error(`Failed to fetch employee tasks: ${error}`);
  }
};

/**
 * Get task statistics for an employee
 */
const employeeTaskStatsResolver: QueryResolvers["employeeTaskStats"] = async (
  _parent,
  { employeeId },
  context,
) => {
  try {
    const tasks =
      await context.services.taskAssignment.findByEmployee(employeeId);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "IN_PROGRESS",
    ).length;
    const blockedTasks = tasks.filter((t) => t.status === "BLOCKED").length;
    const totalPlannedHours = tasks.reduce(
      (sum, t) => sum + (t.plannedHours || 0),
      0,
    );

    return {
      employee: await context.services.employee.getById(employeeId),
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      totalPlannedHours,
      avgTaskLoad: totalTasks > 0 ? totalPlannedHours / totalTasks : 0,
    };
  } catch (error) {
    throw new Error(`Failed to fetch employee task stats: ${error}`);
  }
};

/**
 * Get employee's load trend over time
 */
const employeeLoadTrendResolver: QueryResolvers["employeeLoadTrend"] = async (
  _parent,
  { employeeId, dateRange },
  context,
) => {
  try {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    // Placeholder implementation
    return {
      employee: await context.services.employee.getById(employeeId),
      startDate,
      endDate,
      dataPoints: [],
      avgLoad: 0,
      peakLoad: 0,
      minLoad: 0,
    };
  } catch (error) {
    throw new Error(`Failed to fetch employee load trend: ${error}`);
  }
};

/**
 * Get employee's timeline of events
 */
const employeeTimelineResolver: QueryResolvers["employeeTimeline"] = async (
  _parent,
) => {
  try {
    // Placeholder implementation
    return [
      {
        timestamp: new Date(),
        eventType: "ASSIGNED",
        description: "Task assigned",
      },
    ];
  } catch (error) {
    throw new Error(`Failed to fetch employee timeline: ${error}`);
  }
};

/**
 * Get employee's audit report
 */
const employeeAuditReportResolver: QueryResolvers["employeeAuditReport"] =
  async (_parent, { employeeId, dateRange }, context) => {
    try {
      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);

      // Placeholder implementation
      return {
        employee: await context.services.employee.getById(employeeId),
        from: startDate,
        to: endDate,
        totalChanges: 0,
        approvedChanges: 0,
        pendingChanges: 0,
        rejectedChanges: 0,
        changes: [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch employee audit report: ${error}`);
    }
  };

/**
 * Get a specific employee history entry
 */
const employeeHistoryEntryResolver: QueryResolvers["employeeHistoryEntry"] =
  async (_parent, { id }, context) => {
    try {
      return await context.services.employeeHistory.getById(id);
    } catch (error) {
      throw new Error(`Failed to fetch employee history entry: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedEmployee = withMiddleware(
  employeeResolver,
  employeeReadMiddleware,
);

const wrappedEmployees = withMiddleware(
  employeesResolver,
  employeeReadMiddleware,
);

const wrappedDepartmentEmployees = withMiddleware(
  departmentEmployeesResolver,
  employeeWithDepartmentMiddleware,
);

const wrappedEmployeeCapacity = withMiddleware(
  employeeCapacityResolver,
  employeeWithAnalyticsMiddleware,
);

const wrappedEmployeeLoadIndex = withMiddleware(
  employeeLoadIndexResolver,
  employeeWithAnalyticsMiddleware,
);

const wrappedEmployeeTasks = withMiddleware(
  employeeTasksResolver,
  employeeWithTasksMiddleware,
);

const wrappedEmployeeTaskStats = withMiddleware(
  employeeTaskStatsResolver,
  employeeWithAnalyticsMiddleware,
);

const wrappedEmployeeLoadTrend = withMiddleware(
  employeeLoadTrendResolver,
  employeeWithAnalyticsMiddleware,
);

const wrappedEmployeeTimeline = withMiddleware(
  employeeTimelineResolver,
  employeeWithAuditMiddleware,
);

const wrappedEmployeeAuditReport = withMiddleware(
  employeeAuditReportResolver,
  employeeWithAuditMiddleware,
);

const wrappedEmployeeHistoryEntry = withMiddleware(
  employeeHistoryEntryResolver,
  employeeWithAuditMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const employeeQueries: Pick<
  QueryResolvers,
  | "employee"
  | "employees"
  | "departmentEmployees"
  | "employeeCapacity"
  | "employeeLoadIndex"
  | "employeeTasks"
  | "employeeTaskStats"
  | "employeeLoadTrend"
  | "employeeTimeline"
  | "employeeAuditReport"
  | "employeeHistoryEntry"
> = {
  employee: wrappedEmployee,
  employees: wrappedEmployees,
  departmentEmployees: wrappedDepartmentEmployees,
  employeeCapacity: wrappedEmployeeCapacity,
  employeeLoadIndex: wrappedEmployeeLoadIndex,
  employeeTasks: wrappedEmployeeTasks,
  employeeTaskStats: wrappedEmployeeTaskStats,
  employeeLoadTrend: wrappedEmployeeLoadTrend,
  employeeTimeline: wrappedEmployeeTimeline,
  employeeAuditReport: wrappedEmployeeAuditReport,
  employeeHistoryEntry: wrappedEmployeeHistoryEntry,
};

export default employeeQueries;
