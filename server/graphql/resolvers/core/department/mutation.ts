/**
 * ============================================================================
 * Department Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for department mutations

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

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new department
 * Requires manager permissions
 */
const createDepartmentResolver: MutationResolvers["createDepartment"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    // Validate required fields
    if (!input.name || !input.companyId) {
      throw new Error("Missing required fields: name, companyId");
    }

    // Create department with input data matching schema
    const department = await context.services.department.create({
      companyId: input.companyId,
      name: input.name,
      headId: input.headId ?? undefined,
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
};

/**
 * Update an existing department
 * Supports partial updates with audit trail
 */
const updateDepartmentResolver: MutationResolvers["updateDepartment"] = async (
  _parent,
  { id, input },
  context,
) => {
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
      const department = await context.services.department.getByIdOrThrow(id);
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
};

/**
 * Delete a department
 * Requires manager permissions
 */
const deleteDepartmentResolver: MutationResolvers["deleteDepartment"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    await context.services.department.delete(id);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete department: ${error}`);
  }
};

/**
 * Assign department head
 */
const assignDepartmentHeadResolver: MutationResolvers["assignDepartmentHead"] =
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
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedCreateDepartment = withMiddleware(
  createDepartmentResolver,
  departmentCreateMiddleware,
);

const wrappedUpdateDepartment = withMiddleware(
  updateDepartmentResolver,
  departmentUpdateMiddleware,
);

const wrappedDeleteDepartment = withMiddleware(
  deleteDepartmentResolver,
  departmentDeleteMiddleware,
);

const wrappedAssignDepartmentHead = withMiddleware(
  assignDepartmentHeadResolver,
  departmentUpdateMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const departmentMutations: Pick<
  MutationResolvers,
  | "createDepartment"
  | "updateDepartment"
  | "deleteDepartment"
  | "assignDepartmentHead"
> = {
  createDepartment: wrappedCreateDepartment,
  updateDepartment: wrappedUpdateDepartment,
  deleteDepartment: wrappedDeleteDepartment,
  assignDepartmentHead: wrappedAssignDepartmentHead,
};

export default departmentMutations;
