/**
 * ============================================================================
 * Dashboard Entity - GraphQL Queries
 * ============================================================================
 * Central queries for dashboard data preloading
 * These combine multiple entities to provide comprehensive dashboard views
 */

export { useGetDashboardOverview, useGetDashboardStats } from "./hooks";
export { GetDashboardOverviewDocument, GetDashboardStatsDocument } from "@/shared/graphql/generated";

export * from "@/shared/graphql/generated";
