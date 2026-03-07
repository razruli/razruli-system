/**
 * ============================================================================
 * Actor Domain - Field Resolvers
 * ============================================================================
 * Resolves nested fields for actors
 */

import { ActorResolvers } from "@/server/graphql/types/generated";

export const actorFieldResolvers: Pick<
  ActorResolvers,
  "user" | "company" | "department" | "roles" | "permissions"
> = {
  /**
   * Resolve user for this actor
   */
  user: async (parent, _args, context) => {
    try {
      // User is included in repository queries
      // Cast parent to include user relation
      const parentWithUser = parent as any;
      if (parentWithUser.user) {
        return parentWithUser.user;
      }
      // Fallback: fetch user by ID if not included
      return await context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    } catch (error) {
      throw new Error(`Failed to load user: ${error}`);
    }
  },

  /**
   * Resolve company for this actor
   */
  company: async (parent, _args, context) => {
    try {
      const company = await context.services.company.getById(parent.companyId);
      if (!company) {
        throw new Error(`Company not found: ${parent.companyId}`);
      }
      return company;
    } catch (error) {
      throw new Error(`Failed to load company: ${error}`);
    }
  },

  /**
   * Resolve department for this actor (optional)
   */
  department: async (parent, _args, context) => {
    try {
      if (!parent.departmentId) return null;
      const department = await context.services.department.getById(
        parent.departmentId,
      );
      return department;
    } catch (error) {
      throw new Error(`Failed to load department: ${error}`);
    }
  },

  /**
   * Resolve roles for this actor
   */
  roles: async (parent, _args, context) => {
    try {
      return await context.services.actor.getRoles(parent.id);
    } catch (error) {
      throw new Error(`Failed to load roles: ${error}`);
    }
  },

  /**
   * Resolve permissions for this actor
   */
  permissions: async (parent, _args, context) => {
    try {
      return await context.services.actor.getPermissions(parent.id);
    } catch (error) {
      throw new Error(`Failed to load permissions: ${error}`);
    }
  },
};

export default actorFieldResolvers;
