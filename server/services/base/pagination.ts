/**
 * ============================================================================
 * Pagination & Filtering Types and Utilities
 * ============================================================================
 * Reusable types for pagination, filtering, and sorting across all services
 */

/**
 * Pagination input from GraphQL query
 */
export interface PaginationInput {
  skip?: number;
  take?: number;
  orderBy?: SortInput;
}

/**
 * Sort input configuration
 */
export interface SortInput {
  field: string;
  order: "ASC" | "DESC";
}

/**
 * Result of paginated query from repository
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  skip: number;
  take: number;
}

/**
 * Filter input from GraphQL query
 */
export interface FilterInput {
  [key: string]: any;
}

/**
 * Convert pagination input to Prisma format
 */
export function toPrismaOptions(pagination?: PaginationInput): {
  skip: number;
  take: number;
  orderBy?: Record<string, "asc" | "desc">;
} {
  const skip = pagination?.skip ?? 0;
  const take = pagination?.take ?? 20;

  const result = {
    skip: Math.max(0, skip),
    take: Math.max(1, take),
  } as {
    skip: number;
    take: number;
    orderBy?: Record<string, "asc" | "desc">;
  };

  if (pagination?.orderBy) {
    result.orderBy = {
      [pagination.orderBy.field]: pagination.orderBy.order.toLowerCase() as
        | "asc"
        | "desc",
    };
  }

  return result;
}

/**
 * Build Prisma where clause from filter input
 * Extend this as needed for domain-specific filters
 */
export function buildWhereClause(
  filter?: FilterInput,
): Record<string, any> | undefined {
  if (!filter || Object.keys(filter).length === 0) {
    return undefined;
  }

  // Basic implementation - extend in services as needed
  const where: Record<string, any> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null) {
      where[key] = value;
    }
  }

  return Object.keys(where).length > 0 ? where : undefined;
}
