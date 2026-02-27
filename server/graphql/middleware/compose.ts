import type { GraphQLResolveInfo } from "graphql";

import type { GraphQLContext } from "@/server/graphql/context";

import { authMiddleware } from "./authentication";
import { authorizationMiddleware } from "./authorization";
import { errorHandlerMiddleware } from "./errorHandler";
import type { MiddlewareContext, MiddlewareOptions } from "./types";
import { validationMiddleware } from "./validation";

/**
 * Execute all middleware in sequence
 * Order: Authentication → Authorization → Validation
 *
 * Each middleware can throw errors, which are caught and formatted
 * by the error handler middleware before reaching the resolver
 */
async function executeMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void> {
  // 1. Authentication - Verify user is logged in (if required)
  await authMiddleware(options, middlewareContext);

  // 2. Authorization - Check permissions (if required)
  await authorizationMiddleware(options, middlewareContext);

  // 3. Validation - Validate input arguments (if required)
  await validationMiddleware(options, middlewareContext);
}

/**
 * Wraps a resolver with complete middleware orchestration
 *
 * Middleware execution order:
 * 1. Authentication (if requireAuth: true)
 * 2. Authorization (if requiredPermissions provided)
 * 3. Validation (if validate function provided)
 * 4. Error handling (catches and formats all errors)
 * 5. Resolver execution
 *
 * When middleware validation fails, it throws a GraphQL-formatted error
 * before the resolver is ever executed.
 *
 * @example
 * ```typescript
 * // Simple: Require authentication
 * user: withMiddleware(
 *   async (_parent, { id }, context) => {
 *     return context.services.user.findById(id);
 *   },
 *   { requireAuth: true }
 * )
 *
 * // Complex: Auth + Permissions + Validation
 * updateEmployee: withMiddleware(
 *   async (_parent, { id, data }, context) => {
 *     return context.services.employee.update(id, data);
 *   },
 *   {
 *     requireAuth: true,
 *     requiredPermissions: ["employee:update"],
 *     validate: (args) => {
 *       return args.id && args.id.length > 0;
 *     },
 *     validationMessage: "Employee ID is required"
 *   }
 * )
 *
 * // Public: Skip all middleware
 * publicData: withMiddleware(
 *   async (_parent, _args, context) => {
 *     return context.services.public.getData();
 *   },
 *   { skipMiddleware: true }
 * )
 * ```
 */
export function withMiddleware<
  TArgs extends Record<string, any> = { any: any },
  TResult = any,
>(
  resolver: (
    parent: any,
    args: TArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) => Promise<TResult> | TResult,
  options: MiddlewareOptions = {},
) {
  return async (
    parent: any,
    args: TArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ): Promise<TResult> => {
    // Skip all middleware for public resolvers
    if (options.skipMiddleware) {
      return resolver(parent, args, context, info);
    }

    const middlewareContext: MiddlewareContext = {
      context,
      args,
      info,
    };

    // Execute middleware and resolver with error handling
    return errorHandlerMiddleware(async () => {
      // Execute all middleware first
      await executeMiddleware(options, middlewareContext);

      // Only execute resolver if all middleware passes
      return Promise.resolve(resolver(parent, args, context, info));
    }, middlewareContext);
  };
}

/**
 * Compose multiple middleware options into a single configuration
 *
 * @example
 * ```typescript
 * const authAndPermissions = composeMiddleware(
 *   { requireAuth: true },
 *   { requiredPermissions: ["employee:read", "employee:update"] },
 *   { validate: (args) => args.id.length > 0 }
 * );
 *
 * resolver: withMiddleware(resolverFn, authAndPermissions)
 * ```
 */
export function composeMiddleware(
  ...options: MiddlewareOptions[]
): MiddlewareOptions {
  return {
    requireAuth: options.some((opt) => opt.requireAuth),
    requiredPermissions: options
      .flatMap((opt) => opt.requiredPermissions || [])
      .filter((perm, idx, arr) => arr.indexOf(perm) === idx), // Remove duplicates
    validate:
      options.length > 0 && options.some((opt) => opt.validate)
        ? async (args: any) => {
            // All validation functions must pass
            for (const opt of options) {
              if (
                opt.validate &&
                !(await Promise.resolve(opt.validate(args)))
              ) {
                return false;
              }
            }
            return true;
          }
        : undefined,
    skipMiddleware: options.some((opt) => opt.skipMiddleware),
  };
}

// ==================== EXPORTS ====================

export * from "./types";
export * from "./validation";
