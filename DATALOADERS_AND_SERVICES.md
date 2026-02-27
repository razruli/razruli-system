# DataLoaders & Services Registry - Complete Guide

Complete integration of dataloaders and services for efficient GraphQL operations with N+1 query prevention and proper dependency management.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  GraphQL Request                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │   buildGraphQLContext()            │
    │   (app/api/graphql/context.ts)     │
    └────────┬───────────────────────────┘
             │
  ┌──────────┼──────────┬──────────┬──────────┐
  │          │          │          │          │
  ▼          ▼          ▼          ▼          ▼
 User     Prisma   DataLoaders  Cache    ServiceContext
  │          │          │          │          │
  └──────────┼──────────┴──────────┴──────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │   ServiceFactory            │
    │   (creates all services)    │
    └──────────┬──────────────────┘
               │
  ┌────────────┼────────────┬────────────┬────────────┐
  │            │            │            │            │
  ▼            ▼            ▼            ▼            ▼
Company    Department   Employee      Grade      Process
  │            │            │            │            │
  └────────────┼────────────┴────────────┴────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │   GraphQLContext            │
    │   (ready for resolvers)     │
    └─────────────────────────────┘
```

## DataLoaders Registry

**Location:** `server/graphql/context/dataloaders.ts`

Prevents N+1 queries by batching requests within a single GraphQL request.

### Single-Loader Pattern

Load single entities by ID:

```typescript
// Usage in resolvers
const employee = await context.loaders.employee.load("emp-123");
const company = await context.loaders.company.load("comp-456");
const grade = await context.loaders.grade.load(5);

// Loads are batched automatically:
// Single DB query for all .load() calls made in this batch
```

### Available Single Loaders

| Loader                    | Key Type | Returns                   |
| ------------------------- | -------- | ------------------------- |
| `loaders.user`            | string   | User \| null              |
| `loaders.company`         | string   | Company \| null           |
| `loaders.department`      | string   | Department \| null        |
| `loaders.employee`        | string   | Employee \| null          |
| `loaders.grade`           | number   | Grade \| null             |
| `loaders.process`         | string   | Process \| null           |
| `loaders.taskAssignment`  | string   | TaskAssignment \| null    |
| `loaders.loadSnapshot`    | string   | LoadSnapshot \| null      |
| `loaders.gapAnalysis`     | string   | GapAnalysisResult \| null |
| `loaders.employeeHistory` | string   | EmployeeHistory \| null   |
| `loaders.auditLog`        | string   | AuditLog \| null          |

### Batch-Loader Pattern

Load collections of entities:

```typescript
// Get all employees in a department
const employees = await context.loaders.employeesByDepartment.load("dept-123");

// Get all tasks for an employee
const tasks = await context.loaders.tasksByEmployee.load("emp-456");

// Get all load snapshots for an employee
const snapshots = await context.loaders.snapshotsByEmployee.load("emp-789");

// All are batched automatically
```

### Available Batch Loaders

| Loader                  | Loads                                |
| ----------------------- | ------------------------------------ |
| `employeesByDepartment` | All employees in a department        |
| `tasksByEmployee`       | All task assignments for an employee |
| `snapshotsByEmployee`   | All load snapshots for an employee   |

## Services Registry

**Location:** `server/services/ServiceFactory.ts`

Business logic layer that uses dataloaders and handles mutations, validation, and caching.

### Available Services

```typescript
// Core domain
context.services.company; // CompanyService
context.services.department; // DepartmentService
context.services.employee; // EmployeeService
context.services.grade; // GradeService

// Operations domain
context.services.process; // ProcessService
context.services.taskAssignment; // TaskAssignmentService

// Analytics domain
context.services.loadSnapshot; // LoadSnapshotService
context.services.gapAnalysis; // GapAnalysisService

// Audit domain
context.services.employeeHistory; // EmployeeHistoryService
context.services.auditLog; // AuditLogService

// Auth domain
context.services.user; // UserService
```

### Service Interface Pattern

All services follow this pattern:

```typescript
class MyService extends BaseService {
  // ==================== Queries ====================
  async getById(id: string): Promise<Entity | null>;
  async getAll(): Promise<Entity[]>;

  // ==================== Mutations ====================
  async create(data: CreateInput): Promise<Entity>;
  async update(id: string, data: UpdateInput): Promise<Entity>;
  async delete(id: string): Promise<Entity>;

  // ==================== Cache Management ====================
  invalidate(id: string): void;

  // Domain identification
  readonly domain: string;
}
```

## Complete Usage Examples

### Example 1: Load Employee with DataLoader

```typescript
// In GraphQL resolver
export const Query = {
  employee: withMiddleware(
    async (_parent, { id }, context) => {
      // Uses dataloader - batches with other .load() calls
      return context.loaders.employee.load(id);
    },
    { requireAuth: true },
  ),
};
```

**What happens:**

1. Request comes in with 10 employee IDs to load
2. All 10 IDs go to same batch
3. Single DB query: `WHERE id IN (id1, id2, ... id10)`
4. Results returned in original order

### Example 2: Create Employee with Service

```typescript
export const Mutation = {
  createEmployee: withMiddleware(
    async (_parent, { input }, context) => {
      // Service validates input, handles inserts, invalidates cache
      const employee = await context.services.employee.create({
        name: input.name,
        email: input.email,
        departmentId: input.departmentId,
        gradeId: input.gradeId,
      });

      return employee;
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:create"],
      validate: (args) => args.input && args.input.name && args.input.email,
    },
  ),
};
```

**What happens:**

1. Middleware validates auth and permissions
2. Service validates input data
3. Service creates employee in database
4. Service invalidates related caches
5. Fresh data returned to client

### Example 3: Load Department with Employees

```typescript
export const Query = {
  departmentWithEmployees: withMiddleware(
    async (_parent, { id }, context) => {
      // Get department
      const department = await context.loaders.department.load(id);
      if (!department) throw new Error("Department not found");

      // Get all employees in department using batch loader
      const employees = await context.loaders.employeesByDepartment.load(id);

      return {
        ...department,
        employees,
      };
    },
    { requireAuth: true },
  ),
};
```

**What happens:**

1. Single batch query for department (even if 100 requests)
2. Single batch query for employees by department
3. Two total database queries, no N+1

### Example 4: Update Task with Service

```typescript
export const Mutation = {
  updateTaskStatus: withMiddleware(
    async (_parent, { taskId, status }, context) => {
      // Service handles state transitions validation
      const task = await context.services.taskAssignment.update(taskId, {
        status,
      });

      // Service automatically:
      // - Validates status is valid
      // - Logs to audit trail
      // - Recalculates employee load
      // - Invalidates relevant caches

      return task;
    },
    {
      requireAuth: true,
      requiredPermissions: ["task:update"],
    },
  ),
};
```

### Example 5: Complex Query with Multiple Services

```typescript
export const Query = {
  employeeDashboard: withMiddleware(
    async (_parent, { employeeId }, context) => {
      // All these happen in parallel, single batch per loader type
      const [employee, tasks, snapshots, department] = await Promise.all([
        context.loaders.employee.load(employeeId),
        context.loaders.tasksByEmployee.load(employeeId),
        context.loaders.snapshotsByEmployee.load(employeeId),
        context.loaders.department.load(employee.departmentId), // Could fail if employee not found
      ]);

      // Total: 4 database queries (not N+1)
      // No matter how many fields resolver requests

      return {
        employee,
        tasks,
        snapshots,
        department,
      };
    },
    { requireAuth: true },
  ),
};
```

## Caching System

**Location:** `server/graphql/context/cache.ts`

Two-layer cache:

### Request-Scoped Cache (Ephemeral)

- Lives for duration of single GraphQL request
- Automatically freed after request completes
- Used for in-request deduplication

### Persistent Cache (Optional TTL)

- Lives across requests
- Has optional TTL
- Can be invalidated on mutations

### Cache Usage in Services

```typescript
export class EmployeeService extends BaseService {
  async getById(id: string) {
    // Generate cache key
    const key = this.cacheKey(id);

    // Get from cache (or null if not there)
    let employee = this.getFromCache(key);
    if (employee) return employee;

    // Not in cache, fetch from DB
    employee = await this.context.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) throw new NotFoundError("Employee", id);

    // Store in cache with optional TTL
    return this.setInCache(key, employee, 5 * 60 * 1000); // 5 minutes TTL
  }

  async update(id: string, data: any) {
    const updated = await this.context.prisma.employee.update({
      where: { id },
      data,
    });

    // Invalidate cache after mutation
    this.invalidate(id);

    return updated;
  }
}
```

## Performance Characteristics

### DataLoader Batching

```
Without loader (N+1):
GET /employees/1        → 1 query
GET /employees/1/dept   → 1 query
GET /employees/2        → 1 query
GET /employees/2/dept   → 1 query
...
Total: 200 queries for 100 employees

With loader:
Load depts for [1,2,3,4,...,100]     → 1 query
Load emps for [1,2,3,4,...,100]      → 1 query
Total: 2 queries
```

### Service Caching

```
Request 1: Get user "alice"  → 1 DB query, cached
Request 1: Get user "alice"  → 0 DB queries (from cache)
Request 2: Get user "alice"  → New request, cache invalidated

After update mutation:
Cache invalidated → Next request fresh from DB
```

## Request Flow Diagram

```
┌────────────────────────────────────────────┐
│        GraphQL Request Arrives             │
└───────────────┬────────────────────────────┘
                │
                ▼
        ┌──────────────────┐
        │ Extract User     │
        │ (JWT/Session)    │
        └───────┬──────────┘
                │
                ▼
        ┌──────────────────────────┐
        │ buildGraphQLContext()    │
        │ 1. Create DataLoaders    │
        │ 2. Create Cache          │
        │ 3. Create ServiceContext │
        │ 4. Create ServiceFactory │
        │ 5. Get all Services      │
        └───────┬──────────────────┘
                │
                ▼
        ┌──────────────────────────┐
        │ Execute GraphQL Query    │
        │ With middleware:         │
        │ - Auth check             │
        │ - Permission check       │
        │ - Validation             │
        └───────┬──────────────────┘
                │
                ▼
        ┌──────────────────────────┐
        │ Resolver Execution       │
        │ Uses dataloaders:        │
        │ - Batch loads entities   │
        │ - Single DB query       │
        │ - Results cached        │
        └───────┬──────────────────┘
                │
                ▼
        ┌──────────────────────────┐
        │ Service Calls            │
        │ Uses cache:              │
        │ - Check cache first      │
        │ - Invalidate on mutation │
        │ - Return fresh data      │
        └───────┬──────────────────┘
                │
                ▼
        ┌──────────────────────────┐
        │ Return GraphQL Response  │
        │ Clean up resources       │
        └──────────────────────────┘
```

## Best Practices

### 1. Always Use DataLoaders for Queries

```typescript
// ✅ Good - prevents N+1
const employee = await context.loaders.employee.load(id);

// ❌ Bad - potential N+1
const employee = await context.prisma.employee.findUnique({ where: { id } });
```

### 2. Use Services for Mutations

```typescript
// ✅ Good - services handle validation, cache invalidation
await context.services.employee.update(id, data);

// ❌ Bad - missing validation and cache invalidation
await context.prisma.employee.update({ where: { id }, data });
```

### 3. Load Related Data Efficiently

```typescript
// ✅ Good - 2 queries
const employees = await context.loaders.employeesByDepartment.load(deptId);

// ❌ Bad - N+1 for each department
const employees = await Promise.all(
  depts.map((d) =>
    context.prisma.employee.findMany({
      where: { departmentId: d.id },
    }),
  ),
);
```

### 4. Parallel Loads

```typescript
// ✅ Good - all batched together
const [emp, dept, grade] = await Promise.all([
  context.loaders.employee.load(empId),
  context.loaders.department.load(deptId),
  context.loaders.grade.load(gradeId),
]);
```

### 5. Cache Invalidation After Mutations

```typescript
// Service handles this automatically, but important to know:
async update(id: string, data: any) {
  const result = await this.context.prisma.entity.update({
    where: { id },
    data
  });

  // IMPORTANT: Invalidate cache
  this.invalidate(id);

  return result;
}
```

## Testing Services

```typescript
import { DepartmentService } from "@/server/services/core/department";

describe("DepartmentService", () => {
  it("should create department", async () => {
    const mockContext = {
      prisma: mockPrisma,
      loaders: mockLoaders,
      cache: mockCache,
      // ...
    };

    const service = new DepartmentService(mockContext);
    const result = await service.create({
      name: "Engineering",
      companyId: "comp-1",
    });

    expect(result.name).toBe("Engineering");
  });
});
```

## API Reference

### DataLoaderRegistry

```typescript
interface DataLoaderRegistry {
  // Single entity loaders
  user: DataLoader<string, PrismaUser | null>;
  company: DataLoader<string, PrismaCompany | null>;
  department: DataLoader<string, PrismaDepartment | null>;
  employee: DataLoader<string, PrismaEmployee | null>;
  grade: DataLoader<number, PrismaGrade | null>;
  process: DataLoader<string, PrismaProcess | null>;
  taskAssignment: DataLoader<string, PrismaTaskAssignment | null>;
  loadSnapshot: DataLoader<string, PrismaLoadSnapshot | null>;
  gapAnalysis: DataLoader<string, PrismaGapAnalysisResult | null>;
  employeeHistory: DataLoader<string, PrismaEmployeeHistory | null>;
  auditLog: DataLoader<string, PrismaAuditLog | null>;

  // Batch entity loaders
  employeesByDepartment: DataLoader<string, PrismaEmployee[]>;
  tasksByEmployee: DataLoader<string, PrismaTaskAssignment[]>;
  snapshotsByEmployee: DataLoader<string, PrismaLoadSnapshot[]>;
}
```

### ServicesRegistry

```typescript
interface ServicesRegistry {
  // Core
  company: CompanyService;
  department: DepartmentService;
  employee: EmployeeService;
  grade: GradeService;

  // Operations
  process: ProcessService;
  taskAssignment: TaskAssignmentService;

  // Analytics
  loadSnapshot: LoadSnapshotService;
  gapAnalysis: GapAnalysisService;

  // Audit
  employeeHistory: EmployeeHistoryService;
  auditLog: AuditLogService;

  // Auth
  user: UserService;
}
```

---

Complete, production-ready dataloaders and services system! 🚀
