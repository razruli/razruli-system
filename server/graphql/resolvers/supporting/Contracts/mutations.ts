// ═══════════════════════════════════════════════════════════════════════════════
// CONTRACTS MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function createBrokerCarrierContract(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Create contract between broker and carrier
  return null;
}

export async function updateBrokerCarrierContract(
  _: any,
  { id, input }: any,
  context: GraphQLContext,
) {
  // TODO: Update contract terms, rates, volume discounts
  return null;
}

export async function createBrokerRate(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Create lane-specific broker rate
  return null;
}

export async function updateBrokerRate(
  _: any,
  { id, input }: any,
  context: GraphQLContext,
) {
  // TODO: Update lane rate
  return null;
}

export async function createCarrierRate(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Create carrier published rate
  return null;
}

export async function updateCarrierRate(
  _: any,
  { id, input }: any,
  context: GraphQLContext,
) {
  // TODO: Update carrier rate
  return null;
}

export async function createCarrierAccessorial(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Create accessorial charge (detention, fuel surcharge, etc.)
  return null;
}

export async function updateCarrierAccessorial(
  _: any,
  { id, input }: any,
  context: GraphQLContext,
) {
  // TODO: Update accessorial charge
  return null;
}
