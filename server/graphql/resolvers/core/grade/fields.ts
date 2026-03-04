/**
 * ============================================================================
 * Grade Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 * Only includes fields explicitly defined in the GraphQL schema
 */

import {
  GradeResolvers,
  GradeStatsResolvers,
} from "@/server/graphql/types/generated";

export const gradeFieldResolvers: Pick<
  GradeResolvers,
  "employees" | "processes"
> = {
  /**
   * Resolve employees with this grade
   * Returns all employees assigned to this grade
   */
  employees: async (parent, _args, context) => {
    try {
      return await context.services.employee.findByGrade(parent.id);
    } catch (error) {
      throw new Error(`Failed to load employees: ${error}`);
    }
  },

  /**
   * Resolve processes targeting this grade
   * Returns all processes specific to this grade level
   */
  processes: async (parent, _args, context) => {
    try {
      return await context.services.process.findByGrade(parent.id);
    } catch (error) {
      throw new Error(`Failed to load processes: ${error}`);
    }
  },
};

export const gradeStatsFieldResolvers: GradeStatsResolvers = {
  /**
   * Resolve grade for this statistics object
   */
  grade: async (parent, _args, context) => {
    try {
      const grade = await context.services.grade.getById(
        parent.grade.id.toString(),
      );
      if (!grade) {
        throw new Error(`Grade not found: ${parent.grade.id}`);
      }
      return grade;
    } catch (error) {
      throw new Error(`Failed to load grade: ${error}`);
    }
  },

  /**
   * Scalar fields - no additional resolution needed
   */
  averageEfficiency: (parent) => parent.averageEfficiency,
  employeeCount: (parent) => parent.employeeCount,
  overloadedCount: (parent) => parent.overloadedCount,
};
