/**
 * ============================================================================
 * Company Domain - Query Resolvers
 * ============================================================================
 * Handles all company-related queries with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { QueryResolvers } from "@/server/graphql/types/generated";

export const companyQueries: Pick<
  QueryResolvers,
  "company" | "myCompany" | "companies"
> = {
  /**
   * Get a single company by ID
   * Requires authentication to read company data
   */
  company: withMiddleware(
    async (_parent, { id }, context) => {
      try {
        return await context.services.company.getById(id);
      } catch (error) {
        throw new Error(`Failed to fetch company: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["company:read"],
    },
  ),

  /**
   * Get authenticated user's company
   */
  myCompany: withMiddleware(
    async (_parent, _args, context) => {
      try {
        const user = context.user;
        if (!user) {
          throw new Error("User not authenticated");
        }
        return await context.services.company.getById(user.companyId);
      } catch (error) {
        throw new Error(`Failed to fetch user company: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["company:read"],
    },
  ),

  /**
   * Get all companies (admin only)
   */
  companies: withMiddleware(
    async (_parent, _args, context) => {
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
    },
    {
      requireAuth: true,
      requiredPermissions: ["company:read"],
      // requireRole: "ADMIN",
    },
  ),
};

export default companyQueries;
