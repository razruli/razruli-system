# Razruli Codebase: Comprehensive Data & AI Analysis

## 1. PRISMA DATA MODEL

### Core Domain Models

#### **Company** (`models/core/company.prisma`)

Root entity for multi-tenant support

```
Fields:
- id: String (CUID)
- name: VarChar(255) - company name
- timezone: VarChar(50) - default "UTC+3"
- workingHoursDay: Int - default 8
- workingDaysPerMonth: Int - default 21
- createdAt, updatedAt: DateTime

Relations:
- employees: Employee[] (1:N)
- departments: Department[] (1:N)
- processes: Process[] (1:N)
- taskAssignments: TaskAssignment[] (1:N)
- loadSnapshots: LoadSnapshot[] (1:N)
- actors: Actor[] (1:N)
- roles: Role[] (1:N)
```

#### **Department** (`models/core/company.prisma`)

Organizational units within companies

```
Fields:
- id: String (CUID)
- companyId: String (FK → Company)
- name: VarChar(255)
- headId: String? (FK → Employee, unique)
- createdAt, updatedAt: DateTime

Unique Constraint: (companyId, name)

Relations:
- company: Company (N:1)
- head: Employee? (1:1, optional)
- employees: Employee[] (1:N)
- processes: Process[] (1:N)
- taskAssignments: TaskAssignment[] (1:N)
- loadSnapshots: LoadSnapshot[] (1:N)
- actors: Actor[] (1:N)
```

#### **Grade** (`models/core/grade.prisma`)

Employee seniority levels with capacity multipliers

```
Fields:
- id: Int (PK)
- name: VarChar(100) - unique (e.g., Intern, Junior, Middle, Senior, Lead, C-level)
- kGrade: DoublePrecision - capacity multiplier
- description: Text?

Standard Grades:
- 0: Intern (k=0.4)
- 1: Junior (k=0.6)
- 2: Middle (k=0.9)
- 3: Senior (k=1.2)
- 4: Lead (k=1.5)
- 5: C-level (k=1.7)

Relations:
- employees: Employee[] (1:N)
- processes: Process[] (1:N)
```

#### **Employee** (`models/core/employee.prisma`)

Core workforce data with capacity coefficients

```
Fields:
- id: String (CUID)
- companyId: String (FK → Company)
- departmentId: String (FK → Department)
- firstName, lastName: VarChar(255)
- gradeId: Int (FK → Grade)
- gender: Enum (MALE, FEMALE, OTHER) - default OTHER
- birthDate: DateTime?
- hireDate: DateTime (required)
- fireDate: DateTime?
- kEfficiency: DoublePrecision - default 1.0
- workingHoursPerDay: Int - default 8
- employmentType: Enum (LABOR_CONTRACT, SERVICE_CONTRACT, SELF_EMPLOYED)
- status: Enum (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED) - default ACTIVE
- metadata: JSON - default "{}"
- createdAt, updatedAt: DateTime

Unique Constraint: (companyId, firstName, lastName)

Capacity Formula:
P_day = 1.0 * K_grade * K_gen * K_age * K_tenure * K_efficiency

Relations:
- company: Company (N:1)
- department: Department (N:1)
- grade: Grade (N:1)
- managedDepartment: Department? (managed as head)
- taskAssignments: TaskAssignment[] (1:N)
- loadSnapshots: LoadSnapshot[] (1:N)
- history: EmployeeHistory[] (1:N)
```

#### **Process** (`models/operations/process.prisma`)

Business processes with workload consumption

```
Fields:
- id: String (CUID)
- companyId: String (FK → Company)
- departmentId: String (FK → Department)
- title: VarChar(255)
- description: Text?
- plannedHours: Int
- kBurn: DoublePrecision - burn factor (default 0.0)
- kCrit: DoublePrecision - criticality factor (default 0.0)
- kNew: DoublePrecision - newness factor (default 0.0)
- targetGradeId: Int (FK → Grade)
- status: VarChar(50) - default "open"
- priority: VarChar(50) - default "medium"
- createdAt, updatedAt: DateTime

Workload Formula:
L = (T_hours / 8) * (1 + K_burn + K_crit + K_new) * K_diff

Relations:
- company: Company (N:1)
- department: Department (N:1)
- targetGrade: Grade (N:1)
- taskAssignments: TaskAssignment[] (1:N)
```

#### **TaskAssignment** (`models/operations/task-assignment.prisma`)

Employee task assignments with time and load tracking

```
Fields:
- id: String (CUID)
- companyId, departmentId, employeeId, processId: String (FKs)
- plannedHours: Float
- actualHours: Float?
- calculatedLoad: Float? - in Capacity Units
- status: VarChar(50) - default "pending" (pending, completed, etc.)
- startedAt, completedAt: DateTime?
- metadata: JSON - default "{}"
- createdAt, updatedAt: DateTime

Relations:
- company: Company (N:1)
- department: Department (N:1)
- employee: Employee (N:1)
- process: Process (N:1)
```

#### **LoadSnapshot** (`models/analytics/load-snapshot.prisma`)

Calculated load metrics by period

```
Fields:
- id: String (CUID)
- companyId: String (FK → Company)
- employeeId: String? (FK → Employee, exclusive)
- departmentId: String? (FK → Department, exclusive)
- periodStart, periodEnd: DateTime
- loadIndex: DoublePrecision - normalized load
- totalLoadCU: DoublePrecision - total capacity units
- totalCapacityCU: DoublePrecision - available capacity
- percentUsed: DoublePrecision - percentage (0-100+)
- employeeStatus: VarChar(50)? - for employee snapshots
- workingDays: Int? - for employee snapshots
- activeEmployeeCount: Int? - for department snapshots
- overloadedCount: Int? - for department snapshots
- calculatedAt: DateTime - default now()

Unique Constraints:
- (companyId, employeeId, periodStart, periodEnd)
- (companyId, departmentId, periodStart, periodEnd)

Load Index Formulas:
- Employee: I_ind = Σ(L_tasks) / P_month
- Department: I_dept = Σ(L_all) / Σ(P_month)

Relations:
- company: Company (N:1)
- employee: Employee? (N:1)
- department: Department? (N:1)
```

#### **GapAnalysisResult** (`models/analytics/gap-analysis.prisma`)

Gap analysis results with hiring recommendations

```
Fields:
- id: String (CUID)
- companyId, departmentId: String
- analysisType: VarChar(100)
- currentLoadIndex: DoublePrecision
- requiredLoadIndex: DoublePrecision - default 1.0
- deficitCU: DoublePrecision
- recommendedGrade: VarChar(100)
- recommendedCount: Int - hiring headcount recommendation
- recommendations: Text? - text recommendations
- createdAt: DateTime

Relations:
- company: Company (implicit)
- department: Department (implicit)
```

#### **HiringRequest** (`models/analytics/gap-analysis.prisma`)

Hiring workflow for staffing decisions

```
Fields:
- id: String (CUID)
- companyId, departmentId?: String
- position: VarChar(255)
- gradeId: Int
- candidatesNeeded: Int
- experienceYears: Int
- experienceJustification: Text?
- salaryMin, salaryMax: Int
- interviewStages: Int - default 2
- trialPeriodMonths: Int - default 3
- kpiTrial, kpiPermanent: Text?
- trigger: VarChar(50) - reason for hiring
- status: VarChar(50) - default "draft" (draft, open, closed)
- createdAt, updatedAt: DateTime

Status Values: draft, open, closed, cancelled
```

### Authentication & Authorization Models

#### **User** (`models/auth/better-auth.prisma`)

Authentication model (better-auth managed)

```
Fields:
- id: String (PK)
- name, email: String
- emailVerified: Boolean - default false
- image: String?
- createdAt, updatedAt: DateTime

Relations:
- sessions: Session[]
- accounts: Account[]
- actor: Actor? (1:1 optional - business identity)
```

#### **Actor** (`models/auth/actor.prisma`)

Business entity identity (separate from User)

```
Fields:
- id: String (CUID)
- userId: String (FK → User, unique)
- name, email: String
- avatar, phone, bio: String?
- companyId: String (FK → Company)
- departmentId: String? (FK → Department)
- status: Enum (ACTIVE, INACTIVE) - default ACTIVE
- metadata: JSON?
- lastLoginAt, lastActivityAt: DateTime?
- createdAt, updatedAt: DateTime

Relations:
- user: User (1:1)
- company: Company (N:1)
- department: Department? (N:1)
- roles: ActorRole[] (N:N via ActorRole)
- permissions: ActorPermission[] (N:N)
- auditLogsCreated: AuditLog[] (1:N)
- employeeHistoryCreated, employeeHistoryApproved: EmployeeHistory[]
```

#### **Role & Permission** (`models/auth/actor.prisma`)

Authorization models

```
Role:
- id, name, slug: String (unique)
- description: String?
- scope: Enum (SYSTEM, COMPANY) - default SYSTEM
- companyId: String? (null = system role)

Permission:
- id, name, slug: String (unique)
- description: String?
- resource: String (e.g., "employee", "process", "company")
- action: String (e.g., "read", "create", "update", "delete", "approve")
- scope: Enum (SYSTEM, COMPANY)

ActorRole: (N:N junction with timestamps)
- actorId, roleId, assignedAt, expiresAt
- assignedBy, reason

ActorPermission: (N:N junction)
- actorId, permissionId
```

### Audit Models

#### **EmployeeHistory** (`models/audit/audit.prisma`)

Historical record of employee changes

```
Fields:
- id: String (CUID)
- employeeId: String (FK → Employee)
- fieldName: VarChar(100)
- oldValue, newValue: Text?
- changedById: String? (FK → Actor)
- approvedById: String? (FK → Actor)
- changedAt: DateTime - default now()
- reason: Text?

Relations:
- employee: Employee (N:1)
- changedBy: Actor? (N:1)
- approvedBy: Actor? (N:1)
```

#### **AuditLog** (`models/audit/audit.prisma`)

Comprehensive audit trail for all entities

```
Fields:
- id: String (CUID)
- companyId: String
- entityType: VarChar(100) - type of entity changed
- entityId: String - ID of entity
- action: VarChar(50) - CREATE, READ, UPDATE, DELETE
- oldValues, newValues: JSON
- createdById: String (FK → Actor)
- changedAt: DateTime - default now()

Relations:
- createdBy: Actor (N:1)
```

---

## 2. /API/AI/ANALYZE ENDPOINT

### Location

`[app/api/ai/analyze/route.ts](app/api/ai/analyze/route.ts)`

### Request Structure

```typescript
interface AnalysisRequest {
  type:
    | "hiring-gap"
    | "data-insights"
    | "capacity-analysis"
    | "workforce-summary";
  context?: Record<string, unknown>; // Data to analyze
  userId?: string; // Required - user making request
}
```

### Endpoint Details

- **Method**: POST
- **Runtime**: Node.js (edge runtime)
- **Max Duration**: 60 seconds
- **Response**: Server-Sent Events (streaming text)

### Analysis Types & Prompts

#### 1. **hiring-gap**

- **System Prompt**: HR consultant perspective
- **Focus**: Hiring gaps, skill requirements, recruitment strategy
- **Input**: Context with current/required employee data
- **Output**: Actionable recommendations with priority levels (High/Medium/Low)

#### 2. **data-insights**

- **System Prompt**: Workforce analytics expert
- **Focus**: Patterns, trends, anomalies in employee/departmental data
- **Input**: Context with employee distribution, workload patterns
- **Output**: Context-aware organizational improvement recommendations

#### 3. **capacity-analysis**

- **System Prompt**: Capacity planning specialist
- **Focus**: Workload distribution, utilization rates, resource allocation
- **Input**: Context with load data, employee capacity
- **Output**: Bottleneck identification and load balancing recommendations

#### 4. **workforce-summary**

- **System Prompt**: Workforce analyst
- **Focus**: Composition, key metrics, trends, statistics
- **Input**: Context with workforce data
- **Output**: Comprehensive yet concise summaries with business implications

### Endpoint Logic Flow

```
1. Extract userId and analysis type from request
2. Lookup Actor by userId → get Company context
3. Fallback to generic context if actor not found
4. Build system prompt based on analysis type
5. Build user message with context data (JSON stringified)
6. Get AI model from model-provider (Groq)
7. Stream text response using streamText()
8. Return text stream response to client
```

### Data Flow

```
Client Request
    ↓
POST /api/ai/analyze { type, context, userId }
    ↓
Lookup: Actor.userId → Company
    ↓
Build System Prompt (role-specific)
    ↓
Build User Message with context
    ↓
Get Model: Groq llama-3.1-8b-instant
    ↓
streamText(model, system, messages)
    ↓
toTextStreamResponse()
    ↓
Client receives streaming text
```

---

## 3. CURRENT AI CAPABILITIES

### AI Model Configuration

- **Provider**: Groq
- **Model**: `llama-3.1-8b-instant`
- **Type**: Open-source LLM (Meta Llama 3.1)
- **Size**: 8B parameters (lightweight, fast)
- **Temperature**: 0.7 (balanced creativity/consistency)

### Model Features

✅ Text generation and analysis
✅ JSON parsing
✅ Multi-turn conversation (via messages array)
✅ Streaming support
✅ No credit card required (free tier available)

### Capabilities by Analysis Type

1. **Hiring Analysis**: Gap identification, grade recommendations, hiring strategy
2. **Data Insights**: Pattern recognition, trend analysis, anomaly detection
3. **Capacity Analysis**: Load balancing, bottleneck identification, optimization
4. **Workforce Summary**: Statistical aggregation, composition analysis, metric tracking

### Limitations

- Context data passed as JSON string (no structured parsing)
- No direct database queries from AI
- No file/artifact generation (text response only)
- Single-turn analysis (no multi-step iterative analysis)
- No real-time data updates (static analysis)

---

## 4. ARTIFACTS & INSIGHTS STRUCTURE

### Artifact Model

Location: [entities/ai-assistant/artifact/model/types.ts](entities/ai-assistant/artifact/model/types.ts)

```typescript
export type ArtifactType =
  | "workload-analysis"
  | "hiring-recommendations"
  | "team-comparison"
  | "report";

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  generatedAt: Date;
}
```

**Current Implementation**:

- No Prisma model for persistence
- In-memory client-side type definition
- No API endpoints for CRUD operations
- Design is prepared but not yet implemented in database

### Insight/InsightQuery Model

Location: [entities/ai-assistant/insight-query/model/types.ts](entities/ai-assistant/insight-query/model/types.ts)

```typescript
export type InsightType =
  | "hiring-gap"
  | "data-insights"
  | "capacity-analysis"
  | "workforce-summary";
export type InsightStatus = "pending" | "loading" | "success" | "error";

export interface InsightQuery {
  id: string;
  type: InsightType;
  context?: Record<string, unknown>;
  title?: string;
  status: InsightStatus;
  result?: string;
  error?: string;
  createdAt: Date;
}
```

**Current Implementation**:

- No Prisma model for persistence
- Client-side type definition only
- Status tracking: pending → loading → success/error
- Context passed at query time

### ChatMessage Model

Location: [entities/ai-assistant/chat-message/model/types.ts](entities/ai-assistant/chat-message/model/types.ts)

```typescript
// Type definitions exist but no Prisma persistence model
```

---

## 5. GRAPHQL QUERIES & RESOLVERS FOR DATA FETCHING

### Data Fetching Architecture

- **Pattern**: FSD (Feature-Sliced Design) with domain-based services
- **Services**: Layer between resolvers and database
- **DataLoaders**: Batching to prevent N+1 queries
- **Caching**: In-memory cache in services

### Core Data Queries Available

#### **Company Queries**

```graphql
# Get company by ID
company(id: String!): Company

# Get authenticated user's company
myCompany: Company

# Get all companies (admin only)
companies: [Company]

# Company-wide load analysis
companyLoadAnalysis(companyId: String!): CompanyLoadAnalysis

# Process metrics across company
companyProcessMetrics(companyId: String!): [ProcessMetrics]

# Compliance report
complianceReport(companyId: String!, dateRange: DateRangeInput!): ComplianceReport

# Data access audit
dataAccessAudit(companyId: String!): [AuditLog]
```

#### **Department Queries**

```graphql
# Get department by ID
department(id: String!): Department

# Get all departments
departments(filter: DepartmentFilterInput!): DepartmentListResponse

# Department with metrics
departmentWithMetrics(id: String!): DepartmentMetrics

# Department employees
departmentEmployees(departmentId: String!): [Employee]

# Department workload overview
departmentLoadOverview(departmentId: String!): DepartmentLoadOverview

# Department processes
departmentProcesses(departmentId: String!): [Process]

# Load snapshots by department
departmentSnapshots(departmentId: String!): [LoadSnapshot]

# Department employee history
departmentEmployeeHistory(departmentId: String!, dateRange: DateRangeInput!): DepartmentEmployeeHistory

# Compare gaps across departments
departmentGapComparison(companyId: String!): [DepartmentGapComparison]
```

#### **Employee Queries**

```graphql
# Get employee by ID
employee(id: String!): Employee

# Get all employees
employees(filter: EmployeeFilterInput!): EmployeeConnection

# Department employees
departmentEmployees(departmentId: String!): [Employee]

# Employee capacity
employeeCapacity(id: String!): Float

# Employee load index
employeeLoadIndex(id: String!): Float

# Employee tasks
employeeTasks(id: String!): [TaskAssignment]

# Employee task statistics
employeeTaskStats(id: String!): EmployeeTaskStats

# Employee load trend
employeeLoadTrend(employeeId: String!, dateRange: DateRangeInput!): [LoadSnapshot]

# Employee timeline/history
employeeTimeline(employeeId: String!): [EmployeeTimelineEntry]

# Employee audit report
employeeAuditReport(employeeId: String!, dateRange: DateRangeInput!): EmployeeAuditReport

# Employee history entries
employeeHistory(employeeId: String!): EmployeeHistoryConnection
```

#### **Load & Capacity Queries**

```graphql
# Load snapshots
departmentSnapshots(departmentId: String!): [LoadSnapshot]

# Employee load breakdown
employeeLoadBreakdown(employeeId: String!, period: DateRangeInput!): EmployeeLoadBreakdown

# Department load metrics
departmentMetrics: DepartmentMetrics

# Company-wide load analysis
companyLoadAnalysis(companyId: String!): CompanyLoadAnalysis
  # Returns: company, departmentMetrics[]

# Snapshot data structure:
# - loadIndex: Float
# - totalLoadCU: Float
# - totalCapacityCU: Float
# - percentUsed: Float
# - employeeStatus?: String
# - activeEmployeeCount?: Int
# - overloadedCount?: Int
```

#### **Gap Analysis Queries**

```graphql
# Get single gap analysis
gapAnalysis(id: String!): GapAnalysis

# List gap analyses
gapAnalyses(filter?: GapAnalysisFilter, pagination?: PaginationInput): GapAnalysisConnection

# Gap analysis trend
gapAnalysisTrend(companyId: String!, dateRange: DateRangeInput!): [GapAnalysis]

# Compare gaps across departments
departmentGapComparison(companyId: String!): [DepartmentGapComparison]

# GapAnalysis fields:
# - id, companyId, departmentId
# - analysisDate, forecastPeriodMonths, startDate, endDate
# - currentEmployeeCount, currentTotalCapacity, currentUtilizationRate
# - forecastedWorkloadUnits, requiredEmployeeCount, requiredTotalCapacity
# - capacityGap, headcountGap
# - gapStatus (SURPLUS, BALANCED, MINOR_GAP, MODERATE_GAP, CRITICAL_GAP)
# - riskLevel (LOW, MEDIUM, HIGH, CRITICAL)
# - hiringPlan, recommendations[]
# - forecastAccuracy, confidenceLevel
```

#### **Process & Task Queries**

```graphql
# Department processes
departmentProcesses(departmentId: String!): [Process]

# Process metrics
companyProcessMetrics(companyId: String!): [ProcessMetrics]

# Employee tasks
employeeTasks(employeeId: String!): [TaskAssignment]

# Employee task stats
employeeTaskStats(employeeId: String!): EmployeeTaskStats
  # Returns: totalTasks, assignedCount, completedCount, overdueTasks,
  # totalPlannedHours, totalActualHours, avgLoadPerTask
```

### Core Services Available

#### **CompanyService**

- `getById(id)` - get company by ID with cache
- `getAll()` - get all companies
- `find(filters?, pagination?)` - search and paginate companies
- `create(data)` - create company

#### **DepartmentService**

- `getById(id)` - get department
- `getByDepartment(departmentId)` - get employees in department
- `find(filters?, pagination?)` - list departments
- `create(data)` - create department

#### **EmployeeService**

- `getById(id)` - get employee
- `getByDepartment(departmentId)` - get employees in department
- `find(filters?, pagination?)` - list employees
- `create(data)` - create employee
- `getHistory(employeeId)` - get employee change history

#### **LoadSnapshotService**

- `getById(id)` - get snapshot
- `findByEmployee(employeeId, period)` - get employee load history
- `findByDepartment(departmentId, period)` - get department load history
- `find(filters?, pagination?)` - list snapshots
- `calculate()` - calculate new snapshots

#### **GapAnalysisService**

- `getById(id)` - get analysis
- `find(filters?, pagination?)` - list analyses
- `getByDepartment(departmentId)` - analyses for department
- `create(data)` - create analysis

---

## 6. DATA CURRENTLY BEING SENT TO AI vs. AVAILABLE

### What IS Currently Sent to AI

```typescript
// From client to /api/ai/analyze endpoint
{
  type: "hiring-gap" | "data-insights" | "capacity-analysis" | "workforce-summary",
  context: {
    // Arbitrary Record<string, unknown> - whatever client passes
    // Example could include:
    // - Department details
    // - Employee list with basic info
    // - Current load metrics
  },
  userId: "actor_id"
}
```

**Current Pattern**: Context is completely client-driven. The endpoint does NOT query data itself—it relies on the client to prepare and send the analysis context.

### What IS Available in Database (But NOT Being Sent)

1. **Employee Detailed Data**:
   - ✅ Birth date, hire date, fire date
   - ✅ Employment type (LABOR_CONTRACT, SERVICE_CONTRACT, SELF_EMPLOYED)
   - ✅ Grade with capacity multiplier (kGrade)
   - ✅ Efficiency coefficient (kEfficiency)
   - ✅ Employment status (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)
   - ✅ Working hours per day
   - ✅ Custom metadata (JSON)

2. **Workload & Load Data**:
   - ✅ LoadSnapshot: historical load indices per employee/department
   - ✅ Process: planned hours, burn/criticality/newness factors
   - ✅ TaskAssignment: actual vs planned hours, calculated load
   - ✅ Department total capacity and load calculations

3. **Historical & Audit Data**:
   - ✅ EmployeeHistory: all changes to employee records
   - ✅ AuditLog: all CRUD operations with old/new values
   - ✅ Change tracking by Actor with timestamps

4. **Gap Analysis Data**:
   - ✅ GapAnalysisResult: previous analyses with recommendations
   - ✅ HiringRequest: open hiring requests with details
   - ✅ Hiring forecast data and metrics

5. **Organizational Data**:
   - ✅ Department hierarchy
   - ✅ Actor/permission model
   - ✅ Company timezone and working hours configuration

### Gap Between Available & Sent

**CRITICAL**: The `/api/ai/analyze` endpoint is a **generic streaming endpoint** that only receives whatever context the client provides. It does NOT:

- Query the database directly
- Apply domain-specific filters
- Fetch related entities automatically
- Aggregate metrics
- Calculate current state

**Responsibility is on client** to:

1. Query relevant data via GraphQL
2. Aggregate/format it appropriately
3. Send formatted context to `/api/ai/analyze`
4. Display streamed response to user

---

## 7. ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
│                                                               │
│  Company ─→ Department ─→ Employee                           │
│      ↓            ↓            ↓                             │
│   Process    TaskAssignment  LoadSnapshot                    │
│      ↓            ↓            ↓                             │
│  GapAnalysis  EmployeeHistory  AuditLog                     │
└─────────────────────────────────────────────────────────────┘
                           ↑
                ┌──────────┴────────────┐
                ↓                       ↓
         GraphQL Server          API Routes
         (Apollo Server)         (Next.js)
              │                       │
      ┌───────┼───────┐          ┌────┴─────┐
      ↓       ↓       ↓          ↓          ↓
   Query  Mutation Subscription /api/auth /api/ai/analyze
      │       │       │                         │
      └───────┴───────┘                        │
            ↓                                   ↓
      Resolvers with Services          Model Provider
           │                                (Groq)
           ↓
      DataLoaders & Cache
           │
           ↓
      Prisma Client
```

### Key Architectural Patterns

1. **Domain-Driven Services**: Separate services for Company, Department, Employee, etc.
2. **GraphQL Resolvers**: Query/Mutation/Field resolvers per domain
3. **DataLoaders**: Batch query optimization to prevent N+1 problems
4. **Authorization**: Actor/Role/Permission model for multi-tenant access control
5. **Audit Trail**: All changes tracked via AuditLog and EmployeeHistory
6. **Cache Layer**: In-memory caching at service level
7. **FSD Architecture**: Feature-Sliced Design for organized code structure
