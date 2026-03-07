/**
 * ============================================================================
 * Company Domain - Query Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for company queries

/** Require authentication + company:read permission */
const companyReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["company:read"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single company by ID
 * Requires authentication to read company data
 */
const companyResolver: QueryResolvers["company"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    return await context.services.company.getById(id);
  } catch (error) {
    throw new Error(`Failed to fetch company: ${error}`);
  }
};

/**
 * Get authenticated user's company
 */
const myCompanyResolver: QueryResolvers["myCompany"] = async (
  _parent,
  _args,
  context,
) => {
  try {
    const user = context.client;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await context.services.company.getById(client.companyId);
  } catch (error) {
    throw new Error(`Failed to fetch user company: ${error}`);
  }
};

/**
 * Get all companies (admin only)
 */
const companiesResolver: QueryResolvers["companies"] = async (
  _parent,
  _args,
  context,
) => {
  try {
    const result = await context.services.company.find(
      {},
      {
        offset: 0,
        limit: 1000,
        sortBy: "createdAt",
        sortOrder: "ASC",
      },
    );
    return result.data;
  } catch (error) {
    throw new Error(`Failed to list companies: ${error}`);
  }
};

// ==================== WRAPPED RESOLVERS ====================
// Apply middleware wrappers to resolver functions

const wrappedCompany = withMiddleware(companyResolver, companyReadMiddleware);

const wrappedMyCompany = withMiddleware(
  myCompanyResolver,
  companyReadMiddleware,
);

const wrappedCompanies = withMiddleware(
  companiesResolver,
  companyReadMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const companyQueries: Pick<
  QueryResolvers,
  "company" | "myCompany" | "companies"
> = {
  company: wrappedCompany,
  myCompany: wrappedMyCompany,
  companies: wrappedCompanies,
};

export default companyQueries;
