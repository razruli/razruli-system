import DataLoader from "dataloader";

import { PrismaClient } from "@/server/db/generated/prisma/client";

import { DataLoaderRegistry } from "../../context";

/**
 * Create fresh DataLoader factories for each request
 * Each factory is called when needed: loaders.user()
 * This ensures no cache pollution across requests
 */
export function createLoaders(prisma: PrismaClient): DataLoaderRegistry {
  return {
    /**
     * Batch load users by ID
     */
    user: new DataLoader<string, any>(async (userIds) => {
      return Promise.all(
        userIds.map((id) =>
          prisma.user.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load companies by ID
     */
    company: new DataLoader<string, any>(async (companyIds) => {
      return Promise.all(
        companyIds.map((id) =>
          prisma.company.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load departments by ID
     */
    department: new DataLoader<string, any>(async (departmentIds) => {
      return Promise.all(
        departmentIds.map((id) =>
          prisma.department.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load employees by ID
     */
    employee: new DataLoader<string, any>(async (employeeIds) => {
      return Promise.all(
        employeeIds.map((id) =>
          prisma.employee.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load grades by ID
     */
    grade: new DataLoader<number, any>(async (gradeIds) => {
      return Promise.all(
        gradeIds.map((id) =>
          prisma.grade.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load processes by ID
     */
    process: new DataLoader<string, any>(async (processIds) => {
      return Promise.all(
        processIds.map((id) =>
          prisma.process.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load task assignments by ID
     */
    taskAssignment: new DataLoader<string, any>(async (taskIds) => {
      return Promise.all(
        taskIds.map((id) =>
          prisma.taskAssignment.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load load snapshots by ID
     */
    loadSnapshot: new DataLoader<string, any>(async (snapshotIds) => {
      return Promise.all(
        snapshotIds.map((id) =>
          prisma.loadSnapshot.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load gap analysis results by ID
     */
    gapAnalysis: new DataLoader<string, any>(async (gapIds) => {
      return Promise.all(
        gapIds.map((id) =>
          prisma.gapAnalysisResult
            .findUnique({ where: { id } })
            .catch(() => null),
        ),
      );
    }),

    /**
     * Batch load employee history records by ID
     */
    employeeHistory: new DataLoader<string, any>(async (historyIds) => {
      return Promise.all(
        historyIds.map((id) =>
          prisma.employeeHistory
            .findUnique({ where: { id } })
            .catch(() => null),
        ),
      );
    }),

    /**
     * Batch load audit logs by ID
     */
    auditLog: new DataLoader<string, any>(async (logIds) => {
      return Promise.all(
        logIds.map((id) =>
          prisma.auditLog.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load employees by department ID
     */
    employeesByDepartment: new DataLoader<string, any>(
      async (departmentIds) => {
        return Promise.all(
          departmentIds.map((deptId) =>
            prisma.employee
              .findMany({ where: { departmentId: deptId } })
              .catch(() => []),
          ),
        );
      },
    ),

    /**
     * Batch load task assignments by employee ID
     */
    tasksByEmployee: new DataLoader<string, any>(async (employeeIds) => {
      return Promise.all(
        employeeIds.map((empId) =>
          prisma.taskAssignment
            .findMany({ where: { employeeId: empId } })
            .catch(() => []),
        ),
      );
    }),

    /**
     * Batch load load snapshots by employee ID
     */
    snapshotsByEmployee: new DataLoader<string, any>(async (employeeIds) => {
      return Promise.all(
        employeeIds.map((empId) =>
          prisma.loadSnapshot
            .findMany({ where: { employeeId: empId } })
            .catch(() => []),
        ),
      );
    }),

    /**
     * Batch load actors by ID
     */
    actor: new DataLoader<string, any>(async (actorIds) => {
      return Promise.all(
        actorIds.map((id) =>
          prisma.actor.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load roles by ID
     */
    role: new DataLoader<string, any>(async (roleIds) => {
      return Promise.all(
        roleIds.map((id) =>
          prisma.role.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load permissions by ID
     */
    permission: new DataLoader<string, any>(async (permIds) => {
      return Promise.all(
        permIds.map((id) =>
          prisma.permission.findUnique({ where: { id } }).catch(() => null),
        ),
      );
    }),

    /**
     * Batch load actors by company ID
     */
    actorsByCompany: new DataLoader<string, any>(async (companyIds) => {
      return Promise.all(
        companyIds.map((compId) =>
          prisma.actor
            .findMany({ where: { companyId: compId } })
            .catch(() => []),
        ),
      );
    }),

    /**
     * Batch load actors by department ID
     */
    actorsByDepartment: new DataLoader<string, any>(async (departmentIds) => {
      return Promise.all(
        departmentIds.map((deptId) =>
          prisma.actor
            .findMany({ where: { departmentId: deptId } })
            .catch(() => []),
        ),
      );
    }),
  };
}
