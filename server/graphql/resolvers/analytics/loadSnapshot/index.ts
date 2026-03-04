/**
 * ============================================================================
 * LoadSnapshot Domain - Resolver Index
 * ============================================================================
 * Exports all load snapshot resolvers (query, mutation, fields, subscription)
 */

import {
  loadSnapshotFieldResolvers,
  employeeLoadHistoryFieldResolvers,
  departmentLoadOverviewFieldResolvers,
  employeeLoadBreakdownFieldResolvers,
  companyLoadAnalysisFieldResolvers,
} from "./fields";
import loadSnapshotMutations from "./mutation";
import loadSnapshotQueries from "./query";
import loadSnapshotSubscriptions from "./subscription";

/**
 * Complete resolver set for LoadSnapshot domain
 */
export const loadSnapshotResolvers = {
  Query: {
    ...loadSnapshotQueries,
  },

  Mutation: {
    ...loadSnapshotMutations,
  },

  Subscription: {
    ...loadSnapshotSubscriptions,
  },

  LoadSnapshot: loadSnapshotFieldResolvers,
  EmployeeLoadHistory: employeeLoadHistoryFieldResolvers,
  DepartmentLoadOverview: departmentLoadOverviewFieldResolvers,
  EmployeeLoadBreakdown: employeeLoadBreakdownFieldResolvers,
  CompanyLoadAnalysis: companyLoadAnalysisFieldResolvers,
};
export {
  loadSnapshotQueries,
  loadSnapshotMutations,
  loadSnapshotSubscriptions,
  loadSnapshotFieldResolvers,
  employeeLoadHistoryFieldResolvers,
  departmentLoadOverviewFieldResolvers,
  employeeLoadBreakdownFieldResolvers,
  companyLoadAnalysisFieldResolvers,
};

export default loadSnapshotResolvers;
