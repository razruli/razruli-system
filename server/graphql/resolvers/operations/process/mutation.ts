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
    if (!input.title || !input.companyId || !input.departmentId) {
      throw new Error(
        "Missing required fields: title, companyId, departmentId",
      );
    }

    // Create process with input data
    // Note: Enum values from GraphQL are uppercase (STANDARD), normalize to lowercase for Prisma
    const process = await context.services.process.create({
      companyId: input.companyId,
      departmentId: input.departmentId,
      title: input.title,
      description: input.description ?? undefined,
      plannedHours: input.plannedHours,
      complexity: input.complexity
        ? input.complexity.toLowerCase()
        : "standard",
      businessImpact: input.businessImpact
        ? input.businessImpact.toLowerCase()
        : "medium",
      newness: input.newness ? input.newness.toLowerCase() : "routine",
      isBurningOut: input.isBurningOut ?? false,
      targetGradeId: input.targetGradeId,
      status: input.status ? input.status.toLowerCase() : "open",
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
      plannedHours: number;
      complexity: string;
      businessImpact: string;
      newness: string;
      isBurningOut: boolean;
      targetGradeId: number;
    }> = {};

    if (input.title !== undefined && input.title !== oldProcess.title) {
      updateData.title = input.title || oldProcess.title;
    }

    if (
      input.description !== undefined &&
      input.description !== oldProcess.description
    ) {
      updateData.description = input.description ?? undefined;
    }

    if (input.status !== undefined) {
      const normalizedStatus = input.status?.toLowerCase();
      if (normalizedStatus !== oldProcess.status) {
        updateData.status = normalizedStatus;
      }
    }

    if (
      input.plannedHours !== undefined &&
      input.plannedHours !== oldProcess.plannedHours
    ) {
      updateData.plannedHours = input.plannedHours || 0;
    }

    if (input.complexity !== undefined) {
      const normalizedComplexity = input.complexity?.toLowerCase();
      if (normalizedComplexity !== oldProcess.complexity) {
        updateData.complexity = normalizedComplexity;
      }
    }

    if (input.businessImpact !== undefined) {
      const normalizedImpact = input.businessImpact?.toLowerCase();
      if (normalizedImpact !== oldProcess.businessImpact) {
        updateData.businessImpact = normalizedImpact;
      }
    }

    if (input.newness !== undefined) {
      const normalizedNewness = input.newness?.toLowerCase();
      if (normalizedNewness !== oldProcess.newness) {
        updateData.newness = normalizedNewness;
      }
    }

    if (
      input.isBurningOut !== undefined &&
      input.isBurningOut !== oldProcess.isBurningOut
    ) {
      updateData.isBurningOut = input.isBurningOut || false;
    }

    if (
      input.targetGradeId !== undefined &&
      input.targetGradeId !== oldProcess.targetGradeId
    ) {
      updateData.targetGradeId = input.targetGradeId || 3;
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
