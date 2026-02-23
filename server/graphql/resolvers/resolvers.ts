import type { Resolvers } from "../types/generated";

// Field resolvers (type definitions)

import { scalarResolvers } from "./_scalarResolvers";
import { typeResolvers } from "./_typeResolvers";
import * as objectsResolvers from "./objects";
import * as partiesResolvers from "./parties";
import * as supportingResolvers from "./supporting";

/**
 * Unified resolver composition
 * Merges Query, Mutation, Subscription, and type field resolvers
 */
export const resolvers: Resolvers = {
  // ========== QUERY ROOT ==========
  ...partiesResolvers,
  ...objectsResolvers,
  ...supportingResolvers,
  // ========== TYPE FIELD RESOLVERS (spread from features) ==========
  ...typeResolvers,
  // Scalar resolvers
  ...scalarResolvers,
} as Resolvers;
