/**
 * ============================================================================
 * Company Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import prisma from "@/server/db/prisma/lib/prisma";
import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";
import {
  generateSlug,
  generateUniqueSlug,
} from "@/server/lib/slug/slug-generator";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for company mutations

/** Require authentication + company:create permission */
const companyCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["company:create"] },
);

/** Require authentication + company:update permission */
const companyUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["company:update"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new company
 * Validates required fields and persists to database
 */
const createCompanyResolver: MutationResolvers["createCompany"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    // Validate required fields
    if (!input.name) {
      throw new Error("Missing required field: name");
    }

    // Generate slug from name if not provided
    let slug = input.slug || generateSlug(input.name);

    // Ensure slug is unique
    const existingBySlug = await prisma.company.findFirst({
      where: { slug },
    });

    if (existingBySlug) {
      const existingSlugs = await prisma.company.findMany({
        select: { slug: true },
      });
      const slugSet = new Set(existingSlugs.map((c) => c.slug));
      slug = generateUniqueSlug(slug, slugSet);
    }

    // Create company with input data matching schema
    const company = await context.services.company.create({
      name: input.name,
      slug,
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
};

/**
 * Update an existing company
 * Supports partial updates with audit trail
 */
const updateCompanyResolver: MutationResolvers["updateCompany"] = async (
  _parent,
  { id, input },
  context,
) => {
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
};

// ==================== WRAPPED RESOLVERS ====================

const wrappedCreateCompany = withMiddleware(
  createCompanyResolver,
  companyCreateMiddleware,
);

const wrappedUpdateCompany = withMiddleware(
  updateCompanyResolver,
  companyUpdateMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const companyMutations: Pick<
  MutationResolvers,
  "createCompany" | "updateCompany"
> = {
  createCompany: wrappedCreateCompany,
  updateCompany: wrappedUpdateCompany,
};

export default companyMutations;
