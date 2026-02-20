// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function createReview(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Create review, update carrier rating
  return null;
}

export async function updateReview(
  _: any,
  { id, input }: any,
  context: GraphQLContext,
) {
  // TODO: Update review if allowed, recalculate carrier rating
  return null;
}
