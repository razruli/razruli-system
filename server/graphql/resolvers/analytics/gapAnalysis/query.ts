/**
 * ============================================================================
 * GapAnalysis Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for gap analysis queries

/** Require authentication + gapAnalysis:read permission */
const gapAnalysisReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["gapAnalysis:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single gap analysis by ID
 * Requires authentication to read analysis data
 */
const gapAnalysisResolver: QueryResolvers["gapAnalysis"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    const analysis = await context.services.gapAnalysis.getById(id);
    return analysis;
  } catch (error) {
    throw new Error(`Failed to fetch gap analysis: ${error}`);
  }
};

/**
 * List gap analyses with filtering and pagination
 * Supports filtering by company, department
 */
const gapAnalysesResolver: QueryResolvers["gapAnalyses"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // Convert GraphQL filter to service format
    const serviceFilter = filter
      ? {
          companyId: filter.companyId || undefined,
          departmentId: filter.departmentId || undefined,
        }
      : undefined;

    // Convert GraphQL pagination to service format
    // GraphQL uses: skip, take, orderBy: { field, order }
    // Service expects: skip, take, orderBy: { field, order }
    const servicePagination = pagination
      ? {
          skip: pagination.skip || 0,
          take: pagination.take || 20,
          orderBy: pagination.orderBy
            ? {
                field: pagination.orderBy.field,
                order: pagination.orderBy.order as "ASC" | "DESC",
              }
            : undefined,
        }
      : {
          skip: 0,
          take: 20,
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
        offset: result.skip,
        limit: result.take,
      },
    };
  } catch (error) {
    throw new Error(`Failed to list gap analyses: ${error}`);
  }
};

/**
 * Get gap analysis trend over time
 */
const gapAnalysisTrendResolver: QueryResolvers["gapAnalysisTrend"] = async (
  _parent,
  { dateRange },
) => {
  try {
    return [
      {
        date: new Date(dateRange.from),
        gap: 0,
        trend: "STABLE" as const,
      },
    ];
  } catch (error) {
    throw new Error(`Failed to fetch gap analysis trend: ${error}`);
  }
};

/**
 * Get gap criticality assessment
 */
const gapCriticalityAssessmentResolver: QueryResolvers["gapCriticalityAssessment"] =
  async (_parent, { companyId }, context) => {
    try {
      return {
        company: await context.services.company.getById(companyId),
        criticalityScore: 0,
        riskLevel: "LOW" as const,
        affectedDepartments: 0,
        priorityAreas: [] as string[],
      };
    } catch (error) {
      throw new Error(`Failed to fetch gap criticality assessment: ${error}`);
    }
  };

/**
 * Get hiring forecast
 */
const hiringForecastResolver: QueryResolvers["hiringForecast"] = async (
  _parent,
  { companyId },
  context,
) => {
  try {
    return {
      company: await context.services.company.getById(companyId),
      forecastPeriod: "6_MONTHS" as const,
      recommendedHires: 0,
      priorityRoles: [] as string[],
      estimatedCost: 0,
      timeline: [] as unknown[],
    };
  } catch (error) {
    throw new Error(`Failed to fetch hiring forecast: ${error}`);
  }
};

/**
 * Get latest company gap analysis
 */
const latestCompanyGapAnalysisResolver: QueryResolvers["latestCompanyGapAnalysis"] =
  async (_parent, { companyId }, context) => {
    try {
      return await context.services.gapAnalysis.getLatestForCompany(companyId);
    } catch (error) {
      throw new Error(`Failed to fetch latest company gap analysis: ${error}`);
    }
  };

/**
 * Get latest department gap analysis
 */
const latestDepartmentGapAnalysisResolver: QueryResolvers["latestDepartmentGapAnalysis"] =
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
  };

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedGapAnalysis = withMiddleware(
  gapAnalysisResolver,
  gapAnalysisReadMiddleware,
);

const wrappedGapAnalyses = withMiddleware(
  gapAnalysesResolver,
  gapAnalysisReadMiddleware,
);

const wrappedGapAnalysisTrend = withMiddleware(
  gapAnalysisTrendResolver,
  gapAnalysisReadMiddleware,
);

const wrappedGapCriticalityAssessment = withMiddleware(
  gapCriticalityAssessmentResolver,
  gapAnalysisReadMiddleware,
);

const wrappedHiringForecast = withMiddleware(
  hiringForecastResolver,
  gapAnalysisReadMiddleware,
);

const wrappedLatestCompanyGapAnalysis = withMiddleware(
  latestCompanyGapAnalysisResolver,
  gapAnalysisReadMiddleware,
);

const wrappedLatestDepartmentGapAnalysis = withMiddleware(
  latestDepartmentGapAnalysisResolver,
  gapAnalysisReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

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
  gapAnalysis: wrappedGapAnalysis,
  gapAnalyses: wrappedGapAnalyses,
  gapAnalysisTrend: wrappedGapAnalysisTrend,
  gapCriticalityAssessment: wrappedGapCriticalityAssessment,
  hiringForecast: wrappedHiringForecast,
  latestCompanyGapAnalysis: wrappedLatestCompanyGapAnalysis,
  latestDepartmentGapAnalysis: wrappedLatestDepartmentGapAnalysis,
};

export default gapAnalysisQueries;
