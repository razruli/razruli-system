/**
 * ============================================================================
 * TaskAssignment Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for task assignment mutations

/** Require authentication + taskAssignment:create permission */
const taskAssignmentCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["taskAssignment:create"] },
);

/** Require authentication + taskAssignment:update permission */
const taskAssignmentUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["taskAssignment:update"] },
);

/** Require authentication + taskAssignment:delete permission */
const taskAssignmentDeleteMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["taskAssignment:delete"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new task assignment
 * Requires manager permissions
 */
const createTaskAssignmentResolver: MutationResolvers["createTaskAssignment"] =
  async (_parent, { input }, context) => {
    try {
      // Validate required fields
      if (!input.employeeId || !input.processId) {
        throw new Error("Missing required fields: employeeId, processId");
      }

      // Create task assignment with input data
      const taskAssignment = await context.services.taskAssignment.create({
        processId: input.processId,
        employeeId: input.employeeId,
        companyId: context.actor?.companyId || "",
        departmentId: context.actor?.departmentId || "",
        plannedHours: input.effortHours ?? 8, // Default to 8 hours if not provided
      });

      // TODO: Implement event emitter
      return taskAssignment;
    } catch (error) {
      throw new Error(`Failed to create task assignment: ${error}`);
    }
  };

/**
 * Update an existing task assignment
 * Supports partial updates with audit trail
 */
const updateTaskAssignmentResolver: MutationResolvers["updateTaskAssignment"] =
  async (_parent, { id, input }, context) => {
    try {
      // Get old values for audit trail
      const oldAssignment =
        await context.services.taskAssignment.getByIdOrThrow(id);

      // Build update data from provided fields
      const updateData: Partial<{
        status: string;
        plannedHours: number;
        actualHours: number;
        calculatedLoad: number;
      }> = {};

      if (input.status !== undefined && input.status !== oldAssignment.status) {
        updateData.status = input.status ?? undefined;
      }

      if (
        input.allocatedCapacityUnits !== undefined &&
        input.allocatedCapacityUnits !== null &&
        input.allocatedCapacityUnits * 8 !== oldAssignment.plannedHours
      ) {
        updateData.plannedHours = input.allocatedCapacityUnits * 8;
      }

      if (
        input.effortHours !== undefined &&
        input.effortHours !== null &&
        input.effortHours !== oldAssignment.plannedHours
      ) {
        updateData.plannedHours = input.effortHours;
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
  };

/**
 * Delete a task assignment
 * Requires manager permissions
 */
const deleteTaskAssignmentResolver: MutationResolvers["deleteTaskAssignment"] =
  async (_parent, { id }, context) => {
    try {
      await context.services.taskAssignment.delete(id);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete task assignment: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedCreateTaskAssignment = withMiddleware(
  createTaskAssignmentResolver,
  taskAssignmentCreateMiddleware,
);

const wrappedUpdateTaskAssignment = withMiddleware(
  updateTaskAssignmentResolver,
  taskAssignmentUpdateMiddleware,
);

const wrappedDeleteTaskAssignment = withMiddleware(
  deleteTaskAssignmentResolver,
  taskAssignmentDeleteMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const taskAssignmentMutations: Pick<
  MutationResolvers,
  "createTaskAssignment" | "updateTaskAssignment" | "deleteTaskAssignment"
> = {
  createTaskAssignment: wrappedCreateTaskAssignment,
  updateTaskAssignment: wrappedUpdateTaskAssignment,
  deleteTaskAssignment: wrappedDeleteTaskAssignment,
};

export default taskAssignmentMutations;
