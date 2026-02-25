// ============================================================================
// DataLoader Factory
// ============================================================================
// Creates per-request DataLoaders for N+1 prevention
// Each loader batches queries of its type together
// ============================================================================

import DataLoader from "dataloader";

import { PrismaClient } from "@/server/db/generated/prisma/client";
import { DataLoaders } from "@/server/types/context";

/**
 * Factory function to create all DataLoaders for a request
 * DataLoaders are per-request, so create a new instance for each GraphQL request
 */
export function createDataLoaders(prisma: PrismaClient): DataLoaders {
  return {
    // ==================== Employee Loader ====================
    /**
     * Batches employee lookups
     * Single query for N employee loads within same request
     *
     * Usage: context.dataloaders.employee.load(id)
     *        context.dataloaders.employee.loadMany([id1, id2])
     */
    employee: new DataLoader(async (employeeIds: readonly string[]) => {
      const employees = await prisma.employee.findMany({
        where: { id: { in: employeeIds as string[] } },
      });

      // Return in same order as requested (DataLoader requirement)
      return employeeIds.map(
        (id) => employees.find((e) => e.id === id) || null,
      );
    }),

    // ==================== Department Loader ====================
    /**
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

    // ==================== Process Loader ====================
    /**
     * Batches process lookups
     */
    process: new DataLoader(async (processIds: readonly string[]) => {
      const processes = await prisma.process.findMany({
        where: { id: { in: processIds as string[] } },
      });

      return processIds.map((id) => processes.find((p) => p.id === id) || null);
    }),

    // ==================== Grade Loader ====================
    /**
     * Batches grade lookups
     * Could use longer TTL since grades change infrequently
     */
    grade: new DataLoader(async (gradeIds: readonly number[]) => {
      const grades = await prisma.grade.findMany({
        where: { id: { in: gradeIds as number[] } },
      });

      return gradeIds.map((id) => grades.find((g) => g.id === id) || null);
    }),

    // ==================== TaskAssignment Loader ====================
    /**
     * Batches task assignment lookups
     */
    taskAssignment: new DataLoader(async (taskIds: readonly string[]) => {
      const tasks = await prisma.taskAssignment.findMany({
        where: { id: { in: taskIds as string[] } },
      });

      return taskIds.map((id) => tasks.find((t) => t.id === id) || null);
    }),

    // ==================== LoadSnapshot Loader ====================
    /**
     * Batches load snapshot lookups
     */
    loadSnapshot: new DataLoader(async (snapshotIds: readonly string[]) => {
      const snapshots = await prisma.loadSnapshot.findMany({
        where: { id: { in: snapshotIds as string[] } },
      });

      return snapshotIds.map(
        (id) => snapshots.find((s) => s.id === id) || null,
      );
    }),

    // ==================== GapAnalysis Loader ====================
    /**
     * Batches gap analysis result lookups
     */
    gapAnalysis: new DataLoader(async (resultIds: readonly string[]) => {
      const results = await prisma.gapAnalysisResult.findMany({
        where: { id: { in: resultIds as string[] } },
      });

      return resultIds.map((id) => results.find((r) => r.id === id) || null);
    }),

    // ==================== EmployeeHistory Loader ====================
    /**
     * Batches employee history lookups
     */
    employeeHistory: new DataLoader(async (historyIds: readonly string[]) => {
      const histories = await prisma.employeeHistory.findMany({
        where: { id: { in: historyIds as string[] } },
      });

      return historyIds.map((id) => histories.find((h) => h.id === id) || null);
    }),

    // ==================== AuditLog Loader ====================
    /**
     * Batches audit log lookups
     */
    auditLog: new DataLoader(async (logIds: readonly string[]) => {
      const logs = await prisma.auditLog.findMany({
        where: { id: { in: logIds as string[] } },
      });

      return logIds.map((id) => logs.find((l) => l.id === id) || null);
    }),
  };
}

/**
 * Helper to create loaders with prefetched data
 * Useful for avoiding N+1 when you already have some data
 */
export function createDataLoadersWithCache(
  prisma: PrismaClient,
  prefetched?: Record<string, any[]>,
): DataLoaders {
  const loaders = createDataLoaders(prisma);

  // Pre-populate caches if data is provided
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
