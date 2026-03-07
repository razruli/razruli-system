/**
 * ============================================================================
 * GapAnalysis Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for gap analysis mutations

/** Require authentication + gapAnalysis:create permission */
const gapAnalysisCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["gapAnalysis:create"] },
);

/** Require authentication + gapAnalysis:update permission */
const gapAnalysisUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["gapAnalysis:update"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new gap analysis
 * Requires manager permissions
 */
const createGapAnalysisResolver: MutationResolvers["createGapAnalysis"] =
  async (_parent, { input }, context) => {
    try {
      // Validate required fields
      if (!input.companyId) {
        throw new Error("Missing required field: companyId");
      }

      // Create gap analysis with input data
      const gapAnalysis = await context.services.gapAnalysis.create({
        companyId: input.companyId,
        departmentId: input.departmentId,
        analysisDate: input.startDate,
      });

      // TODO: Implement event emitter
      return gapAnalysis;
    } catch (error) {
      throw new Error(`Failed to create gap analysis: ${error}`);
    }
  };

/**
 * Update an existing gap analysis
 * Supports partial updates
 */
const updateGapAnalysisResolver: MutationResolvers["updateGapAnalysis"] =
  async (_parent, { id, input }, context) => {
    try {
      // Get old values
      const oldAnalysis = await context.services.gapAnalysis.getById(id);

      // Build update data from provided fields
      const updateData: Record<string, unknown> = {};

      // Add fields from input if they're provided
      if (input && Object.keys(input).length > 0) {
        // Map input fields to update data
        Object.assign(updateData, input);
      }

      if (Object.keys(updateData).length === 0) {
        return oldAnalysis;
      }

      const updatedAnalysis = await context.services.gapAnalysis.update(
        id,
        updateData,
      );

      return updatedAnalysis;
    } catch (error) {
      throw new Error(`Failed to update gap analysis: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedCreateGapAnalysis = withMiddleware(
  createGapAnalysisResolver,
  gapAnalysisCreateMiddleware,
);

const wrappedUpdateGapAnalysis = withMiddleware(
  updateGapAnalysisResolver,
  gapAnalysisUpdateMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const gapAnalysisMutations: Pick<
  MutationResolvers,
  "createGapAnalysis" | "updateGapAnalysis"
> = {
  createGapAnalysis: wrappedCreateGapAnalysis,
  updateGapAnalysis: wrappedUpdateGapAnalysis,

  /**
   * Delete a gap analysis
   * Requires manager permissions
   * TODO: Uncomment when delete permission is needed
   */
  // deleteGapAnalysis: withMiddleware(
  //   deleteGapAnalysisResolver,
  //   gapAnalysisDeleteMiddleware,
  // ),
};

export default gapAnalysisMutations;
