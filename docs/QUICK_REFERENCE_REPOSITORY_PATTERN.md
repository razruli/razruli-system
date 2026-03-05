// ============================================================================
// QUICK REFERENCE - Repository Pattern
// ============================================================================
// Copy-paste examples for using the repositories
// ============================================================================

## Using CompanyService

### Create a Company

```typescript
const factory = new ServiceFactory(context);
const service = factory.getCompanyService();

const company = await service.create({
  name: "TechCorp",
  timezone: "UTC+3",
  workingHoursDay: 8,
  workingDaysPerMonth: 21,
});
```

### Get a Company

```typescript
const company = await service.getById("company-123");

// Or throw if not found
const company = await service.getByIdOrThrow("company-123");
```

### List All Companies

```typescript
const companies = await service.getAll(); // Cached
```

### Get Company with Stats

```typescript
const companyWithStats = await service.getWithStats("company-123");
// Returns: { id, name, ..., stats: { departments: 5, employees: 12 } }
```

---

## Using EmployeeService

### Get an Employee

```typescript
const employee = await factory.getEmployeeService().getById("emp-456");

// Or with stats
const withStats = await factory.getEmployeeService().getWithStats("emp-456");
```

### Get Employees by Department

```typescript
const employees = await factory
  .getEmployeeService()
  .getByDepartment("dept-789");
```

### Create Employee

```typescript
const employee = await factory.getEmployeeService().create({
  companyId: "company-123",
  departmentId: "dept-789",
  fio: "John Doe",
  gradeId: 5,
  gender: "male",
  hireDate: new Date("2024-01-15"),
  employmentType: "full-time",
});
```

---

## Using GradeService

### Get a Grade

```typescript
const grade = await factory.getGradeService().getById(5);
```

### List All Grades

```typescript
const grades = await factory.getGradeService().getAll();
```

### Create Grade

```typescript
const grade = await factory.getGradeService().create({
  name: "Senior Developer",
  description: "Lead technical expert",
  kGrade: 1.5,
});
```

---

## Using ProcessService

### Get a Process

```typescript
const process = await factory.getProcessService().getById("process-123");
```

### Get Processes by Department

```typescript
const processes = await factory.getProcessService().getByDepartment("dept-789");
```

### Create Process

```typescript
const process = await factory.getProcessService().create({
  title: "Q1 Account Reconciliation",
  departmentId: "dept-789",
});
```

---

## Using TaskAssignmentService

### Get a Task

```typescript
const task = await factory.getTaskAssignmentService().getById("task-123");
```

### Get Tasks by Employee

```typescript
const tasks = await factory.getTaskAssignmentService().getByEmployee("emp-456");
```

### Create Task

```typescript
const task = await factory.getTaskAssignmentService().create({
  processId: "process-123",
  employeeId: "emp-456",
  companyId: "company-123",
  departmentId: "dept-789",
  plannedHours: 40,
});
```

### Update Task Status

```typescript
const updated = await factory
  .getTaskAssignmentService()
  .updateStatus("task-123", "in_progress");
```

---

## Using LoadSnapshotService

### Get a Snapshot

```typescript
const snapshot = await factory.getLoadSnapshotService().getById("snapshot-123");
```

### List All Snapshots

```typescript
const snapshots = await factory.getLoadSnapshotService().getAll();
```

---

## Using GapAnalysisService

### Get Analysis Result

```typescript
const analysis = await factory.getGapAnalysisService().getById("analysis-123");
```

### List All Analyses

```typescript
const analyses = await factory.getGapAnalysisService().getAll();
```

---

## Using EmployeeHistoryService

### Get History Record

```typescript
const history = await factory
  .getEmployeeHistoryService()
  .getById("history-123");
```

### Get Employee Timeline

```typescript
const timeline = await factory
  .getEmployeeHistoryService()
  .getByEmployee("emp-456"); // Ordered by date DESC
```

### Create History Entry

```typescript
const entry = await factory.getEmployeeHistoryService().create({
  employeeId: "emp-456",
  action: "PROMOTED",
  changes: { from: 3, to: 5 },
});
```

---

## Using AuditLogService

### Get Log Entry

```typescript
const log = await factory.getAuditLogService().getById("log-123");
```

### Get Audit Trail for Entity

```typescript
const trail = await factory
  .getAuditLogService()
  .getByEntity("EMPLOYEE", "emp-456"); // All changes to this employee
```

### Log an Action

```typescript
const logged = await factory
  .getAuditLogService()
  .log("EMPLOYEE_CREATED", "EMPLOYEE", "emp-456", { name: "John", grade: 5 });
```

---

## Error Handling

### Validation Error

```typescript
try {
  await service.create({ name: "" }); // Empty name
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation failed:", error.message);
    // Status: 422
  }
}
```

### Not Found Error

```typescript
try {
  await service.getByIdOrThrow("nonexistent");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error("Not found:", error.message);
    // Status: 404
  }
}
```

### Authorization Error

```typescript
try {
  service.requireAuth(); // Throws if not authenticated
} catch (error) {
  if (error instanceof AuthorizationError) {
    console.error("Not authorized:", error.message);
    // Status: 403
  }
}
```

---

## Tips & Tricks

### Always use Factory to Get Services

```typescript
// ✅ CORRECT
const factory = new ServiceFactory(context);
const service = factory.getCompanyService();

// ❌ WRONG - Services expect context
const service = new CompanyService(); // No context!
```

### All Services Get Same Context

```typescript
const factory = new ServiceFactory(context);
const company = factory.getCompanyService();
const employee = factory.getEmployeeService();

// Both have access to:
// - context.cache (same for both)
// - context.dataloaders (same for both)
// - context.prisma (same for both)
```

### Caching is Automatic

```typescript
// First call - hits database
const emp1 = await service.getById("123");

// Second call - returns from cache
const emp2 = await service.getById("123"); // No DB query!

// After mutation, cache is invalidated
await service.update("123", {
  /* data */
});

// Next call - fresh from database
const emp3 = await service.getById("123");
```

### Validation is Built-in

```typescript
// This throws ValidationError if falsy
service.validate(value, "Field required");

// This throws ValidationError if condition is false
service.validateCondition(value > 0, "Must be positive");

// These throw NotFoundError
const result = service.ensureExists(item, "Company", "123");
```

### Logging is Built-in

```typescript
// All services can log
service.log("info", "Processing employee", { id: "emp-456" });
service.log("error", "Database error", { status: 500 });

// Logs include: timestamp, requestId, domain, message
// [2026-02-24T10:30:45.123Z] [req-abc123] [employeeService] Processing...
```

---

## Common Patterns

### Pattern: Get or Create

```typescript
let item = await service.getById(id);
if (!item) {
  item = await service.create(createData);
}
return item;
```

### Pattern: Validate Then Create

```typescript
this.validate(data.name, "Name required");
const existing = await repository.findByName(data.name);
if (existing) {
  throw new ValidationError("Already exists");
}
return await repository.create(data);
```

### Pattern: Update with Cache Invalidation

```typescript
await repository.update(id, data);
this.invalidate(id);
this.invalidateAll(); // Also clear list cache
return repository.findById(id);
```

### Pattern: Batch Operations

```typescript
const ids = ["emp-1", "emp-2", "emp-3"];
const employees = await service.getByIds(ids);
// Returns: (Employee | null)[]
```

---

## Repository Methods by Service

### CompanyRepository

```typescript
findById(id: string)
findAll()
findByName(name: string)
create(data)
update(id, data)
delete(id)
getDepartmentCount(companyId)
getEmployeeCount(companyId)
```

### EmployeeRepository

```typescript
findById(id: string)
findMany(ids: readonly string[])
findByDepartment(departmentId)
findByCompanyAndName(companyId, fio)
findAll()
create(data)
update(id, data)
delete(id)
getTaskCount(employeeId)
getActiveTaskCount(employeeId)
```

### [All other repositories follow same pattern]

```typescript
findById(id)
findAll()
findMany(ids)
create(data)
update(id, data)
delete(id)
[domain-specific methods]  // e.g., findByDepartment
```

---

## Performance Notes

- **DataLoaders** - Automatic batching prevents N+1
- **Caching** - All list queries cached per request
- **Pagination** - Not yet implemented (TODO)
- **Connection pooling** - Handled by Prisma

---

**That's all you need to know to use the services!**

For more details, see:

- REFACTORING_COMPLETE.md
- ARCHITECTURE_DIAGRAM_REPOSITORY_PATTERN.md
