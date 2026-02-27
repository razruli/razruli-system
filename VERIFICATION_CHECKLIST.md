# Verification Checklist - One Working Example

## ✅ Files Created/Updated

Core Flow:

- [ ] `server/graphql/context.ts` - Entry point (updated)
- [ ] `server/graphql/context/types.ts` - Type definitions (created)
- [ ] `server/graphql/context/builder.ts` - Orchestrator (created)
- [ ] `server/graphql/context/dataloaders-simple.ts` - DataLoaders (created)
- [ ] `server/graphql/context/index.ts` - Exports (updated)

Business Logic:

- [ ] `server/services/user/UserService.ts` - One service (created)

Example:

- [ ] `server/graphql/resolvers/example-user-query.ts` - Show flow (created)

Existing (already working):

- [ ] `server/graphql/middleware/index.ts` - Auth/permissions
- [ ] `server/graphql/server.ts` - Apollo setup

---

## ✅ Type Safety Checks

Run type checker:

```bash
npm run type-check
```

Expected: NO errors in:

- `server/graphql/context.ts`
- `server/graphql/context/types.ts`
- `server/graphql/context/builder.ts`
- `server/graphql/resolvers/example-user-query.ts`

---

## ✅ Runtime Checks

### Check 1: Can import types without errors

```typescript
import type { GraphQLContext } from "@/server/graphql/context";
// Should compile without errors
```

### Check 2: Context.services is available

```typescript
// In resolver:
context.services.user.getById(id);
// Should have proper autocomplete
// Should be type-safe (UserService methods)
```

### Check 3: Context.loaders is available

```typescript
// In service:
this.loaders.user.load(id);
// Should have proper autocomplete
// Should be type-safe (DataLoader methods)
```

### Check 4: Fresh context per request

```typescript
// Request A:
const ctx1 = await createContext();

// Request B:
const ctx2 = await createContext();

// These should be different instances:
expect(ctx1.loaders).not.toBe(ctx2.loaders); // Different
expect(ctx1.services).not.toBe(ctx2.services); // Different
expect(ctx1.requestId).not.toBe(ctx2.requestId); // Different
```

---

## ✅ Execution Checklist

When you start the server:

1. Start dev server:

   ```bash
   npm run dev
   ```

2. Navigate to Apollo Studio (http://localhost:3000/api/graphql)

3. Run the query:

   ```graphql
   query {
     getUser(id: "user-123") {
       id
       name
       email
     }
   }
   ```

4. Expected behaviors:

   **If not authenticated:**

   ```
   Error: UNAUTHENTICATED: User must be logged in
   ```

   (Middleware blocked it)

   **If authenticated:**

   ```json
   {
     "data": {
       "getUser": {
         "id": "user-123",
         "name": "John",
         "email": "john@example.com"
       }
     }
   }
   ```

   (Service + DataLoader worked)

---

## ✅ Dataloader Batching Verification

The batching happens automatically. To verify:

1. Add logging to dataloaders-simple.ts:

   ```typescript
   user: new DataLoader(async (userIds) => {
     console.log("DataLoader batch called with IDs:", userIds);
     // Should only be called ONCE per request
     // Even if multiple resolvers call load()
   });
   ```

2. Run a query that fetches same user multiple times

3. Check console: Should see only ONE batch call per request

---

## ✅ Middleware Execution Verification

1. Test without authentication:

   ```graphql
   query {
     getUser(id: "123") {
       id
     }
   }
   ```

   **Expected:** UNAUTHENTICATED error (requireAuth: true blocked it)

2. Test without permission (if you add permission checks):

   ```
   Expected: UNAUTHORIZED error
   ```

3. Test with authentication:
   ```
   Expected: User data returned (permission check passed)
   ```

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find module 'UserService'"

**Fix:** Make sure file exists at `server/services/user/UserService.ts`

### Issue: "Property 'user' does not exist on DataLoaderRegistry"

**Fix:** Check that `types.ts` has the registry definition

### Issue: "context.services is Record<string, any>"

**Fix:** Make sure you're importing GraphQLContext from `context/types.ts`, not generic type

### Issue: DataLoader not batching

**Fix:** Check that fresh DataLoaders are created per request (not singleton)

### Issue: Dataloader returns undefined

**Fix:** Check batch function returns results in same order as input

---

## ✅ Simple Query to Test

Use this minimal query to verify everything works:

```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
  }
}
```

Variables:

```json
{
  "id": "existing-user-id"
}
```

---

## 📋 Summary

If all checks pass:

- ✅ Context created fresh per request
- ✅ DataLoaders created fresh per request
- ✅ Services created fresh per request
- ✅ Middleware executes before resolver
- ✅ Resolver calls service
- ✅ Service uses dataloader
- ✅ DataLoader batches queries
- ✅ Response returned to client

**Pipeline is complete and working.**

---

## Next Steps (When Ready)

1. Add more entities (Employee, Department) following same pattern
2. Add mutations with middleware
3. Add validation rules
4. Add caching manager (when needed)

---

## Files to Keep as Reference

- `WORKING_FLOW_EXPLAINED.md` - Full flow diagram
- `example-user-query.ts` - Resolver template
- `UserService.ts` - Service template
- `types.ts` - Type definitions template
