// ============================================================================
// SERVICE LAYER ARCHITECTURE - Strategic Decisions
// ============================================================================
// Date: February 24, 2026
// Context: GraphQL + DataLoaders + Service Factories + Cache Management
// ============================================================================

## Executive Summary

**Answer to your questions:**

1. **CRUD Service vs Service Factories?**
   → **Service Factories** (with dependency injection)
   Why: Better composition, testability, cross-domain coordination

2. **When to setup GraphQL Context?**
   → **FIRST** (before services)
   Why: Context is the contract services depend on; defines DataLoader interface

3. **Correct Sequence:**
   1. GraphQL Context setup (with DataLoaders)
   2. Base Service interfaces (define service contract)
   3. Service Factory pattern (setup DI)
   4. Domain services built with factories
   5. Resolver middleware (auth/permissions)
   6. Thin resolvers (call services)

4. **Cache/Stale Data Issues:**
   → Services handle invalidation, not resolvers
   → DataLoaders prevent N+1, Services prevent stale data
   → Context provides the cache control surface

---

## Problem Analysis

### Current Pain Points

1. **DataLoader Caching** - Per-request, automatic batching
2. **IPC/Cache Invalidation** - Cross-domain mutations
3. **Middleware Conflicts** - Auth vs Service logic separation
4. **N+1 Queries** - Even with resolvers, can happen in services
5. **Stale Data** - When mutations happen outside of current request
6. **Testing** - Services tightly coupled to framework

### Why NOT CRUD Extension?

```typescript
// ❌ BAD: Hard to test, tight coupling, limited composition
abstract class BaseCRUDService {
  async create() {}
  async read() {}
  async update() {}
  async delete() {}
}

class UserService extends BaseCRUDService {
  // Limited to CRUD, hard to add business logic
}
```

### Why Service Factories?

```typescript
// ✅ GOOD: Testable, flexible, composable, DI-friendly
interface ServiceContext {
  prisma: PrismaClient;
  dataloaders: DataLoaders;
  userId: string;
}

class ServiceFactory {
  constructor(private context: ServiceContext) {}

  userService() {
    return new UserService(this.context);
  }

  employeeService() {
    return new EmployeeService(this.context);
  }
}
```

---

## Architecture Layers (Top to Bottom)

```
┌─────────────────────────────────────────────────────────┐
│                   GraphQL Resolvers                     │
│           (Thin - just call services)                   │
└────────────────────┬────────────────────────────────────┘
                     │ calls
┌────────────────────▼────────────────────────────────────┐
│          Middleware (Auth, Permissions)                 │
│    (Validates context before services)                  │
└────────────────────┬────────────────────────────────────┘
                     │ creates/validates
┌────────────────────▼────────────────────────────────────┐
│          GraphQL Context Builder                        │
│  - DataLoaders (batching, per-request caching)          │
│  - Auth info (from middleware)                          │
│  - Cache invalidation handles                           │
│  - Request-scoped utilities                             │
└────────────────────┬────────────────────────────────────┘
                     │ injected into
┌────────────────────▼────────────────────────────────────┐
│           Service Factory                               │
│  (Dependency Injection Container)                       │
└────────────────────┬────────────────────────────────────┘
                     │ creates
┌────────────────────▼────────────────────────────────────┐
│             Domain Services                             │
│  ├─ core/UserService                                    │
│  ├─ operations/ProcessService                           │
│  └─ analytics/LoadCalculationService                    │
│  (Business logic, coordinates DataLoaders)              │
└────────────────────┬────────────────────────────────────┘
                     │ uses
┌────────────────────▼────────────────────────────────────┐
│        Prisma Client (ORM)                              │
│  (Database access - never call directly from resolvers) │
└─────────────────────────────────────────────────────────┘
```

---

## Correct Implementation Sequence

### Phase 1: GraphQL Context (FIRST!)

**Why First?** Services depend on context contract

```typescript
// types/context.ts
interface ServiceContext {
  // Auth & User
  userId: string | null;
  user?: User;

  // Database
  prisma: PrismaClient;

  // DataLoaders (prevent N+1)
  dataloaders: {
    employeeLoader: DataLoader<string, Employee>;
    departmentLoader: DataLoader<string, Department>;
    processLoader: DataLoader<string, Process>;
    gradeLoader: DataLoader<number, Grade>;
  };

  // Cache Invalidation
  invalidateCache: (keys: string[]) => void;
  cacheKey: (domain: string, id: string) => string;

  // Request metadata
  requestId: string;
  timestamp: Date;
}

// context/builder.ts
export async function buildContext(req: Request): Promise<ServiceContext> {
  const userId = await extractUserId(req);

  return {
    userId,
    user: await fetchUser(userId),
    prisma,
    dataloaders: initializeDataLoaders(),
    invalidateCache: (keys) => cache.invalidate(keys),
    cacheKey: (domain, id) => `${domain}:${id}`,
    requestId: generateRequestId(),
    timestamp: new Date(),
  };
}
```

### Phase 2: Base Service Interfaces

**Why?** Defines the contract all services follow

```typescript
// services/base/types.ts
export interface IService {
  context: ServiceContext;
  invalidate(id: string): void;
}

// services/base/BaseService.ts
export abstract class BaseService implements IService {
  constructor(protected context: ServiceContext) {}

  protected getCacheKey(id: string): string {
    return this.context.cacheKey(this.domain, id);
  }

  invalidate(id: string): void {
    this.context.invalidateCache([this.getCacheKey(id)]);
  }

  protected abstract domain: string;
}

// services/base/Repository.ts
// Optional: Thin wrapper around Prisma for specific model
export abstract class BaseRepository {
  constructor(protected context: ServiceContext) {}
  protected get prisma() {
    return this.context.prisma;
  }
}
```

### Phase 3: Service Factory (Dependency Injection)

**Why?** Central place to wire everything together

```typescript
// services/ServiceFactory.ts
export class ServiceFactory {
  private userService: UserService;
  private employeeService: EmployeeService;
  private processService: ProcessService;
  private analyticsService: AnalyticsService;

  constructor(private context: ServiceContext) {
    // Lazy-load or eager-load services
    // Can be extended for additional services
  }

  // Factory methods for each domain
  getUserService(): UserService {
    return new UserService(this.context);
  }

  getEmployeeService(): EmployeeService {
    return new EmployeeService(this.context);
  }

  getProcessService(): ProcessService {
    return new ProcessService(this.context);
  }

  getAnalyticsService(): AnalyticsService {
    return new AnalyticsService(this.context);
  }

  // Helper for cross-domain operations
  getServices() {
    return {
      user: this.getUserService(),
      employee: this.getEmployeeService(),
      process: this.getProcessService(),
      analytics: this.getAnalyticsService(),
    };
  }
}

// Usage in resolvers
export const resolvers = {
  Query: {
    employee: async (_, { id }, context: ServiceContext) => {
      const factory = new ServiceFactory(context);
      const service = factory.getEmployeeService();
      return service.getById(id);
    },
  },
};
```

### Phase 4: Domain Services with DataLoaders

**Why?** Business logic that knows how to use DataLoaders

```typescript
// services/core/EmployeeService.ts
export class EmployeeService extends BaseService {
  protected domain = "employee";

  constructor(context: ServiceContext) {
    super(context);
  }

  // Method 1: Single fetch (uses DataLoader for batching)
  async getById(id: string): Promise<Employee> {
    return this.context.dataloaders.employeeLoader.load(id);
  }

  // Method 2: Batch fetch (also uses DataLoader)
  async getByIds(ids: string[]): Promise<Employee[]> {
    return this.context.dataloaders.employeeLoader.loadMany(ids);
  }

  // Method 3: Direct query (bypasses DataLoader for specific needs)
  async getAllByDepartment(departmentId: string): Promise<Employee[]> {
    return this.context.prisma.employee.findMany({
      where: { departmentId },
    });
  }

  // Method 4: Mutation (handles cache invalidation)
  async updateEmployee(
    id: string,
    data: UpdateEmployeeInput,
  ): Promise<Employee> {
    const updated = await this.context.prisma.employee.update({
      where: { id },
      data,
    });

    // Invalidate related caches
    this.invalidate(id);
    this.context.invalidateCache([
      this.context.cacheKey("department", updated.departmentId),
    ]);

    return updated;
  }

  // Method 5: Business logic (coordinates DataLoaders)
  async getLoadIndexWithDepartment(employeeId: string) {
    const employee = await this.getById(employeeId);
    const department = await this.context.dataloaders.departmentLoader.load(
      employee.departmentId,
    );

    const load = await this.calculateLoad(employeeId);

    return { employee, department, load };
  }

  private async calculateLoad(employeeId: string): Promise<number> {
    const tasks = await this.context.prisma.taskAssignment.findMany({
      where: { employeeId },
    });

    // This uses resolver middleware, OR queries dataloader
    return tasks.reduce((sum, task) => sum + (task.calculatedLoad || 0), 0);
  }
}
```

### Phase 5: Resolver Middleware Layer

**Why?** Separates auth/validation from business logic

```typescript
// graphql/middleware/authMiddleware.ts
export async function authMiddleware(req: Request): Promise<string | null> {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  if (!token) return null;

  const userId = await verifyToken(token);
  return userId;
}

// graphql/middleware/permissionMiddleware.ts
export async function checkPermission(
  context: ServiceContext,
  resource: string,
  action: string,
): Promise<boolean> {
  if (!context.userId) return false;

  // Check permissions: stored in DB or JWT
  const hasPermission = await context.prisma.permission.findUnique({
    where: {
      userId_resource_action: {
        userId: context.userId,
        resource,
        action,
      },
    },
  });

  return !!hasPermission;
}

// graphql/middleware/index.ts
export async function resolverMiddleware(
  resolver: Function,
  context: ServiceContext,
  args: any,
  options: { requireAuth?: boolean; requiredPermissions?: string[] } = {},
) {
  // 1. Auth validation
  if (options.requireAuth && !context.userId) {
    throw new Error("UNAUTHENTICATED");
  }

  // 2. Permission checks
  if (options.requiredPermissions) {
    for (const permission of options.requiredPermissions) {
      const [resource, action] = permission.split(":");
      const allowed = await checkPermission(context, resource, action);
      if (!allowed) {
        throw new Error("UNAUTHORIZED");
      }
    }
  }

  // 3. Call resolver (or throw before reaching service)
  return resolver(context, args);
}
```

### Phase 6: Thin Resolvers

**Why?** Just orchestration, no business logic

```typescript
// graphql/resolvers/employeeResolver.ts
export const employeeResolvers = {
  Query: {
    employee: withMiddleware(
      async (context: ServiceContext, { id }: { id: string }) => {
        const factory = new ServiceFactory(context);
        return factory.getEmployeeService().getById(id);
      },
      { requireAuth: true },
    ),

    employees: async (context: ServiceContext, { departmentId }: any) => {
      const factory = new ServiceFactory(context);
      return factory.getEmployeeService().getAllByDepartment(departmentId);
    },
  },

  Mutation: {
    updateEmployee: withMiddleware(
      async (
        context: ServiceContext,
        { id, data }: { id: string; data: UpdateEmployeeInput },
      ) => {
        const factory = new ServiceFactory(context);
        return factory.getEmployeeService().updateEmployee(id, data);
      },
      {
        requireAuth: true,
        requiredPermissions: ["employee:update"],
      },
    ),
  },

  Employee: {
    // Field resolver with DataLoader
    department: async (employee: Employee, _, context: ServiceContext) => {
      return context.dataloaders.departmentLoader.load(employee.departmentId);
    },

    grade: async (employee: Employee, _, context: ServiceContext) => {
      return context.dataloaders.gradeLoader.load(employee.gradeId);
    },

    // Expensive calculation
    loadIndex: async (employee: Employee, _, context: ServiceContext) => {
      const factory = new ServiceFactory(context);
      const analytics = factory.getAnalyticsService();
      return analytics.calculateEmployeeLoad(employee.id);
    },
  },
};

// Helper function
function withMiddleware(resolver: Function, options: MiddlewareOptions = {}) {
  return async (parent: any, args: any, context: ServiceContext, info: any) => {
    await resolverMiddleware(resolver, context, args, options);
    return resolver(context, args);
  };
}
```

---

## Handling Cross-Domain Issues

### Issue 1: N+1 Queries in Service Methods

❌ **BAD:**

```typescript
async getEmployeesWithDepartments() {
  const employees = await this.prisma.employee.findMany();
  // This causes N+1: one query for each employee's department
  return employees.map(emp => ({
    ...emp,
    department: this.context.dataloaders.departmentLoader.load(emp.departmentId)
  }));
}
```

✅ **GOOD:**

```typescript
async getEmployeesWithDepartments() {
  const employees = await this.prisma.employee.findMany({
    include: { department: true }, // Single query!
  });
  return employees;
}

// OR use DataLoader only when not pre-loaded
async getEmployeesDynamic(departmentIds: string[]) {
  const employees = await this.prisma.employee.findMany({
    where: { departmentId: { in: departmentIds } },
  });

  // Only use DataLoader for missing departments
  return Promise.all(
    employees.map(emp =>
      this.context.dataloaders.departmentLoader.load(emp.departmentId)
    )
  );
}
```

### Issue 2: Cache Invalidation on Mutations

✅ **CORRECT PATTERN:**

```typescript
// When service updates data, it invalidates caches
async updateEmployee(id: string, data: any) {
  const updated = await this.prisma.employee.update({
    where: { id },
    data,
  });

  // Invalidate this employee's cache
  this.context.invalidateCache([
    this.context.cacheKey('employee', id)
  ]);

  // Invalidate related caches
  if (data.departmentId) {
    this.context.invalidateCache([
      this.context.cacheKey('department', data.departmentId)
    ]);
  }

  // Clear query caches if needed
  this.context.invalidateCache([
    `query:employees:all`,
    `query:employees:${data.departmentId}`,
  ]);

  return updated;
}
```

### Issue 3: Cross-Domain Service Coordination

✅ **USE SERVICE FACTORY:**

```typescript
// When one service needs another service
export class ProcessService extends BaseService {
  async assignProcess(employeeId: string, processId: string) {
    // Get factory to access other services
    const factory = new ServiceFactory(this.context);
    const employeeService = factory.getEmployeeService();
    const analyticsService = factory.getAnalyticsService();

    // Check employee capacity
    const employee = await employeeService.getById(employeeId);
    const currentLoad = await analyticsService.calculateLoad(employeeId);

    if (currentLoad + 1.0 > 1.1) {
      throw new Error("Employee is overloaded");
    }

    // Then proceed with task assignment
    return this.context.prisma.taskAssignment.create({
      data: { employeeId, processId, plannedHours: 8 },
    });
  }
}
```

---

## DataLoader Configuration

```typescript
// dataloaders/index.ts
import DataLoader from "dataloader";

export function initializeDataLoaders() {
  return {
    // Employee loader with batching
    employeeLoader: new DataLoader(async (ids: string[]) => {
      const employees = await prisma.employee.findMany({
        where: { id: { in: ids } },
      });

      // Return in same order as requested
      return ids.map((id) => employees.find((e) => e.id === id) || null);
    }),

    // Department loader
    departmentLoader: new DataLoader(async (ids: string[]) => {
      const departments = await prisma.department.findMany({
        where: { id: { in: ids } },
      });
      return ids.map((id) => departments.find((d) => d.id === id) || null);
    }),

    // Process loader
    processLoader: new DataLoader(async (ids: string[]) => {
      const processes = await prisma.process.findMany({
        where: { id: { in: ids } },
      });
      return ids.map((id) => processes.find((p) => p.id === id) || null);
    }),

    // Grade loader (static data, could cache longer)
    gradeLoader: new DataLoader(async (ids: number[]) => {
      const grades = await prisma.grade.findMany({
        where: { id: { in: ids } },
      });
      return ids.map((id) => grades.find((g) => g.id === id) || null);
    }),
  };
}
```

---

## Stale Data Prevention

### Strategy 1: Per-Request Cache (DataLoader)

- Automatic within GraphQL request
- Prevents N+1 within single request
- Solves 95% of N+1 problems

### Strategy 2: Service-Level Invalidation

- When mutation occurs, invalidate caches
- Services own their cache keys
- Prevents stale data across requests

### Strategy 3: TTL Cache (Optional)

```typescript
// For rarely-changed reference data (Grades, etc.)
interface CacheEntry {
  data: any;
  expiresAt: Date;
}

const cache = new Map<string, CacheEntry>();

function setCache(key: string, data: any, ttlMs = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    expiresAt: new Date(Date.now() + ttlMs),
  });
}

function getCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < new Date()) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}
```

---

## Directory Structure

```
server/
├── graphql/
│   ├── context/
│   │   ├── builder.ts               (Create context from request)
│   │   ├── dataloaders.ts           (Initialize DataLoaders)
│   │   └── types.ts                 (Context interface)
│   │
│   ├── middleware/
│   │   ├── auth.ts                  (Authentication)
│   │   ├── permission.ts            (Authorization)
│   │   ├── validation.ts            (Input validation)
│   │   └── index.ts                 (Middleware orchestrator)
│   │
│   ├── resolvers/
│   │   ├── core/
│   │   │   ├── company.ts
│   │   │   ├── employee.ts
│   │   │   └── grade.ts
│   │   ├── operations/
│   │   │   ├── process.ts
│   │   │   └── taskAssignment.ts
│   │   ├── analytics/
│   │   │   ├── loadSnapshot.ts
│   │   │   └── gapAnalysis.ts
│   │   └── index.ts                 (Merge all resolvers)
│   │
│   └── schema/
│       ├── core.graphql
│       ├── operations.graphql
│       ├── analytics.graphql
│       └── index.graphql             (Merge all schemas)
│
├── services/
│   ├── base/
│   │   ├── types.ts                 (IService interface)
│   │   └── BaseService.ts
│   │
│   ├── core/
│   │   ├── CompanyService.ts
│   │   ├── EmployeeService.ts
│   │   └── GradeService.ts
│   │
│   ├── operations/
│   │   ├── ProcessService.ts
│   │   └── TaskAssignmentService.ts
│   │
│   ├── analytics/
│   │   ├── LoadSnapshotService.ts
│   │   └── GapAnalysisService.ts
│   │
│   ├── audit/
│   │   ├── EmployeeHistoryService.ts
│   │   └── AuditLogService.ts
│   │
│   └── ServiceFactory.ts            (DI container)
│
└── types/
    ├── context.ts
    ├── services.ts
    └── ...
```

---

## Execution Flow Example

```
1. GraphQL Request arrives
   ├─ Check auth middleware
   ├─ Verify permissions
   └─ Create context with DataLoaders
        │
        ├─ DataLoaders initialized (empty)
        ├─ Auth info attached
        ├─ Prisma client set
        └─ Cache invalidation functions set

2. Resolver executes
   ├─ Create ServiceFactory(context)
   ├─ Call factory.getEmployeeService()
   ├─ Call service.getById(id)
   │   └─ service calls dataloader.load(id)
   │       └─ Dataloader queues request, batches with other calls
   │
   └─ Field resolver: employee.department
       ├─ Calls dataloader.departmentLoader.load(deptId)
       └─ Dataloader notices batching window, executes batch query

3. Response assembled
   ├─ All DataLoaders executed (single query per type)
   ├─ Cache entries created per request
   └─ Return to client

4. On mutation
   ├─ Service updates database
   ├─ Service calls context.invalidateCache(keys)
   ├─ Next request gets fresh data
   └─ Prevents stale data issues
```

---

## Key Takeaways

✅ **Setup Sequence:**

1. GraphQL Context first (defines contract)
2. Base interfaces (establishes patterns)
3. Service Factory (DI container)
4. Domain services (business logic)
5. Middleware (auth/permissions)
6. Thin resolvers (orchestration only)

✅ **Use Service Factories** not CRUD extensions

- Better composition
- Easier testing
- Dependency injection
- Cross-domain coordination

✅ **DataLoaders in Context**

- Automatic N+1 prevention
- Per-request batching
- Services use via context

✅ **Services Handle Cache Invalidation**

- Services own their cache keys
- Prevent stale data
- Resolvers never directly manage cache

✅ **Avoid Middleware-Service Conflicts**

- Middleware: Auth validation
- Services: Business logic
- Clear separation of concerns

✅ **Testing:**

```typescript
// Services are testable (no GraphQL dependency)
const mockContext: ServiceContext = {
  userId: "test-user",
  prisma: mockPrismaClient,
  dataloaders: mockDataLoaders,
  // ...
};

const service = new EmployeeService(mockContext);
const result = await service.getById("test-id");
```

---

## Next Actions

1. ✅ Create GraphQL context builder
2. ✅ Setup DataLoaders in context
3. ✅ Create base service interfaces
4. ✅ Build ServiceFactory
5. ✅ Create domain services (core, operations, analytics, audit)
6. ✅ Add middleware layer
7. ✅ Create thin resolvers
8. ✅ Test everything

**Ready to implement?** Let's start with the context layer!
