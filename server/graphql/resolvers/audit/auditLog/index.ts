/**
 * ============================================================================
 * AuditLog Domain - Resolver Index
 * ============================================================================
 * Exports all audit log resolvers (query, mutation, fields, subscription)
 */

import {
  auditLogAllFieldResolvers,
  changeByUserFieldResolvers,
  userActivitySummaryFieldResolvers,
  entityAuditTrailFieldResolvers,
  complianceReportFieldResolvers,
  securityIncidentReportFieldResolvers,
} from "./fields";
import auditLogMutations from "./mutation";
import auditLogQueries from "./query";
import auditLogSubscriptions from "./subscription";

/**
 * Complete resolver set for AuditLog domain
 */
export const auditLogResolvers = {
  Query: {
    ...auditLogQueries,
  },

  Mutation: {
    ...auditLogMutations,
  },

  Subscription: {
    ...auditLogSubscriptions,
  },

  EntityAuditTrail: entityAuditTrailFieldResolvers,
  ChangeByUser: changeByUserFieldResolvers,
  UserActivitySummary: userActivitySummaryFieldResolvers,
  ComplianceReport: complianceReportFieldResolvers,
  SecurityIncidentReport: securityIncidentReportFieldResolvers,
};

export {
  auditLogQueries,
  auditLogMutations,
  auditLogSubscriptions,
  auditLogAllFieldResolvers,
  changeByUserFieldResolvers,
  userActivitySummaryFieldResolvers,
  entityAuditTrailFieldResolvers,
  complianceReportFieldResolvers,
  securityIncidentReportFieldResolvers,
};

export default auditLogResolvers;
