/**
 * ============================================================================
 * AuditLog Domain - Mutation Resolvers
 * ============================================================================
 * Mutations for audit logs - system logging functions
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

export const auditLogMutations: Pick<
  MutationResolvers,
  "logAuditEntry" | "bulkLogAuditEntries" | "archiveAuditLogs" | "exportAuditLogs"
> = {
  /**
   * Log an audit entry
   */
  logAuditEntry: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        return await context.services.auditLog.log(input);
      } catch (error) {
        throw new Error(`Failed to log audit entry: ${error}`);
      }
    },
    {
      requireAuth: true,
    },
  ),

  /**
   * Bulk log audit entries
   */
  bulkLogAuditEntries: withMiddleware(
    async (_parent, { entries }, context) => {
      try {
        return await context.services.auditLog.bulkLog(entries);
      } catch (error) {
        throw new Error(`Failed to bulk log audit entries: ${error}`);
      }
    },
    {
      requireAuth: true,
    },
  ),

  /**
   * Archive audit logs
   */
  archiveAuditLogs: withMiddleware(
    async (_parent, { dateRange }, context) => {
      try {
        const result = await context.services.auditLog.archive(dateRange);
        return result.count;
      } catch (error) {
        throw new Error(`Failed to archive audit logs: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:archive"],
    },
  ),

  /**
   * Export audit logs
   */
  exportAuditLogs: withMiddleware(
    async (_parent, { filter, format }, context) => {
      try {
        return await context.services.auditLog.export(filter, format);
      } catch (error) {
        throw new Error(`Failed to export audit logs: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["auditLog:export"],
    },
  ),
};

export default auditLogMutations;
