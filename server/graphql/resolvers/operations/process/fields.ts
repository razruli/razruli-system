/**
 * ============================================================================
 * Process Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import type {
  ProcessResolvers,
  ProcessMetricsResolvers,
  ComplexityLevel,
  BusinessImpactLevel,
  NewnessLevel,
  ProcessStatusEnum,
} from "@/server/graphql/types/generated";

// Explicitly define enum field resolvers with correct typing
const enumFieldResolvers = {
  /**
   * Resolve and normalize complexity enum
   * Database stores lowercase ("standard"), GraphQL expects uppercase ("STANDARD")
   */
  complexity: (parent: any): ComplexityLevel => {
    return parent.complexity.toUpperCase() as ComplexityLevel;
  },

  /**
   * Resolve and normalize businessImpact enum
   * Database stores lowercase ("medium"), GraphQL expects uppercase ("MEDIUM")
   */
  businessImpact: (parent: any): BusinessImpactLevel => {
    return parent.businessImpact.toUpperCase() as BusinessImpactLevel;
  },

  /**
   * Resolve and normalize newness enum
   * Database stores lowercase ("routine"), GraphQL expects uppercase ("ROUTINE")
   */
  newness: (parent: any): NewnessLevel => {
    return parent.newness.toUpperCase() as NewnessLevel;
  },

  /**
   * Resolve and normalize status enum
   * Database stores lowercase ("open"), GraphQL expects uppercase ("OPEN")
   */
  status: (parent: any): ProcessStatusEnum => {
    return parent.status.toUpperCase() as ProcessStatusEnum;
  },
};

export const processFieldResolvers: Pick<
  ProcessResolvers,
  "company" | "department" | "targetGrade" | "taskAssignments"
> &
  typeof enumFieldResolvers = {
  ...enumFieldResolvers,

  /**
   * Resolve process's company
   */
  company: async (parent, _args, context) => {
    try {
      const company = await context.services.company.getById(parent.companyId);
      if (!company) {
        throw new Error(`Company not found: ${parent.companyId}`);
      }
      return company;
    } catch (error) {
      throw new Error(`Failed to load company: ${error}`);
    }
  },

  /**
   * Resolve process's department
   */
  department: async (parent, _args, context) => {
    try {
      const department = await context.services.department.getById(
        parent.departmentId,
      );
      if (!department) {
        throw new Error(`Department not found: ${parent.departmentId}`);
      }
      return department;
    } catch (error) {
      throw new Error(`Failed to load department: ${error}`);
    }
  },

  /**
   * Resolve process's target grade
   */
  targetGrade: async (parent, _args, context) => {
    try {
      // Convert Int targetGradeId to string for Grade service
      const grade = await context.services.grade.getById(
        String(parent.targetGradeId),
      );
      if (!grade) {
        throw new Error(`Grade not found: ${parent.targetGradeId}`);
      }
      return grade;
    } catch (error) {
      throw new Error(`Failed to load target grade: ${error}`);
    }
  },

  /**
   * Resolve task assignments for this process
   */
  taskAssignments: async (parent, _args, context) => {
    try {
      return await context.services.taskAssignment.findByProcess(parent.id);
    } catch (error) {
      throw new Error(`Failed to load task assignments: ${error}`);
    }
  },
};

export const processMetricsFieldResolvers: Pick<
  ProcessMetricsResolvers,
  "process"
> = {
  /**
   * Resolve process for this metrics object
   */
  process: async (parent, _args, context) => {
    try {
      const process = await context.services.process.getById(
        (parent.process! as any).id,
      );
      if (!process) {
        throw new Error(`Process not found: ${(parent.process! as any).id}`);
      }
      return process;
    } catch (error) {
      throw new Error(`Failed to load process: ${error}`);
    }
  },
};
