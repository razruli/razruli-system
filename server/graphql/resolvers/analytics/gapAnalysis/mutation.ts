/**
 * ============================================================================
 * GapAnalysis Domain - Mutation Resolvers
 * ============================================================================
 * Handles all gap analysis modification operations with middleware orchestration
 */

import {
  composeMiddleware,
  withMiddleware,
} from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE COMPOSITION ====================
// Define reusable middleware configurations

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

export const gapAnalysisMutations: Pick<
  MutationResolvers,
  "createGapAnalysis" | "updateGapAnalysis"
> = {
  /**
   * Create a new gap analysis
   * Requires manager permissions
   */
  createGapAnalysis: withMiddleware(
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
    },
    gapAnalysisCreateMiddleware,
  ),

  /**
   * Update an existing gap analysis
   * Supports partial updates
   */
  updateGapAnalysis: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        // Get old values
        const oldAnalysis = await context.services.gapAnalysis.getById(id);

        // Build update data from provided fields
        const updateData: Record<string, unknown> = {};

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
    },
    gapAnalysisUpdateMiddleware,
  ),

  /**
   * Delete a gap analysis
   * Requires manager permissions
   */
  // deleteGapAnalysis: withMiddleware(
  //   async (_parent, { id }, context) => {
  //     try {
  //       const deletedAnalysis = await context.services.gapAnalysis.delete(id);
  //       return deletedAnalysis;
  //     } catch (error) {
  //       throw new Error(`Failed to delete gap analysis: ${error}`);
  //     }
  //   },
  //   {
  //     requireAuth: true,
  //     requiredPermissions: ["gapAnalysis:delete"],
  //   },
  // ),
};

export default gapAnalysisMutations;
