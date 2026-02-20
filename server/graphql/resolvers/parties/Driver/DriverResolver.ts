// ═══════════════════════════════════════════════════════════════════════════════
// DRIVER RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Driver Resolver
 * Thin routing layer - all logic delegated to DriverService
 * Middleware applied via ResolverDependencies
 */
export class DriverResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getDriver
   */
  getDriver = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.driverService.getDriver(args.id),
  );

  /**
   * Query: listDrivers
   */
  listDrivers = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.driverService.listDrivers(args.skip, args.take),
  );

  /**
   * Query: listDriversByCarrier
   */
  listDriversByCarrier = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.driverService.listDriversByCarrier(args.carrierId),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  // /**
  //  * Mutation: createDriver
  //  */
  // createDriver = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.driverService.createDriver(args.input),
  // );

  // /**
  //  * Mutation: updateDriver
  //  */
  // updateDriver = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.driverService.updateDriver(args.id, args.input),
  // );

  // /**
  //  * Mutation: updateDriverStatus
  //  */
  // updateDriverStatus = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.driverService.updateDriverStatus(args.id, args.status),
  // );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  /**
   * Field: carrier
   */
  carrier = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.carrierService.getCarrier(args.carrierId),
  );
}

export default DriverResolver;
