import { ZodSchema } from "zod/v3";

import { AuthError, ValidationError } from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

import { GraphQLContext, DataLoaderRegistry } from "../../context/types";
/**
 * Resolve entity by batching ID through dataloader
 * Prevents N+1 queries on frequently accessed relations
 */
export async function resolveWithDataloader<T>(
  loaders: DataLoaderRegistry,
  loaderKey: keyof DataLoaderRegistry,
  id: string,
): Promise<T | undefined> {
  try {
    const loader = loaders[loaderKey] as any;
    if (!loader) {
      logger.warn(`Dataloader not found: ${String(loaderKey)}`);
      return undefined;
    }
    return await loader.load(id);
  } catch (error) {
    logger.error(`Dataloader error for ${String(loaderKey)}`, error as Error);
    return undefined;
  }
}

/**
 * Wrap resolver with authorization check
 * Throws AuthError if user not authenticated
 */
export async function withAuth<T>(
  ctx: GraphQLContext,
  fn: () => Promise<T>,
  requiredRole?: string,
): Promise<T> {
  if (!ctx.user) {
    throw new AuthError("Authentication required");
  }

  // Note: Role-based checks are not currently supported as User model lacks role property
  // This can be added once User model includes role field
  return await fn();
}

/**
 * Validate input against Zod schema before executing resolver
 * Returns validated data to resolver function
 */
export async function withDataValidation<T>(
  input: unknown,
  schema: ZodSchema,
  fn: (validated: any) => Promise<T>,
): Promise<T> {
  try {
    const validated = schema.parse(input);
    return await fn(validated);
  } catch (error: any) {
    if (error.errors) {
      throw new ValidationError(
        `Validation failed: ${error.errors.map((e: any) => e.message).join(", ")}`,
      );
    }
    throw new ValidationError((error as Error).message || "Validation failed");
  }
}

/**
 * Wrap resolver with audit logging after execution
 * Records action, user, resource ID, timestamp
 */
export async function withAuditLog(
  ctx: GraphQLContext,
  action: string,
  resourceId: string,
  fn: () => Promise<any>,
): Promise<any> {
  const result = await fn();

  if (ctx.user) {
    logger.info(`[AUDIT] ${action}`, {
      userId: ctx.user.id,
      resourceId,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
}
