// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLE MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function createVehicle(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Implement
  return null;
}

export async function updateVehicle(
  _: any,
  { id, input }: any,
  context: GraphQLContext,
) {
  // TODO: Implement
  return null;
}

export async function updateVehicleStatus(
  _: any,
  { id, status }: any,
  context: GraphQLContext,
) {
  // TODO: Update status (AVAILABLE, IN_MAINTENANCE, IN_TRANSIT, OUT_OF_SERVICE)
  return null;
}

export async function deleteVehicle(
  _: any,
  { id }: any,
  context: GraphQLContext,
) {
  // TODO: Soft delete
  return null;
}
