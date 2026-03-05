/**
 * ============================================================================
 * Grade Domain - Query Resolvers
 * ============================================================================
 * Handles all grade-related queries with middleware orchestration
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE COMPOSITION ====================
// Define reusable middleware configurations

/** Require authentication + grade:read permission */
const gradeReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["grade:read"] },
);

export const gradeQueries: Pick<
  QueryResolvers,
  "grade" | "grades" | "gradeWithStats"
> = {
  /**
   * Get a single grade by ID
   */
  grade: withMiddleware(async (_parent, { id }, context) => {
    try {
      return await context.services.grade.getById(id);
    } catch (error) {
      throw new Error(`Failed to fetch grade: ${error}`);
    }
  }, gradeReadMiddleware),

  /**
   * Get all grades (simple list, no parameters per schema)
   */
  grades: withMiddleware(async (_parent, _args, context) => {
    try {
      const result = await context.services.grade.find(
        {},
        {
          offset: 0,
          limit: 10000,
          sortBy: "id",
          sortOrder: "ASC",
        },
      );
      return result.data;
    } catch (error) {
      throw new Error(`Failed to list grades: ${error}`);
    }
  }, gradeReadMiddleware),

  /**
   * Get grade with employee statistics
   */
  gradeWithStats: withMiddleware(async (_parent, { id }, context) => {
    try {
      const grade = await context.services.grade.getById(id);
      if (!grade) return null;

      // TODO: Fetch stats from analytics service
      return {
        grade,
        employeeCount: 0,
        averageEfficiency: 0,
        overloadedCount: 0,
      };
    } catch (error) {
      throw new Error(`Failed to fetch grade stats: ${error}`);
    }
  }, gradeReadMiddleware),
};

export default gradeQueries;
