/**
 * ============================================================================
 * Department Domain - Mutation Resolvers
 * ============================================================================
 * Handles all department modification operations with middleware orchestration
 */

import {
  composeMiddleware,
  withMiddleware,
} from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE COMPOSITION ====================
// Define reusable middleware configurations

/** Require authentication + department:create permission */
const departmentCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:create"] },
);

/** Require authentication + department:update permission */
const departmentUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:update"] },
);

/** Require authentication + department:delete permission */
const departmentDeleteMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:delete"] },
);

export const departmentMutations: Pick<
  MutationResolvers,
  | "createDepartment"
  | "updateDepartment"
  | "deleteDepartment"
  | "assignDepartmentHead"
> = {
  /**
   * Create a new department
   * Requires manager permissions
   */
  createDepartment: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        // Validate required fields
        if (!input.name || !input.companyId) {
          throw new Error("Missing required fields: name, companyId");
        }

        // Create department with input data matching schema
        const department = await context.services.department.create({
          companyId: input.companyId,
          name: input.name,
          headId: input.headId,
        });

        // TODO: Implement event emitter (RabbitMQ/Redis)
        // context.eventEmitter.emit(
        //   `DEPARTMENT_CREATED_COMPANY_${input.companyId}`,
        //   department
        // );

        return department;
      } catch (error) {
        throw new Error(`Failed to create department: ${error}`);
      }
    },
    departmentCreateMiddleware,
  ),

  /**
   * Update an existing department
   * Supports partial updates with audit trail
   */
  updateDepartment: withMiddleware(
    async (_parent, { id, input }, context) => {
      try {
        // Build update data from provided fields matching schema
        const updateData: Record<string, unknown> = {};

        if (input.name !== undefined) {
          updateData.name = input.name;
        }

        if (input.headId !== undefined) {
          updateData.headId = input.headId;
        }

        if (Object.keys(updateData).length === 0) {
          const department = await context.services.department.getById(id);
          return department;
        }

        const updatedDepartment = await context.services.department.update(
          id,
          updateData,
        );

        // TODO: Implement event emitter
        // context.eventEmitter.emit("DEPARTMENT_UPDATED", {
        //   oldDepartment,
        //   updatedDepartment,
        // });

        return updatedDepartment;
      } catch (error) {
        throw new Error(`Failed to update department: ${error}`);
      }
    },
    departmentUpdateMiddleware,
  ),

  /**
   * Delete a department
   * Requires manager permissions
   */
  deleteDepartment: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        const deletedDepartment = await context.services.department.delete(id);

        // TODO: Implement event emitter
        // context.eventEmitter.emit("DEPARTMENT_DELETED", deletedDepartment);

        return deletedDepartment;
      } catch (error) {
        throw new Error(`Failed to delete department: ${error}`);
      }
    },
    departmentDeleteMiddleware,
  ),

  /**
   * Assign department head
   */
  assignDepartmentHead: withMiddleware(
    async (_parent, { departmentId, employeeId }, context) => {
      try {
        const department = await context.services.department.update(
          departmentId,
          { headId: employeeId },
        );
        return department;
      } catch (error) {
        throw new Error(`Failed to assign department head: ${error}`);
      }
    },
    departmentUpdateMiddleware,
  ),
};

export default departmentMutations;
