/**
 * ============================================================================
 * UNIFIED RESOLVER COMPOSITION
 * ============================================================================
 * Central hub for all GraphQL resolvers
 * Merges Query, Mutation, Subscription resolvers from all domains
 *
 * Domain structure:
 * - Core: Company, Department, Employee, Grade
 * - Operations: Process, TaskAssignment
 * - Analytics: GapAnalysis, LoadSnapshot
 * - Audit: AuditLog, EmployeeHistory
 * - User: User management
 */

import { Resolvers } from "../types/generated";

import { mutationResolver } from "./_mutation.resolver";
import { queryResolver } from "./_query.resolver";
// import subscriptionResolver from "./_subscription.resolver";
import { typeResolvers } from "./_typeResolvers";

/**
 * Unified resolver composition
 * Merges all domain resolvers with their:
 * - Query root resolvers
 * - Mutation root resolvers
 * - Subscription root resolvers
 * - Type field resolvers
 * - Scalar resolvers
 */
export const resolvers: Resolvers = {
  // ========== ROOT OPERATIONS ==========
  Query: queryResolver,
  Mutation: mutationResolver,
  // Subscription: subscriptionResolver,
  ...typeResolvers,
};

export default resolvers;
