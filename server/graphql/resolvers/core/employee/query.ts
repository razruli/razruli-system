/**
 * ============================================================================
 * Employee Domain - Query Resolvers
 * ============================================================================
 * Handles all employee-related queries with middleware orchestration
 */

import { QueryResolvers } from "@/server/graphql/generated";
import { withMiddleware } from "@/server/graphql/middleware";

export const employeeQueries: QueryResolvers = {
  /**
   * Get a single employee by ID
   * Requires authentication to read employee data
   */
  employee: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.employee.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch employee: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:read"],
    },
  ),

  /**
   * List employees with filtering and pagination
   * Supports filtering by department, status, efficiency
   */
  employees: withMiddleware(
    async (_parent, { filter, pagination }, context) => {
      try {
        // Convert filter input to service format
        const serviceFilter = filter
          ? {
              companyId: filter.companyId,
              departmentId: filter.departmentId,
              gradeId: filter.gradeId,
              status: filter.status,
              search: filter.search,
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

        const result = await context.services.employee.find(
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
        throw new Error(`Failed to list employees: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:read"],
    },
  ),

  /**
   * Get employees in a specific department
   * Returns all active employees in that department
   */
  departmentEmployees: withMiddleware(
    async (_parent, { departmentId }, context) => {
      try {
        const employees =
          await context.services.employee.getByDepartment(departmentId);

        return employees;
      } catch (error) {
        throw new Error(`Failed to fetch department employees: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:read", "department:read"],
    },
  ),

  /**
   * Get employee capacity as percentage
   * Returns current capacity utilization (0-200)
   */
  employeeCapacity: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        // Verify employee exists
        await context.services.employee.getByIdOrThrow(id);

        // Calculate capacity as percentage
        // This is the allocated load / available capacity
        const capacity = await context.services.employee.calculateCapacity(id);

        return capacity;
      } catch (error) {
        throw new Error(`Failed to fetch employee capacity: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:read", "analytics:read"],
    },
  ),

  /**
   * Get employee load index for workload analysis
   * Returns load as percentage for the given period
   */
  employeeLoadIndex: withMiddleware(
    async (_parent, { id, periodStart, periodEnd }, context) => {
      try {
        // Make sure dates are in the right order
        const start = new Date(periodStart);
        const end = new Date(periodEnd);

        if (start > end) {
          throw new Error("periodStart must be before periodEnd");
        }

        // Calculate load index for the period
        const loadIndex = await context.services.employee.calculateLoadIndex(
          id,
          start,
          end,
        );

        return loadIndex;
      } catch (error) {
        throw new Error(`Failed to fetch employee load index: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["employee:read", "analytics:read"],
    },
  ),
};

export default employeeQueries;
