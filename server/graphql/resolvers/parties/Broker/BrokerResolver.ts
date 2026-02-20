// ═══════════════════════════════════════════════════════════════════════════════
// BROKER RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Phase 2-11: Creates shipments, opens bidding, selects carriers, manages settlement

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";

/**
 * Broker Resolver
 * Thin routing layer - all logic delegated to BrokerService
 * Middleware applied via ResolverDependencies
 */
export class BrokerResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getBroker
   * Calls service which decides batching internally
   */
  getBroker = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.brokerService.getBroker(args.id, true),
  );

  /**
   * Query: listBrokers
   */
  listBrokers = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.brokerService.searchBrokers(
      args.filters || {},
      args.skip,
      args.take,
    ),
  );

  /**
   * Query: searchBrokers
   */
  searchBrokers = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.brokerService.searchBrokers(
        args.filters,
        args.skip,
        args.take,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Mutation: createBroker
   */
  // createBroker = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.brokerService.createBroker(args.input),
  // );

  // /**
  //  * Mutation: updateBroker
  //  */
  // updateBroker = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.brokerService.updateBroker(args.id, args.input),
  // );
}

export default BrokerResolver;
