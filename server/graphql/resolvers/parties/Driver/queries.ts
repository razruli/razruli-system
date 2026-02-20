// ═══════════════════════════════════════════════════════════════════════════════
// DRIVER QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getDriver(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via driverLoader
  return null;
}

export async function listDrivers(
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

export async function listDriversByCarrier(
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
