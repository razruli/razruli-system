// ═══════════════════════════════════════════════════════════════════════════════
// WAREHOUSE QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getWarehouse(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via warehouseLoader
  return null;
}

export async function listWarehouses(
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

export async function searchWarehouses(
  _: any,
  { location, capacity, input }: any,
  context: GraphQLContext,
) {
  // TODO: Search by location, capacity availability
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
