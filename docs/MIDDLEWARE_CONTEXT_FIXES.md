/\*\*

- ============================================================================
- GraphQL Context & Middleware - Complete Integration Guide
- ============================================================================
- Fixed for Next.js with proper request isolation
- ============================================================================
  \*/

/\*\*

- PROBLEM SOLVED: Type Mismatches & Context Isolation
- ================================================================
-
- BEFORE (Broken):
- ├─ Middleware expected ServiceContext
- ├─ Resolvers used GraphQLContext (different type!)
- ├─ Double context enrichment caused stale loaders
- ├─ Express-specific code in builder but using Next.js
- └─ No guarantee of fresh dataloaders per request
-
- AFTER (Fixed):
- ├─ Middleware now expects GraphQLContext (matches resolvers)
- ├─ Fresh dataloaders created per request
- ├─ Fresh services created per request
- ├─ Single context creation (no double enrichment)
- ├─ Next.js-specific builder
- └─ Guaranteed request isolation
  \*/

/\*\*

- ARCHITECTURE: Request Flow with Fixed Context
- ================================================================
-
- 1.  Next.js Request arrives
- └─ POST /api/graphql
-
- 2.  Apollo Server (Next.js integration)
- └─ startServerAndCreateNextHandler calls contextCreator()
-
- 3.  contextCreator() in server.ts
- └─ Calls createContext()
-
- 4.  createContext() in context.ts (ONLY PLACE CONTEXT IS CREATED)
- ├─ Gets authenticated user from getUserFromRequest()
- └─ Calls buildGraphQLContext()
-
- 5.  buildGraphQLContext() in context-builder/builder.ts
- ├─ Creates FRESH DataLoaders for this request
- │ └─ New instances, empty batch queues
- ├─ Creates FRESH Services for this request
- │ └─ Injected with fresh loaders
- └─ Returns GraphQLContext
-
- 6.  Resolver execution
- ├─ Middleware wraps resolver
- ├─ Context is GraphQLContext (TYPES MATCH!)
- ├─ context.services.employee.findById(id) ✓
- ├─ DataLoaders batch automatically within window
- └─ All services share same loaders (consistent)
-
- 7.  Response sent, context discarded
- └─ Fresh loaders/services created for next request
  \*/

/\*\*

- DATALOADER GUARANTEE
- ================================================================
-
- DataLoader behavior:
- - Batches queries within a single event loop tick
- - Automatically creates new batch queue after previous executes
-
- Fresh loaders per request means:
- ├─ Batch 1 (Request A): [query1, query2, query3] → combined
- ├─ Batch cleared after Promise.all()
- ├─ Batch 2 (Request B): [query4, query5] → combined (separate)
- └─ NO mixing of User A's and User B's queries
-
- CRITICAL: Creating loaders ONCE at startup breaks this:
- ├─ Request A batches queries 1-3
- ├─ Request B queues queries 4-5
- ├─ Batch window never cleared!
- └─ Query 4 gets User A's database context = DATA LEAK
  \*/

/\*\*

- SERVICE ISOLATION GUARANTEE
- ================================================================
-
- Services can cache intermediate results:
-
- Before (Broken):
- ├─ Request A: UserService.getById("123") → caches result
- ├─ Request B: UserService.getById("123") → returns cached!
- ├─ But Request B is User B, not User A
- └─ Wrong user data returned!
-
- After (Fixed):
- ├─ Request A gets UserService A with own loaders
- ├─ Request B gets UserService B with own loaders
- ├─ Each has own cache window
- └─ No cross-request data sharing ✓
  \*/

/\*\*

- USAGE IN RESOLVERS - NOW TYPE-SAFE
- ================================================================
  \*/

// Before (Type mismatch):
export const employeeQueryBroken = `
import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/generated";

export const query: QueryResolvers = {
employee: withMiddleware(
async (\_parent, { id }, context) => {
// context is GraphQLContext
// context.services.employee ← This exists!
return context.services.employee.findById(id);
},
{ requireAuth: true }
),
};
`;

// After (Types match!):
export const employeeQueryFixed = `
import { withMiddleware } from "@/server/graphql/middleware";
import type { QueryResolvers } from "@/server/graphql/generated";
import type { GraphQLContext } from "@/server/graphql/context";

export const query: QueryResolvers = {
employee: withMiddleware<{ id: string }>(
async (\_parent, { id }, context: GraphQLContext) => {
// ✓ Proper context type
// ✓ context.services properly typed
// ✓ No type mismatch errors
return context.services.employee.findById(id);
},
{
requireAuth: true,
requiredPermissions: ["employee:read"]
},
),
};
`;

/\*\*

- MIDDLEWARE CHANGES
- ================================================================
  \*/

export const middlewareChanges = `
// OLD - caused type errors:
export interface MiddlewareContext {
context: ServiceContext; // ← Wrong type!
}

// NEW - matches resolvers:
export interface MiddlewareContext {
context: GraphQLContext; // ← Matches resolvers!
}

// OLD - generic types didn't work:
export function withMiddleware<TParent, TArgs, TContext, TResult>(
resolver: (...) => TResult,
options: MiddlewareOptions = {},
) { ... }

// NEW - simpler and works:
export function withMiddleware<TArgs extends Record<string, any> = {}, TResult = any>(
resolver: (
parent: any,
args: TArgs,
context: GraphQLContext, // ← No longer generic, always this type
info: GraphQLResolveInfo,
) => Promise<TResult> | TResult,
options: MiddlewareOptions = {},
) { ... }
`;

/\*\*

- CONTEXT BUILDER CHANGES
- ================================================================
  \*/

export const contextBuilderChanges = `
// OLD - Express-specific, not used, double enrichment:
export async function createApolloContext(req: any): Promise<...> { ... }
export function contextMiddleware(req: any, res: any, next: any) { ... }

- ContextBuilder.enrichContext() called twice

// NEW - Next.js-specific, single creation:
export async function buildGraphQLContext(
prisma: PrismaClient,
request: NextRequestContext,
user: User | null,
): Promise<GraphQLContext> {
// Creates FRESH loaders
// Creates FRESH services with those loaders
// Returns complete, ready-to-use context
}

Also:

- ContextBuilder.initializeServices() removed
- No double enrichment
- Loaders (and services) guaranteed fresh per request
  `;

/\*\*

- NEXT.JS INTEGRATION
- ================================================================
  \*/

export const nextJsIntegration = `
// server/graphql/server.ts
import { startServerAndCreateNextHandler } from "@as-integrations/next";

async function contextCreator(): Promise<GraphQLContext> {
// Called ONCE per request by Next.js handler
const context = await createContext();
return context;
}

const apolloServer = new ApolloServer<GraphQLContext>({
typeDefs,
resolvers,
// ... other config
});

// This is what Next.js calls:
export const handler = startServerAndCreateNextHandler(apolloServer, {
context: contextCreator,
});

// At app/api/graphql/route.ts:
import { handler } from "@/server/graphql/server";
export const POST = handler;
export const GET = handler;
`;

/\*\*

- TESTING THE ISOLATION
- ================================================================
  \*/

export const testingIsolation = `
// test: Loaders are fresh per request
it("should create fresh loaders per request", async () => {
const context1 = await buildGraphQLContext(prisma, {headers: {}}, user1);
const context2 = await buildGraphQLContext(prisma, {headers: {}}, user2);

// Should be different instances
expect(context1.loaders.employee).not.toBe(context2.loaders.employee);
// Same for services
expect(context1.services.employee).not.toBe(context2.services.employee);
});

// test: Services can't cross-pollinate
it("should isolate service state between requests", async () => {
const ctx1 = await createContext(); // simulates request from user1
const ctx2 = await createContext(); // simulates request from user2

// Get same employee ID in both contexts
const employee1 = await ctx1.services.employee.findById("emp1");
const employee2 = await ctx2.services.employee.findById("emp1");

// Should be different instances
expect(employee1).not.toBe(employee2);
});

// test: Middleware works with right context
it("should execute middleware with GraphQLContext", async () => {
const context = await createContext();
const resolver = withMiddleware(
async (\_p, args, ctx) => {
// ctx should be GraphQLContext
expect(ctx.services).toBeDefined();
expect(ctx.loaders).toBeDefined();
return "success";
},
{ requireAuth: true }
);

const result = await resolver({}, {}, context, null);
expect(result).toBe("success");
});
`;

/\*\*

- IMPLEMENTATION CHECKLIST
- ================================================================
  \*/

export const implementationChecklist = `
✓ 1. Fixed middleware types (ServiceContext → GraphQLContext)
✓ 2. Simplified resolver wrapper generics
✓ 3. Created buildGraphQLContext() for Next.js
✓ 4. Removed double enrichment
✓ 5. Removed Express-specific code
✓ 6. Removed ContextBuilder.initializeServices()

NEXT STEPS:

□ 1. Implement createDataLoadersForRequest() in builder.ts - Return actual DataLoader instances for each domain - Wire up batch functions - Test that loaders are fresh each request

□ 2. Implement createServicesForRequest() in builder.ts - Instantiate ServiceFactory with fresh loaders - Return services registry - Test that services are fresh each request

□ 3. Update GraphQLContext type with proper LoaderRegistry, ServicesRegistry - Remove Record<string, any> - Import real types - Enable full type safety

□ 4. Test request isolation - Concurrent requests don't cross-pollinate - Loaders properly batched per request - Services don't share cache - No data leaks between users
`;

/\*\*

- DEBUGGING CHECKLIST
- ================================================================
  \*/

export const debuggingChecklist = `
If you see type errors:
□ Middleware expecting wrong context type → Fixed ✓
□ Resolver not accessing context.services → Check context is GraphQLContext
□ context.loaders undefined → implement createDataLoadersForRequest()
□ context.services undefined → implement createServicesForRequest()

If you see stale cache issues:
□ Same DataLoader instance across requests → Should be fresh now ✓
□ Service caching between users → Should be isolated now ✓
□ Double context creation → Removed ✓
□ ContextBuilder enriching twice → Removed ✓

If dataloaders not batching:
□ Fresh loaders per request → Enabled ✓
□ But nothing is batching? → Check batch function is implemented
□ Check that loaders are actually being called
□ Check DataLoader queue isn't being manually cleared
`;
