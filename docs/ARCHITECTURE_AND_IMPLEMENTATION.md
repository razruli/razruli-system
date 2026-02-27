# Architecture & Implementation Guide

## Table of Contents

1. [Service Layer Architecture](#service-layer-architecture)
2. [Schema Organization](#schema-organization)
3. [Schema Overview](#schema-overview)

---

# Service Layer Architecture

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

# Schema Organization

## Folder Structure

```
server/db/prisma/
├── schema.prisma                          # ROOT: datasource + generator only
├── models/
│   ├── core/                              # 🏢 Company & Organizational
│   │   ├── company.prisma                 # Company, Department models
│   │   ├── employee.prisma                # Employee model
│   │   └── grade.prisma                   # Grade model
│   │
│   ├── operations/                        # 📋 Workload Management
│   │   ├── process.prisma                 # Process model
│   │   └── task-assignment.prisma         # TaskAssignment model
│   │
│   ├── analytics/                         # 📊 Analytics & Planning
│   │   ├── load-snapshot.prisma           # LoadSnapshot model
│   │   └── gap-analysis.prisma            # GapAnalysisResult, HiringRequest
│   │
│   ├── audit/                             # 📝 Compliance & History
│   │   └── audit.prisma                   # EmployeeHistory, AuditLog
│   │
│   └── auth/                              # 🔐 Authentication (better-auth)
│       └── better-auth.prisma             # User, Session, Account
│
├── migrations/                            # 🔄 Database Migrations
├── generated/                             # ✨ Generated Prisma Client
├── lib/                                   # Utility functions
├── seed.ts                               # Seed script
└── test.ts                               # Test utilities
```

## Prisma Configuration

**File:** `prisma.config.ts`

```typescript
export default defineConfig({
  schema: "./server/db/prisma/", // ⬅️ Loads ALL .prisma files recursively
  migrations: {
    path: "server/db/prisma/migrations",
    seed: `tsx server/db/prisma/seed.ts`,
  },
  datasource: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});
```

The `schema: "./server/db/prisma/"` setting tells Prisma to auto-discover all `.prisma` files in that folder and its subdirectories. No need for imports or includes!

## Model Organization by Domain

### 🏢 CORE DOMAIN (`/models/core/`)

**Purpose:** Organizational structure and master data

**Models:**

- `Company` - Root entity (1 per deployment)
- `Department` - Organizational units (1:N with Company)
- `Employee` - Team members (1:N with Department)
- `Grade` - Seniority levels (reference data)

**File Count:** 3 files

- `company.prisma` - Company, Department
- `employee.prisma` - Employee
- `grade.prisma` - Grade

**Typical Service Methods:**

```typescript
// companyService.ts
-getCompany(id) -
  listCompanies() -
  createCompany(data) -
  updateCompany(id, data) -
  // employeeService.ts
  getEmployee(id) -
  listEmployees(departmentId) -
  createEmployee(data) -
  updateEmployee(id, data) -
  getEmployeeLoadIndex(id, period);
```

---

### 📋 OPERATIONS DOMAIN (`/models/operations/`)

**Purpose:** Workload and task management

**Models:**

- `Process` - Business processes with complexity multipliers
- `TaskAssignment` - Task-to-employee assignments

**File Count:** 2 files

- `process.prisma` - Process
- `task-assignment.prisma` - TaskAssignment

**Typical Service Methods:**

```typescript
// processService.ts
-getProcess(id) -
  createProcess(data) -
  updateProcess(id, data) -
  listProcessesByDepartment(deptId) -
  // taskAssignmentService.ts
  assignTask(employeeId, processId, plannedHours) -
  updateTaskProgress(id, actualHours) -
  getEmployeeTasks(employeeId, period) -
  calculateTaskLoad(processData, executorGrade);
```

---

### 📊 ANALYTICS DOMAIN (`/models/analytics/`)

**Purpose:** Load metrics and capacity planning

**Models:**

- `LoadSnapshot` - Historical metrics for employee/department
- `GapAnalysisResult` - Capacity deficit analysis
- `HiringRequest` - Hiring workflow

**File Count:** 2 files

- `load-snapshot.prisma` - LoadSnapshot
- `gap-analysis.prisma` - GapAnalysisResult, HiringRequest

**Typical Service Methods:**

```typescript
// loadSnapshotService.ts
-createLoadSnapshot(companyId, employeeId, period, metrics) -
  getLatestSnapshot(employeeId, period) -
  listDepartmentSnapshots(departmentId) -
  calculateLoadIndex(totalLoad, capacity) -
  // gapAnalysisService.ts
  analyzeGap(departmentId, period) -
  getHiringRecommendations(departmentId) -
  createHiringRequest(data) -
  updateHiringStatus(id, status);
```

---

### 📝 AUDIT DOMAIN (`/models/audit/`)

**Purpose:** Compliance and change tracking

**Models:**

- `EmployeeHistory` - Field-level employee changes
- `AuditLog` - Entity-level changes (CREATE, UPDATE, DELETE)

**File Count:** 1 file

- `audit.prisma` - EmployeeHistory, AuditLog

**Typical Service Methods:**

```typescript
// employeeHistoryService.ts
-trackChange(employeeId, fieldName, oldValue, newValue, changedBy) -
  getChangeHistory(employeeId) -
  getFieldHistory(employeeId, fieldName) -
  // auditLogService.ts
  logAction(entityType, entityId, action, oldValues, newValues, changedBy) -
  getAuditTrail(companyId, period) -
  getEntityAuditLog(entityType, entityId);
```

---

### 🔐 AUTH DOMAIN (`/models/auth/`)

**Purpose:** User authentication and sessions (from better-auth)

**Models:**

- `User`, `Session`, `Account`, `Verification`, etc.

**File Count:** 1 file

- `better-auth.prisma`

---

## How Prisma Loads These Files

1. **Config reads schema folder:**

   ```
   schema: "./server/db/prisma/"
   ```

2. **Prisma discovers all .prisma files:**

   ```
   - schema.prisma (root config)
   - models/core/*.prisma
   - models/operations/*.prisma
   - models/analytics/*.prisma
   - models/audit/*.prisma
   - models/auth/*.prisma
   ```

3. **Combines all definitions into single schema:**
   - All models, enums, relations are merged
   - Validation happens on complete schema
   - A single Prisma Client is generated

4. **Generated Client includes all models:**

   ```typescript
   import { PrismaClient } from './db/generated/prisma';
   const prisma = new PrismaClient();

   // Access any model from any domain
   await prisma.company.findUnique(...);
   await prisma.employee.findMany(...);
   await prisma.process.create(...);
   await prisma.loadSnapshot.aggregate(...);
   ```

---

## Workflow for Adding New Models

1. **Identify the domain** (core, operations, analytics, audit)

2. **Create/update the appropriate .prisma file:**

   ```bash
   # Example: Adding new core model
   server/db/prisma/models/core/new-model.prisma
   ```

3. **Define your model with full documentation:**

   ```prisma
   /// Clear description of what this model represents
   model NewModel {
     id        String    @id @default(cuid())
     // ... fields
   }
   ```

4. **Create migration:**

   ```bash
   npx prisma migrate dev --name "add_new_model"
   ```

5. **Generated Client updates automatically**

6. **Create matching service:**
   ```bash
   server/services/core/newModelService.ts
   ```

---

## Quick Commands

```bash
# Validate schema (no DB changes)
npx prisma validate

# Check migration status
npx prisma migrate status

# Create new migration from schema changes
npx prisma migrate dev --name "your_change_name"

# Regenerate Prisma Client
npx prisma generate

# Reset database (DEV ONLY!)
npx prisma migrate reset --force

# Open Prisma Studio (DB viewer)
npx prisma studio
```

---

## Key Advantages of This Structure

✅ **Modularity:** Each domain is independent
✅ **Scalability:** Easy to add new models in existing domains
✅ **Maintainability:** Find related code easily
✅ **Service Mapping:** Services mirror model organization
✅ **Team Collaboration:** Clear domain ownership boundaries
✅ **Documentation:** Each file has clear purpose
✅ **Version Control:** Easier to review domain-specific changes
✅ **GraphQL Organization:** Aligns with schema federation

---

# Schema Overview

## Database Indexes

All tables include strategic indexes for query optimization:

```sql
-- CORE DOMAIN
Employee: (companyId, departmentId, gradeId, status)
Department: (companyId)
Company: (primary key)
Grade: (primary key)

-- OPERATIONS DOMAIN
Process: (companyId, departmentId, targetGradeId, status)
TaskAssignment: (companyId, employeeId, processId, status, createdAt)

-- ANALYTICS DOMAIN
LoadSnapshot: (companyId, employeeId, departmentId, periodStart-periodEnd)
GapAnalysisResult: (companyId, departmentId, createdAt)
HiringRequest: (companyId, departmentId, status)

-- AUDIT DOMAIN
EmployeeHistory: (employeeId, changedAt, fieldName)
AuditLog: (companyId, entityType-entityId, action, changedAt)
```

## Unique Constraints

**Multi-field Uniqueness:**

- Company: (name) globally unique
- Department: (companyId, name) - name unique per company
- Employee: (companyId, fio) - name unique per company
- LoadSnapshot: (companyId, employeeId, periodStart, periodEnd)
- LoadSnapshot: (companyId, departmentId, periodStart, periodEnd)

## Foreign Key Relationships

### Company (Root)

```
Company
├── Department (onDelete: Cascade)
├── Employee (onDelete: Cascade)
├── Process (onDelete: Cascade)
├── TaskAssignment (onDelete: Cascade)
└── LoadSnapshot (onDelete: Cascade)
```

### Department

```
Department
├── Employee (onDelete: Cascade)
├── Employee.head (one-to-one via headId)
├── Process (onDelete: Cascade)
├── TaskAssignment (onDelete: Cascade)
└── LoadSnapshot (onDelete: Cascade)
```

### Employee

```
Employee
├── Department (onDelete: Cascade)
├── Grade (required)
├── TaskAssignment (onDelete: Cascade)
├── LoadSnapshot (onDelete: Cascade)
└── EmployeeHistory (onDelete: Cascade)
```

---

## Migrations

Migrations are stored in `/server/db/prisma/migrations/`.

### Current Version

- **Migration:** `20260224140838_init_multi_schema_setup`
- **Date:** February 24, 2026
- **Status:** Applied to production database at db.prisma.io

### Running Migrations

```bash
# Create a new migration
npx prisma migrate dev --name "feature_name"

# Apply migrations to production
npx prisma migrate deploy

# View migration status
npx prisma migrate status

# Reset database (development only!)
npx prisma migrate reset
```

---

## Multi-Company Support

All main entities require `companyId`:

- Department
- Employee
- Process
- TaskAssignment
- LoadSnapshot
- GapAnalysisResult
- HiringRequest

This ensures complete tenant isolation at the database level.

---

## Future Enhancements

- [ ] PostgreSQL schemas for physical separation (core, operations, analytics, audit)
- [ ] Row-level security (RLS) policies for tenant isolation
- [ ] Materialized views for complex analytics queries
- [ ] Event sourcing for complete audit trail
- [ ] Full-text search on process descriptions
- [ ] Partitioning of LoadSnapshot by date range
