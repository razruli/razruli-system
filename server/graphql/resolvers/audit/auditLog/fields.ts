/**
 * ============================================================================
 * AuditLog Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import type {
  ChangeByUserResolvers,
  UserActivitySummaryResolvers,
  ComplianceReportResolvers,
  EntityAuditTrailResolvers,
  SecurityIncidentReportResolvers,
  ActionTypeSummaryResolvers,
} from "@/server/graphql/types/generated";

/**
 * AuditLog field resolvers
 * All scalar fields are resolved by default
 */
export const auditLogFieldResolvers: Record<string, never> = {};

/**
 * ActionTypeSummary field resolvers
 * All fields are scalars - no nested resolvers needed
 */
export const actionTypeSummaryFieldResolvers: ActionTypeSummaryResolvers = {
  actionType: async (parent) => parent.actionType,
  count: async (parent) => parent.count,
  failureCount: async (parent) => parent.failureCount,
  successCount: async (parent) => parent.successCount,
};

/**
 * ChangeTypeSummary field resolvers
 * All fields are scalars - no nested resolvers needed
 */
export const changeTypeSummaryFieldResolvers: Record<string, never> = {};

/**
 * ChangeByUser field resolvers
 * Resolves the nested User object
 */
export const changeByUserFieldResolvers: Pick<ChangeByUserResolvers, "user"> = {
  /**
   * Resolve user who made the changes
   */
  user: async (parent, _args, context) => {
    try {
      // User is included in parent if available
      const parentWithUser = parent as any;
      if (parentWithUser.user) {
        return parentWithUser.user;
      }
      // Fallback: fetch user by ID from database
      const user = await context.prisma.user.findUnique({
        where: { id: parentWithUser.currentUserId || parentWithUser.userId },
      });
      if (!user) {
        throw new Error(
          `User not found: ${parentWithUser.currentUserId || parentWithUser.userId}`,
        );
      }
      return user;
    } catch (error) {
      throw new Error(
        `Failed to load user for ChangeByUser: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
};

/**
 * UserActivitySummary field resolvers
 * Resolves nested User object
 */
export const userActivitySummaryFieldResolvers: Pick<
  UserActivitySummaryResolvers,
  "user"
> = {
  /**
   * Resolve the user for this activity summary
   */
  user: async (parent, _args, context) => {
    try {
      // User is included in parent if available
      const parentWithUser = parent as any;
      if (parentWithUser.user) {
        return parentWithUser.user;
      }
      // Fallback: fetch user by ID from database
      const user = await context.prisma.user.findUnique({
        where: { id: parentWithUser.userId },
      });
      if (!user) {
        throw new Error(`User not found: ${parentWithUser.userId}`);
      }
      return user;
    } catch (error) {
      throw new Error(
        `Failed to load user for UserActivitySummary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
};

/**
 * EntityAuditTrail field resolvers
 * Resolves nested User objects in changesByUser
 */
export const entityAuditTrailFieldResolvers: Pick<
  EntityAuditTrailResolvers,
  "changesByUser"
> = {
  /**
   * Resolve users for each change record
   */
  changesByUser: async (parent, _args, context) => {
    try {
      if (!parent.changesByUser || parent.changesByUser.length === 0) {
        return [];
      }

      // Load all users for changes in parallel
      const userIds = parent.changesByUser.map((c) => {
        const changeWithUser = c as any;
        return changeWithUser.user?.id || changeWithUser.userId;
      });

      const users = await Promise.all(
        userIds.map((id) =>
          context.prisma.user.findUnique({
            where: { id },
          }),
        ),
      );

      // Map users back to changes
      return parent.changesByUser.map((change, index) => ({
        ...(change as any),
        user: users[index],
      }));
    } catch (error) {
      throw new Error(
        `Failed to load users for EntityAuditTrail: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
};

/**
 * ComplianceReport field resolvers
 * Resolves nested Company object
 */
export const complianceReportFieldResolvers: Pick<
  ComplianceReportResolvers,
  "company"
> = {
  /**
   * Resolve the company for this compliance report
   */
  company: async (parent, _args, context) => {
    try {
      const company = await context.services.company.getById(parent.company.id);
      if (!company) {
        throw new Error(`Company not found: ${parent.company.id}`);
      }
      return company;
    } catch (error) {
      throw new Error(
        `Failed to load company for ComplianceReport: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
};

/**
 * SecurityIncidentReport field resolvers
 * Resolves nested Company object
 */
export const securityIncidentReportFieldResolvers: Pick<
  SecurityIncidentReportResolvers,
  "company"
> = {
  /**
   * Resolve the company for this security report
   */
  company: async (parent, _args, context) => {
    try {
      const company = await context.services.company.getById(parent.company.id);
      if (!company) {
        throw new Error(`Company not found: ${parent.company.id}`);
      }
      return company;
    } catch (error) {
      throw new Error(
        `Failed to load company for SecurityIncidentReport: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
};

/**
 * Aggregate all field resolvers
 */
export const auditLogAllFieldResolvers = {
  AuditLog: auditLogFieldResolvers,
  ActionTypeSummary: actionTypeSummaryFieldResolvers,
  ChangeTypeSummary: changeTypeSummaryFieldResolvers,
  ChangeByUser: changeByUserFieldResolvers,
  UserActivitySummary: userActivitySummaryFieldResolvers,
  EntityAuditTrail: entityAuditTrailFieldResolvers,
  ComplianceReport: complianceReportFieldResolvers,
  SecurityIncidentReport: securityIncidentReportFieldResolvers,
};

export default auditLogAllFieldResolvers;
