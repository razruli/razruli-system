/**
 * Entities Layer - Domain Models with API Hooks
 *
 * Organized by domain with FSD slices pattern:
 * - model/ - Type definitions from Prisma/GraphQL schemas
 * - api/queries/ - Query hooks wrapping generated documents
 * - api/mutations/ - Mutation hooks wrapping generated documents
 *
 * GraphQL Documents Flow:
 * 1. GraphQL files in entities/**/ api; /** are discovered by codegen
 * 2. Codegen generates TypedDocumentNode to shared/graphql/generated/
 * 3. Entity hooks wrap these documents for clean public API
 * 4. Features import hooks directly from entities
 *
 * This keeps entity logic encapsulated and provides strong typing via codegen.
 *
 * Usage:
 * // For entity operations
 * import { useGetEmployee, useCreateEmployee } from '@/entities/core/employee';
 * import type { Employee, CreateEmployeeInput } from '@/entities/core/employee/model';
 *
 * // For custom dashboard queries (non-entity)
 * import { useDashboardOverviewQuery } from '@/shared/graphql/generated';
 */

export * as core from "./core";
