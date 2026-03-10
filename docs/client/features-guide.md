# Features Documentation Guide

## What is a Feature?

A feature is a **user action or workflow** - it coordinates data from entities with client state to deliver something the user can do.

Examples:

- "List employees with filtering and pagination"
- "Create a new employee"
- "Edit employee details"
- "Upload CSV file with employee data"
- "Sign in with email and password"

Features are the **orchestration layer** between UI (components) and data (entities).

---

## Feature Folder Structure

```
features/[entity]/[action]/
├── ui/
│   ├── component-name.tsx         # Dumb UI components
│   ├── another-component.tsx
│   └── ...
├── store.ts                       # Zustand store (feature state)
├── hooks.ts                       # Feature hooks (action coordinators)
└── index.ts                       # Public API
```

**Example: Employee List Feature**

```
features/employee/list/
├── ui/
│   ├── employee-list.tsx          # Main list component
│   ├── employee-table.tsx         # Table component
│   ├── employee-filters.tsx       # Filter controls
│   └── employee-actions.tsx       # Bulk actions
├── store.ts                       # Pagination, sort, filter state
├── hooks.ts                       # useEmployeeList, useListActions
└── index.ts                       # Export EmployeeListFeature
```

---

## File Breakdown

### `ui/` - Presentational Components

Dumb components that render UI and call callbacks.

**Key rule:** UI components never import from `features/` or `entities/`. They only accept props.

```typescript
// features/employee/list/ui/employee-table.tsx
'use client';

import { useState } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@/shared/ui';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onRowClick?: (employeeId: string) => void;
  onSort?: (column: string) => void;
}

export function EmployeeTable({
  employees,
  loading,
  onRowClick,
  onSort,
}: EmployeeTableProps) {
  if (loading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={() => onSort?.('fio')}>Name</TableCell>
          <TableCell onClick={() => onSort?.('email')}>Email</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.id} onClick={() => onRowClick?.(emp.id)}>
            <TableCell>{emp.fio}</TableCell>
            <TableCell>{emp.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**Guidelines:**

- Accept all needed data as props
- Call callbacks for user actions
- No API calls
- No business logic
- No imports from entities or features
- Type all props with interfaces

---

### `store.ts` - Feature State

Zustand store for feature-specific state (not global).

```typescript
// features/employee/list/store.ts
import { create } from "zustand";

interface EmployeeListState {
  page: number;
  limit: number;
  sort: string;
  filter: string;
  selectedIds: string[];

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: string) => void;
  setFilter: (filter: string) => void;
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useEmployeeListStore = create<EmployeeListState>((set) => ({
  page: 1,
  limit: 20,
  sort: "fio",
  filter: "",
  selectedIds: [],

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSort: (sort) => set({ sort, page: 1 }), // Reset page on sort change
  setFilter: (filter) => set({ filter, page: 1 }),

  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    })),

  clearSelection: () => set({ selectedIds: [] }),
  reset: () => set({ page: 1, sort: "fio", filter: "", selectedIds: [] }),
}));
```

**Guidelines:**

- One store per feature (separate from global stores in `shared/stores`)
- Store UI state (pagination, filters, selection)
- Don't store server data (Apollo does that)
- Simple actions (setX, toggle, reset)
- Reset pagination when filter/sort changes

---

### `hooks.ts` - Feature Logic

Feature hooks coordinate entity hooks + stores + side effects.

```typescript
// features/employee/list/hooks.ts
"use client";

import { useCallback, useEffect } from "react";
import { useEmployeeListStore } from "./store";
import { useGetEmployees } from "@/entities/employee";

// Main feature hook: Data
export function useEmployeeList(tenantSlug: string) {
  const { page, limit, sort, filter } = useEmployeeListStore();

  const { data, loading, error, refetch } = useGetEmployees({
    variables: {
      tenantSlug,
      page,
      limit,
      sort,
      filter,
    },
  });

  return {
    employees: data?.employees?.nodes,
    total: data?.employees?.total,
    pages: data?.employees?.pages,
    loading,
    error,
    refetch,
  };
}

// UI state hook
export function useEmployeeListUI() {
  return useEmployeeListStore();
}

// Feature hook: Actions
export function useEmployeeListActions() {
  const store = useEmployeeListStore();
  const { refetch } = useGetEmployees({}); // For refetching

  const handlePageChange = useCallback(
    (page: number) => {
      store.setPage(page);
    },
    [store],
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      store.setSort(sort);
    },
    [store],
  );

  const handleFilterChange = useCallback(
    (filter: string) => {
      store.setFilter(filter);
    },
    [store],
  );

  const handleRefresh = useCallback(() => {
    refetch();
    store.clearSelection();
  }, [refetch, store]);

  return {
    onPageChange: handlePageChange,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    onRefresh: handleRefresh,
  };
}

// Utility: Check if data changed after action
export function useEmployeeListSync(tenantSlug: string) {
  const { refetch } = useEmployeeList(tenantSlug);

  return { refetch };
}
```

**Guidelines:**

- Separate hooks for data, UI state, actions
- Use entity hooks to fetch data
- Use store to manage feature state
- Handle loading/error/success states
- Include refetch mechanisms
- Use `useCallback` for event handlers

---

### `index.ts` - Public API

Export the feature for use in widgets/pages.

```typescript
// features/employee/list/index.ts
'use client';

import { useEmployeeList, useEmployeeListUI, useEmployeeListActions } from './hooks';
import { EmployeeTable } from './ui/employee-table';
import { EmployeeFilters } from './ui/employee-filters';
import { EmployeePagination } from './ui/employee-pagination';

interface EmployeeListFeatureProps {
  tenantSlug: string;
}

export function EmployeeListFeature({ tenantSlug }: EmployeeListFeatureProps) {
  const { employees, loading, total, pages } = useEmployeeList(tenantSlug);
  const { page, sort, filter } = useEmployeeListUI();
  const { onPageChange, onSortChange, onFilterChange } = useEmployeeListActions();

  return (
    <div className="space-y-4">
      <EmployeeFilters
        filter={filter}
        sort={sort}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        onSort={onSortChange}
      />

      <EmployeePagination
        page={page}
        pages={pages}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}

// Export hooks for advanced usage
export { useEmployeeList, useEmployeeListUI, useEmployeeListActions };
```

---

## Feature Examples

### Example 1: List Feature

```
features/employee/list/
├── ui/
│   ├── employee-list.tsx
│   ├── employee-table.tsx
│   ├── employee-filters.tsx
│   └── employee-pagination.tsx
├── store.ts                  # page, sort, filter, selectedIds
├── hooks.ts                  # useEmployeeList, useActions
└── index.ts                  # EmployeeListFeature
```

### Example 2: Create Feature

```
features/employee/create/
├── ui/
│   ├── employee-form.tsx
│   └── employee-form-dialog.tsx
├── store.ts                  # formOpen, formData (if client-side validation)
├── hooks.ts                  # useCreateEmployee
└── index.ts                  # EmployeeCreateFeature
```

```typescript
// features/employee/create/hooks.ts
export function useCreateEmployee() {
  const [createEmployee, { loading, error }] = useCreateEmployee_Mutation();

  const handleSubmit = async (input: EmployeeCreateInput) => {
    try {
      const validated = employeeCreateSchema.parse(input);
      await createEmployee({
        variables: { input: validated },
      });
    } catch (err) {
      // Handle validation error
    }
  };

  return { handleSubmit, loading, error };
}
```

### Example 3: Delete Feature

```
features/employee/delete/
├── ui/
│   └── delete-confirmation-dialog.tsx
├── hooks.ts                  # useDeleteEmployee
└── index.ts                  # EmployeeDeleteFeature
```

```typescript
// features/employee/delete/hooks.ts
export function useDeleteEmployee() {
  const [deleteEmployee, { loading }] = useDeleteEmployee_Mutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async (id: string) => {
    await deleteEmployee({
      variables: { id },
      refetchQueries: [{ query: GET_EMPLOYEES }],
    });
    setShowConfirm(false);
  };

  return { handleDelete, loading, showConfirm, setShowConfirm };
}
```

---

## Feature-to-Feature Communication

### Scenario 1: Create → List (reload after create)

Feature A creates something, Feature B (list) should reload.

**Solution: Apollo cache invalidation**

```typescript
// Feature A: Create
const [create] = useMutation(CREATE_EMPLOYEE, {
  refetchQueries: [{ query: GET_EMPLOYEES }],
});

// Feature B: List automatically refetches due to refetchQueries
```

### Scenario 2: List → Detail (pass selected item)

Feature A has list, Feature B needs selected item.

**Solution: Widget orchestrates via props**

```typescript
// widgets/employees-widget.tsx
function EmployeesWidget() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <EmployeeListFeature onSelectEmployee={setSelectedId} />
      {selectedId && <EmployeeDetailFeature employeeId={selectedId} />}
    </>
  );
}
```

### Scenario 3: Cross-entity (File upload → List reload)

Feature A uploads file, Feature B (employee list) on different entity.

**Solution: Global store + event-driven**

```typescript
// shared/stores/sync.store.ts
export const useSyncStore = create((set) => ({
  lastSync: null,
  triggerSync: (entity: string) =>
    set({ lastSync: { entity, time: Date.now() } }),
}));

// Feature A: File upload
useFileUpload.onSuccess(() => {
  useSyncStore().triggerSync("employee");
});

// Feature B: Employee list
useEffect(() => {
  const unsubscribe = useSyncStore.subscribe(
    (state) => state.lastSync,
    (lastSync) => {
      if (lastSync?.entity === "employee") refetch();
    },
  );
  return unsubscribe;
}, []);
```

---

## All Features Checklist

```
✅ features/employee/
   ├─ list/     (read multiple + filter + sort + paginate)
   ├─ create/   (create new)
   ├─ edit/     (update existing)
   ├─ delete/   (soft delete)
   ├─ detail/   (read single with related data)
   └─ capacity/ (calculate + display)

✅ features/department/
   ├─ list/
   ├─ create/
   ├─ edit/
   ├─ delete/
   └─ detail/

✅ features/process/
   ├─ list/
   ├─ create/
   ├─ edit/
   ├─ delete/
   └─ detail/

✅ features/assignment/
   ├─ list/
   ├─ create/
   ├─ edit/
   ├─ delete/
   └─ detail/

✅ features/company/
   ├─ create/       (onboarding)
   ├─ settings/
   └─ detail/

✅ features/common/
   ├─ file-upload/
   ├─ auth/
   ├─ onboarding/
   └─ ai-assistant/
```

---

## Next Steps

- Read [widgets-guide.md](./widgets-guide.md) to see how features compose
- Read [naming-conventions.md](./naming-conventions.md) for consistent naming
- Follow [implementation-checklist.md](./implementation-checklist.md) Phase 3: Create core features
