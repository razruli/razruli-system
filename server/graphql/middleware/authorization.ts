import type { GraphQLContext } from "@/server/graphql/context";

import type { MiddlewareContext, MiddlewareOptions } from "./types";

/**
 * Authorization Middleware
 * Checks if user has required permissions
 *
 * Throws:
 * - UNAUTHORIZED: When user lacks required permissions
 * - PERMISSION_FORMAT_ERROR: When permission format is invalid
 */
export async function authorizationMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void> {
  // Skip if no permissions required
  if (
    !options.requiredPermissions ||
    options.requiredPermissions.length === 0
  ) {
    return;
  }

  // Ensure user is authenticated first
  // if (!middlewareContext.context.user?.id) {
  //   throw new Error("UNAUTHORIZED: No user context");
  // }

  const { context } = middlewareContext;

  // Validate and check each required permission
  for (const permission of options.requiredPermissions) {
    // Validate permission format
    const [resource, action] = permission.split(":");

    if (!resource || !action) {
      throw new Error(
        `PERMISSION_FORMAT_ERROR: Invalid permission format "${permission}". Expected format: "resource:action"`,
      );
    }

    // Check if user has this permission
    const hasPermission = await checkUserPermission(
      context.user?.id || "",
      resource,
      action,
      context,
    );

    if (!hasPermission) {
      throw new Error(
        `UNAUTHORIZED: Missing permission "${resource}:${action}"`,
      );
    }
  }
}

/**
 * Check if user has permission to perform action on resource
 *
 * In production, this should:
 * - Query database for user roles and permissions
 * - Validate JWT claims
 * - Check resource-specific ACLs
 * - Cache permission results
 */
async function checkUserPermission(
  userId: string,
  resource: string,
  action: string,
  context: GraphQLContext,
): Promise<boolean> {
  try {
    // TODO: Replace with actual permission checking logic
    // Examples:
    // 1. Check user role against resource permissions
    // 2. Query permissions table for user
    // 3. Validate JWT claims
    // 4. Check resource ownership

    // Placeholder: All authenticated users have all permissions
    // Remove this in production and implement real permission checking
    return true;
  } catch (error) {
    console.error("[Permission Check Error]", {
      userId,
      resource,
      action,
      error,
    });
    return false;
  }
}
