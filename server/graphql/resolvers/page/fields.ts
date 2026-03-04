// server/graphql/resolvers/page/fields.ts

import type { PageInfoResolvers } from "@/server/graphql/types/generated";
import { logger } from "@/server/utils/logger/logger";

/**
 * PageInfo resolver
 * Handles pagination metadata for list responses
 */
export const pageInfoResolver: Pick<
  PageInfoResolvers,
  "total" | "hasMore" | "offset" | "limit"
> = {
  total: (parent, _args, _context) => {
    logger.debug("Resolving PageInfo.total", { total: (parent as any).total });
    return (parent as any).total;
  },

  hasMore: (parent, _args, _context) => {
    const offset = parent.offset;
    const limit = parent.limit;
    const total = parent.total;
    const hasMore = offset + limit < total;
    logger.debug("Resolving PageInfo.hasMore", {
      hasMore,
      offset,
      limit,
      total,
    });
    return hasMore;
  },

  offset: (parent, _args, _context) => {
    logger.debug("Resolving PageInfo.offset", {
      offset: parent.offset,
    });
    return parent.offset;
  },

  limit: (parent, _args, _context) => {
    logger.debug("Resolving PageInfo.limit", { limit: parent.limit });
    return parent.limit;
  },
};

export default pageInfoResolver;
