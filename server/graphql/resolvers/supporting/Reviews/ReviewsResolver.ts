// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Reviews Resolver
 * Thin routing layer - all logic delegated to ReviewService
 * Middleware applied via ResolverDependencies
 */
export class ReviewsResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getReview
   */
  getReview = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.reviewsService.getReview(args.id),
  );

  /**
   * Query: listReviews
   */
  listReviews = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.reviewsService.listReviews(args.skip, args.take),
  );

  /**
   * Query: listReviewsForCarrier
   */
  listReviewsForCarrier = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.reviewsService.listReviewsForCarrier(args.carrierId),
  );

  /**
   * Query: getCarrierAverageRating
   */
  getCarrierAverageRating = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.reviewsService.getCarrierAverageRating(args.carrierId),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Mutation: createReview
   */
  createReview = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.reviewsService.createReviews(args.input),
  );

  /**
   * Mutation: updateReview
   */
  updateReview = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.reviewsService.updateReviews(args.id, args.input),
  );
}

export default ReviewsResolver;
