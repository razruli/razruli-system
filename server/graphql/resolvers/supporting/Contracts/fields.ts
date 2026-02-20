// ═══════════════════════════════════════════════════════════════════════════════
// CONTRACTS FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function contract(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load BrokerCarrierContract via contractLoader
  return null;
}

export async function rates(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load BrokerRate[] for contract
  return [];
}
