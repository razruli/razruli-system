// server/graphql/resolvers/user/queries.ts
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

// export const users: QueryResolvers["users"] = async (_parent, args, ctx) => {
//   try {
//     const input = args.input;

//     if (!input || typeof input !== "object") {
//       throw new ValidationError("Invalid input parameters");
//     }

//     const {
//       limit,
//       offset,
//       sortBy,
//       sortOrder = "asc",
//       search,
//       status,
//       emailVerified,
//       createdBefore,
//       createdAfter,
//     } = input;

//     if (Number(limit) < 1 || Number(offset) < 0) {
//       throw new ValidationError(
//         "Limit must be positive and offset must be non-negative",
//       );
//     }

//     if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
//       throw new ValidationError("sortOrder must be 'asc' or 'desc'");
//     }

//     const MAX_LIMIT = 100;
//     const safeLimit = Math.min(Number(limit), MAX_LIMIT);

//     const result = await ctx.services.user.listUsers({
//       limit: safeLimit,
//       sortOrder: sortOrder as "asc" | "desc",
//       ...stripNulls({
//         offset,
//         sortBy,
//         search,
//         status,
//         emailVerified,
//         createdBefore,
//         createdAfter,
//       }),
//     });

//     return {
//       users: result.items,
//       pageInfo: {
//         total: result.total ?? 0,
//         offset: Number(offset ?? 0),
//         limit: safeLimit,
//         hasMore: result.hasMore ?? false,
//       },
//     };
//   } catch (error) {
//     logger.error("Error in users resolver", error);
//     throw handleError(error);
//   }
// };

export const userQueryResolvers: Partial<QueryResolvers> = {
  me,
  // users,
};
