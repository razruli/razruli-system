# GraphQL Middleware - Quick Reference Card

## Import

```typescript
import { withMiddleware } from "@/server/graphql/middleware";
```

## Basic Usage

```typescript
// Protected resolver
resolver: withMiddleware(resolverFn, { requireAuth: true });
```

## Options

```typescript
{
  requireAuth?: boolean,                    // Require user logged in
  requiredPermissions?: string[],           // Require "resource:action"
  validate?: (args: any) => boolean,        // Custom validation
  validationMessage?: string,               // Custom error message
  skipMiddleware?: boolean                  // Skip all middleware (public)
}
```

## Common Patterns

### ✨ Authentication Only

```typescript
withMiddleware(fn, { requireAuth: true });
```

### 🔑 With Permissions

```typescript
withMiddleware(fn, {
  requireAuth: true,
  requiredPermissions: ["task:update"],
});
```

### ✅ With Validation

```typescript
withMiddleware(fn, {
  requireAuth: true,
  validate: (args) => args.id && args.id.length > 0,
  validationMessage: "ID is required",
});
```

### 🌐 Public (No Middleware)

```typescript
withMiddleware(fn, { skipMiddleware: true });
```

### 🧩 Composition

```typescript
const config = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["admin:manage"] },
);
withMiddleware(fn, config);
```

## Validation Helpers

```typescript
import {
  validateInput,
  validateRequiredFields,
  validateFieldTypes,
  validateStringLength,
  validateNumberRange,
  combineValidationResults,
} from "@/server/graphql/middleware";

// Validate with custom checks
validateInput(args, [
  { field: "email", check: (v) => v.includes("@"), message: "..." },
]);

// Validate required
validateRequiredFields(args, ["email", "name"]);

// Validate types
validateFieldTypes(args, [{ field: "age", expectedType: "number" }]);

// Validate lengths
validateStringLength("name", 1, 100);
validateNumberRange(age, 18, 120);

// Combine results
combineValidationResults(result1, result2, result3);
```

## Error Codes

| Error              | Code                  | Status |
| ------------------ | --------------------- | ------ |
| Not logged in      | UNAUTHENTICATED       | 401    |
| Missing permission | FORBIDDEN             | 403    |
| Invalid input      | BAD_USER_INPUT        | 400    |
| System error       | INTERNAL_SERVER_ERROR | 500    |

## Permission Format

`"resource:action"`

Examples:

- `"user:read"` - Read user
- `"task:update"` - Update task
- `"admin:manage"` - Admin panel

## Full Examples

### Query: Get User (Auth Required)

```typescript
user: withMiddleware(
  async (_parent, { id }, context) => {
    return context.services.user.findById(id);
  },
  { requireAuth: true },
);
```

### Mutation: Update Employee (With Permissions)

```typescript
updateEmployee: withMiddleware(
  async (_parent, { id, data }, context) => {
    return context.services.employee.update(id, data);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:update"],
  },
);
```

### Mutation: Create Task (With Validation)

```typescript
createTask: withMiddleware(
  async (_parent, { title, description }, context) => {
    return context.services.task.create({ title, description });
  },
  {
    requireAuth: true,
    validate: (args) => args.title && args.title.trim().length > 0,
    validationMessage: "Title is required",
  },
);
```

## Execution Order

1. ✓ Check authentication (if requireAuth)
2. ✓ Check permissions (if requiredPermissions)
3. ✓ Run validation (if validate function)
4. ✓ Execute resolver (if all pass)

**If any step fails, resolver never executes!**

## Testing

```typescript
// Test auth requirement
const resolver = withMiddleware(fn, { requireAuth: true });
expect(resolver(parent, args, { user: null })).rejects.toThrow(
  "UNAUTHENTICATED",
);

// Test validation
const resolver = withMiddleware(fn, {
  validate: (args) => args.id.length > 0,
});
expect(resolver(parent, { id: "" }, context)).rejects.toThrow(
  "VALIDATION_ERROR",
);
```

## Tips

1. **Always type your args:** `async (_parent, args: MyArgs, context)`
2. **User is guaranteed to exist:** if `requireAuth: true`, use `context.user!.id`
3. **Validation is synchronous:** return `true`/`false`, or use `async`
4. **Compose middleware:** Reuse configs with `composeMiddleware()`
5. **Public endpoints:** Use `{ skipMiddleware: true }` for public access

## What Gets Validated?

```
Input Data (args)
     ↓
✓ Auth required?       → Check user exists
     ↓
✓ Permissions?          → Check user has all
     ↓
✓ Validation function? → Custom checks pass
     ↓
✓ All PASS?            → Resolver executes (safe!)
```

## Files to Know

- **index.ts** - Main entry point
- **compose.ts** - withMiddleware & orchestration
- **authentication.ts** - Auth checking
- **authorization.ts** - Permission checking
- **validation.ts** - Validation utilities
- **errorHandler.ts** - Error formatting
- **README.md** - Full documentation
- **EXAMPLES.ts** - Real-world usage

## Error Response Example

```json
{
  "errors": [
    {
      "message": "Missing permission \"task:update\"",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

---

**Start using middleware now!**

```typescript
import { withMiddleware } from "@/server/graphql/middleware";
resolver: withMiddleware(fn, { requireAuth: true });
```
