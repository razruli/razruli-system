// ═══════════════════════════════════════════════════════════════════════════════
// BROKER FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function shipments(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query shipments by brokerId
  return [];
}
