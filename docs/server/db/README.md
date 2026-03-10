# Database Schema Documentation

## Overview

The Prisma schema is organized by domain following DDD (Domain-Driven Design) principles. All models are consolidated in a single `schema.prisma` file with clear section separation for maintainability and scalability.

**Location:** `/server/db/prisma/schema.prisma`

**Status:** ✅ Production Ready (PostgreSQL, all migrations applied)

---

## Schema Organization

### 1. CORE DOMAIN

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
- Coefficient-based capacity calculation for workload management

**Database Tables:**

```
Company
├── id (UUID, primary key)
├── name (String, max 255)
├── timezone (String)
├── workingHoursDay (Int, default 8)
├── workingDaysPerMonth (Int, default 21)
└── Relations: Department[], Employee[], Process[], TaskAssignment[], LoadSnapshot[]

Department
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── name (String)
├── headId (UUID, optional foreign key to Employee)
└── Relations: Company, Employee[] (as employees), Employee (head), Process[], TaskAssignment[], LoadSnapshot[]

Grade
├── id (UUID, primary key)
├── name (String, unique)
├── kGrade (Float, capacity multiplier)
├── description (Text, optional)
└── Relations: Employee[], Process[]

Employee
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── departmentId (UUID, foreign key)
├── fio (String, full name)
├── gradeId (UUID, foreign key)
├── gender (String: 'M' or 'F')
├── birthDate (DateTime, optional)
├── hireDate (DateTime)
├── fireDate (DateTime, optional)
├── kEfficiency (Float, efficiency coefficient)
├── workingHoursPerDay (Int, default 8)
├── status (Enum: active | vacation | sick | dismissed)
├── metadata (JSON, optional)
└── Relations: Company, Department, Grade, TaskAssignment[], LoadSnapshot[], EmployeeHistory[]
```

---

### 2. OPERATIONS DOMAIN

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

**Database Tables:**

```
Process
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── departmentId (UUID, foreign key)
├── title (String)
├── description (Text, optional)
├── plannedHours (Int)
├── kBurn (Float, burnout risk multiplier)
├── kCrit (Float, criticality multiplier)
├── kNew (Float, novelty multiplier)
├── targetGradeId (UUID, foreign key to Grade)
├── status (Enum: pending | in_progress | completed | cancelled)
├── priority (Enum: low | medium | high | critical)
├── startDate (DateTime, optional)
├── endDate (DateTime, optional)
└── Relations: Company, Department, Grade, TaskAssignment[]

TaskAssignment
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── departmentId (UUID, foreign key)
├── employeeId (UUID, foreign key)
├── processId (UUID, foreign key)
├── plannedHours (Float)
├── actualHours (Float, optional)
├── calculatedLoad (Float, CU units)
├── status (Enum: pending | in_progress | completed | cancelled)
├── startedAt (DateTime, optional)
├── completedAt (DateTime, optional)
└── Relations: Company, Department, Employee, Process
```

---

### 3. ANALYTICS DOMAIN

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

**Database Tables:**

```
LoadSnapshot
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── employeeId (UUID, optional)
├── departmentId (UUID, optional)
├── periodStart (DateTime)
├── periodEnd (DateTime)
├── loadIndex (Float)
├── totalLoadCU (Float)
├── totalCapacityCU (Float)
├── percentUsed (Float)
├── employeeStatus (String, optional)
├── workingDays (Int, optional)
├── activeEmployeeCount (Int, optional)
└── Relations: Company, Employee, Department

GapAnalysisResult
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── departmentId (UUID, foreign key)
├── analysisType (String)
├── currentLoadIndex (Float)
├── requiredLoadIndex (Float)
├── deficitCU (Float)
├── recommendedGrade (String)
├── recommendedCount (Int)
├── createdAt (DateTime)
└── Relations: Company, Department

HiringRequest
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── departmentId (UUID, foreign key)
├── position (String)
├── gradeId (UUID, foreign key)
├── candidatesNeeded (Int)
├── experienceYears (Int)
├── experienceJustification (Text)
├── salaryMin (Float)
├── salaryMax (Float)
├── interviewStages (Int)
├── trialPeriodMonths (Int)
├── kpiTrial (Float)
├── kpiPermanent (Float)
├── trigger (String)
├── status (Enum: draft | open | processing | closed)
├── createdAt (DateTime)
└── Relations: Company, Department, Grade
```

---

### 4. AUDIT DOMAIN

Historical records and compliance tracking.

**Models:**

- `EmployeeHistory` - Employee attribute change history
- `AuditLog` - Comprehensive audit trail for all entity changes

**Key Features:**

- Change history tracking for employee attributes
- Complete mutation audit trail
- Timestamp and user tracking

**Database Tables:**

```
EmployeeHistory
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── employeeId (UUID, foreign key)
├── changeType (String)
├── oldValue (JSON, optional)
├── newValue (JSON, optional)
├── changedAt (DateTime)
└── Relations: Company, Employee

AuditLog
├── id (UUID, primary key)
├── companyId (UUID, foreign key)
├── entityType (String)
├── entityId (String)
├── action (String: CREATE | UPDATE | DELETE)
├── changes (JSON)
├── userId (String, optional)
├── timestamp (DateTime)
└── Relations: Company
```

---

## File Structure

```
server/db/prisma/
├── schema.prisma                    (Main schema file)
├── prisma.config.ts                 (Configuration)
├── seed.ts                          (Data seeding)
├── migrations/
│   └── 20260224140838_init_multi_schema_setup/
│       └── migration.sql            (Initial migration)
├── generated/
│   └── prisma/
│       ├── index.ts
│       ├── client.ts
│       ├── enums.ts
│       └── models.ts
└── ...
```

---

## Indexes for Performance

- Compound indexes on frequently queried field combinations
- Unique constraints for data integrity
- Foreign key indexes for relationship queries
- Period-based indexes for analytics queries

---

## Key Design Decisions

1. **Single Schema File:** All models in one file for better visibility and easier maintenance
2. **Clear Domain Separation:** Comments and organization by business context
3. **Soft Deletes:** Status field for employees instead of hard deletion
4. **Timestamp Tracking:** createdAt/updatedAt for all mutable entities
5. **Multi-tenancy:** companyId on all domain tables for tenant isolation
6. **CASCADE Policies:** Proper cleanup on company deletion

---

## Usage Examples

### Get Company with Departments and Employees

```typescript
const company = await prisma.company.findUnique({
  where: { id: "acme-corp" },
  include: {
    departments: {
      include: {
        employees: {
          include: {
            grade: true,
          },
        },
      },
    },
  },
});
```

### Calculate Employee Capacity Usage

```typescript
const assignments = await prisma.taskAssignment.findMany({
  where: {
    employeeId: "emp-123",
    createdAt: {
      gte: periodStart,
      lte: periodEnd,
    },
  },
  include: { process: true },
});

const totalLoad = assignments.reduce((sum, a) => sum + a.calculatedLoad, 0);
const employee = await prisma.employee.findUnique({
  where: { id: "emp-123" },
  include: { grade: true },
});
```

### Load Analysis Query

```typescript
const snapshot = await prisma.loadSnapshot.findFirst({
  where: {
    employeeId: "emp-123",
    periodStart: { gte: monthStart },
  },
  orderBy: { periodEnd: "desc" },
});
```

---

## Related Documentation

- [GraphQL Schema Mapping](../gql/README.md)
- [Service Layer Documentation](../services/README.md)
- [System Architecture](../../system/README.md)
