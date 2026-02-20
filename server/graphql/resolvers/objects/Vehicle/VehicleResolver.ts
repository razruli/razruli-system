// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLE (TRUCK) RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Vehicle Resolver
 * Thin routing layer - all logic delegated to VehicleService
 * Middleware applied via ResolverDependencies
 */
export class VehicleResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getVehicle
   */
  getVehicle = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.vehicleService.getVehicle(args.id, true),
  );

  /**
   * Query: listVehicles
   */
  listVehicles = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.vehicleService.listVehicles(args.skip, args.take),
  );

  /**
   * Query: listVehiclesByCarrier
   */
  listVehiclesByCarrier = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.vehicleService.listVehiclesByCarrier(args.carrierId),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Mutation: createVehicle
   */
  createVehicle = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.vehicleService.createVehicle(args.input),
  );

  /**
   * Mutation: updateVehicle
   */
  updateVehicle = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.vehicleService.updateVehicle(args.id, args.input),
  );

  /**
   * Mutation: updateVehicleStatus
   */
  updateVehicleStatus = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.vehicleService.updateVehicleStatus(args.id, args.status),
  );

  /**
   * Mutation: deleteVehicle
   */
  deleteVehicle = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.vehicleService.deleteVehicle(args.id),
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
   * Field: currentDriver
   */
  currentDriver = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.driverService.getDriver(args.currentDriverId),
  );
}

export default VehicleResolver;
