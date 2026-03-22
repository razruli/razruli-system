/**
 * ============================================================================
 * Context Builder - Orchestrator
 * ============================================================================
 * Brings together: DataLoaders + Services + User + Actor + Cache = GraphQLContext
 * Called ONCE per GraphQL request
 *
 * Flow:
 * 1. Create fresh DataLoaders (per-request batching)
 * 2. Create fresh Cache (request-scoped)
 * 3. Create ServiceContext (with prisma, dataloaders, cache, user, actor)
 * 4. Create all Services via ServiceFactory (lazy-loaded)
 * 5. Assemble into GraphQLContext
 * ============================================================================
 */

import { v4 as uuidv4 } from "uuid";

import type {
  PrismaClient,
  User,
  Actor,
} from "@/server/db/generated/prisma/client";
import { ServiceFactory } from "@/server/services/ServiceFactory";
import type { ServiceContext } from "@/server/types/context";

import { CacheService } from "./cache";
import { createDataLoaders } from "./dataloaders";
import type { GraphQLContext } from "./types";

/**
 * Build complete GraphQL context for this request
 *
 * Responsibilities:
 * 1. Fetch actor from DB if user is authenticated
 * 2. Create fresh DataLoaders (prevents N+1 queries)
 * 3. Create fresh Services (for this request only)
 * 4. Assemble request tracing and metadata
 * - User authentication (from session)
 * - Actor business entity (with roles, permissions, company context)
 * - Cache management (request-scoped + optional persistent)
 *
 * @param prisma - Prisma client (singleton, shared)
 * @param user - Authenticated user (this request only, null if unauthenticated)
 * @param userAgent - HTTP user agent (for audit logging)
 *
 * @returns Complete GraphQL context ready for resolvers
 */
export async function buildGraphQLContext(
  prisma: PrismaClient,
  user: User | null,
  userAgent?: string,
): Promise<GraphQLContext> {
  const requestId = uuidv4();
  const requestStartTime = Date.now();

  // ==================== STEP 1: Fetch Actor ====================
  // Fetch actor from DB if user is authenticated
  // Actor is the business entity with roles, permissions, company context
  let actor: Actor | null | undefined = null;
  if (user) {
    actor = await prisma.actor.findUnique({
      where: { userId: user.id },
      include: {
        company: true,
        department: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });
  }

  // ==================== STEP 2: DataLoaders ====================
  // Fresh per request = automatic batching within this request
  const loaders = createDataLoaders(prisma);

  // ==================== STEP 3: Cache ====================
  // Request-scoped cache for this GraphQL request
  const cache = new CacheService(`gql:${requestId}`);

  // ==================== STEP 4: ServiceContext ====================
  // Context that services depend on
  const serviceContext: ServiceContext = {
    // User
    userId: user?.id || null,
    user,

    // Actor
    actor: actor || undefined,

    // Authentication status
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

  // ==================== STEP 5: Services ====================
  // Create all domain services via factory (lazy-loaded)
  const serviceFactory = new ServiceFactory(serviceContext);
  const services = serviceFactory.getServices();

  // ==================== STEP 6: GraphQLContext ====================
  // Complete context ready for resolvers and middleware
  const context: GraphQLContext = {
    // Database
    prisma,

    // User and Actor
    user: user || null,
    actor: actor || null,

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
