// ═══════════════════════════════════════════════════════════════════════════════
// CARRIER RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Phase 4-6: Submits bids on shipments + confirms paperwork

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";

/**
 * Carrier Resolver
 * Thin routing layer - all logic delegated to CarrierService
 * Middleware applied via ResolverDependencies
 */
export class CarrierResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getCarrier
   */
  getCarrier = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.carrierService.getCarrier(args.id),
  );

  /**
   * Query: listCarriers
   */
  listCarriers = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.carrierService.searchCarriers(
        args.filters || {},
        args.skip,
        args.take,
      ),
  );

  /**
   * Query: searchCarriers
   */
  searchCarriers = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.carrierService.searchCarriers(
        args.filters,
        args.skip,
        args.take,
      ),
  );

  /**
   * Query: listCarriersByRating
   */
  listCarriersByRating = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.carrierService.listCarriersByRating(
        args.minRating,
        args.skip,
        args.take,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  // /**
  //  * Mutation: createCarrier
  //  */
  // createCarrier = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.carrierService.createCarrier(args.input),
  // );

  // /**
  //  * Mutation: updateCarrier
  //  */
  // updateCarrier = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.carrierService.updateCarrier(args.id, args.input),
  // );

  // /**
  //  * Mutation: updateCarrierRating
  //  */
  // updateCarrierRating = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.carrierService.updateCarrierRating(args.id, args.rating),
  // );

  // /**
  //  * Mutation: submitBid
  //  */
  // submitBid = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.carrierService.submitBid(args.shipmentId, args.input),
  // );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  /**
   * Field: trucks (for Carrier type)
   */
  trucks = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.vehicleService.listVehiclesByCarrier(args.carrierId),
  );

  /**
   * Field: drivers (for Carrier type)
   */
  drivers = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.driverService.listDriversByCarrier(args.carrierId),
  );

  /**
   * Field: shipments (for Carrier type)
   */
  shipments = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.listShipmentsByCarrier(args.carrierId),
  );
}

export default CarrierResolver;
