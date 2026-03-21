/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  /** Slug (URL-friendly identifier) */
  slug: Scalars['String']['output'];
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
  slug?: InputMaybe<Scalars['String']['input']>;
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

/** Aggregated stats for department productivity */
export type DepartmentCompletionMetrics = {
  __typename?: 'DepartmentCompletionMetrics';
  averageHoursPerTask: Scalars['Float']['output'];
  departmentId: Scalars['String']['output'];
  processes: Array<ProcessCompletionStats>;
  totalHoursSpent: Scalars['Float']['output'];
  totalTasksCompleted: Scalars['Int']['output'];
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

/** Company-wide productivity ranking */
export type DepartmentRanking = {
  __typename?: 'DepartmentRanking';
  departmentId: Scalars['String']['output'];
  entriesCount: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
  totalTasksCompleted: Scalars['Int']['output'];
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
  kEfficiency?: Maybe<Scalars['Float']['output']>;
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

/** Aggregated stats for employee productivity */
export type EmployeeMetrics = {
  __typename?: 'EmployeeMetrics';
  averageHoursPerTask: Scalars['Float']['output'];
  employeeId: Scalars['String']['output'];
  processes: Array<ProcessCompletionStats>;
  totalHoursSpent: Scalars['Float']['output'];
  totalTasksCompleted: Scalars['Int']['output'];
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

/**
 * Finished Task type representing completed work
 * Minimal analytics model: what was done, when, and optionally by whom and how long
 */
export type FinishedTask = {
  __typename?: 'FinishedTask';
  completedAt: Scalars['DateTime']['output'];
  /** Timestamps */
  createdAt: Scalars['DateTime']['output'];
  department: Department;
  /** Department that completed the work (always set) */
  departmentId: Scalars['String']['output'];
  employee?: Maybe<Employee>;
  /** Specific employee who completed (optional - null = department aggregate) */
  employeeId?: Maybe<Scalars['String']['output']>;
  /** Optional extended details (more data = better insights) */
  hoursSpent?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  process: Process;
  /** What process was completed */
  processId: Scalars['String']['output'];
  /** Core metrics */
  quantity: Scalars['Int']['output'];
  status: TaskStatus;
  updatedAt: Scalars['DateTime']['output'];
};

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

/** Process completion breakdown */
export type ProcessCompletionStats = {
  __typename?: 'ProcessCompletionStats';
  count: Scalars['Int']['output'];
  processId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
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

/** Process popularity ranking */
export type ProcessRanking = {
  __typename?: 'ProcessRanking';
  entriesCount: Scalars['Int']['output'];
  processId: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  totalTasksCompleted: Scalars['Int']['output'];
};

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
  /** Get company by slug (friendly URL identifier) */
  companyBySlug?: Maybe<Company>;
  /** Get company-wide load analysis */
  companyLoadAnalysis: CompanyLoadAnalysis;
  /** Get processes by company with metrics */
  companyProcessMetrics: Array<ProcessMetrics>;
  /** Get company-wide department productivity ranking */
  companyProductivityRanking: Array<DepartmentRanking>;
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
  /** Get department productivity metrics (totals and breakdown by process) */
  departmentMetrics: DepartmentCompletionMetrics;
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
  /** Get employee productivity metrics */
  employeeMetrics: EmployeeMetrics;
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
  /** Get all finished tasks for a department (with optional date range) */
  finishedTasksByDepartment: Array<FinishedTask>;
  /** Get all finished tasks by employee (with optional date range) */
  finishedTasksByEmployee: Array<FinishedTask>;
  /** Get all finished tasks for a process (with optional date range) */
  finishedTasksByProcess: Array<FinishedTask>;
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
  /** Get most popular/frequently completed processes */
  popularProcesses: Array<ProcessRanking>;
  /** Get process by ID */
  process?: Maybe<Process>;
  /** Get tasks in a process */
  processTasks: Array<TaskAssignment>;
  /** Get process with metrics for analytics */
  processWithMetrics?: Maybe<ProcessMetrics>;
  /** List all processes with filtering and pagination */
  processes: ProcessConnection;
  /** Get recent finished tasks for a department (last N days) */
  recentTasksByDepartment: Array<FinishedTask>;
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
export type QueryCompanyBySlugArgs = {
  slug: Scalars['String']['input'];
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
export type QueryCompanyProductivityRankingArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
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
export type QueryDepartmentMetricsArgs = {
  departmentId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
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
export type QueryEmployeeMetricsArgs = {
  employeeId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
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
export type QueryFinishedTasksByDepartmentArgs = {
  departmentId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryFinishedTasksByEmployeeArgs = {
  employeeId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * Root Query type
 * Extended by each domain module (core, operations, analytics, audit)
 */
export type QueryFinishedTasksByProcessArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  processId: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
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
export type QueryPopularProcessesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
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
export type QueryRecentTasksByDepartmentArgs = {
  daysBack?: InputMaybe<Scalars['Int']['input']>;
  departmentId: Scalars['String']['input'];
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
  OnHold = 'ON_HOLD',
  Reviewed = 'REVIEWED',
  Validated = 'VALIDATED'
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

export type GetCompanyBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCompanyBySlugQuery = { __typename?: 'Query', companyBySlug?: { __typename?: 'Company', id: string, name: string, slug: string, timezone: string, workingHoursDay: number, workingDaysPerMonth: number } | null };

export type AssignDepartmentHeadMutationVariables = Exact<{
  departmentId: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
}>;


export type AssignDepartmentHeadMutation = { __typename?: 'Mutation', assignDepartmentHead: { __typename?: 'Department', id: string, name: string, headId?: string | null, updatedAt: Date, head?: { __typename?: 'Employee', id: string, firstName: string, lastName: string, gradeId: number } | null } };

export type CreateDepartmentMutationVariables = Exact<{
  input: CreateDepartmentInput;
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'Department', id: string, companyId: string, name: string, headId?: string | null, createdAt: Date, updatedAt: Date } };

export type DeleteDepartmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteDepartmentMutation = { __typename?: 'Mutation', deleteDepartment: boolean };

export type UpdateDepartmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateDepartmentInput;
}>;


export type UpdateDepartmentMutation = { __typename?: 'Mutation', updateDepartment: { __typename?: 'Department', id: string, companyId: string, name: string, headId?: string | null, updatedAt: Date, head?: { __typename?: 'Employee', id: string, firstName: string, lastName: string } | null } };

export type GetDepartmentQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDepartmentQuery = { __typename?: 'Query', department?: { __typename?: 'Department', id: string, companyId: string, name: string, headId?: string | null, createdAt: Date, updatedAt: Date, head?: { __typename?: 'Employee', id: string, firstName: string, lastName: string, gradeId: number } | null } | null };

export type GetDepartmentWithMetricsQueryVariables = Exact<{
  id: Scalars['String']['input'];
  periodStart?: InputMaybe<Scalars['DateTime']['input']>;
  periodEnd?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetDepartmentWithMetricsQuery = { __typename?: 'Query', departmentWithMetrics?: { __typename?: 'DepartmentMetrics', totalEmployees: number, activeEmployees: number, overloadedCount: number, totalCapacity: number, totalLoad: number, loadIndex: number, department: { __typename?: 'Department', id: string, companyId: string, name: string, headId?: string | null, head?: { __typename?: 'Employee', id: string, firstName: string, lastName: string } | null } } | null };

export type GetDepartmentsQueryVariables = Exact<{
  filter: DepartmentFilterInput;
}>;


export type GetDepartmentsQuery = { __typename?: 'Query', departments: { __typename?: 'DepartmentConnection', totalCount: number, nodes: Array<{ __typename?: 'Department', id: string, companyId: string, name: string, headId?: string | null, createdAt: Date, updatedAt: Date, head?: { __typename?: 'Employee', id: string, firstName: string, lastName: string, gradeId: number } | null }>, pageInfo: { __typename?: 'PageInfo', hasMore: boolean, offset: number, limit: number, total: number } } };

export type CreateEmployeeMutationVariables = Exact<{
  input: CreateEmployeeInput;
}>;


export type CreateEmployeeMutation = { __typename?: 'Mutation', createEmployee: { __typename?: 'Employee', id: string, companyId: string, departmentId: string, firstName: string, lastName: string, gradeId: number, status: string, createdAt: Date, updatedAt: Date } };

export type DismissEmployeeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type DismissEmployeeMutation = { __typename?: 'Mutation', dismissEmployee: { __typename?: 'Employee', id: string, status: string, fireDate?: Date | null, updatedAt: Date } };

export type UpdateEmployeeMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateEmployeeInput;
}>;


export type UpdateEmployeeMutation = { __typename?: 'Mutation', updateEmployee: { __typename?: 'Employee', id: string, companyId: string, departmentId: string, firstName: string, lastName: string, gradeId: number, gender: string, status: string, kEfficiency?: number | null, workingHoursPerDay: number, updatedAt: Date } };

export type UpdateEmployeeEfficiencyMutationVariables = Exact<{
  id: Scalars['String']['input'];
  kEfficiency: Scalars['Float']['input'];
}>;


export type UpdateEmployeeEfficiencyMutation = { __typename?: 'Mutation', updateEmployeeEfficiency: { __typename?: 'Employee', id: string, kEfficiency?: number | null, updatedAt: Date } };

export type GetDepartmentEmployeesQueryVariables = Exact<{
  departmentId: Scalars['String']['input'];
}>;


export type GetDepartmentEmployeesQuery = { __typename?: 'Query', departmentEmployees: Array<{ __typename?: 'Employee', id: string, companyId: string, departmentId: string, firstName: string, lastName: string, gradeId: number, gender: string, hireDate: Date, fireDate?: Date | null, kEfficiency?: number | null, employmentType: string, status: string, workingHoursPerDay: number, createdAt: Date, updatedAt: Date, grade: { __typename?: 'Grade', id: number, name: string, kGrade: number } }> };

export type GetEmployeeQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetEmployeeQuery = { __typename?: 'Query', employee?: { __typename?: 'Employee', id: string, companyId: string, departmentId: string, firstName: string, lastName: string, gradeId: number, gender: string, birthDate?: Date | null, hireDate: Date, fireDate?: Date | null, kEfficiency?: number | null, employmentType: string, status: string, workingHoursPerDay: number, createdAt: Date, updatedAt: Date, department: { __typename?: 'Department', id: string, name: string }, grade: { __typename?: 'Grade', id: number, name: string, kGrade: number } } | null };

export type GetEmployeeCapacityQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetEmployeeCapacityQuery = { __typename?: 'Query', employeeCapacity: number };

export type GetEmployeeLoadIndexQueryVariables = Exact<{
  id: Scalars['String']['input'];
  periodStart: Scalars['DateTime']['input'];
  periodEnd: Scalars['DateTime']['input'];
}>;


export type GetEmployeeLoadIndexQuery = { __typename?: 'Query', employeeLoadIndex: number };

export type GetEmployeesQueryVariables = Exact<{
  filter?: InputMaybe<EmployeeFilterInput>;
  pagination?: InputMaybe<EmployeePaginationInput>;
}>;


export type GetEmployeesQuery = { __typename?: 'Query', employees: { __typename?: 'EmployeeConnection', totalCount: number, nodes: Array<{ __typename?: 'Employee', id: string, companyId: string, departmentId: string, firstName: string, lastName: string, gradeId: number, gender: string, birthDate?: Date | null, hireDate: Date, fireDate?: Date | null, kEfficiency?: number | null, employmentType: string, status: string, workingHoursPerDay: number, createdAt: Date, updatedAt: Date, department: { __typename?: 'Department', id: string, name: string }, grade: { __typename?: 'Grade', id: number, name: string, kGrade: number } }>, pageInfo: { __typename?: 'PageInfo', hasMore: boolean, offset: number, limit: number, total: number } } };

export type GetProcessesQueryVariables = Exact<{
  filter?: InputMaybe<ProcessFilterInput>;
  pagination?: InputMaybe<ProcessPaginationInput>;
}>;


export type GetProcessesQuery = { __typename?: 'Query', processes: { __typename?: 'ProcessConnection', totalCount: number, nodes: Array<{ __typename?: 'Process', id: string, companyId: string, departmentId: string, name: string, description?: string | null, processType: ProcessType, capacityUnits: number, kMultiplier: number, estimatedDurationDays?: number | null, status: ProcessStatus, priority: ProcessPriority, createdAt: Date, updatedAt: Date, startedAt?: Date | null, completedAt?: Date | null, company: { __typename?: 'Company', id: string, name: string }, department: { __typename?: 'Department', id: string, name: string } }>, pageInfo: { __typename?: 'PageInfo', hasMore: boolean, offset: number, limit: number, total: number } } };


export const GetCompanyBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompanyBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"workingHoursDay"}},{"kind":"Field","name":{"kind":"Name","value":"workingDaysPerMonth"}}]}}]}}]} as unknown as DocumentNode<GetCompanyBySlugQuery, GetCompanyBySlugQueryVariables>;
export const AssignDepartmentHeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignDepartmentHead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"departmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"employeeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignDepartmentHead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"departmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"departmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"employeeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"employeeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"headId"}},{"kind":"Field","name":{"kind":"Name","value":"head"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AssignDepartmentHeadMutation, AssignDepartmentHeadMutationVariables>;
export const CreateDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"headId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateDepartmentMutation, CreateDepartmentMutationVariables>;
export const DeleteDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>;
export const UpdateDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"headId"}},{"kind":"Field","name":{"kind":"Name","value":"head"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>;
export const GetDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"department"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"headId"}},{"kind":"Field","name":{"kind":"Name","value":"head"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetDepartmentQuery, GetDepartmentQueryVariables>;
export const GetDepartmentWithMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDepartmentWithMetrics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodStart"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodEnd"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"departmentWithMetrics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodStart"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodStart"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodEnd"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodEnd"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"department"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"headId"}},{"kind":"Field","name":{"kind":"Name","value":"head"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalEmployees"}},{"kind":"Field","name":{"kind":"Name","value":"activeEmployees"}},{"kind":"Field","name":{"kind":"Name","value":"overloadedCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalLoad"}},{"kind":"Field","name":{"kind":"Name","value":"loadIndex"}}]}}]}}]} as unknown as DocumentNode<GetDepartmentWithMetricsQuery, GetDepartmentWithMetricsQueryVariables>;
export const GetDepartmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDepartments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DepartmentFilterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"departments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"headId"}},{"kind":"Field","name":{"kind":"Name","value":"head"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetDepartmentsQuery, GetDepartmentsQueryVariables>;
export const CreateEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEmployeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEmployee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"departmentId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateEmployeeMutation, CreateEmployeeMutationVariables>;
export const DismissEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissEmployee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fireDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DismissEmployeeMutation, DismissEmployeeMutationVariables>;
export const UpdateEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmployeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmployee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"departmentId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"kEfficiency"}},{"kind":"Field","name":{"kind":"Name","value":"workingHoursPerDay"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>;
export const UpdateEmployeeEfficiencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmployeeEfficiency"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kEfficiency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmployeeEfficiency"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"kEfficiency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kEfficiency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kEfficiency"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateEmployeeEfficiencyMutation, UpdateEmployeeEfficiencyMutationVariables>;
export const GetDepartmentEmployeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDepartmentEmployees"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"departmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"departmentEmployees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"departmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"departmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"departmentId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"grade"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kGrade"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"fireDate"}},{"kind":"Field","name":{"kind":"Name","value":"kEfficiency"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"workingHoursPerDay"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetDepartmentEmployeesQuery, GetDepartmentEmployeesQueryVariables>;
export const GetEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"departmentId"}},{"kind":"Field","name":{"kind":"Name","value":"department"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"grade"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kGrade"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"fireDate"}},{"kind":"Field","name":{"kind":"Name","value":"kEfficiency"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"workingHoursPerDay"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetEmployeeQuery, GetEmployeeQueryVariables>;
export const GetEmployeeCapacityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployeeCapacity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCapacity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<GetEmployeeCapacityQuery, GetEmployeeCapacityQueryVariables>;
export const GetEmployeeLoadIndexDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployeeLoadIndex"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodStart"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodEnd"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeLoadIndex"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodStart"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodStart"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodEnd"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodEnd"}}}]}]}}]} as unknown as DocumentNode<GetEmployeeLoadIndexQuery, GetEmployeeLoadIndexQueryVariables>;
export const GetEmployeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployees"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeeFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EmployeePaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"departmentId"}},{"kind":"Field","name":{"kind":"Name","value":"department"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"grade"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kGrade"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"hireDate"}},{"kind":"Field","name":{"kind":"Name","value":"fireDate"}},{"kind":"Field","name":{"kind":"Name","value":"kEfficiency"}},{"kind":"Field","name":{"kind":"Name","value":"employmentType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"workingHoursPerDay"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetEmployeesQuery, GetEmployeesQueryVariables>;
export const GetProcessesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProcesses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"processes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"departmentId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"capacityUnits"}},{"kind":"Field","name":{"kind":"Name","value":"kMultiplier"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationDays"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"department"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetProcessesQuery, GetProcessesQueryVariables>;