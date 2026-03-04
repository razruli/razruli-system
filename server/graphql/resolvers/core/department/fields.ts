/**
 * ============================================================================
 * Department Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 * Only includes fields explicitly defined in the GraphQL schema
 */

import {
  DepartmentResolvers,
  DepartmentMetricsResolvers,
} from "@/server/graphql/types/generated";

export const departmentFieldResolvers: Pick<
  DepartmentResolvers,
  | "company"
  | "head"
  | "employees"
  | "processes"
  | "taskAssignments"
  | "loadSnapshots"
> = {
  /**
   * Resolve department's company
   * Using service's internal DataLoader for batching
   */
  company: async (parent, _args, context) => {
    try {
      const company = await context.services.company.getById(parent.companyId);
      if (!company) {
        throw new Error(`Company not found: ${parent.companyId}`);
      }
      return company;
    } catch (error) {
      throw new Error(`Failed to load company: ${error}`);
    }
  },

  /**
   * Resolve department head
   * Returns the employee who is the head of this department
   */
  head: async (parent, _args, context) => {
    try {
      if (!parent.headId) return null;
      return await context.services.employee.getById(parent.headId);
    } catch (error) {
      throw new Error(`Failed to load head: ${error}`);
    }
  },

  /**
   * Resolve employees in department
   * Returns all employees assigned to this department
   */
  employees: async (parent, _args, context) => {
    try {
      return await context.services.employee.getByDepartment(parent.id);
    } catch (error) {
      throw new Error(`Failed to load employees: ${error}`);
    }
  },

  /**
   * Resolve processes for this department
   * Returns all processes assigned to this department
   */
  processes: async (parent, _args, context) => {
    try {
      return await context.services.process.findByDepartment(parent.id);
    } catch (error) {
      throw new Error(`Failed to load processes: ${error}`);
    }
  },

  /**
   * Resolve task assignments for department
   * Returns all task assignments in this department
   */
  taskAssignments: async (parent, _args, context) => {
    try {
      return await context.services.taskAssignment.findByDepartment(parent.id);
    } catch (error) {
      throw new Error(`Failed to load task assignments: ${error}`);
    }
  },

  /**
   * Resolve load snapshots for department
   * Returns historical capacity snapshots
   */
  loadSnapshots: async (parent, _args, context) => {
    try {
      return await context.services.loadSnapshot.findByDepartment(parent.id);
    } catch (error) {
      throw new Error(`Failed to load load snapshots: ${error}`);
    }
  },
};

export const departmentMetricsFieldResolvers: Pick<
  DepartmentMetricsResolvers,
  "department"
> = {
  /**
   * Resolve department for this metrics object
   */
  department: async (parent, _args, context) => {
    try {
      const department = await context.services.department.getById(
        parent.department.id,
      );
      if (!department) {
        throw new Error(`Department not found: ${parent.department.id}`);
      }
      return department;
    } catch (error) {
      throw new Error(`Failed to load department: ${error}`);
    }
  },
};
