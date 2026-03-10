# FSD Architecture Guide

## What is Feature-Sliced Design (FSD)?

Feature-Sliced Design is an architectural pattern that organizes code by **features** and **layers** rather than by **type** (like components/, hooks/, utils/).

**Traditional structure (avoid):**

```
src/
├── components/        # All components mixed
├── hooks/            # All hooks mixed
├── utils/            # All utilities mixed
└── types/            # All types mixed
```

**FSD structure (what we use):**

```
src/
├── entities/         # Data & APIs (what server provides)
├── features/         # Business logic & UI (what users do)
├── widgets/          # Composites (orchestrating features)
├── shared/           # Infrastructure
└── app/              # Next.js routing
```

---

## The 5 Layers

### Layer 1: `app/`

**Purpose:** Route requests to pages

**Contains:** Next.js pages, layouts, loading states, error boundaries

**Never contains:** Business logic, API calls, data fetching

**Examples:**

```
app/
├── dashboard/
│   ├── layout.tsx       # Authenticated layout
│   ├── page.tsx         # Overview page
│   ├── employees/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── settings/
└── (auth)/
    ├── sign-in/page.tsx
    └── sign-up/page.tsx
```

**What a page does:**

```typescript
// app/dashboard/employees/page.tsx
export default function EmployeesPage({ searchParams }) {
  // 1. Extract route params
  const { page = 1, sort = 'fio', filter = '' } = searchParams;

  // 2. Render widget (that's it!)
  return (
    <EmployeesWidget
      initialPage={page}
      initialSort={sort}
      initialFilter={filter}
    />
  );
}
```

---

### Layer 2: `entities/`

**Purpose:** Define data models and how to fetch/mutate them

**Contains:**

- `model.ts` - TypeScript types
- `schema.ts` - Zod validation
- `api/queries.ts` - GraphQL queries
- `api/mutations.ts` - GraphQL mutations
- `api/subscriptions.ts` - Real-time subscriptions
- `hooks.ts` - Entity-level data hooks

**Never contains:** UI components, user action logic, filtering/sorting

**Example structure:**

```
entities/employee/
├── model.ts
├── schema.ts
├── api/
│   ├── queries.ts
│   ├── mutations.ts
│   └── subscriptions.ts
├── hooks.ts
└── index.ts
```

**What entities are NOT:**

- They're not UI
- They're not user actions
- They're not business logic

**Example:**

```typescript
// entities/employee/model.ts
export type Employee = {
  id: string;
  fio: string;
  email: string;
  departmentId: string;
  gradeId: string;
  employmentStatus: "active" | "vacation" | "sick" | "dismissed";
};

// entities/employee/schema.ts
export const employeeCreateSchema = z.object({
  fio: z.string().min(1, "Name required"),
  email: z.string().email(),
  departmentId: z.string(),
  gradeId: z.string(),
});

// entities/employee/api/queries.ts
export const GET_EMPLOYEES = gql`
  query GetEmployees($tenantSlug: String!, $page: Int!) {
    employees(tenantSlug: $tenantSlug, page: $page) {
      nodes {
        id
        fio
        email
      }
      total
    }
  }
`;

// entities/employee/hooks.ts
export function useGetEmployee(id: string) {
  return useQuery(GET_EMPLOYEE, { variables: { id } });
}
```

---

### Layer 3: `features/`

**Purpose:** Handle user actions using entity data + client state

**Contains:**

- `ui/` - Dumb UI components
- `store.ts` - Zustand store for feature state
- `hooks.ts` - Feature hooks (action coordinators)
- `index.ts` - Public API

**Grouped by entity:** `features/employee/list/`, `features/employee/create/`, etc.

**Cross-entity:** `features/common/file-upload/`, `features/common/auth/`

**Example structure:**

```
features/employee/
├── list/
│   ├── ui/
│   │   ├── employee-list.tsx
│   │   ├── employee-filters.tsx
│   │   └── employee-table.tsx
│   ├── store.ts
│   ├── hooks.ts
│   └── index.ts
├── create/
│   ├── ui/
│   │   ├── employee-form.tsx
│   │   └── employee-form-dialog.tsx
│   ├── store.ts
│   ├── hooks.ts
│   └── index.ts
├── edit/
├── delete/
├── detail/
└── index.ts
```

**What a feature does:**

```typescript
// features/employee/list/hooks.ts

// Feature store: page, sort, filter state
export const useEmployeeListStore = create((set) => ({
  page: 1,
  sort: "fio",
  filter: "",
  setPage: (page) => set({ page }),
  setSort: (sort) => set({ sort }),
  setFilter: (filter) => set({ filter }),
}));

// Feature hook: coordinates entity + store
export function useEmployeeList(tenantSlug: string) {
  const { page, sort, filter } = useEmployeeListStore();

  // Call entity hook
  const { data, loading, error } = useGetEmployees({
    variables: { tenantSlug, page, sort, filter },
  });

  return { employees: data?.employees, loading, error };
}

// Feature hook: handles actions
export function useEmployeeListActions() {
  const store = useEmployeeListStore();
  const { refetch } = useGetEmployees();

  return {
    onChangePage: (page: number) => {
      store.setPage(page);
      refetch();
    },
    onChangeSort: (sort: string) => {
      store.setSort(sort);
      store.setPage(1);
      refetch();
    },
  };
}
```

```typescript
// features/employee/list/ui/employee-list.tsx
'use client';

export function EmployeeList() {
  const { employees, loading } = useEmployeeList('acme');
  const { onChangePage } = useEmployeeListActions();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <EmployeeTable
        data={employees}
        onPageChange={onChangePage}
      />
    </div>
  );
}
```

---

### Layer 4: `widgets/`

**Purpose:** Orchestrate multiple features into a cohesive UI section

**Never contains:** API calls, business logic

**Example:**

```typescript
// widgets/employees-widget.tsx
'use client';

export function EmployeesWidget({ tenantSlug, initialPage }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Feature 1: List */}
      <EmployeeListFeature
        tenantSlug={tenantSlug}
        onSelectEmployee={setSelectedId}
      />

      {/* Feature 2: Create Modal */}
      {isCreateOpen && (
        <EmployeeCreateFeature
          onSuccess={() => {
            setIsCreateOpen(false);
            // Refetch list
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      )}

      {/* Feature 3: Detail Sidebar */}
      {selectedId && (
        <EmployeeDetailFeature
          employeeId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
```

---

### Layer 5: `shared/`

**Purpose:** Infrastructure and utilities used across the app

**Contains:**

- `graphql/` - Apollo Client setup
- `stores/` - Global Zustand stores (auth, company)
- `hooks/` - Shared hooks (useAuth, usePagination)
- `lib/` - Utility functions
- `ui/` - Shadcn + custom components
- `types/` - Global TypeScript types
- `constants/` - Constants and enums

**Never contains:** Business logic, entity-specific code

**Examples:**

```typescript
// shared/stores/company.store.ts
export const useCompanyStore = create((set) => ({
  currentCompany: null,
  tenants: [],
  setCurrentCompany: (company) => set({ currentCompany: company }),
  setTenants: (tenants) => set({ tenants }),
}));

// shared/stores/auth.store.ts
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// shared/hooks/use-tenant.ts
export function useTenant() {
  const router = useRouter();
  const params = useParams();
  return params.tenantSlug;
}
```

---

## Feature-to-Feature Communication

When Feature A needs data from Feature B:

**Option 1: Via Global Store** (preferred for shared data)

```typescript
// Feature A
const company = useCompanyStore();

// Feature B updates it
useCompanyStore().setCurrentCompany(data);
```

**Option 2: Via Props** (for temporary data)

```typescript
// Page/Widget passes data between features
<FeatureA onSelectItem={setSelected} />
<FeatureB selectedItem={selected} />
```

**Option 3: Via Apollo Cache** (for server data)

```typescript
// Feature A reads from cache
const { data } = useQuery(GET_EMPLOYEES);

// Feature B mutates and Apollo updates cache
const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
  refetchQueries: [{ query: GET_EMPLOYEES }],
});
```

---

## Decision Tree: Where Does Code Go?

```
┌─ Is it a GraphQL query/mutation?
├─ YES → entities/[entity]/api/queries.ts or mutations.ts
└─ NO ↓
   ├─ Is it a TypeScript type?
   ├─ Entity-specific → entities/[entity]/model.ts
   ├─ Global → shared/types/
   └─ NO ↓
      ├─ Is it a Zod schema?
      ├─ YES → entities/[entity]/schema.ts
      └─ NO ↓
         ├─ Is it a React component?
         ├─ Entity-specific UI → features/[entity]/[action]/ui/
         ├─ Cross-entity UI → features/common/[action]/ui/
         ├─ Reusable UI → shared/ui/ or widgets/
         └─ NO ↓
            ├─ Is it a custom hook?
            ├─ Entity-level → entities/[entity]/hooks.ts
            ├─ Feature-level → features/[entity]/[action]/hooks.ts
            ├─ Shared utility → shared/hooks/
            └─ NO ↓
               ├─ Is it a Zustand store?
               ├─ Global → shared/stores/
               ├─ Feature-specific → features/[entity]/[action]/store.ts
               └─ NO ↓
                  └─ Utility/Constant → shared/lib/ or shared/constants/
```

---

## Validation Checklist for Architecture

✅ **Entities are data-only**

- Have GraphQL docs, types, schemas
- Have no React components
- Have no UI logic

✅ **Features handle actions**

- Import from entities
- Have UI components
- Have Zustand stores for their own state

✅ **Widgets orchestrate features**

- Compose multiple features
- Handle communication between features
- Never call APIs directly

✅ **Shared is infrastructure**

- Global stores (auth, company)
- Shared hooks (useAuth, usePagination)
- UI component library
- Utilities and constants

✅ **Pages are thin**

- Extract route params
- Render widgets
- That's it

---

## Next Steps

- Read [entities-guide.md](./entities-guide.md) for detailed entity patterns
- Read [features-guide.md](./features-guide.md) for detailed feature patterns
- Follow [implementation-checklist.md](./implementation-checklist.md) to build
