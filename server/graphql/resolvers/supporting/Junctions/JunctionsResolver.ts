// ═══════════════════════════════════════════════════════════════════════════════
// JUNCTIONS RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";

/**
 * Junctions Resolver
 * Thin routing layer - all logic delegated to JunctionsService
 * Middleware applied via ResolverDependencies
 */
export class JunctionsResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  getShipmentFreight = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.getShipmentFreight(args.id),
  );

  listShipmentFreights = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.listShipmentFreightsByShipment(
        args.shipmentId,
      ),
  );

  getShipmentStop = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.getShipmentStop(args.id),
  );

  listShipmentStops = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.listShipmentStopsByShipment(
        args.shipmentId,
      ),
  );

  getShipmentLog = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.getShipmentLog(args.id),
  );

  listShipmentLogs = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.listShipmentLogsByShipment(args.shipmentId),
  );

  getShipmentEvent = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.getShipmentEvent(args.id),
  );

  listShipmentEvents = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.listShipmentEventsByShipment(
        args.shipmentId,
      ),
  );

  getShipmentDocument = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.getShipmentDocument(args.id),
  );

  listShipmentDocuments = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.listShipmentDocumentsByShipment(
        args.shipmentId,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  createShipmentFreight = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.createShipmentFreight(args.input),
  );

  updateShipmentFreight = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.updateShipmentFreight(args.id, args.input),
  );

  createShipmentStop = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.createShipmentStop(args.input),
  );

  updateShipmentStop = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.updateShipmentStop(args.id, args.input),
  );

  createShipmentLog = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.createShipmentLog(args.input),
  );

  createShipmentEvent = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.createShipmentEvent(args.input),
  );

  createShipmentDocument = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.createShipmentDocument(args.input),
  );

  updateShipmentDocument = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.junctionsService.updateShipmentDocument(args.id, args.input),
  );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  freight = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.freightService.getFreight(args.freightId),
  );

  warehouse = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.warehouseService.getWarehouse(args.warehouseId),
  );

  shipment = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.getShipment(args.shipmentId),
  );
}

export default JunctionsResolver;
