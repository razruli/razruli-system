import type { GraphQLResolveInfo } from "graphql";

import type { GraphQLContext } from "@/server/graphql/context";

export interface MiddlewareOptions {
  /** Require authenticated user */
  requireAuth?: boolean;

  /** Required permissions in format "resource:action" */
  requiredPermissions?: string[];

  /** Custom validation function */
  validate?: (args: any) => boolean | Promise<boolean>;

  /** Custom validation error message */
  validationMessage?: string;

  /** Skip middleware entirely (for public resolvers) */
  skipMiddleware?: boolean;
}

export interface MiddlewareContext {
  context: GraphQLContext;
  args: any;
  info: GraphQLResolveInfo;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
