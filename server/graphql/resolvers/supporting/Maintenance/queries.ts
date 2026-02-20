// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getMaintenanceRecord(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load maintenance record
  return null;
}

export async function listMaintenanceHistory(
  _: any,
  { vehicleId, input }: any,
  context: GraphQLContext,
) {
  // TODO: Query maintenance history for vehicle
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
