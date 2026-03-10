# Request Workflows & Examples

## Overview

This document shows concrete examples of how different types of requests flow through the system from GraphQL to database and back.

---

## Example 1: Simple Query - Get Single Employee

### Request

```graphql
query {
  getEmployee(id: "emp-123") {
    id
    fio
    email
    grade {
      name
      kGrade
    }
    department {
      name
    }
  }
}
```

### Execution Flow

**Step 1: Resolver Called**

```typescript
export const getEmployee = withMiddleware<GetEmployeeArgs>(
  async (_parent, { id }, context: GraphQLContext) => {
    const employee = await context.loaders.employee.load(id);
    return employee;
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:read"],
  },
);
```

**Step 2: Middleware Stack**

```
1. Authentication Check
   ├─ requireAuth: true ✅
   └─ context.user exists ✅

2. Permission Check
   ├─ requiredPermissions: ["employee:read"] ✅
   └─ User has permission ✅

3. Validation
   └─ id is valid UUID ✅

4. Resolver Execution
```

**Step 3: DataLoaders Batch**

```typescript
// Multiple resolvers might load different employees
const emp1 = await context.loaders.employee.load("emp-123");  // Batched together
const emp2 = await context.loaders.employee.load("emp-456");  // Batched together
const emp3 = await context.loaders.employee.load("emp-789");  // Batched together

// Behind scenes (1 database query):
SELECT * FROM Employee
WHERE id = ANY(ARRAY['emp-123', 'emp-456', 'emp-789'])
```

**Step 4: Related Data Loading**

```typescript
// Apollo resolver fields are called for:
// - employee.grade
// - employee.department

// These use DataLoaders too (automatic batching)
const grades = await context.loaders.grade.load(emp.gradeId);
const dept = await context.loaders.department.load(emp.departmentId);
```

**Step 5: Response**

```json
{
  "data": {
    "getEmployee": {
      "id": "emp-123",
      "fio": "John Doe",
      "email": "john@company.com",
      "grade": {
        "name": "Senior",
        "kGrade": 1.0
      },
      "department": {
        "name": "Engineering"
      }
    }
  }
}
```

**Database Queries Executed:** 3

- Get employee + batch (1)
- Get grades + batch (1)
- Get departments + batch (1)

---

## Example 2: Query with Relationships - Get Department with All Employees

### Request

```graphql
query {
  getDepartment(id: "dept-789") {
    id
    name
    employees {
      id
      fio
      grade {
        name
      }
    }
    head {
      fio
      email
    }
  }
}
```

### Execution Path

**Resolver:**

```typescript
export const getDepartment = async (
  _parent,
  { id },
  context: GraphQLContext,
) => {
  // Step 1: Load department
  const dept = await context.loaders.department.load(id);
  return dept;
};

// Apollo automatically resolves:
// - department.employees
// - department.head
// - employee.grade for each employee
```

**Field Resolvers (Automatic):**

```typescript
// For department.employees
const employees = await context.loaders.employeesByDepartment.load(dept.id);

// For department.head
const head = await context.loaders.employee.load(dept.headId);

// For each employee.grade
const grades = await Promise.all(
  employees.map((e) => context.loaders.grade.load(e.gradeId)),
);
```

**Database Queries:** 3

- Get department (1)
- Get all employees in department (1 batched query)
- Get all grades (1 batched query)

**Optimization:** Without DataLoaders this would be:

- Get department (1)
- Get all employees by department (1)
- Get grade for each employee (N queries)
- Get head employee (1)
- **Total: N+4 queries** ❌

With DataLoaders: **3 queries** ✅

---

## Example 3: Mutation - Create Employee

### Request

```graphql
mutation {
  createEmployee(
    input: {
      fio: "Jane Smith"
      companyId: "acme-corp"
      departmentId: "dept-789"
      gradeId: "grade-junior"
      email: "jane@company.com"
      hireDate: "2026-03-10"
      gender: "F"
    }
  ) {
    id
    fio
    capacity {
      monthlyCapacityCU
      efficiency
    }
    department {
      name
    }
  }
}
```

### Execution Path

**Resolver (Mutation):**

```typescript
export const createEmployee = withMiddleware<CreateEmployeeArgs>(
  async (_parent, { input }, context: GraphQLContext) => {
    // Delegate to service
    const employee = await context.services.employee.create(input);
    return employee;
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:create"],
    validate: async (args) => {
      // Custom validation
      if (!args.input.email.includes("@")) {
        throw new Error("Invalid email");
      }
    },
  },
);
```

**Service Execution:**

```typescript
// EmployeeService.create()
async create(input: CreateEmployeeInput): Promise<Employee> {
  // Step 1: Validation
  const existingEmail = await this.context.prisma.employee.findUnique({
    where: { email: input.email },
  });
  if (existingEmail) throw new Error("Email already exists");

  // Step 2: Create employee
  const emp = await this.context.prisma.employee.create({
    data: {
      ...input,
      kEfficiency: 1.0,
    },
  });

  // Step 3: Invalidate caches
  // - Clear employee list for department
  // - Clear all load snapshots for department
  this.context.cache.invalidate(`employees-${input.departmentId}`);
  this.context.cache.invalidate(`load-snapshot-${input.departmentId}`);

  return emp;
}
```

**Step 2: Calculate Capacity**

```typescript
// Service automatically returns capacity
const capacity = await this.employeeService.calculateCapacity(emp);
// P_day = 1.0 × 0.6 (junior) × 0.7 (female) × 1.0 (age) × 0.9 (month 1) × 1.0
//       = 0.378 CU/day = 7.938 CU/month
```

**Response:**

```json
{
  "data": {
    "createEmployee": {
      "id": "emp-new-123",
      "fio": "Jane Smith",
      "capacity": {
        "monthlyCapacityCU": 7.938,
        "efficiency": 1.0
      },
      "department": {
        "name": "Engineering"
      }
    }
  }
}
```

**Database Operations:**

- Check if email exists (1)
- Create employee (1)
- **Total: 2 write operations**

**Side Effects:**

- Cache invalidated for department
- Load snapshots need recalculation
- Audit log created

---

## Example 4: Complex Query - Analyze Department Load

### Request

```graphql
query {
  analyzeDepartmentLoad(departmentId: "dept-789") {
    departmentName
    loadIndex
    totalCapacityCU
    totalLoadCU
    employees {
      id
      fio
      monthlyCapacity
      assignedLoad
      loadIndex
      status
    }
    recommendations {
      message
      recommendedAction
    }
  }
}
```

### Service Layer Logic

**Resolver:**

```typescript
export const analyzeDepartmentLoad = async (
  _parent,
  { departmentId },
  context: GraphQLContext,
) => {
  return context.services.gapAnalysis.analyzeByDepartment(departmentId);
};
```

**GapAnalysisService:**

```typescript
async analyzeByDepartment(deptId: string) {
  // Step 1: Get department
  const dept = await this.context.loaders.department.load(deptId);

  // Step 2: Get all employees
  const employees = await this.context.loaders
    .employeesByDepartment.load(deptId);

  // Step 3: Calculate capacity for each employee
  const capacities = await Promise.all(
    employees.map(emp => this.employeeService.calculateCapacity(emp))
  );
  const totalCapacity = capacities.reduce((sum, c) => sum + c, 0);

  // Step 4: Get all tasks in department
  const tasks = await this.context.prisma.taskAssignment.findMany({
    where: { departmentId },
    include: { process: true, employee: true },
  });

  // Step 5: Calculate load for each task
  const taskLoads = tasks.map(t =>
    this.taskService.calculateLoad(t)
  );
  const totalLoad = taskLoads.reduce((sum, l) => sum + l, 0);

  // Step 6: Calculate load index
  const loadIndex = totalLoad / totalCapacity;

  // Step 7: Generate recommendations
  const recommendations = this.generateRecommendations(
    loadIndex,
    totalCapacity,
    totalLoad,
  );

  return {
    departmentName: dept.name,
    loadIndex,
    totalCapacityCU: totalCapacity,
    totalLoadCU: totalLoad,
    employees: employees.map((emp, idx) => ({
      ...emp,
      monthlyCapacity: capacities[idx],
      assignedLoad: taskLoads[idx],
      loadIndex: taskLoads[idx] / capacities[idx],
    })),
    recommendations,
  };
}
```

**Database Queries:**

- Get department (1)
- Get employees in department (1 batched)
- Get grades for employees (1 batched)
- Get tasks in department (1)
- Get processes for tasks (1 batched)
- **Total: 5 optimized queries**

---

## Example 5: Subscription - Monitor Load Changes

### Request

```graphql
subscription {
  onLoadIndexChange(departmentId: "dept-789") {
    departmentId
    loadIndex
    status
    timestamp
  }
}
```

### WebSocket Flow

**Subscription Setup:**

```typescript
export const onLoadIndexChange = {
  subscribe: async (_parent, { departmentId }, context: GraphQLContext) => {
    return pubSub.asyncIterator([`load-change-${departmentId}`]);
  },
};
```

**Cache Update Trigger:**

```typescript
// When load changes (due to task assignment, employee change, etc.)
// The mutation/service publishes update

EventEmitter.on("taskAssignmentCreated", (task) => {
  const newLoad = calculateLoadIndex(task.departmentId);
  pubSub.publish(`load-change-${task.departmentId}`, {
    onLoadIndexChange: {
      departmentId: task.departmentId,
      loadIndex: newLoad,
      status: getStatusFromLoadIndex(newLoad),
      timestamp: new Date(),
    },
  });
});
```

**Response Stream:**

```json
// First message
{
  "data": {
    "onLoadIndexChange": {
      "departmentId": "dept-789",
      "loadIndex": 0.95,
      "status": "OPTIMAL",
      "timestamp": "2026-03-10T10:00:00Z"
    }
  }
}

// When load changes
{
  "data": {
    "onLoadIndexChange": {
      "departmentId": "dept-789",
      "loadIndex": 1.15,
      "status": "STRETCHED",
      "timestamp": "2026-03-10T10:05:00Z"
    }
  }
}
```

---

## Example 6: Error Case - Unauthorized Mutation

### Request

```graphql
mutation {
  deleteEmployee(id: "emp-456")
}
```

### Error Flow

**Middleware Chain:**

```
1. Authentication ✅
   └─ User is logged in

2. Permission Check ❌
   ├─ requiredPermissions: ["employee:delete"]
   ├─ User has: ["employee:read", "employee:create"]
   └─ FORBIDDEN - permission not found

3. Error Handler
   └─ Return GraphQL error
```

**Error Response:**

```json
{
  "errors": [
    {
      "message": "Access denied: missing permission 'employee:delete'",
      "extensions": {
        "code": "FORBIDDEN",
        "path": ["deleteEmployee"],
        "requiredPermission": "employee:delete",
        "userPermissions": ["employee:read", "employee:create"]
      }
    }
  ],
  "data": null
}
```

**No database queries executed** ✅ (failed at middleware layer before resolver)

---

## Performance Metrics

### Query Performance Summary

| Query Type             | DB Queries | Time   | Notes                        |
| ---------------------- | ---------- | ------ | ---------------------------- |
| Get single entity      | 1          | < 5ms  | DataLoader batched           |
| Get entity + relations | 3          | < 10ms | Multiple DataLoaders         |
| Get list (100 items)   | 2          | < 20ms | Batched query + 1 for grades |
| Complex analysis       | 5          | < 50ms | Multiple aggregations        |
| Mutation (create)      | 2          | < 10ms | Validation + insert          |
| Mutation (update)      | 2-3        | < 15ms | Update + cache invalidate    |

### Cache Effectiveness

| Cache Type                     | Hit Rate | Performance Gain |
| ------------------------------ | -------- | ---------------- |
| DataLoader (same request)      | ~80%     | 1000x faster     |
| Service cache (same request)   | ~60%     | 100x faster      |
| No cache (every query hits DB) | 0%       | Baseline         |

---

## Best Practices from Examples

1. **Always use DataLoaders for single entity loads** ✅
2. **Services handle business logic, not resolvers** ✅
3. **Batch operations using Promise.all()** ✅
4. **Invalidate caches on mutations** ✅
5. **Validate input early in middleware** ✅
6. **Use proper error codes and messages** ✅

---

## Related Documentation

- [System Architecture](./README.md)
- [Service Layer](../services/README.md)
- [GraphQL Layer](../gql/README.md)
- [Database Schema](../db/README.md)
