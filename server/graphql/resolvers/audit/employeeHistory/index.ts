/**
 * ============================================================================
 * EmployeeHistory Domain - Resolver Index
 * ============================================================================
 * Exports all employee history resolvers (query, mutation, fields, subscription)
 */

import {
  employeeHistoryFieldResolvers,
  employeeAuditReportFieldResolvers,
  departmentEmployeeHistoryFieldResolvers,
} from "./fields";
import employeeHistoryMutations from "./mutation";
import employeeHistoryQueries from "./query";
import employeeHistorySubscriptions from "./subscription";

/**
 * Complete resolver set for EmployeeHistory domain
 */
export const employeeHistoryResolvers = {
  Query: {
    employeeHistory: employeeHistoryQueries.employeeHistory,
    employeeHistories: employeeHistoryQueries.employeeHistories,
    employeeChangeHistory: employeeHistoryQueries.employeeChangeHistory,
    employeeHistoryList: employeeHistoryQueries.employeeHistoryList,
  },

  Mutation: {
    recordEmployeeHistory: employeeHistoryMutations.recordEmployeeHistory,
    approveEmployeeHistory: employeeHistoryMutations.approveEmployeeHistory,
    rejectEmployeeHistory: employeeHistoryMutations.rejectEmployeeHistory,
  },

  Subscription: {
    ...employeeHistorySubscriptions,
  },

  EmployeeHistory: employeeHistoryFieldResolvers,
  EmployeeAuditReport: employeeAuditReportFieldResolvers,
  DepartmentEmployeeHistory: departmentEmployeeHistoryFieldResolvers,
};

export {
  employeeHistoryQueries,
  employeeHistoryMutations,
  employeeHistorySubscriptions,
  employeeHistoryFieldResolvers,
  employeeAuditReportFieldResolvers,
  departmentEmployeeHistoryFieldResolvers,
};

export default employeeHistoryResolvers;
