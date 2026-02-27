/**
 * ============================================================================
 * Employee Domain - Resolver Index
 * ============================================================================
 * Exports all employee resolvers (query, mutation, fields, subscription)
 * Used by the main resolver composition layer
 */

import { Resolvers } from "@/server/graphql/generated";

import employeeFieldResolvers from "./fields";
import employeeMutations from "./mutation";
import employeeQueries from "./query";
import employeeSubscriptions from "./subscription";

/**
 * Complete resolver set for Employee domain
 * Combines and exports all resolver types
 */
export const employeeResolvers: Resolvers = {
  Query: {
    employee: employeeQueries.employee,
    employees: employeeQueries.employees,
    departmentEmployees: employeeQueries.departmentEmployees,
    employeeCapacity: employeeQueries.employeeCapacity,
    employeeLoadIndex: employeeQueries.employeeLoadIndex,
  },

  Mutation: {
    createEmployee: employeeMutations.createEmployee,
    updateEmployee: employeeMutations.updateEmployee,
    dismissEmployee: employeeMutations.dismissEmployee,
    updateEmployeeEfficiency: employeeMutations.updateEmployeeEfficiency,
  },

  Subscription: {
    employeeUpdated: employeeSubscriptions.employeeUpdated,
    employeeCreated: employeeSubscriptions.employeeCreated,
    employeeDismissed: employeeSubscriptions.employeeDismissed,
    employeeCapacityChanged: employeeSubscriptions.employeeCapacityChanged,
    employeeLoadThresholdCrossed:
      employeeSubscriptions.employeeLoadThresholdCrossed,
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
