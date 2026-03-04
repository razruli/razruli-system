/**
 * ============================================================================
 * GraphQL Context - Entry Point
 * ============================================================================
 * Called once per GraphQL request by Apollo Server
 * Responsibility: Get user, build context
 * ============================================================================
 */

import { getUserFromRequest } from "../../auth/getUserFromRequest";
import prisma from "../../db/prisma/lib/prisma";

import { buildGraphQLContext } from "./builder";

/**
 * Create GraphQL context for each request
 *
 * Flow:
 * 1. Get authenticated user from Next.js request
 * 2. Call buildGraphQLContext to assemble everything
 * 3. Return to Apollo, which passes to middleware/resolvers
 *
 * Happens once per GraphQL request
 */
export async function createContext() {
  // Get authenticated user from request
  const res = await getUserFromRequest();
  const data = await res.json();
  const user = data.user || null;

  // Build complete context with fresh loaders and services
  return buildGraphQLContext(prisma, user);
}

// Re-export types for use in resolvers/middleware
export { buildGraphQLContext } from "./builder";
export { createDataLoaders } from "./dataloaders";
export type { GraphQLContext } from "./types";
export type { DataLoaderRegistry, ServicesRegistry } from "./types";
