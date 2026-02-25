// ============================================================================
// Base Service Interfaces
// ============================================================================
// All services implement this contract
// Services are framework-agnostic and only depend on ServiceContext
// ============================================================================

/**
 * Base contract that all services must follow
 * Services are NOT tied to GraphQL - they're just business logic
 */
export interface IService {
  /**
   * Invalidate cache for an entity
   * Called after mutations
   */
  invalidate(id: string | number): void;

  /**
   * Domain name for this service
   * Used for cache key generation: "domain:id"
   */
  readonly domain: string;
}

/**
 * Update input type - generic for all services
 */
export interface UpdateInput {
  [key: string]: any;
}

/**
 * Service error with proper typing
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string = "SERVICE_ERROR",
    public status: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

/**
 * Not found error - specific case of ServiceError
 */
export class NotFoundError extends ServiceError {
  constructor(entityName: string, id: string | number) {
    super(`${entityName} not found: ${id}`, "NOT_FOUND", 404, {
      entityName,
      id,
    });
    this.name = "NotFoundError";
  }
}

/**
 * Validation error - specific case of ServiceError
 */
export class ValidationError extends ServiceError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 422, details);
    this.name = "ValidationError";
  }
}

/**
 * Authorization error - specific case of ServiceError
 */
export class AuthorizationError extends ServiceError {
  constructor(message: string = "Not authorized") {
    super(message, "FORBIDDEN", 403);
    this.name = "AuthorizationError";
  }
}
