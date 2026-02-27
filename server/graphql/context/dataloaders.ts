/**
 * ============================================================================
 * DataLoaders Factory - Complete Entity Loaders
 * ============================================================================
 * Creates per-request DataLoaders for all entities to prevent N+1 queries
 * Each loader batches queries of its type together
 * ============================================================================
 */

import DataLoader from "dataloader";

import type { PrismaClient } from "@/server/db/generated/prisma/client";

import type { DataLoaderRegistry } from "./types";

/**
 * Factory function to create all DataLoaders for a request
 * DataLoaders are per-request, so create a new instance for each GraphQL request
 *
 * Usage in resolvers:
 * ```typescript
 * const employee = await context.loaders.employee.load(employeeId);
 * const employees = await context.loaders.employeesByDepartment.load(deptId);
 * ```
 */
export function createDataLoaders(prisma: PrismaClient): DataLoaderRegistry {
  return {
    // ==================== AUTH DOMAIN ====================
    /**
     * User Loader
     * Batches user lookups
     * Single query for N user loads within same request
     */
    user: new DataLoader(async (userIds: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds as string[] } },
      });

      return userIds.map((id) => users.find((u) => u.id === id) || null);
    }),

    // ==================== CORE DOMAIN ====================
    /**
     * Company Loader
     * Batches company lookups
     */
    company: new DataLoader(async (companyIds: readonly string[]) => {
      const companies = await prisma.company.findMany({
        where: { id: { in: companyIds as string[] } },
      });

      return companyIds.map((id) => companies.find((c) => c.id === id) || null);
    }),

    /**
     * Department Loader
     * Batches department lookups
     * Prevents N+1 when loading departments for multiple employees
     */
    department: new DataLoader(async (departmentIds: readonly string[]) => {
      const departments = await prisma.department.findMany({
        where: { id: { in: departmentIds as string[] } },
      });

      return departmentIds.map(
        (id) => departments.find((d) => d.id === id) || null,
      );
    }),

    /**
     * Employee Loader
     * Batches employee lookups
     * Prevents N+1 in nested employee queries
     */
    employee: new DataLoader(async (employeeIds: readonly string[]) => {
      const employees = await prisma.employee.findMany({
        where: { id: { in: employeeIds as string[] } },
        include: { department: true },
      });

      return employeeIds.map(
        (id) => employees.find((e) => e.id === id) || null,
      );
    }),

    /**
     * Grade Loader
     * Batches grade lookups
     * Could use longer TTL since grades change infrequently
     * Note: Uses number IDs
     */
    grade: new DataLoader(async (gradeIds: readonly number[]) => {
      const grades = await prisma.grade.findMany({
        where: { id: { in: gradeIds as number[] } },
      });

      return gradeIds.map((id) => grades.find((g) => g.id === id) || null);
    }),

    // ==================== OPERATIONS DOMAIN ====================
    /**
     * Process Loader
     * Batches process lookups
     */
    process: new DataLoader(async (processIds: readonly string[]) => {
      const processes = await prisma.process.findMany({
        where: { id: { in: processIds as string[] } },
      });

      return processIds.map((id) => processes.find((p) => p.id === id) || null);
    }),

    /**
     * Task Assignment Loader
     * Batches task assignment lookups
     * Prevents N+1 for nested task queries
     */
    taskAssignment: new DataLoader(async (taskIds: readonly string[]) => {
      const tasks = await prisma.taskAssignment.findMany({
        where: { id: { in: taskIds as string[] } },
        include: { employee: true, process: true },
      });

      return taskIds.map((id) => tasks.find((t) => t.id === id) || null);
    }),

    // ==================== ANALYTICS DOMAIN ====================
    /**
     * Load Snapshot Loader
     * Batches load snapshot lookups
     */
    loadSnapshot: new DataLoader(async (snapshotIds: readonly string[]) => {
      const snapshots = await prisma.loadSnapshot.findMany({
        where: { id: { in: snapshotIds as string[] } },
        include: { employee: true },
      });

      return snapshotIds.map(
        (id) => snapshots.find((s) => s.id === id) || null,
      );
    }),

    /**
     * Gap Analysis Loader
     * Batches gap analysis result lookups
     */
    gapAnalysis: new DataLoader(async (resultIds: readonly string[]) => {
      const results = await prisma.gapAnalysisResult.findMany({
        where: { id: { in: resultIds as string[] } },
      });

      return resultIds.map((id) => results.find((r) => r.id === id) || null);
    }),

    // ==================== AUDIT DOMAIN ====================
    /**
     * Employee History Loader
     * Batches employee history lookups
     */
    employeeHistory: new DataLoader(async (historyIds: readonly string[]) => {
      const histories = await prisma.employeeHistory.findMany({
        where: { id: { in: historyIds as string[] } },
      });

      return historyIds.map((id) => histories.find((h) => h.id === id) || null);
    }),

    /**
     * Audit Log Loader
     * Batches audit log lookups
     */
    auditLog: new DataLoader(async (logIds: readonly string[]) => {
      const logs = await prisma.auditLog.findMany({
        where: { id: { in: logIds as string[] } },
      });

      return logIds.map((id) => logs.find((l) => l.id === id) || null);
    }),

    // ==================== BATCH LOADERS - Common Patterns ====================

    /**
     * Employees by Department Loader
     * Load all employees belonging to a department
     * Usage: context.loaders.employeesByDepartment.load(departmentId)
     */
    employeesByDepartment: new DataLoader(
      async (departmentIds: readonly string[]) => {
        const allEmployees = await prisma.employee.findMany({
          where: { departmentId: { in: departmentIds as string[] } },
        });

        return departmentIds.map((deptId) =>
          allEmployees.filter((e) => e.departmentId === deptId),
        );
      },
    ),

    /**
     * Tasks by Employee Loader
     * Load all task assignments for an employee
     * Usage: context.loaders.tasksByEmployee.load(employeeId)
     */
    tasksByEmployee: new DataLoader(async (employeeIds: readonly string[]) => {
      const allTasks = await prisma.taskAssignment.findMany({
        where: { employeeId: { in: employeeIds as string[] } },
        include: { process: true },
      });

      return employeeIds.map((empId) =>
        allTasks.filter((t) => t.employeeId === empId),
      );
    }),

    /**
     * Load Snapshots by Employee Loader
     * Load all load snapshots for an employee
     * Usage: context.loaders.snapshotsByEmployee.load(employeeId)
     */
    snapshotsByEmployee: new DataLoader(
      async (employeeIds: readonly string[]) => {
        const allSnapshots = await prisma.loadSnapshot.findMany({
          where: { employeeId: { in: employeeIds as string[] } },
          orderBy: { calculatedAt: "desc" },
        });

        return employeeIds.map((empId) =>
          allSnapshots.filter((s) => s.employeeId === empId),
        );
      },
    ),
  };
}

/**
 * Helper to create loaders with prefetched data
 * Useful for avoiding N+1 when you already have some data
 */
export function createDataLoadersWithCache(
  prisma: PrismaClient,
  prefetched?: Record<string, any[]>,
): DataLoaderRegistry {
  const loaders = createDataLoaders(prisma);

  // Prefetch data if provided
  if (prefetched?.users) {
    prefetched.users.forEach((user) => {
      loaders.user.prime(user.id, user);
    });
  }

  if (prefetched?.employees) {
    prefetched.employees.forEach((emp) => {
      loaders.employee.prime(emp.id, emp);
    });
  }

  if (prefetched?.departments) {
    prefetched.departments.forEach((dept) => {
      loaders.department.prime(dept.id, dept);
    });
  }

  return loaders;
}
