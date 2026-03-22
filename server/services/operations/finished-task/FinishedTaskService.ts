/**
 * Finished Task Service
 * Business logic for finished task analytics
 * Extends BaseService for caching and context management
 */

import type { FinishedTask } from "@/server/db/generated/prisma/client";
import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { FinishedTaskRepository } from "./FinishedTaskRepository";

export class FinishedTaskService extends BaseService {
  readonly domain = "finishedTask";
  private repository: FinishedTaskRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new FinishedTaskRepository(context.prisma);
  }

  /**
   * Get department productivity metrics
   * Returns: total tasks, total hours, breakdown by process
   */
  async getDepartmentMetrics(
    companyId: string,
    departmentId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const stats = await this.repository.getDepartmentStats(
      companyId,
      departmentId,
      options?.startDate,
      options?.endDate,
    );

    return {
      departmentId,
      totalTasksCompleted: stats.totalTasks,
      totalHoursSpent: stats.totalHoursSpent,
      averageHoursPerTask:
        stats.totalTasks > 0 ? stats.totalHoursSpent / stats.totalTasks : 0,
      processes: stats.byProcess,
    };
  }

  /**
   * Get employee productivity metrics
   */
  async getEmployeeMetrics(
    companyId: string,
    employeeId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const stats = await this.repository.getEmployeeStats(
      companyId,
      employeeId,
      options?.startDate,
      options?.endDate,
    );

    return {
      employeeId,
      totalTasksCompleted: stats.totalTasks,
      totalHoursSpent: stats.totalHoursSpent,
      averageHoursPerTask:
        stats.totalTasks > 0 ? stats.totalHoursSpent / stats.totalTasks : 0,
      processes: stats.byProcess,
    };
  }

  /**
   * Get company-wide productivity ranking
   * Compare all departments by completion volume
   */
  async getCompanyProductivityRanking(
    companyId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const comparison = await this.repository.getDepartmentComparison(
      companyId,
      options?.startDate,
      options?.endDate,
    );

    // Sort by total tasks (descending)
    const ranked = comparison.sort((a, b) => b.totalTasks - a.totalTasks);

    return ranked.map((dept, idx) => ({
      rank: idx + 1,
      departmentId: dept.departmentId,
      totalTasksCompleted: dept.totalTasks,
      entriesCount: dept.entries,
    }));
  }

  /**
   * Get most popular processes
   */
  async getPopularProcesses(
    companyId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ) {
    const popularity = await this.repository.getProcessPopularity(
      companyId,
      options?.startDate,
      options?.endDate,
    );

    const sorted = popularity.sort((a, b) => b.totalTasks - a.totalTasks);
    const limited = options?.limit ? sorted.slice(0, options.limit) : sorted;

    return limited.map((proc, idx) => ({
      rank: idx + 1,
      processId: proc.processId,
      totalTasksCompleted: proc.totalTasks,
      entriesCount: proc.entries,
    }));
  }

  /**
   * Get recent finished tasks (last N days)
   */
  async getRecentTasks(
    companyId: string,
    departmentId: string,
    daysBack: number = 7,
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    return this.repository.getByDepartment(
      companyId,
      departmentId,
      startDate,
      new Date(),
    );
  }

  /**
   * Get employee tasks by department
   */
  async getEmployeeTasks(
    companyId: string,
    employeeId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    return this.repository.getByEmployee(
      companyId,
      employeeId,
      options?.startDate,
      options?.endDate,
    );
  }

  /**
   * Get all completions for a specific process
   */
  async getProcessCompletions(
    companyId: string,
    processId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    return this.repository.getByProcess(
      companyId,
      processId,
      options?.startDate,
      options?.endDate,
    );
  }

  /**
   * Find finished tasks by process ID
   * Used by field resolver to load finishedTasks relationship
   */
  async findByProcess(processId: string): Promise<FinishedTask[]> {
    // Note: This needs the companyId from context or parent
    // For now, return tasks for the given process across all companies
    return this.context.prisma.finishedTask.findMany({
      where: { processId },
      orderBy: { completedAt: "desc" },
    });
  }
}
