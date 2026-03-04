/**
 * ============================================================================
 * GapAnalysis Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields using DataLoaders to prevent N+1 queries
 */

import {
  GapAnalysisResolvers,
  DepartmentGapComparisonResolvers,
  HiringForecastResolvers,
  TalentCategoryResolvers,
} from "@/server/graphql/types/generated";
import { logger } from "@/server/utils/logger/logger";

export const gapAnalysisFieldResolvers: Pick<
  GapAnalysisResolvers,
  "company" | "department"
> = {
  /**
   * Resolve company for this gap analysis (required field)
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
   * Resolve department for this gap analysis (optional)
   */
  department: async (parent, _args, context) => {
    try {
      if (!parent.departmentId) return null;
      return await context.services.department.getById(parent.departmentId);
    } catch (error) {
      logger.debug(`Failed to load department: ${error}`);
      return null;
    }
  },
};

export const departmentGapComparisonFieldResolvers: Pick<
  DepartmentGapComparisonResolvers,
  "department" | "gapAnalysis"
> = {
  /**
   * Resolve department for this gap comparison
   */
  department: async (parent, _args, context) => {
    try {
      const department = await context.services.department.getById(
        parent.department.id,
      );
      if (!department) {
        throw new Error(`Department not found: ${parent.department.id}`);
      }
      return department;
    } catch (error) {
      logger.error(`Failed to load department: ${error}`);
      throw error;
    }
  },

  /**
   * Resolve gap analysis for this comparison (optional)
   */
  gapAnalysis: async (parent, _args, _context) => {
    try {
      // Return the parent's gapAnalysis data if available
      // Field resolvers on GapAnalysis will resolve nested fields
      if (!parent.gapAnalysis) return null;
      return parent.gapAnalysis as any;
    } catch (error) {
      logger.debug(`Failed to load gap analysis: ${error}`);
      return null;
    }
  },
};

export const talentCategoryFieldResolvers: Pick<
  TalentCategoryResolvers,
  "grade"
> = {
  /**
   * Resolve grade for this talent category
   */
  grade: async (parent, _args, context) => {
    try {
      const grade = await context.services.grade.getById(parent.gradeId);
      if (!grade) {
        throw new Error(`Grade not found: ${parent.gradeId}`);
      }
      return grade;
    } catch (error) {
      console.error(`Failed to load grade: ${error}`);
      throw error;
    }
  },
};

export const hiringForecastFieldResolvers: Pick<
  HiringForecastResolvers,
  "gapAnalysis"
> = {
  /**
   * Resolve gap analysis for this hiring forecast
   */
  gapAnalysis: async (parent, _args, _context) => {
    try {
      // Return the parent's gapAnalysis data which already contains all necessary fields
      // Field resolvers on GapAnalysis will resolve nested fields (company, department, hiringPlan)
      return parent.gapAnalysis as any;
    } catch (error) {
      console.error(`Failed to load gap analysis: ${error}`);
      throw error;
    }
  },
};

export const hiringPlanFieldResolvers: Record<string, never> = {};

export const gapCriticalityAssessmentFieldResolvers: Record<string, never> = {};
