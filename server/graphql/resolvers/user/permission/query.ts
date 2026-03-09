/**
 * ============================================================================
 * Permission Domain - Query Resolvers
 * ============================================================================
 * Query operations for permissions
 */

import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== RESOLVER FUNCTIONS ====================

/**
 * Get a specific permission by ID
 */
const permissionResolver: QueryResolvers["permission"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.permission.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch permission: ${error}`);
  }
};

/**
 * List permissions with filtering and pagination
 */
const permissionsResolver: QueryResolvers["permissions"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    const { data, total } = await context.services.permission.find(
      filter || {},
      {
        offset: pagination?.skip || 0,
        limit: pagination?.take || 20,
        sortBy: pagination?.sortBy || "name",
        sortOrder: pagination?.sortOrder || "asc",
      },
    );
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
    throw new Error(`Failed to fetch permissions: ${error}`);
  }
};

export const permissionQueries = {
  permission: permissionResolver,
  permissions: permissionsResolver,
};

export default permissionQueries;
