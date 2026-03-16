/**
 * ============================================================================
 * Employee Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 * Only includes fields explicitly defined in the GraphQL schema
 */

import { EmployeeResolvers } from "@/server/graphql/types/generated";

export const employeeFieldResolvers: Pick<
  EmployeeResolvers,
  | "fio"
  | "department"
  | "grade"
  | "taskAssignments"
  | "loadSnapshots"
  | "history"
> = {
  /**
   * Resolve employee's full name (fio)
   * Computed from firstName and lastName
   */
  fio: (parent) => {
    return `${parent.firstName} ${parent.lastName}`;
  },

  /**
   * Resolve employee's department
   * Using service's internal DataLoader for batching
   */
  department: async (parent, _args, context) => {
    try {
      const department = await context.services.department.getById(
        parent.departmentId,
      );
      if (!department) {
        throw new Error(`Department not found: ${parent.departmentId}`);
      }
      return department;
    } catch (error) {
      throw new Error(`Failed to load department: ${error}`);
    }
  },

  /**
   * Resolve employee's grade/skill level
   * Using service's internal DataLoader for batching
   */
  grade: async (parent, _args, context) => {
    try {
      const grade = await context.services.grade.getById(
        parent.gradeId.toString(),
      );
      if (!grade) {
        throw new Error(`Grade not found: ${parent.gradeId}`);
      }
      return grade;
    } catch (error) {
      throw new Error(`Failed to load grade: ${error}`);
    }
  },

  /**
   * Resolve task assignments for employee
   * Returns all active task assignments for this employee
   */
  taskAssignments: async (parent, _args, context) => {
    try {
      return await context.services.taskAssignment.findByEmployee(parent.id);
    } catch (error) {
      throw new Error(`Failed to load task assignments: ${error}`);
    }
  },

  /**
   * Resolve load snapshots for employee
   * Returns historical capacity snapshots
   */
  loadSnapshots: async (parent, _args, context) => {
    try {
      return await context.services.loadSnapshot.findByEmployee(parent.id);
    } catch (error) {
      throw new Error(`Failed to load snapshots: ${error}`);
    }
  },

  /**
   * Resolve employee history
   * Returns career/employment history records
   */
  history: async (parent, _args, context) => {
    try {
      return await context.services.employeeHistory.findByEmployee(parent.id);
    } catch (error) {
      throw new Error(`Failed to load employee history: ${error}`);
    }
  },
};

export default employeeFieldResolvers;
