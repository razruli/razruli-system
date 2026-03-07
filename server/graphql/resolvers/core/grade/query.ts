/**
 * ============================================================================
 * Grade Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for grade queries

/** Require authentication + grade:read permission */
const gradeReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["grade:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single grade by ID
 */
const gradeResolver: QueryResolvers["grade"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.grade.getById(id.toString());
  } catch (error) {
    throw new Error(`Failed to fetch grade: ${error}`);
  }
};

/**
 * Get all grades (simple list, no parameters per schema)
 */
const gradesResolver: QueryResolvers["grades"] = async (
  _parent,
  _args,
  context,
) => {
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
};

/**
 * Get grade with employee statistics
 */
const gradeWithStatsResolver: QueryResolvers["gradeWithStats"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    const grade = await context.services.grade.getById(id.toString());
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
};

// ==================== WRAPPED RESOLVERS ====================

const wrappedGrade = withMiddleware(gradeResolver, gradeReadMiddleware);

const wrappedGrades = withMiddleware(gradesResolver, gradeReadMiddleware);

const wrappedGradeWithStats = withMiddleware(
  gradeWithStatsResolver,
  gradeReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const gradeQueries: Pick<
  QueryResolvers,
  "grade" | "grades" | "gradeWithStats"
> = {
  grade: wrappedGrade,
  grades: wrappedGrades,
  gradeWithStats: wrappedGradeWithStats,
};

export default gradeQueries;
