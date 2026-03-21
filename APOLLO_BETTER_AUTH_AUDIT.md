# Apollo GraphQL + Better-Auth Session Retrieval - Root Cause Audit & Fix

## TL;DR

**Problem**: GraphQL queries from server components couldn't retrieve authenticated sessions, causing layout errors ("Company not found for slug") even though cookies were present.

**Root Cause**: Better-auth's `nextCookies` plugin extracts cookies from Next.js request context, but Apollo HttpLink makes internal fetch requests where the cookie handling is different.

**Solution**: Dual-approach session retrieval:

1. Try standard better-auth header extraction
2. Fall back to Next.js `cookies()` API to manually extract session token

**Result**: ✅ Sessions now retrievable in both standard routes AND Apollo GraphQL queries.

---

## Discovery Process

### Current Behavior (After Fix)

1. **In regular routes** (GET `/en/chester/dashboard`):
   - Better-auth retrieves session normally ✅
2. **In Apollo GraphQL queries** (POST `/api/graphql`):
   - First attempts standard header extraction
   - Falls back to Next.js `cookies()` API
   - Sessions now properly retrieved ✅

3. **Result**:
   - Both `/employees` and `/departments` layouts can access authenticated data
   - GraphQL context now has `user` and `actor` populated
   - Resolvers can enforce proper authorization

---

## Root Cause Analysis

### The Mismatch: HttpLink Headers vs Next.js Cookie Context

**Apollo HttpLink request flow:**

```typescript
// app/shared/lib/apollo-client/apolloClient.ts
link: new HttpLink({
  uri: process.env.NEXT_PUBLIC_BASE_URL + "/api/graphql",
  fetchOptions: {
    headers: await headers(),       // ← Standard Next.js headers
    credentials: "include",         // ← Include cookies in fetch
  },
}),
```

**What happens:**

1. Apollo HttpLink makes internal fetch request to `/api/graphql`
2. Fetch INCLUDES cookies in the HTTP request (via `credentials: "include"`)
3. But cookies are NOT forwarded in the `headers` object parameter
4. Better-auth's `nextCookies` plugin looks for cookies in `headers.get("cookie")`
5. Returns null because they're not there
6. Session retrieval fails

**Evidence from original logs:**

```
[contextCreator] Headers received: { hasCookie: true, headerCount: 10 }    // ← Cookies present
[getUserFromRequest] Session retrieved: { hasSession: false }              // ← But not found!
```

---

## The Fix: Dual-Approach Session Retrieval

### Implementation

File: `server/auth/getUserFromRequest.ts`

```typescript
export async function getUserFromRequest(headers: any) {
  // Approach 1: Standard better-auth header extraction
  let session = await auth.api.getSession({ headers });

  if (session) {
    // Success via headers - return immediately
    return NextResponse.json({ message: "Success", user: session.user });
  }

  // Approach 2: Fallback using Next.js cookies() API
  // Necessary because Apollo HttpLink passes cookies differently
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Convert token to headers format that better-auth expects
  session = await auth.api.getSession({
    headers: new Headers({
      cookie: `better-auth.session_token=${sessionToken}`,
    }),
  });

  if (session) {
    return NextResponse.json({ message: "Success", user: session.user });
  }

  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}
```

### Why This Works

1. **Standard routes**: Better-auth header extraction works fine → returns immediately
2. **Apollo GraphQL**: Header extraction returns null → falls back to cookies API
3. **Cookies API**: Uses Next.js native `cookies()` function which ALWAYS has access to request cookies
4. **Reconstruction**: Manually reconstructs the cookie header format that better-auth expects
5. **Validation**: Better-auth validates the session token normally

---

## Changes Made

### 1. Enhanced Session Retrieval (`server/auth/getUserFromRequest.ts`)

- Added fallback using Next.js `cookies()` API
- Dual-approach ensures compatibility with both:
  - Standard Next.js route handlers
  - Apollo GraphQL internal fetch requests

### 2. GraphQL Context Builder (`server/graphql/context/context.ts`)

- Now fetches actor from database when user exists
- Passes actor to context builder
- Handles 401 responses gracefully

### 3. Context Type Updates (`server/graphql/context/types.ts`)

- `actor` field already existed as optional, now properly populated

### 4. Enhanced Logging

- `contextCreator()` in server.ts
- `getUserFromRequest()` with detailed debugging
- Helps troubleshoot future auth issues

### 5. Improved Resolver Logic (`server/graphql/resolvers/core/company/query.ts`)

- Better null handling
- Clearer authorization checks
- Returns null instead of throwing for missing companies
- Only throws when user lacks access to existing company

---

## How to Test

### When User is Logged In

```typescript
// Server component makes authenticated request
const { data: companyData } = await query({
  query: GetCompanyBySlugDocument,
  variables: { slug: "chester" },
});

// Should now retrieve company data successfully
// Because:
// 1. Cookies are present in request
// 2. Session token extracted via cookies() API
// 3. Context built with authenticated user + actor
//4. Resolver can validate authorization
```

### When User is NOT Logged In

```
[getUserFromRequest] START
[getUserFromRequest] Session not found via headers, trying cookies API
[getUserFromRequest] No session token in cookies
// Returns 401, context built with user: null
// Resolvers that require auth will throw UNAUTHENTICATED error
```

---

## Why This Matters

### Before Fix

- Server components couldn't fetch authenticated data
- GraphQL queries ran as unauthenticated, even when logged in
- `/departments` layout threw "Company not found" errors
- Layouts couldn't access user's business context (actor)

### After Fix

- Server components can fetch authenticated data ✅
- GraphQL queries properly validate sessions ✅
- Both `/employees` and `/departments` layouts work ✅
- Resolvers can enforce role-based access control ✅
- Full business context (Actor, Company, Department, Roles) available ✅

---

## Architecture Lessons

1. **Cookie Extraction Varies by Context**
   - Server handlers: Use request context directly
   - Internal fetch calls: Use `cookies()` API
   - Always have fallbacks

2. **Better-Auth Integration Points**
   - Works great in route handlers (`/api/auth/*`)
   - Needs special handling in GraphQL/internal APIs
   - Consider using dedicated auth headers for internal APIs

3. **Server Component Auth Flow**
   - Server components → Apollo HttpLink → GraphQL handler
   - Each layer needs proper cookie/session passing
   - Next.js `cookies()` API is most reliable fallback

---

## Next Steps

✅ **Completed**:

- Session retrieval working in both contexts
- Actor properly fetched and populated in context
- Logging in place for debugging
- Authorization checks improved

**Future Considerations**:

- Add permission checking to authorization middleware
- Cache actor data to avoid repeated lookups
- Consider dedicated auth headers for internal APIs
- Update documentation on auth flow
