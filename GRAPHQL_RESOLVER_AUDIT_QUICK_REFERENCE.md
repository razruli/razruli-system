# GraphQL Resolver Audit - Quick Reference

## Critical Issues by Domain

### 🔴 CRITICAL - 12 Issues

#### Company

- ❌ Missing field resolvers: `processes`, `taskAssignments`, `loadSnapshots`

#### Department

- ❌ Field naming mismatch: `manager` → should be `head`
- ❌ Missing field resolvers: `processes`, `taskAssignments`, `loadSnapshots`
- ❌ Return type: `deleteDepartment` returns `Department!` not `Boolean!`

#### Grade

- ❌ `createGrade`, `updateGrade`, `deleteGrade` not in schema
- ❌ Return type: `deleteGrade` returns `Grade!` not `Boolean!`

#### Process

- ❌ Field naming: `tasks` → should be `taskAssignments`
- ❌ Return type: `deleteProcess` returns `Process!` not `Boolean!`
- ❌ Input validation: `createProcess` missing `departmentId`, `processType`, `capacityUnits`, `kMultiplier`
- ❌ Missing mutations: `startProcess`, `completeProcess`, `cancelProcess`, `assignProcessCapacity`

#### TaskAssignment

- ❌ Input mismatch: `deadline` → should be `dueDate`, `estimatedHours` → should be `effortHours`
- ❌ Input missing: `name`, `description`, `taskType`, `allocatedCapacityUnits`
- ❌ Missing mutations: `startTaskAssignment`, `completeTaskAssignment`, `blockTaskAssignment`, `unblockTaskAssignment`, `updateTaskProgress`, `reassignTask`

#### GapAnalysis

- ❌ Return type: `deleteGapAnalysis` returns `GapAnalysis!` not `Boolean!`

---

### 🟠 HIGH - 18 Issues

**Missing Query Resolvers:**

- [ ] Process: `departmentProcesses`, `processWithMetrics`, `companyProcessMetrics`
- [ ] AuditLog: `entityAuditTrail`, `userActivitySummary`, `complianceReport`, `securityIncidentReport`
- [ ] EmployeeHistory: `employeeTimeline`, `employeeAuditReport`, `departmentEmployeeHistory`, `changesBy`
- [ ] User: `users` (commented out)

**Missing Mutation Resolvers:**

- [ ] LoadSnapshot: `deleteLoadSnapshot`

**Missing Field Resolvers:**

- [ ] Grade: `processes`
- [ ] LoadSnapshot: `company`, `department`, `process`, `taskAssignment`
- [ ] Process: `department`, `loadSnapshots`
- [ ] TaskAssignment: `department`, `loadSnapshots`
- [ ] GapAnalysis: `hiringPlan`, `recommendations`

---

### 🟡 WARNING - 17 Issues

- ⚠️ All subscriptions stubbed (empty - awaiting event emitter)
- ⚠️ Grade: Extra `company` field resolver not in schema
- ⚠️ TaskAssignment: `employeeTaskAssignments` vs `employeeTasks` naming
- ⚠️ User: `mutation.ts` is empty
- ⚠️ LoadSnapshot input: `freeloadsHours` field not in schema
- ⚠️ Grade query: `grades` returns wrapped object instead of array

---

## Quick Fix Order

### Step 1: Field Naming (5 min)

```typescript
// Department fields.ts
- manager → head

// Process fields.ts
- tasks → taskAssignments
```

### Step 2: Return Types (15 min)

```typescript
// All delete mutations should return Boolean!
(deleteDepartment, deleteProcess, deleteGrade, deleteGapAnalysis);
```

### Step 3: Input Parameters (30 min)

```typescript
// Process.createProcess - Add to input object:
departmentId, processType, capacityUnits, kMultiplier

// TaskAssignment.createTaskAssignment - Fix params:
deadline → dueDate
estimatedHours → effortHours
+ Add: name, description, taskType, allocatedCapacityUnits
```

### Step 4: Missing Mutations (2-3 hours)

Implement in resolvers or remove from schema:

- Grade: createGrade, updateGrade, deleteGrade
- Process: startProcess, completeProcess, cancelProcess, assignProcessCapacity
- TaskAssignment: startTaskAssignment, completeTaskAssignment, blockTaskAssignment, unblockTaskAssignment, updateTaskProgress, reassignTask
- LoadSnapshot: deleteLoadSnapshot

### Step 5: Missing Field Resolvers (2-3 hours)

Add resolvers for all missing relationships

### Step 6: Missing Query Methods (2+ hours)

Implement remaining queries

---

## Files Most Affected

**Critical Issues:**

1. [server/graphql/resolvers/operations/process/](server/graphql/resolvers/operations/process/) - 8 issues
2. [server/graphql/resolvers/operations/taskAssignment/](server/graphql/resolvers/operations/taskAssignment/) - 10 issues
3. [server/graphql/resolvers/core/department/](server/graphql/resolvers/core/department/) - 4 issues
4. [server/graphql/resolvers/core/company/](server/graphql/resolvers/core/company/) - 3 issues

**High Priority:** 5. [server/graphql/resolvers/analytics/loadSnapshot/](server/graphql/resolvers/analytics/loadSnapshot/) - 7 issues 6. [server/graphql/resolvers/audit/auditLog/](server/graphql/resolvers/audit/auditLog/) - 4 issues 7. [server/graphql/resolvers/audit/employeeHistory/](server/graphql/resolvers/audit/employeeHistory/) - 5 issues 8. [server/graphql/resolvers/core/grade/](server/graphql/resolvers/core/grade/) - 5 issues

---

## Import Check Status ✅

- All imports use: `@/server/graphql/generated` ✅
- All use `withMiddleware` wrapper ✅
- All use `context.services` pattern ✅
- No circular imports detected ✅

---

## Type System Check

### Issues Found:

- ⚠️ Input type parameter naming inconsistencies
- ⚠️ Return type inconsistencies for delete mutations
- ⚠️ Field resolver chain completeness

### Green Lights:

- ✅ Query resolvers mostly complete
- ✅ Field resolvers follow pattern
- ✅ Middleware integration consistent
- ✅ Permission checks in place

---

## Subscription Implementation Status

All 7 domains have empty subscription resolvers:

```typescript
export const [domain]Subscriptions: SubscriptionResolvers = {};
```

**Blocked by:** Event emitter infrastructure (RabbitMQ/Redis)  
**Impact:** Medium - subscriptions not critical for initial MVP  
**Timeline:** Phase 2 implementation

---

## Estimated Remediation Timeline

- **Quick Fixes (Naming/Returns):** 1 hour
- **Input Parameter Fixes:** 1 hour
- **Missing Mutations:** 6 hours
- **Missing Queries:** 4 hours
- **Missing Field Resolvers:** 4 hours
- **Testing & Validation:** 4 hours

**Total:** ~20 hours

---

**Critical Issues to Address FIRST:**

1. ✅ Department: `manager` → `head`
2. ✅ Process: `tasks` → `taskAssignments`
3. ✅ All delete mutations: Fix return types
4. ✅ Grade queries: Remove unschema'd mutations OR add to schema
5. ✅ Process/TaskAssignment: Add missing input validation
