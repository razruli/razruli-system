/**
 * ============================================================================
 * EmployeeHistory Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for employee history mutations

/** Require authentication for basic history recording */
const employeeHistoryBasicMiddleware = composeMiddleware({ requireAuth: true });

/** Require authentication + employeeHistory:approve permission */
const employeeHistoryApproveMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employeeHistory:approve"] },
);

/** Require authentication + employeeHistory:reject permission */
const employeeHistoryRejectMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employeeHistory:reject"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Record employee history entry
 */
const recordEmployeeHistoryResolver: MutationResolvers["recordEmployeeHistory"] =
  async (_parent, { input }, context) => {
    try {
      return await context.services.employeeHistory.record(input);
    } catch (error) {
      throw new Error(`Failed to record employee history: ${error}`);
    }
  };

/**
 * Approve employee history change
 */
const approveEmployeeHistoryResolver: MutationResolvers["approveEmployeeHistory"] =
  async (_parent, { id }, context) => {
    try {
      return await context.services.employeeHistory.approve(id);
    } catch (error) {
      throw new Error(`Failed to approve employee history: ${error}`);
    }
  };

/**
 * Reject employee history change
 */
const rejectEmployeeHistoryResolver: MutationResolvers["rejectEmployeeHistory"] =
  async (_parent, { id, rejectionReason }, context) => {
    try {
      return await context.services.employeeHistory.reject(id, rejectionReason);
    } catch (error) {
      throw new Error(`Failed to reject employee history: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedRecordEmployeeHistory = withMiddleware(
  recordEmployeeHistoryResolver,
  employeeHistoryBasicMiddleware,
);

const wrappedApproveEmployeeHistory = withMiddleware(
  approveEmployeeHistoryResolver,
  employeeHistoryApproveMiddleware,
);

const wrappedRejectEmployeeHistory = withMiddleware(
  rejectEmployeeHistoryResolver,
  employeeHistoryRejectMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const employeeHistoryMutations: Pick<
  MutationResolvers,
  "recordEmployeeHistory" | "approveEmployeeHistory" | "rejectEmployeeHistory"
> = {
  recordEmployeeHistory: wrappedRecordEmployeeHistory,
  approveEmployeeHistory: wrappedApproveEmployeeHistory,
  rejectEmployeeHistory: wrappedRejectEmployeeHistory,
};

export default employeeHistoryMutations;
