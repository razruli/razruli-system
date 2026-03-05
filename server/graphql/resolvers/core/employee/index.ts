/**
 * ============================================================================
 * Employee Domain - Resolver Index
 * ============================================================================
 * Exports all employee resolvers (query, mutation, fields, subscription)
 * Used by the main resolver composition layer
 */

import employeeFieldResolvers from "./fields";
import employeeMutations from "./mutation";
import employeeQueries from "./query";
import employeeSubscriptions from "./subscription";

/**
 * Complete resolver set for Employee domain
 * Combines and exports all resolver types
 */
export const employeeResolvers = {
  Query: {
    employee: employeeQueries.employee,
    employees: employeeQueries.employees,
    departmentEmployees: employeeQueries.departmentEmployees,
    employeeCapacity: employeeQueries.employeeCapacity,
    employeeLoadIndex: employeeQueries.employeeLoadIndex,
    employeeTasks: employeeQueries.employeeTasks,
    employeeTaskStats: employeeQueries.employeeTaskStats,
    employeeLoadTrend: employeeQueries.employeeLoadTrend,
    employeeTimeline: employeeQueries.employeeTimeline,
    employeeAuditReport: employeeQueries.employeeAuditReport,
    employeeHistoryEntry: employeeQueries.employeeHistoryEntry,
  },

  Mutation: {
    createEmployee: employeeMutations.createEmployee,
    updateEmployee: employeeMutations.updateEmployee,
    dismissEmployee: employeeMutations.dismissEmployee,
    updateEmployeeEfficiency: employeeMutations.updateEmployeeEfficiency,
  },

  Subscription: {
    // Subscriptions commented out until event emitter is implemented
    // employeeUpdated: employeeSubscriptions.employeeUpdated,
    // employeeCreated: employeeSubscriptions.employeeCreated,
    // employeeDismissed: employeeSubscriptions.employeeDismissed,
    // employeeCapacityChanged: employeeSubscriptions.employeeCapacityChanged,
    // employeeLoadThresholdCrossed: employeeSubscriptions.employeeLoadThresholdCrossed,
  },

  Employee: employeeFieldResolvers,
};

export {
  employeeQueries,
  employeeMutations,
  employeeFieldResolvers,
  employeeSubscriptions,
};
export default employeeResolvers;
