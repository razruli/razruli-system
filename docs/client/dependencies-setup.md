# Dependencies & Setup

Complete installation and configuration guide for all client dependencies.

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

---

## Install Core Dependencies

```bash
# Already installed in this project
npm install next react react-dom typescript

# Apollo Client (GraphQL)
npm install @apollo/client graphql @apollo/react-hooks

# State Management
npm install zustand

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Components
npm install @radix-ui/react-* (already have shadcn)

# Data Tables
npm install @tanstack/react-table

# Charts
npm install recharts

# Animations
npm install framer-motion

# Next.js Enhancements (already have)
npm install next-intl next-themes better-auth

# File Upload
npm install papaparse
npm install -D @types/papaparse

# Server-Sent Events
npm install eventsource  # Already built-in to browsers

# Server-side (for file processing)
npm install busboy  # Parse multipart
npm install bull   # Job queue
npm install redis  # Bull needs Redis

# Development
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D prettier eslint
```

---

## Apollo Client Setup

### `shared/graphql/apollo-client.ts`

```typescript
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Auth middleware - add token to headers
const authLink = new ApolloLink((operation, forward) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

// HTTP transport
const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
    "http://localhost:3000/api/graphql",
  credentials: "include", // Send cookies
});

// Create client
export const apolloClient = new ApolloClient({
  ssrMode: typeof window === "undefined", // SSR mode for Next.js
  link: concat(errorLink, concat(authLink, httpLink)),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Custom cache policies if needed
        },
      },
    },
  }),
});
```

### `shared/graphql/apollo-provider.tsx`

```typescript
'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo-client';

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
```

### `app/layout.tsx`

```typescript
import { ApolloProviderWrapper } from '@/shared/graphql/apollo-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}
```

---

## Zustand Store Setup

### Global Auth Store

```typescript
// shared/stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
```

### Global Company Store

```typescript
// shared/stores/company.store.ts
import { create } from "zustand";

interface Company {
  id: string;
  slug: string;
  name: string;
  timezone: string;
  workingHoursDay: number;
  workingDaysPerMonth: number;
}

interface CompanyState {
  currentCompany: Company | null;
  tenants: Company[];
  setCurrentCompany: (company: Company) => void;
  setTenants: (tenants: Company[]) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  currentCompany: null,
  tenants: [],
  setCurrentCompany: (company) => set({ currentCompany: company }),
  setTenants: (tenants) => set({ tenants }),
}));
```

---

## React Hook Form + Zod Setup

### Example: Employee Form

```typescript
// components/employee-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeCreateSchema } from '@/entities/employee';
import { Input, Button, FormError } from '@/shared/ui';

export function EmployeeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeCreateSchema),
  });

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    // Call mutation here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Full Name</label>
        <Input {...register('fio')} />
        {errors.fio && <FormError>{errors.fio.message}</FormError>}
      </div>

      <div>
        <label>Email</label>
        <Input {...register('email')} type="email" />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
```

---

## Next.js Conventions

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=your_key_here

# Private (server-only)
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
```

### Dynamic Routes with Parameters

```typescript
// app/dashboard/employees/[id]/page.tsx
interface Props {
  params: { id: string };
  searchParams: { tab?: string };
}

export default function EmployeePage({ params, searchParams }: Props) {
  const employeeId = params.id;
  const tab = searchParams.tab || 'overview';

  return <EmployeeDetailWidget employeeId={employeeId} tab={tab} />;
}
```

### Route Interception & Modals

```typescript
// app/dashboard/employees/@modal/(.)create/page.tsx
// Shows create modal as overlay

export default function CreateModal() {
  return <EmployeeCreateFeature />;
}
```

---

## TanStack Table Setup

```typescript
// features/employee/list/ui/employee-table.tsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

export function EmployeeTable({ data }) {
  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'fio',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{header.column.columnDef.header}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{cell.renderCell()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Authentication Setup

Using `better-auth` (already configured on server):

```typescript
// shared/hooks/use-auth.ts
"use client";

import { useAuthStore } from "@/shared/stores/auth.store";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const signOut = async () => {
    const response = await fetch("/api/auth/signout", { method: "POST" });
    if (response.ok) {
      logout();
    }
  };

  return {
    user,
    isAuthenticated,
    signOut,
  };
}
```

---

## Internationalization (i18n)

Already set up with `next-intl`:

```typescript
// app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

---

## Environment Configuration

```typescript
// shared/lib/config.ts
export const config = {
  graphql: {
    endpoint:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      "http://localhost:3000/api/graphql",
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    aiChat: process.env.NEXT_PUBLIC_AI_CHAT_ENABLED === "true",
  },
};
```

---

## Type Safety

### Generate Apollo Types (Optional)

```bash
# Install codegen
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset

# Create codegen.yml
schema: http://localhost:3000/api/graphql
documents: "src/**/*.ts"
generates:
  src/shared/types/gql-generated.ts:
    preset: client

# Run
npx graphql-codegen
```

Then use generated types:

```typescript
import { GetEmployeesQuery } from "@/shared/types/gql-generated";

// Type-safe!
const data: GetEmployeesQuery = apolloResult.data;
```

---

## Development Server

```bash
# Start Next.js dev server
npm run dev

# Open browser
open http://localhost:3000

# Both frontend and Apollo Server running on same port
# Apollo: http://localhost:3000/api/graphql
```

---

## Next Steps

- Follow [implementation-checklist.md](./implementation-checklist.md) to build features
- Use these configurations as-is, they're production-ready
