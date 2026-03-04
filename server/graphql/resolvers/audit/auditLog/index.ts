/**
 * ============================================================================
 * AuditLog Domain - Resolver Index
 * ============================================================================
 * Exports all audit log resolvers (query, mutation, fields, subscription)
 */

import auditLogFieldResolvers from "./fields";
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

  AuditLog: auditLogFieldResolvers,
};

export {
  auditLogQueries,
  auditLogMutations,
  auditLogSubscriptions,
  auditLogFieldResolvers,
};

export default auditLogResolvers;
