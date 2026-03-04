/**
 * ============================================================================
 * Process Domain - Mutation Resolvers
 * ============================================================================
 * Handles all process modification operations with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

export const processMutations: Pick<
  MutationResolvers,
  "createProcess" | "updateProcess" | "deleteProcess"
> = {
  /**
   * Create a new process
   * Requires manager permissions
   */
  createProcess: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        // Validate required fields
        if (!input.name || !input.companyId) {
          throw new Error("Missing required fields: name, companyId");
        }

        // Create process with input data
        const process = await context.services.process.create({
          companyId: input.companyId,
          name: input.name,
          description: input.description,
          status: input.status || "DRAFT",
        });

        // TODO: Implement event emitter
        return process;
      } catch (error) {
        throw new Error(`Failed to create process: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:create"],
    },
  ),

  /**
   * Update an existing process
   * Supports partial updates with audit trail
   */
  updateProcess: withMiddleware(
    async (_parent, { id, input }, context) => {
      try {
        // Get old values for audit trail
        const oldProcess = await context.services.process.getByIdOrThrow(id);

        // Build update data from provided fields
        const updateData: Record<string, unknown> = {};

        if (input.name !== undefined && input.name !== oldProcess.name) {
          updateData.name = input.name;
        }

        if (
          input.description !== undefined &&
          input.description !== oldProcess.description
        ) {
          updateData.description = input.description;
        }

        if (input.status !== undefined && input.status !== oldProcess.status) {
          updateData.status = input.status;
        }

        if (Object.keys(updateData).length === 0) {
          return oldProcess;
        }

        const updatedProcess = await context.services.process.update(
          id,
          updateData,
        );

        return updatedProcess;
      } catch (error) {
        throw new Error(`Failed to update process: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:update"],
    },
  ),

  /**
   * Delete a process
   * Requires manager permissions
   */
  deleteProcess: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        const deletedProcess = await context.services.process.delete(id);
        return deletedProcess;
      } catch (error) {
        throw new Error(`Failed to delete process: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["process:delete"],
    },
  ),
};

export default processMutations;
