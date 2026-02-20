// ═══════════════════════════════════════════════════════════════════════════════
// FREIGHT OWNER RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Phase 1: Creates freight and post specs

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Freight Owner Resolver
 * Thin routing layer - all logic delegated to FreightOwnerService
 * Middleware applied via ResolverDependencies
 */
export class FreightOwnerResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getFreightOwner
   */
  getFreightOwner = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightOwnerService.getFreightOwner(args.id),
  );

  /**
   * Query: listFreightOwners
   */
  listFreightOwners = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightOwnerService.listFreightOwners(args.skip, args.take),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  // /**
  //  * Mutation: createFreightOwner
  //  */
  // createFreightOwner = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.freightOwnerService.createFreightOwner(args.input),
  // );

  // /**
  //  * Mutation: updateFreightOwner
  //  */
  // updateFreightOwner = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.freightOwnerService.updateFreightOwner(args.id, args.input),
  // );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  /**
   * Field: freights
   */
  freights = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.freightService.listFreightsByOwner(args.ownerId),
  );

  /**
   * Field: shipments
   */
  shipments = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.listShipmentsByOwner(args.ownerId),
  );
}

export default FreightOwnerResolver;
