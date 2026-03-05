/**
 * ============================================================================
 * GapAnalysis Domain - Query Resolvers
 * ============================================================================
 * Handles all gap analysis-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const gapAnalysisQueries: Pick<
  QueryResolvers,
  | "gapAnalysis"
  | "gapAnalyses"
  | "gapAnalysisTrend"
  | "gapCriticalityAssessment"
  | "hiringForecast"
  | "latestCompanyGapAnalysis"
  | "latestDepartmentGapAnalysis"
> = {
  /**
   * Get a single gap analysis by ID
   * Requires authentication to read analysis data
   */
  gapAnalysis: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.gapAnalysis.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch gap analysis: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * List gap analyses with filtering and pagination
   * Supports filtering by company, department
   */
  gapAnalyses: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              companyId: filter.companyId,
              departmentId: filter.departmentId,
            }
          : {};

        // Convert pagination input to service format
        const servicePagination = pagination
          ? {
              offset: pagination.offset || 0,
              limit: pagination.limit || 20,
              sortBy: pagination.sortBy || "createdAt",
              sortOrder: pagination.sortOrder || "ASC",
            }
          : {
              offset: 0,
              limit: 20,
              sortBy: "createdAt",
              sortOrder: "ASC",
            };

        const result = await context.services.gapAnalysis.find(
          serviceFilter,
          servicePagination,
        );

        return {
          nodes: result.data,
          totalCount: result.total,
          pageInfo: {
            total: result.total,
            hasMore: result.hasMore,
            offset: servicePagination.offset,
            limit: servicePagination.limit,
          },
        };
      } catch (error) {
        throw new Error(`Failed to list gap analyses: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * Get gap analysis trend over time
   */
  gapAnalysisTrend: withMiddleware(
    async (_parent, { companyId, dateRange }, context) => {
      try {
        return [
          {
            date: new Date(dateRange.start),
            gap: 0,
            trend: "STABLE",
          },
        ];
      } catch (error) {
        throw new Error(`Failed to fetch gap analysis trend: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * Get gap criticality assessment
   */
  gapCriticalityAssessment: withMiddleware(
    async (_parent, { companyId }, context) => {
      try {
        return {
          company: await context.services.company.getById(companyId),
          criticalityScore: 0,
          riskLevel: "LOW",
          affectedDepartments: 0,
          priorityAreas: [],
        };
      } catch (error) {
        throw new Error(`Failed to fetch gap criticality assessment: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * Get hiring forecast
   */
  hiringForecast: withMiddleware(
    async (_parent, { companyId }, context) => {
      try {
        return {
          company: await context.services.company.getById(companyId),
          forecastPeriod: "6_MONTHS",
          recommendedHires: 0,
          priorityRoles: [],
          estimatedCost: 0,
          timeline: [],
        };
      } catch (error) {
        throw new Error(`Failed to fetch hiring forecast: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * Get latest company gap analysis
   */
  latestCompanyGapAnalysis: withMiddleware(
    async (_parent, { companyId }, context) => {
      try {
        return await context.services.gapAnalysis.getLatestForCompany(
          companyId,
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch latest company gap analysis: ${error}`,
        );
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),

  /**
   * Get latest department gap analysis
   */
  latestDepartmentGapAnalysis: withMiddleware(
    async (_parent, { departmentId }, context) => {
      try {
        return await context.services.gapAnalysis.getLatestForDepartment(
          departmentId,
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch latest department gap analysis: ${error}`,
        );
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["gapAnalysis:read"],
    },
  ),
};

export default gapAnalysisQueries;
