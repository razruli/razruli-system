/**
 * ============================================================================
 * Role Domain - Mutation Resolvers
 * ============================================================================
 * Mutations for role and permission management
 */

import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== RESOLVER FUNCTIONS ====================

/**
 * Create a new role
 */
const createRoleResolver: MutationResolvers["createRole"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    return await context.services.role.create(input);
  } catch (error) {
    throw new Error(`Failed to create role: ${error}`);
  }
};

/**
 * Update a role
 */
const updateRoleResolver: MutationResolvers["updateRole"] = async (
  _parent,
  { id, input },
  context,
) => {
  try {
    return await context.services.role.update(id, input);
  } catch (error) {
    throw new Error(`Failed to update role: ${error}`);
  }
};

/**
 * Delete a role
 */
const deleteRoleResolver: MutationResolvers["deleteRole"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    await context.services.role.delete(id);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete role: ${error}`);
  }
};

/**
 * Assign permission to role
 */
const assignRolePermissionResolver: MutationResolvers["assignRolePermission"] =
  async (_parent, { roleId, permissionId }, context) => {
    try {
      return await context.services.role.addPermission(roleId, permissionId);
    } catch (error) {
      throw new Error(`Failed to assign permission: ${error}`);
    }
  };

/**
 * Remove permission from role
 */
const removeRolePermissionResolver: MutationResolvers["removeRolePermission"] =
  async (_parent, { roleId, permissionId }, context) => {
    try {
      await context.services.role.removePermission(roleId, permissionId);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove permission: ${error}`);
    }
  };

export const roleMutations = {
  createRole: createRoleResolver,
  updateRole: updateRoleResolver,
  deleteRole: deleteRoleResolver,
  assignRolePermission: assignRolePermissionResolver,
  removeRolePermission: removeRolePermissionResolver,
};

export default roleMutations;
