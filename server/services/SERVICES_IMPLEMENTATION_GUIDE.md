// ============================================================================
// SERVICES IMPLEMENTATION GUIDE
// ============================================================================
// Complete walkthrough of all 8 implemented services and how they work together
// ============================================================================

## Table of Contents

1. [Service Architecture Overview](#overview)
2. [The 8 Domain Services](#services)
3. [How Services Work Together](#coordination)
4. [Usage Examples](#examples)
5. [Best Practices](#best-practices)

---

## Overview

### Service Stack (4 Domains, 8 Services)

```
┌─────────────────────────────────────────────────────────┐
│                    GraphQL Resolvers                     │
│                    (Phase 6 - Thin)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│             Resolver Middleware (Phase 5)                │
│  Auth | Permissions | Input Validation | Rate Limiting  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│        Service Factory (Dependency Injection)            │
│                   (Phase 3)                              │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌────────┐ ┌──────────┐ ┌───────────┐
   │  CORE  │ │ OPERATIONS│ │ ANALYTICS │ AUDIT
   │        │ │           │ │           │
   │Company │ │ Process  │ │LoadSnapshot│EmployeeHistory
   │Employee│ │TaskAssign│ │GapAnalysis │ AuditLog
   │Grade   │ │           │ │           │
   └────────┘ └──────────┘ └───────────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │   Base Service (Phase 2) │
         │  Cache | Logging | Auth  │
         └───────────┬─────────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │  Service Context (Ph 1)  │
         │ DataLoaders|Cache|Prisma │
         └─────────────────────────┘
```

---

## The 8 Domain Services

### CORE DOMAIN (3 services)

#### 1. CompanyService

**File**: `server/services/core/CompanyService.ts`

**Purpose**: Manages company entities and their settings

**Key Methods**:

- `getById(id)` - Get company by ID (uses DataLoader for batching)
- `getAll()` - Get all active companies (cached)
- `create()` - Create new company with validation
- `update()` - Update company settings
- `getWithStats()` - Get company with department/employee counts

**DataLoader Usage**: ✅ Yes (batches multiple company loads)
**Cache Strategy**: Invalidates company list on create/update
**Cross-domain Calls**: ❌ None

**Example**:

```typescript
const company = await factory.getCompanyService().getById("acme-corp");
// Returns company object with cached result on second call
```

---

#### 2. EmployeeService

**File**: `server/services/core/EmployeeService.ts`

**Purpose**: Manages employee records and capacity calculations

**Key Methods**:

- `getById(id)` - Get employee (uses DataLoader)
- `getByDepartment(deptId)` - Get all employees in department (cached)
- `create()` - Create employee with duplicate checking
- `update()` - Update employee with department invalidation
- `dismiss()` - Soft delete (mark as dismissed)
- `getWithRelations()` - Get employee with grade and department (uses DataLoaders for efficiency)
- `calculateCapacity(id)` - Calculate monthly capacity units
- `isOverloaded(id, load)` - Check if additional load would exceed capacity

**DataLoader Usage**: ✅ Yes (batches employee, department, grade loads)
**Cache Strategy**: Lists by departmentId, invalidates on grade/dept changes
**Cross-domain Calls**: ❌ Uses own DataLoaders only

**Example**:

```typescript
const factory = new ServiceFactory(context);
const empService = factory.getEmployeeService();

// Get employee (batched with others in same request)
const emp = await empService.getById("emp-123");

// Check if they can take more work
const capacity = await empService.calculateCapacity("emp-123");
const overloaded = await empService.isOverloaded("emp-123", 5.5);
```

---

#### 3. GradeService

**File**: `server/services/core/GradeService.ts`

**Purpose**: Manages job grades (junior, mid, senior levels)

**Key Methods**:

- `getById(id)` - Get grade (uses DataLoader)
- `getAll()` - Get all grades (cached)
- `create()` - Create new grade with level uniqueness
- `update()` - Update grade multiplier values

**DataLoader Usage**: ✅ Yes
**Cache Strategy**: Single cache key for all grades
**Cross-domain Calls**: ❌ None

---

### OPERATIONS DOMAIN (2 services)

#### 4. ProcessService

**File**: `server/services/operations/ProcessService.ts`

**Purpose**: Manages business processes and work assignments

**Key Methods**:

- `getById(id)` - Get process (uses DataLoader)
- `getByDepartment(deptId)` - Get department's processes (cached)
- `create()` - Create process with complexity checks
- `update()` - Update process details
- `calculateTaskLoad(processId, executorGradeId)` - Calculate capacity units for a task
- `assignWithCapacityCheck(processId, employeeId)` - **Cross-domain**: Coordinates with EmployeeService to check capacity before assigning

**DataLoader Usage**: ✅ Yes
**Cache Strategy**: Lists by departmentId
**Cross-domain Calls**: ✅ YES - Calls EmployeeService.isOverloaded()

**Pattern - Cross-domain Coordination**:

```typescript
async assignWithCapacityCheck(processId, employeeId) {
  const process = await this.getByIdOrThrow(processId);

  // Get factory to access other services
  const factory = this.getServiceFactory();
  const empService = factory.getEmployeeService();

  // Cross-domain call: check if employee can handle this
  const canHandle = await empService.isOverloaded(employeeId, calculatedLoad);

  if (!canHandle) {
    // Prevent assignment, warn user
  }
}
```

---

#### 5. TaskAssignmentService

**File**: `server/services/operations/TaskAssignmentService.ts`

**Purpose**: Manages task lifecycle and execution tracking

**Key Methods**:

- `getById(id)` - Get task (uses DataLoader)
- `getEmployeeTasks(empId, dateRange)` - Get employee's tasks (cached)
- `getProcessTasks(processId)` - Get all tasks for a process
- `start(id)` - Transition: pending → in_progress
- `complete(id, actualHours)` - Transition: in_progress → completed
- `cancel(id, reason)` - Transition: any → cancelled
- `getHistory(taskId)` - Get state change history

**DataLoader Usage**: ✅ Yes
**Cache Strategy**: Invalidates employee task lists on status changes
**Cross-domain Calls**: ❌ None (but creates history records)

**State Machine**:

```
pending ──start()──> in_progress ──complete()──> completed
    │
    └──cancel()──> cancelled

Each transition:
1. Validates current state
2. Updates task in DB
3. Creates history record (via AuditLogService inside)
4. Invalidates employee's task caches
```

---

### ANALYTICS DOMAIN (2 services)

#### 6. LoadSnapshotService

**File**: `server/services/analytics/LoadSnapshotService.ts`

**Purpose**: Time-series tracking of employee load/capacity

**Key Methods**:

- `getEmployeeSnapshots(empId, dateRange)` - Get historical snapshots (cached)
- `getLatestEmployeeSnapshot(empId)` - Get most recent snapshot (cached separately)
- `getDepartmentSnapshot(deptId, date)` - Get aggregated department metrics
- `createSnapshot(empData)` - Create single snapshot (called by cron jobs)
- `createSnapshotsBatch(snapshots)` - Bulk create (efficient for batch processing)
- `analyzeTrend(empId, days)` - Is load increasing/stable/decreasing?
- `getOverloadedEmployees(deptId)` - Find overloaded people in department

**DataLoader Usage**: ✅ Yes (for loadSnapshot entities)
**Cache Strategy**: Lists by employeeId, dateRange and latest separately
**Cross-domain Calls**: ❌ None

**Typical Usage**:

```typescript
// Called by cron job during workload calculation
const snapshots = employees.map((emp) => ({
  employeeId: emp.id,
  capacity: await empService.calculateCapacity(emp.id),
  load: await getEmployeeCurrentLoad(emp.id),
  snapshotDate: new Date(),
}));

await snapshotService.createSnapshotsBatch(snapshots);

// Query trend analysis
const trend = await snapshotService.analyzeTrend("emp-123", 30);
if (trend.trend === "increasing") {
  // Alert: employee load is increasing
}
```

---

#### 7. GapAnalysisService

**File**: `server/services/analytics/GapAnalysisService.ts`

**Purpose**: Identifies skill/grade gaps and hiring recommendations

**Key Methods**:

- `analyzeDepartmentSkillGaps(deptId)` - What grades are missing?
- `getHiringRecommendations(deptId)` - Who should we hire?
- `getTrainingRecommendations(deptId)` - Who needs training?
- `analyzeDepartmentCapacityCoverage(deptId)` - Total capacity vs demand

**DataLoader Usage**: ✅ Yes (for grade lookups)
**Cache Strategy**: Cached per department per analysis type
**Cross-domain Calls**: ❌ None (reads only)

**Example - Executive Report**:

```typescript
const analysis = await gapService.analyzeDepartmentSkillGaps("eng-dept");
// Returns: { healthScore: 75, gaps: [...], overallGapPercentage: 15 }

const coverage = await gapService.analyzeDepartmentCapacityCoverage("eng-dept");
// Returns: { totalCapacity: 100, totalRequired: 85, coveragePercentage: 85 }

const hiring = await gapService.getHiringRecommendations("eng-dept");
// Returns: [{ title: "Senior Engineer", urgency: "high", ... }]
```

---

### AUDIT DOMAIN (2 services)

#### 8. EmployeeHistoryService

**File**: `server/services/audit/EmployeeHistoryService.ts`

**Purpose**: IMMUTABLE log of employee career milestones

**Key Methods**:

- `getEmployeeHistory(empId)` - Get chronological career events
- `getEmployeeHistoryInRange(empId, dates)` - History within timespan
- `recordHire(empId, deptId, gradeId)` - Log initial placement
- `recordGradeChange(empId, oldGrade, newGrade)` - Log promotion/demotion
- `recordTransfer(empId, fromDept, toDept)` - Log department change
- `recordDismissal(empId, fireDate)` - Log termination
- `recordEfficiencyChange(empId, oldRating, newRating)` - Log rating change
- `getCurrentPosition(empId)` - Derive current role from history
- `getTenureYears(empId)` - Calculate years employed
- `getPromotionCount(empId)` - Count promotions

**DataLoader Usage**: ✅ Yes
**Cache Strategy**: Cached per employee, invalidated on any new record
**Cross-domain Calls**: ❌ None (but is called BY services)

**IMMUTABLE PATTERN**:

```typescript
// History is NEVER updated or deleted - only appended
// This maintains accurate audit trail

// When employee is promoted:
await empService.update('emp-123', { gradeId: 5 });  // Update current state
await historyService.recordGradeChange(
  'emp-123',
  oldGrade: 4,
  newGrade: 5
);  // Append to history

// Query current position by walking history forward
const currentRole = await historyService.getCurrentPosition('emp-123');
```

---

#### 9. AuditLogService

**File**: `server/services/audit/AuditLogService.ts`

**Purpose**: Comprehensive mutation log (ANY change by ANY user)

**Key Methods**:

- `logCreate(type, id, values)` - Log entity creation
- `logUpdate(type, id, before, after)` - Log change with before/after
- `logDelete(type, id, values)` - Log deletion
- `getEntityHistory(type, id)` - Get all changes to one entity
- `getByOperation('CREATE'|'UPDATE'|'DELETE')` - Filter by operation type
- `getByUser(userId)` - What did this user change?
- `getByDateRange(start, end)` - Changes in time window
- `getUserActivitySummary(userId)` - Who made how many changes?
- `detectSuspiciousActivity()` - Bulk delete pattern detection
- `archiveOldLogs(retentionDays)` - Cleanup via cron job

**DataLoader Usage**: ❌ No (not appropriate for logs)
**Cache Strategy**: Caches queries, invalidates on new log
**Cross-domain Calls**: ❌ None (called BY services)

**Usage Pattern**:

```typescript
// Service automatically calls audit log on mutations:
// (Inside EmployeeService.update())
await this.context...update();  // Change DB
await auditService.logUpdate({
  entityType: 'Employee',
  entityId: empId,
  before: oldData,
  after: newData,
  notes: 'Promotion: Grade 4 → 5'
});
```

---

## How Services Work Together

### Pattern 1: Single Domain Operation

**Scenario**: Get employee and check capacity

```typescript
const context = await buildServiceContext(options);
const factory = new ServiceFactory(context);
const empService = factory.getEmployeeService();

const employee = await empService.getById("emp-123"); // DataLoader
const capacity = await empService.calculateCapacity("emp-123"); // Uses DataLoader for grade
const overloaded = await empService.isOverloaded("emp-123", 5.5);

// Cache automatically used: if same request gets employee again,
// DataLoader returns cached result
```

---

### Pattern 2: Cross-Domain Coordination

**Scenario**: Assign process to employee (must check capacity)

```typescript
const factory = new ServiceFactory(context);
const processService = factory.getProcessService();

try {
  const result = await processService.assignWithCapacityCheck(
    "proc-456",
    "emp-123",
  );
  // Inside: coordinates with EmployeeService
  // 1. Get process
  // 2. Get employee (via EmployeeService DataLoader)
  // 3. Calculate load for this assignment
  // 4. Check if overloaded
  // 5. Create task assignment
  // 6. Return decision

  if (result.isOverloaded) {
    console.warn(`${result.taskId} created but employee is overloaded`);
  }
} catch (error) {
  // ServiceError, ValidationError, NotFoundError, etc.
}
```

---

### Pattern 3: State Transitions with History

**Scenario**: Start and complete a task

```typescript
const factory = new ServiceFactory(context);
const taskService = factory.getTaskAssignmentService();
const auditService = factory.getAuditLogService(); // Called automatically

// Start task
const task = await taskService.start("task-789");
// Internally:
// 1. Validates state (must be 'pending')
// 2. Updates status to 'in_progress'
// 3. Creates history record (state transition)
// 4. Invalidates employee's task caches
// 5. (If audit logging enabled) logs change

// Complete task
const completed = await taskService.complete("task-789", 8); // 8 hours
// Same lifecycle with transition to 'completed'

// View history
const history = await taskService.getHistory("task-789");
// [
//   { status: 'pending', recordedAt: ... },
//   { status: 'in_progress', recordedAt: ... },
//   { status: 'completed', recordedAt: ... }
// ]
```

---

### Pattern 4: Analytics & Reporting

**Scenario**: Department health check

```typescript
const factory = new ServiceFactory(context);
const gapService = factory.getGapAnalysisService();
const snapshotService = factory.getLoadSnapshotService();

// Get health metrics
const skillGaps = await gapService.analyzeDepartmentSkillGaps("eng-dept");
const coverage = await gapService.analyzeDepartmentCapacityCoverage("eng-dept");
const overloaded = await snapshotService.getOverloadedEmployees("eng-dept");

// Combine for report
const report = {
  healthScore: skillGaps.healthScore,
  capacityCoverage: coverage.coveragePercentage,
  overloadedCount: overloaded.length,
  recommendation: coverage.recommendation,
  hiringNeeds: await gapService.getHiringRecommendations("eng-dept"),
};

return report; // Send to GraphQL
```

---

### Pattern 5: Career Tracking with Immutable History

**Scenario**: Promote employee and track in history

```typescript
const empService = factory.getEmployeeService();
const historyService = factory.getEmployeeHistoryService();

// Promote employee
const updated = await empService.update("emp-123", { gradeId: 5 });

// Automatically log promotion
await historyService.recordGradeChange("emp-123", 4, 5);

// Later: get career progression
const history = await historyService.getEmployeeHistory("emp-123");
// [
//   { recordType: 'hire', effectiveDate: 2021-01-15, department: '...', grade: 2 },
//   { recordType: 'grade_change', effectiveDate: 2022-06-10, oldGrade: 2, newGrade: 3 },
//   { recordType: 'transfer', effectiveDate: 2023-01-01, from: '...', to: '...' },
//   { recordType: 'grade_change', effectiveDate: 2024-01-15, oldGrade: 3, newGrade: 5 }
// ]

const tenure = await historyService.getTenureYears("emp-123"); // 3.0
const promotions = await historyService.getPromotionCount("emp-123"); // 2
```

---

## Usage Examples

### Example 1: GraphQL Resolver (Phase 6)

```typescript
// resolvers/employee.ts
async employeeById(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getEmployeeService();

  return service.getByIdOrThrow(args.id);
}

async employeeCapacity(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getEmployeeService();

  return service.calculateCapacity(parent.id);
}
```

### Example 2: Business Logic Coordination

```typescript
// Assign work with intelligent capacity checking
async assignWork(processId: string, employeeId: string, context: ServiceContext) {
  const factory = new ServiceFactory(context);
  const { process, employee } = factory.getServices();

  const result = await process.assignWithCapacityCheck(processId, employeeId);

  // If overloaded, suggest alternatives
  if (result.isOverloaded) {
    const candidates = await findUnderloadedEmployees(process.targetGradeId, context);
    return {
      cautionId: result.taskId,
      message: `Employee is overloaded. Consider these instead:`,
      alternatives: candidates
    };
  }

  return { taskId: result.taskId, message: 'Successfully assigned' };
}
```

### Example 3: Batch Analytics

```typescript
// Daily workload calculation cron job
async calculateDailyWorkload(context: ServiceContext) {
  const factory = new ServiceFactory(context);
  const { employee, loadSnapshot, auditLog } = factory.getServices();

  const allEmployees = await context.prisma.employee.findMany({
    where: { status: 'active' },
  });

  const snapshots = [];
  for (const emp of allEmployees) {
    const capacity = await employee.calculateCapacity(emp.id);
    const load = await getEmployeeLoad(emp.id, context);

    snapshots.push({
      employeeId: emp.id,
      capacity,
      load,
      overloaded: load > capacity,
      snapshotDate: new Date(),
    });
  }

  await loadSnapshot.createSnapshotsBatch(snapshots);

  // Optional: log operation
  await auditLog.logCreate({
    entityType: 'DailyWorkloadRun',
    entityId: new Date().toISOString(),
    values: { snapshotCount: snapshots.length },
    notes: 'Automated daily run'
  });
}
```

---

## Best Practices

### 1. Always Use `getOrThrow` When Entity Must Exist

```typescript
// ❌ Bad: doesn't handle missing entity
const emp = await empService.getById(id);
const gradeId = emp.gradeId; // 💥 Could crash if null

// ✅ Good: throws NotFoundError if missing
const emp = await empService.getByIdOrThrow(id);
const gradeId = emp.gradeId; // Safe
```

### 2. Leverage DataLoaders for Efficiency

```typescript
// ❌ Bad: N+1 queries
const employees = await getEmployees();
for (const emp of employees) {
  const grade = await prisma.grade.findUnique({
    where: { level: emp.gradeId },
  });
  console.log(grade.title);
}

// ✅ Good: automatic batching via DataLoader
const employees = await getEmployees();
for (const emp of employees) {
  const grade = await context.dataloaders.grade.load(emp.gradeId); // Batched!
  console.log(grade.title);
}
```

### 3. Let Services Manage Cache Invalidation

```typescript
// ❌ Bad: manual cache management
const emp = await empService.update(id, data);
context.cache.invalidate([
  /* list of guessed keys */
]); // Easy to miss

// ✅ Good: service owns invalidation logic
const emp = await empService.update(id, data); // Caches auto-invalidated
```

### 4. Use ServiceFactory for Cross-Domain Access

```typescript
// ❌ Bad: tight coupling
import { EmployeeService } from "./...";
// ...
const empService = new EmployeeService(context);

// ✅ Good: loose coupling via factory
const factory = new ServiceFactory(context);
const empService = factory.getEmployeeService();
```

### 5. Chain Async Operations Efficiently

```typescript
// ❌ Bad: sequential waits
const emp = await empService.getById(id);
const dept = await deptService.getById(emp.departmentId);
const grade = await gradeService.getById(emp.gradeId);

// ✅ Good: parallel via Promise.all
const emp = await empService.getById(id);
const [dept, grade] = await Promise.all([
  context.dataloaders.department.load(emp.departmentId),
  context.dataloaders.grade.load(emp.gradeId),
]);
```

### 6. Error Handling with Service Errors

```typescript
try {
  const emp = await empService.getByIdOrThrow(id);
} catch (error) {
  if (error instanceof NotFoundError) {
    return { error: "Employee not found", statusCode: 404 };
  }
  if (error instanceof ValidationError) {
    return { error: error.message, statusCode: 400 };
  }
  if (error instanceof AuthorizationError) {
    return { error: "Access denied", statusCode: 403 };
  }
  throw error; // Unknown error
}
```

### 7. Document Business Logic with Comments

```typescript
/**
 * Assign process to employee with capacity check
 *
 * Algorithm:
 * 1. Validate process exists
 * 2. Load employee and current load
 * 3. Calculate estimated load for this process
 * 4. Check if adding this load exceeds capacity
 * 5. Create task assignment
 * 6. Return with overload warning if applicable
 */
async assignWithCapacityCheck(processId: string, employeeId: string) {
  // ...
}
```

---

## Summary

| Service                    | Domain     | Type          | Reads | Writes | Cross-Domain | Immutable |
| -------------------------- | ---------- | ------------- | ----- | ------ | ------------ | --------- |
| **CompanyService**         | Core       | Reference     | ✅    | ✅     | ❌           | ❌        |
| **EmployeeService**        | Core       | Master        | ✅    | ✅     | ❌           | ❌        |
| **GradeService**           | Core       | Reference     | ✅    | ✅     | ❌           | ❌        |
| **ProcessService**         | Operations | Master        | ✅    | ✅     | ✅           | ❌        |
| **TaskAssignmentService**  | Operations | Transactional | ✅    | ✅     | ❌           | ❌        |
| **LoadSnapshotService**    | Analytics  | Time-series   | ✅    | ✅     | ❌           | ✅        |
| **GapAnalysisService**     | Analytics  | Reporting     | ✅    | ❌     | ❌           | ✅        |
| **EmployeeHistoryService** | Audit      | Immutable Log | ✅    | ✅     | ❌           | ✅        |
| **AuditLogService**        | Audit      | Audit Log     | ✅    | ✅     | ❌           | ✅        |

---

## Next Steps (Phase 5 & 6)

### Phase 5: Resolver Middleware

- Auth extraction from JWT
- Permission verification
- Input validation
- Rate limiting

### Phase 6: Thin Resolvers

- Create resolvers/core/, resolvers/operations/, etc.
- Each resolver delegates to service
- Middleware chain before service
- Error handling and formatting

See `docs/SERVICE_ARCHITECTURE.md` for complete sequence.
