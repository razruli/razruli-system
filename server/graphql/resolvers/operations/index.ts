/**
 * ============================================================================
 * OPERATIONS DOMAIN - Resolver Index
 * ============================================================================
 * Unified resolver composition for business operations:
 * - Process: Workflow processes and operations
 * - TaskAssignment: Task assignments to employees
 *
 * Exports all resolvers for use in main resolver composition layer
 */

import { finishedTaskResolvers } from "./finishedTask";
import { processResolvers } from "./process";
import { taskAssignmentResolvers } from "./taskAssignment";

/**
 * Complete resolver set for Operations domain
 * Merges all entity resolvers together
 */
export const operationsResolvers = {
  // Query resolvers from all entities
  Query: {
    ...processResolvers.Query,
    ...taskAssignmentResolvers.Query,
    ...finishedTaskResolvers.Query,
  },

  // Mutation resolvers from all entities
  Mutation: {
    ...processResolvers.Mutation,
    ...taskAssignmentResolvers.Mutation,
  },

  // Subscription resolvers from all entities
  Subscription: {
    ...processResolvers.Subscription,
    ...taskAssignmentResolvers.Subscription,
  },

  // Type field resolvers
  Process: processResolvers.Process,
  ProcessMetrics: processResolvers.ProcessMetrics,
  TaskAssignment: taskAssignmentResolvers.TaskAssignment,
  TaskAssignmentMetrics: taskAssignmentResolvers.TaskAssignmentMetrics,
  EmployeeTaskStats: taskAssignmentResolvers.EmployeeTaskStats,
  TaskStatusCount: taskAssignmentResolvers.TaskStatusCount,
  TaskTypeCount: taskAssignmentResolvers.TaskTypeCount,
};

// Export individual entities for selective imports
export { processResolvers } from "./process";
export { taskAssignmentResolvers } from "./taskAssignment";
export { finishedTaskResolvers } from "./finishedTask";

export default operationsResolvers;
