/**
 * ============================================================================
 * Process Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import {
  ProcessResolvers,
  ProcessMetricsResolvers,
} from "@/server/graphql/types/generated";

export const processFieldResolvers: Pick<
  ProcessResolvers,
  "company" | "department" | "taskAssignments" | "loadSnapshots"
> = {
  /**
   * Resolve process's company
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
   * Resolve process's department
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
   * Resolve task assignments for this process
   */
  taskAssignments: async (parent, _args, context) => {
    try {
      return await context.services.taskAssignment.findByProcess(parent.id);
    } catch (error) {
      throw new Error(`Failed to load task assignments: ${error}`);
    }
  },

  /**
   * Resolve load snapshots for this process
   */
  loadSnapshots: async (parent, _args, context) => {
    try {
      return await context.services.loadSnapshot.findByProcess(parent.id);
    } catch (error) {
      throw new Error(`Failed to load load snapshots: ${error}`);
    }
  },
};

export const processMetricsFieldResolvers: Pick<
  ProcessMetricsResolvers,
  "process"
> = {
  /**
   * Resolve process for this metrics object
   */
  process: async (parent, _args, context) => {
    try {
      const process = await context.services.process.getById(
        (parent.process! as any).id,
      );
      if (!process) {
        throw new Error(`Process not found: ${(parent.process! as any).id}`);
      }
      return process;
    } catch (error) {
      throw new Error(`Failed to load process: ${error}`);
    }
  },
};
