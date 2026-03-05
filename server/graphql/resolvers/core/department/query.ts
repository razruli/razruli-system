import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const departmentQueries: Pick<
  QueryResolvers,
  "department" | "departments" | "departmentWithMetrics" | "departmentProcesses" | "departmentSnapshots" | "departmentGapComparison" | "departmentLoadOverview" | "departmentEmployeeHistory"
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

  /**
   * Get processes assigned to a department
   */
  departmentProcesses: withMiddleware(
    async (_parent, { departmentId }, context) => {
      try {
        const processes = await context.prisma.process.findMany({
          where: { departmentId },
        });
        return processes;
      } catch (error) {
        throw new Error(`Failed to fetch department processes: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read", "process:read"],
    },
  ),

  /**
   * Get load snapshots for a department
   */
  departmentSnapshots: withMiddleware(
    async (_parent, { departmentId }, context) => {
      try {
        const employees = await context.services.employee.getByDepartment(
          departmentId,
        );
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
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read", "analytics:read"],
    },
  ),

  /**
   * Get gap comparison for department
   */
  departmentGapComparison: withMiddleware(
    async (_parent, { companyId }, context) => {
      try {
        const departments = await context.prisma.department.findMany({
          where: { companyId },
        });

        // Placeholder implementation
        return departments.map((dept) => ({
          department: dept,
          currentGap: 0,
          projectedGap: 0,
          gap_Percentage: 0,
          recommendedHirings: 0,
        }));
      } catch (error) {
        throw new Error(`Failed to fetch department gap comparison: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read", "analytics:read"],
    },
  ),

  /**
   * Get department load overview
   */
  departmentLoadOverview: withMiddleware(
    async (_parent, { departmentId }, context) => {
      try {
        const department = await context.services.department.getById(
          departmentId,
        );
        if (!department) throw new Error("Department not found");

        // Placeholder - returns basic structure
        return {
          department,
          totalCapacity: 0,
          allocatedLoad: 0,
          unallocatedCapacity: 0,
          loadPercentage: 0,
          employeeCount: 0,
          overloadedEmployees: 0,
        };
      } catch (error) {
        throw new Error(`Failed to fetch department load overview: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read", "analytics:read"],
    },
  ),

  /**
   * Get department employee history record
   */
  departmentEmployeeHistory: withMiddleware(
    async (_parent, { departmentId, dateRange }, context) => {
      try {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        const department = await context.services.department.getById(
          departmentId,
        );
        if (!department) throw new Error("Department not found");

        // Placeholder implementation
        return {
          department,
          from: startDate,
          to: endDate,
          hires: 0,
          departures: 0,
          transfers: 0,
          reassignments: 0,
          totalChanges: 0,
          records: [],
        };
      } catch (error) {
        throw new Error(
          `Failed to fetch department employee history: ${error}`,
        );
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["department:read", "audit:read"],
    },
  ),
};

export default departmentQueries;
