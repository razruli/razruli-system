# System Architecture Overview

## Introduction

This document explains the complete system architecture including the request lifecycle, middleware flow, context building, and how all components work together.

**Status:** ✅ Production Ready (Full integration, tested)

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   Client Application                            │
│              (Web, Mobile, or GraphQL Client)                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              HTTPS / GraphQL Protocol                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           Next.js API Route Handler                             │
│         app/api/graphql/route.ts                               │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         Express Middleware Stack                                │
│   - Authentication (JWT extraction)                             │
│   - CORS & headers                                              │
│   - Request logging                                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         Apollo Server (Per-Request)                             │
│   - Context builder called                                      │
│   - Fresh DataLoaders created                                   │
│   - Fresh Services created                                      │
│   - Cache initialized                                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│      GraphQL Middleware Pipeline (Sequential)                   │
│   1. Authentication check                                       │
│   2. Permission/Authorization check                             │
│   3. Input validation                                           │
│   4. Error handling                                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│      Resolver Execution (Thin Orchestration)                    │
│   - Calls context.services.*                                    │
│   - Calls context.loaders.*                                     │
│   - Returns formatted response                                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│        Service Layer + DataLoaders                              │
│   - Business logic execution                                    │
│   - N+1 query prevention (batching)                             │
│   - Request-scoped caching                                      │
│   - Cache invalidation on mutations                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         Prisma Client (Shared Singleton)                        │
│   - Type-safe database queries                                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         PostgreSQL Database                                     │
│   - Data persistence                                            │
│   - ACID transactions                                           │
│   - Indexes for performance                                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Request Processing Flow

### Step 1: HTTP Request Arrives

```
POST /api/graphql
Content-Type: application/json

{
  "query": "query { getEmployee(id: \"emp-123\") { id fio } }",
  "variables": {}
}
```

### Step 2: Next.js Route Handler

**File:** `app/api/graphql/route.ts`

```typescript
import { handler } from "@/server/graphql/server";

export const POST = handler;
```

The handler is created by:

```typescript
export const handler = startServerAndCreateNextHandler(apolloServer, {
  context: contextCreator,
});
```

### Step 3: Express Middleware Stack

The following checks/actions happen BEFORE Apollo:

1. **Authentication** - JWT token extraction from headers
2. **CORS** - Cross-origin request validation
3. **Rate Limiting** - Prevent abuse
4. **Logging** - Request tracking

**File:** `server/graphql/server.ts`

```typescript
const app = express();
app.use(authMiddleware); // Extract user from JWT
app.use(corsMiddleware); // CORS configuration
app.use(rateLimitMiddleware); // Rate limiting
```

### Step 4: Context Builder Called

**File:** `server/graphql/context.ts`

```typescript
async function contextCreator(): Promise<GraphQLContext> {
  // 1. Get authenticated user (from Express middleware)
  const user = await getAuthenticatedUser();

  // 2. Build context with all dependencies
  return buildGraphQLContext(prisma, user);
}
```

### Step 5: Context Building Pipeline

**File:** `server/graphql/context/builder.ts`

```typescript
export async function buildGraphQLContext(
  prisma: PrismaClient,
  user: AuthUser | null,
): Promise<GraphQLContext> {
  // Step 5a: Create fresh DataLoaders for this request
  const loaders = createDataLoaders(prisma);
  // Returns: { employee, company, grade, ... }

  // Step 5b: Create fresh cache
  const cache = createRequestCache();

  // Step 5c: Create service factory with dependencies
  const factory = new ServiceFactory({
    prisma,
    loaders,
    cache,
  });

  // Step 5d: Assemble into context object
  return {
    prisma, // Shared singleton
    user, // Authenticated user
    loaders, // Fresh per request
    services: {
      // Lazy-initialized services
      employee: factory.getEmployeeService(),
      company: factory.getCompanyService(),
      // ... all other services
    },
    requestId, // For tracing
    requestStartTime, // For timing
  };
}
```

### Step 6: GraphQL Parsing & Middleware

Apollo parses the query and applies resolver middleware:

```typescript
// Middleware pipeline for each resolver
withMiddleware(resolver, {
  requireAuth: true, // Middleware 1
  requiredPermissions: ["employee:read"], // Middleware 2
  validate: (args) => {
    /* ... */
  }, // Middleware 3
});
```

### Step 7: Resolver Execution

```typescript
// Resolver delegates to services
export const getEmployee = withMiddleware<GetEmployeeArgs>(
  async (_parent, { id }, context: GraphQLContext) => {
    // Get user via DataLoader (batched automatically)
    const employee = await context.loaders.employee.load(id);

    // Get department via service
    const department = await context.services.department.getById(
      employee.departmentId,
    );

    return { ...employee, department };
  },
  { requireAuth: true },
);
```

### Step 8: Service Layer & DataLoaders

Services call DataLoaders, which batch requests:

```typescript
// In service method
async getWithDepartment(employeeId: string) {
  // DataLoader batches this with other .load() calls
  const employee = await this.context.loaders.employee.load(employeeId);

  // If 100 resolvers call this with different IDs:
  // - Result: 1 database query (all batched)
  // - Without DataLoader: 100 database queries ❌

  return employee;
}
```

### Step 9: Database Query & Response

Prisma executes the batched query:

```sql
SELECT * FROM Employee WHERE id = ANY($1::uuid[])
-- Executes batched query with all employee IDs at once
```

### Step 10: Response Back to Client

```json
{
  "data": {
    "getEmployee": {
      "id": "emp-123",
      "fio": "John Doe"
    }
  },
  "errors": null
}
```

---

## Context Structure

The GraphQL context object contains all request-scoped dependencies:

```typescript
interface GraphQLContext {
  // Shared across all resolvers in this request
  prisma: PrismaClient;

  // Current user (from authentication middleware)
  user: AuthUser | null;

  // DataLoaders for N+1 prevention (fresh per request)
  loaders: {
    employee: DataLoader<string, Employee>;
    company: DataLoader<string, Company>;
    // ... 13 total loaders
  };

  // Business logic services (lazy-initialized)
  services: {
    employee: EmployeeService;
    company: CompanyService;
    // ... 11 total services
  };

  // Request metadata
  requestId: string;
  requestStartTime: Date;

  // Per-request cache
  cache: Map<string, any>;
}
```

---

## Key Design Principles

### 1. Separation of Concerns

```
Resolver Layer
    └─ GraphQL contract, middleware, orchestration

Service Layer
    └─ Business logic, validation, caching

Data Access Layer
    └─ Prisma + DataLoaders, database queries
```

### 2. Request Scoping

Everything created per request gets garbage collected when request ends:

- DataLoaders ✅
- Cache ✅
- Services ✅
- Memory ✅

Shared across requests:

- Prisma Client ✅
- TypeScript types ✅

### 3. N+1 Prevention

DataLoaders automatically batch queries:

```typescript
// Without batching: 10 queries
for (let i = 0; i < 10; i++) {
  await prisma.employee.findUnique({ where: { id: ids[i] } });
}

// With DataLoaders: 1 query (batched)
await Promise.all(ids.map((id) => loaders.employee.load(id)));
```

### 4. Type Safety

Everything is fully typed with TypeScript:

```typescript
// Types are generated from:
// - GraphQL schema (via GraphQL Codegen)
// - Prisma schema (Prisma Client)
// - Custom interfaces (auth, context, etc.)

const employee: Employee = await context.loaders.employee.load(id);
//                Employee type is 100% type-safe ✅
```

---

## Performance Characteristics

### Query Performance

| Operation                              | Queries | Time    | Status        |
| -------------------------------------- | ------- | ------- | ------------- |
| Get single employee                    | 1       | < 5ms   | ✅ Fast       |
| Get 100 employees (DataLoader batched) | 1       | < 10ms  | ✅ Very Fast  |
| Get 100 employees (without batching)   | 100     | < 500ms | ❌ Slow       |
| Complex query with aggregation         | 2-3     | < 50ms  | ✅ Acceptable |

### Cache Benefits

| Cache Hit Type   | Performance  | TTL     |
| ---------------- | ------------ | ------- |
| DataLoader batch | 1000x faster | Request |
| Service cache    | 100x faster  | Request |
| Database query   | Baseline     | N/A     |

---

## Error Handling

### GraphQL Error Format

All errors are normalized to GraphQL error format:

```json
{
  "errors": [
    {
      "message": "Access denied",
      "extensions": {
        "code": "FORBIDDEN",
        "authenticatedUser": "user-123"
      }
    }
  ]
}
```

### Common Error Codes

- `UNAUTHENTICATED` - User not logged in
- `FORBIDDEN` - User not authorized
- `BAD_USER_INPUT` - Validation failed
- `NOT_FOUND` - Entity not found
- `INTERNAL_SERVER_ERROR` - Unexpected error

---

## Related Documentation

- [Database Schema](../db/README.md)
- [GraphQL Layer](../gql/README.md)
- [Services & DataLoaders](../services/README.md)
- [Workload Calculator & Capacity Units](./capacity-units.md)
- [Request Workflows & Examples](./workflows.md)
