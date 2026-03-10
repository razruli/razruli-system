// Import field resolvers individually to avoid conflicts

import { scalarResolvers } from "./_scalarResolvers";
import { analyticsResolvers } from "./analytics";
import { auditResolvers } from "./audit";
import { coreResolvers } from "./core";
import { operationsResolvers } from "./operations";
import { pageFieldResolvers } from "./page";
import { userResolvers } from "./user";

export const typeResolvers = {
  // ========== SCALAR RESOLVERS ==========
  ...scalarResolvers,

  // ========== CORE DOMAIN TYPE FIELD RESOLVERS ==========
  Company: coreResolvers.Company,
  Department: coreResolvers.Department,
  DepartmentMetrics: coreResolvers.DepartmentMetrics,
  Employee: coreResolvers.Employee,
  Grade: coreResolvers.Grade,
  GradeStats: coreResolvers.GradeStats,

  // ========== OPERATIONS DOMAIN TYPE FIELD RESOLVERS ==========
  Process: operationsResolvers.Process,
  ProcessMetrics: operationsResolvers.ProcessMetrics,
  TaskAssignment: operationsResolvers.TaskAssignment,
  TaskAssignmentMetrics: operationsResolvers.TaskAssignmentMetrics,
  EmployeeTaskStats: operationsResolvers.EmployeeTaskStats,
  TaskStatusCount: operationsResolvers.TaskStatusCount,
  TaskTypeCount: operationsResolvers.TaskTypeCount,

  // ========== ANALYTICS DOMAIN TYPE FIELD RESOLVERS ==========
  GapAnalysis: analyticsResolvers.GapAnalysis,
  DepartmentGapComparison: analyticsResolvers.DepartmentGapComparison,
  HiringForecast: analyticsResolvers.HiringForecast,
  TalentCategory: analyticsResolvers.TalentCategory,
  LoadSnapshot: analyticsResolvers.LoadSnapshot,
  CompanyLoadAnalysis: analyticsResolvers.CompanyLoadAnalysis,
  DepartmentLoadOverview: analyticsResolvers.DepartmentLoadOverview,
  EmployeeLoadBreakdown: analyticsResolvers.EmployeeLoadBreakdown,
  EmployeeLoadHistory: analyticsResolvers.EmployeeLoadHistory,

  // ========== AUDIT DOMAIN TYPE FIELD RESOLVERS ==========
  // Only include types with custom field resolvers
  // Scalar-only types use `as any` for default resolution
  // AuditLog: {} as any,
  // ActionTypeSummary: {} as any,
  // ChangeTypeSummary: {} as any,
  EntityAuditTrail: auditResolvers.EntityAuditTrail,
  ChangeByUser: auditResolvers.ChangeByUser,
  ComplianceReport: auditResolvers.ComplianceReport,
  SecurityIncidentReport: auditResolvers.SecurityIncidentReport,
  UserActivitySummary: auditResolvers.UserActivitySummary,
  EmployeeHistory: auditResolvers.EmployeeHistory,
  DepartmentEmployeeHistory: auditResolvers.DepartmentEmployeeHistory,
  EmployeeAuditReport: auditResolvers.EmployeeAuditReport,

  // ========== USER DOMAIN TYPE FIELD RESOLVERS ==========
  UsersResult: userResolvers.UsersResult,
  Actor: userResolvers.Actor,
  Role: userResolvers.Role,

  // ========== CUSTOM TYPE FIELD RESOLVERS ==========
  PageInfo: pageFieldResolvers.pageInfoResolver,
};

export default typeResolvers;
