// ═══════════════════════════════════════════════════════════════════════════════
// CARRIER FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function trucks(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query trucks by carrierId
  return [];
}

export async function drivers(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query drivers by carrierId
  return [];
}

export async function shipments(parent: any, _: any, context: GraphQLContext) {
  // TODO: Query shipments by carrierId (assigned carriers)
  return [];
}
