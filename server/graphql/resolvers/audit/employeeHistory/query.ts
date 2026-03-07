/**
 * ============================================================================
 * EmployeeHistory Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for employee history queries

/** Require authentication + employeeHistory:read permission */
const employeeHistoryReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employeeHistory:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single employee history record by ID
 * Requires authentication to read history data
 */
const employeeHistoryResolver: QueryResolvers["employeeHistory"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.employeeHistory.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch employee history: ${error}`);
  }
};

/**
 * List employee history records with filtering and pagination
 * Supports filtering by employee, date range
 */
const employeeHistoriesResolver: QueryResolvers["employeeHistories"] = async (
  _parent,
  { filter, pagination },
  context,
) => {
  try {
    // Convert filter input to service format
    const serviceFilter = filter
      ? {
          employeeId: filter.employeeId,
          changeType: filter.changeType,
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

    const result = await context.services.employeeHistory.find(
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
    throw new Error(`Failed to list employee histories: ${error}`);
  }
};

/**
 * Get history for a specific employee
 */
const employeeChangeHistoryResolver: QueryResolvers["employeeChangeHistory"] =
  async (_parent, { employeeId }, context) => {
    try {
      return await context.services.employeeHistory.findByEmployee(employeeId);
    } catch (error) {
      throw new Error(`Failed to fetch employee change history: ${error}`);
    }
  };

/**
 * Get full history for an employee with pagination
 */
const employeeHistoryListResolver: QueryResolvers["employeeHistoryList"] =
  async (_parent, { employeeId, filter, pagination }, context) => {
    try {
      // Build service filter
      const serviceFilter = {
        employeeId,
        ...(filter && {
          changeType: filter.changeType,
          changedBy: filter.changedBy,
          dateFrom: filter.dateRange?.from,
          dateTo: filter.dateRange?.to,
        }),
      };

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

      const result = await context.services.employeeHistory.find(
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
      throw new Error(`Failed to fetch employee history list: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedEmployeeHistory = withMiddleware(
  employeeHistoryResolver,
  employeeHistoryReadMiddleware,
);

const wrappedEmployeeHistories = withMiddleware(
  employeeHistoriesResolver,
  employeeHistoryReadMiddleware,
);

const wrappedEmployeeChangeHistory = withMiddleware(
  employeeChangeHistoryResolver,
  employeeHistoryReadMiddleware,
);

const wrappedEmployeeHistoryList = withMiddleware(
  employeeHistoryListResolver,
  employeeHistoryReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const employeeHistoryQueries: Pick<
  QueryResolvers,
  | "employeeHistory"
  | "employeeHistories"
  | "employeeChangeHistory"
  | "employeeHistoryList"
> = {
  employeeHistory: wrappedEmployeeHistory,
  employeeHistories: wrappedEmployeeHistories,
  employeeChangeHistory: wrappedEmployeeChangeHistory,
  employeeHistoryList: wrappedEmployeeHistoryList,
};

export default employeeHistoryQueries;
