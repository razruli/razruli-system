/**
 * ============================================================================
 * Finished Task Domain - Query Resolvers
 * ============================================================================
 * Analytics-focused resolvers for finished task queries
 * Each resolver is defined as a standalone function with explicit type signatures
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { logger } from "@/server/utils/logger/logger";

import { QueryResolvers } from "../../../types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for finished task queries

/** Require authentication to read finished task analytics */
const finishedTaskReadMiddleware = composeMiddleware({ requireAuth: true });

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get all finished tasks for a department with optional date range
 */
const finishedTasksByDepartmentResolver: QueryResolvers["finishedTasksByDepartment"] =
  async (_parent, { departmentId, startDate, endDate }, context) => {
    try {
      const service = context.services.finishedTask;
      const tasks = await service.getEmployeeTasks(
        context.actor?.companyId || "",
        departmentId,
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      );
      return tasks as any;
    } catch (error) {
      logger.error("Error fetching finished tasks by department", error);
      throw error;
    }
  };

/**
 * Get all finished tasks by employee with optional date range
 */
const finishedTasksByEmployeeResolver: QueryResolvers["finishedTasksByEmployee"] =
  async (_parent, { employeeId, startDate, endDate }, context) => {
    try {
      const service = context.services.finishedTask;
      const tasks = await service.getEmployeeTasks(
        context.actor?.companyId || "",
        employeeId,
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      );
      return tasks as any;
    } catch (error) {
      logger.error("Error fetching finished tasks by employee", error);
      throw error;
    }
  };

/**
 * Get all finished tasks for a process with optional date range
 */
const finishedTasksByProcessResolver: QueryResolvers["finishedTasksByProcess"] =
  async (_parent, { processId, startDate, endDate }, context) => {
    try {
      const service = context.services.finishedTask;
      const tasks = await service.getProcessCompletions(
        context.actor?.companyId || "",
        processId,
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      );
      return tasks as any;
    } catch (error) {
      logger.error("Error fetching finished tasks by process", error);
      throw error;
    }
  };

/**
 * Get department productivity metrics including aggregations and process breakdowns
 */
const departmentMetricsResolver: QueryResolvers["departmentMetrics"] = async (
  _parent,
  { departmentId, startDate, endDate },
  context,
) => {
  try {
    const service = context.services.finishedTask;
    const metrics = await service.getDepartmentMetrics(
      context.actor?.companyId || "",
      departmentId,
      {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    );
    return metrics as any;
  } catch (error) {
    logger.error("Error fetching department metrics", error);
    throw error;
  }
};

/**
 * Get employee productivity metrics including hours and process breakdown
 */
const employeeMetricsResolver: QueryResolvers["employeeMetrics"] = async (
  _parent,
  { employeeId, startDate, endDate },
  context,
) => {
  try {
    const service = context.services.finishedTask;
    const metrics = await service.getEmployeeMetrics(
      context.actor?.companyId || "",
      employeeId,
      {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    );
    return metrics as any;
  } catch (error) {
    logger.error("Error fetching employee metrics", error);
    throw error;
  }
};

/**
 * Get company-wide department productivity ranking
 */
const companyProductivityRankingResolver: QueryResolvers["companyProductivityRanking"] =
  async (_parent, { startDate, endDate }, context) => {
    try {
      const service = context.services.finishedTask;
      const ranking = await service.getCompanyProductivityRanking(
        context.actor?.companyId || "",
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      );
      return ranking as any;
    } catch (error) {
      logger.error("Error fetching company productivity ranking", error);
      throw error;
    }
  };

/**
 * Get most popular/frequently completed processes
 */
const popularProcessesResolver: QueryResolvers["popularProcesses"] = async (
  _parent,
  { startDate, endDate, limit },
  context,
) => {
  try {
    const service = context.services.finishedTask;
    const processes = await service.getPopularProcesses(
      context.actor?.companyId || "",
      {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limit || 10,
      },
    );
    return processes as any;
  } catch (error) {
    logger.error("Error fetching popular processes", error);
    throw error;
  }
};

/**
 * Get recent finished tasks for a department (last N days)
 */
const recentTasksByDepartmentResolver: QueryResolvers["recentTasksByDepartment"] =
  async (_parent, { departmentId, daysBack }, context) => {
    try {
      const service = context.services.finishedTask;
      const tasks = await service.getRecentTasks(
        context.actor?.companyId || "",
        departmentId,
        daysBack || 7,
      );
      return tasks as any;
    } catch (error) {
      logger.error("Error fetching recent tasks", error);
      throw error;
    }
  };

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware to each resolver

const wrappedFinishedTasksByDepartment = withMiddleware(
  finishedTasksByDepartmentResolver,
  finishedTaskReadMiddleware,
);

const wrappedFinishedTasksByEmployee = withMiddleware(
  finishedTasksByEmployeeResolver,
  finishedTaskReadMiddleware,
);

const wrappedFinishedTasksByProcess = withMiddleware(
  finishedTasksByProcessResolver,
  finishedTaskReadMiddleware,
);

const wrappedDepartmentMetrics = withMiddleware(
  departmentMetricsResolver,
  finishedTaskReadMiddleware,
);

const wrappedEmployeeMetrics = withMiddleware(
  employeeMetricsResolver,
  finishedTaskReadMiddleware,
);

const wrappedCompanyProductivityRanking = withMiddleware(
  companyProductivityRankingResolver,
  finishedTaskReadMiddleware,
);

const wrappedPopularProcesses = withMiddleware(
  popularProcessesResolver,
  finishedTaskReadMiddleware,
);

const wrappedRecentTasksByDepartment = withMiddleware(
  recentTasksByDepartmentResolver,
  finishedTaskReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const finishedTaskQueries: Pick<
  QueryResolvers,
  | "finishedTasksByDepartment"
  | "finishedTasksByEmployee"
  | "finishedTasksByProcess"
  | "departmentMetrics"
  | "employeeMetrics"
  | "companyProductivityRanking"
  | "popularProcesses"
  | "recentTasksByDepartment"
> = {
  finishedTasksByDepartment: wrappedFinishedTasksByDepartment,
  finishedTasksByEmployee: wrappedFinishedTasksByEmployee,
  finishedTasksByProcess: wrappedFinishedTasksByProcess,
  departmentMetrics: wrappedDepartmentMetrics,
  employeeMetrics: wrappedEmployeeMetrics,
  companyProductivityRanking: wrappedCompanyProductivityRanking,
  popularProcesses: wrappedPopularProcesses,
  recentTasksByDepartment: wrappedRecentTasksByDepartment,
};

export default finishedTaskQueries;
