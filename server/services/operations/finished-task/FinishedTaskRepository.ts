/**
 * Finished Task Repository
 * Analytics-focused queries for finished task data
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";

export class FinishedTaskRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get finished tasks for a specific department
   */
  async getByDepartment(
    companyId: string,
    departmentId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
      departmentId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    return this.prisma.finishedTask.findMany({
      where,
      include: {
        process: { select: { id: true, title: true } },
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { completedAt: "desc" },
    });
  }

  /**
   * Get finished tasks by a specific employee
   */
  async getByEmployee(
    companyId: string,
    employeeId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
      employeeId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    return this.prisma.finishedTask.findMany({
      where,
      include: {
        process: { select: { id: true, title: true } },
        department: { select: { id: true, name: true } },
      },
      orderBy: { completedAt: "desc" },
    });
  }

  /**
   * Get finished tasks for a specific process across all departments
   */
  async getByProcess(
    companyId: string,
    processId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
      processId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    return this.prisma.finishedTask.findMany({
      where,
      include: {
        department: { select: { id: true, name: true } },
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { completedAt: "desc" },
    });
  }

  /**
   * Get aggregated stats: total tasks and hours by department
   */
  async getDepartmentStats(
    companyId: string,
    departmentId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
      departmentId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    const [total, byProcess, hoursStats] = await Promise.all([
      // Total quantities and hours
      this.prisma.finishedTask.aggregate({
        where,
        _sum: { quantity: true, hoursSpent: true },
      }),

      // Breakdown by process
      this.prisma.finishedTask.groupBy({
        by: ["processId"],
        where,
        _sum: { quantity: true },
        _count: { id: true },
      }),

      // Hours stats (if available)
      this.prisma.finishedTask.findMany({
        where: { ...where, hoursSpent: { not: null } },
        select: { hoursSpent: true },
      }),
    ]);

    const totalHours = hoursStats.reduce(
      (sum, t) => sum + (t.hoursSpent || 0),
      0,
    );

    return {
      totalTasks: total._sum.quantity || 0,
      totalHoursSpent: totalHours,
      byProcess: byProcess.map((p) => ({
        processId: p.processId,
        quantity: p._sum.quantity || 0,
        count: p._count.id,
      })),
    };
  }

  /**
   * Get aggregated stats by employee
   */
  async getEmployeeStats(
    companyId: string,
    employeeId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
      employeeId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    const [total, byProcess, hoursStats] = await Promise.all([
      this.prisma.finishedTask.aggregate({
        where,
        _sum: { quantity: true },
      }),

      this.prisma.finishedTask.groupBy({
        by: ["processId"],
        where,
        _sum: { quantity: true },
        _count: { id: true },
      }),

      this.prisma.finishedTask.findMany({
        where: { ...where, hoursSpent: { not: null } },
        select: { hoursSpent: true },
      }),
    ]);

    const totalHours = hoursStats.reduce(
      (sum, t) => sum + (t.hoursSpent || 0),
      0,
    );

    return {
      totalTasks: total._sum.quantity || 0,
      totalHoursSpent: totalHours,
      byProcess: byProcess.map((p) => ({
        processId: p.processId,
        quantity: p._sum.quantity || 0,
        count: p._count.id,
      })),
    };
  }

  /**
   * Get department productivity comparison
   * (which departments completed most tasks)
   */
  async getDepartmentComparison(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    const results = await this.prisma.finishedTask.groupBy({
      by: ["departmentId"],
      where,
      _sum: { quantity: true },
      _count: { id: true },
    });

    return results.map((r) => ({
      departmentId: r.departmentId,
      totalTasks: r._sum.quantity || 0,
      entries: r._count.id,
    }));
  }

  /**
   * Get process popularity
   * (which processes are being completed most)
   */
  async getProcessPopularity(
    companyId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      companyId,
    };

    if (startDate || endDate) {
      where.completedAt = {};
      if (startDate) where.completedAt.gte = startDate;
      if (endDate) where.completedAt.lte = endDate;
    }

    const results = await this.prisma.finishedTask.groupBy({
      by: ["processId"],
      where,
      _sum: { quantity: true },
      _count: { id: true },
    });

    return results.map((r) => ({
      processId: r.processId,
      totalTasks: r._sum.quantity || 0,
      entries: r._count.id,
    }));
  }
}
