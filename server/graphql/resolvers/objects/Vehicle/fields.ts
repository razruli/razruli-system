// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLE FIELD RESOLVERS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function carrier(parent: any, _: any, context: GraphQLContext) {
  // TODO: Load via carrierLoader
  return null;
}

export async function currentDriver(
  parent: any,
  _: any,
  context: GraphQLContext,
) {
  // TODO: Load via driverLoader
  return null;
}
