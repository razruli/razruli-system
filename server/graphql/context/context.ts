/**
 * ============================================================================
 * GraphQL Context - Entry Point
 * ============================================================================
 * Called once per GraphQL request by Apollo Server
 * Responsibility: Get user and actor, build context
 * ============================================================================
 */

import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

import prisma from "../../db/prisma/lib/prisma";

import { buildGraphQLContext } from "./builder";

/**
 * Create GraphQL context for each request
 *
 * Flow:
 * 1. Get session from better-auth (authentication only)
 * 2. Extract user from session (null if not authenticated)
 * 3. Call buildGraphQLContext which handles:
 *    - Fetching actor from DB (if user exists)
 *    - Creating fresh loaders and services
 *    - Assembling complete context
 * 4. Return to Apollo, which passes to middleware/resolvers
 *
 * Happens once per GraphQL request
 */
export async function createContext() {
  // Get authenticated session from better-auth
  const session = await getUserFromRequest();
  const user = session?.user || null;

  // Build complete context (includes actor fetching)
  return buildGraphQLContext(prisma, user);
}

// Re-export types for use in resolvers/middleware
export { buildGraphQLContext } from "./builder";
export { createDataLoaders } from "./dataloaders";
export type { GraphQLContext } from "./types";
export type { DataLoaderRegistry, ServicesRegistry } from "./types";
