# Data Flow

Understanding how data moves through the application is critical for debugging and architecture decisions.

---

## Complete Data Flow: Create Employee

```
Step 1: USER ACTION
┌─────────────────────────────────────┐
│  User clicks "Create" button         │
│  in EmployeeCreateForm component     │
└──────────────┬──────────────────────┘
               │
               ▼
Step 2: FEATURE HOOK (Business Logic)
┌─────────────────────────────────────┐
│  Feature hook executes:              │
│  useCreateEmployee()                 │
│                                       │
│  1. Validates form with Zod          │
│  2. Calls entity mutation hook       │
│  3. Handles loading/error/success    │
│  4. Updates feature store            │
│  5. Calls Apollo mutation            │
└──────────────┬──────────────────────┘
               │
               ▼
Step 3: ENTITY HOOK (Data Layer)
┌─────────────────────────────────────┐
│  Entity hook executes:               │
│  useCreateEmployee() (from entity)   │
│                                       │
│  1. Receives validated input         │
│  2. Calls Apollo useMutation()       │
│  3. Returns mutation function        │
│  4. Handles cache updates            │
└──────────────┬──────────────────────┘
               │
               ▼
Step 4: APOLLO CLIENT (GraphQL Client)
┌─────────────────────────────────────┐
│  Apollo Client executes:             │
│  1. Sends CREATE_EMPLOYEE mutation   │
│  2. Specifies variables (input)      │
│  3. Sets refetchQueries              │
│  4. Awaits server response           │
│  5. Updates Apollo cache             │
└──────────────┬──────────────────────┘
               │
               ▼ GraphQL over HTTPS
Step 5: SERVER RECEIVES REQUEST
┌─────────────────────────────────────┐
│  Next.js API Route: /api/graphql     │
│  Apollo Server processes request     │
└──────────────┬──────────────────────┘
               │
               ▼
Step 6: GRAPHQL RESOLVER
┌─────────────────────────────────────┐
│  Resolver execution:                 │
│  server/graphql/mutations/            │
│  employee/createEmployee.resolver.ts │
│                                       │
│  1. Validates request context        │
│  2. Calls EmployeeService.create()   │
└──────────────┬──────────────────────┘
               │
               ▼
Step 7: SERVICE LAYER
┌─────────────────────────────────────┐
│  EmployeeService.create()            │
│                                       │
│  1. Validates input with Zod         │
│  2. Checks business rules            │
│  3. Calls repository.create()        │
│  4. Invalidates cache                │
│  5. Emits event (optional)           │
└──────────────┬──────────────────────┘
               │
               ▼
Step 8: REPOSITORY LAYER
┌─────────────────────────────────────┐
│  EmployeeRepository.create()         │
│                                       │
│  1. Executes Prisma query            │
│  2. Inserts to database              │
│  3. Returns created data             │
└──────────────┬──────────────────────┘
               │
               ▼
Step 9: DATABASE
┌─────────────────────────────────────┐
│  PostgreSQL                          │
│  INSERT INTO employee (...)          │
│  VALUES (...)                        │
│  RETURNING *;                        │
└──────────────┬──────────────────────┘
               │
               ▼ Response bubbles back up
Step 10: RESPONSE TO CLIENT
┌─────────────────────────────────────┐
│  Apollo receives response:           │
│  {                                    │
│    "data": {                         │
│      "createEmployee": {             │
│        "id": "emp-123",              │
│        "fio": "John Doe",            │
│        "email": "john@acme.com"      │
│      }                                │
│    }                                  │
│  }                                    │
└──────────────┬──────────────────────┘
               │
               ▼
Step 11: APOLLO CACHE UPDATE
┌─────────────────────────────────────┐
│  Apollo automatically:               │
│  1. Updates cache with new data      │
│  2. Executes refetchQueries          │
│  3. Refetches GET_EMPLOYEES          │
│  4. Updates list in cache            │
└──────────────┬──────────────────────┘
               │
               ▼
Step 12: FEATURE HOOK UPDATES
┌─────────────────────────────────────┐
│  Feature hook receives update:       │
│  1. Apollo data changes              │
│  2. Component re-renders             │
│  3. useCreateEmployee returns new    │
│     state (loading: false)           │
│  4. Form clears                      │
│  5. List refreshes automatically     │
└──────────────┬──────────────────────┘
               │
               ▼
Step 13: UI UPDATES
┌─────────────────────────────────────┐
│  React re-renders:                   │
│  1. Modal closes                     │
│  2. List shows new employee          │
│  3. Success toast appears            │
│  4. Feature store clears             │
└─────────────────────────────────────┘
```

---

## Data Flow: List with Filtering

```
USER ACTION: Type in filter
    ↓
useEmployeeListActions().onFilterChange(value)
    ↓
Feature store: setFilter(value)
    ↓
Component re-renders
    ↓
useEmployeeList() hook runs:
  - Gets updated filter from store
  - Calls useGetEmployees with new variables
    ↓
Apollo Client:
  - Sends GET_EMPLOYEES query with new filter
  - Server executes query
  - Returns filtered list
  - Updates cache
    ↓
Component receives new data
    ↓
Table re-renders with filtered employees
```

---

## Data Flow: Server-Side Pagination

```
Page 1:
  variables: { page: 1, limit: 20 }
  ↓
Server returns: employees[0-19], total: 543
  ↓
Apollo caches under key: GetEmployees(page:1)
  ↓
UI renders page 1

User clicks "Next"
  ↓
useEmployeeListActions().onPageChange(2)
  ↓
Feature store: setPage(2)
  ↓
useEmployeeList() runs with page: 2
  ↓
Apollo sends: GET_EMPLOYEES(page: 2)
  ↓
Server returns: employees[20-39]
  ↓
Apollo caches under key: GetEmployees(page:2)
  ↓
UI renders page 2
```

---

## Data Flow: File Upload

```
USER ACTION: Select file
    ↓
Component calls: useFileUpload.previewFile(file)
    ↓
Client-side (SYNC):
  - Read file (first 10 rows)
  - Parse headers instantly
  - Show mapping UI
    ↓
USER ACTION: Confirm mapping
    ↓
Feature hook: useFileUpload.upload(file, mapping)
    ↓
Client sends:
  - POST /api/upload
  - multipart: file, mapping
    ↓
Server receives:
  - Generates uploadId
  - Creates Upload record (status: pending)
  - Queues job with Bull
  - Returns uploadId immediately (UI unblocked ✅)
    ↓
Client opens SSE: GET /api/upload-progress?uploadId=X
    ↓
Server (async, background):
  - Reads file stream (in chunks)
  - Applies mapping transform
  - Validates with Zod
  - Batch inserts to DB
  - Updates Upload record on file
  - Updates progress%
    ↓
SSE sends progress event every chunk:
  - { progress: 25, status: 'processing', rowsProcessed: 250 }
    ↓
Client progress bar updates (non-blocking)
    ↓
Server completes:
  - Updates Upload status: complete
  - SSE sends final event
  - Client closes connection
    ↓
Feature invalidates cache:
  - Apollo refetch GET_EMPLOYEES
  - List shows new data
    ↓
UI shows success notification
```

---

## Cache Invalidation Strategy

### Automatic (Apollo)

```typescript
// When mutation completes, Apollo automatically:
const [create] = useMutation(CREATE_EMPLOYEE, {
  refetchQueries: [{ query: GET_EMPLOYEES }],
  // GET_EMPLOYEES automatically refetches across the app
});
```

### Manual (Zustand)

```typescript
// Feature store can trigger syncs
const store = useFeatureStore();
store.invalidate(); // Clears feature state

// OR clear specific cache keys
apollo.cache.evict({ id: `Employee:${id}` });
```

### Multitenancy Cache Isolation

```typescript
// Every query includes tenantSlug
useGetEmployees({
  variables: {
    tenantSlug: "acme", // Keeps caches separate
    page: 1,
  },
});

// Switching tenants automatically:
// - useGetEmployees refetches with new tenantSlug
// - Apollo caches are separate: GetEmployees(tenantSlug:acme) vs GetEmployees(tenantSlug:contoso)
```

---

## Error Handling Flow

```
User submits form
    ↓
Feature hook: handleSubmit(data)
    ↓
Validation error?
  ❌ YES: Show field errors, don't send to server
  ✅ NO: Continue
    ↓
Apollo mutation executed
    ↓
Network error?
  ❌ YES: Show "Network error" toast
  ✅ NO: Continue
    ↓
Server validation error (400)?
  ❌ YES: Show "Invalid input" + server error message
  ✅ NO: Continue
    ↓
Server error (500)?
  ❌ YES: Show error toastand log to Sentry
  ✅ NO: Success!
    ↓
Clear form, show success, close modal
```

---

## Request Context & Multitenancy

```
Every request includes context:

        ┌─────────────
        |
Client sends GraphQL query
        |
        ├─ headers: { authorization: 'Bearer token' }
        |
        ▼
Server middleware:
  - authenticate() → extracts user from token
  - getCompanyContext() → gets user's company
        |
        ├─ context.user = { id, email, companyId, tenantSlug }
        ├─ context.company = { id, name, timezone, ... }
        ├─ context.tenantSlug = 'acme'
        |
        ▼
Resolver receives context:
  - Always filters by context.companyId
  - Validates user has permission
  - Returns only user's data (multitenancy safe ✅)
        |
        ▼
Response sent client

Client stores context in Zustand:
  - useCompanyStore().setCurrentCompany(company)
  - useAuthStore().setUser(user)
        |
        ▼
Every feature uses context:
  - useEmployeeList() passes tenantSlug from router/store
  - Apollo includes tenantSlug in variables
  - Server filters by tenantSlug
```

---

## SSR → Client Data Handoff (ISR)

```
1. Build Time (ISR Revalidation):
   - Next.js generates /dashboard/employees page
   - Apollo client fetches GET_EMPLOYEES
   - HTML rendered with data
   - Cached for N seconds

2. First User Request (Cache Hit):
   - User requests /dashboard/employees
   - Server returns pre-rendered HTML
   - Apollo rehydrates with cached data
   - Page is interactive immediately

3. Apollo Hydration:
   - Apollo cache populated from server SSR data
   - Client hooks subscribe to cache
   - User interacts → Apollo updates cache
   - No duplicate network requests

4. Cache Stale (ISR Revalidation):
   - User makes fresh request after TTL
   - Next.js revalidates in background
   - Fresh data fetched
   - HTML regenerated
   - Next user gets fresh page
```

---

## Real-time Updates (Optional)

```
If implementing subscriptions:

Server publishes event:
  EMPLOYEE_UPDATED { id: 'emp-123', fio: 'Jane Doe' }
    ↓
Apollo subscription listening:
  ON_EMPLOYEE_UPDATED subscription
    ↓
Apollo updates cache with new data:
  Employee:emp-123 cache updated in real-time
    ↓
Component re-renders automatically:
  useGetEmployee(id) hook receives new data
  ✅ No refetch needed!
```

---

## Debugging Data Flow

When something breaks, trace the request:

1. **Check Browser DevTools**
   - Network tab: see GraphQL request/response
   - Redux DevTools (if using): inspect Apollo cache
   - Console: errors or warnings

2. **Check Server Logs**
   - Verify resolver executed
   - Check service layer logic
   - Verify repository query
   - Check database response

3. **Check Cache**
   - Apollo DevTools extension
   - Look at cache state
   - Check if refetchQueries ran
   - Verify cache keys match

4. **Check Feature State**
   - Zustand DevTools (browser extension)
   - Verify store state updated
   - Check store actions run
   - Verify component received props

---

## Next Steps

- Study specific data flows for your features
- Trace requests through browser DevTools
- Use Apollo DevTools and Zustand DevTools for debugging
- Read [implementation-checklist.md](./implementation-checklist.md) for phase-by-phase data setup
