/**
 * ============================================================================
 * GraphQL Context - Entry Point
 * ============================================================================
 * Called once per GraphQL request by Apollo Server
 * Responsibility: Get user, build context
 * ============================================================================
 */

import { getUserFromRequest } from "@/server/auth/getUserFromRequest";

import prisma from "../../db/prisma/lib/prisma";

import { buildGraphQLContext } from "./builder";

/**
 * Create GraphQL context for each request
 *
 * Flow:
 * 1. Accept session passed from route handler (already authenticated)
 * 2. Extract user from session (null if not authenticated)
 * 3. Call buildGraphQLContext to assemble everything
 * 4. Return to Apollo, which passes to middleware/resolvers
 *
 * Happens once per GraphQL request
 */
export async function createContext() {
  // Use provided session, or fetch if not provided (fallback for safety)
  const session = await getUserFromRequest();
  const user = session?.user || null;

  // Build complete context with fresh loaders and services
  return buildGraphQLContext(prisma, user);
}

// Re-export types for use in resolvers/middleware
export { buildGraphQLContext } from "./builder";
export { createDataLoaders } from "./dataloaders";
export type { GraphQLContext } from "./types";
export type { DataLoaderRegistry, ServicesRegistry } from "./types";
