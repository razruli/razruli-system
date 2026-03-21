/**
 * ============================================================================
 * Finished Task Domain - Resolver Index
 * ============================================================================
 * Exports all finished task resolvers (query, mutations, fields)
 */

import finishedTaskQueries from "./query";

/**
 * Complete resolver set for Finished Task domain
 * Analytics-focused: read-only queries, no mutations needed
 */
export const finishedTaskResolvers = {
  Query: {
    finishedTasksByDepartment: finishedTaskQueries.finishedTasksByDepartment,
    finishedTasksByEmployee: finishedTaskQueries.finishedTasksByEmployee,
    finishedTasksByProcess: finishedTaskQueries.finishedTasksByProcess,
    departmentMetrics: finishedTaskQueries.departmentMetrics,
    employeeMetrics: finishedTaskQueries.employeeMetrics,
    companyProductivityRanking: finishedTaskQueries.companyProductivityRanking,
    popularProcesses: finishedTaskQueries.popularProcesses,
    recentTasksByDepartment: finishedTaskQueries.recentTasksByDepartment,
  },
};

export { finishedTaskQueries };

export default finishedTaskResolvers;
