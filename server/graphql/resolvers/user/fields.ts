// server/graphql/resolvers/user/fields.ts
import { logger } from "@/server/utils/logger/logger";

import { UsersResultResolvers } from "../../types/generated";

/**
 * User type resolver
 * Resolves individual User fields
 */

/**
 * UsersResult type resolver
 * Resolves paginated user list response
 */
export const usersResultFieldResolvers: UsersResultResolvers = {
  users: (parent) => {
    logger.debug("Resolving UsersResult.users", { count: parent.users.length });
    return parent.users;
  },

  pageInfo: (parent) => {
    logger.debug("Resolving UsersResult.pageInfo", {
      total: parent.pageInfo.total,
      offset: parent.pageInfo.offset,
      limit: parent.pageInfo.limit,
      hasMore: parent.pageInfo.hasMore,
    });
    return parent.pageInfo;
  },
};
