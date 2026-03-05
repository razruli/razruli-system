/**
 * ============================================================================
 * Grade Domain - Mutation Resolvers
 * ============================================================================
 * Handles all grade modification operations with middleware orchestration
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE COMPOSITION ====================
// Define reusable middleware configurations

/** Require authentication + grade:create permission */
const gradeCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["grade:create"] },
);

/** Require authentication + grade:update permission */
const gradeUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["grade:update"] },
);

/** Require authentication + grade:delete permission */
const gradeDeleteMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["grade:delete"] },
);

// : Pick<MutationResolvers, "createGrade" | "updateGrade" | "deleteGrade">
export const gradeMutations = {
  /**
   * Create a new grade
   * Requires manager permissions
   */
  createGrade: withMiddleware(async (_parent, { input }, context) => {
    try {
      // Validate required fields
      if (!input.name || !input.companyId) {
        throw new Error("Missing required fields: name, companyId");
      }

      // Create grade with input data
      const grade = await context.services.grade.create({
        companyId: input.companyId,
        name: input.name,
        level: input.level,
        description: input.description,
        minSalary: input.minSalary,
        maxSalary: input.maxSalary,
      });

      // TODO: Implement event emitter (RabbitMQ/Redis)
      // context.eventEmitter.emit(
      //   `GRADE_CREATED_COMPANY_${input.companyId}`,
      //   grade
      // );

      return grade;
    } catch (error) {
      throw new Error(`Failed to create grade: ${error}`);
    }
  }, gradeCreateMiddleware),

  /**
   * Update an existing grade
   * Supports partial updates with audit trail
   */
  updateGrade: withMiddleware(async (_parent, { id, input }, context) => {
    try {
      // Get old values for audit trail
      const oldGrade = await context.services.grade.getByIdOrThrow(id);

      // Build update data from provided fields
      const updateData: Record<string, unknown> = {};

      if (input.name !== undefined && input.name !== oldGrade.name) {
        updateData.name = input.name;
      }

      if (input.level !== undefined && input.level !== oldGrade.level) {
        updateData.level = input.level;
      }

      if (
        input.description !== undefined &&
        input.description !== oldGrade.description
      ) {
        updateData.description = input.description;
      }

      if (
        input.minSalary !== undefined &&
        input.minSalary !== oldGrade.minSalary
      ) {
        updateData.minSalary = input.minSalary;
      }

      if (
        input.maxSalary !== undefined &&
        input.maxSalary !== oldGrade.maxSalary
      ) {
        updateData.maxSalary = input.maxSalary;
      }

      if (Object.keys(updateData).length === 0) {
        return oldGrade;
      }

      const updatedGrade = await context.services.grade.update(id, updateData);

      // TODO: Implement event emitter
      // context.eventEmitter.emit("GRADE_UPDATED", {
      //   oldGrade,
      //   updatedGrade,
      // });

      return updatedGrade;
    } catch (error) {
      throw new Error(`Failed to update grade: ${error}`);
    }
  }, gradeUpdateMiddleware),

  /**
   * Delete a grade
   * Requires manager permissions
   */
  deleteGrade: withMiddleware(async (_parent, { id }, context) => {
    try {
      const deletedGrade = await context.services.grade.delete(id);

      // TODO: Implement event emitter
      // context.eventEmitter.emit("GRADE_DELETED", deletedGrade);

      return deletedGrade;
    } catch (error) {
      throw new Error(`Failed to delete grade: ${error}`);
    }
  }, gradeDeleteMiddleware),
};

export default gradeMutations;
