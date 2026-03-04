/**
 * ============================================================================
 * TaskAssignment Domain - Mutation Resolvers
 * ============================================================================
 * Handles all task assignment modification operations with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

export const taskAssignmentMutations: Pick<
  MutationResolvers,
  "createTaskAssignment" | "updateTaskAssignment" | "deleteTaskAssignment"
> = {
  /**
   * Create a new task assignment
   * Requires manager permissions
   */
  createTaskAssignment: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        // Validate required fields
        if (!input.employeeId || !input.processId) {
          throw new Error("Missing required fields: employeeId, processId");
        }

        // Create task assignment with input data
        const taskAssignment = await context.services.taskAssignment.create({
          employeeId: input.employeeId,
          processId: input.processId,
          status: input.status || "ASSIGNED",
          priority: input.priority,
          deadline: input.deadline,
          estimatedHours: input.estimatedHours,
        });

        // TODO: Implement event emitter
        return taskAssignment;
      } catch (error) {
        throw new Error(`Failed to create task assignment: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["taskAssignment:create"],
    },
  ),

  /**
   * Update an existing task assignment
   * Supports partial updates with audit trail
   */
  updateTaskAssignment: withMiddleware(
    async (_parent, { id, input }, context) => {
      try {
        // Get old values for audit trail
        const oldAssignment =
          await context.services.taskAssignment.getByIdOrThrow(id);

        // Build update data from provided fields
        const updateData: Record<string, unknown> = {};

        if (
          input.status !== undefined &&
          input.status !== oldAssignment.status
        ) {
          updateData.status = input.status;
        }

        if (
          input.priority !== undefined &&
          input.priority !== oldAssignment.priority
        ) {
          updateData.priority = input.priority;
        }

        if (
          input.deadline !== undefined &&
          input.deadline !== oldAssignment.deadline
        ) {
          updateData.deadline = input.deadline;
        }

        if (
          input.estimatedHours !== undefined &&
          input.estimatedHours !== oldAssignment.estimatedHours
        ) {
          updateData.estimatedHours = input.estimatedHours;
        }

        if (Object.keys(updateData).length === 0) {
          return oldAssignment;
        }

        const updatedAssignment = await context.services.taskAssignment.update(
          id,
          updateData,
        );

        return updatedAssignment;
      } catch (error) {
        throw new Error(`Failed to update task assignment: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["taskAssignment:update"],
    },
  ),

  /**
   * Delete a task assignment
   * Requires manager permissions
   */
  deleteTaskAssignment: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        const deletedAssignment =
          await context.services.taskAssignment.delete(id);

        return deletedAssignment;
      } catch (error) {
        throw new Error(`Failed to delete task assignment: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["taskAssignment:delete"],
    },
  ),
};

export default taskAssignmentMutations;
