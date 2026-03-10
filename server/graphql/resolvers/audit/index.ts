/**
 * ============================================================================
 * AUDIT DOMAIN - Resolver Index
 * ============================================================================
 * Unified resolver composition for audit and compliance:
 * - AuditLog: System-wide audit log of all actions
 * - EmployeeHistory: Historical records of employee data changes
 *
 * Exports all resolvers for use in main resolver composition layer
 */

import { auditLogResolvers } from "./auditLog";
import { employeeHistoryResolvers } from "./employeeHistory";

/**
 * Complete resolver set for Audit domain
 * Merges all entity resolvers together
 */
export const auditResolvers = {
  // Query resolvers from all entities
  Query: {
    ...auditLogResolvers.Query,
    ...employeeHistoryResolvers.Query,
  },

  // Mutation resolvers from all entities
  Mutation: {
    ...auditLogResolvers.Mutation,
    ...employeeHistoryResolvers.Mutation,
  },

  // Subscription resolvers from all entities
  Subscription: {
    ...auditLogResolvers.Subscription,
    ...employeeHistoryResolvers.Subscription,
  },

  // Type field resolvers - only types with custom resolvers
  EntityAuditTrail: auditLogResolvers.EntityAuditTrail,
  ChangeByUser: auditLogResolvers.ChangeByUser,
  ComplianceReport: auditLogResolvers.ComplianceReport,
  SecurityIncidentReport: auditLogResolvers.SecurityIncidentReport,
  UserActivitySummary: auditLogResolvers.UserActivitySummary,
  EmployeeHistory: employeeHistoryResolvers.EmployeeHistory,
  DepartmentEmployeeHistory: employeeHistoryResolvers.DepartmentEmployeeHistory,
  EmployeeAuditReport: employeeHistoryResolvers.EmployeeAuditReport,
};

// Export individual entities for selective imports
export { auditLogResolvers } from "./auditLog";
export { employeeHistoryResolvers } from "./employeeHistory";

export default auditResolvers;
