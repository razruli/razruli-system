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
 *
 * @template TArgs - Type of resolver arguments
 * @template TContext - Type of GraphQL context
 */
async function executeMiddleware<
  TArgs = any,
  TContext extends GraphQLContext = GraphQLContext,
>(
  options: MiddlewareOptions<TArgs>,
  middlewareContext: MiddlewareContext<TArgs, TContext>,
): Promise<void> {
  // 1. Authentication - Verify user is logged in (if required)
  await authMiddleware(options, middlewareContext as MiddlewareContext);

  // 2. Authorization - Check permissions (if required)
  await authorizationMiddleware(
    options,
    middlewareContext as MiddlewareContext,
  );

  // 3. Validation - Validate input arguments (if required)
  await validationMiddleware(options, middlewareContext as MiddlewareContext);
}

/**
 * Wraps a resolver with complete middleware orchestration and full type safety
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
 * @template TArgs - Type of arguments passed to the resolver
 * @template TParent - Type of parent object (usually unused in queries/mutations)
 * @template TContext - Type of GraphQL context
 * @template TResult - The return type of the resolver
 *
 * @example
 * ```typescript
 * // Typed resolver with validation
 * user: withMiddleware<{ id: string }, any, GraphQLContext, User>(
 *   async (_parent, { id }, context) => {
 *     return context.services.user.findById(id);
 *   },
 *   {
 *     requireAuth: true,
 *     requiredPermissions: ["user:read"],
 *     validate: (args) => args.id.length > 0 // args is typed!
 *   }
 * )
 *
 * // Composed middleware
 * employee: withMiddleware<IEmployeeQueryArgs, any, GraphQLContext, Employee>(
 *   async (_parent, args, context) => {
 *     return context.services.employee.search(args);
 *   },
 *   employeeQueryMiddleware // Reusable, typed middleware
 * )
 * ```
 */
export function withMiddleware<
  TArgs = any,
  TParent = any,
  TContext extends GraphQLContext = GraphQLContext,
  TResult = any,
>(
  resolver: (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
  ) => Promise<TResult> | TResult,
  options?: MiddlewareOptions<TArgs>,
): (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> {
  return async (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
  ): Promise<TResult> => {
    // Skip all middleware for public resolvers
    if (options?.skipMiddleware) {
      return resolver(parent, args, context, info);
    }

    const middlewareContext: MiddlewareContext<TArgs, TContext> = {
      context: context,
      args,
      info,
    };

    // Execute middleware and resolver with error handling
    return errorHandlerMiddleware(async () => {
      // Execute all middleware first
      await executeMiddleware<TArgs, TContext>(
        options || {},
        middlewareContext,
      );

      // Only execute resolver if all middleware passes
      return Promise.resolve(resolver(parent, args, context, info));
    }, middlewareContext as MiddlewareContext);
  };
}

/**
 * Compose multiple middleware options into a single reusable configuration
 *
 * Intelligently merges options:
 * - Combines permissions (removes duplicates)
 * - ORs boolean flags (if any option requires auth, result requires auth)
 * - Chains validators (all validation functions must pass)
 *
 * @template TArgs - Type of resolver arguments
 *
 * @example
 * ```typescript
 * // Define typed, reusable middleware once
 * interface CompanyQueryArgs {
 *   id?: string;
 * }
 *
 * const companyReadMiddleware = composeMiddleware<CompanyQueryArgs>(
 *   { requireAuth: true },
 *   { requiredPermissions: ["company:read"] },
 * );
 *
 * // Use in multiple resolvers
 * company: withMiddleware<CompanyQueryArgs>(resolverFn, companyReadMiddleware),
 * companies: withMiddleware<CompanyQueryArgs>(resolverFn, companyReadMiddleware),
 * myCompany: withMiddleware<{}>(resolverFn, companyReadMiddleware),
 * ```
 */
export function composeMiddleware<TArgs = any>(
  ...options: MiddlewareOptions<TArgs>[]
): MiddlewareOptions<TArgs> {
  return {
    requireAuth: options.some((opt) => opt.requireAuth),
    requiredPermissions: options
      .flatMap((opt) => opt.requiredPermissions || [])
      .filter((perm, idx, arr) => arr.indexOf(perm) === idx), // Remove duplicates
    validate:
      options.length > 0 && options.some((opt) => opt.validate)
        ? async (args: TArgs) => {
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
