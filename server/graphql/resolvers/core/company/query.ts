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

/** Require authentication + company:read permission (for most queries) */
const companyReadMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["company:read"] },
);

/** Allow public access to companyBySlug (has its own authorization check) */
const companyBySlugMiddleware = composeMiddleware({
  requiredPermissions: ["company:read"],
});

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Get a single company by ID
 * Requires authentication to read company data
 * Only returns the company if the user belongs to it
 */
const companyResolver: QueryResolvers["company"] = async (
  _parent,
  { id },
  context,
) => {
  try {
    const company = await context.services.company.getById(id);

    // Verify user belongs to this company
    if (company && context.actor?.companyId !== company.id) {
      throw new Error(`FORBIDDEN: You don't have access to this company`);
    }

    return company;
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
    const actor = context.actor;
    if (!actor) {
      throw new Error("User not authenticated");
    }
    return await context.services.company.getById(actor.companyId);
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

/**
 * Get a single company by slug (for friendly URLs)
 * Only returns the company if the user belongs to it
 */
const companyBySlugResolver: QueryResolvers["companyBySlug"] = async (
  _parent,
  { slug },
  context,
) => {
  try {
    console.warn("[companyBySlugResolver] Called with slug:", { slug });

    const company = await context.services.company.getBySlug(slug);
    console.warn("[companyBySlugResolver] Repository returned:", {
      found: !!company,
      companyId: company?.id,
      companySlug: company?.slug,
    });

    // Verify user belongs to this company
    if (company && context.actor?.companyId !== company.id) {
      console.warn("[companyBySlugResolver] Authorization failed:", {
        userCompanyId: context.actor?.companyId,
        foundCompanyId: company.id,
      });
      throw new Error(`FORBIDDEN: You don't have access to this company`);
    }

    console.warn("[companyBySlugResolver] Returning company:", {
      companyId: company?.id,
    });
    return company;
  } catch (error) {
    console.error("[companyBySlugResolver] Error:", error);
    throw new Error(`Failed to fetch company by slug: ${error}`);
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

const wrappedCompanyBySlug = withMiddleware(
  companyBySlugResolver,
  companyBySlugMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const companyQueries: Pick<
  QueryResolvers,
  "company" | "myCompany" | "companies" | "companyBySlug"
> = {
  company: wrappedCompany,
  myCompany: wrappedMyCompany,
  companies: wrappedCompanies,
  companyBySlug: wrappedCompanyBySlug,
};

export default companyQueries;
