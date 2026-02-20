// ═══════════════════════════════════════════════════════════════════════════════
// BROKER QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getBroker(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via brokerLoader
  return null;
}

export async function listBrokers(
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

export async function searchBrokers(
  _: any,
  { specializations, rating, input }: any,
  context: GraphQLContext,
) {
  // TODO: Search by specializations, rating
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
