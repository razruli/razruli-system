/**
 * ============================================================================
 * Context Builder - Orchestrator
 * ============================================================================
 * Brings together: DataLoaders + Services + User + Cache = GraphQLContext
 * Called ONCE per GraphQL request
 *
 * Flow:
 * 1. Create fresh DataLoaders (per-request batching)
 * 2. Create fresh Cache (request-scoped)
 * 3. Create ServiceContext (with prisma, dataloaders, cache, user)
 * 4. Create all Services via ServiceFactory (lazy-loaded)
 * 5. Assemble into GraphQLContext
 * ============================================================================
 */

import { v4 as uuidv4 } from "uuid";

import type { PrismaClient, User } from "@/server/db/generated/prisma/client";
import { ServiceFactory } from "@/server/services/ServiceFactory";
import type { ServiceContext } from "@/server/types/context";

import { CacheService } from "./cache";
import { createDataLoaders } from "./dataloaders";
import type { GraphQLContext } from "./types";

/**
 * Build complete GraphQL context for this request
 *
 * This is called ONCE per GraphQL request and provides:
 * - Fresh DataLoaders (prevents N+1 queries)
 * - Fresh Services (for this request only)
 * - Request tracing (requestId)
 * - User authentication (from JWT/session)
 * - Cache management (request-scoped + optional persistent)
 *
 * @param prisma - Prisma client (singleton, shared)
 * @param user - Authenticated user (this request only, null if unauthenticated)
 * @param userAgent - HTTP user agent (for audit logging)
 *
 * @returns Complete GraphQL context ready for resolvers
 *
 * @example
 * ```typescript
 * // In Apollo Server context function
 * const context = await buildGraphQLContext(
 *   prisma,
 *   user,  // from auth middleware
 *   req.headers['user-agent']
 * );
 *
 * // In resolver:
 * const employee = await context.loaders.employee.load(id);
 * const updated = await context.services.employee.update(id, data);
 * ```
 */
export async function buildGraphQLContext(
  prisma: PrismaClient,
  user: User,
  userAgent?: string,
): Promise<GraphQLContext> {
  const requestId = uuidv4();
  const requestStartTime = Date.now();

  // ==================== STEP 1: DataLoaders ====================
  // Fresh per request = automatic batching within this request
  const loaders = createDataLoaders(prisma);

  // ==================== STEP 2: Cache ====================
  // Request-scoped cache for this GraphQL request
  const cache = new CacheService(`gql:${requestId}`);

  // ==================== STEP 3: ServiceContext ====================
  // Context that services depend on
  const serviceContext: ServiceContext = {
    // User
    userId: user?.id || null,
    user,
    isAuthenticated: !!user,

    // Database
    prisma,

    // DataLoaders
    dataloaders: loaders,

    // Cache
    cache,

    // Request metadata
    requestId,
    timestamp: new Date(),
    userAgent,
    path: undefined, // Could be set from req context if available
    errors: [],
  };

  // ==================== STEP 4: Services ====================
  // Create all domain services via factory (lazy-loaded)
  const serviceFactory = new ServiceFactory(serviceContext);
  const services = serviceFactory.getServices();

  // ==================== STEP 5: GraphQLContext ====================
  // Complete context ready for resolvers and middleware
  const context: GraphQLContext = {
    // Database
    prisma,

    // User
    user: user || null,

    // DataLoaders
    loaders,

    // Services (built from factory)
    services,

    // Request metadata
    requestId,
    requestStartTime,
    userAgent,
  };

  return context;
}

/**
 * Clean up context at end of request
 * Call this in Apollo Server afterResolvers hook
 * or similar cleanup hook
 */
export function cleanupGraphQLContext(context: GraphQLContext): void {
  // Dataloaders are cleaned up automatically at end of request
  // Cache is request-scoped so will be garbage collected
  // No explicit cleanup needed, but we could add it here if needed
}
