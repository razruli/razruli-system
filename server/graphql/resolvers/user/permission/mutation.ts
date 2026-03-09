/**
 * ============================================================================
 * Permission Domain - Mutation Resolvers
 * ============================================================================
 * Mutations for permission management (typically admin-only)
 */

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
    return await context.services.permission.create(input);
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
    return await context.services.permission.update(id, input);
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
