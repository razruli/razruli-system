# Client Architecture Documentation

## Overview

This directory contains comprehensive documentation for the client-side architecture using **Feature-Sliced Design (FSD)** with Next.js, React, TypeScript, Apollo Client, and Zustand.

**Status:** 📋 Architecture Planning (Ready for implementation)

---

## Architecture Stack

```
┌─────────────────────────────────────────────────────────┐
│         User Action (Click, Type, Submit)               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│    Component (UI - Presentational Layer)                │
│    - Button, Form, Table, Modal                         │
│    - Calls feature hooks for actions                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Feature Hook (Action Layer)                            │
│  - useEmployeeList, useCreateEmployee                   │
│  - Orchestrates entity hooks + store state              │
│  - Handles loading, error, success states               │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Entity Hook         │    │  Zustand Store       │
│  (Data from Server)  │    │  (Client State)      │
│                      │    │                      │
│  useGetEmployee()    │    │  useEmployeeStore()  │
│  useCreateEmployee() │    │  usePaginationStore()│
│  useUpdateEmployee() │    │  useCompanyStore()   │
└──────────┬───────────┘    └──────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│    Apollo Client (GraphQL Query Execution)              │
│    - Sends queries/mutations to server                  │
│    - Caches results automatically                       │
│    - Handles errors and loading states                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Server (GraphQL API)                            │
│    Resolvers → Services → Repositories → Database       │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Public landing page
│   ├── (auth)/            # Auth pages (sign-in, sign-up)
│   ├── onboarding/        # Multi-step onboarding
│   └── dashboard/         # Main authenticated app
│
├── entities/              # Data Models & APIs (speak to server)
│   ├── employee/
│   ├── department/
│   ├── process/
│   ├── assignment/
│   ├── company/
│   ├── grade/
│   ├── user/
│   └── upload/
│
├── features/              # Business Logic & UI (entity-grouped)
│   ├── employee/
│   │   ├── list/
│   │   ├── create/
│   │   ├── edit/
│   │   ├── delete/
│   │   ├── detail/
│   │   └── capacity/
│   ├── department/
│   ├── process/
│   ├── assignment/
│   ├── company/
│   └── common/            # Cross-entity features
│       ├── file-upload/
│       ├── auth/
│       ├── onboarding/
│       └── ai-assistant/
│
├── widgets/               # Reusable Composites
│   ├── dashboard-layout.tsx
│   ├── employees-widget.tsx
│   ├── departments-widget.tsx
│   └── ...
│
└── shared/                # Infrastructure
    ├── graphql/           # Apollo Client setup
    ├── stores/            # Global Zustand stores
    ├── hooks/             # Shared hooks
    ├── lib/               # Utilities
    ├── ui/                # Shadcn + custom components
    ├── types/             # TypeScript types
    ├── i18n/              # Internationalization
    ├── theme/             # Theme setup
    └── constants/         # Constants & enums
```

---

## Layer Responsibilities

### 1. `app/` - Next.js Router

- **Responsibility:** Routes, pages, layouts, loading states, error boundaries
- **What it does:** Routes requests to correct page, orchestrates page-level layout
- **What it doesn't do:** Business logic, API calls, complex state
- **Example:** `/dashboard/employees/page.tsx` → renders EmployeesWidget

### 2. `entities/` - Data Models & APIs

- **Responsibility:** Define what data looks like, how to fetch/mutate it
- **Files:** `model.ts`, `schema.ts`, `api/queries.ts`, `api/mutations.ts`, `hooks.ts`
- **What it does:** GraphQL documents, Zod schemas, Apollo hooks
- **What it doesn't do:** UI, user actions, filtering/sorting logic
- **Example:** `employee/hooks.ts` exports `useGetEmployee()`, `useCreateEmployee()`

### 3. `features/` - Business Logic & UI

- **Responsibility:** Handle user actions, coordinate entity data + store state
- **Structure:** `ui/`, `store.ts`, `hooks.ts`, `index.ts`
- **What it does:** Forms, tables, filters, create/edit/delete dialogs
- **What it doesn't do:** Low-level API calls (delegates to entities), unrelated business logic
- **Example:** `employee/list/` handles filtering, sorting, pagination + calls entity hooks

### 4. `widgets/` - Reusable Composites

- **Responsibility:** Assemble features into cohesive UI sections
- **What it does:** Layout, coordinate multiple features, handle communication between them
- **What it doesn't do:** API calls, complex business logic
- **Example:** `EmployeesWidget` orchestrates list + create + detail features

### 5. `shared/` - Infrastructure

- **Responsibility:** Setup and utilities used across the app
- **Contains:** Apollo Client, Zustand stores, hooks, types, UI components
- **Example:** `useCompanyStore()`, `useAuth()`, Apollo client configuration

---

## Data Flow Example: Creating an Employee

```
1. User clicks "Create" button
   └─ Component: <CreateButton onClick={onCreateClick} />

2. Feature hook called
   └─ useCreateEmployee() from features/employee/create/hooks.ts
   └─ Handles form submission, loading state, validation

3. Feature calls entity hook
   └─ useCreateEmployee() from entities/employee/hooks.ts
   └─ Validates data with schema from entities/employee/schema.ts
   └─ Calls Apollo Client with mutation from entities/employee/api/mutations.ts

4. Apollo sends to server
   └─ CREATE_EMPLOYEE mutation
   └─ Server: Employee resolver → service → repository → database

5. Data returns
   └─ Apollo cache updated automatically
   └─ Feature store updated if needed
   └─ Component re-renders with new data

6. Side effects
   └─ Invalidate related cache (employee list)
   └─ Reset form state
   └─ Show success notification
```

---

## Documentation Files

| File                                                         | Purpose                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| [fsd-architecture.md](./fsd-architecture.md)                 | Detailed FSD guide: layers, responsibilities, examples          |
| [entities-guide.md](./entities-guide.md)                     | Entity folder structure, files, patterns. Employee example      |
| [features-guide.md](./features-guide.md)                     | Feature folder structure, files, patterns. List feature example |
| [widgets-guide.md](./widgets-guide.md)                       | Widgets: what they are, when to use, composition patterns       |
| [dependencies-setup.md](./dependencies-setup.md)             | Install & configure all dependencies                            |
| [data-flow.md](./data-flow.md)                               | Visual data flow with detailed explanations                     |
| [naming-conventions.md](./naming-conventions.md)             | Strict naming rules for files, functions, imports               |
| [testing-strategy.md](./testing-strategy.md)                 | Unit, component, integration, E2E testing approach              |
| [implementation-checklist.md](./implementation-checklist.md) | 7-phase implementation plan with tasks                          |

---

## Quick Decision Tree

**Where does my code go?**

```
Is it a GraphQL query/mutation?
├─ YES → entities/[entity]/api/queries.ts or mutations.ts
└─ NO → Continue

Is it a TypeScript type/interface?
├─ YES → entities/[entity]/model.ts (if specific to entity) or shared/types/ (if shared)
└─ NO → Continue

Is it a Zod validation schema?
├─ YES → entities/[entity]/schema.ts
└─ NO → Continue

Is it a React component (UI)?
├─ Entity-specific → features/[entity]/[action]/ui/
├─ Cross-entity → features/common/[action]/ui/
├─ Reusable across app → shared/ui/ or widgets/
└─ Continue

Is it a custom hook for data fetching?
├─ Entity-level (useGetEmployee) → entities/[entity]/hooks.ts
├─ Feature-level (useEmployeeList) → features/[entity]/[action]/hooks.ts
└─ Shared (usePagination) → shared/hooks/

Is it a Zustand store?
├─ Global (auth, company) → shared/stores/
└─ Feature-specific → features/[entity]/[action]/store.ts

Is it a utility function or constant?
├─ YES → shared/lib/ or shared/constants/
└─ You're done!
```

---

## Key Principles

1. **Entities are data** - They don't contain components, business logic, or UI state
2. **Features are actions** - They use entities + stores to deliver user actions
3. **Stores are global** - Use for data that multiple features need (auth, company, filters)
4. **Widgets orchestrate** - They compose features, don't call APIs directly
5. **Shared is infrastructure** - No business logic, only setup and utilities
6. **App is routing** - Pages are thin orchestrators that render widgets

---

## Getting Started

1. Read [fsd-architecture.md](./fsd-architecture.md) for overview
2. Study [entities-guide.md](./entities-guide.md) to understand data layer
3. Study [features-guide.md](./features-guide.md) to understand action layer
4. Check [naming-conventions.md](./naming-conventions.md) for code style
5. Refer to [implementation-checklist.md](./implementation-checklist.md) for build plan

Ready to implement? Start with [implementation-checklist.md](./implementation-checklist.md) Phase 1.
