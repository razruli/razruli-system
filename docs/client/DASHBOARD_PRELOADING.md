# Dashboard Data Preloading Implementation Guide

## Overview

This guide explains the complete data preloading and consumption pattern implemented for the dashboard. The system uses Apollo Client with Suspense integration to preload data at the layout level and consume it efficiently in pages.

## Architecture Flow

```
App User
   ↓
Dashboard Layout (Async Server Component)
   ├── Get Company ID from slug
   ├── Preload Dashboard Data via PreloadQuery
   │   └── GetDashboardOverviewDocument
   └── Pass children to client
        ↓
   Dashboard Page (Client Component)
   ├── Read company from Apollo cache
   ├── Render DashboardOverview component
   └── Display preloaded data
```

## Components

### 1. **GraphQL Queries**

Located in: `entities/core/dashboard/api/queries/`

#### `getDashboardOverview.graphql`

Fetches comprehensive dashboard data in a single query:

- Employees list (with department, grade, status)
- Departments list (with head information)
- Company details

**Variables:**

```graphql
{
  companyId: String!
  departmentFilter: DepartmentFilterInput!
  employeeFilter?: EmployeeFilterInput
  employeePagination?: EmployeePaginationInput
}
```

#### `getDashboardStats.graphql`

Fetches optimized stats for quick rendering:

- Total employee count
- Total department count
- Company info

### 2. **Entity Hooks**

Located in: `entities/core/dashboard/api/queries/hooks/`

#### `useGetDashboardOverview`

Thin Apollo Client wrapper for the overview query:

```typescript
const { data, loading, error, refetch } = useGetDashboardOverview({
  companyId: "company-123",
  departmentFilter: { companyId: "company-123" },
});
```

#### `useGetDashboardStats`

Thin Apollo Client wrapper for stats query:

```typescript
const { data, loading, error } = useGetDashboardStats({
  companyId: "company-123",
});
```

### 3. **Feature Hooks**

Located in: `features/core/dashboard/lib/hooks/`

#### `useDashboardOverview`

Feature-level hook that manages dashboard state and data:

```typescript
export function useDashboardOverview(params: UseDashboardOverviewParams) {
  const { companyId, departmentFilter, employeeFilter, employeePagination } =
    params;

  // Connect to entity hooks
  const { data, loading, error, refetch } = useGetDashboardOverview({
    companyId,
    departmentFilter,
    employeeFilter: employeeFilter || { companyId },
    employeePagination: employeePagination || { offset: 0, limit: 20 },
  });

  return {
    dashboardData: { employees, departments, company },
    isLoading: loading,
    error,
    refetch,
  };
}
```

### 4. **Layout - Data Preloading**

Located in: `app/(protected)/[locale]/[tenantSlug]/dashboard/layout.tsx`

```typescript
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  // Get company from cache (preloaded in parent layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  const companyId = companyData?.companyBySlug?.id;

  // Preload dashboard data with PreloadQuery
  return (
    <PreloadQuery
      query={GetDashboardOverviewDocument}
      variables={{
        companyId,
        departmentFilter: { companyId },
        employeeFilter: { companyId },
        employeePagination: { offset: 0, limit: 20 },
      }}
    >
      <DashboardSidebar />
      {children}
    </PreloadQuery>
  );
}
```

### 5. **Page - Data Consumption**

Located in: `app/(protected)/[locale]/[tenantSlug]/dashboard/page.tsx`

```typescript
export default function DashboardPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  // Get current company from Apollo cache
  const { data: companyData } = useQuery(GetCompanyBySlugDocument, {
    variables: { slug: params.tenantSlug },
  });

  const companyId = companyData?.companyBySlug?.id;

  return <DashboardOverview companyId={companyId} />;
}
```

### 6. **Client Component - Display**

Located in: `app/(protected)/[locale]/[tenantSlug]/dashboard/DashboardOverview.tsx`

```typescript
export function DashboardOverview({ companyId }: DashboardOverviewProps) {
  const client = useQueryClient();

  // Read preloaded data from Apollo cache
  const cacheData = useMemo(() => {
    try {
      const data = client.readQuery({
        query: GetDashboardOverviewDocument,
        variables: {
          companyId,
          departmentFilter: { companyId },
          employeeFilter: { companyId },
          employeePagination: { offset: 0, limit: 20 },
        },
      });
      return data;
    } catch (error) {
      console.warn("Failed to read dashboard data from cache", error);
      return null;
    }
  }, [client, companyId]);

  // Calculate stats from cached data
  const stats = useMemo(() => {
    // ... stats calculation
  }, [cacheData]);

  return (
    <div className="space-y-6 p-6">
      {/* Render dashboard with preloaded data */}
    </div>
  );
}
```

## Data Flow Pattern

### Authentication & Context

1. User authenticated via `better-auth`
2. Session established with user and actor
3. Context passed through GraphQL middleware
4. Permissions validated in resolvers

### Data Preloading at Layout Level

1. **Server Component** (`dashboard/layout.tsx`)
   - Runs on server during request
   - Has access to params
   - Uses `query()` to fetch from GraphQL
   - Wraps children with `<PreloadQuery>`

2. **PreloadQuery Component**
   - Server-side Suspense boundary
   - Executes query during server render
   - Stores result in Apollo cache
   - Passes cache to client children

### Data Consumption at Page Level

1. **Client Component** (`dashboard/page.tsx`)
   - Uses `useQuery()` to read from cache
   - Data already available (no loading state)
   - Renders immediately with data

2. **Display Component** (`DashboardOverview.tsx`)
   - Uses `useQueryClient()` to access cache
   - Uses `readQuery()` to safely read data
   - Memoizes calculations for performance
   - Handles missing data gracefully

## Cache Management

### Cache Invalidation After Mutations

When mutations occur (create/update/delete employee, department, etc.):

```typescript
useMutation(CreateEmployeeMutation, {
  refetchQueries: [
    { query: GetEmployeesDocument },
    { query: GetDashboardOverviewDocument, variables: { companyId } },
  ],
});
```

### Cache Update Strategies

1. **Automatic Cache Update**
   - Apollo Client automatically updates cache with mutation results
   - Connected data is normalized and updated

2. **Manual Cache Update**
   - Use `client.cache.modify()` for optimistic updates
   - Use `invalidateDashboardCache()` for complete refresh

3. **Cache Persistence**
   - Dashboard queries can be persisted to localStorage
   - Allows for faster page loads and offline support

## Performance Optimizations

### 1. **Efficient Data Loading**

- Dashboard overview preloaded at layout level
- Data cached and reused across component tree
- No waterfall requests

### 2. **Memoization**

- Dashboard calculations memoized with `useMemo`
- Prevent unnecessary recalculations
- Improve render performance

### 3. **Selective Data Fetching**

- Employee pagination limits initial load (20 items)
- Department list loaded fully (usually smaller datasets)
- Company info minimal (single object)

### 4. **Error Handling**

- Safe cache reads with try-catch
- Graceful fallbacks for missing data
- Error messages for debugging

## Implementation Checklist

- [x] Create dashboard GraphQL queries
- [x] Generate types via codegen
- [x] Implement entity hooks (thin Apollo wrappers)
- [x] Create feature hook connecting entity to feature layer
- [x] Update dashboard layout with PreloadQuery
- [x] Update dashboard page to consume data
- [x] Create display component with cache reading
- [ ] Add mutation refetch queries
- [ ] Implement optimistic updates
- [ ] Add loading error boundaries
- [ ] Add analytics tracking
- [ ] Performance profiling

## Usage Examples

### Using Dashboard Overview in a Widget

```typescript
// In a child component of dashboard page
import { useDashboardOverview } from "@/features/core/dashboard";

export function EmployeeStatsWidget({ companyId }: { companyId: string }) {
  const { dashboardData, isLoading, error } = useDashboardOverview({
    companyId,
    departmentFilter: { companyId },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Total Employees: {dashboardData?.employees?.totalCount}</h3>
    </div>
  );
}
```

### Refetching Dashboard Data

```typescript
export function DashboardRefreshButton({ companyId }: { companyId: string }) {
  const { refetch } = useDashboardOverview({
    companyId,
    departmentFilter: { companyId },
  });

  return (
    <button onClick={() => refetch()}>
      Refresh Dashboard
    </button>
  );
}
```

### Custom Mutation with Cache Invalidation

```typescript
const [createEmployee] = useMutation(CreateEmployeeMutation, {
  refetchQueries: [
    {
      query: GetDashboardOverviewDocument,
      variables: { companyId, departmentFilter: { companyId } },
    },
  ],
});
```

## Testing

### Unit Tests

- Test entity hooks with mock Apollo Client
- Test feature hooks with mock entity hooks
- Test cache reading logic

### Integration Tests

- Test full data flow from layout to display
- Test mutation cache invalidation
- Test error handling

### E2E Tests

- Test dashboard page load with real GraphQL
- Test data updates after mutations
- Test responsive layout

## Troubleshooting

### "Data not found in cache" Error

**Problem:** Component trying to read data not preloaded
**Solution:** Ensure PreloadQuery wraps the component or use useQuery fallback

### Stale Cache Data

**Problem:** Dashboard showing old data after mutations
**Solution:** Configure refetchQueries on mutations
**Example:**

```typescript
useMutation(CreateEmployeeMutation, {
  refetchQueries: [{ query: GetDashboardOverviewDocument, variables }],
});
```

### Slow Dashboard Loads

**Problem:** Dashboard page taking too long to render
**Solution:**

1. Check if data is actually preloaded
2. Verify cache is being used (not making new requests)
3. Profile with React DevTools
4. Consider pagination/limiting data

### Permission Denied on Queries

**Problem:** Resolver returning permission error
**Solution:** Verify user has correct permissions via auth middleware
**Check:** Look at GraphQL errors in browser console

## Next Steps

1. **Connect Widgets**: Update existing dashboard widgets to use preloaded data
2. **Add Mutations**: Implement create/update/delete operations with cache invalidation
3. **Error Boundaries**: Add React error boundaries for graceful error handling
4. **Analytics**: Add tracking for dashboard views and interactions
5. **Performance**: Monitor and optimize using Next.js and Apollo DevTools
