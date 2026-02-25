# Prisma Schema Organization

## Overview

The Prisma schema is organized by domain/business context following DDD (Domain-Driven Design) principles. All models are consolidated in a single `schema.prisma` file with clear section separation for maintainability.

**Location:** `/server/db/prisma/schema.prisma`

---

## Schema Structure

### 1. **CORE DOMAIN**

Company infrastructure and organizational structure.

**Models:**

- `Company` - Root entity with timezone and working hour configuration
- `Department` - Organizational units with optional head reference
- `Grade` - Employee seniority levels (Intern, Junior, Middle, Senior, Lead, C-level)
- `Employee` - Master employee data with capacity coefficients

**Key Features:**

- Multi-company support via `companyId` foreign key
- Hierarchical department structure with department heads
- Grade-based capacity multipliers (kGrade)
- Employment status tracking (active, vacation, sick, dismissed)
- Coefficient-based capacity calculation (P_day formula)

**Sample Queries:**

```typescript
// Get all employees in a department
const dept = await prisma.department.findUnique({
  where: { id: deptId },
  include: { employees: true },
});

// Find employees by grade and company
const juniors = await prisma.employee.findMany({
  where: {
    companyId,
    gradeId: 1, // Junior grade
    status: "active",
  },
  include: { grade: true, department: true },
});
```

---

### 2. **OPERATIONS DOMAIN**

Processes, tasks, and workload management.

**Models:**

- `Process` - Business process with complexity multipliers
- `TaskAssignment` - Task assignments to employees with load tracking

**Key Features:**

- Process complexity via kBurn, kCrit, kNew multipliers
- Planned vs actual hours tracking
- Calculated load in Capacity Units (CU)
- Status tracking (pending, in_progress, completed, cancelled)
- Task-to-process-to-department hierarchy

**Load Calculation Formula:**

```
L = (planned_hours / 8) * (1 + kBurn + kCrit + kNew) * kDiff
```

**Sample Queries:**

```typescript
// Get all tasks assigned to an employee in a period
const tasks = await prisma.taskAssignment.findMany({
  where: {
    employeeId,
    createdAt: {
      gte: periodStart,
      lte: periodEnd,
    },
  },
  include: { process: true },
});

// Calculate total load for employee
const totalLoad = await prisma.taskAssignment.aggregate({
  where: { employeeId },
  _sum: { calculatedLoad: true },
});
```

---

### 3. **ANALYTICS DOMAIN**

Load snapshots, gap analysis, and hiring workflow.

**Models:**

- `LoadSnapshot` - Historical metrics for employee/department load
- `GapAnalysisResult` - Capacity deficit analysis with hiring recommendations
- `HiringRequest` - Hiring workflow and position management

**Key Features:**

- Period-based load metric snapshots
- Load Index calculation (I_ind for employees, I_dept for departments)
- Gap analysis with recommended hiring by grade
- Hiring request tracking with KPIs and timeline

**Sample Queries:**

```typescript
// Get latest load snapshot for employee
const snapshot = await prisma.loadSnapshot.findFirst({
  where: {
    employeeId,
    periodStart: { gte: monthStart },
  },
  orderBy: { periodEnd: "desc" },
});

// Find overloaded departments
const overloaded = await prisma.loadSnapshot.findMany({
  where: {
    departmentId: { not: null },
    loadIndex: { gt: 1.1 },
    periodStart: { gte: now },
  },
  distinct: ["departmentId"],
});
```

---

### 4. **AUDIT DOMAIN**

Historical records and compliance tracking.

**Models:**

- `EmployeeHistory` - Employee attribute change history
- `AuditLog` - Comprehensive audit trail for all entity changes

**Key Features:**

- Field-level change tracking for employees
- Complete audit trail for CREATE, UPDATE, DELETE operations
- JSON storage for complex change deltas
- Timestamp and user tracking for compliance

**Sample Queries:**

```typescript
// Get employee change history
const history = await prisma.employeeHistory.findMany({
  where: { employeeId },
  orderBy: { changedAt: "desc" },
});

// Audit trail for specific entity
const audit = await prisma.auditLog.findMany({
  where: {
    entityType: "Employee",
    entityId: empId,
  },
  orderBy: { changedAt: "desc" },
});
```

---

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

---

## Unique Constraints

**Multi-field Uniqueness:**

- Company: (name) globally unique
- Department: (companyId, name) - name unique per company
- Employee: (companyId, fio) - name unique per company
- LoadSnapshot: (companyId, employeeId, periodStart, periodEnd)
- LoadSnapshot: (companyId, departmentId, periodStart, periodEnd)

---

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

## Capacity Calculation Formulas

### Employee Monthly Capacity

```
P_day = 1.0 * K_grade * K_gen * K_age * K_tenure * K_efficiency
P_month = P_day * working_days_per_month (default: 21)
```

Where:

- `K_grade` = Grade multiplier (0.4 to 1.7)
- `K_gen` = Gender coefficient (0.9-1.1)
- `K_age` = Age coefficient (0.85-1.15)
- `K_tenure` = Tenure coefficient (0.8-1.2)
- `K_efficiency` = Individual efficiency coefficient (default: 1.0)

### Task Load (Capacity Units)

```
L = (planned_hours / 8) * (1 + K_burn + K_crit + K_new) * K_diff
```

Where:

- `K_burn` = Burnout risk coefficient (0.0-0.2)
- `K_crit` = Critical task coefficient (0.0-0.2)
- `K_new` = New technology coefficient (0.0-0.1)
- `K_diff` = Skill difference coefficient (1.0-2.0)

### Load Index

```
I_ind = Σ(L_tasks) / P_month              // Individual load
I_dept = Σ(L_all) / Σ(P_month)            // Department load
```

Interpretation:

- `I < 0.8` - Underutilized
- `0.8 ≤ I ≤ 1.0` - Optimal
- `1.0 < I ≤ 1.1` - Slightly overloaded
- `I > 1.1` - Overloaded (needs hiring)

---

## Best Practices

### Query Optimization

1. Always include relations you need via `include` or `select`
2. Use `distinct` for avoiding N+1 duplicates when filtering
3. Include indexes in custom queries for large datasets
4. Use aggregation for sum/count operations

### Data Integrity

1. Use database transactions for multi-model updates
2. Validate capacity coefficients before insert (0.4-2.0 range)
3. Enforce status enums at application level
4. Always set `companyId` for tenant isolation

### Audit Trail

1. Create `AuditLog` entries for important changes
2. Track user (`changedBy`) for all modifications
3. Store old/new values as JSON for complex fields
4. Regular audit reviews for compliance

### Performance

1. Archive old `LoadSnapshot` records after 12 months
2. Use pagination for large result sets
3. Consider materializing `I_dept` calculations
4. Index custom filters on frequently queried fields

---

## Generated Prisma Client

The Prisma Client is auto-generated and stored at:

```
/server/db/generated/prisma/
```

Regenerate after schema changes:

```bash
npx prisma generate
```

This includes:

- Type-safe model definitions
- Query builders for all models
- Input types for create/update operations
- Enum definitions for status values

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
