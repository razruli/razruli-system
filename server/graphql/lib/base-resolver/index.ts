import { ZodSchema } from "zod/v3";

import { AuthError, ValidationError } from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

import { GraphQLContext } from "../../context";

/**
 * Base resolver class with common resolver patterns
 * Provides: validation, authorization, audit logging, error handling
 */
export abstract class BaseResolver<Context = GraphQLContext> {
  /**
   * Validate input against Zod schema
   * Throws ValidationError if schema validation fails
   */
  protected validateInput<T>(input: unknown, schema: ZodSchema): T {
    try {
      return schema.parse(input) as T;
    } catch (error: any) {
      const message = error.errors
        ? error.errors.map((e: any) => e.message).join(", ")
        : "Validation failed";
      throw new ValidationError(message);
    }
  }

  /**
   * Check user authentication and role authorization
   * Throws AuthError if not authenticated or role doesn't match
   */
  protected authorize(
    context: Context,
    requiredRoles?: string[],
  ): asserts context is Context & { user: NonNullable<any> } {
    const ctx = context as any;
    if (!ctx.user) {
      throw new AuthError("Authentication required");
    }

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(ctx.user.role)) {
        throw new AuthError(
          `One of roles [${requiredRoles.join(", ")}] required`,
        );
      }
    }
  }

  /**
   * Log audit trail entry for important actions
   * Called after mutation execution to track what changed
   */
  protected async logAudit(
    action: string,
    resourceId: string,
    context: Context,
  ): Promise<void> {
    const ctx = context as any;
    if (ctx.user) {
      logger.info(`[AUDIT] ${action}`, {
        userId: ctx.user.id,
        resourceId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Wrap resolver with error handling and logging
   * Catches errors and logs them before re-throwing
   */
  protected async wrapResolver<T>(
    operationName: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      logger.error(`Resolver error in ${operationName}`, error as Error);
      throw error;
    }
  }
}
