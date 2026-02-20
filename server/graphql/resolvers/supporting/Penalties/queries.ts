// ═══════════════════════════════════════════════════════════════════════════════
// PENALTIES QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

/**
 * Rule #7: Get cancellation fee for shipment
 * POSTED: $0
 * BIDDING_OPEN: 5% fee
 * BID_SELECTED: 10% fee (to selected bidder, 5% to others)
 */
export async function getCancellationFee(
  _: any,
  { shipmentId }: any,
  context: GraphQLContext,
) {
  // TODO: Calculate fee based on current status
  return null;
}

export async function listCancellationFees(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Query all cancellation fees
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

/**
 * Get penalty distribution breakdown
 * Shows each bidder's compensation if cancelled
 */
export async function getPenaltyDistribution(
  _: any,
  { shipmentId }: any,
  context: GraphQLContext,
) {
  // TODO: Calculate and return distribution
  // - Per-bidder share
  // - Double for selected bidder
  return null;
}
