# GraphQL Implementation Checklist

**Last Updated:** February 27, 2026

---

## CORE DOMAIN - Implementation Checklist

### Company

- [ ] **Query:** `myCompany()` → `Company` _Missing in resolver_
- [ ] **Mutation:** Fix `CreateCompanyInput` parameters
  - [ ] Add `timezone`, `workingHoursDay`, `workingDaysPerMonth` support
  - [ ] Remove or map `description`, `industry`, `country`, `city`, `address`
- [ ] **Mutation:** Remove `deleteCompany` if not in schema, or add to schema if needed

**Priority:** 🟡 MEDIUM | **Est. Hours:** 2-3

---

### Department

- [ ] **Query:** `departmentWithMetrics(id, periodStart?, periodEnd?)` → `DepartmentMetrics` _Missing_
- [ ] **Mutation:** `assignDepartmentHead(departmentId, employeeId)` → `Department` _Missing_
- [ ] **Query:** Remove `companyDepartments` or add to schema
- [ ] **Mutation:** Fix `CreateDepartmentInput` parameters
  - [ ] Map `managerId` → `headId` (use schema field name)
  - [ ] Decide on extra fields: `description`, `budget`, `headcount`

**Priority:** 🟡 MEDIUM | **Est. Hours:** 4-5

---

### Employee

- [ ] **Mutation:** `updateEmployeeEfficiency(id, kEfficiency)` → `Employee` _Missing_

**Priority:** 🟡 MEDIUM | **Est. Hours:** 1

---

### Grade

- [ ] **Query:** `gradeWithStats(id)` → `GradeStats` _Missing_
  - [ ] Returns grade with employeeCount, averageEfficiency, overloadedCount
- [ ] **Query:** Remove `companyGrades` or add to schema

**Priority:** 🟡 MEDIUM | **Est. Hours:** 2

---

### CORE DOMAIN TOTALS

- Queries to implement: 2
- Mutations to implement: 2
- Parameter fixes: 3
- **Total estimated hours: 9-11**

---

## OPERATIONS DOMAIN - Implementation Checklist

### Process

#### Queries to Implement

- [ ] **Query:** `departmentProcesses(departmentId, status?)` → `[Process!]!`
  - Filter processes by department, optionally by status
- [ ] **Query:** `processWithMetrics(id)` → `ProcessMetrics`
  - Returns process with totalCapacityRequired, utilizationRate, etc.
- [ ] **Query:** `companyProcessMetrics(companyId, filter?)` → `[ProcessMetrics!]!`
  - Returns metrics for all company processes

#### Mutations to Implement

- [ ] **Mutation:** `startProcess(id)` → `Process!`
  - Transition process from PILOT/DRAFT to IN_PROGRESS
- [ ] **Mutation:** `completeProcess(id)` → `Process!`
  - Transition process to COMPLETED, trigger cleanup
- [ ] **Mutation:** `cancelProcess(id, reason?)` → `Process!`
  - Transition to CANCELLED with optional reason
- [ ] **Mutation:** `assignProcessCapacity(processId, capacityUnits, kMultiplier)` → `Process!`
  - Update capacity allocation for a process

#### Parameter Fixes

- [ ] **ProcessFilterInput:** Add missing filter fields
  - [ ] `processType` (RECRUITMENT, ONBOARDING, etc.)
  - [ ] `priority` (CRITICAL, HIGH, NORMAL, LOW)

**Priority:** 🔴 CRITICAL | **Est. Hours:** 8-10

---

### TaskAssignment

#### Queries to Implement

- [ ] **Query:** `processTasks(processId, status?)` → `[TaskAssignment!]!`
  - List all tasks in a process
- [ ] **Query:** `employeeTaskStats(employeeId)` → `EmployeeTaskStats!`
  - Returns totalAssignments, activeAssignments, blockedAssignments, tasksByStatus, tasksByType
- [ ] **Query:** `overdueTasks(departmentId?)` → `[TaskAssignment!]!`
  - Filter by dueDate < today
- [ ] **Query:** `blockedTasks(departmentId?)` → `[TaskAssignment!]!`
  - Filter by status = BLOCKED
- [ ] **Query:** `taskWithMetrics(id)` → `TaskAssignmentMetrics`
  - Returns assignment with workloadContribution, utilizationRate, onTrack, daysUntilDue

#### Query Naming Fixes

- [ ] Rename `employeeTaskAssignments` → `employeeTasks` (match schema)

#### Parameter Fixes

- [ ] **TaskAssignmentFilterInput:** Add missing fields
  - [ ] `taskType` (DEVELOPMENT, TESTING, DOCUMENTATION, etc.)
  - [ ] `isOverdue` (Boolean)
  - [ ] `isBlocked` (Boolean)

**Priority:** 🔴 CRITICAL | **Est. Hours:** 10-12

---

### OPERATIONS DOMAIN TOTALS

- Queries to implement: 5
- Mutations to implement: 4
- Naming fixes: 1
- Parameter fixes: 2
- **Total estimated hours: 18-22**

---

## ANALYTICS DOMAIN - Implementation Checklist

### GapAnalysis

#### Queries to Implement

- [ ] **Query:** `latestCompanyGapAnalysis(companyId)` → `GapAnalysis`
  - Get most recent analysis for company
- [ ] **Query:** `latestDepartmentGapAnalysis(departmentId)` → `GapAnalysis`
  - Get most recent analysis for department
- [ ] **Query:** `gapAnalysisTrend(companyId, departmentId?, dateRange)` → `[GapTrend!]!`
  - Historical trend data for gap status over time
- [ ] **Query:** `departmentGapComparison(companyId)` → `[DepartmentGapComparison!]!`
  - Compare gaps across all departments
- [ ] **Query:** `hiringForecast(companyId)` → `HiringForecast`
  - Quarterly hiring projections from latest gap analysis
- [ ] **Query:** `gapCriticalityAssessment(companyId)` → `GapCriticalityAssessment!`
  - Critical departments, timeliness, immediate actions

#### Mutations to Implement

- [ ] **Mutation:** `generateHiringPlan(gapAnalysisId, phases?)` → `HiringPlan!`
  - Create hiring plan from gap analysis with phases
- [ ] **Mutation:** `updateHiringPlan(id, input: UpdateHiringPlanInput!)` → `HiringPlan!`
  - Update hiring plan targets, timeline, status
- [ ] **Mutation:** `approveHiringPlan(id, approvedBy)` → `HiringPlan!`
  - Approve plan for execution
- [ ] **Mutation:** `updateHiringProgress(hiringPlanId, actualHires, completedPhase?)` → `HiringPlan!`
  - Track hiring progress against plan

#### Parameter Fixes

- [ ] **CreateGapAnalysisInput:** Add missing fields
  - [ ] `forecastPeriodMonths` (Int!)
  - [ ] `forecastedWorkloadUnits` (Int!)
  - [ ] `startDate` (DateTime)
  - [ ] Remove `analysisDate` or map correctly

#### Cleanup

- [ ] Remove `deleteGapAnalysis` mutation unless needed

**Priority:** 🔴 CRITICAL | **Est. Hours:** 14-16

---

### LoadSnapshot

#### Queries to Implement

- [ ] **Query:** `latestEmployeeSnapshot(employeeId)` → `LoadSnapshot`
  - Most recent load snapshot for employee
- [ ] **Query:** `employeeLoadTrend(employeeId, dateRange)` → `EmployeeLoadHistory!`
  - Load trend with snapshots, averages, trend direction
- [ ] **Query:** `departmentLoadOverview(departmentId, snapshotDate?)` → `DepartmentLoadOverview!`
  - Department-wide load metrics and employee breakdown
- [ ] **Query:** `departmentSnapshots(departmentId, limit?)` → `[LoadSnapshot!]!`
  - Multiple snapshots for department
- [ ] **Query:** `companyLoadAnalysis(companyId, dateRange?)` → `CompanyLoadAnalysis!`
  - Company-wide analysis with metrics and recommendations
- [ ] **Query:** `loadAnomalies(companyId, threshold?)` → `[LoadSnapshot!]!`
  - Find employees with abnormal load patterns

#### Mutations to Review

- [ ] Verify `createLoadSnapshot` and `updateLoadSnapshot` are intentional
- [ ] Add to schema if needed, or move to internal-only

#### Parameter Fixes

- [ ] **LoadSnapshotFilterInput:** Add missing fields
  - [ ] `companyId` (String)
  - [ ] `departmentId` (String)
  - [ ] `loadStatus` (LoadStatus enum)
  - [ ] `snapshotType` (SnapshotType enum)
  - [ ] Map `dateRange` (currently dateFrom/dateTo)

**Priority:** 🔴 CRITICAL | **Est. Hours:** 12-14

---

### ANALYTICS DOMAIN TOTALS

- Queries to implement: 11
- Mutations to implement: 4
- Parameter fixes: 2
- **Total estimated hours: 26-30**

---

## AUDIT DOMAIN - Implementation Checklist

### AuditLog

#### Queries to Implement

- [ ] **Query:** `entityAuditTrail(entityType, entityId)` → `EntityAuditTrail!`
  - Full change timeline for entity
- [ ] **Query:** `userActivitySummary(userId, dateRange)` → `UserActivitySummary!`
  - User activity statistics and risk score
- [ ] **Query:** `complianceReport(companyId, dateRange)` → `ComplianceReport!`
  - Compliance metrics and high-risk activities
- [ ] **Query:** `securityIncidentReport(companyId, dateRange)` → `SecurityIncidentReport!`
  - Security incidents and prevention metrics
- [ ] **Query:** `suspiciousActivities(companyId, threshold?)` → `[AuditLog!]!`
  - Anomaly detection based on threshold
- [ ] **Query:** `failedLoginAttempts(dateRange?)` → `[AuditLog!]!`
  - Failed login audit trail
- [ ] **Query:** `dataAccessAudit(companyId, dateRange?)` → `[AuditLog!]!`
  - Data access and export tracking

#### Mutations to Implement

- [ ] **Mutation:** `logAuditEntry(input: LogAuditEntryInput!)` → `AuditLog!`
  - Core audit logging (might be internal, but schema needs it)
- [ ] **Mutation:** `bulkLogAuditEntries(entries: [LogAuditEntryInput!]!)` → `[AuditLog!]!`
  - Batch logging
- [ ] **Mutation:** `archiveAuditLogs(dateRange)` → `Int!`
  - Archive old logs
- [ ] **Mutation:** `exportAuditLogs(filter, format: ExportFormat!)` → `String!`
  - Export as CSV/JSON/PDF/XLSX

#### Cleanup

- [ ] Remove or replace `clearOldAuditLogs` with `archiveAuditLogs` if different

**Priority:** 🟠 HIGH | **Est. Hours:** 14-16

---

### EmployeeHistory

#### Queries to Implement

- [ ] **Query:** `employeeHistoryEntry(id)` → `EmployeeHistory`
  - Single history record
- [ ] **Query:** `employeeTimeline(employeeId, limit?)` → `[EmployeeTimelineEntry!]!`
  - Timeline visualization entries
- [ ] **Query:** `employeeAuditReport(employeeId, dateRange)` → `EmployeeAuditReport!`
  - Change summary and capacity impact
- [ ] **Query:** `departmentEmployeeHistory(departmentId, dateRange)` → `DepartmentEmployeeHistory!`
  - Department-wide movement and changes
- [ ] **Query:** `changesBy(userId, dateRange?)` → `[EmployeeHistory!]!`
  - All changes made by specific user
- [ ] **Query:** `unapprovedChanges(departmentId?)` → `[EmployeeHistory!]!`
  - Changes pending approval

#### Query Naming Fixes

- [ ] Standardize `employeeHistories` → `employeeHistory` (match schema)

#### Mutations to Implement

- [ ] **Mutation:** `recordEmployeeHistory(input: RecordEmployeeHistoryInput!)` → `EmployeeHistory!`
  - Record employee change
- [ ] **Mutation:** `approveEmployeeHistory(id)` → `EmployeeHistory!`
  - Approval workflow
- [ ] **Mutation:** `rejectEmployeeHistory(id, rejectionReason)` → `EmployeeHistory!`
  - Rejection workflow

#### Cleanup

- [ ] Remove or replace `clearOldEmployeeHistory` with archive pattern

**Priority:** 🟠 HIGH | **Est. Hours:** 12-14

---

### AUDIT DOMAIN TOTALS

- Queries to implement: 13
- Mutations to implement: 7
- Naming fixes: 1
- **Total estimated hours: 26-30**

---

## USER DOMAIN - Implementation Checklist

### User

#### Queries to Implement

- [ ] **Query:** `users(input: UsersInput!)` → `UsersResult!`
  - Currently commented out in resolver
  - Add back with full filtering support

**Priority:** 🟡 MEDIUM | **Est. Hours:** 2

---

### USER DOMAIN TOTALS

- Queries to implement: 1
- **Total estimated hours: 2**

---

## IMPLEMENTATION SUMMARY

### By Priority

**🔴 CRITICAL (Block shipping) - 33-44 hours**

- [ ] Process lifecycle (4 mutations)
- [ ] TaskAssignment queries (5 queries + 2 fixes)
- [ ] GapAnalysis complete (11 total items)
- [ ] LoadSnapshot complete (11 total items)

**🟠 HIGH (Must fix soon) - 26-30 hours**

- [ ] AuditLog reporting (7 queries + 4 mutations)
- [ ] EmployeeHistory records (7 queries + 3 mutations)

**🟡 MEDIUM (Nice to have) - 13-16 hours**

- [ ] Core domain enhancements (Company myCompany, Department metrics, Grade stats)
- [ ] User queries
- [ ] Parameter standardization across all domains

### Grand Total

- **Queries to implement:** 44
- **Mutations to implement:** 25
- **Naming fixes:** 2
- **Parameter mismatches:** 12
- **Estimated total hours:** 73-90 hours (~2-3 weeks for 1 developer)

### Recommended Phasing

**Week 1:** Process + TaskAssignment core fixes (18-22 hours)
**Week 2:** GapAnalysis + LoadSnapshot (26-30 hours)  
**Week 3:** AuditLog + EmployeeHistory (26-30 hours)
**Week 4:** Core domain + User + Testing & Integration (13-16 hours)

---

## File Locations

All implementation files are in: `/home/dictator/Desktop/razruli/server/graphql/resolvers/`

### By Domain Path

- **Core:** `resolvers/core/` (company/, department/, employee/, grade/)
- **Operations:** `resolvers/operations/` (process/, taskAssignment/)
- **Analytics:** `resolvers/analytics/` (gapAnalysis/, loadSnapshot/)
- **Audit:** `resolvers/audit/` (auditLog/, employeeHistory/)
- **User:** `resolvers/user/`
- **Schemas:** `schema/` (core/, operations/, analytics/, audit/, user/)

---

## Notes & Dependencies

1. **Service Layer:** Verify these services exist before implementing resolvers:
   - context.services.company
   - context.services.department
   - context.services.employee
   - context.services.grade
   - context.services.process
   - context.services.taskAssignment
   - context.services.gapAnalysis
   - context.services.loadSnapshot
   - context.services.auditLog
   - context.services.employeeHistory
   - context.services.userService

2. **Middleware:** All resolvers use `withMiddleware()` wrapper for:
   - requireAuth
   - requiredPermissions
   - requireRole

3. **Event Emitters:** TODOs indicate events should be emitted (commented out RabbitMQ/Redis)

4. **Parameter Validation:** Each resolver should validate input matches schema definition

5. **Transaction Handling:** Audit mutations should be transactional

---

## Testing Checklist

For each implementation:

- [ ] Unit test for resolver logic
- [ ] Integration test with service layer
- [ ] GraphQL query validation test
- [ ] Permission/auth middleware test
- [ ] Parameter validation test
- [ ] Return type validation test
