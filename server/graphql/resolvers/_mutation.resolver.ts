/**
 * ============================================================================
 * MAIN MUTATION RESOLVER
 * ============================================================================
 * Unified composition of all domain mutation resolvers
 * Imports and composes mutations from:
 * - Core domain (company, department, employee, grade)
 * - Operations domain (process, taskAssignment)
 * - Analytics domain (gapAnalysis, loadSnapshot)
 * - Audit domain (auditLog, employeeHistory)
 * - User domain
 */

import { MutationResolvers } from "../types/generated";

import { analyticsResolvers } from "./analytics";
import { auditResolvers } from "./audit";
import { coreResolvers } from "./core";
import { operationsResolvers } from "./operations";

/**
 * Unified Mutation resolver
 * Combines all domain-specific mutation resolvers
 */
export const mutationResolver: MutationResolvers = {
  // Core domain mutations
  ...coreResolvers.Mutation,

  // Operations domain mutations
  ...operationsResolvers.Mutation,

  // Analytics domain mutations
  ...analyticsResolvers.Mutation,

  // Audit domain mutations
  ...auditResolvers.Mutation,
};

export default mutationResolver;
