// ═══════════════════════════════════════════════════════════════════════════════
// JUNCTIONS FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function freight(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load Freight via freightLoader
  return null;
}

export async function warehouse(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load Warehouse via warehouseLoader (for ShipmentStop)
  return null;
}

export async function shipment(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load Shipment via shipmentLoader
  return null;
}
