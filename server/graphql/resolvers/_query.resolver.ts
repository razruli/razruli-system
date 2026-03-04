/**
 * ============================================================================
 * MAIN QUERY RESOLVER
 * ============================================================================
 * Unified composition of all domain query resolvers
 * Imports and composes queries from:
 * - Core domain (company, department, employee, grade)
 * - Operations domain (process, taskAssignment)
 * - Analytics domain (gapAnalysis, loadSnapshot)
 * - Audit domain (auditLog, employeeHistory)
 * - User domain
 */

import { QueryResolvers } from "../types/generated";

import { analyticsResolvers } from "./analytics";
import { auditResolvers } from "./audit";
import { coreResolvers } from "./core";
import { operationsResolvers } from "./operations";

/**
 * Unified Query resolver
 * Combines all domain-specific query resolvers
 */
export const queryResolver: QueryResolvers = {
  // Health check
  health: async () => {
    return "ok";
  },

  // Core domain queries
  ...coreResolvers.Query,

  // Operations domain queries
  ...operationsResolvers.Query,

  // Analytics domain queries
  ...analyticsResolvers.Query,

  // Audit domain queries
  ...auditResolvers.Query,
};

export default queryResolver;
