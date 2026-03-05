// ============================================================================
// ARCHITECTURE FLOW & DESIGN PATTERNS
// ============================================================================
// Complete explanation of how everything works together
// ============================================================================

## Table of Contents

1. [Is Repository Pattern Needed?](#repository)
2. [The Complete Data Flow](#dataflow)
3. [Context Building Pipeline](#context-building)
4. [How DataLoaders Reach Services](#dataloaders-flow)
5. [Request Lifecycle](#request-lifecycle)
6. [Code Examples](#code-examples)

---

## <a name="repository"></a>Repository Pattern: Should We Split?

### Current Architecture (What We Have)

```
Resolution Layer:
  Resolver (thin orchestration)
    └─ ServiceFactory.getService()

Service Layer:
  Service (business logic + data access combined)
    └─ Uses: context.prisma, context.dataloaders, context.cache

Data Access Layer:
  Prisma Client + DataLoaders
    └─ Database
```

### Questions You're Right to Ask

**Should we have:**

```
Resolver
  └─ ServiceFactory.getService()
  └─ Service (business logic only)
    └─ Repository (data access only)
      └─ Prisma + DataLoaders
```

### Analysis: Do We Need Repositories?

#### ✅ YES, if:

- You want to swap data sources (PostgreSQL → MongoDB → REST API)
- You want to test services in isolation from Prisma
- You have complex queries that would clutter service files
- Large team where data access and business logic should be separate concerns

#### ❌ NOT NECESSARY, if:

- Prisma is your only/permanent data source
- Services stay focused (not mixing too much logic)
- Queries are straightforward (most of our queries are simple)
- Smaller team with shared ownership

### My Recommendation: **Hybrid Approach**

Keep services as-is for **simple CRUD** (Company, Grade):

```typescript
// CompanyService - simple, no need for repository
async getById(id: string) {
  return context.dataloaders.company.load(id);  // Simple!
}
```

But CREATE separate repositories for **complex queries**:

```typescript
// Service delegates to repository
async analyzeDepartmentSkillGaps(deptId: string) {
  return this.gapRepository.analyzeSkills(deptId);
}

// Repository handles complex Prisma queries
async analyzeSkills(deptId: string) {
  return context.prisma.process.groupBy({ ... });
}
```

### **Bottom Line**

For this project, **the current structure is fine**. Services can expand to include repositories IF needed, but don't over-engineer now.

---

## <a name="dataflow"></a>The Complete Data Flow

### What Happens When a ResolverIs Called

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       GraphQL Query/Mutation                             │
│  query { employee(id: "123") { id fio capacity } }                      │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Express Middleware Stack                              │
│  1. Auth extraction (JWT → userId)                                      │
│  2. Rate limiting check                                                 │
│  3. Logging setup                                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│            Apollo Server Context Builder (Per-Request)                    │
│  buildServiceContext(options) called                                    │
│  ↓                                                                       │
│  Create fresh ServiceContext {                                          │
│    userId: 'user-123',                                                  │
│    user: { id, email, role },                                          │
│    prisma: prismaClient,                                               │
│    dataloaders: createDataLoaders(prisma),  ← Fresh loaders per req   │
│    cache: new CacheService(),               ← Fresh cache per req     │
│    requestId: 'req-xyz',                                              │
│    timestamp: now()                                                     │
│  }                                                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│               GraphQL Field Resolver Execution                            │
│  employeeResolver(parent, args, context, info)                          │
│  ↓                                                                       │
│  const factory = new ServiceFactory(context);  ← Pass context here    │
│  const service = factory.getEmployeeService(); ← Service gets context │
│  return service.getByIdOrThrow(args.id);                              │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│              Service Layer (Business Logic)                               │
│  EmployeeService.getByIdOrThrow(id)                                     │
│  ↓                                                                       │
│  // Service has context from constructor                               │
│  return context.dataloaders.employee.load(id);                        │
│                ↓                                                         │
│                (Other services in same request also call load)          │
│                (DataLoader batches them together!)                      │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│          DataLoader Batch Processing (End of Microtask Queue)            │
│  Instead of:                                                             │
│    SELECT * FROM employees WHERE id = 'emp-1'  -- Query 1              │
│    SELECT * FROM employees WHERE id = 'emp-2'  -- Query 2              │
│    SELECT * FROM employees WHERE id = 'emp-3'  -- Query 3              │
│                                                                          │
│  DataLoader executes:                                                   │
│    SELECT * FROM employees WHERE id IN ('emp-1', 'emp-2', 'emp-3')   │
│  ↓ Just 1 query!                                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       Prisma Query Execution                              │
│  prisma.employee.findMany({ where: { id: { in: [...] } } })           │
│  ↓                                                                       │
│  SQL → PostgreSQL → Results                                            │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    Response Built & Cached                                │
│  1. DataLoaders cache result (internal)                                 │
│  2. Service cache manager stores result (persistent or request scoped) │
│  3. GraphQL builds JSON result                                         │
│  4. Send to client                                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## <a name="context-building"></a>Context Building Pipeline (In Detail)

### Step 1: Express Middleware Capture Auth

**File**: `server/graphql/context/builder.ts`

```typescript
// Express middleware - runs BEFORE Apollo
app.use(async (req, res, next) => {
  // Extract JWT from Authorization header
  const token = req.headers.authorization?.replace("Bearer ", "");

  // Decode JWT to get userId
  const userId = extractUserIdFromToken(token);

  // Store in req for Apollo to access
  req.userId = userId;
  next();
});
```

### Step 2: Apollo Context Function

**Timing**: Called ONCE per GraphQL request

```typescript
// Apollo config
const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    // This function runs once per request
    return buildServiceContext({
      userId: req.userId,
      path: req.path,
    });
  },
});
```

### Step 3: buildServiceContext - The Magic Happens

**File**: `server/graphql/context/builder.ts` (lines 50-100)

```typescript
async function buildServiceContext(options: ContextBuilderOptions): Promise<ServiceContext> {
  // 1. Get authenticated user (if logged in)
  const user = options.userId
    ? await prisma.user.findUnique({
        where: { id: options.userId },
        select: { id: true, email: true, role: true }
      })
    : undefined;

  // 2. Create DataLoaders (FRESH for this request)
  const dataloaders = createDataLoaders(prisma);

  // 3. Create Cache Manager (FRESH for this request)
  const cache = new CacheService();

  // 4. Build complete context
  return {
    // Auth
    userId: options.userId || null,
    user: user,
    isAuthenticated: !!options.userId,

    // Data Access
    prisma: prismaClient,
    dataloaders: dataloaders,  ← Key point!
    cache: cache,

    // Metadata
    requestId: generateRequestId(),
    timestamp: new Date(),
    errors: [],
  };
}
```

### Why Fresh DataLoaders Per Request?

```
Request 1 (User A):
  DataLoaders instance 1
    └─ Internal cache for this request only
    └─ Shared by all services in request 1
    └─ Never mixed with other requests

Request 2 (User B):
  DataLoaders instance 2 ← Different instance!
    └─ Fresh cache (no data from Request 1)
    └─ Shared by all services in request 2
    └─ Completely isolated
```

**Why this matters:**

- Prevents data leakage between requests
- Each request gets clean batching window
- Cache doesn't grow infinitely

---

## <a name="dataloaders-flow"></a>How DataLoaders Reach Services

### Path: Context → ServiceFactory → Service

```
Step 1: Context created with DataLoaders
  const context = buildServiceContext(...)
  context.dataloaders = { employee: DataLoader, ... }

Step 2: Service Factory receives context
  const factory = new ServiceFactory(context)

  getEmployeeService(): EmployeeService {
    if (!this._services.employee) {
      this._services.employee = new EmployeeService(this.context)  ← Pass context
    }
    return this._services.employee
  }

Step 3: Service receives context in constructor
  export class EmployeeService extends BaseService {
    constructor(context: ServiceContext) {
      super(context)  ← BaseService stores context
    }

    async getById(id: string) {
      return this.context.dataloaders.employee.load(id)  ← Access here!
    }
  }
```

### Visual: Data Passing Chain

```
Request
  │
  ├─ buildServiceContext()
  │   ├─ createDataLoaders(prisma)
  │   │   ├─ new DataLoader(async (ids) => { batch query })
  │   │   ├─ new DataLoader(async (ids) => { batch query })
  │   │   └─ ... (9+ loaders per entity type)
  │   │
  │   └─ Return context {
  │       dataloaders: { employee, department, grade, ... },
  │       cache: CacheService,
  │       prisma: PrismaClient
  │     }
  │
  └─ Apollo calls resolver(parent, args, context, info)
      │
      ├─ const factory = new ServiceFactory(context)
      │   (context passed to factory constructor)
      │
      ├─ const service = factory.getEmployeeService()
      │   (service constructor receives context)
      │
      └─ service.getById(id)
          (service accesses this.context.dataloaders.employee)
```

### Where Are DataLoaders Defined?

**File**: `server/graphql/context/dataloaders.ts` (example)

```typescript
export function createDataLoaders(prisma: PrismaClient): DataLoaders {
  return {
    // Employee loader - batches IDs together
    employee: new DataLoader(async (ids: string[]) => {
      // Called ONCE with all IDs requested in this request
      console.log(`Batch loading employees:`, ids); // ['emp1', 'emp2', 'emp3']

      // Single database query for all IDs
      const employees = await prisma.employee.findMany({
        where: { id: { in: ids } },
      });

      // Return in same order as input
      return ids.map((id) => employees.find((e) => e.id === id));
    }),

    // Grade loader
    grade: new DataLoader(async (ids: number[]) => {
      const grades = await prisma.grade.findMany({
        where: { level: { in: ids } },
      });
      return ids.map((id) => grades.find((g) => g.level === id));
    }),

    // ... 7+ more loaders
  };
}
```

---

## <a name="request-lifecycle"></a>Complete Request Lifecycle

### Example: GET employee + calculate capacity

```
GraphQL Query:
  query {
    employee(id: "emp-123") {
      id
      fio
      capacity  ← Needs calculation!
    }
  }

────────────────────────────────────────────────────────────────

T=0ms: Express receives request
  - JW token in Authorization header
  - Extract userId → 'user-456'

T=1ms: Middleware runs
  - Validate JWT signature
  - Set req.userId = 'user-456'

T=2ms: Apollo context builder
  buildServiceContext({ userId: 'user-456' })
  ├─ Query user from DB
  ├─ Create DataLoaders
  │   └─ Each DataLoader initialized (but not called yet)
  └─ Create Cache
      └─ Empty cache (fresh per request)

  Result: context with all tools ready

T=3ms: Apollo executes query plan
  - Identifies: employee resolver needs userId='emp-123'
  - Identifies: capacity field resolver needs employee.gradeId

T=4ms: Call employee resolver
  resolver(parent, args: { id: 'emp-123' }, context)
  │
  ├─ new ServiceFactory(context)
  ├─ factory.getEmployeeService()
  ├─ service.getByIdOrThrow('emp-123')
  │   └─ this.context.dataloaders.employee.load('emp-123')
  │       └─ ADD TO BATCH QUEUE (not executed yet)
  │       └─ Return promise
  │
  └─ Await result

T=5ms: Call capacity field resolver
  (Now resolver for Employee.capacity field)
  resolver(parent: Employee, args, context)
  │
  ├─ factory.getEmployeeService()
  │   └─ Returns same instance (memoized in factory)
  ├─ service.calculateCapacity('emp-123')
  │   └─ this.context.dataloaders.grade.load(employee.gradeId)
  │       └─ ADD TO BATCH QUEUE (not executed yet)
  │       └─ Return promise
  │
  └─ Await result

T=6ms: All resolvers have queued DataLoader calls
  Operation queue:
    employee.load('emp-123')
    grade.load(3)  ← employee.gradeId is 3

T=7ms: End of microtask queue → DataLoaders execute batches

  Batch 1 (employees):
    SELECT * FROM employees WHERE id IN ('emp-123')
    ✅ 1 query for 1 entity

  Batch 2 (grades):
    SELECT * FROM grades WHERE level IN (3)
    ✅ 1 query for 1 entity

T=8ms: Responses returned to services
  - employee data: { id, fio, gradeId, ... }
  - grade data: { level, kGrade, title }

T=9ms: Service calculations complete
  - calculateCapacity returns number
  - All field resolvers have values

T=10ms: GraphQL builds response object
  {
    employee: {
      id: 'emp-123',
      fio: 'John Doe',
      capacity: 31.5
    }
  }

T=11ms: Send JSON to client
  Content-Type: application/json
  { "data": { "employee": { ... } } }

────────────────────────────────────────────────────────────────

KEY INSIGHT: Only 2 database queries!

If we didn't use DataLoaders:
  ❌ Query 1: SELECT * FROM employees WHERE id = 'emp-123'
  ❌ Query 2: SELECT * FROM grades WHERE level = 3
  = 2 queries (same as batched)

But if employee resolved multiple times in same request:
  WITHOUT DataLoaders:
  ❌ Query 1: SELECT * FROM employees WHERE id = 'emp-1'
  ❌ Query 2: SELECT * FROM employees WHERE id = 'emp-2'
  ❌ Query 3: SELECT * FROM employees WHERE id = 'emp-3'
  = 3 queries (N+1 problem!)

  WITH DataLoaders:
  ✅ Query 1: SELECT * FROM employees WHERE id IN ('emp-1', 'emp-2', 'emp-3')
  = 1 query (batched!)
```

---

## <a name="code-examples"></a>Code Examples

### Example 1: Simple Read (Company)

```typescript
// Resolver
async function queryGetCompany(parent, args, context) {
  const factory = new ServiceFactory(context);
  return factory.getCompanyService().getById(args.id);
}

// Service
class CompanyService extends BaseService {
  constructor(context: ServiceContext) {
    super(context); // Store context in parent
  }

  async getById(id: string) {
    return this.context.dataloaders.company.load(id);
    //       ^^^^^^^^^^^^^^^
    //       From context passed to constructor!
  }
}
```

### Example 2: Cross-Domain with DataLoaders

```typescript
// Resolver
async function queryEmployeeWithDetails(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getEmployeeService();
  return service.getWithRelations(args.id);
}

// Service
class EmployeeService extends BaseService {
  async getWithRelations(id: string) {
    // Main entity
    const emp = await this.context.dataloaders.employee.load(id);

    // Batch with potential other requests
    const [dept, grade] = await Promise.all([
      this.context.dataloaders.department.load(emp.departmentId),
      this.context.dataloaders.grade.load(emp.gradeId),
    ]);

    return { ...emp, department: dept, grade };

    // In same GraphQL query, if other resolvers also ask for
    // department or grade, they'll get cached results!
  }
}
```

### Example 3: Service Calling Service

```typescript
// ProcessService needing EmployeeService
class ProcessService extends BaseService {
  async assignWithCapacityCheck(processId: string, empId: string) {
    // Get own data
    const process = await this.context.dataloaders.process.load(processId);

    // Need another service - create factory from context
    const factory = new ServiceFactory(this.context);  ← Same context!
    const empService = factory.getEmployeeService();  ← Shares dataloaders!

    // Call other service
    const overloaded = await empService.isOverloaded(empId, load);

    return { taskId, overloaded };
  }
}
```

### Example 4: Cache Management

```typescript
// Service returns cached value on second call
class EmployeeService extends BaseService {
  async getByDepartment(deptId: string) {
    const cacheKey = this.listCacheKey({ departmentId: deptId });

    return this.getOrFetch(cacheKey, async () => {
      // This function only runs if cache misses
      return await this.context.prisma.employee.findMany({
        where: { departmentId: deptId },
      });
    });
  }
}

// Usage in resolver:
// First call: Hits database
// await service.getByDepartment('dept-1');  ← DB query

// Second call: Uses cache
// await service.getByDepartment('dept-1');  ← No query, returns cached

// After mutation: Cache invalidated
// await service.update(...);  ← Calls this.invalidate() internally

// Next call: Hits database again (cache cleared)
// await service.getByDepartment('dept-1');  ← Fresh DB query
```

---

## Summary Diagram

```
Request arrives
    ↓
Express middleware (auth)
    ↓
Apollo creates context
    ├─ Extract user from DB
    ├─ Create DataLoaders (batching enabled)
    ├─ Create Cache (empty)
    └─ Create ServiceContext
        ↓
GraphQL resolves fields
    ├─ Resolver 1 asks service for emp-123
    │   └─ Service calls dataloaders.employee.load('emp-123')
    │       └─ Queued in batch  ← NOT YET EXECUTED
    │
    ├─ Resolver 2 asks service for emp-456
    │   └─ Service calls dataloaders.employee.load('emp-456')
    │       └─ Queued in batch  ← NOT YET EXECUTED
    │
    └─ Resolver 3 asks service for grade-3
        └─ Service calls dataloaders.grade.load(3)
            └─ Queued in batch  ← NOT YET EXECUTED
        ↓
End of microtask queue
    ├─ Execute batch: SELECT * FROM employees WHERE id IN ('emp-123', 'emp-456')
    │   └─ 1 query!
    │
    └─ Execute batch: SELECT * FROM grades WHERE level IN (3)
        └─ 1 query!
        ↓
Services receive results
    ├─ Add to cache if needed
    ├─ Perform business logic
    └─ Return to resolver
        ↓
GraphQL builds response JSON
    └─ Send to client
```

---

## Next Questions to Ask

1. **Where should I add authentication checks?**
   → Phase 5 Middleware (before services)

2. **When does cache get invalidated?**
   → After every mutation (service calls this.invalidate())

3. **What if user doesn't have permission?**
   → Middleware checks before resolver, or service throws AuthorizationError

4. **How do I test services?**
   → See `/server/services/__tests__/services.test.ts` (mock context)

5. **Should I create repositories?**
   → Only if queries get complex (for now, skip it)

---

**That's the complete architecture flow!**
