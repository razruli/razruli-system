import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserModel, SessionModel, AccountModel, VerificationModel, ActorModel, RoleModel, PermissionModel, ActorRoleModel, RolePermissionModel, ActorPermissionModel, CompanyModel, DepartmentModel, EmployeeModel, GradeModel, ProcessModel, TaskAssignmentModel, LoadSnapshotModel, GapAnalysisResultModel, HiringRequestModel, EmployeeHistoryModel, AuditLogModel } from '@/server/db/generated/prisma/models';
import { GraphQLContext } from '../context/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: bigint; output: bigint; }
  DateTime: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
  Upload: { input: any; output: any; }
};

/** Access risk level */
export enum AccessRiskLevel {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/** Action type summary */
export type ActionTypeSummary = {
  __typename?: 'ActionTypeSummary';
  actionType: AuditActionType;
  count: Scalars['Int']['output'];
  failureCount: Scalars['Int']['output'];
  successCount: Scalars['Int']['output'];
};

/**
 * Actor type - Represents a business user with roles and permissions
 * Wraps the User (authentication) with business context
 */
export type Actor = Node & {
  __typename?: 'Actor';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  company: Company;
  /** Business context */
  companyId: Scalars['String']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  department?: Maybe<Department>;
  departmentId?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastActivityAt?: Maybe<Scalars['DateTime']['output']>;
  /** Activity tracking */
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  /** Business identity */
  name: Scalars['String']['output'];
  permissions: Array<ActorPermission>;
  phone?: Maybe<Scalars['String']['output']>;
  /** Authorization */
  roles: Array<ActorRole>;
  /** Status */
  status: ActorStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  /** Authentication link */
  userId: Scalars['String']['output'];
};

/** Actor response wrapper */
export type ActorConnection = {
  __typename?: 'ActorConnection';
  nodes: Array<Actor>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Filter input for actors */
export type ActorFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ActorStatus>;
};

/** Actor pagination input */
export type ActorPaginationInput = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Actor permission assignment */
export type ActorPermission = Node & {
  __typename?: 'ActorPermission';
  actor: Actor;
  actorId: Scalars['String']['output'];
  assignedAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  grant: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  permission: Permission;
  permissionId: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
};

/** Actor role assignment */
export type ActorRole = Node & {
  __typename?: 'ActorRole';
  actor: Actor;
  actorId: Scalars['String']['output'];
  assignedAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  role: Role;
  roleId: Scalars['String']['output'];
};

/** Actor status enumeration */
export enum ActorStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Inactive = 'INACTIVE',
  PendingActivation = 'PENDING_ACTIVATION',
  Suspended = 'SUSPENDED'
}

/** Audit action type */
export enum AuditActionType {
  Approval = 'APPROVAL',
  BulkOperation = 'BULK_OPERATION',
  ConfigurationChange = 'CONFIGURATION_CHANGE',
  Create = 'CREATE',
  Delete = 'DELETE',
  Export = 'EXPORT',
  Import = 'IMPORT',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Other = 'OTHER',
  PermissionChange = 'PERMISSION_CHANGE',
  Publish = 'PUBLISH',
  Read = 'READ',
  Rejection = 'REJECTION',
  Unpublish = 'UNPUBLISH',
  Update = 'UPDATE'
}

/** AuditLog type tracking system activities for compliance and debugging */
export type AuditLog = {
  __typename?: 'AuditLog';
  actionType: AuditActionType;
  /** Context */
  companyId: Scalars['String']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  departmentId?: Maybe<Scalars['String']['output']>;
  /** Action details */
  description: Scalars['String']['output'];
  /** Performance metrics */
  durationMs?: Maybe<Scalars['Int']['output']>;
  entityId: Scalars['String']['output'];
  /** Log metadata */
  entityType: Scalars['String']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  newValues?: Maybe<Scalars['JSON']['output']>;
  oldValues?: Maybe<Scalars['JSON']['output']>;
  result: AuditResult;
  status: AuditStatus;
  timestamp: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
  userEmail: Scalars['String']['output'];
  /** Actor information */
  userId: Scalars['String']['output'];
};

/** Audit log response wrapper */
export type AuditLogConnection = {
  __typename?: 'AuditLogConnection';
  nodes: Array<AuditLog>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Audit log filter input */
export type AuditLogFilterInput = {
  actionType?: InputMaybe<AuditActionType>;
  companyId: Scalars['String']['input'];
  dateRange?: InputMaybe<DateRangeInput>;
  entityId?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<AuditResult>;
  status?: InputMaybe<AuditStatus>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** Pagination input for audit logs */
export type AuditLogPaginationInput = {
  orderBy?: InputMaybe<AuditLogSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Audit log sort fields */
export enum AuditLogSortField {
  ActionType = 'ACTION_TYPE',
  CreatedAt = 'CREATED_AT',
  EntityType = 'ENTITY_TYPE',
  Timestamp = 'TIMESTAMP'
}

/** Audit log sort input */
export type AuditLogSortInput = {
  field: AuditLogSortField;
  order: SortOrder;
};

/** Audit result */
export enum AuditResult {
  Conflict = 'CONFLICT',
  Failed = 'FAILED',
  Forbidden = 'FORBIDDEN',
  Success = 'SUCCESS',
  Timeout = 'TIMEOUT',
  Unauthorized = 'UNAUTHORIZED',
  UnknownError = 'UNKNOWN_ERROR',
  ValidationError = 'VALIDATION_ERROR'
}

/** Audit status */
export enum AuditStatus {
  Failure = 'FAILURE',
  PartialSuccess = 'PARTIAL_SUCCESS',
  PendingApproval = 'PENDING_APPROVAL',
  Success = 'SUCCESS'
}

/** Changes by specific user */
export type ChangeByUser = {
  __typename?: 'ChangeByUser';
  changeCount: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
  user: User;
};

/** Change type summary */
export type ChangeTypeSummary = {
  __typename?: 'ChangeTypeSummary';
  changeType: EmployeeChangeType;
  count: Scalars['Int']['output'];
  lastChanged?: Maybe<Scalars['DateTime']['output']>;
};

/** Company type - Root entity for multi-tenant support */
export type Company = {
  __typename?: 'Company';
  /** Created at */
  createdAt: Scalars['DateTime']['output'];
  /** All departments */
  departments?: Maybe<Array<Maybe<Department>>>;
  /** All employees */
  employees?: Maybe<Array<Maybe<Employee>>>;
  /** Unique identifier */
  id: Scalars['String']['output'];
  /** All load snapshots */
  loadSnapshots?: Maybe<Array<Maybe<LoadSnapshot>>>;
  /** Company name */
  name: Scalars['String']['output'];
  /** All processes */
  processes?: Maybe<Array<Maybe<Process>>>;
  /** All task assignments */
  taskAssignments?: Maybe<Array<Maybe<TaskAssignment>>>;
  /** Timezone (default UTC+3) */
  timezone: Scalars['String']['output'];
  /** Updated at */
  updatedAt: Scalars['DateTime']['output'];
  /** Working days per month (default 21) */
  workingDaysPerMonth: Scalars['Int']['output'];
  /** Working hours per day (default 8) */
  workingHoursDay: Scalars['Int']['output'];
};

/** Company load analysis */
export type CompanyLoadAnalysis = {
  __typename?: 'CompanyLoadAnalysis';
  company: Company;
  departmentMetrics: Array<DepartmentLoadOverview>;
  metrics: LoadAnalysisMetrics;
  recommendations: Array<LoadRecommendation>;
  snapshotDate: Scalars['DateTime']['output'];
  totalEmployees: Scalars['Int']['output'];
};

/** Compliance report */
export type ComplianceReport = {
  __typename?: 'ComplianceReport';
  company: Company;
  complianceRate: Scalars['Float']['output'];
  dataExportCount: Scalars['Int']['output'];
  generatedAt: Scalars['DateTime']['output'];
  /** Risk assessment */
  highRiskActivities: Array<AuditLog>;
  reportPeriod: DateRange;
  /** Data protection metrics */
  sensitiveDataAccess: Scalars['Int']['output'];
  suspiciousPatterns: Array<Scalars['String']['output']>;
  /** Compliance metrics */
  totalAuditedActions: Scalars['Int']['output'];
  unauthorizedAccessAttempts: Scalars['Int']['output'];
  /** User access review */
  userAccessSummary: Array<UserAccessSummary>;
};

/** Input for creating an actor */
export type CreateActorInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['String']['input'];
  departmentId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

/** Input for creating a company */
export type CreateCompanyInput = {
  name: Scalars['String']['input'];
  timezone?: InputMaybe<Scalars['String']['input']>;
  workingDaysPerMonth?: InputMaybe<Scalars['Int']['input']>;
  workingHoursDay?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for creating a department */
export type CreateDepartmentInput = {
  companyId: Scalars['String']['input'];
  headId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Required fields for creating an employee */
export type CreateEmployeeInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  companyId: Scalars['String']['input'];
  departmentId: Scalars['String']['input'];
  employmentType?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  gradeId: Scalars['Int']['input'];
  hireDate: Scalars['DateTime']['input'];
  kEfficiency?: InputMaybe<Scalars['Float']['input']>;
  lastName: Scalars['String']['input'];
  workingHoursPerDay?: InputMaybe<Scalars['Int']['input']>;
};

/** Create gap analysis input */
export type CreateGapAnalysisInput = {
  companyId: Scalars['String']['input'];
  departmentId?: InputMaybe<Scalars['String']['input']>;
  forecastPeriodMonths: Scalars['Int']['input'];
  forecastedWorkloadUnits: Scalars['Int']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Grade input for creation */
export type CreateGradeInput = {
  /** Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Grade level/seniority */
  level?: InputMaybe<Scalars['Int']['input']>;
  /** Maximum salary for this grade */
  maxSalary?: InputMaybe<Scalars['Float']['input']>;
  /** Minimum salary for this grade */
  minSalary?: InputMaybe<Scalars['Float']['input']>;
  /** Human readable name */
  name: Scalars['String']['input'];
};

/** Input for creating a permission */
export type CreatePermissionInput = {
  action: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  resource: Scalars['String']['input'];
  scope: PermissionScope;
  slug: Scalars['String']['input'];
};

/** Input for creating a process */
export type CreateProcessInput = {
  capacityUnits: Scalars['Int']['input'];
  companyId: Scalars['String']['input'];
  departmentId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedDurationDays?: InputMaybe<Scalars['Int']['input']>;
  kMultiplier: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  priority?: InputMaybe<ProcessPriority>;
  processType: ProcessType;
  status?: InputMaybe<ProcessStatus>;
};

/** Input for creating a role */
export type CreateRoleInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  scope: RoleScope;
  slug: Scalars['String']['input'];
};

/** Input for creating a task assignment */
export type CreateTaskAssignmentInput = {
  allocatedCapacityUnits: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate: Scalars['DateTime']['input'];
  effortHours: Scalars['Float']['input'];
  employeeId: Scalars['String']['input'];
  estimatedDaysToComplete?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<TaskPriority>;
  processId: Scalars['String']['input'];
  taskType: TaskType;
};

/** Direction of threshold crossing */
export enum CrossDirection {
  Above = 'ABOVE',
  Below = 'BELOW'
}

export type DateRange = {
  __typename?: 'DateRange';
  from: Scalars['DateTime']['output'];
  to: Scalars['DateTime']['output'];
};

/** Date range input */
export type DateRangeInput = {
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};

/**
 * Department type and resolvers
 * Organizational unit with optional head reference
 */
export type Department = {
  __typename?: 'Department';
  company: Company;
  /** Company this department belongs to */
  companyId: Scalars['String']['output'];
  /** Created at */
  createdAt: Scalars['DateTime']['output'];
  /** All employees in this department */
  employees: Array<Employee>;
  head?: Maybe<Employee>;
  /** Department head (optional) */
  headId?: Maybe<Scalars['String']['output']>;
  /** Unique identifier */
  id: Scalars['String']['output'];
  /** Load snapshots for this department */
  loadSnapshots: Array<LoadSnapshot>;
  /** Department name */
  name: Scalars['String']['output'];
  /** All processes assigned to department */
  processes: Array<Process>;
  /** All tasks in department */
  taskAssignments: Array<TaskAssignment>;
  /** Updated at */
  updatedAt: Scalars['DateTime']['output'];
};

/** Department connection with pagination */
export type DepartmentConnection = {
  __typename?: 'DepartmentConnection';
  nodes: Array<Department>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Department history summary */
export type DepartmentEmployeeHistory = {
  __typename?: 'DepartmentEmployeeHistory';
  /** Capacity trends */
  capacityAdded: Scalars['Int']['output'];
  capacityLost: Scalars['Int']['output'];
  demotions: Scalars['Int']['output'];
  department: Department;
  departures: Scalars['Int']['output'];
  netCapacityChange: Scalars['Int']['output'];
  /** Staff movements */
  newHires: Scalars['Int']['output'];
  promotions: Scalars['Int']['output'];
  reportPeriod: DateRange;
  /** Timeline of changes */
  timeline: Array<EmployeeTimelineEntry>;
  transfers: Scalars['Int']['output'];
};

/** Filter options for departments */
export type DepartmentFilterInput = {
  companyId: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Department gap comparison */
export type DepartmentGapComparison = {
  __typename?: 'DepartmentGapComparison';
  capacityGap: Scalars['Int']['output'];
  comparedToCompanyAverage: Scalars['Float']['output'];
  department: Department;
  gapAnalysis?: Maybe<GapAnalysis>;
  gapStatus: GapStatus;
  headcountGap: Scalars['Int']['output'];
  riskLevel: GapAnalysisRiskLevel;
};

/** Department load overview */
export type DepartmentLoadOverview = {
  __typename?: 'DepartmentLoadOverview';
  averageLoadIndex: Scalars['Float']['output'];
  averageUtilizationRate: Scalars['Float']['output'];
  department: Department;
  employeeBreakdown: Array<EmployeeLoadBreakdown>;
  overloadedEmployees: Scalars['Int']['output'];
  riskLevel: LoadRiskLevel;
  totalEmployees: Scalars['Int']['output'];
};

/** Extended department with metrics */
export type DepartmentMetrics = {
  __typename?: 'DepartmentMetrics';
  activeEmployees: Scalars['Int']['output'];
  department: Department;
  loadIndex: Scalars['Float']['output'];
  overloadedCount: Scalars['Int']['output'];
  totalCapacity: Scalars['Float']['output'];
  totalEmployees: Scalars['Int']['output'];
  totalLoad: Scalars['Float']['output'];
};

/**
 * Employee type and resolvers
 * Represents a team member with capacity coefficients and employment details
 */
export type Employee = {
  __typename?: 'Employee';
  /** Date of birth */
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  /** Company this employee belongs to */
  companyId: Scalars['String']['output'];
  /** Created at */
  createdAt: Scalars['DateTime']['output'];
  department: Department;
  /** Department assignment */
  departmentId: Scalars['String']['output'];
  /** Employment type (LABOR_CONTRACT/SERVICE_CONTRACT/SELF_EMPLOYED) */
  employmentType: Scalars['String']['output'];
  /** Full name (firstName lastName) - computed */
  fio: Scalars['String']['output'];
  /** Dismissal date (null if active) */
  fireDate?: Maybe<Scalars['DateTime']['output']>;
  /** First name */
  firstName: Scalars['String']['output'];
  /** Gender (MALE/FEMALE/OTHER) */
  gender: Scalars['String']['output'];
  grade: Grade;
  /** Seniority level/Grade */
  gradeId: Scalars['Int']['output'];
  /** Hire date */
  hireDate: Scalars['DateTime']['output'];
  /** Change history */
  history?: Maybe<Array<Maybe<EmployeeHistory>>>;
  /** Unique identifier */
  id: Scalars['String']['output'];
  /** Efficiency coefficient (multiplier, default 1.0) */
  kEfficiency: Scalars['Float']['output'];
  /** Last name */
  lastName: Scalars['String']['output'];
  /** Load snapshots */
  loadSnapshots?: Maybe<Array<Maybe<LoadSnapshot>>>;
  /** Metadata (JSON) */
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Current status (ACTIVE/INACTIVE/ON_LEAVE/TERMINATED) */
  status: Scalars['String']['output'];
  /** Task assignments */
  taskAssignments?: Maybe<Array<Maybe<TaskAssignment>>>;
  /** Updated at */
  updatedAt: Scalars['DateTime']['output'];
  /** Working hours per day */
  workingHoursPerDay: Scalars['Int']['output'];
};

/** Employee audit report */
export type EmployeeAuditReport = {
  __typename?: 'EmployeeAuditReport';
  /** Notable changes */
  capacityChanges: Array<EmployeeHistory>;
  changesByType: Array<ChangeTypeSummary>;
  efficiencyChanges: Array<EmployeeHistory>;
  employee: Employee;
  generatedAt: Scalars['DateTime']['output'];
  reportPeriod: DateRange;
  statusChanges: Array<EmployeeHistory>;
  /** Timeline */
  timeline: Array<EmployeeTimelineEntry>;
  /** Summary statistics */
  totalChanges: Scalars['Int']['output'];
};

/** Employee change type */
export enum EmployeeChangeType {
  ContractRenewal = 'CONTRACT_RENEWAL',
  Demotion = 'DEMOTION',
  DepartmentTransfer = 'DEPARTMENT_TRANSFER',
  EfficiencyUpdate = 'EFFICIENCY_UPDATE',
  GradeChange = 'GRADE_CHANGE',
  Hire = 'HIRE',
  LeaveEnd = 'LEAVE_END',
  LeaveStart = 'LEAVE_START',
  Other = 'OTHER',
  Promotion = 'PROMOTION',
  SalaryAdjustment = 'SALARY_ADJUSTMENT',
  StatusChange = 'STATUS_CHANGE',
  Termination = 'TERMINATION'
}

/** Response with employee list and pagination */
export type EmployeeConnection = {
  __typename?: 'EmployeeConnection';
  nodes: Array<Employee>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Filter options for employee queries */
export type EmployeeFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  gradeId?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** EmployeeHistory type tracking changes to employee data and status */
export type EmployeeHistory = {
  __typename?: 'EmployeeHistory';
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  approvedBy?: Maybe<Scalars['String']['output']>;
  /** Capacity impact */
  capacityImpact?: Maybe<Scalars['Int']['output']>;
  /** Change details */
  changeType: EmployeeChangeType;
  /** Timestamps */
  changedAt: Scalars['DateTime']['output'];
  /** Audit information */
  changedBy: Scalars['String']['output'];
  changedField: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  effectiveDate: Scalars['DateTime']['output'];
  employee: Employee;
  /** Employee reference */
  employeeId: Scalars['String']['output'];
  /** Status transitions */
  fromStatus?: Maybe<EmploymentStatus>;
  id: Scalars['String']['output'];
  loadImpact?: Maybe<Scalars['Float']['output']>;
  newValue?: Maybe<Scalars['JSON']['output']>;
  previousValue?: Maybe<Scalars['JSON']['output']>;
  /** Context */
  reason?: Maybe<Scalars['String']['output']>;
  toStatus?: Maybe<EmploymentStatus>;
};

/** Employee history response wrapper */
export type EmployeeHistoryConnection = {
  __typename?: 'EmployeeHistoryConnection';
  nodes: Array<EmployeeHistory>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Employee history filter input */
export type EmployeeHistoryFilterInput = {
  changeType?: InputMaybe<EmployeeChangeType>;
  changedBy?: InputMaybe<Scalars['String']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
};

/** Pagination input for employee history */
export type EmployeeHistoryPaginationInput = {
  orderBy?: InputMaybe<EmployeeHistorySortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Employee history sort fields */
export enum EmployeeHistorySortField {
  ChangedAt = 'CHANGED_AT',
  ChangeType = 'CHANGE_TYPE',
  EffectiveDate = 'EFFECTIVE_DATE'
}

/** Employee history sort input */
export type EmployeeHistorySortInput = {
  field: EmployeeHistorySortField;
  order: SortOrder;
};

/** Employee load breakdown */
export type EmployeeLoadBreakdown = {
  __typename?: 'EmployeeLoadBreakdown';
  allocatedCapacity: Scalars['Int']['output'];
  employee: Employee;
  loadStatus: LoadStatus;
  utilizationRate: Scalars['Float']['output'];
};

/** Employee load history */
export type EmployeeLoadHistory = {
  __typename?: 'EmployeeLoadHistory';
  averageLoadIndex: Scalars['Float']['output'];
  averageUtilizationRate: Scalars['Float']['output'];
  employee: Employee;
  isIncreasing: Scalars['Boolean']['output'];
  snapshots: Array<LoadSnapshot>;
  trend: Array<LoadTrendPoint>;
  trendDirection: TrendDirection;
};

/** Pagination and sorting */
export type EmployeePaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
};

/** Employee status change event */
export type EmployeeStatusChangeEvent = {
  __typename?: 'EmployeeStatusChangeEvent';
  employeeName: Scalars['String']['output'];
  history: EmployeeHistory;
  timestamp: Scalars['DateTime']['output'];
};

/** Employee task statistics */
export type EmployeeTaskStats = {
  __typename?: 'EmployeeTaskStats';
  activeAssignments: Scalars['Int']['output'];
  averagePriority: Scalars['String']['output'];
  blockedAssignments: Scalars['Int']['output'];
  completedAssignments: Scalars['Int']['output'];
  employee: Employee;
  tasksByStatus: Array<TaskStatusCount>;
  tasksByType: Array<TaskTypeCount>;
  totalAllocatedCapacity: Scalars['Int']['output'];
  totalAssignments: Scalars['Int']['output'];
};

/** Employee timeline entry */
export type EmployeeTimelineEntry = {
  __typename?: 'EmployeeTimelineEntry';
  color: Scalars['String']['output'];
  event: EmployeeHistory;
  icon: Scalars['String']['output'];
  summary: Scalars['String']['output'];
};

/** Employment status */
export enum EmploymentStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  NoticePeriod = 'NOTICE_PERIOD',
  OnLeave = 'ON_LEAVE',
  Retired = 'RETIRED',
  Terminated = 'TERMINATED'
}

/** Entity change audit trail */
export type EntityAuditTrail = {
  __typename?: 'EntityAuditTrail';
  changesByUser: Array<ChangeByUser>;
  /** Snapshots at key points */
  currentState?: Maybe<Scalars['JSON']['output']>;
  entityId: Scalars['String']['output'];
  entityType: Scalars['String']['output'];
  previousState?: Maybe<Scalars['JSON']['output']>;
  /** Full change timeline */
  timeline: Array<AuditLog>;
  /** Change analysis */
  totalChanges: Scalars['Int']['output'];
};

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  extensions?: Maybe<Scalars['JSON']['output']>;
  message: Scalars['String']['output'];
};

/** Export format for audit logs */
export enum ExportFormat {
  Csv = 'CSV',
  Json = 'JSON',
  Pdf = 'PDF',
  Xlsx = 'XLSX'
}

/** GapAnalysis type representing workforce planning analysis */
export type GapAnalysis = {
  __typename?: 'GapAnalysis';
  analysisDate: Scalars['DateTime']['output'];
  /** Gap calculation */
  capacityGap: Scalars['Int']['output'];
  /** Related entities */
  company: Company;
  /** Analysis metadata */
  companyId: Scalars['String']['output'];
  confidenceLevel: Scalars['String']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  /** Current state */
  currentEmployeeCount: Scalars['Int']['output'];
  currentTotalCapacity: Scalars['Int']['output'];
  currentUtilizationRate: Scalars['Float']['output'];
  department?: Maybe<Department>;
  departmentId?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  /** Confidence metrics */
  forecastAccuracy: Scalars['Float']['output'];
  /** Analysis period */
  forecastPeriodMonths: Scalars['Int']['output'];
  /** Forecasted state */
  forecastedWorkloadUnits: Scalars['Int']['output'];
  gapStatus: GapStatus;
  headcountGap: Scalars['Int']['output'];
  /** Hiring plan */
  hiringPlan?: Maybe<HiringPlan>;
  id: Scalars['String']['output'];
  recommendations: Array<GapAnalysisRecommendation>;
  requiredEmployeeCount: Scalars['Int']['output'];
  requiredTotalCapacity: Scalars['Int']['output'];
  riskLevel: GapAnalysisRiskLevel;
  startDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Gap analysis response wrapper */
export type GapAnalysisConnection = {
  __typename?: 'GapAnalysisConnection';
  nodes: Array<GapAnalysis>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Gap analysis filter input */
export type GapAnalysisFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  gapStatus?: InputMaybe<GapStatus>;
  riskLevel?: InputMaybe<GapAnalysisRiskLevel>;
};

/** Pagination input for gap analyses */
export type GapAnalysisPaginationInput = {
  orderBy?: InputMaybe<GapAnalysisSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Gap analysis recommendation */
export type GapAnalysisRecommendation = {
  __typename?: 'GapAnalysisRecommendation';
  description: Scalars['String']['output'];
  estimatedCost?: Maybe<Scalars['Int']['output']>;
  estimatedTimeframe: Scalars['String']['output'];
  expectedOutcome: Scalars['String']['output'];
  id: Scalars['String']['output'];
  implementationSteps: Array<Scalars['String']['output']>;
  priority: RecommendationPriority;
  type: RecommendationType;
};

/** Risk level for gap analysis */
export enum GapAnalysisRiskLevel {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/** Gap analysis sort fields */
export enum GapAnalysisSortField {
  AnalysisDate = 'ANALYSIS_DATE',
  CapacityGap = 'CAPACITY_GAP',
  HeadcountGap = 'HEADCOUNT_GAP',
  RiskLevel = 'RISK_LEVEL'
}

/** Gap analysis sort input */
export type GapAnalysisSortInput = {
  field: GapAnalysisSortField;
  order: SortOrder;
};

/** Gap criticality assessment */
export type GapCriticalityAssessment = {
  __typename?: 'GapCriticalityAssessment';
  criticalDepartments: Array<DepartmentGapComparison>;
  estimatedTimeToFillGap: Scalars['String']['output'];
  recommendedImmediateActions: Array<Scalars['String']['output']>;
  timelinessOfAction: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/** Gap status enumeration */
export enum GapStatus {
  Balanced = 'BALANCED',
  CriticalGap = 'CRITICAL_GAP',
  MinorGap = 'MINOR_GAP',
  ModerateGap = 'MODERATE_GAP',
  Surplus = 'SURPLUS'
}

/** Gap threshold event */
export type GapThresholdEvent = {
  __typename?: 'GapThresholdEvent';
  analysis: GapAnalysis;
  newStatus: GapStatus;
  previousStatus: GapStatus;
  severity: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/** Historical gap trend */
export type GapTrend = {
  __typename?: 'GapTrend';
  analysisDate: Scalars['DateTime']['output'];
  capacityGap: Scalars['Int']['output'];
  gapStatus: GapStatus;
  headcountGap: Scalars['Int']['output'];
  riskLevel: GapAnalysisRiskLevel;
};

/**
 * Grade type - Seniority levels/grades
 * Reference data that doesn't change often
 */
export type Grade = {
  __typename?: 'Grade';
  /** Description */
  description?: Maybe<Scalars['String']['output']>;
  /** Employees with this grade */
  employees: Array<Employee>;
  /** Grade ID (0-5: Intern to C-level) */
  id: Scalars['Int']['output'];
  /** Grade coefficient for capacity calculation */
  kGrade: Scalars['Float']['output'];
  /** Human readable name */
  name: Scalars['String']['output'];
  /** Processes targeting this grade */
  processes: Array<Process>;
};

/** Grade with statistics */
export type GradeStats = {
  __typename?: 'GradeStats';
  averageEfficiency: Scalars['Float']['output'];
  employeeCount: Scalars['Int']['output'];
  grade: Grade;
  overloadedCount: Scalars['Int']['output'];
};

/** Hiring forecast */
export type HiringForecast = {
  __typename?: 'HiringForecast';
  averageMonthlyHiringRate: Scalars['Int']['output'];
  gapAnalysis: GapAnalysis;
  quarterlyProjections: Array<QuarterlyProjection>;
  riskFactors: Array<Scalars['String']['output']>;
  totalEstimatedHires: Scalars['Int']['output'];
};

/** Hiring phase */
export type HiringPhase = {
  __typename?: 'HiringPhase';
  name: Scalars['String']['output'];
  phase: Scalars['Int']['output'];
  startDate: Scalars['DateTime']['output'];
  status: HiringPhaseStatus;
  talentGrades: Array<Scalars['String']['output']>;
  targetCompletionDate: Scalars['DateTime']['output'];
  targetHeadcount: Scalars['Int']['output'];
};

/** Hiring phase status */
export enum HiringPhaseStatus {
  Completed = 'COMPLETED',
  Delayed = 'DELAYED',
  InProgress = 'IN_PROGRESS',
  Planned = 'PLANNED'
}

/** Hiring plan derived from gap analysis */
export type HiringPlan = {
  __typename?: 'HiringPlan';
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  /** Budget impact */
  estimatedCostPerHire: Scalars['Int']['output'];
  gapAnalysisId: Scalars['String']['output'];
  hiringPhases: Array<HiringPhase>;
  /** Timeline */
  hiringStartDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  progressPercentage: Scalars['Int']['output'];
  /** Status */
  status: HiringPlanStatus;
  talentCategories: Array<TalentCategory>;
  targetCompletionDate: Scalars['DateTime']['output'];
  /** Hiring targets */
  targetHeadcount: Scalars['Int']['output'];
  totalEstimatedCost: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Hiring plan status */
export enum HiringPlanStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS'
}

/** Incident severity level */
export enum IncidentSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/** Load analysis metrics */
export type LoadAnalysisMetrics = {
  __typename?: 'LoadAnalysisMetrics';
  averageUtilizationRate: Scalars['Float']['output'];
  employeesOptimal: Scalars['Int']['output'];
  employeesOverloaded: Scalars['Int']['output'];
  employeesUnderutilized: Scalars['Int']['output'];
  maximumUtilizationRate: Scalars['Float']['output'];
  medianUtilizationRate: Scalars['Float']['output'];
  minimumUtilizationRate: Scalars['Float']['output'];
  percentileP90: Scalars['Float']['output'];
  percentileP95: Scalars['Float']['output'];
  standardDeviation: Scalars['Float']['output'];
};

/** Load recommendation */
export type LoadRecommendation = {
  __typename?: 'LoadRecommendation';
  affectedEmployees: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  estimatedImpact: Scalars['String']['output'];
  priority: RecommendationPriority;
  suggestedActions: Array<Scalars['String']['output']>;
  type: RecommendationType;
};

/** Load risk level enumeration */
export enum LoadRiskLevel {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/** LoadSnapshot type representing point-in-time capacity measurement */
export type LoadSnapshot = {
  __typename?: 'LoadSnapshot';
  allocatedCapacityUnits: Scalars['Int']['output'];
  availableCapacityUnits: Scalars['Int']['output'];
  /** Load measurements */
  calculatedLoad: Scalars['Float']['output'];
  /** Associated entities */
  company: Company;
  /** Snapshot details */
  companyId: Scalars['String']['output'];
  companyLoadIndex: Scalars['Float']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  department?: Maybe<Department>;
  /** Relative metrics */
  departmentLoadIndex: Scalars['Float']['output'];
  employee?: Maybe<Employee>;
  /** Employee data (at time of snapshot) */
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  kGrade: Scalars['Float']['output'];
  loadIndex: Scalars['Float']['output'];
  loadStatus: LoadStatus;
  process?: Maybe<Process>;
  snapshotDate: Scalars['DateTime']['output'];
  /** Source information */
  snapshotType: SnapshotType;
  sourceId?: Maybe<Scalars['String']['output']>;
  sourceType?: Maybe<Scalars['String']['output']>;
  taskAssignment?: Maybe<TaskAssignment>;
  /** Capacity measurements */
  totalCapacityUnits: Scalars['Int']['output'];
  utilizationRate: Scalars['Float']['output'];
};

/** Load snapshot response wrapper */
export type LoadSnapshotConnection = {
  __typename?: 'LoadSnapshotConnection';
  nodes: Array<LoadSnapshot>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Load snapshot filter input */
export type LoadSnapshotFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
  loadStatus?: InputMaybe<LoadStatus>;
  snapshotType?: InputMaybe<SnapshotType>;
};

/** Pagination input for load snapshots */
export type LoadSnapshotPaginationInput = {
  orderBy?: InputMaybe<LoadSnapshotSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Load snapshot sort fields */
export enum LoadSnapshotSortField {
  LoadIndex = 'LOAD_INDEX',
  SnapshotDate = 'SNAPSHOT_DATE',
  UtilizationRate = 'UTILIZATION_RATE'
}

/** Load snapshot sort input */
export type LoadSnapshotSortInput = {
  field: LoadSnapshotSortField;
  order: SortOrder;
};

/** Load status enumeration */
export enum LoadStatus {
  HeavilyLoaded = 'HEAVILY_LOADED',
  Optimal = 'OPTIMAL',
  Overloaded = 'OVERLOADED',
  UnderUtilized = 'UNDER_UTILIZED'
}

/** Load threshold crossing event */
export type LoadThresholdEvent = {
  __typename?: 'LoadThresholdEvent';
  crossedDirection: CrossDirection;
  snapshot: LoadSnapshot;
  threshold: Scalars['Float']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/** Load trend data point */
export type LoadTrendPoint = {
  __typename?: 'LoadTrendPoint';
  allocatedCapacityUnits: Scalars['Int']['output'];
  loadIndex: Scalars['Float']['output'];
  loadStatus: LoadStatus;
  snapshotDate: Scalars['DateTime']['output'];
  utilizationRate: Scalars['Float']['output'];
};

/** Input for logging audit entry */
export type LogAuditEntryInput = {
  actionType: AuditActionType;
  companyId: Scalars['String']['input'];
  departmentId?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  durationMs?: InputMaybe<Scalars['Int']['input']>;
  entityId: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  newValues?: InputMaybe<Scalars['JSON']['input']>;
  oldValues?: InputMaybe<Scalars['JSON']['input']>;
  result?: InputMaybe<AuditResult>;
  status?: InputMaybe<AuditStatus>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

/**
 * Root Mutation type
 * Extended by each domain module
 */
export type Mutation = {
  __typename?: 'Mutation';
  /** Placeholder - replaced by domain mutations */
  _placeholder?: Maybe<Scalars['String']['output']>;
  /** Approve employee history change */
  approveEmployeeHistory: EmployeeHistory;
  /** Approve hiring plan */
  approveHiringPlan: HiringPlan;
  /** Mark audit logs for archival */
  archiveAuditLogs: Scalars['Int']['output'];
  /** Assign a role to an actor */
  assignActorRole: Scalars['Boolean']['output'];
  /** Assign department head */
  assignDepartmentHead: Department;
  /** Assign capacity to process */
  assignProcessCapacity: Process;
  /** Assign permission to role (admin only) */
  assignRolePermission: Scalars['Boolean']['output'];
  /** Block a task with reason */
  blockTaskAssignment: TaskAssignment;
  /** Bulk log audit entries */
  bulkLogAuditEntries: Array<AuditLog>;
  /** Cancel a process */
  cancelProcess: Process;
  /** Complete a process */
  completeProcess: Process;
  /** Complete a task assignment */
  completeTaskAssignment: TaskAssignment;
  /** Create a new actor (admin only) */
  createActor: Actor;
  /** Create new company (admin only) */
  createCompany?: Maybe<Company>;
  /** Create snapshots for all employees */
  createCompanyLoadSnapshots: Array<LoadSnapshot>;
  /** Create new department */
  createDepartment: Department;
  /** Create new employee */
  createEmployee: Employee;
  /** Create new gap analysis */
  createGapAnalysis: GapAnalysis;
  /** Create a new grade (requires grade:create permission) */
  createGrade: Grade;
  /** Create a load snapshot */
  createLoadSnapshot: LoadSnapshot;
  /** Create a new permission (admin only) */
  createPermission: Permission;
  /** Create a new process */
  createProcess: Process;
  /** Create a new role (admin only) */
  createRole: Role;
  /** Create a new task assignment */
  createTaskAssignment: TaskAssignment;
  /** Deactivate an actor */
  deactivateActor: Actor;
  /** Delete department */
  deleteDepartment: Scalars['Boolean']['output'];
  /** Delete a grade (requires grade:delete permission) */
  deleteGrade: Grade;
  /** Delete a permission (admin only) */
  deletePermission: Scalars['Boolean']['output'];
  /** Delete a process */
  deleteProcess: Scalars['Boolean']['output'];
  /** Delete a role (admin only) */
  deleteRole: Scalars['Boolean']['output'];
  /** Delete a task assignment */
  deleteTaskAssignment: Scalars['Boolean']['output'];
  /** Deny a permission to an actor */
  denyActorPermission: Scalars['Boolean']['output'];
  /** Dismiss employee (soft delete) */
  dismissEmployee: Employee;
  /** Export audit logs */
  exportAuditLogs: Scalars['String']['output'];
  /** Generate hiring plan from gap analysis */
  generateHiringPlan: HiringPlan;
  /** Grant a permission to an actor */
  grantActorPermission: Scalars['Boolean']['output'];
  /** Log an audit entry */
  logAuditEntry: AuditLog;
  /** Reassign task to different employee */
  reassignTask: TaskAssignment;
  /** Record employee history entry */
  recordEmployeeHistory: EmployeeHistory;
  /** Reject employee history change */
  rejectEmployeeHistory: EmployeeHistory;
  /** Remove a role from an actor */
  removeActorRole: Scalars['Boolean']['output'];
  /** Remove permission from role (admin only) */
  removeRolePermission: Scalars['Boolean']['output'];
  /** Revoke a permission from an actor */
  revokeActorPermission: Scalars['Boolean']['output'];
  /** Start a process */
  startProcess: Process;
  /** Start a task assignment */
  startTaskAssignment: TaskAssignment;
  /** Suspend an actor */
  suspendActor: Actor;
  /** Unblock a task */
  unblockTaskAssignment: TaskAssignment;
  /** Update an actor */
  updateActor: Actor;
  /** Update company settings */
  updateCompany?: Maybe<Company>;
  /** Update department */
  updateDepartment: Department;
  /** Update employee */
  updateEmployee: Employee;
  /** Update employee efficiency coefficient */
  updateEmployeeEfficiency: Employee;
  /** Update existing gap analysis */
  updateGapAnalysis: GapAnalysis;
  /** Update an existing grade (requires grade:update permission) */
  updateGrade: Grade;
  /** Update hiring plan */
  updateHiringPlan: HiringPlan;
  /** Track hiring progress */
  updateHiringProgress: HiringPlan;
  /** Update a permission (admin only) */
  updatePermission: Permission;
  /** Update an existing process */
  updateProcess: Process;
  /** Update a role (admin only) */
  updateRole: Role;
  /** Update a task assignment */
  updateTaskAssignment: TaskAssignment;
  /** Update task progress */
  updateTaskProgress: TaskAssignment;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationApproveEmployeeHistoryArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationApproveHiringPlanArgs = {
  approvedBy: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationArchiveAuditLogsArgs = {
  dateRange: DateRangeInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationAssignActorRoleArgs = {
  actorId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationAssignDepartmentHeadArgs = {
  departmentId: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationAssignProcessCapacityArgs = {
  capacityUnits: Scalars['Int']['input'];
  kMultiplier: Scalars['Float']['input'];
  processId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationAssignRolePermissionArgs = {
  permissionId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationBlockTaskAssignmentArgs = {
  id: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationBulkLogAuditEntriesArgs = {
  entries: Array<LogAuditEntryInput>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCancelProcessArgs = {
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCompleteProcessArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCompleteTaskAssignmentArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateActorArgs = {
  input: CreateActorInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateCompanyLoadSnapshotsArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateDepartmentArgs = {
  input: CreateDepartmentInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateGapAnalysisArgs = {
  input: CreateGapAnalysisInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateGradeArgs = {
  input: CreateGradeInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateLoadSnapshotArgs = {
  employeeId: Scalars['String']['input'];
  snapshotType: SnapshotType;
  sourceId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreatePermissionArgs = {
  input: CreatePermissionInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateProcessArgs = {
  input: CreateProcessInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationCreateTaskAssignmentArgs = {
  input: CreateTaskAssignmentInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeactivateActorArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeleteDepartmentArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeleteGradeArgs = {
  id: Scalars['Int']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeletePermissionArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeleteProcessArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeleteRoleArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDeleteTaskAssignmentArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDenyActorPermissionArgs = {
  actorId: Scalars['String']['input'];
  permissionId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationDismissEmployeeArgs = {
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationExportAuditLogsArgs = {
  filter: AuditLogFilterInput;
  format: ExportFormat;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationGenerateHiringPlanArgs = {
  gapAnalysisId: Scalars['String']['input'];
  phases?: InputMaybe<Scalars['Int']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationGrantActorPermissionArgs = {
  actorId: Scalars['String']['input'];
  permissionId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationLogAuditEntryArgs = {
  input: LogAuditEntryInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationReassignTaskArgs = {
  newEmployeeId: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationRecordEmployeeHistoryArgs = {
  input: RecordEmployeeHistoryInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationRejectEmployeeHistoryArgs = {
  id: Scalars['String']['input'];
  rejectionReason: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationRemoveActorRoleArgs = {
  actorId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationRemoveRolePermissionArgs = {
  permissionId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationRevokeActorPermissionArgs = {
  actorId: Scalars['String']['input'];
  permissionId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationStartProcessArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationStartTaskAssignmentArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationSuspendActorArgs = {
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUnblockTaskAssignmentArgs = {
  id: Scalars['String']['input'];
  resolution?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateActorArgs = {
  id: Scalars['String']['input'];
  input: UpdateActorInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateCompanyArgs = {
  id: Scalars['String']['input'];
  input: UpdateCompanyInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateDepartmentArgs = {
  id: Scalars['String']['input'];
  input: UpdateDepartmentInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateEmployeeArgs = {
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateEmployeeEfficiencyArgs = {
  id: Scalars['String']['input'];
  kEfficiency: Scalars['Float']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateGapAnalysisArgs = {
  id: Scalars['String']['input'];
  input: UpdateGapAnalysisInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateGradeArgs = {
  id: Scalars['Int']['input'];
  input: UpdateGradeInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateHiringPlanArgs = {
  id: Scalars['String']['input'];
  input: UpdateHiringPlanInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateHiringProgressArgs = {
  actualHires: Scalars['Int']['input'];
  completedPhase?: InputMaybe<Scalars['Int']['input']>;
  hiringPlanId: Scalars['String']['input'];
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdatePermissionArgs = {
  id: Scalars['String']['input'];
  input: UpdatePermissionInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateProcessArgs = {
  id: Scalars['String']['input'];
  input: UpdateProcessInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateRoleArgs = {
  id: Scalars['String']['input'];
  input: UpdateRoleInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateTaskAssignmentArgs = {
  id: Scalars['String']['input'];
  input: UpdateTaskAssignmentInput;
};


/**
 * Root Mutation type
 * Extended by each domain module
 */
export type MutationUpdateTaskProgressArgs = {
  actualDaysSpent?: InputMaybe<Scalars['Int']['input']>;
  completionPercentage: Scalars['Int']['input'];
  id: Scalars['String']['input'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasMore: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Permission type - Fine-grained access control */
export type Permission = Node & {
  __typename?: 'Permission';
  action: Scalars['String']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Permission metadata */
  name: Scalars['String']['output'];
  /** Resource and action */
  resource: Scalars['String']['output'];
  /** Scope */
  scope: PermissionScope;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Permission response wrapper */
export type PermissionConnection = {
  __typename?: 'PermissionConnection';
  nodes: Array<Permission>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Filter input for permissions */
export type PermissionFilterInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  scope?: InputMaybe<PermissionScope>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Permission pagination input */
export type PermissionPaginationInput = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Permission scope enumeration */
export enum PermissionScope {
  Company = 'COMPANY',
  System = 'SYSTEM'
}

/** Process type representing business processes */
export type Process = {
  __typename?: 'Process';
  /** Capacity configuration */
  capacityUnits: Scalars['Int']['output'];
  /** Relations */
  company: Company;
  /** Process details */
  companyId: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  /** Audit trail */
  createdBy: Scalars['String']['output'];
  department: Department;
  departmentId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  estimatedDurationDays?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  kMultiplier: Scalars['Float']['output'];
  loadSnapshots?: Maybe<Array<Maybe<LoadSnapshot>>>;
  name: Scalars['String']['output'];
  priority: ProcessPriority;
  processType: ProcessType;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Status tracking */
  status: ProcessStatus;
  taskAssignments?: Maybe<Array<Maybe<TaskAssignment>>>;
  updatedAt: Scalars['DateTime']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

/** Process response wrapper with pagination */
export type ProcessConnection = {
  __typename?: 'ProcessConnection';
  nodes: Array<Process>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Process filter input */
export type ProcessFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<ProcessPriority>;
  processType?: InputMaybe<ProcessType>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProcessStatus>;
};

/** Process metrics for analytics */
export type ProcessMetrics = {
  __typename?: 'ProcessMetrics';
  activeTaskCount: Scalars['Int']['output'];
  averageResourcesAllocated: Scalars['Int']['output'];
  completionRate: Scalars['Float']['output'];
  process: Process;
  taskCount: Scalars['Int']['output'];
  totalCapacityRequired: Scalars['Int']['output'];
  utilizationRate: Scalars['Float']['output'];
};

/** Pagination input for processes */
export type ProcessPaginationInput = {
  orderBy?: InputMaybe<ProcessSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Process priority enumeration */
export enum ProcessPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Normal = 'NORMAL'
}

/** Process sort fields */
export enum ProcessSortField {
  CapacityUnits = 'CAPACITY_UNITS',
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT'
}

/** Process sort input */
export type ProcessSortInput = {
  field: ProcessSortField;
  order: SortOrder;
};

/** Process status enumeration */
export enum ProcessStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  OnHold = 'ON_HOLD',
  Planned = 'PLANNED'
}

/** Event type for process status changes */
export type ProcessStatusChangeEvent = {
  __typename?: 'ProcessStatusChangeEvent';
  changedAt: Scalars['DateTime']['output'];
  changedBy: Scalars['String']['output'];
  newStatus: ProcessStatus;
  previousStatus: ProcessStatus;
  process: Process;
  reason?: Maybe<Scalars['String']['output']>;
};

/** Process type enumeration */
export enum ProcessType {
  Audit = 'AUDIT',
  Compliance = 'COMPLIANCE',
  Maintenance = 'MAINTENANCE',
  Offboarding = 'OFFBOARDING',
  Onboarding = 'ONBOARDING',
  Other = 'OTHER',
  PerformanceReview = 'PERFORMANCE_REVIEW',
  ProjectDelivery = 'PROJECT_DELIVERY',
  Recruitment = 'RECRUITMENT',
  Training = 'TRAINING'
}

/** Quarterly hiring projection */
export type QuarterlyProjection = {
  __typename?: 'QuarterlyProjection';
  estimatedCost: Scalars['Int']['output'];
  projectedHires: Scalars['Int']['output'];
  quarter: Scalars['String']['output'];
  targetTalentGrades: Array<Scalars['String']['output']>;
};

/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type Query = {
  __typename?: 'Query';
  /** Get actor by ID */
  actor?: Maybe<Actor>;
  /** List actors with filtering and pagination */
  actors: ActorConnection;
  /** Get audit log entry by ID */
  auditLog?: Maybe<AuditLog>;
  /** List audit logs with filtering */
  auditLogs: AuditLogConnection;
  /** Get blocked tasks */
  blockedTasks: Array<TaskAssignment>;
  /** Get all changes by a specific user */
  changesBy: Array<EmployeeHistory>;
  /** Get all companies (admin only) */
  companies?: Maybe<Array<Maybe<Company>>>;
  /** Get company by ID */
  company?: Maybe<Company>;
  /** Get actors in a company */
  companyActors: ActorConnection;
  /** Get company-wide load analysis */
  companyLoadAnalysis: CompanyLoadAnalysis;
  /** Get processes by company with metrics */
  companyProcessMetrics: Array<ProcessMetrics>;
  /** Get compliance report */
  complianceReport: ComplianceReport;
  /** Get data access audit */
  dataAccessAudit: Array<AuditLog>;
  /** Get department by ID */
  department?: Maybe<Department>;
  /** Get actors in a department */
  departmentActors: ActorConnection;
  /** Get department employee history summary */
  departmentEmployeeHistory: DepartmentEmployeeHistory;
  /** Get employees in specific department */
  departmentEmployees: Array<Employee>;
  /** Compare gaps across departments */
  departmentGapComparison: Array<DepartmentGapComparison>;
  /** Get department load overview */
  departmentLoadOverview: DepartmentLoadOverview;
  /** List processes by department */
  departmentProcesses: Array<Process>;
  /** Get load snapshots by department */
  departmentSnapshots: Array<LoadSnapshot>;
  /** Get department with all employees and load metrics */
  departmentWithMetrics?: Maybe<DepartmentMetrics>;
  /** Get all departments for company */
  departments: DepartmentConnection;
  /** Get employee by ID */
  employee?: Maybe<Employee>;
  /** Get audit report for employee */
  employeeAuditReport: EmployeeAuditReport;
  /** Get employee capacity metrics */
  employeeCapacity: Scalars['Float']['output'];
  /** Get history for a specific employee */
  employeeChangeHistory: Array<EmployeeHistory>;
  /** List employee history records with filtering and pagination */
  employeeHistories: EmployeeHistoryConnection;
  /** Get single employee history record by ID */
  employeeHistory?: Maybe<EmployeeHistory>;
  /** Get employee history entry by ID */
  employeeHistoryEntry?: Maybe<EmployeeHistory>;
  /** Get full history for an employee (alternative) */
  employeeHistoryList: EmployeeHistoryConnection;
  /** Get employee load index */
  employeeLoadIndex: Scalars['Float']['output'];
  /** Get employee load trend */
  employeeLoadTrend: EmployeeLoadHistory;
  /** Get employee task statistics */
  employeeTaskStats: EmployeeTaskStats;
  /** Get tasks assigned to an employee */
  employeeTasks: Array<TaskAssignment>;
  /** Get employee timeline */
  employeeTimeline: Array<EmployeeTimelineEntry>;
  /** Get employees with optional filters */
  employees: EmployeeConnection;
  /** Get entity audit trail */
  entityAuditTrail: EntityAuditTrail;
  /** Check failed login attempts */
  failedLoginAttempts: Array<AuditLog>;
  /** List gap analyses with filtering */
  gapAnalyses: GapAnalysisConnection;
  /** Get gap analysis by ID */
  gapAnalysis?: Maybe<GapAnalysis>;
  /** Get gap trend over time */
  gapAnalysisTrend: Array<GapTrend>;
  /** Get criticality assessment */
  gapCriticalityAssessment: GapCriticalityAssessment;
  /** Get grade by ID */
  grade?: Maybe<Grade>;
  /** Get grade with employee count */
  gradeWithStats?: Maybe<GradeStats>;
  /** Get all grades */
  grades: Array<Grade>;
  /** Health check endpoint */
  health: Scalars['String']['output'];
  /** Get hiring forecast from latest gap analysis */
  hiringForecast?: Maybe<HiringForecast>;
  /** Get latest gap analysis for company */
  latestCompanyGapAnalysis?: Maybe<GapAnalysis>;
  /** Get latest gap analysis for department */
  latestDepartmentGapAnalysis?: Maybe<GapAnalysis>;
  /** Get latest load snapshot for employee */
  latestEmployeeSnapshot?: Maybe<LoadSnapshot>;
  /** Find employees requiring load adjustment */
  loadAnomalies: Array<LoadSnapshot>;
  /** Get load snapshot by ID */
  loadSnapshot?: Maybe<LoadSnapshot>;
  /** List load snapshots with filtering */
  loadSnapshots: LoadSnapshotConnection;
  me?: Maybe<User>;
  /** Get current actor (authenticated user's business identity) */
  myActor?: Maybe<Actor>;
  /** Get authenticated user's company */
  myCompany?: Maybe<Company>;
  /** Get overdue tasks */
  overdueTasks: Array<TaskAssignment>;
  /** Get permission by ID (admin only) */
  permission?: Maybe<Permission>;
  /** List permissions with filtering (admin only) */
  permissions: PermissionConnection;
  /** Get process by ID */
  process?: Maybe<Process>;
  /** Get tasks in a process */
  processTasks: Array<TaskAssignment>;
  /** Get process with metrics for analytics */
  processWithMetrics?: Maybe<ProcessMetrics>;
  /** List all processes with filtering and pagination */
  processes: ProcessConnection;
  /** Get role by ID (admin only) */
  role?: Maybe<Role>;
  /** List roles with filtering (admin only) */
  roles: RoleConnection;
  /** Get security incident report */
  securityIncidentReport: SecurityIncidentReport;
  /** Find suspicious activities */
  suspiciousActivities: Array<AuditLog>;
  /** Get all system permissions (for UI) */
  systemPermissions: Array<Permission>;
  /** Get task assignment by ID */
  taskAssignment?: Maybe<TaskAssignment>;
  /** List all task assignments with filtering and pagination */
  taskAssignments: TaskAssignmentConnection;
  /** Get task with detailed metrics */
  taskWithMetrics?: Maybe<TaskAssignmentMetrics>;
  /** Find unapproved changes */
  unapprovedChanges: Array<EmployeeHistory>;
  /** Get user activity summary */
  userActivitySummary: UserActivitySummary;
  users: UsersResult;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryActorArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryActorsArgs = {
  filter?: InputMaybe<ActorFilterInput>;
  pagination?: InputMaybe<ActorPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryAuditLogArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryAuditLogsArgs = {
  filter: AuditLogFilterInput;
  pagination?: InputMaybe<AuditLogPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryBlockedTasksArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryChangesByArgs = {
  dateRange?: InputMaybe<DateRangeInput>;
  userId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryCompanyArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryCompanyActorsArgs = {
  companyId: Scalars['String']['input'];
  pagination?: InputMaybe<ActorPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryCompanyLoadAnalysisArgs = {
  companyId: Scalars['String']['input'];
  dateRange?: InputMaybe<DateRangeInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryCompanyProcessMetricsArgs = {
  companyId: Scalars['String']['input'];
  filter?: InputMaybe<ProcessFilterInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryComplianceReportArgs = {
  companyId: Scalars['String']['input'];
  dateRange: DateRangeInput;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDataAccessAuditArgs = {
  companyId: Scalars['String']['input'];
  dateRange?: InputMaybe<DateRangeInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentActorsArgs = {
  departmentId: Scalars['String']['input'];
  pagination?: InputMaybe<ActorPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentEmployeeHistoryArgs = {
  dateRange: DateRangeInput;
  departmentId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentEmployeesArgs = {
  departmentId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentGapComparisonArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentLoadOverviewArgs = {
  departmentId: Scalars['String']['input'];
  snapshotDate?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentProcessesArgs = {
  departmentId: Scalars['String']['input'];
  status?: InputMaybe<ProcessStatus>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentSnapshotsArgs = {
  departmentId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentWithMetricsArgs = {
  id: Scalars['String']['input'];
  periodEnd?: InputMaybe<Scalars['DateTime']['input']>;
  periodStart?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryDepartmentsArgs = {
  filter: DepartmentFilterInput;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeAuditReportArgs = {
  dateRange: DateRangeInput;
  employeeId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeCapacityArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeChangeHistoryArgs = {
  employeeId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeHistoriesArgs = {
  filter?: InputMaybe<EmployeeHistoryFilterInput>;
  pagination?: InputMaybe<EmployeeHistoryPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeHistoryArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeHistoryEntryArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeHistoryListArgs = {
  employeeId: Scalars['String']['input'];
  filter?: InputMaybe<EmployeeHistoryFilterInput>;
  pagination?: InputMaybe<EmployeeHistoryPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeLoadIndexArgs = {
  id: Scalars['String']['input'];
  periodEnd: Scalars['DateTime']['input'];
  periodStart: Scalars['DateTime']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeLoadTrendArgs = {
  dateRange: DateRangeInput;
  employeeId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeTaskStatsArgs = {
  employeeId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeTasksArgs = {
  employeeId: Scalars['String']['input'];
  status?: InputMaybe<TaskStatus>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeeTimelineArgs = {
  employeeId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEmployeesArgs = {
  filter?: InputMaybe<EmployeeFilterInput>;
  pagination?: InputMaybe<EmployeePaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryEntityAuditTrailArgs = {
  entityId: Scalars['String']['input'];
  entityType: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryFailedLoginAttemptsArgs = {
  dateRange?: InputMaybe<DateRangeInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryGapAnalysesArgs = {
  filter?: InputMaybe<GapAnalysisFilterInput>;
  pagination?: InputMaybe<GapAnalysisPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryGapAnalysisArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryGapAnalysisTrendArgs = {
  companyId: Scalars['String']['input'];
  dateRange: DateRangeInput;
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryGapCriticalityAssessmentArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryGradeArgs = {
  id: Scalars['Int']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryGradeWithStatsArgs = {
  id: Scalars['Int']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryHiringForecastArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryLatestCompanyGapAnalysisArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryLatestDepartmentGapAnalysisArgs = {
  departmentId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryLatestEmployeeSnapshotArgs = {
  employeeId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryLoadAnomaliesArgs = {
  companyId: Scalars['String']['input'];
  threshold?: InputMaybe<Scalars['Float']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryLoadSnapshotArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryLoadSnapshotsArgs = {
  filter: LoadSnapshotFilterInput;
  pagination?: InputMaybe<LoadSnapshotPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryOverdueTasksArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryPermissionArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryPermissionsArgs = {
  filter?: InputMaybe<PermissionFilterInput>;
  pagination?: InputMaybe<PermissionPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryProcessArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryProcessTasksArgs = {
  processId: Scalars['String']['input'];
  status?: InputMaybe<TaskStatus>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryProcessWithMetricsArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryProcessesArgs = {
  filter?: InputMaybe<ProcessFilterInput>;
  pagination?: InputMaybe<ProcessPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryRoleArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryRolesArgs = {
  filter?: InputMaybe<RoleFilterInput>;
  pagination?: InputMaybe<RolePaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QuerySecurityIncidentReportArgs = {
  companyId: Scalars['String']['input'];
  dateRange: DateRangeInput;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QuerySuspiciousActivitiesArgs = {
  companyId: Scalars['String']['input'];
  threshold?: InputMaybe<Scalars['Int']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryTaskAssignmentArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryTaskAssignmentsArgs = {
  filter?: InputMaybe<TaskAssignmentFilterInput>;
  pagination?: InputMaybe<TaskAssignmentPaginationInput>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryTaskWithMetricsArgs = {
  id: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryUnapprovedChangesArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryUserActivitySummaryArgs = {
  dateRange: DateRangeInput;
  userId: Scalars['String']['input'];
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryUsersArgs = {
  input: UsersInput;
};

/** Recommendation priority */
export enum RecommendationPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

/** Recommendation type */
export enum RecommendationType {
  AccelerateHiring = 'ACCELERATE_HIRING',
  ExtendTimeline = 'EXTEND_TIMELINE',
  OptimizeAllocation = 'OPTIMIZE_ALLOCATION',
  RedistributeWorkload = 'REDISTRIBUTE_WORKLOAD',
  ReduceScope = 'REDUCE_SCOPE'
}

/** Input for recording employee history */
export type RecordEmployeeHistoryInput = {
  changeType: EmployeeChangeType;
  changedField?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  effectiveDate?: InputMaybe<Scalars['DateTime']['input']>;
  employeeId: Scalars['String']['input'];
  fromStatus?: InputMaybe<EmploymentStatus>;
  newValue?: InputMaybe<Scalars['JSON']['input']>;
  previousValue?: InputMaybe<Scalars['JSON']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  toStatus?: InputMaybe<EmploymentStatus>;
};

/** Risk activity event */
export type RiskActivityEvent = {
  __typename?: 'RiskActivityEvent';
  log: AuditLog;
  reason: Scalars['String']['output'];
  riskScore: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/**
 * Role type - Represents a collection of permissions
 * Can be system-wide or company-specific
 */
export type Role = Node & {
  __typename?: 'Role';
  company?: Maybe<Company>;
  companyId?: Maybe<Scalars['String']['output']>;
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Role metadata */
  name: Scalars['String']['output'];
  /** Permissions in this role */
  permissions: Array<RolePermission>;
  /** Scope */
  scope: RoleScope;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Role response wrapper */
export type RoleConnection = {
  __typename?: 'RoleConnection';
  nodes: Array<Role>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Filter input for roles */
export type RoleFilterInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  scope?: InputMaybe<RoleScope>;
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Role pagination input */
export type RolePaginationInput = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Role permission assignment */
export type RolePermission = Node & {
  __typename?: 'RolePermission';
  assignedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  permission: Permission;
  permissionId: Scalars['String']['output'];
  role: Role;
  roleId: Scalars['String']['output'];
};

/** Role scope enumeration */
export enum RoleScope {
  Company = 'COMPANY',
  Guest = 'GUEST',
  System = 'SYSTEM'
}

/** Security incident */
export type SecurityIncident = {
  __typename?: 'SecurityIncident';
  affectedUsers: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  detectedAt: Scalars['DateTime']['output'];
  involvedLogs: Array<AuditLog>;
  resolution?: Maybe<Scalars['String']['output']>;
  severity: IncidentSeverity;
  type: Scalars['String']['output'];
};

/** Security incident event */
export type SecurityIncidentEvent = {
  __typename?: 'SecurityIncidentEvent';
  detectedAt: Scalars['DateTime']['output'];
  incident: SecurityIncident;
  requiresImmediateAction: Scalars['Boolean']['output'];
};

/** Security incident report */
export type SecurityIncidentReport = {
  __typename?: 'SecurityIncidentReport';
  /** Prevention metrics */
  blockedAttempts: Scalars['Int']['output'];
  company: Company;
  failedAuthAttempts: Scalars['Int']['output'];
  generatedAt: Scalars['DateTime']['output'];
  incidents: Array<SecurityIncident>;
  period: DateRange;
  suspiciousBehavior: Scalars['Int']['output'];
  /** Incidents */
  totalIncidents: Scalars['Int']['output'];
};

/** Snapshot type enumeration */
export enum SnapshotType {
  EmployeeUpdate = 'EMPLOYEE_UPDATE',
  OnDemand = 'ON_DEMAND',
  ProcessCompletion = 'PROCESS_COMPLETION',
  ProcessStart = 'PROCESS_START',
  Scheduled = 'SCHEDULED',
  TaskAllocation = 'TASK_ALLOCATION',
  TaskCompletion = 'TASK_COMPLETION'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

/**
 * Root Subscription type
 * Extended by each domain module
 */
export type Subscription = {
  __typename?: 'Subscription';
  /** Placeholder - replaced by domain subscriptions */
  _placeholder?: Maybe<Scalars['String']['output']>;
  /** Subscribe to audit log entries */
  auditLogCreated: AuditLog;
  /** Subscribe to new departments */
  departmentCreated: Department;
  /** Subscribe to department changes */
  departmentUpdated: Department;
  /**
   * Subscribe to employee capacity changes
   * Fires when capacity allocation changes for a specific employee
   */
  employeeCapacityChanged: Employee;
  /** Subscribe to employee changes */
  employeeChanged: EmployeeHistory;
  /**
   * Subscribe to new employee creation
   * Can subscribe to department-specific or company-wide
   */
  employeeCreated: Employee;
  /**
   * Subscribe to employee dismissals
   * Can subscribe to department-specific or company-wide
   */
  employeeDismissed: Employee;
  /**
   * Subscribe to employee load threshold events
   * Fires when employee load crosses a specified threshold
   */
  employeeLoadThresholdCrossed: Employee;
  /** Subscribe to status changes */
  employeeStatusChanged: EmployeeStatusChangeEvent;
  /**
   * Subscribe to employee changes (updates)
   * Can subscribe to all updates if no departmentId provided
   */
  employeeUpdated: Employee;
  /** Subscribe to gap analysis updates */
  gapAnalysisUpdated: GapAnalysis;
  /** Subscribe to gap threshold events */
  gapThresholdCrossed: GapThresholdEvent;
  /** Subscribe to load threshold events */
  loadThresholdCrossed: LoadThresholdEvent;
  /** Subscribe to new process creation */
  processCreated: Process;
  /** Subscribe to process status changes */
  processStatusChanged: ProcessStatusChangeEvent;
  /** Subscribe to process updates */
  processUpdated: Process;
  /** Subscribe to high-risk activities */
  riskActivityDetected: RiskActivityEvent;
  /** Subscribe to security incidents */
  securityIncidentDetected: SecurityIncidentEvent;
  /** Subscribe to task assignment updates */
  taskAssignmentUpdated: TaskAssignment;
  /** Subscribe to new task creation */
  taskCreated: TaskAssignment;
  /** Subscribe to task status changes */
  taskStatusChanged: TaskStatusChangeEvent;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionAuditLogCreatedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionDepartmentCreatedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionDepartmentUpdatedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionEmployeeCapacityChangedArgs = {
  employeeId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionEmployeeChangedArgs = {
  employeeId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionEmployeeCreatedArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionEmployeeDismissedArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionEmployeeLoadThresholdCrossedArgs = {
  employeeId: Scalars['String']['input'];
  threshold?: InputMaybe<Scalars['Float']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionEmployeeUpdatedArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionGapAnalysisUpdatedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionGapThresholdCrossedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionLoadThresholdCrossedArgs = {
  employeeId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionProcessCreatedArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionProcessStatusChangedArgs = {
  processId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionProcessUpdatedArgs = {
  processId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionRiskActivityDetectedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionSecurityIncidentDetectedArgs = {
  companyId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionTaskAssignmentUpdatedArgs = {
  taskId: Scalars['String']['input'];
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionTaskCreatedArgs = {
  employeeId?: InputMaybe<Scalars['String']['input']>;
};


/**
 * Root Subscription type
 * Extended by each domain module
 */
export type SubscriptionTaskStatusChangedArgs = {
  taskId: Scalars['String']['input'];
};

/** Talent category for hiring */
export type TalentCategory = {
  __typename?: 'TalentCategory';
  estimatedMonthlyCapacity: Scalars['Int']['output'];
  estimatedRecruitmentTimeWeeks: Scalars['Int']['output'];
  experienceRequired: Scalars['String']['output'];
  grade: Grade;
  gradeId: Scalars['String']['output'];
  skills: Array<Scalars['String']['output']>;
  targetCount: Scalars['Int']['output'];
};

/** TaskAssignment type representing work assignments */
export type TaskAssignment = {
  __typename?: 'TaskAssignment';
  actualDaysSpent?: Maybe<Scalars['Int']['output']>;
  /** Capacity and effort */
  allocatedCapacityUnits: Scalars['Int']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Progress tracking */
  completionPercentage: Scalars['Int']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  /** Audit trail */
  createdBy: Scalars['String']['output'];
  department: Department;
  departmentId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate: Scalars['DateTime']['output'];
  effortHours: Scalars['Float']['output'];
  employee: Employee;
  employeeId: Scalars['String']['output'];
  estimatedDaysToComplete?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  loadSnapshots?: Maybe<Array<Maybe<LoadSnapshot>>>;
  name: Scalars['String']['output'];
  priority: TaskPriority;
  /** Relations */
  process: Process;
  /** Assignment details */
  processId: Scalars['String']['output'];
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Status tracking */
  status: TaskStatus;
  taskType: TaskType;
  updatedAt: Scalars['DateTime']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

/** Task assignment response wrapper with pagination */
export type TaskAssignmentConnection = {
  __typename?: 'TaskAssignmentConnection';
  nodes: Array<TaskAssignment>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Task assignment filter input */
export type TaskAssignmentFilterInput = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['String']['input']>;
  isBlocked?: InputMaybe<Scalars['Boolean']['input']>;
  isOverdue?: InputMaybe<Scalars['Boolean']['input']>;
  priority?: InputMaybe<TaskPriority>;
  processId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatus>;
  taskType?: InputMaybe<TaskType>;
};

/** Task assignment metrics */
export type TaskAssignmentMetrics = {
  __typename?: 'TaskAssignmentMetrics';
  assignment: TaskAssignment;
  daysUntilDue: Scalars['Int']['output'];
  estimatedCompletionDate?: Maybe<Scalars['DateTime']['output']>;
  onTrack: Scalars['Boolean']['output'];
  utilizationRate: Scalars['Float']['output'];
  workloadContribution: Scalars['Float']['output'];
};

/** Pagination input for task assignments */
export type TaskAssignmentPaginationInput = {
  orderBy?: InputMaybe<TaskAssignmentSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Task assignment sort fields */
export enum TaskAssignmentSortField {
  CompletionPercentage = 'COMPLETION_PERCENTAGE',
  CreatedAt = 'CREATED_AT',
  DueDate = 'DUE_DATE',
  EffortHours = 'EFFORT_HOURS',
  Priority = 'PRIORITY'
}

/** Task assignment sort input */
export type TaskAssignmentSortInput = {
  field: TaskAssignmentSortField;
  order: SortOrder;
};

/** Task priority enumeration */
export enum TaskPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Normal = 'NORMAL'
}

/** Task status enumeration */
export enum TaskStatus {
  Assigned = 'ASSIGNED',
  Blocked = 'BLOCKED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  InProgress = 'IN_PROGRESS',
  OnHold = 'ON_HOLD'
}

/** Event type for task status changes */
export type TaskStatusChangeEvent = {
  __typename?: 'TaskStatusChangeEvent';
  assignment: TaskAssignment;
  changedAt: Scalars['DateTime']['output'];
  changedBy: Scalars['String']['output'];
  newStatus: TaskStatus;
  previousStatus: TaskStatus;
  reason?: Maybe<Scalars['String']['output']>;
};

/** Count of tasks by status */
export type TaskStatusCount = {
  __typename?: 'TaskStatusCount';
  count: Scalars['Int']['output'];
  status: TaskStatus;
};

/** Task type enumeration */
export enum TaskType {
  Administrative = 'ADMINISTRATIVE',
  Development = 'DEVELOPMENT',
  Documentation = 'DOCUMENTATION',
  Meeting = 'MEETING',
  Other = 'OTHER',
  Research = 'RESEARCH',
  Review = 'REVIEW',
  Support = 'SUPPORT',
  Testing = 'TESTING',
  Training = 'TRAINING'
}

/** Count of tasks by type */
export type TaskTypeCount = {
  __typename?: 'TaskTypeCount';
  count: Scalars['Int']['output'];
  taskType: TaskType;
};

/** Trend direction enumeration */
export enum TrendDirection {
  Decreasing = 'DECREASING',
  Increasing = 'INCREASING',
  Stable = 'STABLE'
}

/** Input for updating an actor */
export type UpdateActorInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ActorStatus>;
};

/** Input for updating a company */
export type UpdateCompanyInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  workingDaysPerMonth?: InputMaybe<Scalars['Int']['input']>;
  workingHoursDay?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for updating a department */
export type UpdateDepartmentInput = {
  headId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Fields that can be updated */
export type UpdateEmployeeInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  employmentType?: InputMaybe<Scalars['String']['input']>;
  fireDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  gradeId?: InputMaybe<Scalars['Int']['input']>;
  kEfficiency?: InputMaybe<Scalars['Float']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  workingHoursPerDay?: InputMaybe<Scalars['Int']['input']>;
};

/** Update gap analysis input */
export type UpdateGapAnalysisInput = {
  confidenceLevel?: InputMaybe<Scalars['String']['input']>;
  forecastAccuracy?: InputMaybe<Scalars['Float']['input']>;
  forecastedWorkloadUnits?: InputMaybe<Scalars['Int']['input']>;
};

/** Grade input for updates */
export type UpdateGradeInput = {
  /** Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Grade level/seniority */
  level?: InputMaybe<Scalars['Int']['input']>;
  /** Maximum salary for this grade */
  maxSalary?: InputMaybe<Scalars['Float']['input']>;
  /** Minimum salary for this grade */
  minSalary?: InputMaybe<Scalars['Float']['input']>;
  /** Human readable name */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Update hiring plan input */
export type UpdateHiringPlanInput = {
  hiringStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  progressPercentage?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<HiringPlanStatus>;
  targetCompletionDate?: InputMaybe<Scalars['DateTime']['input']>;
  targetHeadcount?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for updating a permission */
export type UpdatePermissionInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a process */
export type UpdateProcessInput = {
  capacityUnits?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedDurationDays?: InputMaybe<Scalars['Int']['input']>;
  kMultiplier?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<ProcessPriority>;
  status?: InputMaybe<ProcessStatus>;
};

/** Input for updating a role */
export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a task assignment */
export type UpdateTaskAssignmentInput = {
  allocatedCapacityUnits?: InputMaybe<Scalars['Int']['input']>;
  completionPercentage?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  effortHours?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<TaskPriority>;
  status?: InputMaybe<TaskStatus>;
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRole>;
  status: UserStatus;
  updatedAt: Scalars['DateTime']['output'];
};

/** User access summary for compliance */
export type UserAccessSummary = {
  __typename?: 'UserAccessSummary';
  activeMinutesThisPeriod: Scalars['Int']['output'];
  criticalActionsCount: Scalars['Int']['output'];
  dataAccessCount: Scalars['Int']['output'];
  lastLogin: Scalars['DateTime']['output'];
  riskLevel: AccessRiskLevel;
  user: User;
};

/** User activity summary */
export type UserActivitySummary = {
  __typename?: 'UserActivitySummary';
  actionsByType: Array<ActionTypeSummary>;
  activePeriod: DateRange;
  failureCount: Scalars['Int']['output'];
  generatedAt: Scalars['DateTime']['output'];
  /** Recent activity */
  recentActions: Array<AuditLog>;
  riskScore: Scalars['Int']['output'];
  successRate: Scalars['Float']['output'];
  /** Activity statistics */
  totalActions: Scalars['Int']['output'];
  /** Risk indicators */
  unusualActivities: Scalars['String']['output'];
  user: User;
};

export enum UserRole {
  Admin = 'admin',
  Broker = 'broker',
  Carrier = 'carrier',
  Driver = 'driver',
  Warehouse = 'warehouse'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
  Suspended = 'suspended'
}

export type UsersInput = {
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
  status?: InputMaybe<UserStatus>;
};

export type UsersResult = {
  __typename?: 'UsersResult';
  pageInfo: PageInfo;
  users: Array<User>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;




/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Node:
    | ( ActorModel )
    | ( ActorPermissionModel )
    | ( ActorRoleModel )
    | ( PermissionModel )
    | ( RoleModel )
    | ( RolePermissionModel )
    | ( UserModel )
  ;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccessRiskLevel: AccessRiskLevel;
  ActionTypeSummary: ResolverTypeWrapper<ActionTypeSummary>;
  Actor: ResolverTypeWrapper<ActorModel>;
  ActorConnection: ResolverTypeWrapper<Omit<ActorConnection, 'nodes'> & { nodes: Array<ResolversTypes['Actor']> }>;
  ActorFilterInput: ActorFilterInput;
  ActorPaginationInput: ActorPaginationInput;
  ActorPermission: ResolverTypeWrapper<ActorPermissionModel>;
  ActorRole: ResolverTypeWrapper<ActorRoleModel>;
  ActorStatus: ActorStatus;
  AuditActionType: AuditActionType;
  AuditLog: ResolverTypeWrapper<AuditLogModel>;
  AuditLogConnection: ResolverTypeWrapper<Omit<AuditLogConnection, 'nodes'> & { nodes: Array<ResolversTypes['AuditLog']> }>;
  AuditLogFilterInput: AuditLogFilterInput;
  AuditLogPaginationInput: AuditLogPaginationInput;
  AuditLogSortField: AuditLogSortField;
  AuditLogSortInput: AuditLogSortInput;
  AuditResult: AuditResult;
  AuditStatus: AuditStatus;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChangeByUser: ResolverTypeWrapper<Omit<ChangeByUser, 'user'> & { user: ResolversTypes['User'] }>;
  ChangeTypeSummary: ResolverTypeWrapper<ChangeTypeSummary>;
  Company: ResolverTypeWrapper<CompanyModel>;
  CompanyLoadAnalysis: ResolverTypeWrapper<Omit<CompanyLoadAnalysis, 'company' | 'departmentMetrics'> & { company: ResolversTypes['Company'], departmentMetrics: Array<ResolversTypes['DepartmentLoadOverview']> }>;
  ComplianceReport: ResolverTypeWrapper<Omit<ComplianceReport, 'company' | 'highRiskActivities' | 'userAccessSummary'> & { company: ResolversTypes['Company'], highRiskActivities: Array<ResolversTypes['AuditLog']>, userAccessSummary: Array<ResolversTypes['UserAccessSummary']> }>;
  CreateActorInput: CreateActorInput;
  CreateCompanyInput: CreateCompanyInput;
  CreateDepartmentInput: CreateDepartmentInput;
  CreateEmployeeInput: CreateEmployeeInput;
  CreateGapAnalysisInput: CreateGapAnalysisInput;
  CreateGradeInput: CreateGradeInput;
  CreatePermissionInput: CreatePermissionInput;
  CreateProcessInput: CreateProcessInput;
  CreateRoleInput: CreateRoleInput;
  CreateTaskAssignmentInput: CreateTaskAssignmentInput;
  CrossDirection: CrossDirection;
  DateRange: ResolverTypeWrapper<DateRange>;
  DateRangeInput: DateRangeInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Department: ResolverTypeWrapper<DepartmentModel>;
  DepartmentConnection: ResolverTypeWrapper<Omit<DepartmentConnection, 'nodes'> & { nodes: Array<ResolversTypes['Department']> }>;
  DepartmentEmployeeHistory: ResolverTypeWrapper<Omit<DepartmentEmployeeHistory, 'department' | 'timeline'> & { department: ResolversTypes['Department'], timeline: Array<ResolversTypes['EmployeeTimelineEntry']> }>;
  DepartmentFilterInput: DepartmentFilterInput;
  DepartmentGapComparison: ResolverTypeWrapper<Omit<DepartmentGapComparison, 'department' | 'gapAnalysis'> & { department: ResolversTypes['Department'], gapAnalysis?: Maybe<ResolversTypes['GapAnalysis']> }>;
  DepartmentLoadOverview: ResolverTypeWrapper<Omit<DepartmentLoadOverview, 'department' | 'employeeBreakdown'> & { department: ResolversTypes['Department'], employeeBreakdown: Array<ResolversTypes['EmployeeLoadBreakdown']> }>;
  DepartmentMetrics: ResolverTypeWrapper<Omit<DepartmentMetrics, 'department'> & { department: ResolversTypes['Department'] }>;
  Employee: ResolverTypeWrapper<EmployeeModel>;
  EmployeeAuditReport: ResolverTypeWrapper<Omit<EmployeeAuditReport, 'capacityChanges' | 'efficiencyChanges' | 'employee' | 'statusChanges' | 'timeline'> & { capacityChanges: Array<ResolversTypes['EmployeeHistory']>, efficiencyChanges: Array<ResolversTypes['EmployeeHistory']>, employee: ResolversTypes['Employee'], statusChanges: Array<ResolversTypes['EmployeeHistory']>, timeline: Array<ResolversTypes['EmployeeTimelineEntry']> }>;
  EmployeeChangeType: EmployeeChangeType;
  EmployeeConnection: ResolverTypeWrapper<Omit<EmployeeConnection, 'nodes'> & { nodes: Array<ResolversTypes['Employee']> }>;
  EmployeeFilterInput: EmployeeFilterInput;
  EmployeeHistory: ResolverTypeWrapper<EmployeeHistoryModel>;
  EmployeeHistoryConnection: ResolverTypeWrapper<Omit<EmployeeHistoryConnection, 'nodes'> & { nodes: Array<ResolversTypes['EmployeeHistory']> }>;
  EmployeeHistoryFilterInput: EmployeeHistoryFilterInput;
  EmployeeHistoryPaginationInput: EmployeeHistoryPaginationInput;
  EmployeeHistorySortField: EmployeeHistorySortField;
  EmployeeHistorySortInput: EmployeeHistorySortInput;
  EmployeeLoadBreakdown: ResolverTypeWrapper<Omit<EmployeeLoadBreakdown, 'employee'> & { employee: ResolversTypes['Employee'] }>;
  EmployeeLoadHistory: ResolverTypeWrapper<Omit<EmployeeLoadHistory, 'employee' | 'snapshots'> & { employee: ResolversTypes['Employee'], snapshots: Array<ResolversTypes['LoadSnapshot']> }>;
  EmployeePaginationInput: EmployeePaginationInput;
  EmployeeStatusChangeEvent: ResolverTypeWrapper<Omit<EmployeeStatusChangeEvent, 'history'> & { history: ResolversTypes['EmployeeHistory'] }>;
  EmployeeTaskStats: ResolverTypeWrapper<Omit<EmployeeTaskStats, 'employee'> & { employee: ResolversTypes['Employee'] }>;
  EmployeeTimelineEntry: ResolverTypeWrapper<Omit<EmployeeTimelineEntry, 'event'> & { event: ResolversTypes['EmployeeHistory'] }>;
  EmploymentStatus: EmploymentStatus;
  EntityAuditTrail: ResolverTypeWrapper<Omit<EntityAuditTrail, 'changesByUser' | 'timeline'> & { changesByUser: Array<ResolversTypes['ChangeByUser']>, timeline: Array<ResolversTypes['AuditLog']> }>;
  Error: ResolverTypeWrapper<Error>;
  ExportFormat: ExportFormat;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GapAnalysis: ResolverTypeWrapper<GapAnalysisResultModel>;
  GapAnalysisConnection: ResolverTypeWrapper<Omit<GapAnalysisConnection, 'nodes'> & { nodes: Array<ResolversTypes['GapAnalysis']> }>;
  GapAnalysisFilterInput: GapAnalysisFilterInput;
  GapAnalysisPaginationInput: GapAnalysisPaginationInput;
  GapAnalysisRecommendation: ResolverTypeWrapper<GapAnalysisRecommendation>;
  GapAnalysisRiskLevel: GapAnalysisRiskLevel;
  GapAnalysisSortField: GapAnalysisSortField;
  GapAnalysisSortInput: GapAnalysisSortInput;
  GapCriticalityAssessment: ResolverTypeWrapper<Omit<GapCriticalityAssessment, 'criticalDepartments'> & { criticalDepartments: Array<ResolversTypes['DepartmentGapComparison']> }>;
  GapStatus: GapStatus;
  GapThresholdEvent: ResolverTypeWrapper<Omit<GapThresholdEvent, 'analysis'> & { analysis: ResolversTypes['GapAnalysis'] }>;
  GapTrend: ResolverTypeWrapper<GapTrend>;
  Grade: ResolverTypeWrapper<GradeModel>;
  GradeStats: ResolverTypeWrapper<Omit<GradeStats, 'grade'> & { grade: ResolversTypes['Grade'] }>;
  HiringForecast: ResolverTypeWrapper<Omit<HiringForecast, 'gapAnalysis'> & { gapAnalysis: ResolversTypes['GapAnalysis'] }>;
  HiringPhase: ResolverTypeWrapper<HiringPhase>;
  HiringPhaseStatus: HiringPhaseStatus;
  HiringPlan: ResolverTypeWrapper<Omit<HiringPlan, 'talentCategories'> & { talentCategories: Array<ResolversTypes['TalentCategory']> }>;
  HiringPlanStatus: HiringPlanStatus;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IncidentSeverity: IncidentSeverity;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LoadAnalysisMetrics: ResolverTypeWrapper<LoadAnalysisMetrics>;
  LoadRecommendation: ResolverTypeWrapper<LoadRecommendation>;
  LoadRiskLevel: LoadRiskLevel;
  LoadSnapshot: ResolverTypeWrapper<LoadSnapshotModel>;
  LoadSnapshotConnection: ResolverTypeWrapper<Omit<LoadSnapshotConnection, 'nodes'> & { nodes: Array<ResolversTypes['LoadSnapshot']> }>;
  LoadSnapshotFilterInput: LoadSnapshotFilterInput;
  LoadSnapshotPaginationInput: LoadSnapshotPaginationInput;
  LoadSnapshotSortField: LoadSnapshotSortField;
  LoadSnapshotSortInput: LoadSnapshotSortInput;
  LoadStatus: LoadStatus;
  LoadThresholdEvent: ResolverTypeWrapper<Omit<LoadThresholdEvent, 'snapshot'> & { snapshot: ResolversTypes['LoadSnapshot'] }>;
  LoadTrendPoint: ResolverTypeWrapper<LoadTrendPoint>;
  LogAuditEntryInput: LogAuditEntryInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  Permission: ResolverTypeWrapper<PermissionModel>;
  PermissionConnection: ResolverTypeWrapper<Omit<PermissionConnection, 'nodes'> & { nodes: Array<ResolversTypes['Permission']> }>;
  PermissionFilterInput: PermissionFilterInput;
  PermissionPaginationInput: PermissionPaginationInput;
  PermissionScope: PermissionScope;
  Process: ResolverTypeWrapper<ProcessModel>;
  ProcessConnection: ResolverTypeWrapper<Omit<ProcessConnection, 'nodes'> & { nodes: Array<ResolversTypes['Process']> }>;
  ProcessFilterInput: ProcessFilterInput;
  ProcessMetrics: ResolverTypeWrapper<Omit<ProcessMetrics, 'process'> & { process: ResolversTypes['Process'] }>;
  ProcessPaginationInput: ProcessPaginationInput;
  ProcessPriority: ProcessPriority;
  ProcessSortField: ProcessSortField;
  ProcessSortInput: ProcessSortInput;
  ProcessStatus: ProcessStatus;
  ProcessStatusChangeEvent: ResolverTypeWrapper<Omit<ProcessStatusChangeEvent, 'process'> & { process: ResolversTypes['Process'] }>;
  ProcessType: ProcessType;
  QuarterlyProjection: ResolverTypeWrapper<QuarterlyProjection>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RecommendationPriority: RecommendationPriority;
  RecommendationType: RecommendationType;
  RecordEmployeeHistoryInput: RecordEmployeeHistoryInput;
  RiskActivityEvent: ResolverTypeWrapper<Omit<RiskActivityEvent, 'log'> & { log: ResolversTypes['AuditLog'] }>;
  Role: ResolverTypeWrapper<RoleModel>;
  RoleConnection: ResolverTypeWrapper<Omit<RoleConnection, 'nodes'> & { nodes: Array<ResolversTypes['Role']> }>;
  RoleFilterInput: RoleFilterInput;
  RolePaginationInput: RolePaginationInput;
  RolePermission: ResolverTypeWrapper<RolePermissionModel>;
  RoleScope: RoleScope;
  SecurityIncident: ResolverTypeWrapper<Omit<SecurityIncident, 'involvedLogs'> & { involvedLogs: Array<ResolversTypes['AuditLog']> }>;
  SecurityIncidentEvent: ResolverTypeWrapper<Omit<SecurityIncidentEvent, 'incident'> & { incident: ResolversTypes['SecurityIncident'] }>;
  SecurityIncidentReport: ResolverTypeWrapper<Omit<SecurityIncidentReport, 'company' | 'incidents'> & { company: ResolversTypes['Company'], incidents: Array<ResolversTypes['SecurityIncident']> }>;
  SnapshotType: SnapshotType;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  TalentCategory: ResolverTypeWrapper<Omit<TalentCategory, 'grade'> & { grade: ResolversTypes['Grade'] }>;
  TaskAssignment: ResolverTypeWrapper<TaskAssignmentModel>;
  TaskAssignmentConnection: ResolverTypeWrapper<Omit<TaskAssignmentConnection, 'nodes'> & { nodes: Array<ResolversTypes['TaskAssignment']> }>;
  TaskAssignmentFilterInput: TaskAssignmentFilterInput;
  TaskAssignmentMetrics: ResolverTypeWrapper<Omit<TaskAssignmentMetrics, 'assignment'> & { assignment: ResolversTypes['TaskAssignment'] }>;
  TaskAssignmentPaginationInput: TaskAssignmentPaginationInput;
  TaskAssignmentSortField: TaskAssignmentSortField;
  TaskAssignmentSortInput: TaskAssignmentSortInput;
  TaskPriority: TaskPriority;
  TaskStatus: TaskStatus;
  TaskStatusChangeEvent: ResolverTypeWrapper<Omit<TaskStatusChangeEvent, 'assignment'> & { assignment: ResolversTypes['TaskAssignment'] }>;
  TaskStatusCount: ResolverTypeWrapper<TaskStatusCount>;
  TaskType: TaskType;
  TaskTypeCount: ResolverTypeWrapper<TaskTypeCount>;
  TrendDirection: TrendDirection;
  UpdateActorInput: UpdateActorInput;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateDepartmentInput: UpdateDepartmentInput;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateGapAnalysisInput: UpdateGapAnalysisInput;
  UpdateGradeInput: UpdateGradeInput;
  UpdateHiringPlanInput: UpdateHiringPlanInput;
  UpdatePermissionInput: UpdatePermissionInput;
  UpdateProcessInput: UpdateProcessInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateTaskAssignmentInput: UpdateTaskAssignmentInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<UserModel>;
  UserAccessSummary: ResolverTypeWrapper<Omit<UserAccessSummary, 'user'> & { user: ResolversTypes['User'] }>;
  UserActivitySummary: ResolverTypeWrapper<Omit<UserActivitySummary, 'recentActions' | 'user'> & { recentActions: Array<ResolversTypes['AuditLog']>, user: ResolversTypes['User'] }>;
  UserRole: UserRole;
  UserStatus: UserStatus;
  UsersInput: UsersInput;
  UsersResult: ResolverTypeWrapper<Omit<UsersResult, 'users'> & { users: Array<ResolversTypes['User']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActionTypeSummary: ActionTypeSummary;
  Actor: ActorModel;
  ActorConnection: Omit<ActorConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Actor']> };
  ActorFilterInput: ActorFilterInput;
  ActorPaginationInput: ActorPaginationInput;
  ActorPermission: ActorPermissionModel;
  ActorRole: ActorRoleModel;
  AuditLog: AuditLogModel;
  AuditLogConnection: Omit<AuditLogConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['AuditLog']> };
  AuditLogFilterInput: AuditLogFilterInput;
  AuditLogPaginationInput: AuditLogPaginationInput;
  AuditLogSortInput: AuditLogSortInput;
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  ChangeByUser: Omit<ChangeByUser, 'user'> & { user: ResolversParentTypes['User'] };
  ChangeTypeSummary: ChangeTypeSummary;
  Company: CompanyModel;
  CompanyLoadAnalysis: Omit<CompanyLoadAnalysis, 'company' | 'departmentMetrics'> & { company: ResolversParentTypes['Company'], departmentMetrics: Array<ResolversParentTypes['DepartmentLoadOverview']> };
  ComplianceReport: Omit<ComplianceReport, 'company' | 'highRiskActivities' | 'userAccessSummary'> & { company: ResolversParentTypes['Company'], highRiskActivities: Array<ResolversParentTypes['AuditLog']>, userAccessSummary: Array<ResolversParentTypes['UserAccessSummary']> };
  CreateActorInput: CreateActorInput;
  CreateCompanyInput: CreateCompanyInput;
  CreateDepartmentInput: CreateDepartmentInput;
  CreateEmployeeInput: CreateEmployeeInput;
  CreateGapAnalysisInput: CreateGapAnalysisInput;
  CreateGradeInput: CreateGradeInput;
  CreatePermissionInput: CreatePermissionInput;
  CreateProcessInput: CreateProcessInput;
  CreateRoleInput: CreateRoleInput;
  CreateTaskAssignmentInput: CreateTaskAssignmentInput;
  DateRange: DateRange;
  DateRangeInput: DateRangeInput;
  DateTime: Scalars['DateTime']['output'];
  Department: DepartmentModel;
  DepartmentConnection: Omit<DepartmentConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Department']> };
  DepartmentEmployeeHistory: Omit<DepartmentEmployeeHistory, 'department' | 'timeline'> & { department: ResolversParentTypes['Department'], timeline: Array<ResolversParentTypes['EmployeeTimelineEntry']> };
  DepartmentFilterInput: DepartmentFilterInput;
  DepartmentGapComparison: Omit<DepartmentGapComparison, 'department' | 'gapAnalysis'> & { department: ResolversParentTypes['Department'], gapAnalysis?: Maybe<ResolversParentTypes['GapAnalysis']> };
  DepartmentLoadOverview: Omit<DepartmentLoadOverview, 'department' | 'employeeBreakdown'> & { department: ResolversParentTypes['Department'], employeeBreakdown: Array<ResolversParentTypes['EmployeeLoadBreakdown']> };
  DepartmentMetrics: Omit<DepartmentMetrics, 'department'> & { department: ResolversParentTypes['Department'] };
  Employee: EmployeeModel;
  EmployeeAuditReport: Omit<EmployeeAuditReport, 'capacityChanges' | 'efficiencyChanges' | 'employee' | 'statusChanges' | 'timeline'> & { capacityChanges: Array<ResolversParentTypes['EmployeeHistory']>, efficiencyChanges: Array<ResolversParentTypes['EmployeeHistory']>, employee: ResolversParentTypes['Employee'], statusChanges: Array<ResolversParentTypes['EmployeeHistory']>, timeline: Array<ResolversParentTypes['EmployeeTimelineEntry']> };
  EmployeeConnection: Omit<EmployeeConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Employee']> };
  EmployeeFilterInput: EmployeeFilterInput;
  EmployeeHistory: EmployeeHistoryModel;
  EmployeeHistoryConnection: Omit<EmployeeHistoryConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['EmployeeHistory']> };
  EmployeeHistoryFilterInput: EmployeeHistoryFilterInput;
  EmployeeHistoryPaginationInput: EmployeeHistoryPaginationInput;
  EmployeeHistorySortInput: EmployeeHistorySortInput;
  EmployeeLoadBreakdown: Omit<EmployeeLoadBreakdown, 'employee'> & { employee: ResolversParentTypes['Employee'] };
  EmployeeLoadHistory: Omit<EmployeeLoadHistory, 'employee' | 'snapshots'> & { employee: ResolversParentTypes['Employee'], snapshots: Array<ResolversParentTypes['LoadSnapshot']> };
  EmployeePaginationInput: EmployeePaginationInput;
  EmployeeStatusChangeEvent: Omit<EmployeeStatusChangeEvent, 'history'> & { history: ResolversParentTypes['EmployeeHistory'] };
  EmployeeTaskStats: Omit<EmployeeTaskStats, 'employee'> & { employee: ResolversParentTypes['Employee'] };
  EmployeeTimelineEntry: Omit<EmployeeTimelineEntry, 'event'> & { event: ResolversParentTypes['EmployeeHistory'] };
  EntityAuditTrail: Omit<EntityAuditTrail, 'changesByUser' | 'timeline'> & { changesByUser: Array<ResolversParentTypes['ChangeByUser']>, timeline: Array<ResolversParentTypes['AuditLog']> };
  Error: Error;
  Float: Scalars['Float']['output'];
  GapAnalysis: GapAnalysisResultModel;
  GapAnalysisConnection: Omit<GapAnalysisConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['GapAnalysis']> };
  GapAnalysisFilterInput: GapAnalysisFilterInput;
  GapAnalysisPaginationInput: GapAnalysisPaginationInput;
  GapAnalysisRecommendation: GapAnalysisRecommendation;
  GapAnalysisSortInput: GapAnalysisSortInput;
  GapCriticalityAssessment: Omit<GapCriticalityAssessment, 'criticalDepartments'> & { criticalDepartments: Array<ResolversParentTypes['DepartmentGapComparison']> };
  GapThresholdEvent: Omit<GapThresholdEvent, 'analysis'> & { analysis: ResolversParentTypes['GapAnalysis'] };
  GapTrend: GapTrend;
  Grade: GradeModel;
  GradeStats: Omit<GradeStats, 'grade'> & { grade: ResolversParentTypes['Grade'] };
  HiringForecast: Omit<HiringForecast, 'gapAnalysis'> & { gapAnalysis: ResolversParentTypes['GapAnalysis'] };
  HiringPhase: HiringPhase;
  HiringPlan: Omit<HiringPlan, 'talentCategories'> & { talentCategories: Array<ResolversParentTypes['TalentCategory']> };
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  LoadAnalysisMetrics: LoadAnalysisMetrics;
  LoadRecommendation: LoadRecommendation;
  LoadSnapshot: LoadSnapshotModel;
  LoadSnapshotConnection: Omit<LoadSnapshotConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['LoadSnapshot']> };
  LoadSnapshotFilterInput: LoadSnapshotFilterInput;
  LoadSnapshotPaginationInput: LoadSnapshotPaginationInput;
  LoadSnapshotSortInput: LoadSnapshotSortInput;
  LoadThresholdEvent: Omit<LoadThresholdEvent, 'snapshot'> & { snapshot: ResolversParentTypes['LoadSnapshot'] };
  LoadTrendPoint: LoadTrendPoint;
  LogAuditEntryInput: LogAuditEntryInput;
  Mutation: Record<PropertyKey, never>;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  Permission: PermissionModel;
  PermissionConnection: Omit<PermissionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Permission']> };
  PermissionFilterInput: PermissionFilterInput;
  PermissionPaginationInput: PermissionPaginationInput;
  Process: ProcessModel;
  ProcessConnection: Omit<ProcessConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Process']> };
  ProcessFilterInput: ProcessFilterInput;
  ProcessMetrics: Omit<ProcessMetrics, 'process'> & { process: ResolversParentTypes['Process'] };
  ProcessPaginationInput: ProcessPaginationInput;
  ProcessSortInput: ProcessSortInput;
  ProcessStatusChangeEvent: Omit<ProcessStatusChangeEvent, 'process'> & { process: ResolversParentTypes['Process'] };
  QuarterlyProjection: QuarterlyProjection;
  Query: Record<PropertyKey, never>;
  RecordEmployeeHistoryInput: RecordEmployeeHistoryInput;
  RiskActivityEvent: Omit<RiskActivityEvent, 'log'> & { log: ResolversParentTypes['AuditLog'] };
  Role: RoleModel;
  RoleConnection: Omit<RoleConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Role']> };
  RoleFilterInput: RoleFilterInput;
  RolePaginationInput: RolePaginationInput;
  RolePermission: RolePermissionModel;
  SecurityIncident: Omit<SecurityIncident, 'involvedLogs'> & { involvedLogs: Array<ResolversParentTypes['AuditLog']> };
  SecurityIncidentEvent: Omit<SecurityIncidentEvent, 'incident'> & { incident: ResolversParentTypes['SecurityIncident'] };
  SecurityIncidentReport: Omit<SecurityIncidentReport, 'company' | 'incidents'> & { company: ResolversParentTypes['Company'], incidents: Array<ResolversParentTypes['SecurityIncident']> };
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
  TalentCategory: Omit<TalentCategory, 'grade'> & { grade: ResolversParentTypes['Grade'] };
  TaskAssignment: TaskAssignmentModel;
  TaskAssignmentConnection: Omit<TaskAssignmentConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['TaskAssignment']> };
  TaskAssignmentFilterInput: TaskAssignmentFilterInput;
  TaskAssignmentMetrics: Omit<TaskAssignmentMetrics, 'assignment'> & { assignment: ResolversParentTypes['TaskAssignment'] };
  TaskAssignmentPaginationInput: TaskAssignmentPaginationInput;
  TaskAssignmentSortInput: TaskAssignmentSortInput;
  TaskStatusChangeEvent: Omit<TaskStatusChangeEvent, 'assignment'> & { assignment: ResolversParentTypes['TaskAssignment'] };
  TaskStatusCount: TaskStatusCount;
  TaskTypeCount: TaskTypeCount;
  UpdateActorInput: UpdateActorInput;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateDepartmentInput: UpdateDepartmentInput;
  UpdateEmployeeInput: UpdateEmployeeInput;
  UpdateGapAnalysisInput: UpdateGapAnalysisInput;
  UpdateGradeInput: UpdateGradeInput;
  UpdateHiringPlanInput: UpdateHiringPlanInput;
  UpdatePermissionInput: UpdatePermissionInput;
  UpdateProcessInput: UpdateProcessInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateTaskAssignmentInput: UpdateTaskAssignmentInput;
  Upload: Scalars['Upload']['output'];
  User: UserModel;
  UserAccessSummary: Omit<UserAccessSummary, 'user'> & { user: ResolversParentTypes['User'] };
  UserActivitySummary: Omit<UserActivitySummary, 'recentActions' | 'user'> & { recentActions: Array<ResolversParentTypes['AuditLog']>, user: ResolversParentTypes['User'] };
  UsersInput: UsersInput;
  UsersResult: Omit<UsersResult, 'users'> & { users: Array<ResolversParentTypes['User']> };
};

export type ActionTypeSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActionTypeSummary'] = ResolversParentTypes['ActionTypeSummary']> = {
  actionType?: Resolver<ResolversTypes['AuditActionType'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  failureCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ActorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Actor'] = ResolversParentTypes['Actor']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  departmentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActivityAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lastLoginAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['ActorPermission']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['ActorRole']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ActorStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActorConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActorConnection'] = ResolversParentTypes['ActorConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Actor']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ActorPermissionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActorPermission'] = ResolversParentTypes['ActorPermission']> = {
  actor?: Resolver<ResolversTypes['Actor'], ParentType, ContextType>;
  actorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  grant?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  permissionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActorRoleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActorRole'] = ResolversParentTypes['ActorRole']> = {
  actor?: Resolver<ResolversTypes['Actor'], ParentType, ContextType>;
  actorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  roleId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuditLogResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditLog'] = ResolversParentTypes['AuditLog']> = {
  actionType?: Resolver<ResolversTypes['AuditActionType'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  departmentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  durationMs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ipAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  newValues?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  oldValues?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  result?: Resolver<ResolversTypes['AuditResult'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['AuditStatus'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userAgent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AuditLogConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditLogConnection'] = ResolversParentTypes['AuditLogConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type ChangeByUserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChangeByUser'] = ResolversParentTypes['ChangeByUser']> = {
  changeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type ChangeTypeSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChangeTypeSummary'] = ResolversParentTypes['ChangeTypeSummary']> = {
  changeType?: Resolver<ResolversTypes['EmployeeChangeType'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastChanged?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  departments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Department']>>>, ParentType, ContextType>;
  employees?: Resolver<Maybe<Array<Maybe<ResolversTypes['Employee']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  loadSnapshots?: Resolver<Maybe<Array<Maybe<ResolversTypes['LoadSnapshot']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  processes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Process']>>>, ParentType, ContextType>;
  taskAssignments?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaskAssignment']>>>, ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  workingDaysPerMonth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  workingHoursDay?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type CompanyLoadAnalysisResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CompanyLoadAnalysis'] = ResolversParentTypes['CompanyLoadAnalysis']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  departmentMetrics?: Resolver<Array<ResolversTypes['DepartmentLoadOverview']>, ParentType, ContextType>;
  metrics?: Resolver<ResolversTypes['LoadAnalysisMetrics'], ParentType, ContextType>;
  recommendations?: Resolver<Array<ResolversTypes['LoadRecommendation']>, ParentType, ContextType>;
  snapshotDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  totalEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ComplianceReportResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ComplianceReport'] = ResolversParentTypes['ComplianceReport']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  complianceRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  dataExportCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  highRiskActivities?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType>;
  reportPeriod?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  sensitiveDataAccess?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  suspiciousPatterns?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  totalAuditedActions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unauthorizedAccessAttempts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userAccessSummary?: Resolver<Array<ResolversTypes['UserAccessSummary']>, ParentType, ContextType>;
};

export type DateRangeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DateRange'] = ResolversParentTypes['DateRange']> = {
  from?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DepartmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Department'] = ResolversParentTypes['Department']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  employees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
  head?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
  headId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  loadSnapshots?: Resolver<Array<ResolversTypes['LoadSnapshot']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  processes?: Resolver<Array<ResolversTypes['Process']>, ParentType, ContextType>;
  taskAssignments?: Resolver<Array<ResolversTypes['TaskAssignment']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type DepartmentConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DepartmentConnection'] = ResolversParentTypes['DepartmentConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Department']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type DepartmentEmployeeHistoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DepartmentEmployeeHistory'] = ResolversParentTypes['DepartmentEmployeeHistory']> = {
  capacityAdded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  capacityLost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  demotions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  departures?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  netCapacityChange?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  newHires?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  promotions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reportPeriod?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  timeline?: Resolver<Array<ResolversTypes['EmployeeTimelineEntry']>, ParentType, ContextType>;
  transfers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type DepartmentGapComparisonResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DepartmentGapComparison'] = ResolversParentTypes['DepartmentGapComparison']> = {
  capacityGap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comparedToCompanyAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  gapAnalysis?: Resolver<Maybe<ResolversTypes['GapAnalysis']>, ParentType, ContextType>;
  gapStatus?: Resolver<ResolversTypes['GapStatus'], ParentType, ContextType>;
  headcountGap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  riskLevel?: Resolver<ResolversTypes['GapAnalysisRiskLevel'], ParentType, ContextType>;
};

export type DepartmentLoadOverviewResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DepartmentLoadOverview'] = ResolversParentTypes['DepartmentLoadOverview']> = {
  averageLoadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  averageUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  employeeBreakdown?: Resolver<Array<ResolversTypes['EmployeeLoadBreakdown']>, ParentType, ContextType>;
  overloadedEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  riskLevel?: Resolver<ResolversTypes['LoadRiskLevel'], ParentType, ContextType>;
  totalEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type DepartmentMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DepartmentMetrics'] = ResolversParentTypes['DepartmentMetrics']> = {
  activeEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  loadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  overloadedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalCapacity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalLoad?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type EmployeeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Employee'] = ResolversParentTypes['Employee']> = {
  birthDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  departmentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fireDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  grade?: Resolver<ResolversTypes['Grade'], ParentType, ContextType>;
  gradeId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hireDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  history?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmployeeHistory']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kEfficiency?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  loadSnapshots?: Resolver<Maybe<Array<Maybe<ResolversTypes['LoadSnapshot']>>>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taskAssignments?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaskAssignment']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  workingHoursPerDay?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type EmployeeAuditReportResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeAuditReport'] = ResolversParentTypes['EmployeeAuditReport']> = {
  capacityChanges?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType>;
  changesByType?: Resolver<Array<ResolversTypes['ChangeTypeSummary']>, ParentType, ContextType>;
  efficiencyChanges?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType>;
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  reportPeriod?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  statusChanges?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType>;
  timeline?: Resolver<Array<ResolversTypes['EmployeeTimelineEntry']>, ParentType, ContextType>;
  totalChanges?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type EmployeeConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeConnection'] = ResolversParentTypes['EmployeeConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type EmployeeHistoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeHistory'] = ResolversParentTypes['EmployeeHistory']> = {
  approvedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  approvedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  capacityImpact?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  changeType?: Resolver<ResolversTypes['EmployeeChangeType'], ParentType, ContextType>;
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  changedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changedField?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromStatus?: Resolver<Maybe<ResolversTypes['EmploymentStatus']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  loadImpact?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  newValue?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  previousValue?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  toStatus?: Resolver<Maybe<ResolversTypes['EmploymentStatus']>, ParentType, ContextType>;
};

export type EmployeeHistoryConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeHistoryConnection'] = ResolversParentTypes['EmployeeHistoryConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type EmployeeLoadBreakdownResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeLoadBreakdown'] = ResolversParentTypes['EmployeeLoadBreakdown']> = {
  allocatedCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  loadStatus?: Resolver<ResolversTypes['LoadStatus'], ParentType, ContextType>;
  utilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type EmployeeLoadHistoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeLoadHistory'] = ResolversParentTypes['EmployeeLoadHistory']> = {
  averageLoadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  averageUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  isIncreasing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  snapshots?: Resolver<Array<ResolversTypes['LoadSnapshot']>, ParentType, ContextType>;
  trend?: Resolver<Array<ResolversTypes['LoadTrendPoint']>, ParentType, ContextType>;
  trendDirection?: Resolver<ResolversTypes['TrendDirection'], ParentType, ContextType>;
};

export type EmployeeStatusChangeEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeStatusChangeEvent'] = ResolversParentTypes['EmployeeStatusChangeEvent']> = {
  employeeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  history?: Resolver<ResolversTypes['EmployeeHistory'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type EmployeeTaskStatsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeTaskStats'] = ResolversParentTypes['EmployeeTaskStats']> = {
  activeAssignments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  averagePriority?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockedAssignments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedAssignments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  tasksByStatus?: Resolver<Array<ResolversTypes['TaskStatusCount']>, ParentType, ContextType>;
  tasksByType?: Resolver<Array<ResolversTypes['TaskTypeCount']>, ParentType, ContextType>;
  totalAllocatedCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalAssignments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type EmployeeTimelineEntryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeTimelineEntry'] = ResolversParentTypes['EmployeeTimelineEntry']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  event?: Resolver<ResolversTypes['EmployeeHistory'], ParentType, ContextType>;
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type EntityAuditTrailResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EntityAuditTrail'] = ResolversParentTypes['EntityAuditTrail']> = {
  changesByUser?: Resolver<Array<ResolversTypes['ChangeByUser']>, ParentType, ContextType>;
  currentState?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previousState?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  timeline?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType>;
  totalChanges?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extensions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type GapAnalysisResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GapAnalysis'] = ResolversParentTypes['GapAnalysis']> = {
  analysisDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  capacityGap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  confidenceLevel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentEmployeeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  currentTotalCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  currentUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  departmentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  forecastAccuracy?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  forecastPeriodMonths?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  forecastedWorkloadUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gapStatus?: Resolver<ResolversTypes['GapStatus'], ParentType, ContextType>;
  headcountGap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hiringPlan?: Resolver<Maybe<ResolversTypes['HiringPlan']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recommendations?: Resolver<Array<ResolversTypes['GapAnalysisRecommendation']>, ParentType, ContextType>;
  requiredEmployeeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  requiredTotalCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  riskLevel?: Resolver<ResolversTypes['GapAnalysisRiskLevel'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type GapAnalysisConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GapAnalysisConnection'] = ResolversParentTypes['GapAnalysisConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['GapAnalysis']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type GapAnalysisRecommendationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GapAnalysisRecommendation'] = ResolversParentTypes['GapAnalysisRecommendation']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estimatedCost?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  estimatedTimeframe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expectedOutcome?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  implementationSteps?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['RecommendationPriority'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RecommendationType'], ParentType, ContextType>;
};

export type GapCriticalityAssessmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GapCriticalityAssessment'] = ResolversParentTypes['GapCriticalityAssessment']> = {
  criticalDepartments?: Resolver<Array<ResolversTypes['DepartmentGapComparison']>, ParentType, ContextType>;
  estimatedTimeToFillGap?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recommendedImmediateActions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  timelinessOfAction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type GapThresholdEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GapThresholdEvent'] = ResolversParentTypes['GapThresholdEvent']> = {
  analysis?: Resolver<ResolversTypes['GapAnalysis'], ParentType, ContextType>;
  newStatus?: Resolver<ResolversTypes['GapStatus'], ParentType, ContextType>;
  previousStatus?: Resolver<ResolversTypes['GapStatus'], ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type GapTrendResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GapTrend'] = ResolversParentTypes['GapTrend']> = {
  analysisDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  capacityGap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gapStatus?: Resolver<ResolversTypes['GapStatus'], ParentType, ContextType>;
  headcountGap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  riskLevel?: Resolver<ResolversTypes['GapAnalysisRiskLevel'], ParentType, ContextType>;
};

export type GradeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Grade'] = ResolversParentTypes['Grade']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  kGrade?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  processes?: Resolver<Array<ResolversTypes['Process']>, ParentType, ContextType>;
};

export type GradeStatsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GradeStats'] = ResolversParentTypes['GradeStats']> = {
  averageEfficiency?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  employeeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  grade?: Resolver<ResolversTypes['Grade'], ParentType, ContextType>;
  overloadedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type HiringForecastResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HiringForecast'] = ResolversParentTypes['HiringForecast']> = {
  averageMonthlyHiringRate?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gapAnalysis?: Resolver<ResolversTypes['GapAnalysis'], ParentType, ContextType>;
  quarterlyProjections?: Resolver<Array<ResolversTypes['QuarterlyProjection']>, ParentType, ContextType>;
  riskFactors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  totalEstimatedHires?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type HiringPhaseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HiringPhase'] = ResolversParentTypes['HiringPhase']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['HiringPhaseStatus'], ParentType, ContextType>;
  talentGrades?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  targetCompletionDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  targetHeadcount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type HiringPlanResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HiringPlan'] = ResolversParentTypes['HiringPlan']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  estimatedCostPerHire?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gapAnalysisId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hiringPhases?: Resolver<Array<ResolversTypes['HiringPhase']>, ParentType, ContextType>;
  hiringStartDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progressPercentage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['HiringPlanStatus'], ParentType, ContextType>;
  talentCategories?: Resolver<Array<ResolversTypes['TalentCategory']>, ParentType, ContextType>;
  targetCompletionDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  targetHeadcount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalEstimatedCost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LoadAnalysisMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoadAnalysisMetrics'] = ResolversParentTypes['LoadAnalysisMetrics']> = {
  averageUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  employeesOptimal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  employeesOverloaded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  employeesUnderutilized?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  maximumUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  medianUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minimumUtilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percentileP90?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percentileP95?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  standardDeviation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type LoadRecommendationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoadRecommendation'] = ResolversParentTypes['LoadRecommendation']> = {
  affectedEmployees?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estimatedImpact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['RecommendationPriority'], ParentType, ContextType>;
  suggestedActions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RecommendationType'], ParentType, ContextType>;
};

export type LoadSnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoadSnapshot'] = ResolversParentTypes['LoadSnapshot']> = {
  allocatedCapacityUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  availableCapacityUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  calculatedLoad?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companyLoadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  departmentLoadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  employee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kGrade?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  loadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  loadStatus?: Resolver<ResolversTypes['LoadStatus'], ParentType, ContextType>;
  process?: Resolver<Maybe<ResolversTypes['Process']>, ParentType, ContextType>;
  snapshotDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  snapshotType?: Resolver<ResolversTypes['SnapshotType'], ParentType, ContextType>;
  sourceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskAssignment?: Resolver<Maybe<ResolversTypes['TaskAssignment']>, ParentType, ContextType>;
  totalCapacityUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  utilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type LoadSnapshotConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoadSnapshotConnection'] = ResolversParentTypes['LoadSnapshotConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['LoadSnapshot']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type LoadThresholdEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoadThresholdEvent'] = ResolversParentTypes['LoadThresholdEvent']> = {
  crossedDirection?: Resolver<ResolversTypes['CrossDirection'], ParentType, ContextType>;
  snapshot?: Resolver<ResolversTypes['LoadSnapshot'], ParentType, ContextType>;
  threshold?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type LoadTrendPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoadTrendPoint'] = ResolversParentTypes['LoadTrendPoint']> = {
  allocatedCapacityUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  loadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  loadStatus?: Resolver<ResolversTypes['LoadStatus'], ParentType, ContextType>;
  snapshotDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  utilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _placeholder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approveEmployeeHistory?: Resolver<ResolversTypes['EmployeeHistory'], ParentType, ContextType, RequireFields<MutationApproveEmployeeHistoryArgs, 'id'>>;
  approveHiringPlan?: Resolver<ResolversTypes['HiringPlan'], ParentType, ContextType, RequireFields<MutationApproveHiringPlanArgs, 'approvedBy' | 'id'>>;
  archiveAuditLogs?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationArchiveAuditLogsArgs, 'dateRange'>>;
  assignActorRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAssignActorRoleArgs, 'actorId' | 'roleId'>>;
  assignDepartmentHead?: Resolver<ResolversTypes['Department'], ParentType, ContextType, RequireFields<MutationAssignDepartmentHeadArgs, 'departmentId' | 'employeeId'>>;
  assignProcessCapacity?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<MutationAssignProcessCapacityArgs, 'capacityUnits' | 'kMultiplier' | 'processId'>>;
  assignRolePermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAssignRolePermissionArgs, 'permissionId' | 'roleId'>>;
  blockTaskAssignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationBlockTaskAssignmentArgs, 'id' | 'reason'>>;
  bulkLogAuditEntries?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType, RequireFields<MutationBulkLogAuditEntriesArgs, 'entries'>>;
  cancelProcess?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<MutationCancelProcessArgs, 'id'>>;
  completeProcess?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<MutationCompleteProcessArgs, 'id'>>;
  completeTaskAssignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationCompleteTaskAssignmentArgs, 'id'>>;
  createActor?: Resolver<ResolversTypes['Actor'], ParentType, ContextType, RequireFields<MutationCreateActorArgs, 'input'>>;
  createCompany?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<MutationCreateCompanyArgs, 'input'>>;
  createCompanyLoadSnapshots?: Resolver<Array<ResolversTypes['LoadSnapshot']>, ParentType, ContextType, RequireFields<MutationCreateCompanyLoadSnapshotsArgs, 'companyId'>>;
  createDepartment?: Resolver<ResolversTypes['Department'], ParentType, ContextType, RequireFields<MutationCreateDepartmentArgs, 'input'>>;
  createEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationCreateEmployeeArgs, 'input'>>;
  createGapAnalysis?: Resolver<ResolversTypes['GapAnalysis'], ParentType, ContextType, RequireFields<MutationCreateGapAnalysisArgs, 'input'>>;
  createGrade?: Resolver<ResolversTypes['Grade'], ParentType, ContextType, RequireFields<MutationCreateGradeArgs, 'input'>>;
  createLoadSnapshot?: Resolver<ResolversTypes['LoadSnapshot'], ParentType, ContextType, RequireFields<MutationCreateLoadSnapshotArgs, 'employeeId' | 'snapshotType'>>;
  createPermission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType, RequireFields<MutationCreatePermissionArgs, 'input'>>;
  createProcess?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<MutationCreateProcessArgs, 'input'>>;
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'input'>>;
  createTaskAssignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationCreateTaskAssignmentArgs, 'input'>>;
  deactivateActor?: Resolver<ResolversTypes['Actor'], ParentType, ContextType, RequireFields<MutationDeactivateActorArgs, 'id'>>;
  deleteDepartment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDepartmentArgs, 'id'>>;
  deleteGrade?: Resolver<ResolversTypes['Grade'], ParentType, ContextType, RequireFields<MutationDeleteGradeArgs, 'id'>>;
  deletePermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePermissionArgs, 'id'>>;
  deleteProcess?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProcessArgs, 'id'>>;
  deleteRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteTaskAssignment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTaskAssignmentArgs, 'id'>>;
  denyActorPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDenyActorPermissionArgs, 'actorId' | 'permissionId'>>;
  dismissEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationDismissEmployeeArgs, 'id'>>;
  exportAuditLogs?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationExportAuditLogsArgs, 'filter' | 'format'>>;
  generateHiringPlan?: Resolver<ResolversTypes['HiringPlan'], ParentType, ContextType, RequireFields<MutationGenerateHiringPlanArgs, 'gapAnalysisId'>>;
  grantActorPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationGrantActorPermissionArgs, 'actorId' | 'permissionId'>>;
  logAuditEntry?: Resolver<ResolversTypes['AuditLog'], ParentType, ContextType, RequireFields<MutationLogAuditEntryArgs, 'input'>>;
  reassignTask?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationReassignTaskArgs, 'newEmployeeId' | 'taskId'>>;
  recordEmployeeHistory?: Resolver<ResolversTypes['EmployeeHistory'], ParentType, ContextType, RequireFields<MutationRecordEmployeeHistoryArgs, 'input'>>;
  rejectEmployeeHistory?: Resolver<ResolversTypes['EmployeeHistory'], ParentType, ContextType, RequireFields<MutationRejectEmployeeHistoryArgs, 'id' | 'rejectionReason'>>;
  removeActorRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveActorRoleArgs, 'actorId' | 'roleId'>>;
  removeRolePermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveRolePermissionArgs, 'permissionId' | 'roleId'>>;
  revokeActorPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRevokeActorPermissionArgs, 'actorId' | 'permissionId'>>;
  startProcess?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<MutationStartProcessArgs, 'id'>>;
  startTaskAssignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationStartTaskAssignmentArgs, 'id'>>;
  suspendActor?: Resolver<ResolversTypes['Actor'], ParentType, ContextType, RequireFields<MutationSuspendActorArgs, 'id'>>;
  unblockTaskAssignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationUnblockTaskAssignmentArgs, 'id'>>;
  updateActor?: Resolver<ResolversTypes['Actor'], ParentType, ContextType, RequireFields<MutationUpdateActorArgs, 'id' | 'input'>>;
  updateCompany?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<MutationUpdateCompanyArgs, 'id' | 'input'>>;
  updateDepartment?: Resolver<ResolversTypes['Department'], ParentType, ContextType, RequireFields<MutationUpdateDepartmentArgs, 'id' | 'input'>>;
  updateEmployee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationUpdateEmployeeArgs, 'id' | 'input'>>;
  updateEmployeeEfficiency?: Resolver<ResolversTypes['Employee'], ParentType, ContextType, RequireFields<MutationUpdateEmployeeEfficiencyArgs, 'id' | 'kEfficiency'>>;
  updateGapAnalysis?: Resolver<ResolversTypes['GapAnalysis'], ParentType, ContextType, RequireFields<MutationUpdateGapAnalysisArgs, 'id' | 'input'>>;
  updateGrade?: Resolver<ResolversTypes['Grade'], ParentType, ContextType, RequireFields<MutationUpdateGradeArgs, 'id' | 'input'>>;
  updateHiringPlan?: Resolver<ResolversTypes['HiringPlan'], ParentType, ContextType, RequireFields<MutationUpdateHiringPlanArgs, 'id' | 'input'>>;
  updateHiringProgress?: Resolver<ResolversTypes['HiringPlan'], ParentType, ContextType, RequireFields<MutationUpdateHiringProgressArgs, 'actualHires' | 'hiringPlanId'>>;
  updatePermission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType, RequireFields<MutationUpdatePermissionArgs, 'id' | 'input'>>;
  updateProcess?: Resolver<ResolversTypes['Process'], ParentType, ContextType, RequireFields<MutationUpdateProcessArgs, 'id' | 'input'>>;
  updateRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'id' | 'input'>>;
  updateTaskAssignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationUpdateTaskAssignmentArgs, 'id' | 'input'>>;
  updateTaskProgress?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType, RequireFields<MutationUpdateTaskProgressArgs, 'completionPercentage' | 'id'>>;
};

export type NodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Actor' | 'ActorPermission' | 'ActorRole' | 'Permission' | 'Role' | 'RolePermission' | 'User', ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type PermissionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = {
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resource?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scope?: Resolver<ResolversTypes['PermissionScope'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PermissionConnection'] = ResolversParentTypes['PermissionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ProcessResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Process'] = ResolversParentTypes['Process']> = {
  capacityUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  departmentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedDurationDays?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kMultiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  loadSnapshots?: Resolver<Maybe<Array<Maybe<ResolversTypes['LoadSnapshot']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['ProcessPriority'], ParentType, ContextType>;
  processType?: Resolver<ResolversTypes['ProcessType'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProcessStatus'], ParentType, ContextType>;
  taskAssignments?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaskAssignment']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ProcessConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProcessConnection'] = ResolversParentTypes['ProcessConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Process']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ProcessMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProcessMetrics'] = ResolversParentTypes['ProcessMetrics']> = {
  activeTaskCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  averageResourcesAllocated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  process?: Resolver<ResolversTypes['Process'], ParentType, ContextType>;
  taskCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalCapacityRequired?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  utilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type ProcessStatusChangeEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProcessStatusChangeEvent'] = ResolversParentTypes['ProcessStatusChangeEvent']> = {
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  changedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  newStatus?: Resolver<ResolversTypes['ProcessStatus'], ParentType, ContextType>;
  previousStatus?: Resolver<ResolversTypes['ProcessStatus'], ParentType, ContextType>;
  process?: Resolver<ResolversTypes['Process'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type QuarterlyProjectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QuarterlyProjection'] = ResolversParentTypes['QuarterlyProjection']> = {
  estimatedCost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  projectedHires?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quarter?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetTalentGrades?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  actor?: Resolver<Maybe<ResolversTypes['Actor']>, ParentType, ContextType, RequireFields<QueryActorArgs, 'id'>>;
  actors?: Resolver<ResolversTypes['ActorConnection'], ParentType, ContextType, Partial<QueryActorsArgs>>;
  auditLog?: Resolver<Maybe<ResolversTypes['AuditLog']>, ParentType, ContextType, RequireFields<QueryAuditLogArgs, 'id'>>;
  auditLogs?: Resolver<ResolversTypes['AuditLogConnection'], ParentType, ContextType, RequireFields<QueryAuditLogsArgs, 'filter'>>;
  blockedTasks?: Resolver<Array<ResolversTypes['TaskAssignment']>, ParentType, ContextType, Partial<QueryBlockedTasksArgs>>;
  changesBy?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType, RequireFields<QueryChangesByArgs, 'userId'>>;
  companies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Company']>>>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryCompanyArgs, 'id'>>;
  companyActors?: Resolver<ResolversTypes['ActorConnection'], ParentType, ContextType, RequireFields<QueryCompanyActorsArgs, 'companyId'>>;
  companyLoadAnalysis?: Resolver<ResolversTypes['CompanyLoadAnalysis'], ParentType, ContextType, RequireFields<QueryCompanyLoadAnalysisArgs, 'companyId'>>;
  companyProcessMetrics?: Resolver<Array<ResolversTypes['ProcessMetrics']>, ParentType, ContextType, RequireFields<QueryCompanyProcessMetricsArgs, 'companyId'>>;
  complianceReport?: Resolver<ResolversTypes['ComplianceReport'], ParentType, ContextType, RequireFields<QueryComplianceReportArgs, 'companyId' | 'dateRange'>>;
  dataAccessAudit?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType, RequireFields<QueryDataAccessAuditArgs, 'companyId'>>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType, RequireFields<QueryDepartmentArgs, 'id'>>;
  departmentActors?: Resolver<ResolversTypes['ActorConnection'], ParentType, ContextType, RequireFields<QueryDepartmentActorsArgs, 'departmentId'>>;
  departmentEmployeeHistory?: Resolver<ResolversTypes['DepartmentEmployeeHistory'], ParentType, ContextType, RequireFields<QueryDepartmentEmployeeHistoryArgs, 'dateRange' | 'departmentId'>>;
  departmentEmployees?: Resolver<Array<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryDepartmentEmployeesArgs, 'departmentId'>>;
  departmentGapComparison?: Resolver<Array<ResolversTypes['DepartmentGapComparison']>, ParentType, ContextType, RequireFields<QueryDepartmentGapComparisonArgs, 'companyId'>>;
  departmentLoadOverview?: Resolver<ResolversTypes['DepartmentLoadOverview'], ParentType, ContextType, RequireFields<QueryDepartmentLoadOverviewArgs, 'departmentId'>>;
  departmentProcesses?: Resolver<Array<ResolversTypes['Process']>, ParentType, ContextType, RequireFields<QueryDepartmentProcessesArgs, 'departmentId'>>;
  departmentSnapshots?: Resolver<Array<ResolversTypes['LoadSnapshot']>, ParentType, ContextType, RequireFields<QueryDepartmentSnapshotsArgs, 'departmentId'>>;
  departmentWithMetrics?: Resolver<Maybe<ResolversTypes['DepartmentMetrics']>, ParentType, ContextType, RequireFields<QueryDepartmentWithMetricsArgs, 'id'>>;
  departments?: Resolver<ResolversTypes['DepartmentConnection'], ParentType, ContextType, RequireFields<QueryDepartmentsArgs, 'filter'>>;
  employee?: Resolver<Maybe<ResolversTypes['Employee']>, ParentType, ContextType, RequireFields<QueryEmployeeArgs, 'id'>>;
  employeeAuditReport?: Resolver<ResolversTypes['EmployeeAuditReport'], ParentType, ContextType, RequireFields<QueryEmployeeAuditReportArgs, 'dateRange' | 'employeeId'>>;
  employeeCapacity?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<QueryEmployeeCapacityArgs, 'id'>>;
  employeeChangeHistory?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType, RequireFields<QueryEmployeeChangeHistoryArgs, 'employeeId'>>;
  employeeHistories?: Resolver<ResolversTypes['EmployeeHistoryConnection'], ParentType, ContextType, Partial<QueryEmployeeHistoriesArgs>>;
  employeeHistory?: Resolver<Maybe<ResolversTypes['EmployeeHistory']>, ParentType, ContextType, RequireFields<QueryEmployeeHistoryArgs, 'id'>>;
  employeeHistoryEntry?: Resolver<Maybe<ResolversTypes['EmployeeHistory']>, ParentType, ContextType, RequireFields<QueryEmployeeHistoryEntryArgs, 'id'>>;
  employeeHistoryList?: Resolver<ResolversTypes['EmployeeHistoryConnection'], ParentType, ContextType, RequireFields<QueryEmployeeHistoryListArgs, 'employeeId'>>;
  employeeLoadIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<QueryEmployeeLoadIndexArgs, 'id' | 'periodEnd' | 'periodStart'>>;
  employeeLoadTrend?: Resolver<ResolversTypes['EmployeeLoadHistory'], ParentType, ContextType, RequireFields<QueryEmployeeLoadTrendArgs, 'dateRange' | 'employeeId'>>;
  employeeTaskStats?: Resolver<ResolversTypes['EmployeeTaskStats'], ParentType, ContextType, RequireFields<QueryEmployeeTaskStatsArgs, 'employeeId'>>;
  employeeTasks?: Resolver<Array<ResolversTypes['TaskAssignment']>, ParentType, ContextType, RequireFields<QueryEmployeeTasksArgs, 'employeeId'>>;
  employeeTimeline?: Resolver<Array<ResolversTypes['EmployeeTimelineEntry']>, ParentType, ContextType, RequireFields<QueryEmployeeTimelineArgs, 'employeeId'>>;
  employees?: Resolver<ResolversTypes['EmployeeConnection'], ParentType, ContextType, Partial<QueryEmployeesArgs>>;
  entityAuditTrail?: Resolver<ResolversTypes['EntityAuditTrail'], ParentType, ContextType, RequireFields<QueryEntityAuditTrailArgs, 'entityId' | 'entityType'>>;
  failedLoginAttempts?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType, Partial<QueryFailedLoginAttemptsArgs>>;
  gapAnalyses?: Resolver<ResolversTypes['GapAnalysisConnection'], ParentType, ContextType, Partial<QueryGapAnalysesArgs>>;
  gapAnalysis?: Resolver<Maybe<ResolversTypes['GapAnalysis']>, ParentType, ContextType, RequireFields<QueryGapAnalysisArgs, 'id'>>;
  gapAnalysisTrend?: Resolver<Array<ResolversTypes['GapTrend']>, ParentType, ContextType, RequireFields<QueryGapAnalysisTrendArgs, 'companyId' | 'dateRange'>>;
  gapCriticalityAssessment?: Resolver<ResolversTypes['GapCriticalityAssessment'], ParentType, ContextType, RequireFields<QueryGapCriticalityAssessmentArgs, 'companyId'>>;
  grade?: Resolver<Maybe<ResolversTypes['Grade']>, ParentType, ContextType, RequireFields<QueryGradeArgs, 'id'>>;
  gradeWithStats?: Resolver<Maybe<ResolversTypes['GradeStats']>, ParentType, ContextType, RequireFields<QueryGradeWithStatsArgs, 'id'>>;
  grades?: Resolver<Array<ResolversTypes['Grade']>, ParentType, ContextType>;
  health?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hiringForecast?: Resolver<Maybe<ResolversTypes['HiringForecast']>, ParentType, ContextType, RequireFields<QueryHiringForecastArgs, 'companyId'>>;
  latestCompanyGapAnalysis?: Resolver<Maybe<ResolversTypes['GapAnalysis']>, ParentType, ContextType, RequireFields<QueryLatestCompanyGapAnalysisArgs, 'companyId'>>;
  latestDepartmentGapAnalysis?: Resolver<Maybe<ResolversTypes['GapAnalysis']>, ParentType, ContextType, RequireFields<QueryLatestDepartmentGapAnalysisArgs, 'departmentId'>>;
  latestEmployeeSnapshot?: Resolver<Maybe<ResolversTypes['LoadSnapshot']>, ParentType, ContextType, RequireFields<QueryLatestEmployeeSnapshotArgs, 'employeeId'>>;
  loadAnomalies?: Resolver<Array<ResolversTypes['LoadSnapshot']>, ParentType, ContextType, RequireFields<QueryLoadAnomaliesArgs, 'companyId'>>;
  loadSnapshot?: Resolver<Maybe<ResolversTypes['LoadSnapshot']>, ParentType, ContextType, RequireFields<QueryLoadSnapshotArgs, 'id'>>;
  loadSnapshots?: Resolver<ResolversTypes['LoadSnapshotConnection'], ParentType, ContextType, RequireFields<QueryLoadSnapshotsArgs, 'filter'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myActor?: Resolver<Maybe<ResolversTypes['Actor']>, ParentType, ContextType>;
  myCompany?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  overdueTasks?: Resolver<Array<ResolversTypes['TaskAssignment']>, ParentType, ContextType, Partial<QueryOverdueTasksArgs>>;
  permission?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType, RequireFields<QueryPermissionArgs, 'id'>>;
  permissions?: Resolver<ResolversTypes['PermissionConnection'], ParentType, ContextType, Partial<QueryPermissionsArgs>>;
  process?: Resolver<Maybe<ResolversTypes['Process']>, ParentType, ContextType, RequireFields<QueryProcessArgs, 'id'>>;
  processTasks?: Resolver<Array<ResolversTypes['TaskAssignment']>, ParentType, ContextType, RequireFields<QueryProcessTasksArgs, 'processId'>>;
  processWithMetrics?: Resolver<Maybe<ResolversTypes['ProcessMetrics']>, ParentType, ContextType, RequireFields<QueryProcessWithMetricsArgs, 'id'>>;
  processes?: Resolver<ResolversTypes['ProcessConnection'], ParentType, ContextType, Partial<QueryProcessesArgs>>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryRoleArgs, 'id'>>;
  roles?: Resolver<ResolversTypes['RoleConnection'], ParentType, ContextType, Partial<QueryRolesArgs>>;
  securityIncidentReport?: Resolver<ResolversTypes['SecurityIncidentReport'], ParentType, ContextType, RequireFields<QuerySecurityIncidentReportArgs, 'companyId' | 'dateRange'>>;
  suspiciousActivities?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType, RequireFields<QuerySuspiciousActivitiesArgs, 'companyId'>>;
  systemPermissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  taskAssignment?: Resolver<Maybe<ResolversTypes['TaskAssignment']>, ParentType, ContextType, RequireFields<QueryTaskAssignmentArgs, 'id'>>;
  taskAssignments?: Resolver<ResolversTypes['TaskAssignmentConnection'], ParentType, ContextType, Partial<QueryTaskAssignmentsArgs>>;
  taskWithMetrics?: Resolver<Maybe<ResolversTypes['TaskAssignmentMetrics']>, ParentType, ContextType, RequireFields<QueryTaskWithMetricsArgs, 'id'>>;
  unapprovedChanges?: Resolver<Array<ResolversTypes['EmployeeHistory']>, ParentType, ContextType, Partial<QueryUnapprovedChangesArgs>>;
  userActivitySummary?: Resolver<ResolversTypes['UserActivitySummary'], ParentType, ContextType, RequireFields<QueryUserActivitySummaryArgs, 'dateRange' | 'userId'>>;
  users?: Resolver<ResolversTypes['UsersResult'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'input'>>;
};

export type RiskActivityEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RiskActivityEvent'] = ResolversParentTypes['RiskActivityEvent']> = {
  log?: Resolver<ResolversTypes['AuditLog'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  riskScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type RoleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  companyId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['RolePermission']>, ParentType, ContextType>;
  scope?: Resolver<ResolversTypes['RoleScope'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RoleConnection'] = ResolversParentTypes['RoleConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type RolePermissionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RolePermission'] = ResolversParentTypes['RolePermission']> = {
  assignedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  permissionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  roleId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SecurityIncidentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SecurityIncident'] = ResolversParentTypes['SecurityIncident']> = {
  affectedUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  detectedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  involvedLogs?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType>;
  resolution?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['IncidentSeverity'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SecurityIncidentEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SecurityIncidentEvent'] = ResolversParentTypes['SecurityIncidentEvent']> = {
  detectedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  incident?: Resolver<ResolversTypes['SecurityIncident'], ParentType, ContextType>;
  requiresImmediateAction?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type SecurityIncidentReportResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SecurityIncidentReport'] = ResolversParentTypes['SecurityIncidentReport']> = {
  blockedAttempts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  failedAuthAttempts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  incidents?: Resolver<Array<ResolversTypes['SecurityIncident']>, ParentType, ContextType>;
  period?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  suspiciousBehavior?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalIncidents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _placeholder?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_placeholder", ParentType, ContextType>;
  auditLogCreated?: SubscriptionResolver<ResolversTypes['AuditLog'], "auditLogCreated", ParentType, ContextType, RequireFields<SubscriptionAuditLogCreatedArgs, 'companyId'>>;
  departmentCreated?: SubscriptionResolver<ResolversTypes['Department'], "departmentCreated", ParentType, ContextType, RequireFields<SubscriptionDepartmentCreatedArgs, 'companyId'>>;
  departmentUpdated?: SubscriptionResolver<ResolversTypes['Department'], "departmentUpdated", ParentType, ContextType, RequireFields<SubscriptionDepartmentUpdatedArgs, 'companyId'>>;
  employeeCapacityChanged?: SubscriptionResolver<ResolversTypes['Employee'], "employeeCapacityChanged", ParentType, ContextType, RequireFields<SubscriptionEmployeeCapacityChangedArgs, 'employeeId'>>;
  employeeChanged?: SubscriptionResolver<ResolversTypes['EmployeeHistory'], "employeeChanged", ParentType, ContextType, Partial<SubscriptionEmployeeChangedArgs>>;
  employeeCreated?: SubscriptionResolver<ResolversTypes['Employee'], "employeeCreated", ParentType, ContextType, Partial<SubscriptionEmployeeCreatedArgs>>;
  employeeDismissed?: SubscriptionResolver<ResolversTypes['Employee'], "employeeDismissed", ParentType, ContextType, Partial<SubscriptionEmployeeDismissedArgs>>;
  employeeLoadThresholdCrossed?: SubscriptionResolver<ResolversTypes['Employee'], "employeeLoadThresholdCrossed", ParentType, ContextType, RequireFields<SubscriptionEmployeeLoadThresholdCrossedArgs, 'employeeId'>>;
  employeeStatusChanged?: SubscriptionResolver<ResolversTypes['EmployeeStatusChangeEvent'], "employeeStatusChanged", ParentType, ContextType>;
  employeeUpdated?: SubscriptionResolver<ResolversTypes['Employee'], "employeeUpdated", ParentType, ContextType, Partial<SubscriptionEmployeeUpdatedArgs>>;
  gapAnalysisUpdated?: SubscriptionResolver<ResolversTypes['GapAnalysis'], "gapAnalysisUpdated", ParentType, ContextType, RequireFields<SubscriptionGapAnalysisUpdatedArgs, 'companyId'>>;
  gapThresholdCrossed?: SubscriptionResolver<ResolversTypes['GapThresholdEvent'], "gapThresholdCrossed", ParentType, ContextType, RequireFields<SubscriptionGapThresholdCrossedArgs, 'companyId'>>;
  loadThresholdCrossed?: SubscriptionResolver<ResolversTypes['LoadThresholdEvent'], "loadThresholdCrossed", ParentType, ContextType, Partial<SubscriptionLoadThresholdCrossedArgs>>;
  processCreated?: SubscriptionResolver<ResolversTypes['Process'], "processCreated", ParentType, ContextType, Partial<SubscriptionProcessCreatedArgs>>;
  processStatusChanged?: SubscriptionResolver<ResolversTypes['ProcessStatusChangeEvent'], "processStatusChanged", ParentType, ContextType, RequireFields<SubscriptionProcessStatusChangedArgs, 'processId'>>;
  processUpdated?: SubscriptionResolver<ResolversTypes['Process'], "processUpdated", ParentType, ContextType, RequireFields<SubscriptionProcessUpdatedArgs, 'processId'>>;
  riskActivityDetected?: SubscriptionResolver<ResolversTypes['RiskActivityEvent'], "riskActivityDetected", ParentType, ContextType, RequireFields<SubscriptionRiskActivityDetectedArgs, 'companyId'>>;
  securityIncidentDetected?: SubscriptionResolver<ResolversTypes['SecurityIncidentEvent'], "securityIncidentDetected", ParentType, ContextType, RequireFields<SubscriptionSecurityIncidentDetectedArgs, 'companyId'>>;
  taskAssignmentUpdated?: SubscriptionResolver<ResolversTypes['TaskAssignment'], "taskAssignmentUpdated", ParentType, ContextType, RequireFields<SubscriptionTaskAssignmentUpdatedArgs, 'taskId'>>;
  taskCreated?: SubscriptionResolver<ResolversTypes['TaskAssignment'], "taskCreated", ParentType, ContextType, Partial<SubscriptionTaskCreatedArgs>>;
  taskStatusChanged?: SubscriptionResolver<ResolversTypes['TaskStatusChangeEvent'], "taskStatusChanged", ParentType, ContextType, RequireFields<SubscriptionTaskStatusChangedArgs, 'taskId'>>;
};

export type TalentCategoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TalentCategory'] = ResolversParentTypes['TalentCategory']> = {
  estimatedMonthlyCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  estimatedRecruitmentTimeWeeks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  experienceRequired?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  grade?: Resolver<ResolversTypes['Grade'], ParentType, ContextType>;
  gradeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  targetCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TaskAssignmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaskAssignment'] = ResolversParentTypes['TaskAssignment']> = {
  actualDaysSpent?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  allocatedCapacityUnits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  completionPercentage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  departmentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  effortHours?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  employee?: Resolver<ResolversTypes['Employee'], ParentType, ContextType>;
  employeeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estimatedDaysToComplete?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  loadSnapshots?: Resolver<Maybe<Array<Maybe<ResolversTypes['LoadSnapshot']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['TaskPriority'], ParentType, ContextType>;
  process?: Resolver<ResolversTypes['Process'], ParentType, ContextType>;
  processId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  taskType?: Resolver<ResolversTypes['TaskType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type TaskAssignmentConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaskAssignmentConnection'] = ResolversParentTypes['TaskAssignmentConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['TaskAssignment']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TaskAssignmentMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaskAssignmentMetrics'] = ResolversParentTypes['TaskAssignmentMetrics']> = {
  assignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType>;
  daysUntilDue?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  estimatedCompletionDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  onTrack?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  utilizationRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  workloadContribution?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type TaskStatusChangeEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaskStatusChangeEvent'] = ResolversParentTypes['TaskStatusChangeEvent']> = {
  assignment?: Resolver<ResolversTypes['TaskAssignment'], ParentType, ContextType>;
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  changedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  newStatus?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  previousStatus?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type TaskStatusCountResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaskStatusCount'] = ResolversParentTypes['TaskStatusCount']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
};

export type TaskTypeCountResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaskTypeCount'] = ResolversParentTypes['TaskTypeCount']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taskType?: Resolver<ResolversTypes['TaskType'], ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAccessSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserAccessSummary'] = ResolversParentTypes['UserAccessSummary']> = {
  activeMinutesThisPeriod?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  criticalActionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dataAccessCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastLogin?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  riskLevel?: Resolver<ResolversTypes['AccessRiskLevel'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type UserActivitySummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserActivitySummary'] = ResolversParentTypes['UserActivitySummary']> = {
  actionsByType?: Resolver<Array<ResolversTypes['ActionTypeSummary']>, ParentType, ContextType>;
  activePeriod?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  failureCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  recentActions?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType>;
  riskScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalActions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unusualActivities?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type UsersResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UsersResult'] = ResolversParentTypes['UsersResult']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  ActionTypeSummary?: ActionTypeSummaryResolvers<ContextType>;
  Actor?: ActorResolvers<ContextType>;
  ActorConnection?: ActorConnectionResolvers<ContextType>;
  ActorPermission?: ActorPermissionResolvers<ContextType>;
  ActorRole?: ActorRoleResolvers<ContextType>;
  AuditLog?: AuditLogResolvers<ContextType>;
  AuditLogConnection?: AuditLogConnectionResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  ChangeByUser?: ChangeByUserResolvers<ContextType>;
  ChangeTypeSummary?: ChangeTypeSummaryResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  CompanyLoadAnalysis?: CompanyLoadAnalysisResolvers<ContextType>;
  ComplianceReport?: ComplianceReportResolvers<ContextType>;
  DateRange?: DateRangeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Department?: DepartmentResolvers<ContextType>;
  DepartmentConnection?: DepartmentConnectionResolvers<ContextType>;
  DepartmentEmployeeHistory?: DepartmentEmployeeHistoryResolvers<ContextType>;
  DepartmentGapComparison?: DepartmentGapComparisonResolvers<ContextType>;
  DepartmentLoadOverview?: DepartmentLoadOverviewResolvers<ContextType>;
  DepartmentMetrics?: DepartmentMetricsResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  EmployeeAuditReport?: EmployeeAuditReportResolvers<ContextType>;
  EmployeeConnection?: EmployeeConnectionResolvers<ContextType>;
  EmployeeHistory?: EmployeeHistoryResolvers<ContextType>;
  EmployeeHistoryConnection?: EmployeeHistoryConnectionResolvers<ContextType>;
  EmployeeLoadBreakdown?: EmployeeLoadBreakdownResolvers<ContextType>;
  EmployeeLoadHistory?: EmployeeLoadHistoryResolvers<ContextType>;
  EmployeeStatusChangeEvent?: EmployeeStatusChangeEventResolvers<ContextType>;
  EmployeeTaskStats?: EmployeeTaskStatsResolvers<ContextType>;
  EmployeeTimelineEntry?: EmployeeTimelineEntryResolvers<ContextType>;
  EntityAuditTrail?: EntityAuditTrailResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  GapAnalysis?: GapAnalysisResolvers<ContextType>;
  GapAnalysisConnection?: GapAnalysisConnectionResolvers<ContextType>;
  GapAnalysisRecommendation?: GapAnalysisRecommendationResolvers<ContextType>;
  GapCriticalityAssessment?: GapCriticalityAssessmentResolvers<ContextType>;
  GapThresholdEvent?: GapThresholdEventResolvers<ContextType>;
  GapTrend?: GapTrendResolvers<ContextType>;
  Grade?: GradeResolvers<ContextType>;
  GradeStats?: GradeStatsResolvers<ContextType>;
  HiringForecast?: HiringForecastResolvers<ContextType>;
  HiringPhase?: HiringPhaseResolvers<ContextType>;
  HiringPlan?: HiringPlanResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LoadAnalysisMetrics?: LoadAnalysisMetricsResolvers<ContextType>;
  LoadRecommendation?: LoadRecommendationResolvers<ContextType>;
  LoadSnapshot?: LoadSnapshotResolvers<ContextType>;
  LoadSnapshotConnection?: LoadSnapshotConnectionResolvers<ContextType>;
  LoadThresholdEvent?: LoadThresholdEventResolvers<ContextType>;
  LoadTrendPoint?: LoadTrendPointResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  PermissionConnection?: PermissionConnectionResolvers<ContextType>;
  Process?: ProcessResolvers<ContextType>;
  ProcessConnection?: ProcessConnectionResolvers<ContextType>;
  ProcessMetrics?: ProcessMetricsResolvers<ContextType>;
  ProcessStatusChangeEvent?: ProcessStatusChangeEventResolvers<ContextType>;
  QuarterlyProjection?: QuarterlyProjectionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RiskActivityEvent?: RiskActivityEventResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RoleConnection?: RoleConnectionResolvers<ContextType>;
  RolePermission?: RolePermissionResolvers<ContextType>;
  SecurityIncident?: SecurityIncidentResolvers<ContextType>;
  SecurityIncidentEvent?: SecurityIncidentEventResolvers<ContextType>;
  SecurityIncidentReport?: SecurityIncidentReportResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TalentCategory?: TalentCategoryResolvers<ContextType>;
  TaskAssignment?: TaskAssignmentResolvers<ContextType>;
  TaskAssignmentConnection?: TaskAssignmentConnectionResolvers<ContextType>;
  TaskAssignmentMetrics?: TaskAssignmentMetricsResolvers<ContextType>;
  TaskStatusChangeEvent?: TaskStatusChangeEventResolvers<ContextType>;
  TaskStatusCount?: TaskStatusCountResolvers<ContextType>;
  TaskTypeCount?: TaskTypeCountResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserAccessSummary?: UserAccessSummaryResolvers<ContextType>;
  UserActivitySummary?: UserActivitySummaryResolvers<ContextType>;
  UsersResult?: UsersResultResolvers<ContextType>;
};

