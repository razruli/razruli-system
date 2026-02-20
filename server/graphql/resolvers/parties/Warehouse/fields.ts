// ═══════════════════════════════════════════════════════════════════════════════
// WAREHOUSE FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function parent(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load parent organization if applicable
  return null;
}
