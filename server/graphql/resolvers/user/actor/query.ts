/**
 * ============================================================================
 * Actor Domain - Query Resolvers
 * ============================================================================
 * Queries for actor management and authorization
 */

import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== RESOLVER FUNCTIONS ====================

/**
 * Get actor by ID
 */
const actorResolver: QueryResolvers["actor"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.actor.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch actor: ${error}`);
  }
};

/**
 * Get current authenticated actor
 */
const myActorResolver: QueryResolvers["myActor"] = async (
  _parent,
  _args,
  context,
) => {
  try {
    if (!context.user?.id) {
      return null;
    }
    return await context.services.actor.getByUserId(context.user.id);
  } catch (error) {
    throw new Error(`Failed to fetch current actor: ${error}`);
  }
};

/**
 * List actors with filtering and pagination
 */
const actorsResolver: QueryResolvers["actors"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // For now, return all actors from company
    // TODO: Implement full filtering and pagination
    if (filter?.companyId) {
      const actors = await context.services.actor.getByCompanyId(
        filter.companyId,
      );
      return {
        nodes: actors,
        totalCount: actors.length,
        pageInfo: {
          total: actors.length,
          hasMore: false,
          offset: 0,
          limit: pagination?.take || 20,
        },
      };
    }

    return {
      nodes: [],
      totalCount: 0,
      pageInfo: {
        total: 0,
        hasMore: false,
        offset: 0,
        limit: pagination?.take || 20,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch actors: ${error}`);
  }
};

/**
 * Get actors in a company
 */
const companyActorsResolver: QueryResolvers["companyActors"] = async (
  _parent,
  { companyId, pagination },
  context,
) => {
  try {
    const actors = await context.services.actor.getByCompanyId(companyId);
    return {
      nodes: actors,
      totalCount: actors.length,
      pageInfo: {
        total: actors.length,
        hasMore: false,
        offset: 0,
        limit: pagination?.take || 20,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch company actors: ${error}`);
  }
};

/**
 * Get actors in a department
 */
const departmentActorsResolver: QueryResolvers["departmentActors"] = async (
  _parent,
  { departmentId, pagination },
  context,
) => {
  try {
    const actors = await context.services.actor.getByDepartmentId(departmentId);
    return {
      nodes: actors,
      totalCount: actors.length,
      pageInfo: {
        total: actors.length,
        hasMore: false,
        offset: 0,
        limit: pagination?.take || 20,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch department actors: ${error}`);
  }
};

export const actorQueries = {
  actor: actorResolver,
  myActor: myActorResolver,
  actors: actorsResolver,
  companyActors: companyActorsResolver,
  departmentActors: departmentActorsResolver,
};

export default actorQueries;
