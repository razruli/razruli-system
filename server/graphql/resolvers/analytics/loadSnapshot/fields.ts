/**
 * ============================================================================
 * LoadSnapshot Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import {
  LoadSnapshotResolvers,
  CompanyLoadAnalysisResolvers,
  DepartmentLoadOverviewResolvers,
  EmployeeLoadBreakdownResolvers,
  EmployeeLoadHistoryResolvers,
} from "@/server/graphql/types/generated";
import { logger } from "@/server/utils/logger/logger";

export const loadSnapshotFieldResolvers: Pick<
  LoadSnapshotResolvers,
  "company" | "employee" | "department" | "process" | "taskAssignment"
> = {
  /**
   * Resolve company for this load snapshot (required field)
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
   * Resolve employee for this load snapshot (nullable - snapshot can be department-level)
   */
  employee: async (parent, _args, context) => {
    try {
      if (!parent.employeeId) return null;
      return await context.services.employee.getById(parent.employeeId);
    } catch (error) {
      // Return null for missing employee data
      logger.debug(`Failed to load employee: ${error}`);
      return null;
    }
  },

  /**
   * Resolve department for this load snapshot (nullable - snapshot can be employee-level)
   */
  department: async (parent, _args, context) => {
    try {
      if (!parent.departmentId) return null;
      return await context.services.department.getById(parent.departmentId);
    } catch (error) {
      // Return null for missing department data
      logger.debug(`Failed to load department: ${error}`);
      return null;
    }
  },

  /**
   * Resolve process this snapshot is related to (optional)
   */
  process: async (_parent, _args) => {
    try {
      // Process is loaded from the snapshot query result
      return null; //TODO: Implement process loading when available
    } catch (error) {
      logger.debug(`Failed to load process: ${error}`);
      return null;
    }
  },

  /**
   * Resolve task assignment this snapshot is related to (optional)
   */
  taskAssignment: async (_parent, _args) => {
    try {
      // Task assignment is loaded from the snapshot query result
      return null; // TODO: Implement task assignment loading when available
    } catch (error) {
      logger.debug(`Failed to load task assignment: ${error}`);
      return null;
    }
  },
};

export const companyLoadAnalysisFieldResolvers: Pick<
  CompanyLoadAnalysisResolvers,
  "company"
> = {
  /**
   * Resolve company for this load analysis
   */
  company: async (parent, _args, context) => {
    try {
      const company = await context.services.company.getById(parent.company.id);
      if (!company) {
        throw new Error(`Company not found: ${parent.company.id}`);
      }
      return company;
    } catch (error) {
      throw new Error(`Failed to load company: ${error}`);
    }
  },
};

export const departmentLoadOverviewFieldResolvers: Pick<
  DepartmentLoadOverviewResolvers,
  "department"
> = {
  /**
   * Resolve department for this load overview
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

export const employeeLoadBreakdownFieldResolvers: Pick<
  EmployeeLoadBreakdownResolvers,
  "employee"
> = {
  /**
   * Resolve employee for this load breakdown
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

export const employeeLoadHistoryFieldResolvers: Pick<
  EmployeeLoadHistoryResolvers,
  "employee" | "snapshots"
> = {
  /**
   * Resolve employee for this load history
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

  /**
   * Resolve load snapshots for this employee
   */
  snapshots: async (parent, _args, context) => {
    try {
      return await context.services.loadSnapshot.findByEmployee(
        parent.employee.id,
      );
    } catch (error) {
      throw new Error(`Failed to load snapshots: ${error}`);
    }
  },
};
