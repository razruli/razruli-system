// ============================================================================
// GraphQL Context Builder
// ============================================================================
// Creates the ServiceContext for each GraphQL request
// This is called from Apollo middleware before resolvers execute
// ============================================================================

import { v4 as uuidv4 } from "uuid";

import type { User } from "@/server/db/generated/prisma/client";
import { prisma } from "@/server/db/prisma/lib/prisma";
import type {
  ServiceContext,
  ContextBuilderOptions,
} from "@/server/types/context";

import { CacheService } from "./cache";
import { createDataLoaders } from "./dataloaders";
/**
 * Build the GraphQL request context
 *
 * Called for every GraphQL request:
 * 1. Before middleware
 * 2. Before resolvers
 * 3. Before service layer
 *
 * This context is then passed to services which use it to:
 * - Access the database (prisma)
 * - Get batched queries (dataloaders)
 * - Manage caches (invalidation)
 * - Access auth info (userId, user)
 */
export async function buildServiceContext(
  options: ContextBuilderOptions,
): Promise<ServiceContext> {
  // Generate unique request ID for tracing
  const requestId = options.requestId || uuidv4();

  // Get authenticated user (if provided)
  let user: User | undefined;
  if (options.userId && !options.user) {
    // If only userId provided, fetch full user
    const foundUser = await prisma.user.findUnique({
      where: { id: options.userId },
    });
    if (foundUser) {
      user = foundUser;
    }
  } else if (options.user) {
    user = options.user;
  }

  // Create cache service
  const cache = new CacheService(`req:${requestId}`);

  // Create DataLoaders for this request
  const dataloaders = createDataLoaders(prisma);

  // Build context object
  const context: ServiceContext = {
    // Auth info
    userId: options.userId || null,
    user,
    isAuthenticated: !!options.userId,

    // Database
    prisma,

    // DataLoaders
    dataloaders,

    // Cache
    cache,

    // Request info
    requestId,
    timestamp: new Date(),
    path: options.path,
    userAgent: options.userAgent,

    // Errors (populated during execution)
    errors: [],
  };

  // Log context creation in development
  if (process.env.NODE_ENV === "development") {
    console.warn(`[GraphQL Context] Created for request ${requestId}`, {
      authenticated: context.isAuthenticated,
      userId: context.userId,
      path: options.path,
    });
  }

  return context;
}

/**
 * Apollo middleware function for Express
 * Builds context from request before executing resolvers
 *
 * Usage in Apollo Server:
 * ```typescript
 * new ApolloServer({
 *   schema,
 *   context: createApolloContext,
 * })
 * ```
 */
export async function createApolloContext(
  req: any,
): Promise<{ context: ServiceContext }> {
  // Extract auth info from request
  const authHeader = req.headers.authorization;
  let userId: string | undefined;

  if (authHeader) {
    // Extract userId from JWT or session
    // This is a placeholder - implement based on your auth system
    userId = extractUserIdFromToken(authHeader);
  }

  // Build context
  const context = await buildServiceContext({
    userId,
    path: req.path,
    userAgent: req.headers["user-agent"],
  });

  return { context };
}

/**
 * Express middleware to attach context to GraphQL requests
 *
 * Usage:
 * ```typescript
 * app.use(contextMiddleware);
 * server.use(express, app);
 * ```
 */
export function contextMiddleware(req: any, res: any, next: any) {
  // Create context and attach to request
  buildServiceContext({
    userId: req.user?.id,
    path: req.path,
    userAgent: req.headers["user-agent"],
  })
    .then((context) => {
      req.context = context;
      next();
    })
    .catch((err) => {
      console.error("Failed to build context:", err);
      res.status(500).json({ error: "Internal server error" });
    });
}

/**
 * Extract userId from authorization header
 * Implement based on your auth system (JWT, OAuth, etc.)
 */
function extractUserIdFromToken(authHeader: string): string | undefined {
  // Format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return undefined;

  try {
    // TODO: Implement token verification based on your auth system
    // Example for JWT:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return decoded.userId;

    console.warn("Token extraction not implemented - returning undefined");
    return undefined;
  } catch (error) {
    console.error("Failed to extract user from token:", error);
    return undefined;
  }
}

/**
 * Helper to create context for testing
 *
 * Usage in tests:
 * ```typescript
 * const context = createTestContext({ userId: 'test-user' });
 * const service = new EmployeeService(context);
 * ```
 */
export async function createTestContext(
  overrides?: Partial<ContextBuilderOptions>,
): Promise<ServiceContext> {
  return buildServiceContext({
    userId: "test-user",
    ...overrides,
  });
}

/**
 * Create context with pre-populated data loaders
 * Useful when you want to avoid N+1 on specific queries
 */
export async function buildContextWithPrefetch(
  options: ContextBuilderOptions,
  prefetch?: {
    employees?: any[];
    departments?: any[];
  },
): Promise<ServiceContext> {
  const context = await buildServiceContext(options);

  // Prime dataloaders with prefetched data
  if (prefetch?.employees) {
    prefetch.employees.forEach((emp) => {
      context.dataloaders.employee.prime(emp.id, emp);
    });
  }

  if (prefetch?.departments) {
    prefetch.departments.forEach((dept) => {
      context.dataloaders.department.prime(dept.id, dept);
    });
  }

  return context;
}
