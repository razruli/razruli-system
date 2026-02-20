// ═══════════════════════════════════════════════════════════════════════════════
// JUNCTIONS QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getShipmentFreight(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via shipmentFreightLoader
  return null;
}

export async function listShipmentFreights(
  _: any,
  { shipmentId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List freights for shipment with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getShipmentStop(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via stopLoader
  return null;
}

export async function listShipmentStops(
  _: any,
  { shipmentId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List stops for shipment ordered by sequence
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getShipmentLog(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load shipment log entry
  return null;
}

export async function listShipmentLogs(
  _: any,
  { shipmentId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List logs for shipment with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getShipmentEvent(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load event
  return null;
}

export async function listShipmentEvents(
  _: any,
  { shipmentId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List events for shipment with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getShipmentDocument(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load document
  return null;
}

export async function listShipmentDocuments(
  _: any,
  { shipmentId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List documents for shipment with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
