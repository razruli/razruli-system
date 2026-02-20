// server/graphql/resolvers/user/pageInfo.ts

import { logger } from "@/server/utils/logger/logger";

import { PageInfoResolvers } from "../../../types/generated";

/**
 * PageInfo resolver
 * Handles pagination metadata for list responses
 */
export const pageInfoResolver: PageInfoResolvers = {
  total: (parent) => {
    logger.debug("Resolving PageInfo.total", { total: parent.total });
    return parent.total;
  },

  hasMore: (parent) => {
    const hasMore = parent.offset + parent.limit < parent.total;
    logger.debug("Resolving PageInfo.hasMore", {
      hasMore,
      offset: parent.offset,
      limit: parent.limit,
      total: parent.total,
    });
    return hasMore;
  },

  offset: (parent) => {
    logger.debug("Resolving PageInfo.offset", { offset: parent.offset });
    return parent.offset;
  },

  limit: (parent) => {
    logger.debug("Resolving PageInfo.limit", { limit: parent.limit });
    return parent.limit;
  },
};
