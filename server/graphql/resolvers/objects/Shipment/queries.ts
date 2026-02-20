// ═══════════════════════════════════════════════════════════════════════════════
// SHIPMENT QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getShipment(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via shipmentLoader
  return null;
}

export async function listShipments(
  _: any,
  { input }: { input: { limit: number; offset: number } },
  context: GraphQLContext,
) {
  // TODO: Query shipments with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getShipmentByNumber(
  _: any,
  { number }: { number: string },
  context: GraphQLContext,
) {
  // TODO: Query by shipmentNumber
  return null;
}

export async function listShipmentsByBroker(
  _: any,
  { brokerId, input }: any,
  context: GraphQLContext,
) {
  // TODO: Filter by brokerId
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function listShipmentsByCarrier(
  _: any,
  { carrierId, input }: any,
  context: GraphQLContext,
) {
  // TODO: Filter by carrierId
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
