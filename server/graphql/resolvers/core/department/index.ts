/**
 * ============================================================================
 * Department Domain - Resolver Index
 * ============================================================================
 * Exports all department resolvers (query, mutation, fields, subscription)
 * Used by the main resolver composition layer
 */

import {
  departmentFieldResolvers,
  departmentMetricsFieldResolvers,
} from "./fields";
import departmentMutations from "./mutation";
import departmentQueries from "./query";
import departmentSubscriptions from "./subscription";

/**
 * Complete resolver set for Department domain
 * Combines and exports all resolver types
 */
export const departmentResolvers = {
  Query: {
    department: departmentQueries.department,
    departments: departmentQueries.departments,
    departmentWithMetrics: departmentQueries.departmentWithMetrics,
    departmentProcesses: departmentQueries.departmentProcesses,
    departmentSnapshots: departmentQueries.departmentSnapshots,
    departmentGapComparison: departmentQueries.departmentGapComparison,
    departmentLoadOverview: departmentQueries.departmentLoadOverview,
    departmentEmployeeHistory: departmentQueries.departmentEmployeeHistory,
  },

  Mutation: {
    createDepartment: departmentMutations.createDepartment,
    updateDepartment: departmentMutations.updateDepartment,
    deleteDepartment: departmentMutations.deleteDepartment,
    assignDepartmentHead: departmentMutations.assignDepartmentHead,
  },

  Subscription: {
    ...departmentSubscriptions,
  },

  Department: departmentFieldResolvers,
  DepartmentMetrics: departmentMetricsFieldResolvers,
};

export {
  departmentQueries,
  departmentMutations,
  departmentSubscriptions,
  departmentFieldResolvers,
  departmentMetricsFieldResolvers,
};

export default departmentResolvers;
