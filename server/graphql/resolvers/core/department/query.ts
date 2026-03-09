/**
 * ============================================================================
 * Department Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for department queries

/** Require authentication + department:read permission */
const departmentReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:read"] },
);

/** Require authentication + department:read + process:read permissions */
const departmentWithProcessMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:read", "process:read"] },
);

/** Require authentication + department:read + analytics:read permissions */
const departmentWithAnalyticsMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:read", "analytics:read"] },
);

/** Require authentication + department:read + audit:read permissions */
const departmentWithAuditMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["department:read", "audit:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single department by ID
 */
const departmentResolver: QueryResolvers["department"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.department.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch department: ${error}`);
  }
};

/**
 * Get all departments for a company with filtering
 */
const departmentsResolver: QueryResolvers["departments"] = async (
  _parent,
  { filter },
  context,
) => {
  try {
    const serviceFilter = filter
      ? {
          companyId: filter.companyId,
          search: filter.search ?? undefined,
        }
      : undefined;

    const servicePagination = {
      offset: 0,
      limit: 10000,
      sortBy: "createdAt",
      sortOrder: "ASC" as const,
    };

    const result = await context.services.department.find(
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
    throw new Error(`Failed to list departments: ${error}`);
  }
};

/**
 * Get department with all employees and load metrics
 */
const departmentWithMetricsResolver: QueryResolvers["departmentWithMetrics"] =
  async (_parent, { id }, context) => {
    try {
      const department = await context.services.department.getById(id);
      if (!department) {
        return null;
      }

      // TODO: Fetch metrics from analytics service
      return {
        department,
        totalEmployees: 0,
        activeEmployees: 0,
        overloadedCount: 0,
        totalCapacity: 0,
        totalLoad: 0,
        loadIndex: 0,
      };
    } catch (error) {
      throw new Error(`Failed to fetch department metrics: ${error}`);
    }
  };

/**
 * Get processes assigned to a department
 */
const departmentProcessesResolver: QueryResolvers["departmentProcesses"] =
  async (_parent, { departmentId }, context) => {
    try {
      const processes = await context.prisma.process.findMany({
        where: { departmentId },
      });
      return processes;
    } catch (error) {
      throw new Error(`Failed to fetch department processes: ${error}`);
    }
  };

/**
 * Get load snapshots for a department
 */
const departmentSnapshotsResolver: QueryResolvers["departmentSnapshots"] =
  async (_parent, { departmentId }, context) => {
    try {
      const employees =
        await context.services.employee.getByDepartment(departmentId);
      const snapshotIds = employees.map((e) => e.id);

      const snapshots = await context.prisma.loadSnapshot.findMany({
        where: {
          employeeId: { in: snapshotIds },
        },
      });

      return snapshots;
    } catch (error) {
      throw new Error(`Failed to fetch department snapshots: ${error}`);
    }
  };

/**
 * Get gap comparison for department
 */
const departmentGapComparisonResolver: QueryResolvers["departmentGapComparison"] =
  async (_parent, { companyId }, context) => {
    try {
      const departments = await context.prisma.department.findMany({
        where: { companyId },
      });

      return departments.map((dept) => ({
        department: dept,
        gapAnalysis: null,
        headcountGap: 0,
        capacityGap: 0,
        gapStatus: "BALANCED" as any,
        riskLevel: "LOW" as any,
        comparedToCompanyAverage: 0,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch department gap comparison: ${error}`);
    }
  };

/**
 * Get department load overview
 */
const departmentLoadOverviewResolver: QueryResolvers["departmentLoadOverview"] =
  async (_parent, { departmentId }, context) => {
    try {
      const department =
        await context.services.department.getById(departmentId);
      if (!department) throw new Error("Department not found");

      return {
        department,
        totalEmployees: 0,
        overloadedEmployees: 0,
        averageUtilizationRate: 0,
        averageLoadIndex: 0,
        employeeBreakdown: [] as any,
        riskLevel: "LOW" as any,
      };
    } catch (error) {
      throw new Error(`Failed to fetch department load overview: ${error}`);
    }
  };

/**
 * Get department employee history record
 */
const departmentEmployeeHistoryResolver: QueryResolvers["departmentEmployeeHistory"] =
  async (_parent, { departmentId, dateRange }, context) => {
    try {
      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);

      const department =
        await context.services.department.getById(departmentId);
      if (!department) throw new Error("Department not found");

      return {
        department,
        reportPeriod: { from: startDate, to: endDate } as any,
        newHires: 0,
        departures: 0,
        transfers: 0,
        promotions: 0,
        demotions: 0,
        timeline: [] as any,
        capacityAdded: 0,
        capacityLost: 0,
        netCapacityChange: 0,
      };
    } catch (error) {
      throw new Error(`Failed to fetch department employee history: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedDepartment = withMiddleware(
  departmentResolver,
  departmentReadMiddleware,
);

const wrappedDepartments = withMiddleware(
  departmentsResolver,
  departmentReadMiddleware,
);

const wrappedDepartmentWithMetrics = withMiddleware(
  departmentWithMetricsResolver,
  departmentReadMiddleware,
);

const wrappedDepartmentProcesses = withMiddleware(
  departmentProcessesResolver,
  departmentWithProcessMiddleware,
);

const wrappedDepartmentSnapshots = withMiddleware(
  departmentSnapshotsResolver,
  departmentWithAnalyticsMiddleware,
);

const wrappedDepartmentGapComparison = withMiddleware(
  departmentGapComparisonResolver,
  departmentWithAnalyticsMiddleware,
);

const wrappedDepartmentLoadOverview = withMiddleware(
  departmentLoadOverviewResolver,
  departmentWithAnalyticsMiddleware,
);

const wrappedDepartmentEmployeeHistory = withMiddleware(
  departmentEmployeeHistoryResolver,
  departmentWithAuditMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const departmentQueries: Pick<
  QueryResolvers,
  | "department"
  | "departments"
  | "departmentWithMetrics"
  | "departmentProcesses"
  | "departmentSnapshots"
  | "departmentGapComparison"
  | "departmentLoadOverview"
  | "departmentEmployeeHistory"
> = {
  department: wrappedDepartment,
  departments: wrappedDepartments,
  departmentWithMetrics: wrappedDepartmentWithMetrics,
  departmentProcesses: wrappedDepartmentProcesses,
  departmentSnapshots: wrappedDepartmentSnapshots,
  departmentGapComparison: wrappedDepartmentGapComparison,
  departmentLoadOverview: wrappedDepartmentLoadOverview,
  departmentEmployeeHistory: wrappedDepartmentEmployeeHistory,
};

export default departmentQueries;
