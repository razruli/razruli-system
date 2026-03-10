/**
 * ============================================================================
 * TaskAssignment Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import {
  TaskAssignmentResolvers,
  TaskAssignmentMetricsResolvers,
  EmployeeTaskStatsResolvers,
  TaskStatusCountResolvers,
  TaskTypeCountResolvers,
} from "@/server/graphql/types/generated";

export const taskAssignmentFieldResolvers: Pick<
  TaskAssignmentResolvers,
  "employee" | "process" | "department" | "loadSnapshots"
> = {
  /**
   * Resolve employee assigned to this task
   */
  employee: async (parent, _args, context) => {
    try {
      const employee = await context.services.employee.getById(
        parent.employeeId,
      );
      if (!employee) {
        throw new Error(`Employee not found: ${parent.employeeId}`);
      }
      return employee;
    } catch (error) {
      throw new Error(`Failed to load employee: ${error}`);
    }
  },

  /**
   * Resolve process this task belongs to
   */
  process: async (parent, _args, context) => {
    try {
      const process = await context.services.process.getById(parent.processId);
      if (!process) {
        throw new Error(`Process not found: ${parent.processId}`);
      }
      return process;
    } catch (error) {
      throw new Error(`Failed to load process: ${error}`);
    }
  },

  /**
   * Resolve task's department
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
   * Resolve load snapshots for this task assignment
   */
  loadSnapshots: async (parent, _args, context) => {
    try {
      return await context.services.loadSnapshot.findByTaskAssignmentId(
        parent.id,
      );
    } catch (error) {
      throw new Error(`Failed to load load snapshots: ${error}`);
    }
  },
};

export const taskAssignmentMetricsFieldResolvers: Pick<
  TaskAssignmentMetricsResolvers,
  "assignment"
> = {
  /**
   * Resolve task assignment for this metrics object
   */
  assignment: async (parent, _args, context) => {
    try {
      const assignment = await context.services.taskAssignment.getById(
        (parent.assignment! as any).id,
      );
      if (!assignment) {
        throw new Error(
          `Task assignment not found: ${(parent.assignment! as any).id}`,
        );
      }
      return assignment;
    } catch (error) {
      throw new Error(`Failed to load task assignment: ${error}`);
    }
  },
};

export const employeeTaskStatsFieldResolvers: Pick<
  EmployeeTaskStatsResolvers,
  "employee"
> = {
  /**
   * Resolve employee for this task statistics object
   */
  employee: async (parent, _args, context) => {
    try {
      const employee = await context.services.employee.getById(
        parent.employee.id,
      );
      if (!employee) {
        throw new Error(`Employee not found: ${parent.employee.id}`);
      }
      return employee;
    } catch (error) {
      throw new Error(`Failed to load employee: ${error}`);
    }
  },
};

export const taskStatusCountFieldResolvers: Pick<
  TaskStatusCountResolvers,
  "count" | "status"
> = {
  count: (parent) => parent.count,
  status: (parent) => parent.status,
};

export const taskTypeCountFieldResolvers: Pick<
  TaskTypeCountResolvers,
  "count" | "taskType"
> = {
  count: (parent) => parent.count,
  taskType: (parent) => parent.taskType,
};
