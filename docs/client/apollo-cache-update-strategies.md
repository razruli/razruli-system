# Apollo Cache Update Strategies

**The Decision Matrix for Post-Mutation Cache Updates**

## Overview

After every mutation, Apollo cache must be updated. **Wrong choice = N+1 queries, stale data, or UI lag.**

This guide shows which strategy to use in each scenario.

---

## Strategy Comparison

| Strategy             | Network Cost         | Code Complexity | UX Latency | Use When                                |
| -------------------- | -------------------- | --------------- | ---------- | --------------------------------------- |
| `refetchQueries`     | Highest              | Lowest          | High       | Simple mutations, non-critical queries  |
| `cache.modify`       | Zero                 | High            | Lowest     | Large collections, performance critical |
| `optimisticResponse` | Zero (if optimistic) | Medium          | Instant    | Predictable mutations                   |
| Skip (subscription)  | Zero                 | Medium          | Real-time  | Need real-time updates                  |

---

## 1. OPTIMISTIC UPDATES (Best UX - Use First)

### What It Does

1. UI updates immediately with predicted data
2. Mutation sends to server in background
3. Server confirms or reverts
4. User sees instant response (even on slow networks)

### When to Use

✅ Create/Update/Delete operations  
✅ When success is predictable (>95%)  
✅ User expects instant feedback

### When NOT to Use

❌ Complex mutations with server-side calculations  
❌ Mutations that depend on current server state  
❌ Mutations that could fail (validation, permissions)

### Implementation

```typescript
// ✅ GOOD: Simple field update
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  optimisticResponse: {
    updateEmployee: {
      __typename: "Employee",
      id: employeeId,
      fio: formData.fio,
      email: formData.email,
      departmentId: formData.departmentId,
      // All fields must match response type
    },
  },
  update(cache, { data: { updateEmployee } }) {
    cache.modify({
      fields: {
        employee(existing, { fieldName, args }) {
          return updateEmployee;
        },
      },
    });
  },
});

// ✅ GOOD: Create in list
const [createEmployee] = useMutation(CreateEmployeeDocument, {
  optimisticResponse: {
    createEmployee: {
      __typename: "Employee",
      id: `temp_${Date.now()}`, // Temporary ID
      fio: formData.fio,
      email: formData.email,
      createdAt: new Date().toISOString(),
    },
  },
  update(cache, { data: { createEmployee } }) {
    const existing = cache.readQuery({
      query: GetEmployeesDocument,
      variables: { first: 50, offset: 0 },
    });

    cache.writeQuery({
      query: GetEmployeesDocument,
      variables: { first: 50, offset: 0 },
      data: {
        employees: {
          ...existing.employees,
          edges: [createEmployee, ...existing.employees.edges],
          pageInfo: {
            ...existing.employees.pageInfo,
            total: existing.employees.pageInfo.total + 1,
          },
        },
      },
    });
  },
});

// ❌ BAD: Complex calculation optimistic
// Don't guess salary changes, derived fields, or server decisions
const [updateSalary] = useMutation(UpdateSalaryDocument, {
  optimisticResponse: {
    updateSalary: {
      salary: newSalary,
      tax: newSalary * 0.13, // ← Server calculates, don't guess
      netIncome: calculateNet(newSalary), // ← Don't predict
    },
  },
});
```

---

## 2. CACHE.MODIFY (Performance Critical)

### What It Does

- Manually update Apollo cache without network request
- Surgical updates to specific fields/entities
- Zero latency, zero network cost

### When to Use

✅ Large list mutations (1000+ items)  
✅ Multiple rapid mutations  
✅ Predictable changes to cached data  
✅ Post-mutation data already known

### When NOT to Use

❌ Data needs server-side processing  
❌ Uncertain if mutation succeeded  
❌ Derived fields that require calculation

### Implementation

```typescript
// ✅ GOOD: Add item to collection
const [createDepartment] = useMutation(CreateDepartmentDocument, {
  update(cache, { data: { createDepartment } }) {
    cache.modify({
      fields: {
        departments(
          existing = { edges: [], pageInfo: {} },
          { fieldName, args },
        ) {
          return {
            ...existing,
            edges: [createDepartment, ...existing.edges],
            pageInfo: {
              ...existing.pageInfo,
              total: existing.pageInfo.total + 1,
            },
          };
        },
      },
    });
  },
});

// ✅ GOOD: Update specific item in collection
const [updateDepartment] = useMutation(UpdateDepartmentDocument, {
  update(cache, { data: { updateDepartment } }) {
    cache.modify({
      fields: {
        departments(existing = { edges: [] }) {
          return {
            ...existing,
            edges: existing.edges.map((edge) =>
              edge.id === updateDepartment.id ? updateDepartment : edge,
            ),
          };
        },
      },
    });
  },
});

// ✅ GOOD: Remove item from collection
const [deleteDepartment] = useMutation(DeleteDepartmentDocument, {
  update(cache, { data: { deleteDepartment } }) {
    cache.modify({
      fields: {
        departments(existing = { edges: [], pageInfo: {} }) {
          return {
            ...existing,
            edges: existing.edges.filter((e) => e.id !== deleteDepartment.id),
            pageInfo: {
              ...existing.pageInfo,
              total: existing.pageInfo.total - 1,
            },
          };
        },
      },
    });
  },
});

// ✅ GOOD: Update related cached queries
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  update(cache, { data: { updateEmployee } }) {
    // Update the employee detail query
    cache.writeQuery({
      query: GetEmployeeDocument,
      variables: { id: updateEmployee.id },
      data: { employee: updateEmployee },
    });

    // Update in list
    cache.modify({
      fields: {
        employees(existing = { edges: [] }) {
          return {
            ...existing,
            edges: existing.edges.map((e) =>
              e.id === updateEmployee.id ? updateEmployee : e,
            ),
          };
        },
      },
    });

    // Update any related cached data
    cache.evict({ id: `Department:${updateEmployee.departmentId}` });
  },
});

// ❌ BAD: Modifying non-existing cache entry
cache.modify({
  fields: {
    nonExistentField() {
      /* won't run */
    },
  },
});

// ❌ BAD: Cache inconsistency
// Update list but forget detail query
cache.modify({
  fields: {
    employees(existing) {
      /* updated */
    },
    // but GetEmployeeDocument still stale
  },
});
```

---

## 3. REFETCHQUERIES (Simple, Network Cost)

### What It Does

- After mutation succeeds, re-fetch specified queries
- Server provides fresh data
- Guarantees correctness

### When to Use

✅ Simple mutations  
✅ Non-critical queries  
✅ Batch operations  
✅ Uncertain if cache is accurate

### When NOT to Use

❌ Performance-critical operations  
❌ Large collections (N queries re-fetched)  
❌ Server processing takes time

### Implementation

```typescript
// ✅ GOOD: Simple case
const [createEmployee] = useMutation(CreateEmployeeDocument, {
  refetchQueries: [
    { query: GetEmployeesDocument, variables: { first: 50, offset: 0 } },
  ],
});

// ✅ GOOD: Multiple related queries
const [updateDepartment] = useMutation(UpdateDepartmentDocument, {
  refetchQueries: [
    { query: GetDepartmentDocument, variables: { id: departmentId } },
    { query: GetDepartmentsDocument, variables: { first: 100, offset: 0 } },
    { query: GetDepartmentEmployeesDocument, variables: { id: departmentId } },
  ],
  awaitRefetchQueries: true, // Wait for all to complete
});

// ✅ GOOD: Conditional refetch
const [deleteEmployee] = useMutation(DeleteEmployeeDocument, {
  refetchQueries: async (possibleQueries) => {
    return possibleQueries.filter((q) => {
      // Only refetch if relevant
      return (
        q.query === GetEmployeesDocument ||
        q.query === GetDepartmentEmployeesDocument
      );
    });
  },
});

// ❌ BAD: Too many refetches (N+1 queries to server)
const [createEmployee] = useMutation(CreateEmployeeDocument, {
  refetchQueries: [
    GetEmployeesDocument,
    GetDepartmentsDocument,
    GetGradesDocument,
    GetCompanyStatsDocument,
    GetRecentActivityDocument,
    // ... 50 more queries
  ],
});

// ❌ BAD: Refetch without variables (matches all)
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  refetchQueries: [
    { query: GetEmployeesDocument }, // No variables! Fetches with default vars
  ],
});
```

---

## 4. EVICT + REFETCH (Hybrid Pattern)

### What It Does

- Evict specific cache entry
- Force fresh fetch only for affected query
- Best of both worlds

### When to Use

✅ Single entity changes  
✅ Affects specific detail page  
✅ Other queries don't need update

### Implementation

```typescript
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  update(cache, { data: { updateEmployee } }) {
    // Update detail query
    cache.writeQuery({
      query: GetEmployeeDocument,
      variables: { id: updateEmployee.id },
      data: { employee: updateEmployee },
    });

    // Evict invalid cached data (if exists)
    cache.evict({ id: `Department:${updateEmployee.oldDepartmentId}` });
    cache.evict({ id: `Department:${updateEmployee.departmentId}` });

    // Don't refetch list, just let Apollo notify observers
  },
});
```

---

## 5. NO UPDATE (Subscription-Based)

### What It Does

- Mutation completes but doesn't update cache
- Server sends subscription update with fresh data
- UI updates via subscription

### When to Use

✅ Real-time collaboration  
✅ Multiple users editing same data  
✅ Server side-effects (calculations, events)

### Implementation

```typescript
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  // Don't update cache - let subscription handle it
  update: undefined,
});

// Subscription updates cache in real-time
useSubscription(OnEmployeeUpdatedDocument, {
  variables: { employeeId },
  onData({ data }) {
    // Apollo automatically updates cache
    cache.writeQuery({
      query: GetEmployeeDocument,
      variables: { id: employeeId },
      data: { employee: data.onEmployeeUpdated },
    });
  },
});
```

---

## DECISION MATRIX: Which Strategy?

```
Is this a Create operation?
  YES → Optimistic (new item, add to list)
  NO  → Is it Update?
    YES → Is field simple (user input)?
      YES → Optimistic
      NO  → cache.modify OR refetchQueries
    NO  → Is it Delete?
      YES → Optimistic (remove from list)
      NO  → Is it a batch operation?
        YES → refetchQueries
        NO  → cache.modify

Is this operation performance-critical?
  YES → cache.modify OR optimistic
  NO  → refetchQueries (simpler, more reliable)

Could this affect multiple queries?
  YES → cache.modify (update all at once)
  NO  → cache.writeQuery (single query)
```

---

## ANTI-PATTERNS (Don't Do This)

❌ **Mixing strategies for same query**

```tsx
// DON'T: Update cache AND refetch
refetchQueries: [GetEmployeesDocument],
update(cache) {
  cache.modify({ fields: { employees: ... } });
}
```

❌ **Optimistic update for complex mutation**

```tsx
// DON'T: Guess server calculations
optimisticResponse: {
  calculateSalary: {
    baseSalary: newBase,
    tax: newBase * 0.13,  // Server does this!
    bonus: calculateBonus(),  // Don't guess!
  },
}
```

❌ **Forgetting to update collections when updating items**

```tsx
// DON'T: Update detail but forget list
cache.writeQuery({
  query: GetEmployeeDocument,
  data: { employee: updatedEmployee },
});
// List still has old data!
```

❌ **Cache inconsistency across related queries**

```tsx
// DON'T: Update employees but not departments
cache.modify({
  fields: {
    employees: addToList(newEmployee),
    // Department total employees now stale!
  },
});
```

---

## Performance Baseline

**Per mutation:**

- Optimistic: 0ms (instant)
- cache.modify: 2-5ms (negligible)
- cache.evict + writeQuery: 5-10ms
- refetchQueries (1 query): 200-500ms (network)
- refetchQueries (5 queries): 500ms-1s+

**Implications:**

- If you see pagination jumps or list glitching → use cache.modify
- If you see unnecessary loading states → use optimistic
- If data seems stale → use refetchQueries (correctness > speed)

---

## Checklist: Post-Mutation Data Freshness

- [ ] Create: Uses optimistic OR immediately shows new item
- [ ] Update: Optimistic OR cache.modify + detail cache synced
- [ ] Delete: Optimistic removes from list
- [ ] Batch: refetchQueries with all affected queries
- [ ] Collections: Item updates propagate to all lists
- [ ] No loading spinner: Optimistic working
- [ ] No cache inconsistency: Related queries validated
- [ ] Error handling: Revert optimistic if mutation fails
