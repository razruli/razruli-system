/**
 * ============================================================================
 * EmployeeHistory Domain - Mutation Resolvers
 * ============================================================================
 * Mutations for employee history tracking
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

export const employeeHistoryMutations: Pick<
  MutationResolvers,
  "recordEmployeeHistory" | "approveEmployeeHistory" | "rejectEmployeeHistory"
> = {
  /**
   * Record employee history entry
   */
  recordEmployeeHistory: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        return await context.services.employeeHistory.record(input);
      } catch (error) {
        throw new Error(`Failed to record employee history: ${error}`);
      }
    },
    {
      requireAuth: true,
    },
  ),

  /**
   * Approve employee history change
   */
  approveEmployeeHistory: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.employeeHistory.approve(id);
      } catch (error) {
        throw new Error(`Failed to approve employee history: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employeeHistory:approve"],
    },
  ),

  /**
   * Reject employee history change
   */
  rejectEmployeeHistory: withMiddleware(
    async (_parent, { id, rejectionReason }, context) => {
      try {
        return await context.services.employeeHistory.reject(
          id,
          rejectionReason,
        );
      } catch (error) {
        throw new Error(`Failed to reject employee history: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employeeHistory:reject"],
    },
  ),
};

export default employeeHistoryMutations;
