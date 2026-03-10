/**
 * ============================================================================
 * Role Domain - Field Resolvers
 * ============================================================================
 * Resolvers for nested fields on Role and Permission types
 */

import { RoleResolvers } from "@/server/graphql/types/generated";

// ====================== FIELD RESOLVERS =======================

/**
 * Resolve Role.permissions field
 */
const permissionsResolver: RoleResolvers["permissions"] = async (
  _parent,
  _args,
  context,
) => {
  try {
    // Fetch permissions for this role via service
    return await context.services.role.getPermissions(_parent.id);
  } catch (error) {
    throw new Error(`Failed to resolve permissions: ${error}`);
  }
};

export const roleFieldResolvers = {
  permissions: permissionsResolver,
};

export default roleFieldResolvers;
