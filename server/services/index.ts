// ============================================================================
// Services Exports
// ============================================================================

// Base
export { ServiceFactory } from "./ServiceFactory";
export { BaseService } from "./base/BaseService";
export type { IService, UpdateInput } from "./base/types";
export {
  ServiceError,
  ValidationError,
  NotFoundError,
  AuthorizationError,
} from "./base/types";

// Auth & User
export { UserService } from "./user/user.service";

// Core Domain
export { CompanyService } from "./core/company/Company.service";
export { DepartmentService } from "./core/department/Department.service";
export { EmployeeService } from "./core/employee/Employee.service";
export { GradeService } from "./core/grade/Grade.service";

// Operations Domain
export { ProcessService } from "./operations/process/Process.service";
export { TaskAssignmentService } from "./operations/taskAssignment/TaskAssignment.service";

// Analytics Domain
export { LoadSnapshotService } from "./analytics/loadSnapshot/LoadSnapshot.service";
export { GapAnalysisService } from "./analytics/gapAnalysis/GapAnalysis.service";

// Audit Domain
export { EmployeeHistoryService } from "./audit/employeeHistory/EmployeeHistory.service";
export { AuditLogService } from "./audit/auditLog/AuditLog.service";
