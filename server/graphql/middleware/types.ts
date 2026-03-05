import type { GraphQLResolveInfo } from "graphql";

import type { GraphQLContext } from "@/server/graphql/context";

/**
 * Generic middleware options with type-safe argument validation
 * @template TArgs - The argument type passed to the resolver
 */
export interface MiddlewareOptions<TArgs = any> {
  /** Require authenticated user */
  requireAuth?: boolean;

  /** Required permissions in format "resource:action" */
  requiredPermissions?: string[];

  /** Custom validation function with type-safe args */
  validate?: (args: TArgs) => boolean | Promise<boolean>;

  /** Custom validation error message */
  validationMessage?: string;

  /** Skip middleware entirely (for public resolvers) */
  skipMiddleware?: boolean;
}

/**
 * Generic middleware context with typed arguments
 * @template TArgs - The argument type
 * @template TContext - The context type (defaults to GraphQLContext)
 */
export interface MiddlewareContext<
  TArgs = any,
  TContext extends GraphQLContext = GraphQLContext,
> {
  context: TContext;
  args: TArgs;
  info: GraphQLResolveInfo;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
