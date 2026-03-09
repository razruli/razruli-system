import type { ServiceContext } from "@/server/types/context";

import { ActorService } from "./actor/Actor.service";
import { GapAnalysisService } from "./analytics/gapAnalysis";
import { LoadSnapshotService } from "./analytics/loadSnapshot";
import { AuditLogService } from "./audit/auditLog";
import { EmployeeHistoryService } from "./audit/employeeHistory";
import { CompanyService } from "./core/company";
import { DepartmentService } from "./core/department";
import { EmployeeService } from "./core/employee";
import { GradeService } from "./core/grade";
import { ProcessService } from "./operations/process";
import { TaskAssignmentService } from "./operations/taskAssignment";
import { PermissionService } from "./user/permission.service";
import { RoleService } from "./user/role.service";
import { UserService } from "./user/user.service";

/**
 * Service Factory - DI Container for all services
 *
 * Usage in resolvers:
 * ```typescript
 * const factory = new ServiceFactory(context);
 * const userService = factory.getUserService();
 * const user = await userService.getById(id);
 * ```
 *
 * Benefits:
 * - All services share the same context (dataloaders, cache, auth)
 * - Easy to add new services
 * - Testable: can mock context
 * - Type-safe: each service has known interface
 */
export class ServiceFactory {
  // Lazy-loaded service instances (memoized)
  private _services: {
    user?: UserService;
    actor?: ActorService;
    company?: CompanyService;
    department?: DepartmentService;
    employee?: EmployeeService;
    grade?: GradeService;
    process?: ProcessService;
    taskAssignment?: TaskAssignmentService;
    loadSnapshot?: LoadSnapshotService;
    gapAnalysis?: GapAnalysisService;
    employeeHistory?: EmployeeHistoryService;
    auditLog?: AuditLogService;
    role?: RoleService;
    permission?: PermissionService;
  } = {};
  /**
   * Role services
   * Location: services/user/role.service.ts
   */
  getRoleService(): RoleService {
    if (!this._services.role) {
      this._services.role = new RoleService(this.context);
    }
    return this._services.role;
  }

  /**
   * Permission services
   * Location: services/user/permission.service.ts
   */
  getPermissionService(): PermissionService {
    if (!this._services.permission) {
      this._services.permission = new PermissionService(this.context);
    }
    return this._services.permission;
  }

  constructor(private context: ServiceContext) {
    if (!context) {
      throw new Error("ServiceFactory requires a ServiceContext");
    }
  }

  /**
   * User services
   * Location: services/user/user.service.ts
   *
   * Handles:
   * - User CRUD operations
   * - Authentication/authorization logic (if needed)
   * - Integration with better-auth (if used)
   * - User-specific caching strategies
   */
  getUserService(): UserService {
    if (!this._services.user) {
      this._services.user = new UserService(this.context);
    }
    return this._services.user;
  }

  /**
   * Actor services (Business User Identity)
   * Location: services/user/Actor.service.ts
   *
   * Handles:
   * - Actor CRUD operations (business user representation)
   * - Role and permission management
   * - Authorization checks
   * - Actor-company relationships
   */
  getActorService(): ActorService {
    if (!this._services.actor) {
      this._services.actor = new ActorService(this.context);
    }
    return this._services.actor;
  }

  // ==================== CORE DOMAIN ====================

  /**
   * Company services
   * Location: services/core/CompanyService.ts
   */
  getCompanyService(): CompanyService {
    if (!this._services.company) {
      this._services.company = new CompanyService(this.context);
    }
    return this._services.company;
  }

  /**
   * Department services
   * Location: services/core/department/Department.service.ts
   *
   * Handles:
   * - Department CRUD operations
   * - Reporting structure management (parent/child departments)
   * - Employee assignment to departments
   * - Department-wide load aggregation
   */
  getDepartmentService(): DepartmentService {
    if (!this._services.department) {
      this._services.department = new DepartmentService(this.context);
    }
    return this._services.department;
  }

  /**
   * Employee services
   * Location: services/core/EmployeeService.ts
   *
   * Handles:
   * - Employee CRUD with load calculations
   * - DataLoader usage for efficient loading
   * - Cache management for employee lists
   * - Capacity calculations and overload detection
   */
  getEmployeeService(): EmployeeService {
    if (!this._services.employee) {
      this._services.employee = new EmployeeService(this.context);
    }
    return this._services.employee;
  }

  /**
   * Grade services
   * Location: services/core/GradeService.ts
   *
   * Reference data for job levels (junior, senior, lead, etc)
   */
  getGradeService(): GradeService {
    if (!this._services.grade) {
      this._services.grade = new GradeService(this.context);
    }
    return this._services.grade;
  }

  // ==================== OPERATIONS DOMAIN ====================

  /**
   * Process services
   * Location: services/operations/ProcessService.ts
   *
   * Handles:
   * - Business process CRUD
   * - Load calculations for assignments
   * - Cross-domain coordination with EmployeeService
   * - Capacity-aware task assignment
   */
  getProcessService(): ProcessService {
    if (!this._services.process) {
      this._services.process = new ProcessService(this.context);
    }
    return this._services.process;
  }

  /**
   * Task Assignment services
   * Location: services/operations/TaskAssignmentService.ts
   *
   * Handles:
   * - Task lifecycle (pending → in_progress → completed/cancelled)
   * - State transitions with validation
   * - History tracking for audit trail
   * - Smart cache invalidation per status change
   */
  getTaskAssignmentService(): TaskAssignmentService {
    if (!this._services.taskAssignment) {
      this._services.taskAssignment = new TaskAssignmentService(this.context);
    }
    return this._services.taskAssignment;
  }

  // ==================== ANALYTICS DOMAIN ====================

  /**
   * Load Snapshot services
   * Location: services/analytics/LoadSnapshotService.ts
   *
   * Handles:
   * - Time-series snapshots of employee load/capacity
   * - Batch snapshot creation (for cron jobs)
   * - Trend analysis (is load increasing/decreasing?)
   * - Department-wide load aggregation
   */
  getLoadSnapshotService(): LoadSnapshotService {
    if (!this._services.loadSnapshot) {
      this._services.loadSnapshot = new LoadSnapshotService(this.context);
    }
    return this._services.loadSnapshot;
  }

  /**
   * Gap Analysis services
   * Location: services/analytics/GapAnalysisService.ts
   *
   * Handles:
   * - Analysis of skill gaps vs required skills
   * - Hiring recommendations
   * - Training recommendations
   * - Skills coverage reporting
   */
  getGapAnalysisService(): GapAnalysisService {
    if (!this._services.gapAnalysis) {
      this._services.gapAnalysis = new GapAnalysisService(this.context);
    }
    return this._services.gapAnalysis;
  }

  // ==================== AUDIT DOMAIN ====================

  /**
   * Employee History services
   * Location: services/audit/EmployeeHistoryService.ts
   *
   * IMMUTABLE LOG: tracks all employee career events
   * - Hires (initial placement)
   * - Promotions/demotions (grade changes)
   * - Transfers (department changes)
   * - Dismissals
   * - Efficiency rating changes
   *
   * Never updates/deletes entries; only appends new records
   */
  getEmployeeHistoryService(): EmployeeHistoryService {
    if (!this._services.employeeHistory) {
      this._services.employeeHistory = new EmployeeHistoryService(this.context);
    }
    return this._services.employeeHistory;
  }

  /**
   * Audit Log services
   * Location: services/audit/AuditLogService.ts
   *
   * Tracks all mutations in the system:
   * - Who made the change (userId)
   * - What changed (before/after values)
   * - When it changed (timestamp)
   * - Why it changed (operation type, notes)
   *
   * Different from EmployeeHistory: AuditLog tracks anyone doing anything,
   * EmployeeHistory only tracks employee career milestones
   */
  getAuditLogService(): AuditLogService {
    if (!this._services.auditLog) {
      this._services.auditLog = new AuditLogService(this.context);
    }
    return this._services.auditLog;
  }

  // ==================== CONVENIENCE METHODS ====================

  /**
   * Get all services as an object (for destructuring)
   * Usage: const { company, department, employee, process } = factory.getServices();
   */
  getServices() {
    return {
      // Auth & User
      user: this.getUserService(),
      actor: this.getActorService(),

      // User domain
      role: this.getRoleService(),
      permission: this.getPermissionService(),

      // Core
      company: this.getCompanyService(),
      department: this.getDepartmentService(),
      employee: this.getEmployeeService(),
      grade: this.getGradeService(),

      // Operations
      process: this.getProcessService(),
      taskAssignment: this.getTaskAssignmentService(),
      // Analytics
      loadSnapshot: this.getLoadSnapshotService(),
      gapAnalysis: this.getGapAnalysisService(),
      // Audit
      employeeHistory: this.getEmployeeHistoryService(),
      auditLog: this.getAuditLogService(),
    };
  }

  /**
   * Clear all service instances
   * Call at end of request to free memory
   */
  clear(): void {
    this._services = {};
  }
} /**
 * Get the context (for advanced usage)
 */
