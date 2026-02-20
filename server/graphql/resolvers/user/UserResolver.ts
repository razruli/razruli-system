// ═══════════════════════════════════════════════════════════════════════════════
// USER RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Authentication and user management coordinator

import { GraphQLContext } from "@/server/graphql/context";
import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";

/**
 * User Resolver
 *
 * Handles all user-related queries, mutations, subscriptions, and field resolution
 * User: Individual account in the system
 * Status: ACTIVE | INACTIVE | SUSPENDED
 *
 * Middleware applied via ResolverDependencies
 */
export class UserResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Get current authenticated user (me)
   * Usage: query me { me { ... } }
   */
  me = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.userService.getCurrentUser(ctx.user?.id || ""),
  );

  /**
   * List users with pagination and filtering
   * Usage: query users($input: UsersInput) { users(input: $input) { ... } }
   */
  users = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.userService.listUsers(args.input),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════
  // (No mutations implemented yet)

  // ═════════════════════════════════════════════════════════════
  // SUBSCRIPTIONS
  // ═════════════════════════════════════════════════════════════
  // (No subscriptions implemented yet)
}
