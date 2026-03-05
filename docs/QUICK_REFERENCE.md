# DataLoaders & Services - Quick Reference

## One-Page Cheat Sheet

### DataLoaders - Reading Data (No N+1)

```typescript
// Single entity reads
const employee = await context.loaders.employee.load(id);
const department = await context.loaders.department.load(id);
const company = await context.loaders.company.load(id);
const grade = await context.loaders.grade.load(gradeId); // number ID

// Batch reads (all loaders support this)
const [e1, e2, e3] = await Promise.all([
  context.loaders.employee.load(id1),
  context.loaders.employee.load(id2),
  context.loaders.employee.load(id3),
]); // 1 query, not 3!

// Collection reads
const employees = await context.loaders.employeesByDepartment.load(deptId);
const tasks = await context.loaders.tasksByEmployee.load(empId);
const history = await context.loaders.snapshotsByEmployee.load(empId);
```

### Services - Writing Data (With Validation & Cache)

```typescript
// Create
const created = await context.services.employee.create({
  name,
  email,
  departmentId,
  gradeId,
  startDate,
});

// Update
const updated = await context.services.employee.update(id, {
  name,
  email,
  departmentId,
});

// Delete
const deleted = await context.services.employee.delete(id);

// Service automatically:
// 1. Validates input
// 2. Checks permissions (your responsibility)
// 3. Performs mutation
// 4. Invalidates cache
// 5. Returns fresh data
```

### Available Loaders

| Loader                  | Use For                      |
| ----------------------- | ---------------------------- |
| `employee`              | Single employee by ID        |
| `department`            | Single department by ID      |
| `company`               | Single company by ID         |
| `grade`                 | Single grade by ID (numeric) |
| `user`                  | Single user by ID            |
| `process`               | Single process by ID         |
| `taskAssignment`        | Single task by ID            |
| `loadSnapshot`          | Single snapshot by ID        |
| `gapAnalysis`           | Single gap analysis by ID    |
| `employeeHistory`       | Single history entry by ID   |
| `auditLog`              | Single audit log by ID       |
| `employeesByDepartment` | All employees in dept        |
| `tasksByEmployee`       | All tasks for employee       |
| `snapshotsByEmployee`   | All snapshots for employee   |

### Available Services

```typescript
context.services.company; // CompanyService
context.services.department; // DepartmentService
context.services.employee; // EmployeeService
context.services.grade; // GradeService
context.services.process; // ProcessService
context.services.taskAssignment; // TaskAssignmentService
context.services.loadSnapshot; // LoadSnapshotService
context.services.gapAnalysis; // GapAnalysisService
context.services.employeeHistory; // EmployeeHistoryService
context.services.auditLog; // AuditLogService
context.services.user; // UserService
```

## Common Resolver Patterns

### Simple Query (Read)

```typescript
employee: withMiddleware(
  async (_parent, { id }, context) => {
    return context.loaders.employee.load(id);
  },
  { requireAuth: true },
);
```

### Query with Batching

```typescript
departmentEmployees: withMiddleware(
  async (_parent, { departmentId }, context) => {
    return context.loaders.employeesByDepartment.load(departmentId);
  },
  { requireAuth: true },
);
```

### Simple Mutation (Write)

```typescript
createEmployee: withMiddleware(
  async (_parent, { input }, context) => {
    return context.services.employee.create(input);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:create"],
    validate: (args) => args.input && args.input.name && args.input.email,
  },
);
```

### Update Mutation

```typescript
updateEmployee: withMiddleware(
  async (_parent, { id, input }, context) => {
    return context.services.employee.update(id, input);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:update"],
  },
);
```

### Delete Mutation

```typescript
deleteEmployee: withMiddleware(
  async (_parent, { id }, context) => {
    return context.services.employee.delete(id);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:delete"],
  },
);
```

### Field Resolver (Nested Data)

```typescript
export const Employee = {
  // Use loader to prevent N+1 in nested queries
  department: async (parent, _args, context) => {
    return context.loaders.department.load(parent.departmentId);
  },

  tasks: async (parent, _args, context) => {
    return context.loaders.tasksByEmployee.load(parent.id);
  },

  loadHistory: async (parent, _args, context) => {
    return context.loaders.snapshotsByEmployee.load(parent.id);
  },
};
```

## Performance Tips

### ✅ Good - Batch Multiple Loads

```typescript
const [emp, dept, company] = await Promise.all([
  context.loaders.employee.load(empId),
  context.loaders.department.load(deptId),
  context.loaders.company.load(companyId),
]);
// Result: 3 queries total
```

### ❌ Bad - Sequential Loads

```typescript
const emp = await context.loaders.employee.load(empId);
const dept = await context.loaders.department.load(deptId);
const company = await context.loaders.company.load(companyId);
// Result: Slower, same number of queries but sequential
```

### ✅ Good - Use Batch Loaders

```typescript
// Single query for all 100 employees in department
const employees = await context.loaders.employeesByDepartment.load(deptId);
```

### ❌ Bad - Loop with Single Loaders

```typescript
// 100 queries instead of 1
const employees = await Promise.all(
  deptIds.map((id) => context.loaders.employeesByDepartment.load(id)),
);
```

## Common Mistakes

### Mistake 1: Using Prisma Instead of DataLoader

```typescript
// ❌ Bad
const employee = await context.prisma.employee.findUnique({
  where: { id },
});

// ✅ Good
const employee = await context.loaders.employee.load(id);
```

### Mistake 2: Direct Prisma Mutation

```typescript
// ❌ Bad - No validation, no cache invalidation
await context.prisma.employee.update({
  where: { id },
  data: input,
});

// ✅ Good - Validation, cache invalidation, audit
await context.services.employee.update(id, input);
```

### Mistake 3: Missing Middleware Validation

```typescript
// ❌ Bad - No auth/permissions check
resolver: async (_parent, { id, data }, context) => {
  return context.services.employee.update(id, data);
};

// ✅ Good - Auth/permissions/validation in middleware
resolver: withMiddleware(
  async (_parent, { id, data }, context) => {
    return context.services.employee.update(id, data);
  },
  {
    requireAuth: true,
    requiredPermissions: ["employee:update"],
    validate: (args) => args.id && args.data,
  },
);
```

## Caching

### Service Caches Automatically

```typescript
// First call: queries database
let emp = await context.services.employee.getById(id);

// Same request, same key: returns cached
emp = await context.services.employee.getById(id); // From cache!

// After mutation: cache invalidated
await context.services.employee.update(id, data);

// Next call: fresh from database
emp = await context.services.employee.getById(id);
```

### Manual Cache Invalidation (if needed)

```typescript
// Service does this automatically, but if you need to manually:
context.services.employee.invalidate(id);
```

## Error Handling

Services throw specific errors:

```typescript
import { NotFoundError, ValidationError } from "@/server/services/base/types";

try {
  await context.services.employee.getById(id);
} catch (e) {
  if (e instanceof NotFoundError) {
    // Handle not found
  } else if (e instanceof ValidationError) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

## Testing Pattern

```typescript
import { EmployeeService } from "@/server/services/core/employee";

describe("EmployeeService", () => {
  it("should create employee", async () => {
    const mockContext = {
      prisma: mockPrisma,
      dataloaders: mockLoaders,
      cache: mockCache,
      // ... other context fields
    };

    const service = new EmployeeService(mockContext);
    const result = await service.create({
      name: "John",
      email: "john@example.com",
      departmentId: "dept-1",
      gradeId: 3,
    });

    expect(result.name).toBe("John");
    expect(result.email).toBe("john@example.com");
  });
});
```

## Request Flow

```
Request arrives
    ↓
Middleware (auth/validation)
    ↓ (Middleware passed)
Resolver executes
    ├─ Reads via loaders (batched)
    └─ Writes via services (validated + cache invalidated)
    ↓
Response returned
    ↓
Cache cleaned up
    ↓
Request complete
```

---

**Save this page for quick reference!** 📌
