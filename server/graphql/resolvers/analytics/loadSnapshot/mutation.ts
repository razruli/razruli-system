/**
 * ============================================================================
 * LoadSnapshot Domain - Mutation Resolvers
 * ============================================================================
 * Handles all load snapshot modification operations with middleware orchestration
 */

import {
  composeMiddleware,
  withMiddleware,
} from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE COMPOSITION ====================
// Define reusable middleware configurations

/** Require authentication + loadSnapshot:create permission */
const loadSnapshotCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["loadSnapshot:create"] },
);

export const loadSnapshotMutations: Pick<
  MutationResolvers,
  "createLoadSnapshot"
> = {
  /**
   * Create a new load snapshot
   * Requires authentication - captures current load state
   */
  createLoadSnapshot: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        // Validate required fields
        if (!input.employeeId) {
          throw new Error("Missing required field: employeeId");
        }

        // Create load snapshot with input data
        const loadSnapshot = await context.services.loadSnapshot.create({
          employeeId: input.employeeId,
          totalCapacityHours: input.totalCapacityHours,
          allocatedHours: input.allocatedHours,
          freeloadsHours: input.freeloadsHours,
          loadIndex: input.loadIndex,
          snapshotDate: input.snapshotDate,
        });

        // TODO: Implement event emitter
        return loadSnapshot;
      } catch (error) {
        throw new Error(`Failed to create load snapshot: ${error}`);
      }
    },
    loadSnapshotCreateMiddleware,
  ),

  /**
   * Update an existing load snapshot
   * Supports partial updates
   */
  // updateLoadSnapshot: withMiddleware(
  //   async (_parent, { id, input }, context) => {
  //     try {
  //       // Get old values
  //       const oldSnapshot =
  //         await context.services.loadSnapshot.getByIdOrThrow(id);

  //       // Build update data from provided fields
  //       const updateData: Record<string, unknown> = {};

  //       if (
  //         input.totalCapacityHours !== undefined &&
  //         input.totalCapacityHours !== oldSnapshot.totalCapacityHours
  //       ) {
  //         updateData.totalCapacityHours = input.totalCapacityHours;
  //       }

  //       if (
  //         input.allocatedHours !== undefined &&
  //         input.allocatedHours !== oldSnapshot.allocatedHours
  //       ) {
  //         updateData.allocatedHours = input.allocatedHours;
  //       }

  //       if (
  //         input.freeloadsHours !== undefined &&
  //         input.freeloadsHours !== oldSnapshot.freeloadsHours
  //       ) {
  //         updateData.freeloadsHours = input.freeloadsHours;
  //       }

  //       if (
  //         input.loadIndex !== undefined &&
  //         input.loadIndex !== oldSnapshot.loadIndex
  //       ) {
  //         updateData.loadIndex = input.loadIndex;
  //       }

  //       if (Object.keys(updateData).length === 0) {
  //         return oldSnapshot;
  //       }

  //       const updatedSnapshot = await context.services.loadSnapshot.update(
  //         id,
  //         updateData,
  //       );

  //       return updatedSnapshot;
  //     } catch (error) {
  //       throw new Error(`Failed to update load snapshot: ${error}`);
  //     }
  //   },
  //   {
  //     requireAuth: true,
  //     requiredPermissions: ["loadSnapshot:update"],
  //   },
  // ),

  /**
   * Delete a load snapshot
   * Requires authentication
   */
  // deleteLoadSnapshot: withMiddleware(
  //   async (_parent, { id }, context) => {
  //     try {
  //       const deletedSnapshot = await context.services.loadSnapshot.delete(id);
  //       return deletedSnapshot;
  //     } catch (error) {
  //       throw new Error(`Failed to delete load snapshot: ${error}`);
  //     }
  //   },
  //   {
  //     requireAuth: true,
  //     requiredPermissions: ["loadSnapshot:delete"],
  //   },
  // ),
};

export default loadSnapshotMutations;
