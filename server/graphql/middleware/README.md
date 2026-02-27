# GraphQL Middleware System

Complete middleware orchestration system for GraphQL resolvers with proper separation of concerns.

## Structure

```
middleware/
├── index.ts              # Main entry point (re-exports all modules)
├── types.ts              # Shared TypeScript types
├── compose.ts            # Main orchestrator & withMiddleware wrapper
├── authentication.ts     # Auth validation middleware
├── authorization.ts      # Permission checking middleware
├── validation.ts         # Input validation middleware
└── errorHandler.ts       # Error formatting & handling
```

## File Descriptions

### `types.ts`

Defines shared types used across all middleware:

- `MiddlewareOptions`: Configuration for withMiddleware
- `MiddlewareContext`: Context passed to middleware functions
- `ValidationResult`: Result from validation functions

### `authentication.ts`

Validates that users are authenticated when required.

- Checks `context.user` existence
- Verifies user has valid ID
- Throws `UNAUTHENTICATED` errors

### `authorization.ts`

Checks user permissions using resource:action format.

- Validates permission format
- Checks each required permission
- Throws `UNAUTHORIZED` errors
- TODO: Implement actual permission checking against database

### `validation.ts`

Validates input arguments with comprehensive utilities:

- `validationMiddleware()`: Main validation function
- `validateInput()`: Validate with custom checks
- `validateRequiredFields()`: Check required fields
- `validateFieldTypes()`: Validate field types
- `validateStringLength()`: Validate string length
- `validateNumberRange()`: Validate number ranges
- `combineValidationResults()`: Merge multiple results

### `errorHandler.ts`

Formats errors consistently for GraphQL responses.

- Maps error types to GraphQL error codes
- Handles authentication, authorization, validation, and system errors
- Logs errors appropriately
- `createGraphQLError()`: Manual error creation

### `compose.ts`

Main orchestrator that brings everything together:

- `executeMiddleware()`: Runs all middleware in order
- `withMiddleware()`: Wraps resolvers with complete middleware
- `composeMiddleware()`: Merges multiple middleware configurations

## Execution Flow

```
Request
  ↓
withMiddleware wrapper
  ↓
errorHandlerMiddleware (wraps entire flow)
  ├─ executeMiddleware
  │  ├─ authMiddleware (if requireAuth: true)
  │  ├─ authorizationMiddleware (if requiredPermissions)
  │  └─ validationMiddleware (if validate function)
  ↓
Resolver (if all middleware passes)
  ↓
Response or Error
```

## Usage Examples

### Basic Authentication

```typescript
import { withMiddleware } from "@/server/graphql/middleware";

export const Query = {
  user: withMiddleware(
    async (_parent, { id }, context) => {
      return context.services.user.findById(id);
    },
    { requireAuth: true },
  ),
};
```

### With Permissions

```typescript
export const Mutation = {
  updateEmployee: withMiddleware(
    async (_parent, { id, data }, context) => {
      return context.services.employee.update(id, data);
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:update"],
    },
  ),
};
```

### With Custom Validation

```typescript
export const Mutation = {
  createTask: withMiddleware(
    async (_parent, { title, description }, context) => {
      return context.services.task.create({ title, description });
    },
    {
      requireAuth: true,
      validate: (args) => {
        return args.title && args.title.trim().length > 0;
      },
      validationMessage: "Task title is required and cannot be empty",
    },
  ),
};
```

### Complex Validation with Utilities

```typescript
import {
  withMiddleware,
  validateInput,
  validateRequiredFields,
} from "@/server/graphql/middleware";

export const Mutation = {
  updateProfile: withMiddleware(
    async (_parent, args, context) => {
      return context.services.user.updateProfile(context.user.id, args);
    },
    {
      requireAuth: true,
      validate: (args) => {
        // Check required fields
        const requiredResult = validateRequiredFields(args, ["email", "name"]);
        if (!requiredResult.valid) return false;

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(args.email);
      },
      validationMessage: "Invalid profile data",
    },
  ),
};
```

### Compose Multiple Options

```typescript
import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";

const authAndPermissions = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:read", "employee:update"] },
  { validate: (args) => args.id && args.id.length > 0 },
);

export const Query = {
  employee: withMiddleware(async (_parent, { id }, context) => {
    return context.services.employee.findById(id);
  }, authAndPermissions),
};
```

### Public Resolver (Skip Middleware)

```typescript
export const Query = {
  publicData: withMiddleware(
    async (_parent, _args, context) => {
      return context.services.public.getData();
    },
    { skipMiddleware: true },
  ),
};
```

## Error Codes

Middleware automatically maps errors to GraphQL error codes:

| Error Type       | GraphQL Code          | HTTP Status |
| ---------------- | --------------------- | ----------- |
| UNAUTHENTICATED  | UNAUTHENTICATED       | 401         |
| UNAUTHORIZED     | FORBIDDEN             | 403         |
| VALIDATION_ERROR | BAD_USER_INPUT        | 400         |
| Default          | INTERNAL_SERVER_ERROR | 500         |

## Implementation TODOs

1. **Authorization (`authorization.ts`)**
   - Implement `checkUserPermission()` with actual database queries
   - Support role-based access control (RBAC)
   - Support resource-based access control (RBAC)
   - Add permission caching

2. **Validation (`validation.ts`)**
   - Add more validation utilities as needed
   - Consider adding regex validation
   - Add array validation
   - Add custom validators

3. **Error Handling (`errorHandler.ts`)**
   - Add structured error logging
   - Add error telemetry
   - Add error context/traces

## Best Practices

1. **Always use typed arguments** in resolvers
2. **Order middlewares logically**: Auth → Authorization → Validation
3. **Provide clear validation messages** for better UX
4. **Use compose** for reusable middleware combinations
5. **Implement actual permission checking** before production
6. **Log all auth failures** for security monitoring
7. **Use specific error codes** for client handling

## Testing

```typescript
import { withMiddleware } from "@/server/graphql/middleware";

describe("Middleware", () => {
  it("should require authentication", async () => {
    const resolver = withMiddleware(async () => ({ id: "1" }), {
      requireAuth: true,
    });

    const context = { user: null };
    expect(() => resolver(null, {}, context as any)).rejects.toThrow(
      "UNAUTHENTICATED",
    );
  });

  it("should validate input", async () => {
    const resolver = withMiddleware(async () => ({ id: "1" }), {
      validate: (args) => args.id && args.id.length > 0,
      validationMessage: "ID is required",
    });

    const context = { user: { id: "user1" } };
    expect(() => resolver(null, { id: "" }, context as any)).rejects.toThrow(
      "ID is required",
    );
  });
});
```
