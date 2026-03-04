/**
 * ============================================================================
 * ANALYTICS DOMAIN - Resolver Index
 * ============================================================================
 * Unified resolver composition for analytics and capacity management:
 * - GapAnalysis: Gap analysis and hiring needs
 * - LoadSnapshot: Employee workload snapshots and capacity tracking
 *
 * Exports all resolvers for use in main resolver composition layer
 */

import { gapAnalysisResolvers } from "./gapAnalysis";
import { loadSnapshotResolvers } from "./loadSnapshot";

/**
 * Complete resolver set for Analytics domain
 * Merges all entity resolvers together
 */
export const analyticsResolvers = {
  // Query resolvers from all entities
  Query: {
    ...gapAnalysisResolvers.Query,
    ...loadSnapshotResolvers.Query,
  },

  // Mutation resolvers from all entities
  Mutation: {
    ...gapAnalysisResolvers.Mutation,
    ...loadSnapshotResolvers.Mutation,
  },

  // Subscription resolvers from all entities
  Subscription: {
    ...gapAnalysisResolvers.Subscription,
    ...loadSnapshotResolvers.Subscription,
  },

  // Type field resolvers
  GapAnalysis: gapAnalysisResolvers.GapAnalysis,
  LoadSnapshot: loadSnapshotResolvers.LoadSnapshot,
};

// Export individual entities for selective imports
export { gapAnalysisResolvers } from "./gapAnalysis";
export { loadSnapshotResolvers } from "./loadSnapshot";

export default analyticsResolvers;
