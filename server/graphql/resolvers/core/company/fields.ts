/**
 * ============================================================================
 * Company Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 * Only includes fields explicitly defined in the GraphQL schema
 */

import { CompanyResolvers } from "@/server/graphql/types/generated";

export const companyFieldResolvers: Pick<
  CompanyResolvers,
  "departments" | "employees" | "processes" | "taskAssignments" | "loadSnapshots"
> = {
  /**
   * Resolve departments in a company
   * Returns all departments for this company
   */
  departments: async (parent, _args, context) => {
    try {
      return await context.services.department.findByCompany(parent.id);
    } catch (error) {
      throw new Error(`Failed to load departments: ${error}`);
    }
  },

  /**
   * Resolve employees in a company (through departments)
   * Returns all employees for this company
   */
  employees: async (parent, _args, context) => {
    try {
      return await context.services.employee.findByCompany(parent.id);
    } catch (error) {
      throw new Error(`Failed to load employees: ${error}`);
    }
  },

  /**
   * Resolve processes in a company
   * Returns all processes for this company
   */
  processes: async (parent, _args, context) => {
    try {
      return await context.services.process.findByCompany(parent.id);
    } catch (error) {
      throw new Error(`Failed to load processes: ${error}`);
    }
  },

  /**
   * Resolve task assignments in a company
   * Returns all task assignments for this company
   */
  taskAssignments: async (parent, _args, context) => {
    try {
      return await context.services.taskAssignment.findByCompany(parent.id);
    } catch (error) {
      throw new Error(`Failed to load task assignments: ${error}`);
    }
  },

  /**
   * Resolve load snapshots for a company
   * Returns historical capacity snapshots
   */
  loadSnapshots: async (parent, _args, context) => {
    try {
      return await context.services.loadSnapshot.findByCompany(parent.id);
    } catch (error) {
      throw new Error(`Failed to load load snapshots: ${error}`);
    }
  },
};

export default companyFieldResolvers;
