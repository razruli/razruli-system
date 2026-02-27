# GraphQL Middleware Architecture

## Overview

The middleware system is the central orchestration layer for GraphQL resolver execution. It handles authentication, authorization, validation, error handling, and provides extensibility for cross-cutting concerns.

**Location:** `server/graphql/middleware/index.ts`

**Core Principle:** Middleware executes in a fixed sequential order before and after resolver execution:

```
Auth → Permission → Validation → [Resolver Execution] → Error Handler
```

---

## ✅ IMPLEMENTED MIDDLEWARE

### 1. Authentication Middleware (`authMiddleware`)

**Purpose:** Validates that a user is authenticated when required

**Location:** Lines 37-49

**Function Signature:**

```typescript
export async function authMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void>;
```

**Behavior:**

- Checks if `options.requireAuth` is true
- If true, validates `context.userId` exists
- If true, validates `context.user` object is present
- Throws `UNAUTHENTICATED` error if checks fail
- Early returns if auth not required

**Usage:**

```typescript
withMiddleware(resolver, {
  requireAuth: true, // ← Activates this middleware
});
```

**Error Type:** `UNAUTHENTICATED`

**Relation to Others:**

- Runs FIRST in middleware chain
- Permission middleware depends on user being authenticated

---

### 2. Permission Middleware (`permissionMiddleware`)

**Purpose:** Checks if authenticated user has required permissions to perform action

**Location:** Lines 51-101

**Function Signature:**

```typescript
export async function permissionMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void>;
```

**Behavior:**

- Checks if `options.requiredPermissions` array is provided
- Validates permission format: `"resource:action"` (e.g., `"employee:read"`)
- Calls `checkUserPermission()` for each required permission
- Throws `UNAUTHORIZED` error if any permission is missing
- Early returns if no permissions specified

**Usage:**

```typescript
withMiddleware(resolver, {
  requireAuth: true,
  requiredPermissions: ["employee:read", "department:read"], // ← Activates this middleware
});
```

**Error Type:** `UNAUTHORIZED` → Formatted as `FORBIDDEN` GraphQL code

**Permission Format:** `"resource:action"`

- Examples: `"employee:read"`, `"employee:update"`, `"employee:delete"`, `"admin:all"`
- Validated by `checkUserPermission()` helper

**Relation to Others:**

- Runs SECOND in middleware chain
- Depends on user being authenticated (auth middleware runs first)

**⚠️ TODO:** `checkUserPermission()` is a stub - always returns true. Needs implementation to:

- Query user role from database
- Check role-based resource ACLs
- Validate against JWT claims
- Cache permission results for performance

---

### 3. Validation Middleware (`validationMiddleware`)

**Purpose:** Executes custom input validation logic on resolver arguments

**Location:** Lines 103-118

**Function Signature:**

```typescript
export async function validationMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void>;
```

**Behavior:**

- Checks if `options.validate` function is provided
- Executes validation function with resolver arguments: `validate(args)`
- Supports both sync and async validation (wraps with `Promise.resolve()`)
- Throws `VALIDATION_ERROR` if validation returns false/falsy
- Uses custom error message from `options.validationMessage` if provided
- Early returns if no validation specified

**Usage:**

```typescript
withMiddleware(resolver, {
  requireAuth: true,
  validate: (args) => {
    // Custom validation logic
    if (!args.id || args.id.length === 0) {
      return false; // ← Triggers VALIDATION_ERROR
    }
    return true; // ← Passes validation
  },
  validationMessage: "ID must not be empty",
});
```

**Error Type:** `VALIDATION_ERROR` → Formatted as `BAD_USER_INPUT` GraphQL code

**Async Support:** ✅ Yes

```typescript
validate: async (args) => {
  const exists = await checkIfEmployeeExists(args.employeeId);
  return exists; // Can return Promise
};
```

**Relation to Others:**

- Runs THIRD in middleware chain
- Independent from auth/permission flow

---

### 4. Error Handler Middleware (`errorHandlerMiddleware`)

**Purpose:** Catches all errors from middleware + resolver and formats them consistently for GraphQL

**Location:** Lines 120-156

**Function Signature:**

```typescript
export async function errorHandlerMiddleware(
  resolverFn: Function,
  middlewareContext: MiddlewareContext,
): Promise<any>;
```

**Behavior:**

- Wraps resolver and entire middleware chain in try-catch
- Catches all errors (from auth, permission, validation, resolver)
- Detects error type by message prefix:
  - `UNAUTHENTICATED` → GraphQL code: `UNAUTHENTICATED`
  - `UNAUTHORIZED` → GraphQL code: `FORBIDDEN`
  - `VALIDATION_ERROR` → GraphQL code: `BAD_USER_INPUT`
  - Other errors → GraphQL code: `INTERNAL_SERVER_ERROR`
- Logs unexpected errors to console
- Returns formatted error object with extensions

**Error Format:**

```typescript
{
  message: string,
  extensions: {
    code: "UNAUTHENTICATED" | "FORBIDDEN" | "BAD_USER_INPUT" | "INTERNAL_SERVER_ERROR"
  }
}
```

**Relation to Others:**

- Wraps ALL other middleware + resolver execution
- Executes OUTERMOST in middleware chain (after everything else fails)
- Catches errors from auth, permission, validation, AND resolver itself

---

## 🔄 ORCHESTRATION FUNCTIONS

### 5. Execute Middleware (`executeMiddleware`)

**Purpose:** Orchestrates sequential execution of all active middleware

**Location:** Lines 158-172

**Function Signature:**

```typescript
async function executeMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void>;
```

**Execution Order:**

1. **Auth** → `authMiddleware()`
2. **Permission** → `permissionMiddleware()`
3. **Validation** → `validationMiddleware()`

**Early Termination:** ✅

- Each middleware returns early if not applicable
- Example: If `requireAuth` is false, `authMiddleware()` returns immediately
- Earlier middleware can throw, which halts the chain and goes to error handler

**Design Note:** This function is intentionally INTERNAL (not exported) to enforce the fixed order. This is intentional to ensure consistent middleware ordering across all resolvers.

---

### 6. Resolver Wrapper (`withMiddleware`)

**Purpose:** High-level wrapper that combines middleware orchestration + error handling into a single function

**Location:** Lines 174-210

**Function Signature:**

```typescript
export function withMiddleware<TParent, TArgs, TContext, TResult>(
  resolver: (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
  ) => Promise<TResult> | TResult,
  options: MiddlewareOptions = {},
);
```

**Flow:**

```
Input: resolver function + middleware options
  ↓
Skip middleware if options.skipMiddleware = true?
  ├─ YES → Execute resolver directly, skip all middleware
  └─ NO → Continue
  ↓
Execute all middleware (via executeMiddleware)
  ├─ If any middleware throws → Error handler catches it
  └─ If all pass → Execute resolver
  ↓
Execute resolver function
  ├─ If resolver throws → Error handler catches it
  └─ If resolver succeeds → Return result
  ↓
Error handler formats all errors for GraphQL
  ↓
Return result or formatted error
```

**Usage Pattern:**

```typescript
// Query resolver
export const employee = withMiddleware(
  async (parent, { id }, context) => {
    return await context.services.employee.findById(id);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:read"],
  },
);

// Mutation resolver
export const createEmployee = withMiddleware(
  async (parent, { input }, context) => {
    return await context.services.employee.create(input);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:create"],
    validate: (args) => args.input.firstName?.length > 0,
  },
);
```

**Generic Type Parameters:**

- `TParent` - Parent resolver type (usually unused in root Query/Mutation)
- `TArgs` - Resolver arguments type
- `TContext` - GraphQL context type (ServiceContext)
- `TResult` - Resolver return type

**Skip Option:**

```typescript
withMiddleware(resolver, {
  skipMiddleware: true, // ← Bypasses ALL middleware for public endpoints
});
```

---

### 7. Middleware Composer (`composeMiddleware`)

**Purpose:** Combines multiple middleware options into a single options object

**Location:** Lines 212-242

**Function Signature:**

```typescript
export function composeMiddleware(
  ...options: MiddlewareOptions[]
): MiddlewareOptions;
```

**Behavior:**

- Merges multiple `MiddlewareOptions` into one
- `requireAuth`: OR logic (if any option requires auth, result requires auth)
- `requiredPermissions`: Array concatenation + deduplication
- `validate`: Creates composite validator that runs all validation functions
- `skipMiddleware`: OR logic (if any option skips, result skips)

**Usage:**

```typescript
const baseOptions = { requireAuth: true };
const readPermissions = { requiredPermissions: ["employee:read"] };
const validateId = { validate: (args) => args.id.length > 0 };

const composed = composeMiddleware(baseOptions, readPermissions, validateId);
// Result:
// {
//   requireAuth: true,
//   requiredPermissions: ["employee:read"],
//   validate: [composite function that runs all 3 validators]
// }

withMiddleware(resolver, composed);
```

**Deduplication:** ✅

- Permissions are deduplicated: `["employee:read", "employee:read"]` → `["employee:read"]`

---

## 🛠️ HELPER FUNCTIONS

### 8. Check User Permission (`checkUserPermission`)

**Purpose:** Query logic to determine if a user has a specific permission

**Location:** Lines 244-259

**Function Signature:**

```typescript
async function checkUserPermission(
  userId: string,
  resource: string,
  action: string,
  context: ServiceContext,
): Promise<boolean>;
```

**Current Implementation:** Stub/Placeholder

- ✅ Accepts all parameters needed for real implementation
- ❌ Always returns `true` (all authenticated users have all permissions)

**⚠️ TODO - Fill with actual logic:**

```typescript
async function checkUserPermission(
  userId: string,
  resource: string,
  action: string,
  context: ServiceContext,
): Promise<boolean> {
  // Option 1: Check user role
  const user = await context.services.user.findById(userId);
  const role = user.role; // "ADMIN" | "MANAGER" | "EMPLOYEE"

  // Option 2: Check against ACL database
  const permission = await context.services.permission.check({
    userId,
    resource,
    action,
  });

  // Option 3: Check JWT claims
  const claims = context.auth?.claims;
  return claims?.scopes?.includes(`${resource}:${action}`);

  // Option 4: Role-based matrix
  const roleMatrix = {
    ADMIN: ["*:*"], // All permissions
    MANAGER: ["employee:*", "department:read"], // Wildcard support
    EMPLOYEE: ["employee:read"],
  };

  // Result: boolean
  return hasPermission;
}
```

**Role-Based Example:**

```typescript
// User: MANAGER
// Check: "employee:read" → ✅ TRUE (covered by "employee:*")
// Check: "company:delete" → ❌ FALSE
```

**Caching Opportunity:**

```typescript
// Cache user permissions per-request to avoid repeated DB hits
context.permissionCache ??= new Map();
const cacheKey = `${userId}:${resource}:${action}`;
if (context.permissionCache.has(cacheKey)) {
  return context.permissionCache.get(cacheKey);
}
```

---

## 📋 MIDDLEWARE PRESETS

**Purpose:** Pre-configured middleware options for common scenarios

**Location:** Lines 261-309

### Public (No Auth Required)

```typescript
export const PUBLIC = {};
```

- No authentication required
- No permissions checked
- No validation
- Query example: `health`, `publicStats`

### Authenticated Users Only

```typescript
export const AUTHENTICATED = {
  requireAuth: true,
};
```

- Authentication required
- No specific permissions checked
- Query example: `me` (current user)

### Admin Only

```typescript
export const ADMIN_ONLY = {
  requireAuth: true,
  requiredPermissions: ["admin:all"],
};
```

- Authentication required
- Admin-level permissions required
- Mutation example: `createCompany`, `deleteUser`

### Resource Write Operations

```typescript
export const RESOURCE_WRITE = (resource: string) => ({
  requireAuth: true,
  requiredPermissions: [`${resource}:write`, `${resource}:update`],
});
```

- Authentication required
- Write + Update permissions on resource
- Usage: `withMiddleware(updateEmployee, RESOURCE_WRITE("employee"))`
- Mutation example: `updateEmployee`, `updateDepartment`

### Resource Delete Operations

```typescript
export const RESOURCE_DELETE = (resource: string) => ({
  requireAuth: true,
  requiredPermissions: [`${resource}:delete`],
});
```

- Authentication required
- Delete permission on resource
- Usage: `withMiddleware(deleteEmployee, RESOURCE_DELETE("employee"))`
- Mutation example: `deleteEmployee`

### Resource Read Operations

```typescript
export const RESOURCE_READ = (resource: string) => ({
  requiredPermissions: [`${resource}:read`],
});
```

- No authentication strictly required (permission check implies user)
- Read permission on resource
- Usage: `withMiddleware(getEmployee, RESOURCE_READ("employee"))`
- Query example: `employee`, `employees`

---

## ❌ MISSING MIDDLEWARE

These should be added to the system for production readiness:

### 1. Rate Limiting Middleware

**Purpose:** Prevent request flooding and API abuse

**Should Handle:**

- Per-user rate limits (e.g., 100 requests/minute)
- Per-IP rate limits (e.g., 1000 requests/minute)
- Per-operation limits (mutations more restrictive than queries)
- Configurable burst allowance
- Graceful degradation when limits exceeded

**Error Type:** `RATE_LIMITED` → GraphQL code: `TOO_MANY_REQUESTS`

**Implementation Options:**

- Redis-based buckets
- In-memory counters with cleanup
- Token bucket algorithm
- Sliding window counters

**Usage:**

```typescript
withMiddleware(resolver, {
  rateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    perUser: true,
  },
});
```

---

### 2. Caching Middleware

**Purpose:** Cache resolver results based on arguments to improve performance

**Should Handle:**

- Cache key generation from args
- TTL (time-to-live) configuration
- Invalidation signals
- User-scoped caching (different users see different cache)
- Cache warming/preloading

**Error Type:** None (transparent middleware)

**Implementation Options:**

- Redis-based cache
- In-memory LRU cache
- Apollo datasource cache integration
- Service-level cache

**Usage:**

```typescript
withMiddleware(resolver, {
  cache: {
    ttl: 300, // 5 minutes
    key: (args) => `employee:${args.id}`,
    invalidateOn: ["employeeUpdated"], // Invalidate on events
  },
});
```

**Relationship to Services:**

- Services should handle business logic caching
- Middleware can handle result caching
- Avoid duplicate caching layers

---

### 3. Logging & Monitoring Middleware

**Purpose:** Track performance, access patterns, and debugging

**Should Handle:**

- Log execution time
- Log resolver name and arguments
- Track success/error rates
- Capture user context
- Metrics collection
- Performance tracing/APM integration

**Error Type:** None (transparent middleware)

**Usage:**

```typescript
withMiddleware(resolver, {
  logging: {
    logArgs: true,
    logResult: false, // Don't log sensitive data
    slowThreshold: 1000, // Log if slower than 1s
  },
});
```

**Implementation:**

```typescript
{
  timestamp: "2026-02-25T21:30:00Z",
  user: "user-123",
  resolver: "employee",
  field: "employee",
  args: { id: "emp-456" },
  duration: 156,  // ms
  status: "success" | "error",
  error?: string
}
```

---

### 4. Request Context Middleware

**Purpose:** Initialize and populate context for each request

**Should Handle:**

- User information loading
- Permission cache initialization
- Request ID generation
- Correlation ID tracking
- Timezone/locale setup

**Error Type:** None (initialization layer)

**Current Status:** Likely handled elsewhere (`server/graphql/context-builder/`)

**Should Move Here?** Consider consolidating context initialization as middleware

---

### 5. Timeout Middleware

**Purpose:** Abort resolvers that take too long to complete

**Should Handle:**

- Per-resolver timeout configuration
- Default timeout fallback
- Graceful cancellation
- Resource cleanup on timeout

**Error Type:** `TIMEOUT` → GraphQL code: `TIMEOUT`

**Usage:**

```typescript
withMiddleware(resolver, {
  timeout: 30000, // 30 seconds
});
```

**Implementation:** Use `AbortController` or `Promise.race()`

**Critical for:**

- Database queries
- External API calls
- Complex aggregations

---

### 6. Input Sanitization Middleware

**Purpose:** Clean and validate string inputs to prevent injection attacks

**Should Handle:**

- Trim whitespace
- Remove control characters
- Escape HTML entities
- Length validation
- Pattern validation (email, URL, etc.)

**Error Type:** `INVALID_INPUT` → GraphQL code: `BAD_USER_INPUT`

**Usage:**

```typescript
withMiddleware(resolver, {
  sanitize: {
    fields: ["firstName", "lastName"],
    rules: {
      maxLength: 100,
      pattern: /^[a-zA-Z\s]+$/,
    },
  },
});
```

**Execution Order:** Should run AFTER validation middleware

---

### 7. Data Transformation Middleware

**Purpose:** Transform input data before passing to resolver

**Should Handle:**

- Type coercion
- Date parsing
- Money formatting
- Array normalization
- Enum validation

**Error Type:** `TRANSFORMATION_ERROR` → GraphQL code: `BAD_USER_INPUT`

**Usage:**

```typescript
withMiddleware(resolver, {
  transform: (args) => ({
    ...args,
    startDate: new Date(args.startDate),
    salary: parseFloat(args.salary),
    enabled: args.enabled === "true" || args.enabled === true,
  }),
});
```

**Execution Order:** Should run BEFORE validation middleware

---

## 📐 ARCHITECTURE DECISIONS

### Fixed Order vs Composable

**Current:** Fixed execution order (Auth → Permission → Validation)

**Pros:**

- ✅ Predictable behavior
- ✅ Clear mental model
- ✅ Easy to debug
- ✅ Consistent across all resolvers

**Cons:**

- ❌ Can't reorder middleware
- ❌ Can't conditionally skip individual middleware (except top-level `skipMiddleware`)

**Future Improvement:** Make middleware chainable while maintaining sensible defaults

```typescript
// Proposed (composable but ordered by design):
withMiddleware(resolver)
  .auth({ requireAuth: true })
  .permission(["employee:read"])
  .validate((args) => args.id.length > 0)
  .logging({ logArgs: true })
  .rateLimit({ maxRequests: 100 })
  .build();
```

### Error Handling Strategy

**Current:** Try-catch wrapper with error code detection by message prefix

**Pros:**

- ✅ Simple implementation
- ✅ Works with all middleware
- ✅ Consistent error format

**Cons:**

- ❌ Fragile error detection (depends on message strings)
- ❌ No custom error classes
- ❌ Hard to identify exact error source

**Future Improvement:** Use custom error classes

```typescript
// Instead of:
throw new Error("UNAUTHENTICATED: User must be logged in");

// Use:
throw new UnauthenticatedError("User must be logged in");

// Or:
throw new GraphQLError("User must be logged in", {
  extensions: { code: "UNAUTHENTICATED" },
});
```

---

## 📊 MIDDLEWARE EXECUTION MATRIX

| Middleware    | Default | Configurable             | Early Exit | Async  |
| ------------- | ------- | ------------------------ | ---------- | ------ |
| Auth          | OFF     | ✅ `requireAuth`         | ✅ Yes     | ❌ No  |
| Permission    | OFF     | ✅ `requiredPermissions` | ✅ Yes     | ✅ Yes |
| Validation    | OFF     | ✅ `validate`            | ✅ Yes     | ✅ Yes |
| Error Handler | ON      | ❌ Always                | N/A        | N/A    |

---

## 🔌 CONTEXT INTERFACE

```typescript
interface ServiceContext {
  // User info
  userId?: string;
  user?: User;
  auth?: {
    claims?: Record<string, any>;
    scopes?: string[];
  };

  // Company/Organization
  companyId?: string;

  // Services
  services: {
    employee: EmployeeService;
    department: DepartmentService;
    // ... other services
  };

  // Optional: Can be extended with middleware-specific fields
  permissionCache?: Map<string, boolean>; // For caching permissions
  requestId?: string; // For logging
  startTime?: number; // For performance tracking
}
```

---

## 🚀 RECOMMENDATIONS

### Priority 1 (Critical)

1. **Implement `checkUserPermission()`** - Currently a stub
2. **Add Logging Middleware** - For debugging and monitoring
3. **Add Rate Limiting Middleware** - For security

### Priority 2 (Important)

4. **Add Timeout Middleware** - Prevent hanging requests
5. **Add Caching Middleware** - Performance optimization
6. **Add Input Sanitization Middleware** - Security

### Priority 3 (Nice to Have)

7. **Add Data Transformation Middleware** - Developer experience
8. **Convert to Custom Error Classes** - Better error handling
9. **Add Middleware Composition API** - More flexible ordering

---

## 📚 USAGE EXAMPLES

### Example 1: Simple Query

```typescript
export const employee = withMiddleware(async (_, { id }, context) => {
  return await context.services.employee.findById(id);
}, RESOURCE_READ("employee"));
```

### Example 2: Complex Mutation

```typescript
export const createEmployee = withMiddleware(
  async (_, { input }, context) => {
    // Validation already passed in middleware
    return await context.services.employee.create(input);
  },
  composeMiddleware(RESOURCE_WRITE("employee"), {
    validate: (args) => {
      return (
        args.input.firstName?.length > 0 && args.input.email?.includes("@")
      );
    },
    validationMessage: "Invalid employee data",
  }),
);
```

### Example 3: Admin-Only Operation

```typescript
export const deleteEmployee = withMiddleware(
  async (_, { id }, context) => {
    return await context.services.employee.delete(id);
  },
  composeMiddleware(ADMIN_ONLY, RESOURCE_DELETE("employee")),
);
```

### Example 4: Public Endpoint

```typescript
export const health = withMiddleware(async () => {
  return { status: "OK", timestamp: new Date() };
}, PUBLIC);
```

---

## 📝 FILES & LOCATIONS

- **Main middleware:** `server/graphql/middleware/index.ts`
- **Context definition:** `server/graphql/context.ts`
- **Context builder:** `server/graphql/context-builder/context-builder.ts`
- **Resolver examples:** `server/graphql/resolvers/core/employee/*.ts`

---

**Last Updated:** February 25, 2026  
**Status:** Documented (Implementation pending for missing middleware)
