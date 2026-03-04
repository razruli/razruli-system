/**
 * Audit logging wrapper for GraphQL mutations
 * Records all state changes for compliance and debugging
 */

import { logger } from "@/server/utils/logger/logger";

import { GraphQLContext } from "../../../context";

/**
 * Higher-order function to wrap resolvers with audit logging
 * Logs: userId, action, resourceId, timestamp
 *

 * ```
 */
export function withAuditLogging(
  resolver: (parent: any, args: any, ctx: GraphQLContext) => Promise<any>,
  action: string,
): (parent: any, args: any, ctx: GraphQLContext) => Promise<any> {
  return async (parent: any, args: any, ctx: GraphQLContext) => {
    const result = await resolver(parent, args, ctx);

    // Log audit trail
    if (ctx.user && result?.id) {
      logger.info(`[AUDIT] ${action}`, {
        userId: ctx.user.id,
        action,
        resourceId: result.id,
        timestamp: new Date().toISOString(),
      });
    }

    return result;
  };
}
