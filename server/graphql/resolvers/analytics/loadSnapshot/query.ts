/**
 * ============================================================================
 * LoadSnapshot Domain - Query Resolvers
 * ============================================================================
 * Handles all load snapshot-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const loadSnapshotQueries: Pick<
  QueryResolvers,
  "loadSnapshot" | "loadSnapshots" | "loadAnomalies" | "latestEmployeeSnapshot"
> = {
  /**
   * Get a single load snapshot by ID
   * Requires authentication to read snapshot data
   */
  loadSnapshot: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.loadSnapshot.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch load snapshot: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["loadSnapshot:read"],
    },
  ),

  /**
   * List load snapshots with filtering and pagination
   * Supports filtering by employee, timestamp range
   */
  loadSnapshots: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              employeeId: filter.employeeId,
              dateFrom: filter.dateFrom,
              dateTo: filter.dateTo,
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
            offset: servicePagination.offset,
            limit: servicePagination.limit,
          },
        };
      } catch (error) {
        throw new Error(`Failed to list load snapshots: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["loadSnapshot:read"],
    },
  ),

  /**
   * Get load snapshots for a specific employee
   */
  // employeeLoadSnapshots: withMiddleware(
  //   async (_parent, { employeeId }, context) => {
  //     try {
  //       return await context.services.loadSnapshot.findByEmployee(employeeId);
  //     } catch (error) {
  //       throw new Error(`Failed to fetch employee load snapshots: ${error}`);
  //     }
  //   },
  //   {
  //     requireAuth: true,
  //     requiredPermissions: ["loadSnapshot:read"],
  //   },
  // ),

  /**
   * Get load anomalies (unusual load patterns)
   */
  loadAnomalies: withMiddleware(
    async (_parent, { companyId }, context) => {
      try {
        const employees = await context.prisma.employee.findMany({
          where: { companyId },
        });

        const snapshots = await context.prisma.loadSnapshot.findMany({
          where: { employeeId: { in: employees.map((e) => e.id) } },
        });

        // Placeholder - return snapshots with extreme loads
        return snapshots.filter((s) => (s.allocatedLoad as any) > 150);
      } catch (error) {
        throw new Error(`Failed to fetch load anomalies: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["loadSnapshot:read", "analytics:read"],
    },
  ),

  /**
   * Get latest load snapshot for an employee
   */
  latestEmployeeSnapshot: withMiddleware(
    async (_parent, { employeeId }, context) => {
      try {
        return await context.prisma.loadSnapshot.findFirst({
          where: { employeeId },
          orderBy: { createdAt: "desc" },
        });
      } catch (error) {
        throw new Error(`Failed to fetch latest employee snapshot: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["loadSnapshot:read"],
    },
  ),
};

export default loadSnapshotQueries;
