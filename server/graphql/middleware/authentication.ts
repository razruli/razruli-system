import type { MiddlewareContext, MiddlewareOptions } from "./types";

/**
 * Authentication Middleware
 * Validates user is logged in if required
 *
 * Throws:
 * - UNAUTHENTICATED: When user is not logged in but required
 */
export async function authMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void> {
  // Skip if auth not required
  if (!options.requireAuth) {
    return;
  }

  // Check if user exists in context
  if (!middlewareContext.context.user) {
    throw new Error("UNAUTHENTICATED: User must be logged in");
  }

  // Additional checks
  if (!middlewareContext.context.user.id) {
    throw new Error("UNAUTHENTICATED: User has no valid ID");
  }
}
