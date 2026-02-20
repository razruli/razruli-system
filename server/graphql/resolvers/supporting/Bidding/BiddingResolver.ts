// ═══════════════════════════════════════════════════════════════════════════════
// BIDDING RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Rule #4: Bid Rules Auto-Validation
// Rule #5: Decision Deadline

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";

/**
 * Bidding Resolver
 * Thin routing layer - all logic delegated to BiddingService
 * Middleware applied via ResolverDependencies
 */
export class BiddingResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getBid
   */
  getBid = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.biddingService.getBid(args.id),
  );

  /**
   * Query: listBids
   */
  listBids = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.biddingService.listBids(args.skip, args.take),
  );

  /**
   * Query: listBidsForShipment
   */
  listBidsForShipment = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.listBidsForShipment(args.shipmentId),
  );

  /**
   * Query: listBidsForCarrier
   */
  listBidsForCarrier = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.listBidsForCarrier(args.carrierId),
  );

  /**
   * Query: getBidRules
   */
  getBidRules = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.biddingService.getBidRules(args.shipmentId),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Mutation: createBid
   */
  createBid = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.createBid(args.input),
  );

  /**
   * Mutation: updateBid
   */
  updateBid = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.updateBid(args.id, args.input),
  );

  /**
   * Mutation: rejectBid
   */
  rejectBid = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.rejectBid(args.id),
  );

  /**
   * Mutation: createBidRule
   */
  createBidRule = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.createBidRule(args.input),
  );

  /**
   * Mutation: updateBidRule
   */
  updateBidRule = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.updateBidRule(args.id, args.input),
  );

  /**
   * Mutation: deleteBidRule
   */
  deleteBidRule = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.deleteBidRule(args.id),
  );

  /**
   * Mutation: overrideBidRuleCompliance
   */
  overrideBidRuleCompliance = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.overrideBidRuleCompliance(
        args.bidId,
        args.reason,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // SUBSCRIPTIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Subscription: newBidReceived
   */
  newBidReceived = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.biddingService.subscribeToNewBid(args.shipmentId),
  );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  /**
   * Field: carrier
   */
  carrier = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.carrierService.getCarrier(args.carrierId),
  );

  /**
   * Field: shipment
   */
  shipment = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.getShipment(args.shipmentId),
  );
}

export default BiddingResolver;
