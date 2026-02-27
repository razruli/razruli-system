# GraphQL + Prisma + DataLoader - Complete Working Flow

## One Working Example: User Query

```graphql
query {
  getUser(id: "user-123") {
    id
    name
    email
  }
}
```

---

## Step-by-Step Execution

### Step 1: Request Arrives at Next.js

```
POST /api/graphql
    ↓
app/api/graphql/route.ts
    ├─ import { handler } from "@/server/graphql/server"
    └─ export POST = handler
```

### Step 2: Apollo Server Calls Context Creator

```typescript
// server/graphql/server.ts
export const handler = startServerAndCreateNextHandler(apolloServer, {
  context: contextCreator,  ← Called once per request
});

async function contextCreator(): Promise<GraphQLContext> {
  return createContext();
}
```

### Step 3: Context Creation (one entry point)

```typescript
// server/graphql/context.ts - createContext()
async function createContext() {
  const res = await getUserFromRequest(); // Get authenticated user
  const user = data.user || null; // Might be null (not logged in)

  return buildGraphQLContext(prisma, user); // ← Builds everything
}
```

### Step 4: Context Builder Orchestrates

```typescript
// server/graphql/context/builder.ts
export async function buildGraphQLContext(prisma, user) {
  // Step 4a: Create FRESH DataLoaders for this request
  const loaders = createDataLoaders(prisma);
  // Returns: { user: DataLoader }

  // Step 4b: Create FRESH Services with those loaders
  const services = {
    user: new UserService(prisma, loaders),
  };
  // Returns: { user: UserService }

  // Step 4c: Assemble into context object
  return {
    prisma, // Singleton, shared
    user, // From auth middleware
    loaders, // FRESH per request
    services, // FRESH per request
    requestId, // For tracing
    requestStartTime, // For timing
  };
}
```

### Step 5: Resolver Called with Context

```typescript
// Apollo passes context to resolver
getUser: withMiddleware<GetUserArgs>(
  async (_parent, { id }, context: GraphQLContext, info) => {
    // context is now available
    // Types: context.services.user is UserService ✓
    // Types: context.loaders.user is DataLoader ✓

    const user = await context.services.user.getById(id);
    return user;
  },
  {
    requireAuth: true,
    requiredPermissions: ["user:read"],
  },
);
```

### Step 6: Middleware Executes

```typescript
// server/graphql/middleware/index.ts
withMiddleware wrapper executes:

1. authMiddleware
   ├─ requireAuth: true?
   ├─ Check: context.user !== null
   └─ Throw: "UNAUTHENTICATED" if not

2. permissionMiddleware
   ├─ requiredPermissions: ["user:read"]?
   ├─ Check: user has permission
   └─ Throw: "UNAUTHORIZED" if not

3. validationMiddleware
   ├─ validate function provided?
   ├─ Run: validate(args)
   └─ Throw: "VALIDATION_ERROR" if fails

4. ErrorHandlerMiddleware wraps everything
   ├─ Catches errors
   └─ Formats for GraphQL response
```

### Step 7: Resolver Executes

```typescript
// The actual resolver function runs now
async (_parent, { id }, context: GraphQLContext, info) => {
  // Auth and permissions already checked ✓

  // Call service
  const user = await context.services.user.getById(id);

  return { id: user.id, name: user.name, email: user.email };
};
```

### Step 8: Service Uses DataLoader

```typescript
// server/services/user/UserService.ts
class UserService {
  constructor(prisma, loaders) {}

  async getById(id: string) {
    // Use DataLoader for batching
    return this.loaders.user.load(id);
  }
}
```

### Step 9: DataLoader Batches the Query

```typescript
// server/graphql/context/dataloaders-simple.ts
user: new DataLoader(async (userIds: readonly string[]) => {
  // userIds = ["user-123"]

  // Single DB call, no N+1
  const users = await prisma.user.findMany({
    where: { id: { in: userIds as string[] } },
  });

  // Return in same order
  return userIds.map((id) => users.find((u) => u.id === id) || null);
});
```

### Step 10: Response Returned

```
User data returned to client
Context automatically garbage collected
Fresh loaders/services destroyed
Ready for next request
```

---

## Files in This Flow

### Entry Points

- ✅ `server/graphql/context.ts` - Single entry, calls builder
- ✅ `app/api/graphql/route.ts` - Next.js endpoint

### Context Building

- ✅ `server/graphql/context/types.ts` - Type definitions (strongly typed)
- ✅ `server/graphql/context/builder.ts` - Orchestrates creation
- ✅ `server/graphql/context/dataloaders-simple.ts` - DataLoader factory

### Business Logic

- ✅ `server/services/user/UserService.ts` - User service

### Middleware & Resolvers

- ✅ `server/graphql/middleware/index.ts` - Auth/permissions/validation
- ✅ `server/graphql/resolvers/example-user-query.ts` - Example resolver

---

## Type Safety Verification

### Context Types

```typescript
// server/graphql/context/types.ts
interface GraphQLContext {
  prisma: PrismaClient; // ✓ Available
  user: User | null; // ✓ Available
  loaders: DataLoaderRegistry; // ✓ { user: DataLoader<string, User> }
  services: ServicesRegistry; // ✓ { user: UserService }
  requestId: string; // ✓ Available
  requestStartTime: number; // ✓ Available
}
```

### In Resolver

```typescript
// context.services.user is strongly typed as UserService
context.services.user.getById(id); // ✓ Autocomplete works
// ✓ Type checks pass

// context.loaders.user is strongly typed as DataLoader
context.loaders.user.load(id); // ✓ Autocomplete works
// ✓ Type checks pass
```

---

## Request Isolation Guarantee

```
Request A (User: Alice)
├─ DataLoader A created (empty cache)
├─ Service A created (uses Loader A)
├─ Query executes with Alice's auth context
├─ Loader A batches Alice's queries
└─ Context A destroyed

Request B (User: Bob) - CONCURRENT
├─ DataLoader B created (empty cache) ← Different instance!
├─ Service B created (uses Loader B) ← Different instance!
├─ Query executes with Bob's auth context
├─ Loader B batches Bob's queries ← Only Bob's data
└─ Context B destroyed

Result:
✓ No data leaking from Alice to Bob
✓ No cache pollution between requests
✓ Fresh batch window per request
```

---

## DataLoader Batching Guarantee

```
In Request A (User: Alice), single GraphQL query:

resolver1 calls: loaders.user.load("user-1")  ← Queued
resolver2 calls: loaders.user.load("user-2")  ← Queued
resolver3 calls: loaders.user.load("user-1")  ← Queued (cached from first)

Event loop tick ends
↓
DataLoader batch function called:
  prisma.user.findMany({ where: { id: { in: ["user-1", "user-2"] } } })
  ↓
  Single database query ✓ (no N+1)
  ↓
  Results returned in order
```

---

## Testing the Flow

```bash
# Test 1: Type checking
npm run type-check
# Should show NO errors in resolver file

# Test 2: Query execution
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ getUser(id: \"123\") { id name } }"}'

# Response should return user data or error if not authenticated
```

---

## What's Guaranteed

✅ **Fresh DataLoaders per Request**

- No cross-request batching
- No data leaks between users
- Clean batch window per request

✅ **Fresh Services per Request**

- No cached state across requests
- Services bound to request's loaders
- Cannot hold stale data

✅ **Strongly Typed**

- `context.services` is ServicesRegistry
- `context.loaders` is DataLoaderRegistry
- Full autocomplete in resolvers

✅ **Single Context Entry Point**

- All requests go through `createContext()`
- Consistent creation strategy
- Easy to debug/modify

✅ **Middleware Execution**

- Auth checked before resolver
- Permissions checked before resolver
- Validation happens before resolver

✅ **Service Uses Loaders**

- Services get fresh loaders, not global ones
- Services can't hold stale batches
- DataLoader batching works as expected

---

## No Extras

This example has:

- ✅ One entity (User)
- ✅ One DataLoader (user)
- ✅ One Service (UserService)
- ✅ One resolver (getUser)
- ✅ One middleware configuration

This example does NOT have:

- ❌ Caching manager (skip for now)
- ❌ Multiple entities (just User)
- ❌ Complex validation
- ❌ Subscriptions
- ❌ Mutations

---

## Next: Adding More Entities

When you need Employee, Department, Grade:

1. Add to `DataLoaderRegistry` in `types.ts`
2. Add loader function in `dataloaders-simple.ts`
3. Create `EmployeeService.ts` similar to `UserService.ts`
4. Add to `services` object in `builder.ts`
5. Create resolver that uses `context.services.employee`

That's it. Pattern is identical to User.
