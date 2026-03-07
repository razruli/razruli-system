/**
 * ============================================================================
 * User Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";
import { stripNulls } from "@/server/utils/cleaners/cleaners";
import { handleError } from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for user queries

/** Require authentication + user:read permission */
const userReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["user:read"] },
);

/** Require authentication (no permissions needed for self) */
const userSelfMiddleware = composeMiddleware({ requireAuth: true });

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get the currently authenticated user
 * Returns null if not authenticated
 */
const meResolver: QueryResolvers["me"] = async (
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

/**
 * List users with filtering and pagination
 * Supports searching, sorting, and filtering by status, email verification status, and creation date
 */
const usersResolver: QueryResolvers["users"] = async (
  _parent,
  { input },
  ctx,
): Promise<any> => {
  try {
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

/**
 * Get user activity summary for a specific date range
 */
const userActivitySummaryResolver: QueryResolvers["userActivitySummary"] =
  async (_parent, { userId, dateRange }, ctx): Promise<any> => {
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
        actions: [] as any[],
      };
    } catch (error) {
      logger.error("Error in userActivitySummary resolver", error);
      throw handleError(error);
    }
  };

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedMe = withMiddleware(meResolver, userSelfMiddleware);

const wrappedUsers = withMiddleware(usersResolver, userReadMiddleware);

const wrappedUserActivitySummary = withMiddleware(
  userActivitySummaryResolver,
  userReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const userQueries: Pick<
  QueryResolvers,
  "me" | "users" | "userActivitySummary"
> = {
  me: wrappedMe,
  users: wrappedUsers,
  userActivitySummary: wrappedUserActivitySummary,
};

export default userQueries;
