// ═══════════════════════════════════════════════════════════════════════════════
// BIDDING SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function* newBidReceived(
  _: any,
  { shipmentId }: { shipmentId: string },
  context: GraphQLContext,
) {
  // TODO: Implement via PubSub
  // - Listen for new bids on shipment
  // - Yield bid with carrier info + compliance status
  yield null;
}
