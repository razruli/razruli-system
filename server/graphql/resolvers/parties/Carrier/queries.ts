// ═══════════════════════════════════════════════════════════════════════════════
// CARRIER QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getCarrier(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via carrierLoader
  return null;
}

export async function listCarriers(
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

export async function searchCarriers(
  _: any,
  { specializations, capacity, rating, input }: any,
  context: GraphQLContext,
) {
  // TODO: Search by specializations, fleet capacity, rating
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function listCarriersByRating(
  _: any,
  { minRating, input }: any,
  context: GraphQLContext,
) {
  // TODO: Filter by rating >= minRating, sorted by rating DESC
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
