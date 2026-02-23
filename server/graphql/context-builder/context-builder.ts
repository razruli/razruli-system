// server/graphql/context-builder.ts
/**
 * Context Builder - Initializes all services with LoaderRegistry and ResolverDependencies
 *
 * Pattern: Option 2 (Loaders in BaseService)
 * - Loaders created fresh per request via factory
 * - Services injected with LoaderRegistry
 * - ResolverDependencies shared across all resolvers
 * - Middleware applied at resolver level
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";
import { UserRepository } from "@/server/services/user/userRepository";
import { UserService } from "@/server/services/user/userService";

import { GraphQLContext } from "../context";
import { createLoaders, LoaderRegistry } from "../lib/loaders";

export interface RepositoriesRegistry {
  userRepository: UserRepository;
}
export interface ServicesRegistry {
  userService: UserService;
}

export class ContextBuilder {
  private static repositories: RepositoriesRegistry | null = null;
  private static services: ServicesRegistry | null = null;
  private static resolverDependencies: ResolverDependencies | null = null;

  /**
   * Initialize all services (called once at app startup)
   */
  static initializeServices(prisma: PrismaClient) {
    // Create repositories
    const userRepository = new UserRepository(prisma);

    // Store repositories for later re-injection
    this.repositories = {
      userRepository,
    };

    // Create fresh DataLoaders for app initialization
    const initLoaders = createLoaders(prisma);

    // Create services with initial loaders
    const userService = new UserService(userRepository, initLoaders);

    this.services = {
      userService,
    };

    // Create shared ResolverDependencies (instantiated once, reused by all resolvers)
    this.resolverDependencies = new ResolverDependencies(this.services);
  }

  /**
   * Get shared ResolverDependencies (needed for resolver instantiation)
   */
  static getResolverDependencies(): ResolverDependencies {
    if (!this.resolverDependencies) {
      throw new Error(
        "ResolverDependencies not initialized. Call initializeServices first.",
      );
    }
    return this.resolverDependencies;
  }

  /**
   * Create enriched context for each GraphQL request
   * - Fresh loaders per request
   * - Services re-injected with fresh LoaderRegistry
   * - Shared ResolverDependencies
   */
  static enrichContext(
    baseContext: GraphQLContext & { prisma: PrismaClient },
  ): GraphQLContext & {
    loaders: LoaderRegistry;
    services: ServicesRegistry;
  } {
    if (!this.repositories || !this.services) {
      throw new Error(
        "Services not initialized. Call initializeServices first.",
      );
    }

    // Create fresh DataLoaders for this request
    const loaders = createLoaders(baseContext.prisma);

    // Re-inject services with fresh LoaderRegistry for this request using stored repositories
    const userService = new UserService(
      this.repositories.userRepository,
      loaders,
    );

    // Return enriched context with fresh loaders and services
    return {
      ...baseContext,
      loaders,
      services: {
        userService,
      },
    };
  }
}
