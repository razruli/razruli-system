# Data Preloading & Context Setup - Summary

**Date:** March 21, 2026  
**Status:** ✅ IMPLEMENTED & VERIFIED

## What's Been Fixed/Configured

### 1. **User + Actor in GraphQL Context** ✅

**File:** `server/auth/getUserFromRequest.ts`

- Fetches session from better-auth
- Retrieves Actor from database using `user.id`
- Includes actor roles, permissions, company, department
- Returns both user and actor in session

**File:** `server/graphql/context/context.ts`

- Extracts user and actor from session
- Passes both to `buildGraphQLContext()`

**File:** `server/graphql/context/builder.ts`

- Accepts both `user` and `actor` parameters
- Builds ServiceContext with user and actor
- Returns GraphQLContext with user and actor available to resolvers

**Result:**

```typescript
// In any resolver:
const { user, actor } = context;

// User: from better-auth (email, id, etc.)
// Actor: business entity (name, company, department, roles, permissions)
```

### 2. **Data Preloading in Dashboard Layouts** ✅

All dashboard child layouts use `PreloadQuery` to preload data **before** children render:

#### Dashboard Overview

**File:** `app/(protected)/[locale]/[tenantSlug]/dashboard/layout.tsx`

- Preloads: `GetDashboardOverviewDocument`
- Variables: `companyId`, `departmentFilter`, `employeeFilter`
- Data available to all dashboard children via Apollo cache

#### Employees Route

**File:** `app/(protected)/[locale]/[tenantSlug]/dashboard/employees/layout.tsx`

- Preloads: `GetEmployeesDocument`
- Variables: `filter: { companyId }`
- Data consumed in `employees/page.tsx`

#### Departments Route

**File:** `app/(protected)/[locale]/[tenantSlug]/dashboard/departments/layout.tsx`

- Preloads: `GetDepartmentsDocument`
- Variables: `filter: { companyId }`
- Data consumed in `departments/page.tsx`

#### Processes Route

**File:** `app/(protected)/[locale]/[tenantSlug]/dashboard/processes/layout.tsx`

- Preloads: `GetProcessesDocument`
- Variables: `filter: { companyId }`
- Data consumed in `processes/page.tsx`

### 3. **Data Consumption in Pages** ✅

Pages use `query()` function to read preloaded data from Apollo cache:

```typescript
// app/(protected)/[locale]/[tenantSlug]/dashboard/employees/page.tsx
const { data: employeesData } = await query({
  query: GetEmployeesDocument,
  variables: { filter: { companyId } },
});

const employees = employeesData?.employees?.nodes || [];
```

**Benefits:**

- Data already in cache (preloaded in layout)
- No additional network requests
- Instant data access
- Server-side rendering with fresh data

---

## Data Flow Architecture

```
Request to /en/company-slug/dashboard/employees
        ↓
[Protected Layout] - Authenticates user
        ↓
[TenantLayout] - Gets company by slug
        ↓
[DashboardLayout] - Preloads GetDashboardOverviewDocument
        ↓
[EmployeesLayout] - Preloads GetEmployeesDocument
        ↓
[EmployeesPage] - Reads preloaded employees from cache
        ↓
Render page with data (no loading state)
```

---

## Context Flow for Resolvers

```
Request to /api/graphql (GetEmployeesQuery)
        ↓
createContext()
  ├─ getUserFromRequest() → gets session
  ├─ Extract user from session
  ├─ Fetch actor from DB using user.id
  └─ buildGraphQLContext(prisma, user, actor)
        ↓
buildGraphQLContext()
  ├─ Create DataLoaders
  ├─ Create Cache
  ├─ Build ServiceContext with user + actor
  ├─ Create Services using ServiceContext
  └─ Return GraphQLContext
        ↓
Resolver receives context
  ├─ context.user → Authenticated user
  ├─ context.actor → Business entity with roles/permissions
  ├─ context.services → All domain services
  └─ context.loaders → DataLoaders for batching
        ↓
Resolver can access:
  - User information (email, id)
  - Actor information (company, department, roles, permissions)
  - Any domain service (employee, department, process, etc.)
```

---

## What's NOT Changed (Preserved)

✅ All dashboard widget structure (overview, employees, departments, etc.)
✅ Feature layer organization
✅ Entity structure
✅ All existing GraphQL queries and resolvers
✅ Authentication flow with better-auth
✅ All existing components and pages

---

## Verification Checklist

- [x] User fetched from better-auth session
- [x] Actor fetched from database using user.id
- [x] Both user and actor passed to GraphQL context
- [x] All dashboard layouts preload data
- [x] All dashboard pages consume preloaded data
- [x] CompanyBySlug query returns company.name
- [x] All resolvers have access to user and actor
- [x] No permissions blocking (logged-in = allowed)
- [x] Build compiles successfully (actor context changes)

---

## How to Use in Resolvers

### Accessing User/Actor

```typescript
// employee.query.ts
const employeeResolver: QueryResolvers["employees"] = async (
  _parent,
  { filter, pagination },
  context, // ← Has user and actor
) => {
  // User from auth
  if (!context.user) {
    throw new Error("Must be authenticated");
  }

  // Actor from business context
  if (!context.actor) {
    throw new Error("Actor not found");
  }

  // Later: Check permissions
  // if (!context.actor.roles.some(r => r.role.name === "ADMIN")) {
  //   throw new Error("Must be admin");
  // }

  // Call service
  return context.services.employee.find(filter, pagination);
};
```

### Example Service Usage

```typescript
// In EmployeeService
async find(filter, pagination) {
  // Services already have access to context.user and context.actor
  const actors = await this.context.prisma.actor.findMany({
    where: { companyId: this.context.actor.companyId },
  });

  return employees;
}
```

---

## Files Modified

1. **server/auth/getUserFromRequest.ts** - Added actor fetching
2. **server/graphql/context/context.ts** - Extracts actor from session
3. **server/graphql/context/builder.ts** - Accepts and passes actor to context

---

## Ready For

✅ Accessing user and actor in resolvers  
✅ Consuming preloaded data in dashboard pages  
✅ Validating permissions when needed  
✅ Accessing company/department context via actor

---

## Next Steps (When Ready)

1. Add permission checks to resolvers (require specific roles)
2. Implement mutations with cache invalidation
3. Add audit logging using actor information
4. Implement row-level security (only access own company data)
