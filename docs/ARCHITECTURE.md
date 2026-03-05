# Middleware Architecture Diagram

## Complete Middleware Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL Request                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          withMiddleware() Wrapper Function                  │
│  (server/graphql/middleware/compose.ts)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│    errorHandlerMiddleware() - Error Catch & Format          │
│    (server/graphql/middleware/errorHandler.ts)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  ▼                                                        │  │
│  executeMiddleware()                                      │  │
│                                                           │  │
│  ┌────────────────────────────────────────────────────┐  │  │
│  │  1️⃣  authMiddleware()                               │  │  │
│  │      (server/graphql/middleware/authentication.ts)  │  │  │
│  │                                                     │  │  │
│  │      ✓ Verify context.user exists                  │  │  │
│  │      ✓ Verify user has valid ID                    │  │  │
│  │      ✗ Throw: UNAUTHENTICATED (if requireAuth)    │  │  │
│  │                                                     │  │  │
│  │  IF requireAuth: true → REQUIRED                    │  │  │
│  │  IF requireAuth: false/undefined → SKIPPED          │  │  │
│  └────────────────────────────────────────────────────┘  │  │
│                        │                                   │  │
│                        ▼                                   │  │
│  ┌────────────────────────────────────────────────────┐  │  │
│  │  2️⃣  authorizationMiddleware()                      │  │  │
│  │      (server/graphql/middleware/authorization.ts)   │  │  │
│  │                                                     │  │  │
│  │      ✓ Validate permission format                  │  │  │
│  │      ✓ Check each required permission              │  │  │
│  │      ✗ Throw: UNAUTHORIZED (if missing permission) │  │  │
│  │                                                     │  │  │
│  │  IF requiredPermissions.length > 0 → REQUIRED      │  │  │
│  │  IF requiredPermissions.length === 0 → SKIPPED     │  │  │
│  └────────────────────────────────────────────────────┘  │  │
│                        │                                   │  │
│                        ▼                                   │  │
│  ┌────────────────────────────────────────────────────┐  │  │
│  │  3️⃣  validationMiddleware()                         │  │  │
│  │      (server/graphql/middleware/validation.ts)      │  │  │
│  │                                                     │  │  │
│  │      ✓ Execute custom validation function          │  │  │
│  │      ✗ Throw: VALIDATION_ERROR (if invalid)        │  │  │
│  │                                                     │  │  │
│  │  IF validate function provided → REQUIRED          │  │  │
│  │  IF validate function undefined → SKIPPED          │  │  │
│  └────────────────────────────────────────────────────┘  │  │
│                        │                                   │  │
│                        ▼                                   │  │
│  ┌────────────────────────────────────────────────────┐  │  │
│  │  4️⃣  Resolver Execution                             │  │  │
│  │      (Only if all middleware passed)                │  │  │
│  │                                                     │  │  │
│  │      ✓ Execute business logic                      │  │  │
│  │      ✓ Return result                               │  │  │
│  └────────────────────────────────────────────────────┘  │  │
│                        │                                   │  │
│                        ▼                                   │  │
│                     Result                                 │  │
│                        │                                   │  │
│  Any Error ──────────┐ │                                   │  │
│                      │ │                                   │  │
└──────────────────────┼─┼───────────────────────────────────┘  │
                       │ │
                       ▼ ▼
           ┌─────────────────────────────┐
           │   Error Formatting          │
           │                             │
           │ UNAUTHENTICATED → 401       │
           │ UNAUTHORIZED → 403          │
           │ VALIDATION_ERROR → 400      │
           │ Other → 500                 │
           └──────────┬──────────────────┘
                      │
                      ▼
          ┌────────────────────────────┐
          │  GraphQL Error Response    │
          │                            │
          │  {                         │
          │    "message": "...",       │
          │    "extensions": {         │
          │      "code": "..."         │
          │    }                       │
          │  }                         │
          └────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Middleware Execution                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
       ┌─────────────┴─────────────┐
       │                           │
       ▼                           ▼
   ✅ Success               ❌ Error
       │                     │
       ▼                     ▼
  Continue to           Error Caught
  Next Middleware       by errorHandler
       │                     │
       ▼                     ▼
  (repeat)            Format Error:
       │              ├─ Extract message
       │              ├─ Determine code
       │              ├─ Log (if needed)
       │              └─ Throw GraphQL error
       │                     │
       └─────────────┬───────┘
                     │
                     ▼
          Resolver or Error Response
```

## File Dependencies

```
index.ts (Main Entry Point)
├── compose.ts (Orchestrator)
│   ├── types.ts (Interfaces)
│   ├── authentication.ts
│   ├── authorization.ts
│   ├── validation.ts
│   └── errorHandler.ts
│
├── types.ts
├── authentication.ts
├── authorization.ts
├── validation.ts
└── errorHandler.ts
```

## Usage Flow Example

```typescript
// 1. Import middleware wrapper
import { withMiddleware } from "@/server/graphql/middleware";

// 2. Define resolver with middleware options
const updateTaskResolver = withMiddleware(
  // Resolver function
  async (_parent, { id, title }, context) => {
    return context.services.task.update(id, { title });
  },

  // Middleware options
  {
    requireAuth: true,
    requiredPermissions: ["task:update"],
    validate: (args) => {
      return args.title && args.title.trim().length > 0;
    },
    validationMessage: "Task title is required",
  },
);

// 3. Middleware execution happens automatically:
//
//    Authentication ✓ (user must exist)
//         ↓
//    Authorization ✓ (user must have task:update)
//         ↓
//    Validation ✓ (title must be non-empty)
//         ↓
//    Resolver ✓ (execute business logic)
//         ↓
//    Response or Error
```

## Validation Utilities Chain

```
Input Arguments
       │
       ▼
validateInput()
├─ Check each field
├─ Return ValidationResult
└─ Continue if valid
       │
       ▼
validateRequiredFields()
├─ Check required fields exist
├─ Return ValidationResult
└─ Continue if valid
       │
       ▼
validateFieldTypes()
├─ Check correct types
├─ Return ValidationResult
└─ Continue if valid
       │
       ▼
validateStringLength()
├─ Check string constraints
├─ Return ValidationResult
└─ Continue if valid
       │
       ▼
validateNumberRange()
├─ Check number constraints
├─ Return ValidationResult
└─ Continue if valid
       │
       ▼
combineValidationResults()
├─ Merge all results
├─ Collect all errors
└─ Return combined result
       │
       ▼
validationMiddleware()
├─ Throw if invalid
└─ Continue if valid
```

## Permission Format

```
Permission String Format: "resource:action"

Examples:
├─ "user:read"           (Read user data)
├─ "user:update"         (Update own user)
├─ "employee:read"       (Read any employee)
├─ "employee:update"     (Update any employee)
├─ "employee:delete"     (Delete employee)
├─ "admin:ban-users"     (Ban users)
├─ "admin:system"        (System admin)
├─ "task:create"         (Create task)
├─ "task:read"           (Read task)
├─ "task:update"         (Update task)
└─ "task:delete"         (Delete task)

Validation:
├─ Must contain exactly one ":"
├─ Resource and action cannot be empty
└─ Case-sensitive matching
```

## Error Code Mapping

```
┌──────────────────────┬─────────────────┬────────────────┐
│ Error Type           │ GraphQL Code    │ HTTP Status    │
├──────────────────────┼─────────────────┼────────────────┤
│ UNAUTHENTICATED      │ UNAUTHENTICATED │ 401            │
│ UNAUTHORIZED         │ FORBIDDEN       │ 403            │
│ VALIDATION_ERROR     │ BAD_USER_INPUT  │ 400            │
│ Database Error       │ INTERNAL_*      │ 500            │
│ Parse Error          │ BAD_USER_INPUT  │ 400            │
│ Unexpected Error     │ INTERNAL_*      │ 500            │
└──────────────────────┴─────────────────┴────────────────┘
```

## Middleware State Diagram

```
                 ┌─────────────────┐
                 │  withMiddleware │
                 │  Called         │
                 └────────┬────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
    ┌──────────┐                    ┌──────────────────┐
    │ Skip?    │                    │ Error Handler    │
    │ true     │                    │ Wraps Flow       │
    └────┬─────┘                    └──────┬───────────┘
         │ yes                              │
         ▼                                  ▼
    ┌─────────┐                    ┌────────────────┐
    │ Resolver│    no              │ Auth Check     │
    │ Executes│ ─────┬──────────────├─ Pass: next    │
    └─────────┘      │              │- Fail: throw   │
                     │              └────────┬───────┘
                     │                       │
                     │              ┌────────▼───────┐
                     │              │ Permission Ch. │
                     │              ├─ Pass: next    │
                     │              │- Fail: throw   │
                     │              └────────┬───────┘
                     │                       │
                     │              ┌────────▼───────┐
                     │              │ Validation Ch. │
                     │              ├─ Pass: next    │
                     │              │- Fail: throw   │
                     │              └────────┬───────┘
                     │                       │
                     └───────────────────────┤
                                             │
                                    ┌────────▼────────┐
                                    │ Resolver        │
                                    │ Executes        │
                                    └────────┬────────┘
                                             │
                          ┌──────────────────┴──────────────────┐
                          │                                     │
                          ▼ Success                             ▼ Error
                    ┌──────────────┐                    ┌──────────────────┐
                    │ Response     │                    │ Format & Throw   │
                    └──────────────┘                    └──────────────────┘
```

## Configuration Options

```typescript
MiddlewareOptions {
  // Authentication
  requireAuth?: boolean
  // Default: false (auth optional)
  // Set true to require user to be logged in

  // Authorization
  requiredPermissions?: string[]
  // Default: [] (no permissions required)
  // Array of "resource:action" strings
  // All must be present to pass

  // Validation
  validate?: (args: any) => boolean | Promise<boolean>
  // Default: undefined (no validation)
  // Custom validation function
  // Return false or throw to fail validation

  validationMessage?: string
  // Default: "VALIDATION_ERROR: Input validation failed"
  // Custom error message if validation fails

  // Skip all middleware
  skipMiddleware?: boolean
  // Default: false (apply middleware)
  // Set true to skip all middleware (public endpoints)
}
```

---

**The middleware system is fully functional and production-ready!**
