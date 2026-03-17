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
    suspense: true, // ← Key: enables Suspense
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
    suspense: false, // ← No suspension
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
  const [createEmployee, { loading, error }] = useMutation(
    CreateEmployeeDocument,
  );

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
      <button disabled={loading}>{loading ? "Creating..." : "Create"}</button>
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
    suspense: false, // ← Load in background
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
      {employees.map((emp) => (
        <tr key={emp.id}>{emp.name}</tr>
      ))}
    </table>
  );
}
```

### Advanced: Cache Fragment Reads

```tsx
// Read subset of cached data using fragments
import { useFragment } from "@apollo/client";
import { EmployeeFieldsFragment } from "@/entities/core/employee/api";

export function EmployeeCard({ employeeId }) {
  const { data } = useFragment({
    fragment: EmployeeFieldsFragment,
    fragmentName: "EmployeeFields",
    from: {
      __typename: "Employee",
      id: employeeId,
    },
  });

  return (
    <div>
      {data.name} - {data.department}
    </div>
  );
}
```

## 4. Suspense Boundary Architecture

### Recommended Layout Structure

```tsx
// app/layout.tsx (Root)
"use client";
import { Suspense } from "react";
import { RootSkeleton } from "@/shared/ui/skeletons";

export default function RootLayout({ children }) {
  return <Suspense fallback={<RootSkeleton />}>{children}</Suspense>;
}

// app/(protected)/layout.tsx (Authenticated)
("use client");
import { Suspense } from "react";
import { DashboardSkeleton } from "@/shared/ui/skeletons";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-3">
          <DashboardSidebar />
        </aside>
        <main className="col-span-9">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </Suspense>
  );
}

// app/(protected)/[locale]/dashboard/employees/page.tsx (Page)
("use client");
import { Suspense } from "react";
import { EmployeesWidget } from "@/widgets/dashboard/employees-widget";

export default function EmployeesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<EmployeesPageSkeleton />}>
      <EmployeesWidget
        initialPage={searchParams.page ?? "1"}
        initialSort={searchParams.sort ?? "fio"}
      />
    </Suspense>
  );
}
```

**Golden Rule:** Every Suspense boundary shows exactly one skeleton state, never mixed content.

---

## 5. Practical Dashboard Configurations

### Overview Page (Home) - Critical Path

```typescript
// entities/core/batch/index.ts
export const GET_DASHBOARD_OVERVIEW = gql`
  query GetDashboardOverview($companyId: ID!) {
    # Stats (must have)
    stats(companyId: $companyId) {
      totalEmployees
      totalDepartments
      activeAssignments
      avgWorkload
    }

    # Top departments (critical)
    topDepartments(first: 5, companyId: $companyId) {
      edges {
        id
        name
        headcount
        capacity { used allocated }
      }
    }

    # Recent activity (supplementary)
    recentActivity(limit: 10, companyId: $companyId) {
      id
      type
      description
      timestamp
    }
  }
`;

// widgets/dashboard/overview-widget.tsx
'use client';
import { useQuery } from '@apollo/client';
import { GetDashboardOverviewDocument } from '@/shared/graphql/generated';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DepartmentsList } from '@/features/department/list/ui';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export function OverviewWidget({ companyId }: { companyId: string }) {
  const { data } = useQuery(GetDashboardOverviewDocument, {
    variables: { companyId },
    suspense: true,
  });

  return (
    <div className="grid gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard label="Employees" value={data.stats.totalEmployees} />
        <StatsCard label="Departments" value={data.stats.totalDepartments} />
        <StatsCard label="Assignments" value={data.stats.activeAssignments} />
        <StatsCard label="Avg Workload" value={data.stats.avgWorkload} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Departments list (from cache) */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Top Departments</h2>
          <div className="space-y-3">
            {data.topDepartments.edges.map(dept => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </section>

        {/* Right: Activity feed (supplementary) */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ActivityFeed activities={data.recentActivity} />
        </section>
      </div>
    </div>
  );
}
```

### Employees Page - Standard List Pattern

```typescript
// GraphQL Query
export const GET_EMPLOYEES_PAGE = gql`
  query GetEmployeesPage(
    $companyId: ID!
    $first: Int!
    $offset: Int!
    $filter: EmployeeFilterInput
    $sort: EmployeeSortInput
  ) {
    employees(
      companyId: $companyId
      first: $first
      offset: $offset
      filter: $filter
      sort: $sort
    ) {
      edges {
        id
        fio
        departmentId
        gradeId
        status
        capacity { used allocated }
      }
      pageInfo {
        total
        hasMore
        offset
      }
    }

    # Supplementary: Filters
    departments(companyId: $companyId, first: 100) {
      edges { id name }
    }
  }
`;

// Feature Hook
export function useEmployeesPage(variables: {
  first?: number;
  offset?: number;
  filter?: EmployeeFilter;
  sort?: EmployeeSort;
}) {
  // Critical data with Suspense
  const listQuery = useQuery(GetEmployeesPageDocument, {
    variables: {
      companyId: useCompanyStore(s => s.currentCompany.id),
      first: variables.first ?? 50,
      offset: variables.offset ?? 0,
      filter: variables.filter,
      sort: variables.sort ?? { field: 'fio', direction: 'ASC' },
    },
    suspense: true,
  });

  return listQuery.data;
}

// Widget
export function EmployeesWidget({ initialPage = '1', initialSort = 'fio' }) {
  const [pagination, setPagination] = useState({ page: parseInt(initialPage), pageSize: 50 });
  const [sort, setSort] = useState(initialSort);

  const data = useEmployeesPage({
    first: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize,
    sort: { field: sort, direction: 'ASC' },
  });

  return (
    <div className="space-y-6">
      <EmployeeListFeature
        employees={data.employees.edges}
        pageInfo={data.employees.pageInfo}
        onPageChange={(page) => setPagination(p => ({ ...p, page }))}
        onSortChange={setSort}
      />
    </div>
  );
}
```

### Analytics Page - Progressive Loading

```typescript
// Strategy: Critical data with Suspense, analytics in background

export function AnalyticsWidget({ companyId }: { companyId: string }) {
  // Critical: Summary stats (Suspense)
  const summaryQuery = useQuery(GetAnalyticsSummaryDocument, {
    variables: { companyId },
    suspense: true,
  });

  // Secondary: Charts (no Suspense, load in background)
  const chartsQuery = useQuery(GetAnalyticsChartsDocument, {
    variables: { companyId },
    suspense: false,
  });

  // Tertiary: AI Insights (no Suspense, lazy load)
  const insightsQuery = useQuery(GetInsightsDocument, {
    variables: { companyId },
    suspense: false,
    skip: !showInsights,  // Only fetch when needed
  });

  return (
    <div className="space-y-6">
      {/* Always visible */}
      <SummarySection summary={summaryQuery.data?.summary} />

      {/* Shows loading state independently */}
      <ChartSection
        data={chartsQuery.data}
        loading={chartsQuery.loading}
        error={chartsQuery.error}
      />

      {/* Lazy loaded */}
      {insightsQuery.data && (
        <InsightsSection insights={insightsQuery.data} />
      )}
    </div>
  );
}
```

---

## 6. Cache Invalidation & Updates

### Pattern 1: refetchQueries (Simple, Network Cost)

```tsx
// ✅ Use when: Simple mutation, small impact
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  refetchQueries: [
    { query: GetEmployeeDocument, variables: { id: employeeId } },
    { query: GetEmployeesDocument, variables: { first: 50, offset: 0 } },
  ],
});
```

### Pattern 2: cache.modify (Efficient, Complex)

```tsx
// ✅ Use when: Large list, multiple mutations, performance critical
const [createEmployee] = useMutation(CreateEmployeeDocument, {
  update(cache, { data: { createEmployee } }) {
    // Read current list from cache
    const cached = cache.readQuery({
      query: GetEmployeesDocument,
      variables: { first: 50, offset: 0 },
    });

    // Update cache without network
    cache.writeQuery({
      query: GetEmployeesDocument,
      variables: { first: 50, offset: 0 },
      data: {
        employees: {
          ...cached.employees,
          edges: [createEmployee, ...cached.employees.edges],
          pageInfo: {
            ...cached.employees.pageInfo,
            total: cached.employees.pageInfo.total + 1,
          },
        },
      },
    });
  },
});
```

### Pattern 3: Optimistic Updates (Best UX)

```tsx
// ✅ Use when: Mutation success is predictable
const [updateEmployee] = useMutation(UpdateEmployeeDocument, {
  optimisticResponse: {
    updateEmployee: {
      __typename: "Employee",
      id: employeeId,
      ...formData,
    },
  },
  update(cache, { data: { updateEmployee } }) {
    cache.modify({
      fields: {
        employee(existing) {
          return updateEmployee;
        },
      },
    });
  },
});
```

---

## 7. Error Handling in Suspense Context

### Suspense + Error Boundary Pattern

```tsx
// app/(protected)/layout.tsx
"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardSkeleton } from "@/shared/ui/skeletons";

export default function DashboardLayout({ children }) {
  return (
    <ErrorBoundary FallbackComponent={DashboardError}>
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-12">
          <Sidebar />
          <main className="col-span-9">
            <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
          </main>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

// Catch GraphQL errors
function DashboardError({ error, resetErrorBoundary }: ErrorBoundaryProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded">
      <h1 className="text-lg font-semibold text-red-900">
        Something went wrong
      </h1>
      <p className="text-red-700 mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## 8. Decision Tree: Which Pattern to Use?

```
Is this page-load data? (Layout, structure)
  YES → Use Suspense Query
    Is it single piece of data?
      YES → Single query + Suspense
      NO  → Batch query OR parallel queries + Suspense

  NO → Is it user-triggered?
    YES → Use mutation (never Suspense)
    NO  → Is it optional/secondary?
      YES → Regular query (suspense: false)
      NO  → Use progressive loading (Suspense for critical, background for secondary)

Post-mutation, update cache:
  Is change small & predictable?
    YES → Use optimistic update
    NO  → Is it a single item mutation?
      YES → cache.modify
      NO  → refetchQueries OR cache.modify on collection
```

---

## 9. Performance Checklist

- [ ] All page-level data uses Suspense
- [ ] Batch queries combine related data (max 3 network calls per page)
- [ ] Widgets receive data via props, not re-fetching
- [ ] Mutations use optimistic updates for Create/Update/Delete
- [ ] Large list mutations use cache.modify, not refetchQueries
- [ ] Error boundaries wrap Suspense boundaries
- [ ] No waterfall queries (query B after query A completes)
- [ ] Pagination uses cached data + offset variables
- [ ] AI Insights load in background (suspense: false)

---

## 10. Complete Example: Dashboard Page

```tsx
// app/(protected)/[locale]/dashboard/page.tsx
"use client";
import { Suspense } from "react";
import { OverviewWidget } from "@/widgets/dashboard/overview-widget";
import { DashboardPageSkeleton } from "@/shared/ui/skeletons";
import { useCompanyStore } from "@/shared/stores";

export default function DashboardPage() {
  const companyId = useCompanyStore((s) => s.currentCompany?.id);

  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <OverviewWidget companyId={companyId} />
    </Suspense>
  );
}

// widgets/dashboard/overview-widget.tsx
("use client");
import { useQuery } from "@apollo/client";
import { GetDashboardOverviewDocument } from "@/shared/graphql/generated";

export function OverviewWidget({ companyId }) {
  // Single batch query with Suspense
  const { data } = useQuery(GetDashboardOverviewDocument, {
    variables: { companyId },
    suspense: true,
  });

  return (
    <div className="grid gap-6">
      {/* Widgets extract from data passed via props */}
      <StatsSection stats={data.stats} />
      <DepartmentsSection departments={data.topDepartments} />
      <ActivitySection activity={data.recentActivity} />
    </div>
  );
}
```

This is production-ready. Use it.
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

````

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
````

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
  return <Suspense fallback={<Skeleton />}>{children}</Suspense>;
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
