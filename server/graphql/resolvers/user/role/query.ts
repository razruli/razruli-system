/**
 * ============================================================================
 * Role Domain - Query Resolvers
 * ============================================================================
 * Queries for role and permission management
 */

import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== RESOLVER FUNCTIONS ====================

/**
 * Get role by ID
 */
const roleResolver: QueryResolvers["role"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.role.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch role: ${error}`);
  }
};

/**
 * List roles with filtering
 */
const rolesResolver: QueryResolvers["roles"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    const { data, total } = await context.services.role.find(filter || {}, {
      offset: pagination?.skip || 0,
      limit: pagination?.take || 20,
      sortBy: pagination?.sortBy || "name",
      sortOrder: pagination?.sortOrder as "asc" | "desc" | undefined,
    });
    return {
      nodes: data,
      totalCount: total,
      pageInfo: {
        total,
        hasMore: total > (pagination?.skip || 0) + (pagination?.take || 20),
        offset: pagination?.skip || 0,
        limit: pagination?.take || 20,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch roles: ${error}`);
  }
};

/**
 * Get all system permissions
 */
const systemPermissionsResolver: QueryResolvers["systemPermissions"] = async (
  _parent,
  _args,
  context,
) => {
  try {
    // Get all system-wide permissions
    return await context.services.permission.getByScope("SYSTEM");
  } catch (error) {
    throw new Error(`Failed to fetch system permissions: ${error}`);
  }
};

export const roleQueries = {
  role: roleResolver,
  roles: rolesResolver,
  systemPermissions: systemPermissionsResolver,
};

export default roleQueries;
