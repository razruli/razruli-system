/**
 * ============================================================================
 * User Domain - Resolver Index
 * ============================================================================
 * Unified resolver composition for user management
 * Handles: Query, Mutation, Subscription and field resolvers
 */

import { actorResolvers } from "./actor";
import { usersResultFieldResolvers } from "./fields";
import { permissionResolvers } from "./permission";
import { userQueries } from "./query";
import { roleResolvers } from "./role";

/**
 * Complete resolver set for User domain
 */
export const userResolvers = {
  Query: {
    ...userQueries,
    ...actorResolvers.Query,
    ...roleResolvers.Query,
    ...permissionResolvers.Query,
  },

  Mutation: {
    // User mutations to be implemented as needed
    ...actorResolvers.Mutation,
    ...roleResolvers.Mutation,
    ...permissionResolvers.Mutation,
  },

  Subscription: {
    // User subscriptions to be implemented as needed
  },

  UsersResult: usersResultFieldResolvers,
  Actor: actorResolvers.Actor,
  Role: roleResolvers.Role,
};

export { userQueries } from "./query";
export { usersResultFieldResolvers } from "./fields";
export { actorResolvers } from "./actor";
export { roleResolvers } from "./role";
export { permissionResolvers } from "./permission";

export default userResolvers;
