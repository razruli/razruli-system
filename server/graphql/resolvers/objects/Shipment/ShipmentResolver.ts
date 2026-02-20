// ═══════════════════════════════════════════════════════════════════════════════
// SHIPMENT RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Main orchestrator coordinating freight movement and bidding
// Phases 2-11: Broker creates, opens bidding, selects carrier/warehouse, executes

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Shipment Resolver
 *
 * Orchestrates freight movement with bidding, carrier selection, and tracking
 * Phases: DRAFT → POSTED → BIDDING_OPEN → BIDS_RECEIVED → BID_SELECTED → ASSIGNED → IN_TRANSIT → DELIVERED → COMPLETED
 *
 * Middleware applied via ResolverDependencies
 */
export class ShipmentResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  getShipment = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.getShipment(args.id),
  );

  listShipments = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.listShipments(args.skip, args.take),
  );

  getShipmentByNumber = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.getShipmentByNumber(args.number),
  );

  listShipmentsByBroker = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.listShipmentsByBroker(
        args.brokerId,
        args.skip,
        args.take,
      ),
  );

  listShipmentsByCarrier = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.listShipmentsByCarrier(
        args.carrierId,
        args.skip,
        args.take,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Phase 2: Broker creates shipment from freight
   * Rule #1: Real Loads Only - freight must exist
   */
  createShipment = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.createShipment(args.input),
  );

  /**
   * Phase 3: Open bidding, lock margin (Rule #3: Upfront Margin)
   */
  openBidding = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.openBidding(
        args.shipmentId,
        args.brokerMarginPercent,
      ),
  );

  /**
   * Phase 6: Accept bid (Rule #5: Decision Deadline)
   */
  acceptBid = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.acceptBid(args.shipmentId, args.bidId),
  );

  /**
   * Cancel shipment with penalty (Rule #7: Cancellation Penalties)
   */
  cancelShipment = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.cancelShipment(args.shipmentId),
  );

  updateShipment = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.updateShipment(args.id, args.input),
  );

  // ═════════════════════════════════════════════════════════════
  // SUBSCRIPTIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Real-time updates on shipment status changes
   */
  shipmentStatusChanged = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.shipmentService.subscribeToShipmentStatus(args.shipmentId),
  );

  /**
   * Real-time bid received
   */
  bidReceived = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.subscribeToBidReceived(args.shipmentId),
  );

  /**
   * Real-time bid accepted
   */
  bidAccepted = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.shipmentService.subscribeToBidAccepted(args.shipmentId),
  );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  freightOwner = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightOwnerService.getFreightOwner(args.ownerId),
  );

  broker = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.brokerService.getBroker(args.brokerId),
  );

  carrier = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.carrierService.getCarrier(args.carrierId),
  );

  driver = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.driverService.getDriver(args.driverId),
  );

  truck = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.vehicleService.getVehicle(args.vehicleId),
  );

  originWarehouse = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.warehouseService.getWarehouse(args.originWarehouseId),
  );

  destinationWarehouse = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.warehouseService.getWarehouse(args.destinationWarehouseId),
  );

  bids = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.biddingService.listBidsForShipment(args.shipmentId),
  );

  events = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.junctionsService.listShipmentEventsByShipment(args.shipmentId),
  );
}

export default ShipmentResolver;
