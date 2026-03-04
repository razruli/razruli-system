import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const departmentQueries: Pick<
  QueryResolvers,
  "department" | "departments" | "departmentWithMetrics"
> = {
  /**
   * Get a single department by ID
   */
  department: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.department.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch department: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read"],
    },
  ),

  /**
   * Get all departments for a company with filtering
   */
  departments: withMiddleware(
    async (_parent, { filter }, context) => {
      try {
        const serviceFilter = filter
          ? {
              companyId: filter.companyId,
              search: filter.search,
            }
          : {};

        const result = await context.services.department.find(serviceFilter, {
          offset: 0,
          limit: 10000,
          sortBy: "createdAt",
          sortOrder: "ASC",
        });

        return {
          items: result.data,
          total: result.total,
        };
      } catch (error) {
        throw new Error(`Failed to list departments: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read"],
    },
  ),

  /**
   * Get department with all employees and load metrics
   */
  departmentWithMetrics: withMiddleware(
    async (_parent, { id, periodStart, periodEnd }, context) => {
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
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read"],
    },
  ),
};

export default departmentQueries;
