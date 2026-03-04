/**
 * ============================================================================
 * CORE DOMAIN - Resolver Index
 * ============================================================================
 * Unified resolver composition for core business entities:
 * - Company: Organizations and their hierarchy
 * - Department: Company departments and structure
 * - Employee: Staff members and their assignments
 * - Grade: Professional levels and compensation bands
 *
 * Exports all resolvers for use in main resolver composition layer
 */

import { companyResolvers } from "./company";
import { departmentResolvers } from "./department";
import { employeeResolvers } from "./employee";
import { gradeResolvers } from "./grade";

/**
 * Complete resolver set for Core domain
 * Merges all entity resolvers together
 */
export const coreResolvers = {
  // Query resolvers from all entities
  Query: {
    ...companyResolvers.Query,
    ...departmentResolvers.Query,
    ...employeeResolvers.Query,
    ...gradeResolvers.Query,
  },

  // Mutation resolvers from all entities
  Mutation: {
    ...companyResolvers.Mutation,
    ...departmentResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...gradeResolvers.Mutation,
  },

  // Subscription resolvers from all entities
  Subscription: {
    ...companyResolvers.Subscription,
    ...departmentResolvers.Subscription,
    ...employeeResolvers.Subscription,
    ...gradeResolvers.Subscription,
  },

  // Type field resolvers
  Company: companyResolvers.Company,
  Department: departmentResolvers.Department,
  DepartmentMetrics: departmentResolvers.DepartmentMetrics,
  Employee: employeeResolvers.Employee,
  Grade: gradeResolvers.Grade,
  GradeStats: gradeResolvers.GradeStats,
};

// Export individual entities for selective imports
export { companyResolvers } from "./company";
export { departmentResolvers } from "./department";
export { employeeResolvers } from "./employee";
export { gradeResolvers } from "./grade";

export default coreResolvers;
