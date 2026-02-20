import { GraphQLContext } from "@/server/graphql/context";
import { logger } from "@/server/utils/logger/logger";

/**
 * All services available to resolvers
 */
export interface Services {
  userService: any;
  brokerService: any;
  carrierService: any;
  warehouseService: any;
  driverService: any;
  freightService: any;
  shipmentService: any;
  [key: string]: any;
}

/**
 * Shared across ALL resolvers
 * Contains services, provides middleware composition
 * Instantiated once per GraphQL server startup
 */
export class ResolverDependencies {
  constructor(readonly services: Services) {}

  /**
   * Apply middleware to query handlers
   * Middleware: auth + logging
   */
  composeQuery = <TArgs, TResult>(
    handler: (args: TArgs, ctx: GraphQLContext) => Promise<TResult>,
  ) => {
    return applyMiddleware(
      [authMiddleware, loggingMiddleware],
      async (_parent: any, args: any, ctx: GraphQLContext) =>
        handler(args, ctx),
    );
  };

  /**
   * Apply middleware to mutation handlers
   * Middleware: auth + logging
   */
  composeMutation = <TArgs, TResult>(
    handler: (args: TArgs, ctx: GraphQLContext) => Promise<TResult>,
  ) => {
    return applyMiddleware(
      [authMiddleware, loggingMiddleware],
      async (_parent: any, args: any, ctx: GraphQLContext) =>
        handler(args, ctx),
    );
  };
}

/**
 * Authentication middleware - ensures user is logged in
 */
const authMiddleware = async (
  handler: any,
  _parent: any,
  _args: any,
  ctx: GraphQLContext,
) => {
  if (!ctx.user) {
    throw new Error("Authentication required");
  }
  return handler(_parent, _args, ctx);
};

/**
 * Logging middleware - logs resolver execution
 */
const loggingMiddleware = async (
  handler: any,
  _parent: any,
  args: any,
  ctx: GraphQLContext,
) => {
  const startTime = Date.now();
  logger.debug("Resolver executing", {
    userId: ctx.user?.id,
  });

  try {
    const result = await handler(_parent, args, ctx);
    const duration = Date.now() - startTime;
    logger.debug("Resolver completed", { duration });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Resolver failed", { duration });
    throw error;
  }
};

/**
 * Apply middleware stack to a handler
 * Middleware is applied right-to-left (inner to outer)
 */
export const applyMiddleware = (
  middlewares: Array<(h: any, ...args: any[]) => Promise<any>>,
  handler: any,
) => {
  return async (...args: any[]) => {
    let wrapped = handler;

    // Apply middlewares in reverse order (right-to-left)
    for (const middleware of middlewares.reverse()) {
      const currentHandler = wrapped;
      wrapped = (...handlerArgs: any[]) =>
        middleware(currentHandler, ...handlerArgs);
    }

    return wrapped(...args);
  };
};
