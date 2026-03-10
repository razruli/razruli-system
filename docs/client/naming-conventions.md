# Naming Conventions

Consistent naming makes code predictable and easy to navigate.

---

## File Naming

### Components (Presentational UI)

**Rule:** PascalCase + `.tsx` extension

```
components/my-component.tsx          ❌ Wrong (kebab-case)
components/MyComponent.tsx            ✅ Correct (PascalCase)
components/EmployeeTable.tsx
components/EmployeeForm.tsx
components/DeleteConfirmDialog.tsx
components/SkeletonLoader.tsx
```

**Why:** Matches React convention. Easier to distinguish from utilities.

### Hooks

**Rule:** `use[Functionality].ts` (camelCase)

```
hooks/useAuth.ts                      ✅ Correct
hooks/usePagination.ts
hooks/useEmployeeList.ts
hooks/useFormValidation.ts
hooks/employee-list.ts                ❌ Wrong (kebab-case)
```

**Why:** Instantly recognizable as hooks. Matches React convention.

### Features/Entities

**Rule:** kebab-case file names, PascalCase for exported functions

```
features/employee/list/
├── employee-list.tsx                 ✅ File: kebab-case
├── employee-table.tsx
├── employee-filters.tsx
├── store.ts
├── hooks.ts
└── index.ts

// But inside the files:
export function EmployeeListFeature() { }     ✅ Export: PascalCase
```

### Stores

**Rule:** File = `index.ts` or `[name].store.ts`, Export = `use[Name]Store`

```
shared/stores/auth.store.ts
export const useAuthStore = create(...)       ✅ Correct

shared/stores/company.store.ts
export const useCompanyStore = create(...)

shared/stores/filters.store.ts
export const useFilterStore = create(...)
```

### Utilities & Constants

**Rule:** camelCase for utilities, UPPER_SNAKE_CASE for constants

```
shared/lib/
├── formatDate.ts                      ✅ Utility function
├── calculateCapacity.ts
├── parseXLSX.ts

shared/constants/
├── HTTP_STATUS.ts                     ✅ Constants
├── EMPLOYMENT_STATUS.ts
├── GRADES.ts

// Inside files:
export function formatDate() { }       ✅ camelCase
export const MAX_FILE_SIZE = 10485760; ✅ UPPER_SNAKE_CASE
```

### Folders

**Rule:** kebab-case for multi-word folders, lowercase

```
src/
├── app/                              ✅ Lowercase
├── entities/
├── features/
├── shared/
│   ├── graphql/
│   ├── ui/
│   ├── stores/
│   └── lib/                          ✅ Lowercase

features/employee/list/               ✅ kebab-case

❌ Wrong:
├── Entities/
├── src/App/
└── features/EmployeeList/
```

---

## TypeScript Naming

### Types & Interfaces

**Rule:** PascalCase (no `I` prefix for interfaces)

```typescript
type Employee = { ... }               ✅ Type
type CreateEmployeeInput = { ... }
type EmployeeCapacity = { ... }

interface User { ... }                ✅ Interface (no I prefix)
interface ApiResponse { ... }

interface IUser { ... }               ❌ Wrong (I prefix)
type employee = { ... }               ❌ Wrong (lowercase)
```

**Guidelines:**

- Use `type` for data models (prefer over `interface`)
- Use `interface` for contracts/contracts (fewer cases)
- Include context: `EmployeeListResponse`, not just `Response`

### Enums

**Rule:** PascalCase for enum name, UPPER_SNAKE_CASE for values

```typescript
enum EmploymentStatus {
  ACTIVE = 'active',
  VACATION = 'vacation',
  SICK = 'sick',
  DISMISSED = 'dismissed',
}

❌ Wrong:
enum employmentStatus {          // lowercase enum
  Active = 'active',             // PascalCase values
}
```

### Classes

**Rule:** PascalCase

```typescript
class EmployeeService { }             ✅
class FileUploadHandler { }
class GraphQLClient { }
```

---

## GraphQL Naming

### Query Documents

**Rule:** Uppercase, specific, action-focused

```typescript
// Query = GET_[ENTITY] or GET_[ENTITIES]
export const GET_EMPLOYEE = gql`...`
export const GET_EMPLOYEES = gql`...`
export const GET_EMPLOYEE_CAPACITY = gql`...`

❌ Wrong:
export const FETCH_EMPLOYEE = gql`...`      // Use GET_
export const employee = gql`...`            // Lowercase
export const EmpData = gql`...`             // Unclear
```

### Mutation Documents

**Rule:** Uppercase, [ACTION]\_[ENTITY]

```typescript
// Mutation = [ACTION]_[ENTITY]
export const CREATE_EMPLOYEE = gql`...`
export const UPDATE_EMPLOYEE = gql`...`
export const DELETE_EMPLOYEE = gql`...`
export const BULK_CREATE_EMPLOYEES = gql`...`

❌ Wrong:
export const AddEmployee = gql`...`         // PascalCase
export const CREATE = gql`...`              // Missing entity
export const createEmployee = gql`...`      // Lowercase
```

### Subscription Documents

**Rule:** ON\_[EVENT]

```typescript
export const ON_EMPLOYEE_UPDATED = gql`...`
export const ON_FILE_UPLOAD_PROGRESS = gql`...`

❌ Wrong:
export const EMPLOYEE_UPDATED = gql`...`   // Missing ON_
export const subscribe_to_employee = gql`...`
```

---

## Hook Naming

### Custom Hooks

**Rule:** `use[Functionality]`

```typescript
// Data fetching hooks (entity-level)
export function useGetEmployee(id: string) { }      ✅
export function useCreateEmployee() { }
export function useUpdateEmployee() { }

// Feature hooks
export function useEmployeeList(tenantSlug: string) { }   ✅
export function useEmployeeListActions() { }

// Shared utility hooks
export function useAuth() { }                        ✅
export function useCompany() { }
export function usePagination() { }
export function useTenant() { }

// Store hooks
export function useAuthStore() { }                   ✅
export function useCompanyStore() { }
export function useEmployeeListStore() { }

❌ Wrong:
export function getEmployee() { }           // Missing use prefix
export function auth() { }                  // Missing use prefix
export const useAuthStore = create(...)    // Should be standard hook syntax
```

---

## Import Path Naming

### Path Aliases

```typescript
// Set in tsconfig.json
{
  "paths": {
    "@/app/*": ["./app/*"],
    "@/entities/*": ["./entities/*"],
    "@/features/*": ["./features/*"],
    "@/widgets/*": ["./widgets/*"],
    "@/shared/*": ["./shared/*"],
  }
}

// Usage in code
import { EmployeeListFeature } from '@/features/employee/list';     ✅
import { useGetEmployee } from '@/entities/employee';
import { EmployeeTable } from '@/shared/ui';
import { usePagination } from '@/shared/hooks';

❌ Avoid:
import { EmployeeListFeature } from '../../../features/employee/list';
import { useGetEmployee } from '../../../../entities/employee';
```

---

## Index File Exports

### Entity Index

```typescript
// entities/employee/index.ts

// Types
export type { Employee, EmployeeListResponse } from "./model";
export type { EmployeeCreateInput, EmployeeUpdateInput } from "./schema";

// Schemas
export { employeeCreateSchema } from "./schema";

// GraphQL (don't export - only use in hooks)
// export { GET_EMPLOYEES } from './api/queries';  // ❌ Don't do this

// Hooks (main export)
export {
  useGetEmployee,
  useGetEmployees,
  useCreateEmployee,
  useUpdateEmployee,
} from "./hooks";
```

### Feature Index

```typescript
// features/employee/list/index.ts

export { EmployeeListFeature } from "./index"; // Main export
export {
  useEmployeeList,
  useEmployeeListUI,
  useEmployeeListActions,
} from "./hooks";

// Don't export UI components directly
// export { EmployeeTable } from './ui/employee-table';  // ❌
```

### Shared Index

```typescript
// shared/ui/index.ts
export { Button } from "./button";
export { Input } from "./input";
export { Table, TableBody, TableHead, TableRow, TableCell } from "./table";

// shared/hooks/index.ts
export { useAuth } from "./use-auth";
export { usePagination } from "./use-pagination";
export { useTenant } from "./use-tenant";
```

---

## React Component Props Interface

**Rule:** `[ComponentName]Props`

```typescript
interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onRowClick?: (employeeId: string) => void;
}

interface EmployeeFormProps {
  initialValues?: Employee;
  onSubmit: (data: Employee) => Promise<void>;
  isLoading?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
```

---

## Zod Schema Naming

**Rule:** `[Entity][Action]Schema`

```typescript
// entities/employee/schema.ts

export const employeeCreateSchema = z.object({ ... })           ✅
export const employeeUpdateSchema = z.object({ ... })
export const employeeFilterSchema = z.object({ ... })
export const employeeBulkCreateSchema = z.array(employeeCreateSchema)

export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>

❌ Wrong:
export const CreateEmployeeSchema = z.object({ ... })  // PascalCase
export const employee_schema = z.object({ ... })       // snake_case
export const validateEmployee = z.object({ ... })      // validate prefix
```

---

## Event Handler Naming

**Rule:** `on[Verb][Noun]` or `handle[Verb][Noun]`

```typescript
// In props/callbacks
onClick={() => { }}                   ✅
onSubmit={() => { }}
onFilterChange={() => { }}
onPageChange={() => { }}
onDeleteConfirm={() => { }}

// In handlers
const handleSubmit = () => { }        ✅
const handleDelete = () => { }
const handleFilter = () => { }

❌ Wrong:
onClickElement={() => { }}            // Too specific
submitForm={() => { }}                // Missing on/handle prefix
filterEmployees={() => { }}           // Too broad
```

---

## Variable Naming

### Boolean Variables

**Rule:** `is[Adjective]` or `has[Noun]`

```typescript
const isLoading = true;               ✅
const isOpen = false;
const isEmpty = true;
const hasError = false;
const canDelete = true;

❌ Wrong:
const loading = true;                 // Missing is/has
const openModal = true;               // Unclear
const employees = [];                 // Not a boolean
```

### Array Variables

**Rule:** Plural nouns

```typescript
const employees: Employee[] = [];      ✅
const departments: Department[] = [];
const filters: Filter[] = [];

❌ Wrong:
const employeeList: Employee[] = [];   // Use plural not List
const emp: Employee[] = [];            // Abbreviations unclear
```

---

## Checklist

Before committing code, verify:

- [ ] All components are PascalCase.tsx
- [ ] All hooks are `useX.ts`
- [ ] All stores are `use[X]Store`
- [ ] All folders are kebab-case
- [ ] All GraphQL operations are UPPER_SNAKE_CASE
- [ ] All types are PascalCase
- [ ] All functions are camelCase
- [ ] All constants are UPPER_SNAKE_CASE
- [ ] All imports use `@/` aliases
- [ ] All callbacks use `on[Verb]` or `handle[Verb]`
- [ ] All booleans use `is/has` prefix

---

## Next Steps

- Follow [implementation-checklist.md](./implementation-checklist.md) while adhering to these conventions
- Use a code formatter (Prettier) to enforce consistency
