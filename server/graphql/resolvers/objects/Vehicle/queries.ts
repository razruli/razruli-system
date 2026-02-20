// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLE QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getVehicle(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via truckLoader
  return null;
}

export async function listVehicles(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Query with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function listVehiclesByCarrier(
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
