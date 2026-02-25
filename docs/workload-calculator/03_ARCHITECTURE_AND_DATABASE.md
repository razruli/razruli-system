# 03. Архитектура системы и схемы БД

**Load Aggregation Service** — микросервис для расчёта нагрузки на основе Capacity Units (CU).

---

## 1. Логическая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                 Load Aggregation Service                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Layer (REST/GraphQL)                 │  │
│  │  - GET /departments/{id}/load                         │  │
│  │  - GET /employees/{id}/load                           │  │
│  │  - POST /task-assignments                             │  │
│  │  - GET /analytics/gap-analysis                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Calculation Engine (Service Layer)              │  │
│  │  - computeEmployeeCapacity(employee) → P_месяц       │  │
│  │  - computeTaskLoad(task) → L                          │  │
│  │  - computeEmployeeLoadIndex(emp, period) → I_ind     │  │
│  │  - computeDepartmentLoadIndex(dept, period) → I_dept │  │
│  │  - analyzeGap(dept) → recommendation                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Data Access Layer (Repositories)               │  │
│  │  - EmployeeRepository                                 │  │
│  │  - DepartmentRepository                               │  │
│  │  - ProcessRepository                                  │  │
│  │  - TaskAssignmentRepository                           │  │
│  │  - LoadSnapshotRepository                             │  │
│  │  - CompanyRepository                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database (Prisma ORM)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Prisma схемы (schema.prisma)

```prisma
// ============================================================
// ORGANIZATIONS & INFRASTRUCTURE
// ============================================================

model Company {
  id              String    @id @default(cuid())
  name            String
  timezone        String    @default("UTC+3")
  workingHoursDay Int       @default(8)
  workingDaysPerMonth Int   @default(21)

  employees       Employee[]
  departments     Department[]
  processes       Process[]
  tasks           TaskAssignment[]
  snapshots       LoadSnapshot[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Department {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  name            String
  headId          String?
  head            Employee? @relation("DepartmentHead", fields: [headId], references: [id])

  employees       Employee[]
  processes       Process[]
  tasks           TaskAssignment[]
  snapshots       LoadSnapshot[]

  @@unique([companyId, name])
  @@index([companyId])
}

// ============================================================
// EMPLOYEES & CAPACITY
// ============================================================

model Grade {
  id              Int       @id
  name            String    @unique
  kGrade          Float     // 0.4 (Intern) ... 1.7 (C-level)
  description     String?

  employees       Employee[]
}

model Employee {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  departmentId    String
  department      Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)

  fio             String    // Full name
  gradeId         Int
  grade           Grade     @relation(fields: [gradeId], references: [id])

  gender          String    // "M" | "F"
  birthDate       DateTime?
  hireDate        DateTime
  fireDate        DateTime?

  // Coefficients for P calculation
  kEfficiency     Float     @default(1.0) // 0.8–1.2

  // Employment details
  employmentType  String    @default("ТД") // "ТД" | "ГПХ" | "Самозанятый"
  status          String    @default("active") // "active" | "vacation" | "sick" | "dismissed"

  // Work schedule
  workingHoursPerDay Int    @default(8)

  // Relations
  managedDepartment Department? @relation("DepartmentHead")
  taskAssignments TaskAssignment[]
  snapshots       LoadSnapshot[]
  historyRecords  EmployeeHistory[]

  metadata        Json      @default("{}")

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([companyId, fio])
  @@index([companyId])
  @@index([departmentId])
  @@index([gradeId])
}

// ============================================================
// PROCESSES & TASKS
// ============================================================

model Process {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  departmentId    String
  department      Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)

  title           String
  description     String?

  // Resource consumption (L calculation)
  plannedHours    Int       // базовое время выполнения
  kBurn           Float     @default(0.0) // 0.0–0.2
  kCrit           Float     @default(0.0) // 0.0–0.2
  kNew            Float     @default(0.0) // 0.0–0.1

  // Target grade for this process
  targetGradeId   Int
  targetGrade     Grade     @relation(fields: [targetGradeId], references: [id])

  status          String    @default("open") // "open" | "in_progress" | "done" | "archived"
  priority        String    @default("medium") // "low" | "medium" | "high" | "critical"

  taskAssignments TaskAssignment[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([companyId])
  @@index([departmentId])
  @@index([targetGradeId])
}

model TaskAssignment {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  departmentId    String
  department      Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)

  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  processId       String
  process         Process   @relation(fields: [processId], references: [id], onDelete: Cascade)

  // Time tracking
  plannedHours    Float
  actualHours     Float?

  // Calculated load (L value in CU)
  calculatedLoad  Float?

  // Status
  status          String    @default("pending") // "pending" | "in_progress" | "completed" | "cancelled"

  startedAt       DateTime?
  completedAt     DateTime?

  metadata        Json      @default("{}")

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([companyId])
  @@index([employeeId])
  @@index([processId])
  @@index([status])
}

// ============================================================
// ANALYTICS & SNAPSHOTS
// ============================================================

model LoadSnapshot {
  id              String    @id @default(cuid())
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  // Either employee or department (not both)
  employeeId      String?
  employee        Employee? @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  departmentId    String?
  department      Department? @relation(fields: [departmentId], references: [id], onDelete: Cascade)

  // Period
  periodStart     DateTime
  periodEnd       DateTime

  // Metrics
  loadIndex       Float     // I_ind or I_dept
  totalLoadCU     Float     // Σ(L)
  totalCapacityCU Float     // Σ(P_месяц)
  percentUsed     Float     // (totalLoadCU / totalCapacityCU) * 100

  // Employee-specific
  employeeStatus  String?   // "active" | "vacation" | "sick" | "dismissed"
  workingDays     Int?

  // Department-specific
  activeEmployeeCount Int?
  overloadedCount Int?      // count where I_ind > 1.1

  // Meta
  calculatedAt    DateTime  @default(now())

  @@unique([companyId, employeeId, periodStart, periodEnd])
  @@unique([companyId, departmentId, periodStart, periodEnd])
  @@index([companyId])
  @@index([employeeId])
  @@index([departmentId])
  @@index([periodStart])
}

// ============================================================
// CHANGE LOG & AUDIT TRAIL
// ============================================================

model EmployeeHistory {
  id              String    @id @default(cuid())
  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  fieldName       String    // "grade", "department", "status", "kEfficiency", etc
  oldValue        String?
  newValue        String?

  changedBy       String    // userId who made the change
  changedAt       DateTime  @default(now())
  reason          String?   // explanation

  @@index([employeeId])
  @@index([changedAt])
}

model AuditLog {
  id              String    @id @default(cuid())
  companyId       String

  entityType      String    // "Employee" | "Department" | "Process" | "TaskAssignment"
  entityId        String
  action          String    // "CREATE" | "UPDATE" | "DELETE"

  oldValues       Json?
  newValues       Json?

  changedBy       String
  changedAt       DateTime  @default(now())

  @@index([companyId])
  @@index([entityType])
  @@index([changedAt])
}

// ============================================================
// GAP ANALYSIS & HIRING
// ============================================================

model GapAnalysisResult {
  id              String    @id @default(cuid())
  companyId       String
  departmentId    String

  // Analysis results
  analysisType    String    // "TypeA_Quantitative" | "TypeB_Qualitative"
  currentLoadIndex Float
  requiredLoadIndex Float  @default(1.0)

  deficitCU       Float     // ΔP needed
  recommendedGrade String  // "Junior" | "Middle" | "Senior" | "Manager"
  recommendedCount Int     // how many to hire

  recommendations String?   // detailed text
  createdAt       DateTime  @default(now())

  @@index([companyId])
  @@index([departmentId])
}

model HiringRequest {
  id              String    @id @default(cuid())
  companyId       String
  departmentId    String?

  // Hiring params
  position        String
  gradeId         Int
  candidatesNeeded Int

  // Qualifications
  experienceYears Int
  experienceJustification String?

  // Salary
  salaryMin       Int
  salaryMax       Int

  // Process
  interviewStages Int       @default(2)
  trialPeriodMonths Int    @default(3)

  // KPIs
  kpiTrial        String?
  kpiPermanent    String?

  // Meta
  trigger         String    // "overload" | "dismissal" | "strategy"
  status          String    @default("draft") // "draft" | "ready" | "sent" | "closed"

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([companyId])
  @@index([departmentId])
  @@index([status])
}
```

---

## 3. SQL таблицы (PostgreSQL)

Выше описанные модели Prisma автоматически создают эти таблицы:

```sql
-- Companies
CREATE TABLE "Company" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'UTC+3',
  "workingHoursDay" INTEGER NOT NULL DEFAULT 8,
  "workingDaysPerMonth" INTEGER NOT NULL DEFAULT 21,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Departments
CREATE TABLE "Department" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "headId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("companyId", "name"),
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE,
  FOREIGN KEY ("headId") REFERENCES "Employee"("id")
);

-- Grades
CREATE TABLE "Grade" (
  "id" INTEGER NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "kGrade" DOUBLE PRECISION NOT NULL,
  "description" TEXT
);

-- Employees
CREATE TABLE "Employee" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "fio" TEXT NOT NULL,
  "gradeId" INTEGER NOT NULL,
  "gender" TEXT NOT NULL,
  "birthDate" TIMESTAMP(3),
  "hireDate" TIMESTAMP(3) NOT NULL,
  "fireDate" TIMESTAMP(3),
  "kEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "employmentType" TEXT NOT NULL DEFAULT 'ТД',
  "status" TEXT NOT NULL DEFAULT 'active',
  "workingHoursPerDay" INTEGER NOT NULL DEFAULT 8,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("companyId", "fio"),
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE,
  FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE,
  FOREIGN KEY ("gradeId") REFERENCES "Grade"("id")
);

-- Processes
CREATE TABLE "Process" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "plannedHours" INTEGER NOT NULL,
  "kBurn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "kCrit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "kNew" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "targetGradeId" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE,
  FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE,
  FOREIGN KEY ("targetGradeId") REFERENCES "Grade"("id")
);

-- Task Assignments
CREATE TABLE "TaskAssignment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "processId" TEXT NOT NULL,
  "plannedHours" DOUBLE PRECISION NOT NULL,
  "actualHours" DOUBLE PRECISION,
  "calculatedLoad" DOUBLE PRECISION,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE,
  FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE,
  FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE
);

-- Load Snapshots
CREATE TABLE "LoadSnapshot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "employeeId" TEXT,
  "departmentId" TEXT,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "loadIndex" DOUBLE PRECISION NOT NULL,
  "totalLoadCU" DOUBLE PRECISION NOT NULL,
  "totalCapacityCU" DOUBLE PRECISION NOT NULL,
  "percentUsed" DOUBLE PRECISION NOT NULL,
  "employeeStatus" TEXT,
  "workingDays" INTEGER,
  "activeEmployeeCount" INTEGER,
  "overloadedCount" INTEGER,
  "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("companyId", "employeeId", "periodStart", "periodEnd"),
  UNIQUE("companyId", "departmentId", "periodStart", "periodEnd"),
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE,
  FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE,
  FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE
);

-- Employee History
CREATE TABLE "EmployeeHistory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "fieldName" TEXT NOT NULL,
  "oldValue" TEXT,
  "newValue" TEXT,
  "changedBy" TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reason" TEXT,
  FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE
);

-- Audit Log
CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "oldValues" JSONB,
  "newValues" JSONB,
  "changedBy" TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hiring Requests
CREATE TABLE "HiringRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "departmentId" TEXT,
  "position" TEXT NOT NULL,
  "gradeId" INTEGER NOT NULL,
  "candidatesNeeded" INTEGER NOT NULL,
  "experienceYears" INTEGER NOT NULL,
  "experienceJustification" TEXT,
  "salaryMin" INTEGER NOT NULL,
  "salaryMax" INTEGER NOT NULL,
  "interviewStages" INTEGER NOT NULL DEFAULT 2,
  "trialPeriodMonths" INTEGER NOT NULL DEFAULT 3,
  "kpiTrial" TEXT,
  "kpiPermanent" TEXT,
  "trigger" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Company"("id"),
  FOREIGN KEY ("gradeId") REFERENCES "Grade"("id")
);

-- Gap Analysis Results
CREATE TABLE "GapAnalysisResult" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "analysisType" TEXT NOT NULL,
  "currentLoadIndex" DOUBLE PRECISION NOT NULL,
  "requiredLoadIndex" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "deficitCU" DOUBLE PRECISION NOT NULL,
  "recommendedGrade" TEXT NOT NULL,
  "recommendedCount" INTEGER NOT NULL,
  "recommendations" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("companyId") REFERENCES "Company"("id")
);

-- Indexes
CREATE INDEX "Department_companyId" ON "Department"("companyId");
CREATE INDEX "Employee_companyId" ON "Employee"("companyId");
CREATE INDEX "Employee_departmentId" ON "Employee"("departmentId");
CREATE INDEX "Employee_gradeId" ON "Employee"("gradeId");
CREATE INDEX "Process_companyId" ON "Process"("companyId");
CREATE INDEX "Process_departmentId" ON "Process"("departmentId");
CREATE INDEX "TaskAssignment_employeeId" ON "TaskAssignment"("employeeId");
CREATE INDEX "TaskAssignment_processId" ON "TaskAssignment"("processId");
CREATE INDEX "TaskAssignment_status" ON "TaskAssignment"("status");
CREATE INDEX "LoadSnapshot_employeeId" ON "LoadSnapshot"("employeeId");
CREATE INDEX "LoadSnapshot_departmentId" ON "LoadSnapshot"("departmentId");
CREATE INDEX "LoadSnapshot_periodStart" ON "LoadSnapshot"("periodStart");
CREATE INDEX "GapAnalysisResult_departmentId" ON "GapAnalysisResult"("departmentId");
```

---

## 4. Инициализация данных (grades)

```sql
INSERT INTO "Grade" (id, name, kGrade) VALUES
  (0, 'Intern', 0.4),
  (1, 'Junior', 0.6),
  (2, 'Middle', 0.8),
  (3, 'Senior', 1.0),
  (4, 'Manager', 1.5),
  (5, 'C-level', 1.7);
```

---

## 5. Основные вычисления (Typescript, Node.js)

```typescript
// utils/capacityCalculations.ts

// P_day = 1.0 * K_grade * K_gen * K_age * K_tenure
export function computeEmployeeDayCapacity(
  employee: Employee,
  gradeKGrade: number,
  today: Date = new Date(),
): number {
  const kGrade = gradeKGrade;

  // K_gen
  const kGen = employee.gender === "M" ? 1.0 : 0.7;

  // K_age
  const age = Math.floor(
    (today.getTime() - employee.birthDate.getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );
  const kAge =
    age >= 30 && age <= 35 ? 1.1 : age >= 25 && age <= 45 ? 1.0 : 0.85;

  // K_tenure
  const tenureYears = Math.floor(
    (today.getTime() - employee.hireDate.getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );
  const kTenure =
    tenureYears >= 1 && tenureYears <= 3 ? 1.1 : tenureYears >= 3 ? 0.9 : 0.9;

  // K_efficiency
  const kEfficiency = employee.kEfficiency || 1.0;

  return 1.0 * kGrade * kGen * kAge * kTenure * kEfficiency;
}

// P_hour = P_day / 8
export function computeEmployeeHourCapacity(dayCapacity: number): number {
  return dayCapacity / 8;
}

// P_month = P_day * 21
export function computeEmployeeMonthCapacity(
  dayCapacity: number,
  workingDays: number = 21,
): number {
  return dayCapacity * workingDays;
}

// L = (T_hours / 8) * (1 + K_burn + K_crit + K_new) * K_diff
export function computeTaskLoad(
  plannedHours: number,
  kBurn: number = 0.0,
  kCrit: number = 0.0,
  kNew: number = 0.0,
  kDiff: number = 1.0,
): number {
  const intensityMultiplier = 1 + kBurn + kCrit + kNew;
  return (plannedHours / 8) * intensityMultiplier * kDiff;
}

// I_ind = Σ(L_tasks) / P_month
export function computeEmployeeLoadIndex(
  totalTaskLoad: number,
  monthCapacity: number,
): number {
  return monthCapacity > 0 ? totalTaskLoad / monthCapacity : 0;
}

// I_dept = Σ(L_all) / Σ(P_month for all employees)
export function computeDepartmentLoadIndex(
  totalTaskLoad: number,
  totalMonthCapacity: number,
): number {
  return totalMonthCapacity > 0 ? totalTaskLoad / totalMonthCapacity : 0;
}

// K_diff calculation
export function computekDiff(
  targetGradeId: number,
  executorGradeId: number,
): number {
  const gradeDifference = targetGradeId - executorGradeId;
  if (gradeDifference <= 0) return 1.0; // No heroism needed
  if (gradeDifference === 1) return 1.5; // 1 grade difference
  return 2.0; // 2+ grades difference
}
```

---

## 6. Пример: Полный расчёт месячной нагрузки

```typescript
// services/loadAggregationService.ts

export async function calculateDepartmentLoad(
  departmentId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<LoadSnapshot> {
  // 1. Получить всех active сотрудников
  const employees = await db.employee.findMany({
    where: { departmentId, status: 'active' },
    include: { grade: true }
  });

  // 2. Получить all task assignments за период
  const tasks = await db.taskAssignment.findMany({
    where: {
      departmentId,
      createdAt: { gte: periodStart, lte: periodEnd }
    },
    include: { employee: true, process true }
  });

  // 3. Compute each employee's capacity
  let totalCapacityCU = 0;
  const employeeCapacities = new Map<string, number>();

  for (const emp of employees) {
    const dayCapacity = computeEmployeeDayCapacity(emp, emp.grade.kGrade);
    const monthCapacity = computeEmployeeMonthCapacity(dayCapacity, 21);
    employeeCapacities.set(emp.id, monthCapacity);
    totalCapacityCU += monthCapacity;
  }

  // 4. Compute each task's load
  let totalLoadCU = 0;
  for (const task of tasks) {
    if (!task.calculatedLoad) {
      // Compute on the fly
      const kDiff = computeKDiff(task.process.targetGradeId, task.employee.gradeId);
      const L = computeTaskLoad(
        task.plannedHours,
        task.process.kBurn,
        task.process.kCrit,
        task.process.kNew,
        kDiff
      );
      totalLoadCU += L;
    } else {
      totalLoadCU += task.calculatedLoad;
    }
  }

  // 5. Compute I_dept
  const loadIndex = computeDepartmentLoadIndex(totalLoadCU, totalCapacityCU);
  const percentUsed = (totalLoadCU / totalCapacityCU) * 100;

  // 6. Save snapshot
  const snapshot = await db.loadSnapshot.upsert({
    where: {
      companyId_departmentId_periodStart_periodEnd: {
        companyId: employees[0]?.company?.id || '',
        departmentId,
        periodStart,
        periodEnd
      }
    },
    update: {
      loadIndex,
      totalLoadCU,
      totalCapacityCU,
      percentUsed,
      updatedAt: new Date()
    },
    create: {
      companyId: employees[0]?.companyId || '',
      departmentId,
      periodStart,
      periodEnd,
      loadIndex,
      totalLoadCU,
      totalCapacityCU,
      percentUsed,
      activeEmployeeCount: employees.length,
      calculatedAt: new Date()
    }
  });

  return snapshot;
}
```

---

## Итого

**Система готова к разработке:**

- ✅ Prisma models (ORM)
- ✅ PostgreSQL schemas
- ✅ Indexes для оптимизации
- ✅ Вычисления в Typescript
- ✅ Полная аудит-логика
- ✅ Интеграция с hiring system
