// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getReview(
  _: any,
  { id }: { id: string },
  context: GraphQLContext,
) {
  // TODO: Load review
  return null;
}

export async function listReviews(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Query all reviews
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

export async function listReviewsForCarrier(
  _: any,
  { carrierId, input }: any,
  context: GraphQLContext,
) {
  // TODO: Query reviews for carrier
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}

/**
 * Rule #10: Visible Assignment - rating visible to all
 */
export async function getCarrierAverageRating(
  _: any,
  { carrierId }: any,
  context: GraphQLContext,
) {
  // TODO: Calculate average rating + review count
  return null;
}
