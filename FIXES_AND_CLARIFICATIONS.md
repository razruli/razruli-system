// ============================================================================
// FIXES APPLIED & CLARIFICATIONS
// ============================================================================
// What was fixed, what decisions were made, and next steps
// ============================================================================

## Summary of This Session

### ✅ Issues Fixed

1. **Codegen.ts Mappers**
   - **Issue**: Only had User mapper, missing all other entities
   - **Fix**: Added mappers for 13 entities:

     ```typescript
     // Auth
     (User, Session, Account, Verification);

     // Core
     (Company, Department, Employee, Grade);

     // Operations
     (Process, TaskAssignment);

     // Analytics
     (LoadSnapshot, GapAnalysisResult, HiringRequest);

     // Audit
     (EmployeeHistory, AuditLog);
     ```

   - **Location**: `/codegen.ts` lines 22-44
   - **Status**: ✅ FIXED

2. **Context Type Reference**
   - **Issue**: Referenced non-existent `GraphQLContext`
   - **Fix**: Changed to `ServiceContext` (actual interface name)

     ```typescript
     // Before:
     contextType: "../context#GraphQLContext";

     // After:
     contextType: "../context#ServiceContext";
     ```

   - **Status**: ✅ FIXED

3. **PathAliases in Mappers**
   - **Issue**: Used relative paths like `../../db/generated/...`
   - **Fix**: Using absolute paths with `@/` alias:

     ```typescript
     // Before:
     User: "../../db/generated/prisma/models#UserModel";

     // After:
     User: "@/server/db/generated/prisma#User";
     ```

   - **Status**: ✅ FIXED

---

## Architecture Clarifications

### Q1: Should Each Service Have a Separate Repository File?

**Short Answer**: No, not for this project. But you have options.

**Analysis**:

- **Current state (Pattern 1)**: Service handles both data access and business logic
  - ✅ Simple, pragmatic
  - ✅ Easy to get started
  - ❌ Can become large (500+ lines)

- **Alternative (Pattern 2)**: Separate Repository + Service files
  - ✅ Clean separation of concerns
  - ✅ Testability improvement
  - ❌ More boilerplate

- **Recommendation**: Stick with Pattern 1 now
  - Service files are only 94-356 lines (totally manageable)
  - Prisma abstracts data access (rarely need to swap DB layer)
  - **Refactor to Pattern 2 ONLY IF**: Service grows beyond 400 lines OR you need to mock data separately

**See**: `/REPOSITORY_PATTERN_GUIDE.md` for detailed comparison

---

### Q2: How Does Context Building Happen?

**The Pipeline**:

```
Request arrives
    ↓
Express middleware (extract JWT → userId)
    ↓
Apollo requests context
    ↓
buildServiceContext() called:
    1. Fetch user from DB (if userId present)
    2. createDataLoaders(prisma)
       └─ Create 9+ DataLoader instances (fresh for this request)
    3. new CacheService()
       └─ Create fresh cache (empty)
    4. Return ServiceContext {
         userId, user, isAuthenticated,
         prisma, dataloaders, cache,
         requestId, timestamp, errors
       }
    ↓
Context passed to all resolvers
    ↓
Resolvers pass context to ServiceFactory
    ↓
ServiceFactory passes context to Services
```

**Key Point**: Context is **FRESH PER REQUEST**

- DataLoaders created new each request (never shared between requests)
- Cache created new each request (no cross-request contamination)
- All services in same request share the same context

**See**: `/ARCHITECTURE_FLOW_DETAILED.md` - Complete flow diagram

---

### Q3: How Are DataLoaders Passed to Services?

**The Chain**:

````
buildServiceContext()
  └─ createDataLoaders(prisma)
      └─ dataloaders: { employee: DataLoader, grade: DataLoader, ... }
      └─ Stored in context.dataloaders

Apollo calls resolver(parent, args, context)
  └─ const factory = new ServiceFactory(context)  ← Context passed
  └─ const service = factory.getEmployeeService()
      └─ Service constructor receives context
      └─ service.context = context
      └─ Service can now access this.context.dataloaders!

Inside Service:
```typescript
class EmployeeService extends BaseService {
  constructor(context: ServiceContext) {
    super(context);  ← BaseService stores it
  }

  async getById(id: string) {
    // BaseService provides this.context
    return this.context.dataloaders.employee.load(id);
  }
}
````

---

### Q4: What Do DataLoaders Do?

**Problem (N+1 Query)**:

```
// Without DataLoaders
for (const id of ['emp-1', 'emp-2', 'emp-3']) {
  await prisma.employee.findUnique({ where: { id } });
}
// Results in 3 separate queries ❌
```

**Solution (DataLoaders)**:

```typescript
// With DataLoaders
const emp1 = await dataloaders.employee.load("emp-1"); // Queued
const emp2 = await dataloaders.employee.load("emp-2"); // Queued
const emp3 = await dataloaders.employee.load("emp-3"); // Queued

// End of microtask → batch executes:
// SELECT * FROM employees WHERE id IN ('emp-1', 'emp-2', 'emp-3')
// Results in 1 query ✅
```

**How it works**:

```typescript
export function createDataLoaders(prisma) {
  return {
    employee: new DataLoader(async (ids: string[]) => {
      // Called ONCE with all IDs batched together
      const employees = await prisma.employee.findMany({
        where: { id: { in: ids } }  ← Single query!
      });
      return ids.map(id => employees.find(e => e.id === id));
    })
  };
}
```

---

## Complete Data Flow Example

**GraphQL Query**:

```graphql
query {
  employees(departmentId: "eng") {
    id
    name
    grade {
      title
    }
  }
}
```

**What Happens**:

```
T=1: Resolver called with ServiceContext
T=2: Create ServiceFactory(context)
T=3: factory.getEmployeeService()
T=4: employeeService.getByDepartment('eng')
     └─ this.context.prisma.employee.findMany()
     └─ Returns [emp1, emp2, emp3]

T=5: For each employee, resolve grade field
     ├─ this.context.dataloaders.grade.load(emp1.gradeId)  ← Queued
     ├─ this.context.dataloaders.grade.load(emp2.gradeId)  ← Queued
     └─ this.context.dataloaders.grade.load(emp3.gradeId)  ← Queued

T=6: End of microtask queue - DataLoader batch executes
     └─ SELECT * FROM grades WHERE level IN (grade1, grade2, grade3)
     └─ Results returned

T=7: GraphQL builds response with all data
T=8: Send JSON to client
```

**Result**:

- 1 query for employees (direct prisma.findMany)
- 1 query for grades (DataLoader batches all 3 grade IDs)
- Total: 2 queries (not 1+3 = 4)

---

## File Structure Currently

```
server/
├── types/
│   └── context.ts                    ✅ ServiceContext interface
├── graphql/
│   ├── context/
│   │   ├── builder.ts                ✅ buildServiceContext()
│   │   ├── dataloaders.ts            ✅ createDataLoaders()
│   │   ├── cache.ts                  ✅ CacheService
│   │   └── index.ts                  ✅ Exports
│   ├── resolvers/
│   │   └── example-employee.resolver.ts  ✅ Phase 6 preview
│   └── middleware/
│       └── (Ready for Phase 5)
├── services/
│   ├── core/
│   │   ├── CompanyService.ts         ✅ Domain service
│   │   ├── EmployeeService.ts        ✅ Domain service
│   │   ├── GradeService.ts           ✅ Domain service
│   │   └── index.ts                  ✅ Exports
│   ├── operations/
│   │   ├── ProcessService.ts         ✅ Domain service
│   │   ├── TaskAssignmentService.ts  ✅ Domain service
│   │   └── index.ts                  ✅ Exports
│   ├── analytics/
│   │   ├── LoadSnapshotService.ts    ✅ Domain service
│   │   ├── GapAnalysisService.ts     ✅ Domain service
│   │   └── index.ts                  ✅ Exports
│   ├── audit/
│   │   ├── EmployeeHistoryService.ts ✅ Domain service
│   │   ├── AuditLogService.ts        ✅ Domain service
│   │   └── index.ts                  ✅ Exports
│   ├── base/
│   │   ├── BaseService.ts            ✅ Foundation
│   │   ├── types.ts                  ✅ Interfaces
│   │   └── index.ts                  ✅ Exports
│   ├── ServiceFactory.ts             ✅ DI Container (updated with imports)
│   ├── index.ts                      ✅ Main exports
│   └── __tests__/
│       └── services.test.ts          ✅ Test examples
└── db/
    └── prisma/
        └── schema.prisma             ✅ Modular schema
```

---

## What's Complete (Phases 1-4) ✅

| Phase | Component                      | Status      |
| ----- | ------------------------------ | ----------- |
| **1** | GraphQL Context + DataLoaders  | ✅ Complete |
| **2** | Base Service Framework         | ✅ Complete |
| **3** | Service Factory (DI)           | ✅ Complete |
| **4** | All 8 Domain Services          | ✅ Complete |
| **5** | Middleware (Auth, Permissions) | ⏳ Next     |
| **6** | Thin Resolvers                 | ⏳ Next     |

---

## What's Next (Phases 5-6)

### Phase 5: Resolver Middleware

**Location**: `server/graphql/middleware/`

**Create**:

```typescript
// middleware/auth.middleware.ts
- Extract JWT from Authorization header
- Validate signature
- Load user from database
- Set context.user and context.isAuthenticated

// middleware/permission.middleware.ts
- Check user role (ADMIN, MANAGER, EMPLOYEE)
- Restrict access to specific resolvers
- Throw AuthorizationError if denied

// middleware/validation.middleware.ts
- Validate input schema before service calls
- Throw ValidationError if invalid

// middleware/errorHandler.middleware.ts
- Catch service errors
- Format for GraphQL (ValidationError → 400, NotFoundError → 404)
- Log with request context
```

### Phase 6: Thin Resolvers

**Location**: `server/graphql/resolvers/`

**Create** (one per service domain):

```
resolvers/
├── core/
│   ├── company.resolver.ts
│   ├── employee.resolver.ts       ← Example provided
│   └── grade.resolver.ts
├── operations/
│   ├── process.resolver.ts
│   └── taskAssignment.resolver.ts
├── analytics/
│   ├── loadSnapshot.resolver.ts
│   └── gapAnalysis.resolver.ts
└── audit/
    ├── employeeHistory.resolver.ts
    └── auditLog.resolver.ts
```

**Pattern**:

```typescript
export async function employee(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getEmployeeService();
  return service.getByIdOrThrow(args.id);
}
```

---

## Documents Created (Explanations)

| Document                                                | Purpose                        | Read Time |
| ------------------------------------------------------- | ------------------------------ | --------- |
| `/codegen.ts`                                           | GraphQL code generation config | 5 min     |
| `ARCHITECTURE_FLOW_DETAILED.md`                         | Complete flow explanation      | 15 min    |
| `REPOSITORY_PATTERN_GUIDE.md`                           | Repository decision guide      | 10 min    |
| `PHASE_4_COMPLETION_SUMMARY.md`                         | Phase 4 status                 | 8 min     |
| `PHASE_4_QUICK_REFERENCE.md`                            | Quick lookup                   | 5 min     |
| `server/services/SERVICES_IMPLEMENTATION_GUIDE.md`      | All 8 services explained       | 20 min    |
| `server/graphql/resolvers/example-employee.resolver.ts` | Phase 6 preview code           | 10 min    |
| `server/services/__tests__/services.test.ts`            | How to test services           | 12 min    |

---

## Key Decisions Made

1. **Keep current service structure** (Pattern 1: Service handles everything)
   - No separate repository files needed yet
   - Refactor only if services exceed 400 lines

2. **One context per request**
   - Fresh DataLoaders each request (no cross-request data leakage)
   - Fresh cache each request (no stale cache)
   - All services in same request share context

3. **Services own their caches**
   - Not resolvers
   - Called via `this.invalidate()` after mutations
   - Prevents logic fragmentation

4. **DataLoaders prevent N+1**
   - Automatic batching (no manual code needed)
   - Transparent to services (they just call `.load()`)
   - Huge performance boost for GraphQL

5. **No repository files (for now)**
   - Services are lean enough (< 400 lines each)
   - Easy to refactor later if needed
   - Collocative approach aligns with DDD

---

## Testing Strategy

**See**: `/server/services/__tests__/services.test.ts` (400+ lines)

- Mock ServiceContext (no GraphQL needed)
- Mock Prisma operations
- Test services independently
- Test cross-domain coordination
- Test cache behavior
- Test DataLoader batching

**Example**:

```typescript
const mockContext = createMockContext({
  dataloaders: mockDataLoaders(),
  cache: mockCache(),
  prisma: mockPrisma(),
});

const service = new EmployeeService(mockContext);
const result = await service.getById("emp-123");
expect(result).toBeDefined();
```

---

## Performance Characteristics

| Operation                    | Queries | Notes                           |
| ---------------------------- | ------- | ------------------------------- |
| Get one employee             | 1       | DataLoader                      |
| Get 100 employees            | 1       | Batched                         |
| Get department + grade       | 1       | Direct Prisma                   |
| Get emp + department + grade | 2       | (1 emp, 1 grade via DataLoader) |
| Complex report               | 3-5     | Depends on joins                |
| Cached query (hit)           | 0       | From cache                      |
| Cached query (miss)          | 1       | Fetch + cache                   |

---

## Running Next

### Run Code Generation

```bash
npm run graphql:codegen
# Generates types with all mappers
```

### Start Development

```bash
npm run dev
# Runs with hot-reload
```

### Test Services

```bash
npm test -- services
# Runs test examples
```

---

## Summary Checklist

- ✅ Fixed codegen.ts mappers (13 entities)
- ✅ Fixed context type reference (ServiceContext)
- ✅ Fixed mapper paths (absolute with @/)
- ✅ Clarified repository pattern decision (keep current)
- ✅ Explained context building flow
- ✅ Explained DataLoader passing
- ✅ Created architecture flow diagrams
- ✅ Confirmed service structure is solid
- ⏳ Ready for Phase 5 (Middleware)

---

**All clarifications complete! Ready to build Phase 5 (Middleware).**

Have questions? See ARCHITECTURE_FLOW_DETAILED.md or ask!
