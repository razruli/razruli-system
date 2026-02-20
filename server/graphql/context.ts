import { getUserFromRequest } from "../auth/getUserFromRequest";
import prisma from "../db/prisma/lib/prisma";
import {
  ContextBuilder,
  ServicesRegistry,
} from "./context-builder/context-builder";
import { createLoaders, LoaderRegistry } from "./lib/loaders";
import { logger } from "../utils/logger/logger";

/**
 * GraphQL Context Type Definition
 *
 * Pattern: Option 2 (Fresh loaders per request, services injected with loaders)
 * - Loaders: Fresh DataLoader instances per request (no cache pollution)
 * - Services: Re-instantiated per request with fresh LoaderRegistry
 * - User: Authentication info from request
 * - Prisma: Database client
 */
export type GraphQLContext = {
  prisma: typeof prisma;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
  } | null;
  loaders: LoaderRegistry;
  services: ServicesRegistry;
};

/**
 * Create GraphQL context for each request
 * Called per-request by Apollo Server
 */
export async function createContext(): Promise<GraphQLContext> {
  const res = await getUserFromRequest();
  const data = await res.json();

  logger.debug("[Context] Initializing GraphQL context");

  // Initialize services once (at startup)
  // This creates the base service instances and ResolverDependencies
  if (!ContextBuilder["services"]) {
    logger.debug("[Context] First request - initializing services");
    ContextBuilder.initializeServices(prisma);
  }

  // Enrich context with fresh loaders and re-instantiated services
  const enrichedContext = ContextBuilder.enrichContext({
    prisma,
    user: data.user,
  } as any);

  logger.debug("[Context] GraphQL context enriched with loaders and services");

  return enrichedContext;
}
