// ============================================================================
// SERVICE FOLDER STRUCTURE - AFTER REFACTORING
// ============================================================================
// Complete file organization with BaseRepository pattern
// ============================================================================

server/services/
│
├── base/ # Base classes and utilities
│ ├── BaseRepository.ts # ✨ NEW: Generic repository base class
│ ├── BaseService.ts # Business logic base
│ ├── types.ts # Shared interfaces/types
│ ├── index.ts # Exports (updated with BaseRepository)
│ └── fsm/ # ✨ NEW: Finite State Machine
│ └── FiniteStateMachine.ts # State transition validation
│
├── core/ # Core business domain
│ ├── company/
│ │ ├── Company.repository.ts # ← extends BaseRepository<Company>
│ │ ├── Company.service.ts # Business logic
│ │ └── index.ts # Exports both
│ ├── employee/
│ │ ├── Employee.repository.ts # ← extends BaseRepository<Employee>
│ │ ├── Employee.service.ts # Business logic
│ │ └── index.ts # Exports both
│ ├── grade/
│ │ ├── Grade.repository.ts # Standalone (numeric ID handling)
│ │ ├── Grade.service.ts # Business logic
│ │ └── index.ts # Exports both
│ └── index.ts # Exports all core services
│
├── operations/ # Operations domain
│ ├── process/
│ │ ├── Process.repository.ts # ← extends BaseRepository<Process>
│ │ ├── Process.service.ts # Business logic
│ │ └── index.ts # Exports both
│ ├── taskAssignment/
│ │ ├── TaskAssignment.repository.ts # ← extends BaseRepository<TaskAssignment>
│ │ ├── TaskAssignment.service.ts # Business logic (FSM-ready)
│ │ └── index.ts # Exports both
│ └── index.ts # Exports all operations services
│
├── analytics/ # Analytics domain
│ ├── loadSnapshot/ # ✨ REFACTORED: Now separate files
│ │ ├── LoadSnapshot.repository.ts # ← extends BaseRepository<LoadSnapshot>
│ │ ├── LoadSnapshot.service.ts # Business logic
│ │ └── index.ts # Exports both
│ ├── gapAnalysis/ # ✨ REFACTORED: Now separate files
│ │ ├── GapAnalysis.repository.ts # ← extends BaseRepository<GapAnalysisResult>
│ │ ├── GapAnalysis.service.ts # Business logic
│ │ └── index.ts # Exports both
│ └── index.ts # Exports all analytics services
│
├── audit/ # Audit domain
│ ├── employeeHistory/ # ✨ REFACTORED: Now separate files
│ │ ├── EmployeeHistory.repository.ts # ← extends BaseRepository<EmployeeHistory>
│ │ ├── EmployeeHistory.service.ts # Business logic
│ │ └── index.ts # Exports both
│ ├── auditLog/ # ✨ REFACTORED: Now separate files
│ │ ├── AuditLog.repository.ts # ← extends BaseRepository<AuditLog>
│ │ ├── AuditLog.service.ts # Business logic
│ │ └── index.ts # Exports both
│ └── index.ts # Exports all audit services
│
├── objects/ # Objects domain (stub)
├── supporting/ # Supporting domain (stub)
├── user/ # User domain
│ ├── types.ts
│ ├── userRepository.ts
│ └── userService.ts
│
├── ServiceFactory.ts # DI container for all 8 services
├── index.ts # Root exports
├── SERVICES_IMPLEMENTATION_GUIDE.md
└── **tests**/
└── services.test.ts # (needs update to new import paths)

// ============================================================================
// FILE COUNT SUMMARY
// ============================================================================

Repository Files:

- BaseRepository.ts (new) 1
- FiniteStateMachine.ts (new) 1
- Individual repositories 10
  ├── Company.repository.ts
  ├── Employee.repository.ts
  ├── Grade.repository.ts
  ├── Process.repository.ts
  ├── TaskAssignment.repository.ts
  ├── LoadSnapshot.repository.ts
  ├── GapAnalysis.repository.ts
  ├── EmployeeHistory.repository.ts
  └── AuditLog.repository.ts

Service Files:

- BaseService.ts 1
- Individual services 10
  ├── Company.service.ts
  ├── Employee.service.ts
  ├── Grade.service.ts
  ├── Process.service.ts
  ├── TaskAssignment.service.ts
  ├── LoadSnapshot.service.ts
  ├── GapAnalysis.service.ts
  ├── EmployeeHistory.service.ts
  ├── AuditLog.service.ts

Index Files:

- base/index.ts 1
- core/index.ts 1
- operations/index.ts 1
- analytics/index.ts 1
- audit/index.ts 1
- core/company/index.ts 1
- core/employee/index.ts 1
- core/grade/index.ts 1
- operations/process/index.ts 1
- operations/taskAssignment/index.ts 1
- analytics/loadSnapshot/index.ts 1
- analytics/gapAnalysis/index.ts 1
- audit/employeeHistory/index.ts 1
- audit/auditLog/index.ts 1

Configuration:

- ServiceFactory.ts 1
- .../SERVICES_IMPLEMENTATION_GUIDE.md 1

TOTAL: 48+ files (organized, maintained, zero duplication)

// ============================================================================
// DOMAIN-SPECIFIC FILES (3 files per service)
// ============================================================================

Standard Pattern (9 services):
company/
├── Company.repository.ts (extends BaseRepository)
├── Company.service.ts (extends BaseService)
└── index.ts (exports above)

Exception - Grade (numeric ID):
grade/
├── Grade.repository.ts (standalone - handles number IDs)
├── Grade.service.ts (extends BaseService)
└── index.ts (exports above)

// ============================================================================
// KEY IMPROVEMENTS
// ============================================================================

✅ Consistency: Every service follows same pattern
✅ Clarity: One responsibility per file (repository, service, exports)
✅ Scalability: Add new service by copying folder and changing class names
✅ Maintainability: BaseRepository updates apply to all repositories
✅ Testability: Can mock repositories independently
✅ Organization: Logical folder structure by domain
✅ Clean Exports: Each level has clear, organized index.ts

// ============================================================================
// ADDING A NEW SERVICE (Example: Department)
// ============================================================================

1. Create folder:
   server/services/core/department/

2. Create three files:
   server/services/core/department/Department.repository.ts
   server/services/core/department/Department.service.ts
   server/services/core/department/index.ts

3. Repository:
   export class DepartmentRepository extends BaseRepository<Department> {
   protected readonly modelName = 'department' as const;

   // Add domain-specific methods
   async findByCompany(companyId: string) { ... }
   }

4. Service:
   export class DepartmentService extends BaseService {
   private repository: DepartmentRepository;

   // Inherit all CRUD from BaseService
   // Override or add domain logic
   }

5. Export:
   export { DepartmentRepository } from "./Department.repository";
   export { DepartmentService } from "./Department.service";

6. Update parent index.ts:
   export { DepartmentService, DepartmentRepository } from "./department";

7. Update ServiceFactory.ts:
   getDepartmentService() {
   if (!this.\_department) {
   this.\_department = new DepartmentService(this.context);
   }
   return this.\_department;
   }

Done! All CRUD operations are inherited from BaseRepository.

// ============================================================================
// DELETED FILES (Clean Cleanup)
// ============================================================================

✓ server/services/analytics/LoadSnapshotService.ts
✓ server/services/core/EmployeeService.ts
✓ server/services/core/GradeService.ts
✓ server/services/operations/TaskAssignmentService.ts

These were monolithic service files combined repo + service.
Now replaced with cleaner separate files extending BaseRepository.

// ============================================================================
