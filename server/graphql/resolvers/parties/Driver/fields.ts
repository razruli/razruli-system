// ═══════════════════════════════════════════════════════════════════════════════
// DRIVER FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function carrier(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load via carrierLoader
  return null;
}
