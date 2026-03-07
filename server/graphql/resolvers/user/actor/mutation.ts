/**
 * ============================================================================
 * Actor Domain - Mutation Resolvers
 * ============================================================================
 * Mutations for actor management, role assignment, and permissions
 */

import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== RESOLVER FUNCTIONS ====================

/**
 * Create a new actor
 */
const createActorResolver: MutationResolvers["createActor"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    // Use company from auth context if not provided
    const companyId = input.companyId || context.actor?.companyId;
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    const actor = await context.services.actor.create({
      userId: input.userId,
      email: input.email,
      name: input.name,
      companyId,
      departmentId: input.departmentId ?? undefined,
      avatar: input.avatar ?? undefined,
      phone: input.phone ?? undefined,
      bio: input.bio ?? undefined,
    });

    return actor;
  } catch (error) {
    throw new Error(`Failed to create actor: ${error}`);
  }
};

/**
 * Update an actor
 */
const updateActorResolver: MutationResolvers["updateActor"] = async (
  _parent,
  { id, input },
  context,
) => {
  try {
    const actor = await context.services.actor.update(id, {
      name: input.name ?? undefined,
      avatar: input.avatar ?? undefined,
      phone: input.phone ?? undefined,
      bio: input.bio ?? undefined,
      departmentId: input.departmentId ?? undefined,
      status: input.status ?? undefined,
    });

    return actor;
  } catch (error) {
    throw new Error(`Failed to update actor: ${error}`);
  }
};

/**
 * Deactivate an actor
 */
const deactivateActorResolver: MutationResolvers["deactivateActor"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.actor.deactivate(id);
  } catch (error) {
    throw new Error(`Failed to deactivate actor: ${error}`);
  }
};

/**
 * Suspend an actor
 */
const suspendActorResolver: MutationResolvers["suspendActor"] = async (
  _parent,
  { id, reason },
  context,
) => {
  try {
    return await context.services.actor.suspend(id, reason ?? undefined);
  } catch (error) {
    throw new Error(`Failed to suspend actor: ${error}`);
  }
};

/**
 * Assign a role to an actor
 */
const assignActorRoleResolver: MutationResolvers["assignActorRole"] = async (
  _parent,
  { actorId, roleId, reason },
  context,
) => {
  try {
    await context.services.actor.assignRole(
      actorId,
      roleId,
      reason ?? undefined,
    );
    return true;
  } catch (error) {
    throw new Error(`Failed to assign role: ${error}`);
  }
};

/**
 * Remove a role from an actor
 */
const removeActorRoleResolver: MutationResolvers["removeActorRole"] = async (
  _parent,
  { actorId, roleId },
  context,
) => {
  try {
    await context.services.actor.removeRole(actorId, roleId);
    return true;
  } catch (error) {
    throw new Error(`Failed to remove role: ${error}`);
  }
};

/**
 * Grant a permission to an actor
 */
const grantActorPermissionResolver: MutationResolvers["grantActorPermission"] =
  async (_parent, { actorId, permissionId, reason }, context) => {
    try {
      await context.services.actor.grantPermission(
        actorId,
        permissionId,
        reason ?? undefined,
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to grant permission: ${error}`);
    }
  };

/**
 * Deny a permission to an actor
 */
const denyActorPermissionResolver: MutationResolvers["denyActorPermission"] =
  async (_parent, { actorId, permissionId, reason }, context) => {
    try {
      await context.services.actor.denyPermission(
        actorId,
        permissionId,
        reason ?? undefined,
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to deny permission: ${error}`);
    }
  };

/**
 * Revoke a permission from an actor
 */
const revokeActorPermissionResolver: MutationResolvers["revokeActorPermission"] =
  async (_parent, { actorId, permissionId }, context) => {
    try {
      await context.services.actor.revokePermission(actorId, permissionId);
      return true;
    } catch (error) {
      throw new Error(`Failed to revoke permission: ${error}`);
    }
  };

export const actorMutations = {
  createActor: createActorResolver,
  updateActor: updateActorResolver,
  deactivateActor: deactivateActorResolver,
  suspendActor: suspendActorResolver,
  assignActorRole: assignActorRoleResolver,
  removeActorRole: removeActorRoleResolver,
  grantActorPermission: grantActorPermissionResolver,
  denyActorPermission: denyActorPermissionResolver,
  revokeActorPermission: revokeActorPermissionResolver,
};

export default actorMutations;
