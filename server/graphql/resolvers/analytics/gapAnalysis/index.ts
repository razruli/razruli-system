/**
 * ============================================================================
 * GapAnalysis Domain - Resolver Index
 * ============================================================================
 * Exports all gap analysis resolvers (query, mutation, fields, subscription)
 */

import {
  gapAnalysisFieldResolvers,
  departmentGapComparisonFieldResolvers,
  hiringForecastFieldResolvers,
  talentCategoryFieldResolvers,
} from "./fields";
import gapAnalysisMutations from "./mutation";
import gapAnalysisQueries from "./query";
import gapAnalysisSubscriptions from "./subscription";

/**
 * Complete resolver set for GapAnalysis domain
 */
export const gapAnalysisResolvers = {
  Query: {
    ...gapAnalysisQueries,
  },

  Mutation: {
    ...gapAnalysisMutations,
  },

  Subscription: {
    ...gapAnalysisSubscriptions,
  },

  GapAnalysis: gapAnalysisFieldResolvers,
  DepartmentGapComparison: departmentGapComparisonFieldResolvers,
  HiringForecast: hiringForecastFieldResolvers,
  TalentCategory: talentCategoryFieldResolvers,
};

export {
  gapAnalysisQueries,
  gapAnalysisMutations,
  gapAnalysisSubscriptions,
  gapAnalysisFieldResolvers,
  departmentGapComparisonFieldResolvers,
  hiringForecastFieldResolvers,
  talentCategoryFieldResolvers,
};

export default gapAnalysisResolvers;
