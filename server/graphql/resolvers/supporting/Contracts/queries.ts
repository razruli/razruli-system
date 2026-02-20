// ═══════════════════════════════════════════════════════════════════════════════
// CONTRACTS QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getBrokerCarrierContract(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load via contractLoader
  return null;
}

export async function listBrokerCarrierContracts(
  _: any,
  { brokerId, carrierId, input }: any,
  context: GraphQLContext,
) {
  // TODO: Query contracts with optional brokerId/carrierId filtering
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getBrokerRate(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load broker rate
  return null;
}

export async function listBrokerRates(
  _: any,
  { contractId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List rates for contract with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getCarrierRate(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load carrier rate
  return null;
}

export async function listCarrierRates(
  _: any,
  { carrierId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List carrier rates with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function getCarrierAccessorial(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load carrier accessorial charge
  return null;
}

export async function listCarrierAccessorials(
  _: any,
  { carrierId, input }: any,
  context: GraphQLContext,
) {
  // TODO: List accessorial charges with pagination
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
