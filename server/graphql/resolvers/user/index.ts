/**
 * ============================================================================
 * User Domain - Resolver Index
 * ============================================================================
 * Unified resolver composition for user management
 * Handles: Query, Mutation, Subscription and field resolvers
 */

import { usersResultFieldResolvers } from "./fields";
import { userQueryResolvers } from "./query";

/**
 * Complete resolver set for User domain
 */
export const userResolvers = {
  Query: userQueryResolvers,

  Mutation: {
    // User mutations to be implemented as needed
  },

  Subscription: {
    // User subscriptions to be implemented as needed
  },

  UsersResult: usersResultFieldResolvers,
};

export { userQueryResolvers } from "./query";
export { usersResultFieldResolvers } from "./fields";

export default userResolvers;
