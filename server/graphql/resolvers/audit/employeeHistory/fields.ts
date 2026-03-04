/**
 * ============================================================================
 * EmployeeHistory Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import {
  EmployeeHistoryResolvers,
  DepartmentEmployeeHistoryResolvers,
  EmployeeAuditReportResolvers,
} from "@/server/graphql/types/generated";

export const employeeHistoryFieldResolvers: Pick<
  EmployeeHistoryResolvers,
  "employee"
> = {
  /**
   * Resolve employee who has the history record
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
};

export const departmentEmployeeHistoryFieldResolvers: Pick<
  DepartmentEmployeeHistoryResolvers,
  "department"
> = {
  /**
   * Resolve department for this history summary
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

export const employeeAuditReportFieldResolvers: Pick<
  EmployeeAuditReportResolvers,
  "employee"
> = {
  /**
   * Resolve employee for this audit report
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
