/**
 * ============================================================================
 * Grade Domain - Resolver Index
 * ============================================================================
 * Exports all grade resolvers (query, mutation, fields, subscription)
 * Used by the main resolver composition layer
 */

import { gradeFieldResolvers, gradeStatsFieldResolvers } from "./fields";
import gradeMutations from "./mutation";
import gradeQueries from "./query";
import gradeSubscriptions from "./subscription";

/**
 * Complete resolver set for Grade domain
 * Combines and exports all resolver types
en * 
 * NOTE: Grade mutations (createGrade, updateGrade, deleteGrade) are not included
 * because Grade is reference data that doesn't change often and mutations are not
 * defined in the GraphQL schema
 */
export const gradeResolvers = {
  Query: {
    grade: gradeQueries.grade,
    grades: gradeQueries.grades,
    gradeWithStats: gradeQueries.gradeWithStats,
  },

  Mutation: {
    // Grade mutations not included - Grade is read-only reference data
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
