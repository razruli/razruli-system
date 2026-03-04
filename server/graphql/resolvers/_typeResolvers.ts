// Import field resolvers individually to avoid conflicts

import { scalarResolvers } from "./_scalarResolvers";
import { analyticsResolvers } from "./analytics";
import { auditResolvers } from "./audit";
import { coreResolvers } from "./core";
import { operationsResolvers } from "./operations";
import * as PageFields from "./page/fields";
import { usersResultFieldResolvers } from "./user";

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
  AuditLog: auditResolvers.AuditLog,
  EmployeeHistory: auditResolvers.EmployeeHistory,
  DepartmentEmployeeHistory: auditResolvers.DepartmentEmployeeHistory,
  EmployeeAuditReport: auditResolvers.EmployeeAuditReport,

  // ========== CUSTOM TYPE FIELD RESOLVERS ==========
  UsersResult: usersResultFieldResolvers,
  PageInfo: PageFields.pageInfoResolver,
};

export default typeResolvers;
