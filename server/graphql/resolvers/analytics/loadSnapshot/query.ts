/**
 * ============================================================================
 * LoadSnapshot Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for load snapshot queries

/** Require authentication + loadSnapshot:read permission */
const loadSnapshotReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["loadSnapshot:read"] },
);

/** Require authentication + loadSnapshot:read + analytics:read permissions */
const loadSnapshotWithAnalyticsMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["loadSnapshot:read", "analytics:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single load snapshot by ID
 * Requires authentication to read snapshot data
 */
const loadSnapshotResolver: QueryResolvers["loadSnapshot"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.loadSnapshot.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch load snapshot: ${error}`);
  }
};

/**
 * List load snapshots with filtering and pagination
 * Supports filtering by employee, timestamp range
 */
const loadSnapshotsResolver: QueryResolvers["loadSnapshots"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // Convert filter input to service format
    const serviceFilter = filter
      ? {
          employeeId: filter.employeeId,
          dateFrom: filter.dateRange?.from,
          dateTo: filter.dateRange?.to,
        }
      : undefined;

    // Convert pagination input to service format
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

    const result = await context.services.loadSnapshot.find(
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
    throw new Error(`Failed to list load snapshots: ${error}`);
  }
};

/**
 * Get load anomalies (unusual load patterns)
 */
const loadAnomaliesResolver: QueryResolvers["loadAnomalies"] = async (
  _parent,
  { companyId },
  context,
) => {
  try {
    const employees = await context.prisma.employee.findMany({
      where: { companyId },
    });

    const snapshots = await context.prisma.loadSnapshot.findMany({
      where: { employeeId: { in: employees.map((e) => e.id) } },
    });

    // Placeholder - return snapshots with extreme loads
    return snapshots.filter((s) => s.percentUsed > 150);
  } catch (error) {
    throw new Error(`Failed to fetch load anomalies: ${error}`);
  }
};

/**
 * Get latest load snapshot for an employee
 */
const latestEmployeeSnapshotResolver: QueryResolvers["latestEmployeeSnapshot"] =
  async (_parent, { employeeId }, context) => {
    try {
      return await context.prisma.loadSnapshot.findFirst({
        where: { employeeId },
        // orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch latest employee snapshot: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedLoadSnapshot = withMiddleware(
  loadSnapshotResolver,
  loadSnapshotReadMiddleware,
);

const wrappedLoadSnapshots = withMiddleware(
  loadSnapshotsResolver,
  loadSnapshotReadMiddleware,
);

const wrappedLoadAnomalies = withMiddleware(
  loadAnomaliesResolver,
  loadSnapshotWithAnalyticsMiddleware,
);

const wrappedLatestEmployeeSnapshot = withMiddleware(
  latestEmployeeSnapshotResolver,
  loadSnapshotReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const loadSnapshotQueries: Pick<
  QueryResolvers,
  "loadSnapshot" | "loadSnapshots" | "loadAnomalies" | "latestEmployeeSnapshot"
> = {
  loadSnapshot: wrappedLoadSnapshot,
  loadSnapshots: wrappedLoadSnapshots,
  loadAnomalies: wrappedLoadAnomalies,
  latestEmployeeSnapshot: wrappedLatestEmployeeSnapshot,
};

export default loadSnapshotQueries;
