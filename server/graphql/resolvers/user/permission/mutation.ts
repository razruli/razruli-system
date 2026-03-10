/**
 * ============================================================================
 * Permission Domain - Mutation Resolvers
 * ============================================================================
 * Mutations for permission management (typically admin-only)
 */

import type { PermissionScope as PrismaPermissionScope } from "@/server/db/generated/prisma/client";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== RESOLVER FUNCTIONS ====================

/**
 * Create a new permission
 */
const createPermissionResolver: MutationResolvers["createPermission"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    // Convert nullable fields to undefined and ensure all required fields are present
    const cleanInput = {
      name: input.name,
      slug: input.slug,
      resource: input.resource,
      action: input.action,
      scope: input.scope as PrismaPermissionScope,
      description: input.description ?? undefined,
    };
    return await context.services.permission.create(cleanInput);
  } catch (error) {
    throw new Error(`Failed to create permission: ${error}`);
  }
};

/**
 * Update a permission
 */
const updatePermissionResolver: MutationResolvers["updatePermission"] = async (
  _parent,
  { id, input },
  context,
) => {
  try {
    // Convert nullable fields to undefined and ensure all updatable fields are present
    const cleanInput = {
      name: input.name ?? undefined,
      slug: input.slug ?? undefined,
      description: input.description ?? undefined,
      resource: input.resource ?? undefined,
      action: input.action ?? undefined,
    };
    return await context.services.permission.update(id, cleanInput);
  } catch (error) {
    throw new Error(`Failed to update permission: ${error}`);
  }
};

/**
 * Delete a permission
 */
const deletePermissionResolver: MutationResolvers["deletePermission"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    await context.services.permission.delete(id);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete permission: ${error}`);
  }
};

export const permissionMutations = {
  createPermission: createPermissionResolver,
  updatePermission: updatePermissionResolver,
  deletePermission: deletePermissionResolver,
};

export default permissionMutations;
