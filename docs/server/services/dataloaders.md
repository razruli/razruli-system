# DataLoaders Implementation Guide

## Overview

DataLoaders are the core mechanism for preventing N+1 query problems. They automatically batch multiple requests into single database queries.

---

## The N+1 Problem

### Without DataLoaders

```typescript
// Get 100 employees
const employees = await Promise.all(
  ids.map((id) => prisma.employee.findUnique({ where: { id } })),
);

// Result: 100 database queries ❌
// Each .findUnique() is a separate query
// Total time: ~500ms
```

### With DataLoaders

```typescript
// Get 100 employees (same code)
const employees = await Promise.all(ids.map((id) => loaders.employee.load(id)));

// Result: 1 database query ✅
// DataLoader batches all 100 IDs into one query
// Total time: ~10ms (50x faster!)
```

---

## How DataLoaders Work

### 1. Request Arrives

```
Request starts
  ↓
Create fresh DataLoaders
  ↓
DataLoaders ready to receive .load() calls
```

### 2. Multiple .load() Calls During Request

```typescript
// Resolver 1
const emp1 = await loaders.employee.load("emp-1");

// Resolver 2
const emp2 = await loaders.employee.load("emp-2");

// Resolver 3
const emp3 = await loaders.employee.load("emp-3");

// At this point:
// - 3 load calls made
// - 0 database queries executed yet
// - All IDs queued in DataLoader batch
```

### 3. End of Microtask Queue (Batching)

```typescript
// DataLoader detects no more .load() calls coming
// Automatically batches all queued IDs:

SELECT * FROM Employee
WHERE id = ANY(ARRAY['emp-1', 'emp-2', 'emp-3'])

// Result: 1 query returning all 3 employees
```

### 4. Results Returned to Requesters

```typescript
// Each await resolves with correct result:
emp1 => { id: "emp-1", fio: "John", ... }
emp2 => { id: "emp-2", fio: "Jane", ... }
emp3 => { id: "emp-3", fio: "Bob", ... }
```

---

## DataLoader Types

### Single Entity Loader (Basic Pattern)

```typescript
// Load by primary key, returns single entity or null
const employeeLoader = new DataLoader(async (ids: string[]) => {
  // Receives batch of IDs
  const employees = await prisma.employee.findMany({
    where: { id: { in: ids } },
  });

  // Must return in SAME ORDER as requested IDs
  return ids.map((id) => employees.find((e) => e.id === id) || null);
});

// Usage
const emp1 = await employeeLoader.load("emp-123"); // Batched
const emp2 = await employeeLoader.load("emp-456"); // Batched
// 1 database query with both IDs
```

### Collection Loader (Index Pattern)

```typescript
// Load multiple entities by parent ID, returns array
const employeesByDepartmentLoader = new DataLoader(
  async (departmentIds: string[]) => {
    // Get all employees for ALL departments
    const employees = await prisma.employee.findMany({
      where: { departmentId: { in: departmentIds } },
    });

    // Group by department
    const grouped = departmentIds.map((deptId) =>
      employees.filter((e) => e.departmentId === deptId),
    );

    return grouped;
  },
);

// Usage
const dept1Emps = await employeesByDepartmentLoader.load("dept-1");
const dept2Emps = await employeesByDepartmentLoader.load("dept-2");
// 1 database query: get all employees for both departments
```

---

## Creating DataLoaders

### File Structure

```
server/graphql/context/
├── dataloaders.ts          ← All loaders defined here
├── builder.ts              ← Creates loaders per request
└── types.ts                ← Types exported here
```

### Implementation

```typescript
// server/graphql/context/dataloaders.ts
import DataLoader from "dataloader";
import { PrismaClient } from "@prisma/client";

export function createDataLoaders(prisma: PrismaClient) {
  // SINGLE ENTITY LOADERS
  const employeeLoader = new DataLoader(async (ids: string[]) => {
    const employees = await prisma.employee.findMany({
      where: { id: { in: ids } },
    });

    // CRITICAL: Return in same order as input IDs
    return ids.map((id) => employees.find((e) => e.id === id) || null);
  });

  const companyLoader = new DataLoader(async (ids: string[]) => {
    const companies = await prisma.company.findMany({
      where: { id: { in: ids } },
    });
    return ids.map((id) => companies.find((c) => c.id === id) || null);
  });

  // COLLECTION LOADERS
  const employeesByDepartmentLoader = new DataLoader(
    async (departmentIds: string[]) => {
      const employees = await prisma.employee.findMany({
        where: { departmentId: { in: departmentIds } },
      });

      // Return a list for each department (in order)
      return departmentIds.map((deptId) =>
        employees.filter((e) => e.departmentId === deptId),
      );
    },
  );

  const tasksByEmployeeLoader = new DataLoader(
    async (employeeIds: string[]) => {
      const tasks = await prisma.taskAssignment.findMany({
        where: { employeeId: { in: employeeIds } },
      });

      return employeeIds.map((empId) =>
        tasks.filter((t) => t.employeeId === empId),
      );
    },
  );

  // Return all loaders as registry
  return {
    employee: employeeLoader,
    company: companyLoader,
    department: departmentLoader,
    grade: gradeLoader,
    process: processLoader,
    taskAssignment: taskAssignmentLoader,
    loadSnapshot: loadSnapshotLoader,
    gapAnalysis: gapAnalysisLoader,
    employeeHistory: employeeHistoryLoader,
    auditLog: auditLogLoader,
    user: userLoader,

    // Collections
    employeesByDepartment: employeesByDepartmentLoader,
    tasksByEmployee: tasksByEmployeeLoader,
    snapshotsByEmployee: snapshotsByEmployeeLoader,
  };
}

export type DataLoaders = ReturnType<typeof createDataLoaders>;
```

---

## Using DataLoaders in Services

### Basic Usage

```typescript
class EmployeeService {
  constructor(private context: ServiceContext) {}

  async getById(id: string): Promise<Employee> {
    // Use DataLoader for automatic batching
    return this.context.loaders.employee.load(id);
  }

  async getWithRelations(id: string) {
    // Load employee
    const employee = await this.context.loaders.employee.load(id);

    // Load related data (all batched)
    const department = await this.context.loaders.department.load(
      employee.departmentId,
    );
    const grade = await this.context.loaders.grade.load(employee.gradeId);

    return { ...employee, department, grade };

    // Database queries: 3 (all batched automatically)
  }

  async getByDepartment(deptId: string): Promise<Employee[]> {
    // Load all employees in department
    return this.context.loaders.employeesByDepartment.load(deptId);
  }

  async getByDepartmentWithDetails(deptId: string) {
    // Get all employees
    const employees =
      await this.context.loaders.employeesByDepartment.load(deptId);

    // Load grades for all employees (1 batched query)
    const grades = await Promise.all(
      employees.map((emp) => this.context.loaders.grade.load(emp.gradeId)),
    );

    return employees.map((emp, idx) => ({
      ...emp,
      grade: grades[idx],
    }));

    // Database queries: 2 (employees + grades, both batched)
  }
}
```

---

## Using DataLoaders in Field Resolvers

### Apollo Field Resolution

```typescript
// For a type defined in schema:
type Employee {
  id: ID!
  fio: String!
  departmentId: ID!
  department: Department!    // Field resolver called for this
  gradeId: ID!
  grade: Grade!              // Field resolver called for this
}

// Field resolvers use DataLoaders automatically:
export const Employee = {
  department: async (parent: Employee, _args, context: GraphQLContext) => {
    // Automatically batched with other department loads
    return context.loaders.department.load(parent.departmentId);
  },

  grade: async (parent: Employee, _args, context: GraphQLContext) => {
    // Automatically batched with other grade loads
    return context.loaders.grade.load(parent.gradeId);
  },
};
```

### Query Scenario

```graphql
query {
  employees {
    id
    fio
    department { name }      // Calls department field resolver
    grade { name }           // Calls grade field resolver
  }
}
```

**Execution:**

```
1. Get employees (1 query)
2. For each employee, field resolvers load department & grade
   - Without DataLoader: 100 employees × 2 relations = 200 queries ❌
   - With DataLoader: Batch all departments (1 query) + batch all grades (1 query) = 2 queries ✅
3. Total: 3 queries instead of 201 ✅
```

---

## Request Scope & Lifecycle

### DataLoader Lifecycle

```typescript
// 1. Request starts
POST /api/graphql

// 2. Context builder creates FRESH DataLoaders
buildGraphQLContext() {
  const loaders = createDataLoaders(prisma);  // NEW instance
  // ...
}

// 3. Resolvers execute, call .load() repeatedly
resolver1: await context.loaders.employee.load("emp-1");
resolver2: await context.loaders.employee.load("emp-2");
resolver3: await context.loaders.employee.load("emp-3");

// 4. All batched into single query
SELECT * FROM Employee WHERE id = ANY(ARRAY['emp-1', 'emp-2', 'emp-3'])

// 5. Request complete
return { data: {...} }

// 6. DataLoaders garbage collected
// Fresh DataLoaders created for NEXT request
```

### Why Fresh Per Request?

```typescript
// ❌ WRONG: Shared DataLoaders across requests
const sharedLoaders = createDataLoaders(prisma);

app.use((req, res) => {
  // All requests use SAME loaders
  const context = { loaders: sharedLoaders };
  // Results cache across requests!
  // User A's data visible to User B!
});

// ✅ CORRECT: Fresh DataLoaders per request
app.use((req, res) => {
  const loaders = createDataLoaders(prisma); // NEW for each request
  const context = { loaders };
  // Cache isolated to this request
  // After request: garbage collected
});
```

---

## Caching Behavior

### Cache vs DataLoader

```typescript
// DataLoader automatically caches within a request
const emp1 = await loaders.employee.load("emp-123"); // Cache miss → DB query
const emp2 = await loaders.employee.load("emp-123"); // Cache hit → no DB

// But cache is request-scoped
// Next HTTP request: FRESH loaders, no cache
```

### Combining with Service Cache

```typescript
class EmployeeService {
  async getById(id: string) {
    // Check service-level cache first
    const cached = this.context.cache.get(`emp-${id}`);
    if (cached) return cached;

    // Fall back to DataLoader (also caches)
    const emp = await this.context.loaders.employee.load(id);

    // Store in service cache
    this.context.cache.set(`emp-${id}`, emp);

    return emp;
  }
}

// Both layers cache within same request:
// 1. Service cache (fastest, manual invalidation)
// 2. DataLoader cache (automatic, expires per request)
```

---

## Performance Tips

### 1. Always Use DataLoaders for Single Objects

```typescript
// ✅ GOOD
const emp = await context.loaders.employee.load(id);

// ❌ BAD - defeats batching
const emp = await context.prisma.employee.findUnique({
  where: { id },
});
```

### 2. Batch Parallel Loads

```typescript
// ✅ GOOD - use Promise.all for parallel batching
const [emp1, emp2, emp3] = await Promise.all([
  context.loaders.employee.load("1"),
  context.loaders.employee.load("2"),
  context.loaders.employee.load("3"),
]);
// All 3 batched into 1 query

// ❌ BAD - sequential defeats batching
const emp1 = await context.loaders.employee.load("1");
const emp2 = await context.loaders.employee.load("2");
const emp3 = await context.loaders.employee.load("3");
// Still 1 batched query, but sequential execution
```

### 3. Use Collection Loaders for Relations

```typescript
// ✅ GOOD - collection loader
const employees = await context.loaders.employeesByDepartment.load(deptId);
// 1 batched query for dept employees

// ❌ LESS OPTIMAL - multiple single loads
const employees = await context.prisma.employee.findMany({
  where: { departmentId: deptId },
});
// 1 query but doesn't batch with other departments
```

---

## Common Patterns

### Pattern 1: Load with Relations

```typescript
async getEmployeeWithDept(empId: string) {
  const emp = await context.loaders.employee.load(empId);
  const dept = await context.loaders.department.load(emp.departmentId);
  return { ...emp, department: dept };
}

// Queries: 2 (both batched)
```

### Pattern 2: Load Collections with Details

```typescript
async getEmployeesWithGrades(deptId: string) {
  const emps = await context.loaders
    .employeesByDepartment.load(deptId);

  const grades = await Promise.all(
    emps.map(e => context.loaders.grade.load(e.gradeId))
  );

  return emps.map((e, i) => ({ ...e, grade: grades[i] }));
}

// Queries: 2 (employees + grades)
```

### Pattern 3: Conditional Loading

```typescript
async getEmployeeWithOptionalManager(empId: string) {
  const emp = await context.loaders.employee.load(empId);

  const manager = emp.managerId
    ? await context.loaders.employee.load(emp.managerId)
    : null;

  return { ...emp, manager };
}

// Queries: 1-2 depending on managerId
```

---

## Debugging DataLoaders

### Enable Logging

```typescript
const employeeLoader = new DataLoader(
  async (ids: string[]) => {
    console.log(`[DataLoader] Loading employees: ${ids.join(", ")}`);

    const result = await prisma.employee.findMany({
      where: { id: { in: ids } },
    });

    console.log(
      `[DataLoader] Loaded ${result.length} employees with ${ids.length} IDs`,
    );

    return ids.map((id) => result.find((e) => e.id === id) || null);
  },
  {
    name: "EmployeeLoader", // For debugging
  },
);
```

### Check Batch Size

```typescript
// Good indicator of optimization:
// Batch size should match number of fields resolving employee relations

// If you see:
[DataLoader] Loading employees: emp-1, emp-2, emp-3
// ✅ Good - 3 in batch, likely resolving 3 fields

[DataLoader] Loading employees: emp-1
[DataLoader] Loading employees: emp-2
[DataLoader] Loading employees: emp-3
// ❌ Bad - 1 in each batch, no optimization happening
```

---

## Related Documentation

- [Services Layer](../services/README.md)
- [Quick Reference](./quick-reference.md)
- [System Architecture](../system/README.md)
