/**
 * ============================================================================
 * LoadSnapshot Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for load snapshot mutations

/** Require authentication + loadSnapshot:create permission */
const loadSnapshotCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["loadSnapshot:create"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new load snapshot
 * Requires authentication - captures current load state
 */
const createLoadSnapshotResolver: MutationResolvers["createLoadSnapshot"] =
  async (_parent, { employeeId, snapshotType, sourceId }, context) => {
    try {
      // Validate required fields
      if (!employeeId) {
        throw new Error("Missing required field: employeeId");
      }

      // Create load snapshot with input data
      const loadSnapshot = await context.services.loadSnapshot.create({
        employeeId,
        snapshotType,
        sourceId,
        periodStart: new Date(),
        periodEnd: new Date(),
      });

      // TODO: Implement event emitter
      return loadSnapshot;
    } catch (error) {
      throw new Error(`Failed to create load snapshot: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedCreateLoadSnapshot = withMiddleware(
  createLoadSnapshotResolver,
  loadSnapshotCreateMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const loadSnapshotMutations: Pick<
  MutationResolvers,
  "createLoadSnapshot"
> = {
  createLoadSnapshot: wrappedCreateLoadSnapshot,
};

export default loadSnapshotMutations;
