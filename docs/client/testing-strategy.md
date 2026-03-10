# Testing Strategy

Comprehensive testing approach for client-side code covering unit, component, integration, and E2E tests.

---

## Testing Pyramid

```
           / \
          /   \  E2E Tests (10%)
         /     \  Playwright - Full user flows
        /-------\
       /         \
      /           \ Integration Tests (30%)
     /             \ Feature + mocked Apollo
    /               \ Test communication
   /------------ ----\
  /                   \
 /                     \ Unit Tests (60%)
/                       \ Schemas, hooks, utilities
/_______________________\
```

**Why this pyramid:**

- E2E: Most important but slowest (full browser)
- Integration: Features with realistic data
- Unit: Fast feedback, high coverage
- Total coverage target: 80%+

---

## Unit Tests (Vitest + React Testing Library)

### Test Files Location

```
src/
├── entities/employee/
│   ├── model.ts
│   ├── schema.ts
│   ├── schema.test.ts          ✅ Schema validation
│   ├── api/
│   │   └── queries.ts
│   └── hooks.ts
│
├── features/employee/list/
│   ├── hooks.ts
│   ├── hooks.test.ts           ✅ Feature logic
│   └── store.ts
│       └── store.test.ts        ✅ Store logic
│
└── shared/
    ├── lib/
    │   ├── formatDate.ts
    │   └── formatDate.test.ts   ✅ Utilities
    └── stores/
        ├── auth.store.ts
        └── auth.store.test.ts    ✅ Global stores
```

### Schema Validation Tests

```typescript
// entities/employee/schema.test.ts
import { describe, it, expect } from "vitest";
import { employeeCreateSchema } from "./schema";

describe("employeeCreateSchema", () => {
  it("should validate correct data", () => {
    const data = {
      fio: "John Doe",
      email: "john@example.com",
      departmentId: "dept-123",
      gradeId: "grade-123",
    };

    const result = employeeCreateSchema.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
  });

  it("should reject invalid email", () => {
    const data = {
      fio: "John Doe",
      email: "not-an-email",
      departmentId: "dept-123",
      gradeId: "grade-123",
    };

    const result = employeeCreateSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should require fio", () => {
    const data = {
      email: "john@example.com",
      departmentId: "dept-123",
      gradeId: "grade-123",
    };

    const result = employeeCreateSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
```

### Zustand Store Tests

```typescript
// shared/stores/auth.store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("should login user", () => {
    const user = {
      id: "1",
      email: "john@example.com",
      name: "John",
      companyId: "c-1",
    };
    useAuthStore.getState().login(user);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should logout user", () => {
    const user = {
      id: "1",
      email: "john@example.com",
      name: "John",
      companyId: "c-1",
    };
    useAuthStore.getState().login(user);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
```

### Utility Function Tests

```typescript
// shared/lib/calculateCapacity.test.ts
import { describe, it, expect } from "vitest";
import { calculateCapacity } from "./calculateCapacity";

describe("calculateCapacity", () => {
  it("should calculate monthly capacity", () => {
    const capacity = calculateCapacity({
      kGrade: 1.0,
      kGender: 1.0,
      workingHoursDay: 8,
      workingDaysPerMonth: 21,
    });

    expect(capacity).toBe(8 * 21); // 168 hours
  });

  it("should apply grade coefficient", () => {
    const capacity = calculateCapacity({
      kGrade: 0.5,
      kGender: 1.0,
      workingHoursDay: 8,
      workingDaysPerMonth: 21,
    });

    expect(capacity).toBe(8 * 21 * 0.5); // 84 hours
  });
});
```

---

## Component Tests (React Testing Library)

### Test Files Location

```
src/features/employee/list/ui/
├── employee-table.tsx
├── employee-table.test.tsx      ✅ Component rendering
└── employee-filters.tsx
    └── employee-filters.test.tsx  ✅ User interactions
```

### Component Rendering Tests

```typescript
// features/employee/list/ui/employee-table.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmployeeTable } from './employee-table';

describe('<EmployeeTable />', () => {
  it('should render employees', () => {
    const employees = [
      { id: '1', fio: 'John Doe', email: 'john@example.com' },
      { id: '2', fio: 'Jane Smith', email: 'jane@example.com' },
    ];

    render(<EmployeeTable employees={employees} loading={false} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<EmployeeTable employees={[]} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should call onRowClick when row clicked', async () => {
    const onRowClick = vi.fn();
    const employees = [{ id: '1', fio: 'John Doe', email: 'john@example.com' }];

    const { user } = render(
      <EmployeeTable employees={employees} loading={false} onRowClick={onRowClick} />
    );

    await user.click(screen.getByText('John Doe'));
    expect(onRowClick).toHaveBeenCalledWith('1');
  });
});
```

### Form Component Tests

```typescript
// features/employee/create/ui/employee-form.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeForm } from './employee-form';

describe('<EmployeeForm />', () => {
  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={vi.fn()} />);

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText('Name required')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EmployeeForm onSubmit={onSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.selectOption(screen.getByLabelText('Department'), 'dept-123');

    // Submit
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Wait for submit and check call
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        fio: 'John Doe',
        email: 'john@example.com',
        departmentId: 'dept-123',
      });
    });
  });
});
```

---

## Integration Tests

### Mocking Apollo Client

```typescript
// features/employee/list/hooks.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { useEmployeeList } from './hooks';
import { GET_EMPLOYEES } from '@/entities/employee';

const mockData = {
  request: {
    query: GET_EMPLOYEES,
    variables: { tenantSlug: 'acme', page: 1, limit: 20 },
  },
  result: {
    data: {
      employees: {
        nodes: [
          { id: '1', fio: 'John Doe', email: 'john@example.com' },
        ],
        total: 1,
        pages: 1,
      },
    },
  },
};

describe('useEmployeeList', () => {
  it('should fetch employees', async () => {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={[mockData]}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useEmployeeList('acme'), { wrapper });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for data
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.employees).toHaveLength(1);
    expect(result.current.employees[0].fio).toBe('John Doe');
  });

  it('should handle errors', async () => {
    const mockError = {
      request: {
        query: GET_EMPLOYEES,
        variables: { tenantSlug: 'acme', page: 1, limit: 20 },
      },
      error: new Error('Network error'),
    };

    const wrapper = ({ children }) => (
      <MockedProvider mocks={[mockError]}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useEmployeeList('acme'), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

### Feature Integration Test

```typescript
// features/employee/list/index.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { EmployeeListFeature } from './index';
import { GET_EMPLOYEES } from '@/entities/employee';

describe('<EmployeeListFeature />', () => {
  it('should display list and allow filtering', async () => {
    const user = userEvent.setup();
    const mocks = [
      {
        request: {
          query: GET_EMPLOYEES,
          variables: { tenantSlug: 'acme', page: 1, filter: '', sort: 'fio' },
        },
        result: {
          data: {
            employees: {
              nodes: [
                { id: '1', fio: 'Alice', email: 'alice@example.com' },
                { id: '2', fio: 'Bob', email: 'bob@example.com' },
              ],
              total: 2,
              pages: 1,
            },
          },
        },
      },
      {
        request: {
          query: GET_EMPLOYEES,
          variables: { tenantSlug: 'acme', page: 1, filter: 'Alice', sort: 'fio' },
        },
        result: {
          data: {
            employees: {
              nodes: [
                { id: '1', fio: 'Alice', email: 'alice@example.com' },
              ],
              total: 1,
              pages: 1,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <EmployeeListFeature tenantSlug="acme" />
      </MockedProvider>
    );

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    // Type in filter
    const filterInput = screen.getByPlaceholderText(/search/i);
    await user.type(filterInput, 'Alice');

    // Wait for filtered data
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
  });
});
```

---

## E2E Tests (Playwright)

### Test Files Location

```
e2e/
├── auth.spec.ts
├── employee-list.spec.ts
├── employee-create.spec.ts
├── file-upload.spec.ts
└── multitenancy.spec.ts
```

### Authentication Flow

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign up and login", async ({ page }) => {
    // Navigate to sign up
    await page.goto("/sign-up");

    // Fill form
    await page.fill('input[name="email"]', "newuser@example.com");
    await page.fill('input[name="password"]', "SecurePass123!");

    // Submit
    await page.click('button:has-text("Sign Up")');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
  });

  test("should login with existing credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL("/dashboard");
  });

  test("should logout", async ({ page }) => {
    // Login first
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Sign In")');

    // Click logout
    await page.click('button[href="/sign-out"]');

    // Should redirect to landing
    await expect(page).toHaveURL("/");
  });
});
```

### List & Filter Flow

```typescript
// e2e/employee-list.spec.ts
test("should list employees and filter", async ({ page }) => {
  // Login first (fixture or helper)
  await loginAs(page, "admin@acme.com");

  // Go to employees
  await page.goto("/dashboard/employees");

  // Wait for table to load
  await page.waitForSelector("table");

  // Check employees are listed
  const rows = await page.locator("table tbody tr").count();
  expect(rows).toBeGreaterThan(0);

  // Filter by name
  await page.fill('input[placeholder="Search by name"]', "John");
  await page.waitForTimeout(500); // Debounce

  // Check filtered results
  const filteredRows = await page.locator("table tbody tr").count();
  expect(filteredRows).toBeLessThanOrEqual(rows);
});
```

### File Upload Flow

```typescript
// e2e/file-upload.spec.ts
test("should upload employee CSV file", async ({ page }) => {
  await loginAs(page, "admin@acme.com");
  await page.goto("/dashboard/employees");

  // Click upload button
  await page.click('button:has-text("Upload CSV")');

  // Upload file
  const fileInput = await page.$('input[type="file"]');
  await fileInput?.setInputFiles("e2e/fixtures/employees.csv");

  // Preview headers
  await expect(page.locator("text=Name")).toBeVisible();
  await expect(page.locator("text=Email")).toBeVisible();

  // Confirm mapping
  await page.click('button:has-text("Confirm & Upload")');

  // Wait for progress
  await expect(page.locator('[role="progressbar"]')).toBeVisible();

  // Wait for completion
  await page.waitForSelector("text=Upload complete", { timeout: 30000 });

  // Verify new employee in list
  const newEmployee = await page.locator("text=New Employee Name");
  await expect(newEmployee).toBeVisible();
});
```

### Multitenancy Test

```typescript
// e2e/multitenancy.spec.ts
test("should isolate data between tenants", async ({
  page: page1,
  browser,
}) => {
  // User 1: ACME tenant
  await loginAs(page1, "user1@acme.com");
  await page1.goto("/dashboard/employees");
  const acmeEmployeeCount = await page1.locator("table tbody tr").count();

  // User 2: CONTOSO tenant (different browser context)
  const page2 = await browser.newPage();
  await loginAs(page2, "user1@contoso.com");
  await page2.goto("/dashboard/employees");
  const contosoEmployeeCount = await page2.locator("table tbody tr").count();

  // Should have different employee counts (isolation works)
  expect(acmeEmployeeCount).not.toBe(contosoEmployeeCount);
});
```

---

## Test Configuration

### `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### `vitest.setup.ts`

```typescript
import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
```

### `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Running Tests

```bash
# Unit & Component tests
npm run test                          # Watch mode
npm run test:ui                       # UI mode
npm run test:coverage                 # Coverage report

# E2E tests
npm run test:e2e                      # Headless
npm run test:e2e -- --ui              # UI mode
npm run test:e2e -- --headed          # Visible browser

# All tests
npm run test:all
```

---

## Coverage Targets

```
Statements   : > 80%
Branches     : > 75%
Functions    : > 80%
Lines        : > 80%
```

---

## Next Steps

- Set up testing infrastructure while building features
- Write tests alongside code (TDD)
- Aim for 80% coverage on critical paths
- E2E tests for user workflows
- Follow [implementation-checklist.md](./implementation-checklist.md) Phase 7: Testing
