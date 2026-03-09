/**
 * ============================================================================
 * GraphQL Context Types - Strongly Typed
 * ============================================================================
 * Complete DataLoader and Services Registry for all domain entities
 * ============================================================================
 */

import DataLoader from "dataloader";

import type {
  PrismaClient,
  User as PrismaUser,
  Actor as PrismaActor,
  Company as PrismaCompany,
  Department as PrismaDepartment,
  Employee as PrismaEmployee,
  Grade as PrismaGrade,
  Process as PrismaProcess,
  TaskAssignment as PrismaTaskAssignment,
  LoadSnapshot as PrismaLoadSnapshot,
  GapAnalysisResult as PrismaGapAnalysisResult,
  EmployeeHistory as PrismaEmployeeHistory,
  AuditLog as PrismaAuditLog,
} from "@/server/db/generated/prisma/client";
import { ActorService } from "@/server/services/actor/Actor.service";
import type { GapAnalysisService } from "@/server/services/analytics/gapAnalysis/GapAnalysis.service";
import type { LoadSnapshotService } from "@/server/services/analytics/loadSnapshot/LoadSnapshot.service";
import type { AuditLogService } from "@/server/services/audit/auditLog/AuditLog.service";
import type { EmployeeHistoryService } from "@/server/services/audit/employeeHistory/EmployeeHistory.service";
import type { CompanyService } from "@/server/services/core/company/Company.service";
import type { DepartmentService } from "@/server/services/core/department/Department.service";
import type { EmployeeService } from "@/server/services/core/employee/Employee.service";
import type { GradeService } from "@/server/services/core/grade/Grade.service";
import type { ProcessService } from "@/server/services/operations/process/Process.service";
import type { TaskAssignmentService } from "@/server/services/operations/taskAssignment/TaskAssignment.service";
import { PermissionService, RoleService } from "@/server/services/user";
import type { UserService } from "@/server/services/user/user.service";

// ============================================================================
// DATA LOADERS - Batch loading to prevent N+1 queries
// ============================================================================
// Each loader batches similar queries together within a single request
// Fresh instance created per GraphQL request

export interface DataLoaderRegistry {
  // Auth & User
  user: DataLoader<string, PrismaUser | null>;
  actor: DataLoader<string, PrismaActor | null>;

  // Core domain
  company: DataLoader<string, PrismaCompany | null>;
  department: DataLoader<string, PrismaDepartment | null>;
  employee: DataLoader<string, PrismaEmployee | null>;
  grade: DataLoader<number, PrismaGrade | null>;

  // Operations domain
  process: DataLoader<string, PrismaProcess | null>;
  taskAssignment: DataLoader<string, PrismaTaskAssignment | null>;

  // Analytics domain
  loadSnapshot: DataLoader<string, PrismaLoadSnapshot | null>;
  gapAnalysis: DataLoader<string, PrismaGapAnalysisResult | null>;

  // Audit domain
  employeeHistory: DataLoader<string, PrismaEmployeeHistory | null>;
  auditLog: DataLoader<string, PrismaAuditLog | null>;

  // Batch loaders for common patterns
  employeesByDepartment: DataLoader<string, PrismaEmployee[]>;
  actorsByCompany: DataLoader<string, PrismaActor[]>;
  actorsByDepartment: DataLoader<string, PrismaActor[]>;
  tasksByEmployee: DataLoader<string, PrismaTaskAssignment[]>;
  snapshotsByEmployee: DataLoader<string, PrismaLoadSnapshot[]>;
}

// ============================================================================
// SERVICES - Business logic layer
// ============================================================================
// Each service handles one domain and uses dataloaders
// Fresh instance created per GraphQL request, receives fresh loaders

export interface ServicesRegistry {
  // Auth & User
  user: UserService;
  actor: ActorService;

  // Core domain
  company: CompanyService;
  department: DepartmentService;
  employee: EmployeeService;
  grade: GradeService;

  // User domain
  role: RoleService;
  permission: PermissionService;

  // Operations domain
  process: ProcessService;
  taskAssignment: TaskAssignmentService;

  // Analytics domain
  loadSnapshot: LoadSnapshotService;
  gapAnalysis: GapAnalysisService;

  // Audit domain
  employeeHistory: EmployeeHistoryService;
  auditLog: AuditLogService;
}

/**
 * GraphQL Request Context
 * Created fresh for each GraphQL request
 *
 * Guarantees:
 * ✓ Fresh dataloaders (no cross-request batching)
 * ✓ Fresh services (no cache pollution)
 * ✓ Isolated user auth
 * ✓ Request tracing
 * ✓ Complete access to all domain services
 */
export interface GraphQLContext {
  // Database client (singleton, shared across requests)
  prisma: PrismaClient;

  // Authenticated user (this request only)
  user: PrismaUser | null;

  // Authenticated actor (this request only)
  actor?: PrismaActor | null;

  // DataLoaders (FRESH per request)
  loaders: DataLoaderRegistry;

  // Services (FRESH per request)
  services: ServicesRegistry;

  // Request metadata
  requestId: string;
  requestStartTime: number;
  userAgent?: string;
}
