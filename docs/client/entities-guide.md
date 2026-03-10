# Entity Documentation Guide

## What is an Entity?

An entity is a **data domain** - it defines what the data looks like and how to fetch/mutate it from the server.

Entities are the **bridge between client and server**. They contain:

- TypeScript types (what data looks like)
- Zod schemas (validation for forms)
- GraphQL documents (queries & mutations)
- Apollo hooks (how to fetch/mutate data)

**Entities are NOT:**

- UI components
- User action logic
- Business logic
- Filtering/sorting logic

---

## Entity Folder Structure

```
entities/[entity]/
├── model.ts                 # TypeScript types
├── schema.ts                # Zod validation schemas
├── api/
│   ├── queries.ts          # GraphQL queries
│   ├── mutations.ts        # GraphQL mutations
│   └── subscriptions.ts    # GraphQL subscriptions (real-time)
├── hooks.ts                # Apollo hooks (data fetching)
└── index.ts                # Public API
```

---

## File Breakdown

### `model.ts` - TypeScript Types

Define the shape of entity data.

```typescript
// entities/employee/model.ts
export type Employee = {
  id: string;
  fio: string; // Full name (Russian: фио)
  email: string;
  departmentId: string;
  gradeId: string;
  employmentStatus: "active" | "vacation" | "sick" | "dismissed";
  capacity?: {
    p_month: number; // Monthly capacity (hours)
    p_week: number; // Weekly capacity (hours)
  };
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeListResponse = {
  nodes: Employee[];
  total: number;
  pages: number;
};

export type CreateEmployeeInput = Omit<
  Employee,
  "id" | "createdAt" | "updatedAt" | "capacity"
>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
```

**Guidelines:**

- Export types as-is (no `export interface` - use `type`)
- Include all fields from server schema
- Include optional fields as `?`
- Separate response types from input types
- Include related types (Response, Input, etc.)

---

### `schema.ts` - Zod Validation

Validate form data before sending to server.

```typescript
// entities/employee/schema.ts
import { z } from "zod";

// Create validation
export const employeeCreateSchema = z.object({
  fio: z.string().min(1, "Name required").max(255, "Name too long"),
  email: z.string().email("Valid email required"),
  departmentId: z
    .string()
    .min(1, "Department required")
    .uuid("Invalid department ID"),
  gradeId: z.string().min(1, "Grade required").uuid("Invalid grade ID"),
  employmentStatus: z
    .enum(["active", "vacation", "sick", "dismissed"])
    .default("active"),
});

// Update validation (all fields optional)
export const employeeUpdateSchema = employeeCreateSchema.partial();

// Export inferred types for use in components
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;

// Filter validation (for list filters)
export const employeeFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["active", "vacation", "sick", "dismissed"]).optional(),
  departmentId: z.string().uuid().optional(),
  gradeId: z.string().uuid().optional(),
});

export type EmployeeFilter = z.infer<typeof employeeFilterSchema>;
```

**Guidelines:**

- One schema per action (create, update, filter)
- Use `z.infer<typeof schema>` to extract TypeScript types
- Include validation messages (shown to users)
- Handle optional vs required fields correctly
- Use `.partial()` for update schemas
- Reference other entity schemas if needed

---

### `api/queries.ts` - GraphQL Queries

Define queries to fetch data from server.

```typescript
// entities/employee/api/queries.ts
import { gql } from "@apollo/client";

// List employees (paginated, sortable, filterable)
export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $tenantSlug: String!
    $page: Int!
    $limit: Int = 20
    $sort: String
    $filter: String
  ) {
    employees(
      tenantSlug: $tenantSlug
      pagination: { page: $page, limit: $limit }
      sort: $sort
      filter: $filter
    ) {
      nodes {
        id
        fio
        email
        department {
          id
          name
        }
        grade {
          id
          name
          kGrade
        }
        employmentStatus
      }
      total
      pages
      page
      limit
    }
  }
`;

// Get single employee with full details
export const GET_EMPLOYEE = gql`
  query GetEmployee($id: String!) {
    employee(id: $id) {
      id
      fio
      email
      departmentId
      gradeId
      employmentStatus
      department {
        id
        name
      }
      grade {
        id
        name
        kGrade
      }
      capacity {
        p_month
        p_week
      }
      createdAt
      updatedAt
    }
  }
`;

// Get employee capacity
export const GET_EMPLOYEE_CAPACITY = gql`
  query GetEmployeeCapacity($id: String!) {
    employee(id: $id) {
      id
      capacity {
        p_month
        p_week
      }
    }
  }
`;
```

**Guidelines:**

- Query names: `GET_[ENTITY]` (singular) or `GET_[ENTITIES]` (plural)
- Include pagination variables for list queries
- Include sort and filter variables for list queries
- Request only fields needed (avoid over-fetching)
- Name operation (query name) explicitly
- Group related fields with named fragments if complex

---

### `api/mutations.ts` - GraphQL Mutations

Define mutations to create/update/delete data.

```typescript
// entities/employee/api/mutations.ts
import { gql } from "@apollo/client";

// Create employee
export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      fio
      email
      departmentId
      gradeId
      employmentStatus
    }
  }
`;

// Update employee
export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: String!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      fio
      email
      departmentId
      gradeId
      employmentStatus
    }
  }
`;

// Delete employee (soft delete - mark as dismissed)
export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: String!) {
    deleteEmployee(id: $id) {
      id
      employmentStatus
    }
  }
`;

// Bulk create employees (from file upload)
export const BULK_CREATE_EMPLOYEES = gql`
  mutation BulkCreateEmployees(
    $tenantSlug: String!
    $input: [CreateEmployeeInput!]!
  ) {
    bulkCreateEmployees(tenantSlug: $tenantSlug, input: $input) {
      created
      failed
      errors {
        rowNumber
        message
      }
    }
  }
`;
```

**Guidelines:**

- Mutation names: `[ACTION]_[ENTITY]` (e.g., `CREATE_EMPLOYEE`, `UPDATE_EMPLOYEE`)
- Return data needed for UI update (cache update)
- Include error details if mutations can partially fail
- Use input types matching server schema

---

### `api/subscriptions.ts` - GraphQL Subscriptions

For real-time data (if building chat, notifications, etc.).

```typescript
// entities/employee/api/subscriptions.ts
import { gql } from "@apollo/client";

// Real-time employee updates
export const ON_EMPLOYEE_UPDATED = gql`
  subscription OnEmployeeUpdated($id: String!) {
    employeeUpdated(id: $id) {
      id
      fio
      email
      employmentStatus
      updatedAt
    }
  }
`;
```

---

### `hooks.ts` - Apollo Hooks

Export ready-to-use hooks for data fetching.

```typescript
// entities/employee/hooks.ts
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import type {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "./model";
import {
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  GET_EMPLOYEE_CAPACITY,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  ON_EMPLOYEE_UPDATED,
} from "./api";

// Query hooks

export function useGetEmployees(variables: any) {
  return useQuery(GET_EMPLOYEES, { variables, errorPolicy: "all" });
}

export function useGetEmployee(id: string) {
  return useQuery(GET_EMPLOYEE, {
    variables: { id },
    skip: !id,
  });
}

export function useGetEmployeeCapacity(id: string) {
  return useQuery(GET_EMPLOYEE_CAPACITY, {
    variables: { id },
    skip: !id,
  });
}

// Mutation hooks

export function useCreateEmployee() {
  return useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    awaitRefetchQueries: true,
  });
}

export function useUpdateEmployee() {
  const [mutate, rest] = useMutation(UPDATE_EMPLOYEE);

  return [
    (id: string, input: UpdateEmployeeInput) =>
      mutate({
        variables: { id, input },
        refetchQueries: [
          { query: GET_EMPLOYEE, variables: { id } },
          { query: GET_EMPLOYEES },
        ],
      }),
    rest,
  ];
}

export function useDeleteEmployee() {
  return useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });
}

// Subscription hooks

export function useEmployeeUpdates(id: string) {
  return useSubscription(ON_EMPLOYEE_UPDATED, {
    variables: { id },
    skip: !id,
  });
}
```

**Guidelines:**

- Hook names: `use[Action][Entity]` (e.g., `useGetEmployee`, `useCreateEmployee`)
- Return data for queries, mutation function + metadata for mutations
- Include `refetchQueries` to update related cache
- Skip queries if variables are missing
- Handle errors with `errorPolicy: 'all'`

---

### `index.ts` - Public API

Export everything the rest of the app needs.

```typescript
// entities/employee/index.ts

// Types
export type {
  Employee,
  EmployeeListResponse,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "./model";

// Schemas
export {
  employeeCreateSchema,
  employeeUpdateSchema,
  employeeFilterSchema,
} from "./schema";
export type {
  EmployeeCreateInput,
  EmployeeUpdateInput,
  EmployeeFilter,
} from "./schema";

// GraphQL documents
export {
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  GET_EMPLOYEE_CAPACITY,
} from "./api/queries";
export {
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  BULK_CREATE_EMPLOYEES,
} from "./api/mutations";
export { ON_EMPLOYEE_UPDATED } from "./api/subscriptions";

// Hooks
export {
  useGetEmployees,
  useGetEmployee,
  useGetEmployeeCapacity,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useEmployeeUpdates,
} from "./hooks";
```

---

## Complete Employee Entity Example

```typescript
// entities/employee/index.ts - One import gives access to everything
import {
  Employee,
  employeeCreateSchema,
  useGetEmployee,
  useCreateEmployee,
} from '@/entities/employee';

// In a feature:
function MyComponent() {
  const { data: employee } = useGetEmployee('emp-123');
  const [createEmployee] = useCreateEmployee();

  const handleCreate = async (input: unknown) => {
    const validated = employeeCreateSchema.parse(input);
    await createEmployee({ variables: { input: validated } });
  };

  return (
    <div>
      {employee && <p>{employee.fio}</p>}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
```

---

## All Entities Overview

```
entities/
├── employee/         # Person in the organization
├── department/       # Organizational unit
├── process/          # Business process
├── assignment/       # Task assigned to employee
├── company/          # Company/tenant
├── grade/            # Seniority level (Junior, Middle, Senior, etc.)
├── user/             # System user
└── upload/           # File upload tracking
```

Each follows the same structure: model → schema → api → hooks → index.

---

## Next Steps

- Read [features-guide.md](./features-guide.md) to see how features use entities
- Follow [implementation-checklist.md](./implementation-checklist.md) Phase 2: Create all entities
