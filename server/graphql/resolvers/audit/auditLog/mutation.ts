/**
 * ============================================================================
 * AuditLog Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for audit log mutations

/** Require authentication for basic audit logging */
const auditLogBasicMiddleware = composeMiddleware({ requireAuth: true });

/** Require authentication + auditLog:archive permission */
const auditLogArchiveMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["auditLog:archive"] },
);

/** Require authentication + auditLog:export permission */
const auditLogExportMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["auditLog:export"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Log an audit entry
 */
const logAuditEntryResolver: MutationResolvers["logAuditEntry"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    return await context.services.auditLog.log(input);
  } catch (error) {
    throw new Error(`Failed to log audit entry: ${error}`);
  }
};

/**
 * Bulk log audit entries
 */
const bulkLogAuditEntriesResolver: MutationResolvers["bulkLogAuditEntries"] =
  async (_parent, { entries }, context) => {
    try {
      return await context.services.auditLog.bulkLog(entries);
    } catch (error) {
      throw new Error(`Failed to bulk log audit entries: ${error}`);
    }
  };

/**
 * Archive audit logs
 */
const archiveAuditLogsResolver: MutationResolvers["archiveAuditLogs"] = async (
  _parent,
  { dateRange },
  context,
) => {
  try {
    const result = await context.services.auditLog.archive(dateRange);
    return result.count;
  } catch (error) {
    throw new Error(`Failed to archive audit logs: ${error}`);
  }
};

/**
 * Export audit logs
 */
const exportAuditLogsResolver: MutationResolvers["exportAuditLogs"] = async (
  _parent,
  { filter, format },
  context,
) => {
  try {
    return await context.services.auditLog.export(filter, format);
  } catch (error) {
    throw new Error(`Failed to export audit logs: ${error}`);
  }
};

// ==================== WRAPPED RESOLVERS ====================

const wrappedLogAuditEntry = withMiddleware(
  logAuditEntryResolver,
  auditLogBasicMiddleware,
);

const wrappedBulkLogAuditEntries = withMiddleware(
  bulkLogAuditEntriesResolver,
  auditLogBasicMiddleware,
);

const wrappedArchiveAuditLogs = withMiddleware(
  archiveAuditLogsResolver,
  auditLogArchiveMiddleware,
);

const wrappedExportAuditLogs = withMiddleware(
  exportAuditLogsResolver,
  auditLogExportMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const auditLogMutations: Pick<
  MutationResolvers,
  | "logAuditEntry"
  | "bulkLogAuditEntries"
  | "archiveAuditLogs"
  | "exportAuditLogs"
> = {
  logAuditEntry: wrappedLogAuditEntry,
  bulkLogAuditEntries: wrappedBulkLogAuditEntries,
  archiveAuditLogs: wrappedArchiveAuditLogs,
  exportAuditLogs: wrappedExportAuditLogs,
};

export default auditLogMutations;
