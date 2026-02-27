/**
 * ============================================================================
 * GRAPHQL MIDDLEWARE SYSTEM
 * ============================================================================
 *
 * Centralized middleware orchestration for all resolvers.
 *
 * Execution order:
 * 1. Authentication (verify user is logged in)
 * 2. Authorization (check user permissions)
 * 3. Validation (validate input arguments)
 * 4. Error Handler (format errors for GraphQL)
 * 5. Resolver (execute business logic)
 *
 * If any middleware fails, an error is thrown before the resolver executes.
 *
 * Usage:
 * ```typescript
 * import { withMiddleware } from "@/server/graphql/middleware";
 *
 * // Protected resolver with permissions
 * updateTask: withMiddleware(
 *   async (_parent, { id, data }, context) => {
 *     return context.services.task.update(id, data);
 *   },
 *   {
 *     requireAuth: true,
 *     requiredPermissions: ["task:update"],
 *     validate: (args) => args.id && args.id.length > 0,
 *     validationMessage: "Task ID is required"
 *   }
 * )
 * ```
 *
 * ============================================================================
 */

// Re-export everything from all middleware modules
export * from "./compose";
export * from "./types";
export * from "./validation";
export * from "./authentication";
export * from "./authorization";
export * from "./errorHandler";

// ==================== COMMON MIDDLEWARE PRESETS ====================

/**
 * Preset for public queries (no auth required)
 */
export const PUBLIC = {};

/**
 * Preset for authenticated queries
 */
export const AUTHENTICATED = {
  requireAuth: true,
};

/**
 * Preset for admin-only mutations
 */
export const ADMIN_ONLY = {
  requireAuth: true,
  requiredPermissions: ["admin:all"],
};

/**
 * Preset for resource-specific mutations
 */
export const RESOURCE_WRITE = (resource: string) => ({
  requireAuth: true,
  requiredPermissions: [`${resource}:write`, `${resource}:update`],
});

export const RESOURCE_DELETE = (resource: string) => ({
  requireAuth: true,
  requiredPermissions: [`${resource}:delete`],
});

export const RESOURCE_READ = (resource: string) => ({
  requiredPermissions: [`${resource}:read`],
});
