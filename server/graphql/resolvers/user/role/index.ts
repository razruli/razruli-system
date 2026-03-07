/**
 * ============================================================================
 * Role Domain - Resolver Index
 * ============================================================================
 * Central export point for all role resolvers
 */

import { Resolvers } from "@/server/graphql/types/generated";

import roleFieldResolvers from "./fields";
import roleMutations from "./mutation";
import roleQueries from "./query";

export const roleResolvers = {
  Query: roleQueries,
  Mutation: roleMutations,
  Role: roleFieldResolvers,
} as Resolvers;

export default roleResolvers;
