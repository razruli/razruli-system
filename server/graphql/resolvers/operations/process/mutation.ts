/**
 * ============================================================================
 * Process Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for process mutations

/** Require authentication + process:create permission */
const processCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["process:create"] },
);

/** Require authentication + process:update permission */
const processUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["process:update"] },
);

/** Require authentication + process:delete permission */
const processDeleteMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["process:delete"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new process
 * Requires manager permissions
 */
const createProcessResolver: MutationResolvers["createProcess"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    // Validate required fields
    if (!input.name || !input.companyId || !input.departmentId) {
      throw new Error("Missing required fields: name, companyId, departmentId");
    }

    // Create process with input data
    const process = await context.services.process.create({
      companyId: input.companyId,
      departmentId: input.departmentId,
      title: input.name,
      description: input.description ?? undefined,
      plannedHours: Math.ceil(input.capacityUnits * 8), // Convert CU to hours
      priority: input.priority ?? "medium",
      status: input.status ?? "open",
    });

    // TODO: Implement event emitter
    return process;
  } catch (error) {
    throw new Error(`Failed to create process: ${error}`);
  }
};

/**
 * Update an existing process
 * Supports partial updates with audit trail
 */
const updateProcessResolver: MutationResolvers["updateProcess"] = async (
  _parent,
  { id, input },
  context,
) => {
  try {
    // Get old values for audit trail
    const oldProcess = await context.services.process.getByIdOrThrow(id);

    // Build update data from provided fields
    const updateData: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      plannedHours: number;
    }> = {};

    if (input.name !== undefined && input.name !== oldProcess.title) {
      updateData.title = input.name ?? undefined;
    }

    if (
      input.description !== undefined &&
      input.description !== oldProcess.description
    ) {
      updateData.description = input.description ?? undefined;
    }

    if (input.status !== undefined && input.status !== oldProcess.status) {
      updateData.status = input.status ?? undefined;
    }

    if (
      input.priority !== undefined &&
      input.priority !== oldProcess.priority
    ) {
      updateData.priority = input.priority ?? undefined;
    }

    if (
      input.capacityUnits !== undefined &&
      input.capacityUnits !== null &&
      input.capacityUnits * 8 !== oldProcess.plannedHours
    ) {
      updateData.plannedHours = input.capacityUnits * 8;
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
};

/**
 * Delete a process
 * Requires manager permissions
 */
const deleteProcessResolver: MutationResolvers["deleteProcess"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    await context.services.process.delete(id);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete process: ${error}`);
  }
};

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedCreateProcess = withMiddleware(
  createProcessResolver,
  processCreateMiddleware,
);

const wrappedUpdateProcess = withMiddleware(
  updateProcessResolver,
  processUpdateMiddleware,
);

const wrappedDeleteProcess = withMiddleware(
  deleteProcessResolver,
  processDeleteMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const processMutations: Pick<
  MutationResolvers,
  "createProcess" | "updateProcess" | "deleteProcess"
> = {
  createProcess: wrappedCreateProcess,
  updateProcess: wrappedUpdateProcess,
  deleteProcess: wrappedDeleteProcess,
};

export default processMutations;
