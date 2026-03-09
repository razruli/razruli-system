/**
 * ============================================================================
 * Grade Domain - Resolver Index
 * ============================================================================
 * Exports all grade resolvers (query, mutation, fields, subscription)
 * Used by the main resolver composition layer
 */

import { gradeFieldResolvers, gradeStatsFieldResolvers } from "./fields";
import { gradeMutations } from "./mutation";
import gradeQueries from "./query";
import gradeSubscriptions from "./subscription";

/**
 * Complete resolver set for Grade domain
 * Combines and exports all resolver types
 */
export const gradeResolvers = {
  Query: {
    grade: gradeQueries.grade,
    grades: gradeQueries.grades,
    gradeWithStats: gradeQueries.gradeWithStats,
  },

  Mutation: {
    createGrade: gradeMutations.createGrade,
    updateGrade: gradeMutations.updateGrade,
    deleteGrade: gradeMutations.deleteGrade,
  },

  Subscription: {
    ...gradeSubscriptions,
  },

  Grade: gradeFieldResolvers,
  GradeStats: gradeStatsFieldResolvers,
};

export {
  gradeQueries,
  gradeMutations,
  gradeSubscriptions,
  gradeFieldResolvers,
  gradeStatsFieldResolvers,
};

export default gradeResolvers;
