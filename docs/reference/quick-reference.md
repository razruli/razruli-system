# Quick Reference Guide

## Overview

This guide provides quick lookup reference for common tasks, patterns, and configurations.

---

## Table of Contents

1. [Services API Quick Lookup](#services-api)
2. [DataLoaders Quick Lookup](#dataloaders)
3. [Middleware Options](#middleware)
4. [Resolver Patterns](#resolver-patterns)
5. [Common Error Codes](#errors)
6. [Capacity Unit Coefficients](#coefficients)
7. [File Structure](#file-structure)

---

## Services API Quick Lookup

### CompanyService

```typescript
// Get by ID
await context.services.company.getById(id);

// Get all
await context.services.company.getAll();

// Create
await context.services.company.create({ name, timezone, workingHoursDay });

// Update
await context.services.company.update(id, { name, timezone });
```

### EmployeeService

```typescript
// Get by ID
await context.services.employee.getById(id);

// Get by department
await context.services.employee.getByDepartment(deptId);

// Create
await context.services.employee.create({ fio, email, departmentId, gradeId, ... });

// Update
await context.services.employee.update(id, { fio, email, ... });

// Dismiss (soft delete)
await context.services.employee.dismiss(id);

// Calculate capacity
await context.services.employee.calculateCapacity(id);  // Returns P_month

// Check if overloaded
await context.services.employee.isOverloaded(id, assignedLoad);
```

### GradeService

```typescript
// Get by ID
await context.services.grade.getById(id);

// Get all
await context.services.grade.getAll();

// Create
await context.services.grade.create({ name, kGrade, description });

// Update
await context.services.grade.update(id, { name, kGrade });
```

### DepartmentService

```typescript
// Get by ID
await context.services.department.getById(id);

// Get by company
await context.services.department.getByCompany(companyId);

// Create
await context.services.department.create({ companyId, name });

// Update
await context.services.department.update(id, { name });

// Set head
await context.services.department.setHead(id, employeeId);
```

### ProcessService

```typescript
// Get by ID
await context.services.process.getById(id);

// Get by department
await context.services.process.getByDepartment(deptId);

// Create
await context.services.process.create({
  title,
  departmentId,
  plannedHours,
  kBurn,
  kCrit,
  kNew,
  // ...
});

// Update
await context.services.process.update(id, { title, kBurn, kCrit, kNew });
```

### TaskAssignmentService

```typescript
// Get by ID
await context.services.taskAssignment.getById(id);

// Get by employee
await context.services.taskAssignment.getByEmployee(empId);

// Create
await context.services.taskAssignment.create({
  employeeId,
  processId,
  plannedHours,
  // calculatedLoad auto-calculated
});

// Update
await context.services.taskAssignment.update(id, { plannedHours, status });

// Complete (mark done)
await context.services.taskAssignment.complete(id, actualHours);

// Calculate load
await context.services.taskAssignment.calculateLoad(id);
```

### LoadSnapshotService

```typescript
// Get by ID
await context.services.loadSnapshot.getById(id);

// Get latest for employee
await context.services.loadSnapshot.getLatest(employeeId);

// Get for period
await context.services.loadSnapshot.getForPeriod(start, end);

// Create snapshot
await context.services.loadSnapshot.create({
  employeeId,
  departmentId,
  periodStart,
  periodEnd,
  loadIndex,
});

// Analyze load
await context.services.loadSnapshot.analyzeLoad(employeeId);
```

### GapAnalysisService

```typescript
// Get by ID
await context.services.gapAnalysis.getById(id);

// Analyze by department
await context.services.gapAnalysis.analyzeByDepartment(deptId);

// Generate hiring recommendations
await context.services.gapAnalysis.generateHiringRecommendations(deptId);
```

---

## DataLoaders Quick Lookup

### Single Entity Loaders

```typescript
// Get single entity (batches automatically)
const employee = await context.loaders.employee.load("emp-123");
const company = await context.loaders.company.load("acme-corp");
const grade = await context.loaders.grade.load("grade-senior");
const department = await context.loaders.department.load("dept-789");
const process = await context.loaders.process.load("proc-456");
const task = await context.loaders.taskAssignment.load("task-111");
const snapshot = await context.loaders.loadSnapshot.load("snap-222");
const analysis = await context.loaders.gapAnalysis.load("gap-333");

// Get multiple entities (all batched in 1 query)
const [emp1, emp2, emp3] = await Promise.all([
  context.loaders.employee.load("emp-1"),
  context.loaders.employee.load("emp-2"),
  context.loaders.employee.load("emp-3"),
]); // Still 1 database query!
```

### Collection Loaders

```typescript
// Get all employees in department
const employees = await context.loaders.employeesByDepartment.load("dept-789");

// Get all tasks for employee
const tasks = await context.loaders.tasksByEmployee.load("emp-123");

// Get all snapshots for employee
const snapshots = await context.loaders.snapshotsByEmployee.load("emp-123");
```

---

## Middleware Options

### Standard Middleware Configuration

```typescript
withMiddleware(resolver, {
  // Authentication required?
  requireAuth: true, // Default: false

  // Permissions required?
  requiredPermissions: ["employee:read", "employee:write", "admin:all"], // Default: []

  // Custom validation?
  validate: async (args) => {
    if (!args.email.includes("@")) {
      throw new Error("Invalid email format");
    }
  }, // Default: undefined

  // Rate limiting?
  rateLimit: {
    windowMs: 60000, // 1 minute
    max: 100, // Max 100 requests per window
  }, // Default: undefined
});
```

### Permission Format

Permissions follow `"resource:action"` pattern:

```typescript
// Examples
"employee:read"; // Read employee data
"employee:create"; // Create employee
"employee:update"; // Update employee
"employee:delete"; // Delete employee
"department:read"; // etc.
"process:create";
"admin:all"; // Admin access
"hiring:approve"; // Approve hiring requests
```

---

## Resolver Patterns

### Simple Read (Query)

```typescript
export const getEmployee = withMiddleware<GetEmployeeArgs>(
  async (_parent, { id }, context: GraphQLContext) => {
    return context.loaders.employee.load(id);
  },
  { requireAuth: true, requiredPermissions: ["employee:read"] },
);
```

### Complex Read with Relationships

```typescript
export const getEmployeeWithAnalysis = withMiddleware<GetEmployeeArgs>(
  async (_parent, { id }, context: GraphQLContext) => {
    const employee = await context.loaders.employee.load(id);
    const snapshot = await context.services.loadSnapshot.getLatest(id);
    const capacity = await context.services.employee.calculateCapacity(id);

    return {
      ...employee,
      currentLoad: snapshot?.loadIndex || 0,
      monthlyCapacity: capacity,
    };
  },
  { requireAuth: true },
);
```

### Create Mutation

```typescript
export const createEmployee = withMiddleware<CreateEmployeeArgs>(
  async (_parent, { input }, context: GraphQLContext) => {
    return context.services.employee.create(input);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:create"],
    validate: async (args) => {
      // Custom validation
      const existing = await context.prisma.employee.findUnique({
        where: { email: args.input.email },
      });
      if (existing) throw new Error("Email already used");
    },
  },
);
```

### List Query with Pagination

```typescript
export const listEmployees = withMiddleware<ListEmployeesArgs>(
  async (
    _parent,
    { companyId, limit = 20, offset = 0 },
    context: GraphQLContext,
  ) => {
    const service = context.services.employee;

    const employees = await context.prisma.employee.findMany({
      where: { companyId },
      take: limit,
      skip: offset,
      include: { grade: true, department: true },
    });

    const total = await context.prisma.employee.count({
      where: { companyId },
    });

    return {
      items: employees,
      total,
      hasMore: offset + limit < total,
    };
  },
  { requireAuth: true },
);
```

---

## Common Error Codes

### HTTP Status Codes in GraphQL

```typescript
// Authentication errors
throw new GraphQLError(message, {
  extensions: { code: "UNAUTHENTICATED" }, // 401
});

// Authorization errors
throw new GraphQLError(message, {
  extensions: { code: "FORBIDDEN" }, // 403
});

// Validation errors
throw new GraphQLError(message, {
  extensions: { code: "BAD_USER_INPUT" }, // 400
});

// Not found
throw new GraphQLError(message, {
  extensions: { code: "NOT_FOUND" }, // 404
});

// Server errors
throw new GraphQLError(message, {
  extensions: { code: "INTERNAL_SERVER_ERROR" }, // 500
});

// Conflict (duplicate, etc.)
throw new GraphQLError(message, {
  extensions: { code: "CONFLICT" }, // 409
});

// Too many requests
throw new GraphQLError(message, {
  extensions: { code: "TOO_MANY_REQUESTS" }, // 429
});
```

---

## Capacity Unit Coefficients

### K_grade (Seniority)

| Grade   | K_grade |
| ------- | ------- |
| C-level | 1.7     |
| Manager | 1.5     |
| Senior  | 1.0     |
| Middle  | 0.8     |
| Junior  | 0.6     |
| Intern  | 0.4     |

### K_gen (Gender)

| Gender | K_gen |
| ------ | ----- |
| Male   | 1.0   |
| Female | 0.7   |

### K_age (Age)

| Age Range    | K_age |
| ------------ | ----- |
| 30-35        | 1.1   |
| 25-29, 36-45 | 1.0   |
| < 25, 45+    | 0.85  |

### K_tenure (Years in Grade)

| Tenure    | K_tenure |
| --------- | -------- |
| 1-3 years | 1.1      |
| 3+ years  | 0.9      |
| < 1 year  | 0.9      |

### Task Complexity Multipliers

**K_burn** (Burnout Risk):

- 0.0 = Standard work
- 0.3 = High pressure
- 0.5 = Extreme pressure

**K_crit** (Criticality):

- 0.0 = Non-critical
- 0.5 = Important
- 1.0 = Critical

**K_new** (Novelty):

- 0.0 = Standard
- 0.4 = New techniques
- 0.8 = New domain

**K_diff** (Difficulty):

- 0.5 = Very simple
- 1.0 = Standard
- 1.5 = Complex
- 2.0 = Extremely complex

---

## File Structure

### Server

```
server/
├── graphql/
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── permission.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── resolvers/
│   │   ├── employee.ts
│   │   ├── company.ts
│   │   ├── process.ts
│   │   └── ...
│   ├── schema.graphql
│   ├── context.ts
│   ├── context/
│   │   ├── builder.ts
│   │   ├── dataloaders.ts
│   │   └── types.ts
│   └── server.ts
├── services/
│   ├── ServiceFactory.ts
│   ├── core/
│   │   ├── CompanyService.ts
│   │   ├── EmployeeService.ts
│   │   ├── GradeService.ts
│   │   └── DepartmentService.ts
│   ├── operations/
│   │   ├── ProcessService.ts
│   │   └── TaskAssignmentService.ts
│   ├── analytics/
│   │   ├── LoadSnapshotService.ts
│   │   └── GapAnalysisService.ts
│   └── audit/
│       ├── EmployeeHistoryService.ts
│       └── AuditLogService.ts
├── db/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── generated/
└── utils/
    ├── cache.ts
    ├── errors.ts
    └── ...
```

### Docs

```
docs/
├── server/
│   ├── db/
│   │   └── README.md
│   ├── gql/
│   │   └── README.md
│   └── services/
│       └── README.md
├── system/
│   ├── README.md
│   ├── workflows.md
│   └── capacity-units.md
├── client/
│   └── (documentation for frontend)
└── reference/
    └── quick-reference.md
```

---

## Common Tasks Checklist

### Creating a New Service

```typescript
// 1. Create file: server/services/domain/NewService.ts
class NewService extends BaseService {
  constructor(context: ServiceContext) {
    super(context);
  }

  async getById(id: string) {
    return this.context.loaders.newEntity.load(id);
  }

  async create(data: CreateInput) {
    const entity = await this.context.prisma.newEntity.create({ data });
    this.invalidateCache("newEntity-list");
    return entity;
  }
}

// 2. Export from services/core/index.ts
export { NewService };

// 3. Add to ServiceFactory.ts
getNewService(): NewService {
  return new NewService(this.context);
}

// 4. Add context type
interface GraphQLContext {
  services: {
    newEntity: NewService;
    // ...
  };
}

// 5. Use in resolver
const newEntity = await context.services.newEntity.getById(id);
```

### Adding a DataLoader

```typescript
// 1. Create loader in server/graphql/context/dataloaders.ts
const newEntityLoader = new DataLoader(async (ids: string[]) => {
  return context.prisma.newEntity.findMany({
    where: { id: { in: ids } },
  });
});

// 2. Add to loaders object
return {
  // ...
  newEntity: newEntityLoader,
};

// 3. Use in resolvers/services
const entity = await context.loaders.newEntity.load(id);
```

### Adding Middleware to Resolver

```typescript
// Option 1: Simple middleware
withMiddleware(resolver, {
  requireAuth: true,
  requiredPermissions: ["resource:action"],
});

// Option 2: Custom validation
withMiddleware(resolver, {
  requireAuth: true,
  validate: async (args) => {
    // Custom checks
    if (!isValid(args)) throw new Error("Invalid");
  },
});
```

---

## Performance Tips

1. **Use DataLoaders** - Prevent N+1 queries
2. **Batch requests** - Use Promise.all()
3. **Cache at service level** - Invalidate on mutations
4. **Avoid recursive relations** - Limit depth in GraphQL
5. **Index database columns** - On frequently queried fields
6. **Monitor slow queries** - Log queries > 100ms
7. **Use pagination** - For large result sets

---

## Related Documentation

- [System Architecture](../system/README.md)
- [Database Schema](../db/README.md)
- [GraphQL Layer](../gql/README.md)
- [Services Layer](../services/README.md)
- [Workflows Examples](../system/workflows.md)
