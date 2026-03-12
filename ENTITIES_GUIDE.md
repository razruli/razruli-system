# Entities Layer with GraphQL Codegen Client-Preset

## Architecture Overview

The entities layer organizes domain models with the FSD (Feature-Sliced Design) slices pattern:

```
entities/
├── core/
│   ├── employee/
│   │   ├── model/
│   │   │   ├── types.ts          # TypeScript interfaces (Employee, Grade, etc.)
│   │   │   └── index.ts          # Export all types
│   │   ├── api/
│   │   │   ├── queries/
│   │   │   │   ├── *.graphql     # Query definitions (getEmployee.graphql, etc.)
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useGetEmployee.ts     # Apollo useQuery wrapper
│   │   │   │   │   ├── useGetEmployees.ts   # Apollo useQuery wrapper
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts      # Export all query hooks
│   │   │   ├── mutations/
│   │   │   │   ├── *.graphql     # Mutation definitions
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useCreateEmployee.ts   # Apollo useMutation wrapper
│   │   │   │   │   ├── useUpdateEmployee.ts   # Apollo useMutation wrapper
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts      # Export all mutation hooks
│   │   │   └── index.ts          # Export queries & mutations
│   │   └── index.ts              # Export model & api
│   ├── department/               # Same structure as employee
│   └── index.ts                  # Export all core entities
└── index.ts                      # Main entry point
```

## How Codegen Works

### Document Discovery

Codegen processes all GraphQL files from:

```ts
documents: [
  "shared/graphql/client/**/*.graphql",
  "entities/**/api/queries/**/*.graphql",
  "entities/**/api/mutations/**/*.graphql",
];
```

### Code Generation

With `@graphql-codegen/client-preset`:

```ts
"shared/graphql/generated/": {
  preset: "client",
  presetConfig: {
    fragmentMasking: false,
  },
  config: {
    scalars: { DateTime: "Date", JSON: "Record<string, any>" }
  }
}
```

**Generates to `shared/graphql/generated/graphql.ts`:**

- `GetEmployeeDocument` - TypedDocumentNode for the query
- `GetEmployeeQuery` - Response type
- `GetEmployeeQueryVariables` - Variables type
- (And all other queries/mutations from both shared/ and entities/)

### Entity Hooks Layer

Each entity hook wraps the generated document for a clean public API:

```ts
// entities/core/employee/api/queries/hooks/useGetEmployee.ts
"use client";

import { useQuery } from "@apollo/client";
import {
  GetEmployeeDocument,
  type GetEmployeeQuery,
  type GetEmployeeQueryVariables,
} from "@/shared/graphql/generated";

export function useGetEmployee(variables: GetEmployeeQueryVariables) {
  return useQuery<GetEmployeeQuery, GetEmployeeQueryVariables>(
    GetEmployeeDocument,
    { variables },
  );
}
```

### Re-export Hierarchy

```
api/queries/index.ts
  └─> export * from './hooks'
      └─> export useGetEmployee, useGetEmployees, ...

api/index.ts
  └─> export * from './queries'
      └─> export * from './mutations'

employee/index.ts
  └─> export * from './api'
      └─> export * from './model'
```

## Usage Examples

### Using Query Hooks

```ts
// In a feature hook
import { useGetEmployee } from "@/entities/core/employee";

export function useEmployeeDetail(employeeId: string) {
  const { data, loading, error } = useGetEmployee({ id: employeeId });

  return { employee: data?.employee, loading, error };
}
```

### Using Mutation Hooks

```ts
import { useCreateEmployee } from "@/entities/core/employee";

export function useEmployeeForm() {
  const [createEmployee, { loading, error }] = useCreateEmployee();

  const handleSubmit = async (input: CreateEmployeeInput) => {
    const result = await createEmployee({
      variables: { input },
      refetchQueries: ["GetEmployees"], // Apollo automatic refetch
    });
    return result.data?.createEmployee;
  };

  return { createEmployee: handleSubmit, loading, error };
}
```

### Integration with Features Layer

```ts
// features/core/employee/list/lib/hooks/useEmployeeList.ts
"use client";

import { useGetEmployees } from "@/entities/core/employee";
import { useEmployeeListStore } from "../../model/store";

export function useEmployeeList() {
  const store = useEmployeeListStore();

  const { data, loading, error } = useGetEmployees({
    filter: {
      companyId: getCurrentCompanyId(),
      status: "active",
    },
    pagination: {
      limit: store.limit,
      offset: (store.page - 1) * store.limit,
    },
  });

  return {
    employees: data?.employees?.nodes ?? [],
    total: data?.employees?.totalCount ?? 0,
    loading,
    error,
    ...store,
  };
}
```

## Adding New Entity Queries/Mutations

### Step 1: Add GraphQL File

```graphql
# entities/core/employee/api/queries/getEmployeeWithDepartment.graphql
query GetEmployeeWithDepartment($id: String!) {
  employee(id: $id) {
    id
    fio
    department {
      id
      name
    }
  }
}
```

### Step 2: Create Hook

```ts
// entities/core/employee/api/queries/hooks/useGetEmployeeWithDepartment.ts
"use client";

import { useQuery } from "@apollo/client";
import {
  GetEmployeeWithDepartmentDocument,
  type GetEmployeeWithDepartmentQuery,
  type GetEmployeeWithDepartmentQueryVariables,
} from "@/shared/graphql/generated";

export function useGetEmployeeWithDepartment(
  variables: GetEmployeeWithDepartmentQueryVariables,
) {
  return useQuery<
    GetEmployeeWithDepartmentQuery,
    GetEmployeeWithDepartmentQueryVariables
  >(GetEmployeeWithDepartmentDocument, { variables });
}
```

### Step 3: Export from Hook Index

```ts
// entities/core/employee/api/queries/hooks/index.ts
export { useGetEmployee } from "./useGetEmployee";
// ... existing exports
export { useGetEmployeeWithDepartment } from "./useGetEmployeeWithDepartment";
```

### Step 4: Run Codegen

```bash
npm run graphql:codegen
```

Codegen discovers the new `.graphql` file and generates the TypedDocumentNode automatically.

## Benefits of This Approach

✅ **Type-safe**: All hooks are fully typed via codegen  
✅ **Encapsulated**: Entity logic stays in entities layer  
✅ **Clean imports**: Features import hooks, not documents  
✅ **Single codegen pass**: All documents processed together  
✅ **No import confusion**: No mixing of re-exports vs generated  
✅ **Scalable**: Easy to add new queries/mutations  
✅ **Testable**: Each hook can be tested independently

## File Structure Best Practices

- **model/types.ts**: Manual TypeScript interfaces (match Prisma models)
- **api/queries/\*.graphql**: Query definitions (one per file)
- **api/queries/hooks/\*.ts**: Apollo useQuery wrappers
- **api/mutations/\*.graphql**: Mutation definitions
- **api/mutations/hooks/\*.ts**: Apollo useMutation wrappers
- **index.ts files**: Re-export public API (hide implementation)

## For Dashboard-Specific Queries

If a query doesn't map to an entity (e.g., `DASHBOARD_OVERVIEW_QUERY`), keep it in `shared/graphql/client/`:

```ts
// shared/graphql/client/dashboardQueries.graphql
query DashboardOverview($companyId: String!) {
  stats(companyId: $companyId) { /* ... */ }
  recentActivity(companyId: $companyId) { /* ... */ }
}

// Import and use directly from shared
import { useSuspenseQuery } from '@apollo/client';
import { DashboardOverviewDocument } from '@/shared/graphql/generated';

export function DashboardPage() {
  const { data } = useSuspenseQuery(DashboardOverviewDocument, {
    variables: { companyId }
  });
}
```
