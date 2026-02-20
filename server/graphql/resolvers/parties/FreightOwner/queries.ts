// ═══════════════════════════════════════════════════════════════════════════════
// FREIGHT OWNER QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getFreightOwner(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via freightOwnerLoader
  return null;
}

export async function listFreightOwners(
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
