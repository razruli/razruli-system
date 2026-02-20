// ═══════════════════════════════════════════════════════════════════════════════
// SHIPMENT FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function freightOwner(
  parent: any,
  _: any,
  context: GraphQLContext,
) {
  // TODO: Load via freightOwnerLoader
  return null;
}

export async function broker(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load via brokerLoader
  return null;
}

export async function carrier(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load via carrierLoader
  return null;
}

export async function driver(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load via driverLoader
  return null;
}

export async function truck(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load via truckLoader
  return null;
}

export async function originWarehouse(
  parent: any,
  _: any,
  context: GraphQLContext,
) {
  // TODO: Load via warehouseLoader
  return null;
}

export async function destinationWarehouse(
  parent: any,
  _: any,
  context: GraphQLContext,
) {
  // TODO: Load via warehouseLoader
  return null;
}

export async function bids(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query ShipmentBid relations
  return [];
}

export async function freights(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query ShipmentFreight junction
  return [];
}

export async function events(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query ShipmentEvent relations
  return [];
}
