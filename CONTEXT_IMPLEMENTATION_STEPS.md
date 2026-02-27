/\*\*

- ============================================================================
- Context Builder Implementation Steps
- ============================================================================
- What needs to be filled in to complete the refactoring
- ============================================================================
  \*/

/\*\*

- STEP 1: Implement DataLoaders in builder.ts
- ================================================================
-
- Location: server/graphql/context-builder/builder.ts
- Function: createDataLoadersForRequest()
-
- What to do:
- 1.  Import existing dataloaders from context/dataloaders.ts
- 2.  Create fresh instances for this request
- 3.  Return LoaderRegistry interface
-
- Example:
  \*/

export const step1DataloaderExample = `
// server/graphql/context-builder/builder.ts

import {
createEmployeeDataLoader,
createDepartmentDataLoader,
// ... other loaders
} from "../context/dataloaders";

function createDataLoadersForRequest(prisma: PrismaClient): LoaderRegistry {
// Fresh instance per request - CRITICAL!
return {
employee: createEmployeeDataLoader(prisma),
department: createDepartmentDataLoader(prisma),
process: createProcessDataLoader(prisma),
grade: createGradeDataLoader(prisma),
taskAssignment: createTaskAssignmentDataLoader(prisma),
loadSnapshot: createLoadSnapshotDataLoader(prisma),
gapAnalysis: createGapAnalysisDataLoader(prisma),
employeeHistory: createEmployeeHistoryDataLoader(prisma),
auditLog: createAuditLogDataLoader(prisma),
};
}

interface LoaderRegistry {
employee: DataLoader<string, any>;
department: DataLoader<string, any>;
process: DataLoader<string, any>;
grade: DataLoader<number, any>;
taskAssignment: DataLoader<string, any>;
loadSnapshot: DataLoader<string, any>;
gapAnalysis: DataLoader<string, any>;
employeeHistory: DataLoader<string, any>;
auditLog: DataLoader<string, any>;
}
`;

/\*\*

- STEP 2: Implement Services in builder.ts
- ================================================================
-
- Location: server/graphql/context-builder/builder.ts
- Function: createServicesForRequest()
-
- What to do:
- 1.  Instantiate ServiceFactory with fresh loaders
- 2.  Get all services from factory
- 3.  Return ServicesRegistry
-
- Example:
  \*/

export const step2ServiceExample = `
// server/graphql/context-builder/builder.ts

import { ServiceFactory } from "@/server/services/ServiceFactory";

function createServicesForRequest(
prisma: PrismaClient,
loaders: LoaderRegistry,
): ServicesRegistry {
// Fresh instance per request with fresh loaders
const factory = new ServiceFactory({
prisma,
loaders,
// Pass other context if needed
});

// Return all services from factory
return {
// Core domain services
employee: factory.getEmployeeService(),
company: factory.getCompanyService(),
department: factory.getDepartmentService(),
grade: factory.getGradeService(),

    // Operation domain services
    process: factory.getProcessService(),
    taskAssignment: factory.getTaskAssignmentService(),

    // Analytics services
    workload: factory.getWorkloadService(),
    gapAnalysis: factory.getGapAnalysisService(),

    // Audit services
    auditLog: factory.getAuditLogService(),
    employeeHistory: factory.getEmployeeHistoryService(),

};
}

interface ServicesRegistry {
employee: EmployeeService;
company: CompanyService;
department: DepartmentService;
grade: GradeService;
process: ProcessService;
taskAssignment: TaskAssignmentService;
workload: WorkloadService;
gapAnalysis: GapAnalysisService;
auditLog: AuditLogService;
employeeHistory: EmployeeHistoryService;
}
`;

/\*\*

- STEP 3: Update ServiceFactory Constructor
- ================================================================
-
- Location: server/services/ServiceFactory.ts
-
- What to do:
- 1.  Ensure ServiceFactory accepts loaders in constructor
- 2.  Pass loaders to all services
- 3.  Ensure each service gets fresh loaders (not cached)
-
- Example:
  \*/

export const step3FactoryExample = `
// server/services/ServiceFactory.ts

import { LoaderRegistry } from "@/server/graphql/context-builder/builder";

export class ServiceFactory {
private loaders: LoaderRegistry;
private prisma: PrismaClient;

constructor(context: {
prisma: PrismaClient;
loaders: LoaderRegistry;
}) {
this.prisma = context.prisma;
this.loaders = context.loaders;

    // CRITICAL: Don't cache services!
    // Each service gets the loaders that were passed in

}

// Each service getter creates fresh instance with loaders
getEmployeeService(): EmployeeService {
return new EmployeeService(this.prisma, this.loaders);
}

getCompanyService(): CompanyService {
return new CompanyService(this.prisma, this.loaders);
}

// ... all other services
}
`;

/\*\*

- STEP 4: Update GraphQLContext Type
- ================================================================
-
- Location: server/graphql/context.ts
-
- What to do:
- 1.  Import LoaderRegistry and ServicesRegistry
- 2.  Remove Record<string, any> placeholders
- 3.  Use proper types
-
- Example:
  \*/

export const step4TypesExample = `
// server/graphql/context.ts

import type { LoaderRegistry } from "./context-builder/builder";
import type { ServicesRegistry } from "../services/ServiceFactory";

export type GraphQLContext = {
prisma: typeof prisma;
user: UserType | null;
loaders: LoaderRegistry; // ← Replace Record<string, any>
services: ServicesRegistry; // ← Replace Record<string, any>
requestId: string;
requestStartTime: number;
userAgent?: string;
};
`;

/\*\*

- STEP 5: Test the Integration
- ================================================================
-
- Verification tests to run:
  \*/

export const step5TestsExample = `
// Check 1: Type Safety
✓ resolvers/core/employee/query.ts compiles without type errors
✓ context.services.<domain>.<method> autocomplete works
✓ withMiddleware properly infers argument types

// Check 2: Dataloader Isolation
✓ Run two concurrent requests, verify loaders are different instances
✓ Verify no batching across different requests
✓ Verify batching within same request works

// Check 3: Service Isolation
✓ Request A and Request B get different service instances
✓ Service cache doesn't leak between requests
✓ Services properly use loaders for N+1 prevention

// Check 4: Middleware Execution
✓ Auth middleware works (requireAuth: true)
✓ Permission middleware works (requiredPermissions: [...])
✓ Validation middleware works
✓ Error handling works

// Check 5: Request Flow
✓ GET /api/graphql works (subscription/introspection)
✓ POST /api/graphql works (queries/mutations)
✓ Query response time is acceptable
✓ Concurrent requests don't interfere
`;

/\*\*

- STEP 6: Validation Checklist
- ================================================================
  \*/

export const validationChecklist = `
After implementing:

Core Requirements:
□ Middleware has correct context type (GraphQLContext)
□ buildGraphQLContext creates fresh loaders
□ buildGraphQLContext creates fresh services
□ Services receive fresh loaders, not stale ones
□ No global/singleton services (prevents cache pollution)

Type Safety:
□ All resolver args properly typed
□ context.services properly typed
□ context.loaders properly typed
□ No more type mismatches in withMiddleware

Request Isolation:
□ Two concurrent requests get different contexts
□ Thread-safe: no mutation of shared state
□ User A's queries don't see User B's data
□ Cache properly scoped per request

Performance:
□ Dataloaders batch within request (N+1 prevention)
□ Services use loaders consistently
□ No unnecessary service recreations
□ Request creation overhead is minimal

Next.js Specific:
□ Works with startServerAndCreateNextHandler
□ Handles Next.js request/response objects
□ No Express-specific code leaking in
□ app/api/graphql/route.ts properly exports handlers
`;

/\*\*

- FINAL SUMMARY
- ================================================================
-
- What's been fixed:
- ✓ Middleware types match resolver context
- ✓ Context builder adapted for Next.js
- ✓ Fresh dataloaders per request (no stale batches)
- ✓ Fresh services per request (no cache pollution)
- ✓ Single context creation (no double enrichment)
-
- What needs implementation:
- 1.  createDataLoadersForRequest() - wire up loaders
- 2.  createServicesForRequest() - instantiate factory
- 3.  Update ServiceFactory to use loaders
- 4.  Update type definitions for full type safety
- 5.  Test request isolation and performance
      \*/
