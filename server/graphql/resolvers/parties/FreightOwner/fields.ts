// ═══════════════════════════════════════════════════════════════════════════════
// FREIGHT OWNER FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function freights(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query freights by freightOwnerId
  return [];
}

export async function shipments(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query shipments by freightOwnerId
  return [];
}
