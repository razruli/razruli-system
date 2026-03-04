/**
 * ============================================================================
 * Company Domain - Mutation Resolvers
 * ============================================================================
 * Handles all company modification operations with middleware orchestration
 */

import { withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

export const companyMutations: Pick<
  MutationResolvers,
  "createCompany" | "updateCompany"
> = {
  /**
   * Create a new company
   * Requires admin permissions
   */
  createCompany: withMiddleware(
    async (_parent, { input }, context) => {
      try {
        // Validate required fields
        if (!input.name) {
          throw new Error("Missing required field: name");
        }

        // Create company with input data matching schema
        const company = await context.services.company.create({
          name: input.name,
          timezone: input.timezone || "UTC+3",
          workingHoursDay: input.workingHoursDay || 8,
          workingDaysPerMonth: input.workingDaysPerMonth || 21,
        });

        // TODO: Implement event emitter (RabbitMQ/Redis)
        // context.eventEmitter.emit("COMPANY_CREATED", company);

        return company;
      } catch (error) {
        throw new Error(`Failed to create company: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["company:create"],
    },
  ),

  /**
   * Update an existing company
   * Supports partial updates with audit trail
   */
  updateCompany: withMiddleware(
    async (_parent, { id, input }, context) => {
      try {
        // Build update data from provided fields matching schema
        const updateData: Record<string, unknown> = {};

        if (input.name !== undefined) {
          updateData.name = input.name;
        }

        if (input.timezone !== undefined) {
          updateData.timezone = input.timezone;
        }

        if (input.workingHoursDay !== undefined) {
          updateData.workingHoursDay = input.workingHoursDay;
        }

        if (input.workingDaysPerMonth !== undefined) {
          updateData.workingDaysPerMonth = input.workingDaysPerMonth;
        }

        if (Object.keys(updateData).length === 0) {
          const company = await context.services.company.getById(id);
          return company;
        }

        const updatedCompany = await context.services.company.update(
          id,
          updateData,
        );

        // TODO: Implement event emitter
        // context.eventEmitter.emit("COMPANY_UPDATED", { oldCompany, updatedCompany });

        return updatedCompany;
      } catch (error) {
        throw new Error(`Failed to update company: ${error}`);
      }
    },
    {
      requireAuth: true,
      requiredPermissions: ["company:update"],
    },
  ),
};

export default companyMutations;
