/**
 * ============================================================================
 * TaskAssignment Domain - Resolver Index
 * ============================================================================
 * Exports all task assignment resolvers (query, mutation, fields, subscription)
 */
import {
  employeeTaskStatsFieldResolvers,
  taskAssignmentFieldResolvers,
  taskAssignmentMetricsFieldResolvers,
} from "./fields";
import taskAssignmentMutations from "./mutation";
import taskAssignmentQueries from "./query";
import taskAssignmentSubscriptions from "./subscription";

/**
 * Complete resolver set for TaskAssignment domain
 */
export const taskAssignmentResolvers = {
  Query: {
    taskAssignment: taskAssignmentQueries.taskAssignment,
    taskAssignments: taskAssignmentQueries.taskAssignments,
  },

  Mutation: {
    createTaskAssignment: taskAssignmentMutations.createTaskAssignment,
    updateTaskAssignment: taskAssignmentMutations.updateTaskAssignment,
    deleteTaskAssignment: taskAssignmentMutations.deleteTaskAssignment,
  },

  Subscription: {
    ...taskAssignmentSubscriptions,
  },

  TaskAssignment: taskAssignmentFieldResolvers,
  TaskAssignmentMetrics: taskAssignmentMetricsFieldResolvers,
  EmployeeTaskStats: employeeTaskStatsFieldResolvers,
};

export {
  taskAssignmentQueries,
  taskAssignmentMutations,
  taskAssignmentSubscriptions,
  taskAssignmentFieldResolvers,
  taskAssignmentMetricsFieldResolvers,
  employeeTaskStatsFieldResolvers,
};

export default taskAssignmentResolvers;
