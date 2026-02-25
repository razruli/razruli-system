# Schema Organization - Modular Structure

## ✅ Reorganization Complete

All Prisma models have been organized into domain-driven modular files.

---

## Folder Structure

```
server/db/prisma/
├── schema.prisma                          # ROOT: datasource + generator only
├── models/
│   ├── core/                              # 🏢 Company & Organizational
│   │   ├── company.prisma                 # Company, Department models
│   │   ├── employee.prisma                # Employee model
│   │   └── grade.prisma                   # Grade model
│   │
│   ├── operations/                        # 📋 Workload Management
│   │   ├── process.prisma                 # Process model
│   │   └── task-assignment.prisma         # TaskAssignment model
│   │
│   ├── analytics/                         # 📊 Analytics & Planning
│   │   ├── load-snapshot.prisma           # LoadSnapshot model
│   │   └── gap-analysis.prisma            # GapAnalysisResult, HiringRequest
│   │
│   ├── audit/                             # 📝 Compliance & History
│   │   └── audit.prisma                   # EmployeeHistory, AuditLog
│   │
│   └── auth/                              # 🔐 Authentication (better-auth)
│       └── better-auth.prisma             # User, Session, Account
│
├── migrations/                            # 🔄 Database Migrations
├── generated/                             # ✨ Generated Prisma Client
├── lib/                                   # Utility functions
├── seed.ts                               # Seed script
└── test.ts                               # Test utilities
```

---

## Prisma Configuration

**File:** `prisma.config.ts`

```typescript
export default defineConfig({
  schema: "./server/db/prisma/", // ⬅️ Loads ALL .prisma files recursively
  migrations: {
    path: "server/db/prisma/migrations",
    seed: `tsx server/db/prisma/seed.ts`,
  },
  datasource: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});
```

The `schema: "./server/db/prisma/"` setting tells Prisma to auto-discover all `.prisma` files in that folder and its subdirectories. No need for imports or includes!

---

## Building Services with Matching Structure

You can now create a services folder with the exact same structure:

```
server/services/
├── core/                                  # 🏢 Services for core domain
│   ├── companyService.ts                  # Company & Department logic
│   ├── employeeService.ts                 # Employee management
│   └── gradeService.ts                    # Grade utilities
│
├── operations/                            # 📋 Services for operations
│   ├── processService.ts                  # Process management
│   └── taskAssignmentService.ts           # Task execution & tracking
│
├── analytics/                             # 📊 Services for analytics
│   ├── loadSnapshotService.ts             # Load calculations
│   └── gapAnalysisService.ts              # Hiring recommendations
│
├── audit/                                 # 📝 Services for audit
│   ├── employeeHistoryService.ts          # Change tracking
│   └── auditLogService.ts                 # Audit trail
│
└── auth/                                  # 🔐 Auth services
    └── authService.ts
```

**Benefits:**

- ✅ Clear 1:1 mapping between models and services
- ✅ Easy to locate logic for a specific domain
- ✅ Scalable structure as features grow
- ✅ Makes GraphQL resolver organization intuitive

---

## Validation Status

✅ **Schema Validation:** PASSED

```
The schemas at server/db/prisma are valid 🚀
```

✅ **Migration Status:** UP TO DATE

```
Database schema is up to date!
```

✅ **Prisma Client:** GENERATED (v7.4.0)

```
Generated Prisma Client to ./server/db/generated/prisma in 178ms
```

---

## Model Organization by Domain

### 🏢 CORE DOMAIN (`/models/core/`)

**Purpose:** Organizational structure and master data

**Models:**

- `Company` - Root entity (1 per deployment)
- `Department` - Organizational units (1:N with Company)
- `Employee` - Team members (1:N with Department)
- `Grade` - Seniority levels (reference data)

**File Count:** 3 files

- `company.prisma` - Company, Department
- `employee.prisma` - Employee
- `grade.prisma` - Grade

**Typical Service Methods:**

```typescript
// companyService.ts
-getCompany(id) -
  listCompanies() -
  createCompany(data) -
  updateCompany(id, data) -
  // employeeService.ts
  getEmployee(id) -
  listEmployees(departmentId) -
  createEmployee(data) -
  updateEmployee(id, data) -
  getEmployeeLoadIndex(id, period);
```

---

### 📋 OPERATIONS DOMAIN (`/models/operations/`)

**Purpose:** Workload and task management

**Models:**

- `Process` - Business processes with complexity multipliers
- `TaskAssignment` - Task-to-employee assignments

**File Count:** 2 files

- `process.prisma` - Process
- `task-assignment.prisma` - TaskAssignment

**Typical Service Methods:**

```typescript
// processService.ts
-getProcess(id) -
  createProcess(data) -
  updateProcess(id, data) -
  listProcessesByDepartment(deptId) -
  // taskAssignmentService.ts
  assignTask(employeeId, processId, plannedHours) -
  updateTaskProgress(id, actualHours) -
  getEmployeeTasks(employeeId, period) -
  calculateTaskLoad(processData, executorGrade);
```

---

### 📊 ANALYTICS DOMAIN (`/models/analytics/`)

**Purpose:** Load metrics and capacity planning

**Models:**

- `LoadSnapshot` - Historical metrics for employee/department
- `GapAnalysisResult` - Capacity deficit analysis
- `HiringRequest` - Hiring workflow

**File Count:** 2 files

- `load-snapshot.prisma` - LoadSnapshot
- `gap-analysis.prisma` - GapAnalysisResult, HiringRequest

**Typical Service Methods:**

```typescript
// loadSnapshotService.ts
-createLoadSnapshot(companyId, employeeId, period, metrics) -
  getLatestSnapshot(employeeId, period) -
  listDepartmentSnapshots(departmentId) -
  calculateLoadIndex(totalLoad, capacity) -
  // gapAnalysisService.ts
  analyzeGap(departmentId, period) -
  getHiringRecommendations(departmentId) -
  createHiringRequest(data) -
  updateHiringStatus(id, status);
```

---

### 📝 AUDIT DOMAIN (`/models/audit/`)

**Purpose:** Compliance and change tracking

**Models:**

- `EmployeeHistory` - Field-level employee changes
- `AuditLog` - Entity-level changes (CREATE, UPDATE, DELETE)

**File Count:** 1 file

- `audit.prisma` - EmployeeHistory, AuditLog

**Typical Service Methods:**

```typescript
// employeeHistoryService.ts
-trackChange(employeeId, fieldName, oldValue, newValue, changedBy) -
  getChangeHistory(employeeId) -
  getFieldHistory(employeeId, fieldName) -
  // auditLogService.ts
  logAction(entityType, entityId, action, oldValues, newValues, changedBy) -
  getAuditTrail(companyId, period) -
  getEntityAuditLog(entityType, entityId);
```

---

### 🔐 AUTH DOMAIN (`/models/auth/`)

**Purpose:** User authentication and sessions (from better-auth)

**Models:**

- `User`, `Session`, `Account`, `Verification`, etc.

**File Count:** 1 file

- `better-auth.prisma`

---

## How Prisma Loads These Files

1. **Config reads schema folder:**

   ```
   schema: "./server/db/prisma/"
   ```

2. **Prisma discovers all .prisma files:**

   ```
   - schema.prisma (root config)
   - models/core/*.prisma
   - models/operations/*.prisma
   - models/analytics/*.prisma
   - models/audit/*.prisma
   - models/auth/*.prisma
   ```

3. **Combines all definitions into single schema:**
   - All models, enums, relations are merged
   - Validation happens on complete schema
   - A single Prisma Client is generated

4. **Generated Client includes all models:**

   ```typescript
   import { PrismaClient } from './db/generated/prisma';
   const prisma = new PrismaClient();

   // Access any model from any domain
   await prisma.company.findUnique(...);
   await prisma.employee.findMany(...);
   await prisma.process.create(...);
   await prisma.loadSnapshot.aggregate(...);
   ```

---

## Workflow for Adding New Models

1. **Identify the domain** (core, operations, analytics, audit)

2. **Create/update the appropriate .prisma file:**

   ```bash
   # Example: Adding new core model
   server/db/prisma/models/core/new-model.prisma
   ```

3. **Define your model with full documentation:**

   ```prisma
   /// Clear description of what this model represents
   model NewModel {
     id        String    @id @default(cuid())
     // ... fields
   }
   ```

4. **Create migration:**

   ```bash
   npx prisma migrate dev --name "add_new_model"
   ```

5. **Generated Client updates automatically**

6. **Create matching service:**
   ```bash
   server/services/core/newModelService.ts
   ```

---

## Quick Commands

```bash
# Validate schema (no DB changes)
npx prisma validate

# Check migration status
npx prisma migrate status

# Create new migration from schema changes
npx prisma migrate dev --name "your_change_name"

# Regenerate Prisma Client
npx prisma generate

# Reset database (DEV ONLY!)
npx prisma migrate reset --force

# Open Prisma Studio (DB viewer)
npx prisma studio
```

---

## Key Advantages of This Structure

✅ **Modularity:** Each domain is independent
✅ **Scalability:** Easy to add new models in existing domains
✅ **Maintainability:** Find related code easily
✅ **Service Mapping:** Services mirror model organization
✅ **Team Collaboration:** Clear domain ownership boundaries
✅ **Documentation:** Each file has clear purpose
✅ **Version Control:** Easier to review domain-specific changes
✅ **GraphQL Organization:** Aligns with schema federation

---

## Migration History

```
server/db/prisma/migrations/
└── 20260224140838_init_multi_schema_setup/
    └── migration.sql    (11 tables, 50+ indexes)
```

**Current Status:** All schema changes have been applied to the database.
**Database Version:** PostgreSQL at db.prisma.io

---

## Next Steps

1. ✅ Schema organized into modules
2. ✅ All validations passing
3. 📋 Create service layer with matching structure
4. 🚀 Build GraphQL resolvers with field organization
5. 🔌 Connect to existing authentication system
6. 📚 Seed database with initial data

Ready to create services! 🎯
