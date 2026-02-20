// ═══════════════════════════════════════════════════════════════════════════════
// PENALTIES RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Rule #7: Cancellation Penalties (Protect Bidders)

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Penalties Resolver
 * Thin routing layer - all logic delegated to PenaltyService
 * Middleware applied via ResolverDependencies
 */
export class PenaltiesResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getCancellationFee
   */
  getCancellationFee = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.penaltiesService.getCancellationFee(args.shipmentId),
  );

  /**
   * Query: listCancellationFees
   */
  listCancellationFees = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.penaltiesService.listCancellationFees(args.skip, args.take),
  );

  /**
   * Query: getPenaltyDistribution
   */
  getPenaltyDistribution = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.penaltiesService.getPenaltyDistribution(args.shipmentId),
  );
}

export default PenaltiesResolver;
