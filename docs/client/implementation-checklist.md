# Implementation Checklist

7-phase implementation plan for building the complete client application. Follow sequentially.

---

## Overview

```
Phase 1: Foundation (2-3 days)
  └─ Auth, stores, Apollo setup, i18n

Phase 2: Entities (1-2 days)
  └─ All 8 entity folders with types, schemas, GraphQL docs

Phase 3: Core Features (3-5 days)
  └─ List, create, edit, delete, detail for each entity

Phase 4: Cross-Entity Features (2-3 days)
  └─ File upload, onboarding, auth flows

Phase 5: Widgets & Pages (2-3 days)
  └─ Assemble features into widgets, connect to pages

Phase 6: Polish & UX (2-3 days)
  └─ Loading states, animations, error handling, notifications

Phase 7: Testing & Optimization (3-5 days)
  └─ Unit, integration, E2E tests, performance tuning
```

**Total: 2-3 weeks for full MVP**

---

## Phase 1: Foundation (2-3 days)

### Goals

- Set up authentication system
- Create global Zustand stores
- Configure Apollo Client
- Verify i18n working
- Create shared infrastructure

### Checklist

- [ ] **Authentication Setup**
  - [ ] Create `shared/hooks/use-auth.ts`
  - [ ] Create `shared/stores/auth.store.ts` with user state
  - [ ] Create `shared/hooks/use-auth-guard.ts` for protected pages
  - [ ] Create `shared/hooks/use-logout.ts` for logout logic
  - [ ] Test with `better-auth` sign-in endpoint
  - [ ] Store JWT in localStorage with secure flag
  - [ ] Verify token refreshes work

- [ ] **Apollo Client Setup**
  - [ ] Create `shared/graphql/apollo-client.ts`
  - [ ] Set up HttpLink with correct endpoint
  - [ ] Add auth middleware (attach token to headers)
  - [ ] Add error handling link
  - [ ] Create `shared/graphql/apollo-provider.tsx` wrapper
  - [ ] Wrap app in `app/layout.tsx`
  - [ ] Test with simple query: `{ __typename }`

- [ ] **Global Stores**
  - [ ] Create `shared/stores/auth.store.ts` (user, isAuthenticated)
  - [ ] Create `shared/stores/company.store.ts` (currentCompany, tenants)
  - [ ] Create `shared/stores/index.ts` to export all
  - [ ] Test store persistence in localStorage

- [ ] **Shared Utilities**
  - [ ] Create `shared/hooks/index.ts`
  - [ ] Create `shared/lib/config.ts` for environment config
  - [ ] Create `shared/constants/index.ts` for common constants
  - [ ] Create `shared/lib/date-utils.ts` for date formatting
  - [ ] Create `shared/lib/number-utils.ts` for number formatting

- [ ] **Project Setup**
  - [ ] Install all dependencies from [dependencies-setup.md](./dependencies-setup.md)
  - [ ] Create `.env.local` with GRAPHQL_ENDPOINT and other vars
  - [ ] Set up TypeScript path aliases in `tsconfig.json`
  - [ ] Verify `npm run dev` works
  - [ ] Set up Git/GitHub for version control
  - [ ] Create `.gitignore` for sensitive files

- [ ] **Testing Infrastructure**
  - [ ] Install Vitest, React Testing Library, Playwright
  - [ ] Create `vitest.config.ts` and `vitest.setup.ts`
  - [ ] Create `playwright.config.ts`
  - [ ] Create `e2e/` folder structure
  - [ ] Verify `npm run test` works

**Acceptance Criteria:**

- App loads at http://localhost:3000
- Sign-in/sign-up work with better-auth
- Auth state persists in Zustand
- Apollo Client connected and authenticated
- Shared stores initialized
- `test` and `test:e2e` commands work

---

## Phase 2: Entities (1-2 days)

### Goals

- Create all 8 entity folders with complete structure
- Define data models and validation schemas
- Write GraphQL query/mutation documents
- Create Apollo hooks for data fetching

### Checklist

Each entity follows the same structure. Create in this order:

- [ ] **Create `entities/employee/`**
  - [ ] `model.ts` - Employee type, EmployeeListResponse, input types
  - [ ] `schema.ts` - employeeCreateSchema, employeeUpdateSchema, employeeFilterSchema
  - [ ] `api/queries.ts` - GET_EMPLOYEES, GET_EMPLOYEE, GET_EMPLOYEE_CAPACITY
  - [ ] `api/mutations.ts` - CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE
  - [ ] `api/subscriptions.ts` - ON_EMPLOYEE_UPDATED (optional)
  - [ ] `hooks.ts` - useGetEmployee, useGetEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee
  - [ ] `index.ts` - export all public APIs
  - [ ] Test schemas with unit tests
  - [ ] Test hooks with Apollo MockedProvider

- [ ] **Create `entities/department/`**
  - [ ] Same structure as employee
  - [ ] Add department-specific queries (employees in dept)
  - [ ] Test queries/mutations

- [ ] **Create `entities/process/`**
  - [ ] Same structure
  - [ ] Include process-specific fields

- [ ] **Create `entities/assignment/`**
  - [ ] Same structure
  - [ ] Include workload/capacity fields

- [ ] **Create `entities/company/`**
  - [ ] model.ts - Company, timezone, working hours
  - [ ] schema.ts - companyCreateSchema, companyUpdateSchema
  - [ ] queries.ts - GET_COMPANY, GET_COMPANIES
  - [ ] mutations.ts - CREATE_COMPANY, UPDATE_COMPANY
  - [ ] hooks.ts - useGetCompany, useUpdateCompany
  - [ ] index.ts

- [ ] **Create `entities/grade/`** (read-only)
  - [ ] model.ts - Grade, kGrade
  - [ ] queries.ts - GET_GRADES
  - [ ] hooks.ts - useGetGrades (for dropdowns)
  - [ ] index.ts

- [ ] **Create `entities/user/`**
  - [ ] model.ts - User type
  - [ ] queries.ts - GET_CURRENT_USER, GET_USER
  - [ ] mutations.ts - UPDATE_PROFILE
  - [ ] hooks.ts - useGetCurrentUser, useUpdateProfile
  - [ ] index.ts

- [ ] **Create `entities/upload/`**
  - [ ] model.ts - Upload, UploadError
  - [ ] queries.ts - GET_UPLOAD_PROGRESS, GET_UPLOAD_ERRORS
  - [ ] mutations.ts - not needed (REST endpoint)
  - [ ] hooks.ts - useGetUploadProgress, useGetUploadErrors
  - [ ] index.ts

**Acceptance Criteria:**

- All 8 entity folders created with complete structure
- All TypeScript types compile without errors
- All Zod schemas validate data correctly
- All GraphQL documents are valid (can introspect)
- All Apollo hooks work with MockedProvider
- No runtime errors when importing entities

---

## Phase 3: Core Features (3-5 days)

### Goals

- Create CRUD features for all core entities
- Implement store, hooks, UI components separately
- Test features with mocked Apollo

### Checklist

For each feature, follow this pattern:

- [ ] **Employee Features**
  - [ ] `features/employee/list/`
    - [ ] `ui/employee-list.tsx` - Main list component
    - [ ] `ui/employee-table.tsx` - Table component (dumb)
    - [ ] `ui/employee-filters.tsx` - Filter component
    - [ ] `ui/employee-pagination.tsx` - Pagination
    - [ ] `store.ts` - zustand for page, sort, filter
    - [ ] `hooks.ts` - useEmployeeList, useListActions, useListUI
    - [ ] `index.ts` - EmployeeListFeature export
    - [ ] Tests: store, hooks, component
  - [ ] `features/employee/create/`
    - [ ] `ui/employee-form.tsx` - Form component
    - [ ] `ui/employee-form-dialog.tsx` - Dialog wrapper
    - [ ] `store.ts` - zustand for modal state
    - [ ] `hooks.ts` - useCreateEmployee
    - [ ] `index.ts` - EmployeeCreateFeature export
    - [ ] Integrate react-hook-form + Zod validation
    - [ ] Tests
  - [ ] `features/employee/edit/`
    - [ ] Copy create, modify for edit
    - [ ] Pre-populate form with employee data
    - [ ] Tests
  - [ ] `features/employee/delete/`
    - [ ] `ui/delete-confirmation-dialog.tsx`
    - [ ] `hooks.ts` - useDeleteEmployee
    - [ ] `index.ts` - EmployeeDeleteFeature
    - [ ] Tests
  - [ ] `features/employee/detail/`
    - [ ] `ui/employee-detail.tsx` - Read-only view
    - [ ] `ui/employee-capacity.tsx` - Capacity display
    - [ ] `ui/employee-history.tsx` - Change history
    - [ ] `hooks.ts` - useEmployeeDetail
    - [ ] `index.ts` - EmployeeDetailFeature
    - [ ] Tests

- [ ] **Department Features** (same pattern)
  - [ ] list, create, edit, delete, detail

- [ ] **Process Features** (same pattern)
  - [ ] list, create, edit, delete, detail

- [ ] **Assignment Features** (same pattern)
  - [ ] list, create, edit, delete, detail

- [ ] **Company Features**
  - [ ] `features/company/settings/`
    - [ ] Company settings form
    - [ ] Update working hours, timezone
  - [ ] `features/company/detail/`
    - [ ] Display company info

**Acceptance Criteria:**

- All CRUD features exist for core entities
- All features have tests (unit + component)
- All features use entity hooks correctly
- All features have loading/error/success states
- All forms validate with Zod
- Features can be previewed individually with MockedProvider

---

## Phase 4: Cross-Entity Features (2-3 days)

### Goals

- Implement file upload with streaming progress
- Create onboarding multi-step flow
- Build auth features (sign-in, sign-up)

### Checklist

- [ ] **File Upload Feature**
  - [ ] `features/common/file-upload/`
    - [ ] `ui/file-upload-dialog.tsx` - File input + preview
    - [ ] `ui/header-mapping.tsx` - Column mapping interface
    - [ ] `ui/upload-progress.tsx` - Progress bar with SSE
    - [ ] `ui/upload-errors.tsx` - Error display
    - [ ] `store.ts` - zustand for upload state
    - [ ] `hooks.ts` - useFilePreview, useFileUpload
    - [ ] POST `/api/upload` endpoint
    - [ ] GET `/api/upload-progress?uploadId=X` SSE endpoint
    - [ ] Client-side header parsing (papaparse)
    - [ ] Server-side processing with Bull queue
    - [ ] Bulk insert to database
    - [ ] Error handling and retry logic
    - [ ] Tests: preview, mapping, upload, progress

- [ ] **Onboarding Feature**
  - [ ] `features/common/onboarding/`
    - [ ] `ui/step-company.tsx` - Create company
    - [ ] `ui/step-role.tsx` - Select role (admin, user, readonly)
    - [ ] `ui/step-upload.tsx` - Upload employee CSV
    - [ ] `ui/step-success.tsx` - Completion message
    - [ ] `store.ts` - zustand for current step, form data
    - [ ] `hooks.ts` - useOnboarding, useOnboardingActions
    - [ ] `index.ts` - OnboardingFeature
    - [ ] Multi-step form navigation
    - [ ] Validation between steps
    - [ ] Tests: step navigation, data validation

- [ ] **Auth Features**
  - [ ] `features/common/auth/`
    - [ ] `ui/sign-in-form.tsx` - Email + password form
    - [ ] `ui/sign-up-form.tsx` - Registration form
    - [ ] `hooks.ts` - useSignIn, useSignUp, useSignOut
    - [ ] Integrate with better-auth
    - [ ] Handle JWT tokens
    - [ ] Redirect on auth state changes
    - [ ] Tests: sign-in, sign-up, sign-out

**Acceptance Criteria:**

- File upload works from CSV/XLSX selection to database
- Progress updates via SSE during upload
- Onboarding guides user through company setup, role, and data
- Auth features integrate with better-auth
- All features have tests
- No blocking the UI during long operations

---

## Phase 5: Widgets & Pages (2-3 days)

### Goals

- Create widgets that orchestrate features
- Connect pages to widgets
- Implement navigation and layout

### Checklist

- [ ] **Create Main Widgets**
  - [ ] `widgets/dashboard-layout.tsx`
    - [ ] Sidebar with navigation
    - [ ] Header with user menu
    - [ ] Breadcrumbs
    - [ ] Theme toggle
    - [ ] i18n selector
    - [ ] Responsive layout
  - [ ] `widgets/employees-widget.tsx`
    - [ ] Orchestrate: EmployeeListFeature + EmployeeCreateFeature + EmployeeDetailFeature
    - [ ] Handle: selected employee state, create modal state
    - [ ] Pass callbacks between features
  - [ ] `widgets/departments-widget.tsx` (same pattern)
  - [ ] `widgets/processes-widget.tsx` (same pattern)
  - [ ] `widgets/assignments-widget.tsx` (same pattern)
  - [ ] `widgets/company-settings-widget.tsx` (settings)

- [ ] **Create Pages**
  - [ ] `app/[locale]/layout.tsx` - Root layout
    - [ ] ApolloProvider wrapper
    - [ ] Zustand store initialization
    - [ ] i18n setup
  - [ ] `app/[locale]/(landing)/page.tsx` - Landing page
  - [ ] `app/[locale]/(auth)/sign-in/page.tsx` - Sign in
  - [ ] `app/[locale]/(auth)/sign-up/page.tsx` - Sign up
  - [ ] `app/[locale]/onboarding/page.tsx` - Onboarding flow
  - [ ] `app/[locale]/dashboard/layout.tsx` - Authenticated layout (uses DashboardLayout widget)
  - [ ] `app/[locale]/dashboard/page.tsx` - Overview/dashboard
  - [ ] `app/[locale]/dashboard/employees/page.tsx` - Employee list
  - [ ] `app/[locale]/dashboard/employees/[id]/page.tsx` - Employee detail
  - [ ] `app/[locale]/dashboard/departments/page.tsx` - Dept list
  - [ ] `app/[locale]/dashboard/departments/[id]/page.tsx` - Dept detail
  - [ ] `app/[locale]/dashboard/processes/page.tsx` - Process list
  - [ ] `app/[locale]/dashboard/processes/[id]/page.tsx` - Process detail
  - [ ] `app/[locale]/dashboard/assignments/page.tsx` - Assignment list
  - [ ] `app/[locale]/dashboard/settings/page.tsx` - Settings

- [ ] **Routing & Navigation**
  - [ ] Verify all routes load
  - [ ] Test navigation between pages
  - [ ] Test route parameters (e.g., `/employees/[id]`)
  - [ ] Test redirects (e.g., `/` → `/dashboard` if authenticated)

**Acceptance Criteria:**

- All pages load without errors
- Navigation works between pages
- Widgets properly compose features
- Dynamic routes work (e.g., `/employees/emp-123`)
- Layout is consistent across pages
- User context flows through widgets to features

---

## Phase 6: Polish & UX (2-3 days)

### Goals

- Add loading states and skeleton loaders
- Add error boundaries and error handling
- Implement animations and transitions
- Add notifications and feedback
- Complete UI polish

### Checklist

- [ ] **Loading States**
  - [ ] Add skeleton loaders for all tables
  - [ ] Add skeleton for forms
  - [ ] Add progress indicators
  - [ ] Test with network throttling

- [ ] **Error Handling**
  - [ ] Create error boundary component
  - [ ] Add error messaging to all features
  - [ ] Add retry mechanisms for failed queries
  - [ ] Handle network errors gracefully

- [ ] **Animations**
  - [ ] Add page transitions with framer-motion
  - [ ] Animate list items on load
  - [ ] Animate form submission
  - [ ] Animate modal open/close
  - [ ] Don't overdo - keep professional

- [ ] **Notifications**
  - [ ] Toast component for success/error/warning
  - [ ] Show on create/update/delete actions
  - [ ] Show on auth state changes
  - [ ] Show upload progress notifications

- [ ] **Empty States**
  - [ ] Add empty state messaging for empty lists
  - [ ] Add CTA button to create first item
  - [ ] Make empty states helpful, not just blank

- [ ] **Responsive Design**
  - [ ] Test on mobile (< 640px)
  - [ ] Test on tablet (640px - 1024px)
  - [ ] Test on desktop (> 1024px)
  - [ ] Adjust Tailwind breakpoints

- [ ] **Accessibility**
  - [ ] Add alt text to images
  - [ ] Test keyboard navigation
  - [ ] Add ARIA labels where needed
  - [ ] Test with screen reader

**Acceptance Criteria:**

- App feels responsive and fluid
- Loading states prevent UI jank
- Errors don't crash the app
- Animations are smooth but not distracting
- Mobile experience is good
- Keyboard navigation works

---

## Phase 7: Testing & Optimization (3-5 days)

### Goals

- Achieve 80%+ test coverage
- Performance optimization
- Production readiness check

### Checklist

- [ ] **Unit Tests**
  - [ ] Test all Zod schemas (entities)
  - [ ] Test all Zustand stores
  - [ ] Test utility functions
  - [ ] Aim for 80%+ statement coverage
  - [ ] Fix any failing tests

- [ ] **Component Tests**
  - [ ] Test all UI components
  - [ ] Test form validation
  - [ ] Test loading/error states
  - [ ] Test user interactions (click, type)

- [ ] **Integration Tests**
  - [ ] Test features with MockedProvider
  - [ ] Test feature-to-feature communication
  - [ ] Test Apollo cache updates
  - [ ] Test store updates

- [ ] **E2E Tests**
  - [ ] Test auth flow (sign-up, sign-in, sign-out)
  - [ ] Test employee CRUD flow
  - [ ] Test file upload flow
  - [ ] Test multi-tenant isolation
  - [ ] Test onboarding flow

- [ ] **Performance**
  - [ ] Measure Lighthouse scores
  - [ ] Check bundle size (npm run build)
  - [ ] Profile with DevTools
  - [ ] Optimize images (next/image)
  - [ ] Cache static assets
  - [ ] Lazy load non-critical pages

- [ ] **Production Checklist**
  - [ ] Verify API endpoints are correct (production URLs)
  - [ ] Verify env variables are set
  - [ ] Check for console errors/warnings
  - [ ] Test error logging (Sentry integration optional)
  - [ ] Test analytics integration (optional)
  - [ ] Setup monitoring/alerting
  - [ ] Create runbook for common issues

- [ ] **Documentation**
  - [ ] Update README with setup instructions
  - [ ] Document environment variables
  - [ ] Document common development tasks
  - [ ] Create architecture diagrams
  - [ ] Add inline code comments for complex logic

**Acceptance Criteria:**

- Test coverage > 80%
- All E2E tests pass
- Lighthouse score > 80
- No console errors in production
- App performs well under load
- Team can onboard to codebase easily

---

## Success Metrics

After all 7 phases:

```
✅ Feature Complete
   - All CRUD operations working
   - File upload fully functional
   - Onboarding complete
   - Authentication secure

✅ Quality
   - Test coverage > 80%
   - No console errors
   - Lighthouse > 80
   - Zero critical bugs

✅ Performance
   - First Contentful Paint < 2s
   - Lighthouse score > 80
   - All pages load in < 3s

✅ User Experience
   - Loading states everywhere
   - Smooth animations
   - Good mobile experience
   - Clear error messages

✅ Maintainability
   - Consistent code style
   - Comprehensive documentation
   - Clear architecture
   - Easy to add new features
```

---

## Parallel Work

**These phases can have some parallelization:**

- Phase 1 & 2 are sequential (need Apollo before entities)
- Phase 3 features can be built in parallel (employee + department simultaneously)
- Phase 4 can start after Phase 2 (doesn't need Phase 3)
- Phase 5 can start once Phase 3 is 50% done
- Phase 6 & 7 can overlap with Phase 5

**Estimated team velocity:**

- 1 developer: 2-3 weeks
- 2 developers: 1.5-2 weeks (if coordinated)

---

## Next Steps

- Start Phase 1 immediately
- Follow each checklist item in order
- Run tests frequently
- Commit to git after each phase
- Review [fsd-architecture.md](./fsd-architecture.md) while building
- Refer to [naming-conventions.md](./naming-conventions.md) for consistency

**Ready to build?** Let's go! 🚀
