# GraphQL Resolver Audit - Action Items & Fixes

## Priority 1: Critical Field Name Fixes (Do First!)

### Issue 1: Department Field Resolver

**File:** [server/graphql/resolvers/core/department/fields.ts](server/graphql/resolvers/core/department/fields.ts)
**Problem:** Field named `manager` but schema expects `head`
**Severity:** 🔴 CRITICAL

**Fix:**

```typescript
// BEFORE:
manager: async (parent, _args, context) => {
  try {
    if (!parent.managerId) return null;
    return await context.services.employee.getById(parent.managerId);

// AFTER:
head: async (parent, _args, context) => {
  try {
    if (!parent.headId) return null;
    return await context.services.employee.getById(parent.headId);
```

**Also Update:**

- Ensure parent object uses `headId` not `managerId`
- Check schema field is `headId` not `managerId`

**Status:** ☐ TODO

---

### Issue 2: Process Field Resolver (tasks → taskAssignments)

**File:** [server/graphql/resolvers/operations/process/fields.ts](server/graphql/resolvers/operations/process/fields.ts)
**Problem:** Field named `tasks` but schema expects `taskAssignments`
**Severity:** 🔴 CRITICAL

**Fix:**

```typescript
// BEFORE:
tasks: async (parent, _args, context) => {
  try {
    return await context.services.process.getTasks(parent.id);

// AFTER:
taskAssignments: async (parent, _args, context) => {
  try {
    return await context.services.taskAssignment.findByProcess(parent.id);
```

**Also Update:**

- May need to create `findByProcess` method in taskAssignment service if not exists
- Verify method name aligns with service architecture

**Status:** ☐ TODO

---

## Priority 2: Fix Return Type Mismatches

### Issue 3: Department Delete Mutation

**File:** [server/graphql/resolvers/core/department/mutation.ts](server/graphql/resolvers/core/department/mutation.ts)
**Problem:** Returns `Department!` but schema expects `Boolean!`
**Severity:** 🔴 CRITICAL

**Fix:**

```typescript
// BEFORE:
deleteDepartment: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      const deletedDepartment = await context.services.department.delete(id);
      return deletedDepartment;

// AFTER:
deleteDepartment: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      await context.services.department.delete(id);
      return true;
```

**Status:** ☐ TODO

---

### Issue 4: Process Delete Mutation

**File:** [server/graphql/resolvers/operations/process/mutation.ts](server/graphql/resolvers/operations/process/mutation.ts)
**Problem:** Returns `Process!` but schema expects `Boolean!`
**Severity:** 🔴 CRITICAL

**Fix:**

```typescript
// BEFORE:
deleteProcess: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      const deletedProcess = await context.services.process.delete(id);
      return deletedProcess;

// AFTER:
deleteProcess: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      await context.services.process.delete(id);
      return true;
```

**Status:** ☐ TODO

---

### Issue 5: Grade Delete Mutation

**File:** [server/graphql/resolvers/core/grade/mutation.ts](server/graphql/resolvers/core/grade/mutation.ts)
**Problem:** Returns `Grade!` but should return what?
**Severity:** 🔴 CRITICAL

**Decision Needed:**

- Remove from schema (Grade domain doesn't support CRUD)?
- OR return `Boolean!`?

**Fix (if keeping):**

```typescript
// BEFORE:
deleteGrade: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      const deletedGrade = await context.services.grade.delete(id);
      return deletedGrade;

// AFTER:
deleteGrade: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      await context.services.grade.delete(id);
      return true;
```

**Status:** ☐ TODO (Awaiting architecture decision)

---

### Issue 6: GapAnalysis Delete Mutation

**File:** [server/graphql/resolvers/analytics/gapAnalysis/mutation.ts](server/graphql/resolvers/analytics/gapAnalysis/mutation.ts)
**Problem:** Returns `GapAnalysis!` but schema expects `Boolean!`
**Severity:** 🔴 CRITICAL

**Fix:**

```typescript
// BEFORE:
deleteGapAnalysis: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      const deletedAnalysis = await context.services.gapAnalysis.delete(id);
      return deletedAnalysis;

// AFTER:
deleteGapAnalysis: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      await context.services.gapAnalysis.delete(id);
      return true;
```

**Status:** ☐ TODO

---

## Priority 3: Fix Input Parameter Validation

### Issue 7: Process CreateProcess Input

**File:** [server/graphql/resolvers/operations/process/mutation.ts](server/graphql/resolvers/operations/process/mutation.ts)
**Problem:** Missing required input fields: `departmentId`, `processType`, `capacityUnits`, `kMultiplier`
**Severity:** 🔴 CRITICAL

**Current Code:**

```typescript
createProcess: withMiddleware(
  async (_parent, { input }, context) => {
    try {
      if (!input.name || !input.companyId) {
        throw new Error("Missing required fields: name, companyId");
      }

      const process = await context.services.process.create({
        companyId: input.companyId,
        name: input.name,
        description: input.description,
        status: input.status || "DRAFT",
      });
```

**Required Fix:**

```typescript
createProcess: withMiddleware(
  async (_parent, { input }, context) => {
    try {
      // Validate all required fields
      if (!input.name || !input.companyId || !input.departmentId ||
          !input.processType || input.capacityUnits === undefined ||
          input.kMultiplier === undefined) {
        throw new Error(
          "Missing required fields: name, companyId, departmentId, " +
          "processType, capacityUnits, kMultiplier"
        );
      }

      // Validate numeric fields
      if (input.capacityUnits < 1) {
        throw new Error("capacityUnits must be at least 1");
      }
      if (input.kMultiplier <= 0 || input.kMultiplier > 10) {
        throw new Error("kMultiplier must be between 0 and 10");
      }

      const process = await context.services.process.create({
        companyId: input.companyId,
        departmentId: input.departmentId,
        name: input.name,
        description: input.description,
        processType: input.processType,
        capacityUnits: input.capacityUnits,
        kMultiplier: input.kMultiplier,
        estimatedDurationDays: input.estimatedDurationDays,
        priority: input.priority || "NORMAL",
        status: input.status || "DRAFT",
      });

      // TODO: Implement event emitter
      // context.eventEmitter.emit(
      //   `PROCESS_CREATED_DEPT_${input.departmentId}`,
      //   process
      // );

      return process;
```

**Status:** ☐ TODO

---

### Issue 8: TaskAssignment CreateTaskAssignment Input

**File:** [server/graphql/resolvers/operations/taskAssignment/mutation.ts](server/graphql/resolvers/operations/taskAssignment/mutation.ts)
**Problem:** Parameter names mismatch + missing required fields
**Severity:** 🔴 CRITICAL

**Current Code:**

```typescript
createTaskAssignment: withMiddleware(
  async (_parent, { input }, context) => {
    try {
      if (!input.employeeId || !input.processId) {
        throw new Error("Missing required fields: employeeId, processId");
      }

      const taskAssignment = await context.services.taskAssignment.create({
        employeeId: input.employeeId,
        processId: input.processId,
        status: input.status || "ASSIGNED",
        priority: input.priority,
        deadline: input.deadline,
        estimatedHours: input.estimatedHours,
      });
```

**Required Fix:**

```typescript
createTaskAssignment: withMiddleware(
  async (_parent, { input }, context) => {
    try {
      // Validate all required fields
      if (!input.employeeId || !input.processId || !input.name ||
          !input.taskType || input.allocatedCapacityUnits === undefined ||
          input.effortHours === undefined || !input.dueDate) {
        throw new Error(
          "Missing required fields: employeeId, processId, name, taskType, " +
          "allocatedCapacityUnits, effortHours, dueDate"
        );
      }

      // Validate numeric fields
      if (input.allocatedCapacityUnits < 1) {
        throw new Error("allocatedCapacityUnits must be at least 1");
      }
      if (input.effortHours <= 0) {
        throw new Error("effortHours must be greater than 0");
      }

      const taskAssignment = await context.services.taskAssignment.create({
        employeeId: input.employeeId,
        processId: input.processId,
        name: input.name,
        description: input.description,
        taskType: input.taskType,
        allocatedCapacityUnits: input.allocatedCapacityUnits,
        effortHours: input.effortHours,
        estimatedDaysToComplete: input.estimatedDaysToComplete,
        priority: input.priority || "NORMAL",
        dueDate: input.dueDate,
        status: input.status || "ASSIGNED",
      });

      // TODO: Implement event emitter
      // context.eventEmitter.emit(
      //   `TASK_ASSIGNED_EMPLOYEE_${input.employeeId}`,
      //   taskAssignment
      // );

      return taskAssignment;
```

**Status:** ☐ TODO

---

## Priority 4: Implement Missing Mutations

### Process Mutations (4 new mutations needed)

**Issue 9: startProcess**
**File:** [server/graphql/resolvers/operations/process/mutation.ts](server/graphql/resolvers/operations/process/mutation.ts)
**Status:** ☐ TODO

```typescript
startProcess: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      const process = await context.services.process.getByIdOrThrow(id);

      if (process.status !== "PLANNED") {
        throw new Error(`Cannot start process with status ${process.status}`);
      }

      const updatedProcess = await context.services.process.update(id, {
        status: "IN_PROGRESS",
        startedAt: new Date(),
      });

      return updatedProcess;
    } catch (error) {
      throw new Error(`Failed to start process: ${error}`);
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ["process:update"],
    requireRole: "MANAGER",
  }
),
```

---

**Issue 10: completeProcess**
**File:** [server/graphql/resolvers/operations/process/mutation.ts](server/graphql/resolvers/operations/process/mutation.ts)
**Status:** ☐ TODO

```typescript
completeProcess: withMiddleware(
  async (_parent, { id }, context) => {
    try {
      const process = await context.services.process.getByIdOrThrow(id);

      if (!["IN_PROGRESS", "ON_HOLD"].includes(process.status)) {
        throw new Error(`Cannot complete process with status ${process.status}`);
      }

      const updatedProcess = await context.services.process.update(id, {
        status: "COMPLETED",
        completedAt: new Date(),
      });

      return updatedProcess;
    } catch (error) {
      throw new Error(`Failed to complete process: ${error}`);
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ["process:update"],
    requireRole: "MANAGER",
  }
),
```

---

**Issue 11: cancelProcess**
**File:** [server/graphql/resolvers/operations/process/mutation.ts](server/graphql/resolvers/operations/process/mutation.ts)
**Status:** ☐ TODO

```typescript
cancelProcess: withMiddleware(
  async (_parent, { id, reason }, context) => {
    try {
      const process = await context.services.process.getByIdOrThrow(id);

      if (["COMPLETED", "CANCELLED"].includes(process.status)) {
        throw new Error(`Cannot cancel process with status ${process.status}`);
      }

      const updatedProcess = await context.services.process.update(id, {
        status: "CANCELLED",
        cancelReason: reason || "No reason provided",
      });

      return updatedProcess;
    } catch (error) {
      throw new Error(`Failed to cancel process: ${error}`);
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ["process:update"],
    requireRole: "MANAGER",
  }
),
```

---

**Issue 12: assignProcessCapacity**
**File:** [server/graphql/resolvers/operations/process/mutation.ts](server/graphql/resolvers/operations/process/mutation.ts)
**Status:** ☐ TODO

```typescript
assignProcessCapacity: withMiddleware(
  async (_parent, { processId, capacityUnits, kMultiplier }, context) => {
    try {
      if (capacityUnits < 1) {
        throw new Error("capacityUnits must be at least 1");
      }
      if (kMultiplier <= 0 || kMultiplier > 10) {
        throw new Error("kMultiplier must be between 0 and 10");
      }

      const updatedProcess = await context.services.process.update(processId, {
        capacityUnits,
        kMultiplier,
      });

      return updatedProcess;
    } catch (error) {
      throw new Error(`Failed to assign process capacity: ${error}`);
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ["process:update"],
    requireRole: "MANAGER",
  }
),
```

---

### TaskAssignment Mutations (6 new mutations needed)

**Issue 13-18: Task Mutations**
**File:** [server/graphql/resolvers/operations/taskAssignment/mutation.ts](server/graphql/resolvers/operations/taskAssignment/mutation.ts)
**Status:** ☐ TODO

Need to implement:

- `startTaskAssignment(id: String!): TaskAssignment!`
- `completeTaskAssignment(id: String!): TaskAssignment!`
- `blockTaskAssignment(id: String!, reason: String!): TaskAssignment!`
- `unblockTaskAssignment(id: String!, resolution: String): TaskAssignment!`
- `updateTaskProgress(id: String!, completionPercentage: Int!, actualDaysSpent: Int): TaskAssignment!`
- `reassignTask(taskId: String!, newEmployeeId: String!): TaskAssignment!`

_(Implementation templates follow same pattern as Process mutations)_

---

## Priority 5: Add Missing Field Resolvers

### Issue 19: Company Process Resolver

**File:** [server/graphql/resolvers/core/company/fields.ts](server/graphql/resolvers/core/company/fields.ts)
**Status:** ☐ TODO

```typescript
/**
 * Resolve all processes for this company
 */
processes: async (parent, _args, context) => {
  try {
    return await context.services.process.findByCompany(parent.id);
  } catch (error) {
    throw new Error(`Failed to load processes: ${error}`);
  }
},

/**
 * Resolve all task assignments for this company
 */
taskAssignments: async (parent, _args, context) => {
  try {
    return await context.services.taskAssignment.findByCompany(parent.id);
  } catch (error) {
    throw new Error(`Failed to load task assignments: ${error}`);
  }
},

/**
 * Resolve all load snapshots for this company
 */
loadSnapshots: async (parent, _args, context) => {
  try {
    return await context.services.loadSnapshot.findByCompany(parent.id);
  } catch (error) {
    throw new Error(`Failed to load snapshots: ${error}`);
  }
},
```

---

### Issue 20: Department Process Resolvers

**File:** [server/graphql/resolvers/core/department/fields.ts](server/graphql/resolvers/core/department/fields.ts)
**Status:** ☐ TODO

```typescript
/**
 * Resolve all processes for this department
 */
processes: async (parent, _args, context) => {
  try {
    return await context.services.process.findByDepartment(parent.id);
  } catch (error) {
    throw new Error(`Failed to load processes: ${error}`);
  }
},

/**
 * Resolve all task assignments for this department
 */
taskAssignments: async (parent, _args, context) => {
  try {
    return await context.services.taskAssignment.findByDepartment(parent.id);
  } catch (error) {
    throw new Error(`Failed to load task assignments: ${error}`);
  }
},

/**
 * Resolve all load snapshots for this department
 */
loadSnapshots: async (parent, _args, context) => {
  try {
    return await context.services.loadSnapshot.findByDepartment(parent.id);
  } catch (error) {
    throw new Error(`Failed to load snapshots: ${error}`);
  }
},
```

---

## Summary of Required Changes

| Priority | Component        | Type | Count       |
| -------- | ---------------- | ---- | ----------- |
| 1        | Field Names      | Fix  | 2           |
| 2        | Return Types     | Fix  | 4           |
| 3        | Input Validation | Fix  | 2           |
| 4        | Mutations        | Add  | 10          |
| 5        | Field Resolvers  | Add  | 15+         |
| 6        | Query Methods    | Add  | 8+          |
| 7        | Subscriptions    | Add  | All (defer) |

**Total Estimated Fixes: 41+ changes**

---

## Testing Checklist

After implementing fixes:

- [ ] Unit test each new mutation
- [ ] Integration test with schema validation
- [ ] Test all field resolver chains
- [ ] Verify permission checks
- [ ] Load test pagination
- [ ] Test error handling
- [ ] Validate TypeScript compilation
- [ ] Check GraphQL schema validity
- [ ] End-to-end integration tests

---

**Last Updated:** February 27, 2026
