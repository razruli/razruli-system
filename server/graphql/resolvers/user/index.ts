/**
 * ============================================================================
 * User Domain - Resolver Index
 * ============================================================================
 * Unified resolver composition for user management
 * Handles: Query, Mutation, Subscription and field resolvers
 */

import { usersResultFieldResolvers } from "./fields";
import { userQueryResolvers } from "./query";
import { actorResolvers } from "./actor";
import { roleResolvers } from "./role";
import { permissionResolvers } from "./permission";

/**
 * Complete resolver set for User domain
 */
export const userResolvers = {
  Query: {
    ...userQueryResolvers,
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

export { userQueryResolvers } from "./query";
export { usersResultFieldResolvers } from "./fields";
export { actorResolvers } from "./actor";
export { roleResolvers } from "./role";
export { permissionResolvers } from "./permission";

export default userResolvers;
