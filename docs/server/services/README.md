# Services Layer Architecture

## Overview

The services layer provides business logic and data access orchestration using a **repository pattern** for clean separation of concerns. The architecture combines services with repositories to prevent N+1 queries and provide clean, type-safe operations.

**Location:** `server/services/`

**Status:** ✅ Production Ready (11 services with 11 repositories, 13 dataloaders, zero N+1 queries)

---

## Architecture Stack

```
┌─────────────────────────────────────────────────────┐
│        GraphQL Resolvers (Thin)                     │
│        (Phase 6 - Orchestration Only)               │
└─────────────────────────────┬───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│     Service Factory (Dependency Injection)          │
│                   (Singleton)                       │
└─────────────────────────────┬───────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌──────────┐          ┌───────────┐          ┌──────────┐
   │  CORE    │          │ OPERATIONS│          │ ANALYTICS│
   │ Services │          │ Services  │          │ Services │
   └──────────┘          └───────────┘          └──────────┘
        ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────┐
│         Service Context (Request-Scoped)            │
│  - Prisma Client (shared)                           │
│  - DataLoaders (fresh per request)                  │
│  - Cache (request-scoped invalidation)              │
└─────────────────────────────┬───────────────────────┘
                              │
                              ▼
              ┌─────────────────────────┐
              │   Database (PostgreSQL) │
              └─────────────────────────┘
```

---

└─────────────────────────────┬───────────────────────┘
│
▼
┌─────────────────────────┐
│ Database (PostgreSQL) │
└─────────────────────────┘

````

---

## Service Architecture

### 11 Domain Services
## Service Architecture

### 11 Domain Services

#### CORE DOMAIN (4 services)

**1. CompanyService**

**File:** `server/services/core/CompanyService.ts`

**Purpose:** Manages company entities and their settings

**Key Methods:**

- `getById(id)` - Get company by ID (uses DataLoader)
- `getAll()` - Get all active companies (cached)
- `create(data)` - Create new company
- `update(id, data)` - Update company settings
- `getWithStats()` - Get company with counts

**DataLoader Usage:** ✅ Yes (batches all company loads)

**Example:**

```typescript
const company = await context.services.company.getById("acme-corp");
// Returns cached on second call in same request
````

---

**2. EmployeeService**

**File:** `server/services/core/EmployeeService.ts`

**Purpose:** Manages employee records and capacity calculations

**Key Methods:**

- `getById(id)` - Get employee (DataLoader batched)
- `getByDepartment(deptId)` - Get all employees in department (cached)
- `create(data)` - Create employee with duplicate checking
- `update(id, data)` - Update employee
- `dismiss(id)` - Soft delete (mark as dismissed)
- `calculateCapacity(id)` - Calculate monthly capacity units
- `isOverloaded(id, load)` - Check if additional load exceeds capacity

**DataLoader Usage:** ✅ Yes (batches employee/department/grade loads)

**Example:**

```typescript
const service = context.services.employee;
const emp = await service.getById("emp-123");
const capacity = await service.calculateCapacity("emp-123");
const overloaded = await service.isOverloaded("emp-123", 5.5);
```

---

**3. GradeService**

**File:** `server/services/core/GradeService.ts`

**Purpose:** Manages job grades (Intern, Junior, Middle, Senior, Lead, C-level)

**Key Methods:**

- `getById(id)` - Get grade (DataLoader batched)
- `getAll()` - Get all grades (cached)
- `create(data)` - Create new grade
- `update(id, data)` - Update grade multiplier values

**DataLoader Usage:** ✅ Yes

**Example:**

```typescript
const grades = await context.services.grade.getAll();
const senior = grades.find((g) => g.name === "Senior");
```

---

**4. DepartmentService**

**File:** `server/services/core/DepartmentService.ts`

**Purpose:** Manages organizational departments

**Key Methods:**

- `getById(id)` - Get department
- `getByCompany(companyId)` - Get all departments in company
- `create(data)` - Create department
- `update(id, data)` - Update department
- `setHead(id, headId)` - Assign department head

**DataLoader Usage:** ✅ Yes

---

#### OPERATIONS DOMAIN (2 services)

**5. ProcessService**

**File:** `server/services/operations/ProcessService.ts`

**Purpose:** Manages business processes

**Key Methods:**

- `getById(id)` - Get process
- `getByDepartment(deptId)` - Get processes in department
- `create(data)` - Create process
- `update(id, data)` - Update process
- `calculateComplexity(id)` - Calculate process complexity

**Example:**

```typescript
const process = await context.services.process.getById("proc-123");
const complexity =
  await context.services.process.calculateComplexity("proc-123");
```

---

**6. TaskAssignmentService**

**File:** `server/services/operations/TaskAssignmentService.ts`

**Purpose:** Manages task assignments and workload tracking

**Key Methods:**

- `getById(id)` - Get assignment
- `getByEmployee(empId)` - Get all assignments for employee
- `create(data)` - Create assignment with load calculation
- `update(id, data)` - Update assignment
- `complete(id, actualHours)` - Mark complete with actual hours
- `calculateLoad(plannedHours, process)` - Calculate CU load

**Example:**

```typescript
const task = await context.services.taskAssignment.create({
  employeeId: "emp-123",
  processId: "proc-456",
  plannedHours: 40,
});
```

---

#### ANALYTICS DOMAIN (3 services)

**7. LoadSnapshotService**

**File:** `server/services/analytics/LoadSnapshotService.ts`

**Purpose:** Manages load metrics and snapshots

**Key Methods:**

- `getById(id)` - Get snapshot
- `getLatest(employeeId)` - Get latest snapshot for employee
- `getForPeriod(start, end)` - Get snapshots for period
- `create(data)` - Create new snapshot
- `analyzeLoad(employeeId)` - Analyze current load

**Example:**

```typescript
const snapshot = await context.services.loadSnapshot.getLatest("emp-123");
console.log(`Load index: ${snapshot.loadIndex}`);
```

---

**8. GapAnalysisService**

**File:** `server/services/analytics/GapAnalysisService.ts`

**Purpose:** Analyzes capacity gaps and recommends hiring

**Key Methods:**

- `getById(id)` - Get gap analysis result
- `analyzeByDepartment(deptId)` - Analyze department gaps
- `generateHiringRecommendations(deptId)` - Recommend hiring

**Example:**

```typescript
const analysis =
  await context.services.gapAnalysis.analyzeByDepartment("dept-123");
console.log(`Deficit: ${analysis.deficitCU} CU`);
```

---

#### AUDIT DOMAIN (2 services)

**9. EmployeeHistoryService**

**Purpose:** Tracks employee attribute changes

**Key Methods:**

- `getById(id)`
- `getByEmployee(empId)`
- `create(data)`

---

**10. AuditLogService**

**Purpose:** Tracks all mutations for compliance

**Key Methods:**

- `log(entity, action, changes)`
- `getBy(entityType, entityId)`

---

#### AUTH DOMAIN (1 service)

**11. UserService**

**Purpose:** Manages authentication users

**Key Methods:**

- `getById(id)`
- `getByEmail(email)`
- `create(data)`

---

## DataLoaders (N+1 Prevention)

DataLoaders batch multiple database queries into single operations, eliminating N+1 query problems.

### 13 DataLoaders Registry

**Single Entity Loaders (batch by ID):**

- `user` - Load users by ID
- `company` - Load companies by ID
- `department` - Load departments by ID
- `employee` - Load employees by ID
- `grade` - Load grades by ID
- `process` - Load processes by ID
- `taskAssignment` - Load task assignments by ID
- `loadSnapshot` - Load snapshots by ID
- `gapAnalysis` - Load gap analyses by ID
- `employeeHistory` - Load histories by ID
- `auditLog` - Load audit logs by ID

**Collection Loaders (batch by parent ID):**

- `employeesByDepartment` - All employees in department
- `tasksByEmployee` - All tasks for employee
- `snapshotsByEmployee` - All snapshots for employee

### How DataLoaders Work

**Without DataLoader (N+1 Problem):**

```typescript
// Query 100 employees
const employees = await Promise.all(
  ids.map((id) => prisma.employee.findUnique({ where: { id } })),
);
// Result: 100 database queries ❌
```

**With DataLoader (Batched):**

```typescript
// Query 100 employees
const employees = await Promise.all(
  ids.map((id) => context.loaders.employee.load(id)),
);
// Result: 1 database query ✅ (all batched)
```

### Usage Example

```typescript
// In resolver
export const employee = async (_parent, { id }, context) => {
  // Automatically batches with other employee.load() calls in same request
  const emp = await context.loaders.employee.load(id);
  return emp;
};

// In service
async getWithRelations(id: string) {
  const employee = await this.context.loaders.employee.load(id);
  const department = await this.context.loaders.department.load(employee.departmentId);
  const grade = await this.context.loaders.grade.load(employee.gradeId);

  return {
    ...employee,
    department,
    grade,
  };
  // Behind the scenes: 3 database queries become 1 batched query
}
```

---

## Service Factory Pattern

The ServiceFactory provides dependency injection and returns appropriate service instances.

### Usage

```typescript
// In resolver
export const getEmployee = async (_parent, { id }, context: GraphQLContext) => {
  const employeeService = context.services.employee;
  return employeeService.getById(id);
};

// Factory automatically provides correct dependencies:
// - Prisma client (shared)
// - DataLoaders (fresh per request)
// - Cache (request-scoped)
```

### Service Initialization

```typescript
// Services are singleton within a request context
class ServiceFactory {
  private employeeService?: EmployeeService;

  getEmployeeService(): EmployeeService {
    if (!this.employeeService) {
      this.employeeService = new EmployeeService(this.context);
    }
    return this.employeeService;
  }
}
```

---

## Caching Strategy

### Request-Scoped Caching

Each service maintains a cache that lives for a single GraphQL request:

```typescript
// First call: hits database
const emp1 = await context.services.employee.getById("emp-123");

// Second call in same request: returns from cache
const emp2 = await context.services.employee.getById("emp-123");
// No database query! ✅

// After request ends: cache cleared
```

### Cache Invalidation

Services automatically invalidate related caches on mutations:

```typescript
// Update employee
await context.services.employee.update("emp-123", { name: "Jane" });

// Invalidates:
// - emp-123 from employee cache
// - List cache for department
// - Load snapshot snapshots for this employee

// Next query recalculates
```

---

## Best Practices

### 1. Always Use Services, Never Direct Prisma in Resolvers

```typescript
// ✅ GOOD
const emp = await context.services.employee.getById(id);

// ❌ BAD
const emp = await context.prisma.employee.findUnique({ where: { id } });
```

### 2. Use DataLoaders for Single Entity Loads

```typescript
// ✅ GOOD - automatically batched
const emp = await context.loaders.employee.load(id);

// ⚠️ OK but less optimal - goes to service
const emp = await context.services.employee.getById(id);
```

### 3. Compose Services for Complex Operations

```typescript
// ✅ GOOD - multiple services composed
async function analyzeEmployee(empId, deptId) {
  const emp = await context.services.employee.getById(empId);
  const snapshot = await context.services.loadSnapshot.getLatest(empId);
  const tasks = await context.loaders.tasksByEmployee.load(empId);

  return {
    employee: emp,
    load: snapshot.loadIndex,
    taskCount: tasks.length,
  };
}
```

### 4. Let Services Handle Business Logic

```typescript
// ✅ GOOD - business logic in service
const overloaded = await context.services.employee.isOverloaded(empId, 5.5);

// ❌ BAD - logic in resolver
const emp = await context.services.employee.getById(empId);
const capacity = emp.grade.kGrade * 25;
const overloaded = totalLoad > capacity;
```

---

## Related Documentation

- [Repository Pattern & Architecture](./repository-pattern.md)
- [DataLoaders Deep Dive](./dataloaders.md)
- [GraphQL Layer](../gql/README.md)
- [System Architecture](../../system/README.md)
