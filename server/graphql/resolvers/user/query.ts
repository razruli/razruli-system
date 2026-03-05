// server/graphql/resolvers/user/queries.ts
import { stripNulls } from "@/server/utils/cleaners/cleaners";
import { handleError } from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

import { QueryResolvers } from "../../types/generated";

export const me: QueryResolvers["me"] = async (
  _parent,
  _args,
  ctx,
): Promise<any> => {
  try {
    if (!ctx.user) {
      logger.warn("me query called without authentication");
      return null;
    }

    logger.info("me query called", { userId: ctx.user.id });
    const user = await ctx.services.user.getCurrentUser(ctx.user.id);
    return user;
  } catch (error) {
    logger.error("Error in me resolver", error);
    throw handleError(error);
  }
};

export const users: QueryResolvers["users"] = async (_parent, args, ctx) => {
  try {
    const input = args.input;

    if (!input || typeof input !== "object") {
      throw new Error("Invalid input parameters");
    }

    const {
      limit,
      offset,
      sortBy,
      sortOrder = "asc",
      search,
      status,
      emailVerified,
      createdBefore,
      createdAfter,
    } = input;

    if (Number(limit) < 1 || Number(offset) < 0) {
      throw new Error("Limit must be positive and offset must be non-negative");
    }

    if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
      throw new Error("sortOrder must be 'asc' or 'desc'");
    }

    const MAX_LIMIT = 100;
    const safeLimit = Math.min(Number(limit), MAX_LIMIT);

    const result = await ctx.services.user.listUsers({
      limit: safeLimit,
      offset: Number(offset) || 0,
      sortOrder: sortOrder as "asc" | "desc",
      ...stripNulls({
        sortBy,
        search,
        status,
        emailVerified,
        createdBefore,
        createdAfter,
      }),
    });

    return {
      users: result.items,
      pageInfo: {
        total: result.total ?? 0,
        offset: Number(offset ?? 0),
        limit: safeLimit,
        hasMore: result.hasMore ?? false,
      },
    };
  } catch (error) {
    logger.error("Error in users resolver", error);
    throw handleError(error);
  }
};

export const userActivitySummary: QueryResolvers["userActivitySummary"] =
  async (_parent, { userId, dateRange }, ctx) => {
    try {
      const user = await ctx.services.user.getCurrentUser(userId);
      if (!user) throw new Error("User not found");

      // Placeholder implementation - returns basic structure
      return {
        user,
        from: new Date(dateRange.from),
        to: new Date(dateRange.to),
        loginCount: 0,
        activityCount: 0,
        lastActive: null,
        actions: [],
      };
    } catch (error) {
      logger.error("Error in userActivitySummary resolver", error);
      throw handleError(error);
    }
  };

export const userQueryResolvers: Partial<QueryResolvers> = {
  me,
  users,
  userActivitySummary,
};
