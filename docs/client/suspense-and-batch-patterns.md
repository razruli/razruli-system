# Suspense & Batch Request Patterns

## Overview

This guide explains when and how to use Suspense queries, batch requests, and cache-based widget data loading.

## 1. Query Types & When to Use Each

### A. Suspense Queries (Server-Side Preload)
**When:** Initial page data needed before rendering - critical for layout/structure

**Characteristics:**
- Data loads in parallel on server
- Page suspends until data arrives
- Full skeleton/loading state visible
- Better SEO, no content shift (CLS)

**Usage:**
```tsx
// Page component (with Suspense boundary in layout)
export default function EmployeesPage() {
  const { data, loading, error } = useQuery(GetEmployeesDocument, {
    variables: { first: 50, offset: 0 },
    suspense: true  // ← Key: enables Suspense
  });

  // If suspense=true, we reach here only with data
  return <EmployeeTable employees={data.employees.edges} />;
}

// Layout provides Suspense boundary
export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
```

### B. Batch Queries (Multiple + Suspense)
**When:** Single page needs multiple related data sources

**Characteristics:**
- Single network round trip
- All data in Apollo cache
- Widgets extract from cache (no re-fetch)
- Suspends until entire batch loads

**Usage:**
```tsx
// Employees page needs: list + department filters + capacity metrics
export function useEmployeesPageBatch(variables: { 
  first?: number; 
  offset?: number;
  suspense?: boolean;
}) {
  // Batch query that loads multiple data types
  // Could use Apollo batching or multiple parallel queries
  return useQuery(GetEmployeesWithBatchDocument, {
    variables: {
      first: variables.first ?? 50,
      offset: variables.offset ?? 0,
    },
    suspense: variables.suspense ?? true,
  });
}
```

### C. Regular Queries (Client-Side, Progressive)
**When:** Optional/secondary data, or user-triggered actions

**Characteristics:**
- No Suspense (suspense: false)
- Doesn't block page render
- Shows loading state in individual widget
- Good for infinite scroll, filters, drill-downs

**Usage:**
```tsx
// Widget that loads on-demand
export function OptionalMetricsWidget() {
  const { data, loading } = useQuery(GetAdvancedMetricsDocument, {
    suspense: false  // ← No suspension
  });

  if (loading) return <Spinner />;
  return <MetricsChart data={data} />;
}
```

### D. Mutations (Always Non-Suspense)
**When:** User actions (create, update, delete)

**Characteristics:**
- Never use suspense for mutations
- Show loading state, error states
- Optimistic updates possible
- Refetch/update cache after mutation

**Usage:**
```tsx
export function CreateEmployeeForm() {
  const [createEmployee, { loading, error }] = useMutation(CreateEmployeeDocument);

  const handleSubmit = async (input) => {
    try {
      const { data } = await createEmployee({
        variables: { input },
        refetchQueries: [{ query: GetEmployeesDocument }],
      });
      // Success
    } catch (e) {
      // Error - show to user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert>{error.message}</Alert>}
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## 2. Batch Request Patterns

### Pattern A: Single Batch Query (Recommended)
Load all related data in a single GraphQL query document:

```graphql
# entities/core/batch/getDashboardOverview.graphql
query GetDashboardOverview {
  stats {
    totalEmployees
    totalDepartments
    activeProcesses
    averageWorkload
  }
  departments(first: 5) {
    edges {
      id
      name
      headcount
      capacity
    }
    pageInfo {
      total
      hasMore
    }
  }
  recentActivity(limit: 10) {
    id
    type
    description
    timestamp
    user {
      name
    }
  }
}
```

**Pros:** Single query, single resolver execution, cache efficient  
**Cons:** Server-side resolver must aggregate data

### Pattern B: Parallel Batch Queries (Apollo Client)
Load multiple queries in parallel, Apollo caches results:

```tsx
export function useDashboardOverviewBatch() {
  const statsQuery = useQuery(GetStatsDocument, { suspense: true });
  const departmentsQuery = useQuery(GetDepartmentsDocument, {
    variables: { first: 5, offset: 0 },
    suspense: true,
  });
  const activityQuery = useQuery(GetRecentActivityDocument, {
    variables: { limit: 10 },
    suspense: true,
  });

  // Wait for all via Suspense
  return {
    stats: statsQuery.data?.stats,
    departments: departmentsQuery.data?.departments,
    activity: activityQuery.data?.recentActivity,
  };
}
```

**Pros:** Flexible, can maintain separate cache entries, easy to refetch one  
**Cons:** Multiple network requests (unless batched at HTTP level), more complex

### Pattern C: Hybrid (Recommended)
Critical data in single query + supplementary in parallel:

```tsx
export function useEmployeesPageBatch(variables: {
  first?: number;
  offset?: number;
  suspense?: boolean;
}) {
  // Critical: Employee list (must have)
  const listQuery = useQuery(GetEmployeesDocument, {
    variables: { first: variables.first ?? 50, offset: variables.offset ?? 0 },
    suspense: variables.suspense ?? true,
  });

  // Supplementary: Department filters (background)
  const departmentsQuery = useQuery(GetDepartmentsDocument, {
    variables: { first: 100, offset: 0 },
    suspense: false,  // ← Load in background
  });

  return {
    employees: listQuery,
    departments: departmentsQuery,
  };
}
```

## 3. Cache-Based Widget Data Loading

Once data is preloaded, widgets read from Apollo cache without re-fetching:

### Pattern: Cache Query with Same Variables
```tsx
// Page loads data with Suspense
export default function EmployeesPage() {
  const { data } = useQuery(GetEmployeesDocument, {
    variables: { first: 50, offset: 0 },
    suspense: true,
  });

  return (
    <div>
      <EmployeeTable employees={data.employees.edges} />
    </div>
  );
}

// Widget extracts from cache (no re-fetch)
export function EmployeeTable({ employees }) {
  // Already in cache from page query
  const { data } = useQuery(GetEmployeesDocument, {
    variables: { first: 50, offset: 0 },
    // Apollo serves from cache if available
  });

  // render...
}

// BETTER: Receive via props (no hook needed)
export function EmployeeTable({ employees, pageInfo }) {
  return (
    <table>
      {employees.map(emp => <tr key={emp.id}>{emp.name}</tr>)}
    </table>
  );
}
```

### Advanced: Cache Fragment Reads
```tsx
// Read subset of cached data using fragments
import { useFragment } from '@apollo/client';
import { EmployeeFieldsFragment } from '@/entities/core/employee/api';

export function EmployeeCard({ employeeId }) {
  const { data } = useFragment({
    fragment: EmployeeFieldsFragment,
    fragmentName: 'EmployeeFields',
    from: {
      __typename: 'Employee',
      id: employeeId,
    },
  });

  return <div>{data.name} - {data.department}</div>;
}
```

## 4. Dashboard Page Configurations

### Overview Page (Home)
```typescript
// Strategy: Single batch query with Suspense
// Data: Stats + Top departments + Recent Activity

// shared/lib/apollo-client/batch-queries.ts
export function useDashboardOverviewBatch(opts = {}) {
  return useQuery(GetDashboardOverviewDocument, {
    variables: {
      maxDepartments: 5,
      maxActivity: 10,
    },
    suspense: opts.suspense ?? true,
  });
}

// app/.../dashboard/page.tsx
export default function DashboardPage() {
  const { data } = useDashboardOverviewBatch({ suspense: true });

  return (
    <div className="space-y-6 p-6">
      <StatsCards stats={data.stats} />
      <CapacityOverview departments={data.departments} />
      <RecentActivity activities={data.recentActivity} />
    </div>
  );
}
```

### Employees Page
```typescript
// Strategy: Batch query for list + filters
// Data: Employee list + Departments (filters) + Capacity metrics

export function useEmployeesPageBatch(variables: {
  first?: number;
  offset?: number;
  suspense?: boolean;
}) {
  return useQuery(GetEmployeesWithFiltersDocument, {
    variables: {
      first: variables.first ?? 50,
      offset: variables.offset ?? 0,
    },
    suspense: variables.suspense ?? true,
  });
}

// app/.../dashboard/employees/page.tsx
export default function EmployeesPage() {
  const { data } = useEmployeesPageBatch();

  return (
    <div className="space-y-4">
      <EmployeeFilters departments={data.departments} />
      <EmployeeTable employees={data.employees.edges} pageInfo={data.employees.pageInfo} />
    </div>
  );
}
```

### Workload Page
```typescript
// Strategy: Parallel batch (trend + workload + rankings)
// Can be in single query or parallel queries

export function useWorkloadPageBatch(opts = {}) {
  return useQuery(GetWorkloadOverviewDocument, {
    variables: {
      maxDepartments: 20,
      maxEmployees: 30,
    },
    suspense: opts.suspense ?? true,
  });
}
```

## 5. Implementation Checklist

- [ ] Create batch query GraphQL documents (or use parallel queries)
- [ ] Create batch hooks in `shared/lib/apollo-client/batch-queries.ts`
- [ ] Add Suspense boundaries in layout components
- [ ] Update page components to use batch hooks with `suspense: true`
- [ ] Pass data as props to widgets (don't re-query)
- [ ] Widgets use cache reads OR receive data via props
- [ ] Test: Verify only 1-3 network requests per page load
- [ ] Test: Verify Suspense fallback shows during load
- [ ] Test: Verify no CLS (Cumulative Layout Shift)

## 6. Performance Tips

1. **Server-side query execution timing:** Ensure batch queries execute early (in layout preload)
2. **Cache normalization:** Use proper object IDs in GraphQL to enable automatic cache updates
3. **Fragment ownership:** Define fragments at entity level, import in widgets
4. **Refetch on action:** After mutation, refetch only affected query
5. **Pagination:** Use `offset/limit` pattern (as per PageInfo schema), maintain cache keys

## 7. Common Mistakes to Avoid

❌ **Mistake:** Suspense on mutations
```tsx
// DON'T DO THIS
const [mutate] = useMutation(CreateEmployeeDocument, { suspense: true });
```

❌ **Mistake:** Every widget re-queries same data
```tsx
// DON'T DO THIS - causes multiple requests
export function StatsCard() {
  useQuery(GetStatsDocument); // Re-query
}
export function StatsTable() {
  useQuery(GetStatsDocument); // Re-query again
}
```

✅ **Better:** Load once in page, pass to widgets
```tsx
// DO THIS
export default function DashboardPage() {
  const { data } = useQuery(GetStatsDocument, { suspense: true });
  return (
    <>
      <StatsCard stats={data.stats} />
      <StatsTable stats={data.stats} />
    </>
  );
}
```

❌ **Mistake:** No Suspense boundary
```tsx
// Will throw if resource suspends
export default function MyPage() {
  const { data } = useQuery(Q, { suspense: true });
}
```

✅ **Better:** Wrap with Suspense
```tsx
// Layout or wrapper component
export default function Layout({ children }) {
  return (
    <Suspense fallback={<Skeleton />}>
      {children}
    </Suspense>
  );
}
```

## 8. Recommended Architecture Summary

```
Page Component (layout or page.tsx)
├── Batch Query Hook (suspense: true)
│   └── Multiple related queries in parallel
├── Suspense Boundary
│   └── Page Content
│       ├── Widget A (receives data as props)
│       ├── Widget B (receives data as props)
│       └── Widget C (reads from cache if needed)
└── Optional Secondary Queries (suspense: false)
    └── Load in background via separate hooks
```

**Result:** 
- Single preload roundtrip per page
- Fast FCP (First Contentful Paint)
- Full page skeleton visible while loading
- All widgets synchronized on data arrival
- Clean data flow: page → props → widgets
