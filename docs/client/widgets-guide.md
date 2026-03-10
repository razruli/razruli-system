# Widgets Guide

## What is a Widget?

A widget is a **reusable composite UI section** that orchestrates multiple features into a cohesive, self-contained interface.

**Widget = Feature Orchestrator**

Widgets are not features themselves—they compose features, manage communication between them, and handle UI layout for a specific domain.

---

## Widget vs Feature vs Component

### Component (Dumb)

- Just renders UI
- Accepts props, calls callbacks
- No business logic
- Examples: Button, Input, Table, Modal

### Feature (Smart)

- Handles one user action
- Imports entities for data
- Has Zustand store for its own state
- Calls APIs via entity hooks
- Examples: EmployeeListFeature, EmployeeCreateFeature

### Widget (Orchestrator)

- Composes multiple features
- Manages communication between features
- Handles UI layout and flow
- No direct API calls
- Examples: EmployeesWidget, DepartmentsWidget, DashboardLayout

---

## Widget Folder Structure

```
widgets/
├── dashboard-layout.tsx         # Main authenticated layout (sidebar, header)
├── employees-widget.tsx         # Orchestrates employee features
├── departments-widget.tsx       # Orchestrates department features
├── processes-widget.tsx
├── assignments-widget.tsx
└── company-settings-widget.tsx
```

**Note:** Widgets are standalone files, not folders. They're simple orchestrators.

---

## Widget Implementation Pattern

### Basic Structure

```typescript
// widgets/employees-widget.tsx
'use client';

import { useState } from 'react';
import { EmployeeListFeature } from '@/features/employee/list';
import { EmployeeCreateFeature } from '@/features/employee/create';
import { EmployeeDetailFeature } from '@/features/employee/detail';
import { DashboardLayout } from './dashboard-layout';

interface EmployeesWidgetProps {
  tenantSlug: string;
}

export function EmployeesWidget({ tenantSlug }: EmployeesWidgetProps) {
  // Widget-level state (UI orchestration only)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Features manage their own data with entity hooks
  // Widget just passes callbacks and manages layout

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-6">
        {/* Feature 1: List employees */}
        <EmployeeListFeature
          tenantSlug={tenantSlug}
          onSelectEmployee={setSelectedEmployeeId}
          onCreateClick={() => setIsCreateOpen(true)}
        />

        {/* Feature 2: Create modal */}
        {isCreateOpen && (
          <EmployeeCreateFeature
            tenantSlug={tenantSlug}
            onSuccess={() => {
              setIsCreateOpen(false);
              // List automatically refetches via Apollo cache invalidation
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        )}

        {/* Feature 3: Detail sidebar */}
        {selectedEmployeeId && (
          <EmployeeDetailFeature
            employeeId={selectedEmployeeId}
            onClose={() => setSelectedEmployeeId(null)}
            onEdit={() => {
              // Feature handles edit modal internally
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
```

---

## Widget Examples

### Example 1: Dashboard Layout

```typescript
// widgets/dashboard-layout.tsx
'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/shared/ui/sidebar';
import { Header } from '@/shared/ui/header';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            <div>
              <Breadcrumbs />
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

**Used in pages:**

```typescript
// app/[locale]/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <OverviewCards />
      <ReportsCharts />
    </DashboardLayout>
  );
}
```

### Example 2: Employees Widget

```typescript
// widgets/employees-widget.tsx
'use client';

import { useState } from 'react';
import { EmployeeListFeature } from '@/features/employee/list';
import { EmployeeCreateFeature } from '@/features/employee/create';
import { EmployeeDetailFeature } from '@/features/employee/detail';
import { DashboardLayout } from './dashboard-layout';

interface EmployeesWidgetProps {
  tenantSlug: string;
}

export function EmployeesWidget({ tenantSlug }: EmployeesWidgetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-6">
        {/* List with inline create button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Employee Directory</h2>
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
            + Add Employee
          </button>
        </div>

        {/* Feature A: List */}
        <EmployeeListFeature
          tenantSlug={tenantSlug}
          onSelectEmployee={setSelectedId}
          onEdit={setEditingId}
        />

        {/* Feature B: Create (modal) */}
        {isCreateOpen && (
          <EmployeeCreateFeature
            tenantSlug={tenantSlug}
            onSuccess={() => setIsCreateOpen(false)}
            onCancel={() => setIsCreateOpen(false)}
          />
        )}

        {/* Feature C: Edit (modal) */}
        {editingId && (
          <EmployeeEditFeature
            employeeId={editingId}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        )}

        {/* Feature D: Detail (sidebar) */}
        {selectedId && (
          <EmployeeDetailFeature
            employeeId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
```

### Example 3: Multi-Tab Widget

```typescript
// widgets/company-settings-widget.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { CompanySettingsFeature } from '@/features/company/settings';
import { CompanyMembersFeature } from '@/features/company/members';
import { DashboardLayout } from './dashboard-layout';

export function CompanySettingsWidget() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <DashboardLayout title="Company Settings">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Each tab is a feature */}
        <TabsContent value="general">
          <CompanySettingsFeature />
        </TabsContent>

        <TabsContent value="members">
          <CompanyMembersFeature />
        </TabsContent>

        <TabsContent value="billing">
          <CompanyBillingFeature />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
```

---

## Widget Communication Patterns

### Pattern 1: Via Props (Simple)

```typescript
// Widget passes data between features
function Widget() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <FeatureList onSelect={setSelected} />
      {selected && <FeatureDetail id={selected} />}
    </>
  );
}
```

### Pattern 2: Via Apollo Cache (Complex Data)

```typescript
// Multiple features read/write same Apollo cache
function Widget() {
  // Feature A updates: useCreateEmployee → Apollo mutation → cache updated
  // Feature B reads: useGetEmployees → Apollo query → reads from cache
  // No explicit communication needed!

  return (
    <>
      <EmployeeCreateFeature />
      <EmployeeListFeature />
    </>
  );
}
```

### Pattern 3: Via Zustand Store (Intermediate)

```typescript
// Widget creates feature-specific store
function Widget() {
  // Features share store created at widget level
  // Not global, just shared between this widget's features

  return (
    <>
      <EmployeeListFeature />
      <EmployeeDetailFeature />
    </>
  );
}
```

---

## Widget Rules

✅ **DO:**

- Compose multiple features
- Manage layout and navigation
- Handle UI orchestration
- Pass simple callbacks
- Use Apollo cache for data consistency
- Keep state minimal (just UI state)

❌ **DON'T:**

- Call APIs directly (use features)
- Have business logic
- Store server data (use Apollo)
- Have complex logic
- Import from shared/lib directly (pass as props)
- Create new entity hooks

---

## All Widgets Checklist

```
✅ Dashboard Layout (sidebar, header, breadcrumbs)
✅ Employees Widget (list + create + detail)
✅ Departments Widget (list + create + detail)
✅ Processes Widget (list + create + detail)
✅ Assignments Widget (list + create + detail)
✅ Company Settings Widget (tabbed settings)
✅ File Upload Widget (multi-step upload)
✅ Onboarding Widget (step-by-step flow)
```

---

## Page → Widget → Feature Flow

```
Page:
  <EmployeesPage tenantSlug="acme" />
    │
    ├─ Read route params
    ├─ Render widget
    └─ That's it!

Widget:
  <EmployeesWidget tenantSlug="acme" />
    │
    ├─ Manage UI state (selected, modal open)
    ├─ Compose features
    └─ Handle communication between features

Feature A:
  <EmployeeListFeature tenantSlug="acme" onSelect={...} />
    │
    ├─ Use entity hooks (useGetEmployees)
    ├─ Use store for pagination/filter
    └─ Render UI + handle actions

Feature B:
  <EmployeeCreateFeature onSuccess={...} />
    │
    ├─ Use entity hooks (useCreateEmployee)
    ├─ Handle form validation
    └─ Render form

Entity:
  useGetEmployees, useCreateEmployee
    │
    ├─ Call Apollo Client
    ├─ Manage GraphQL cache
    └─ Return data/mutations
```

---

## Testing Widgets

Widgets are light on logic, so minimal testing:

```typescript
// widgets/employees-widget.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { EmployeesWidget } from './employees-widget';

test('should show create button', () => {
  render(
    <MockedProvider mocks={[]}>
      <EmployeesWidget tenantSlug="acme" />
    </MockedProvider>
  );

  expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument();
});

test('should show create modal when button clicked', async () => {
  const user = userEvent.setup();
  render(
    <MockedProvider mocks={[]}>
      <EmployeesWidget tenantSlug="acme" />
    </MockedProvider>
  );

  await user.click(screen.getByRole('button', { name: /add employee/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

---

## Next Steps

- Create all widgets during Phase 5
- Reference [features-guide.md](./features-guide.md) for feature composition
- Use [implementation-checklist.md](./implementation-checklist.md) Phase 5 for widget build tasks
