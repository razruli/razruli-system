/**
 * ============================================================================
 * Permission Domain - Resolver Index
 * ============================================================================
 * Central export point for all permission resolvers
 */

import { Resolvers } from "@/server/graphql/types/generated";

import permissionMutations from "./mutation";
import permissionQueries from "./query";

export const permissionResolvers = {
  Query: permissionQueries,
  Mutation: permissionMutations,
} as Resolvers;

export default permissionResolvers;
