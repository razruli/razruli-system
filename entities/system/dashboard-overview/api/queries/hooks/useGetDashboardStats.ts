/**
 * useGetDashboardStats Hook
 * Wraps GetDashboardStatsDocument for fetching dashboard statistics
 * Includes summary counts of employees, departments, and company info
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetDashboardStatsDocument,
  type GetDashboardStatsQuery,
  type GetDashboardStatsQueryVariables,
} from "@/shared/graphql/generated";

export function useGetDashboardStats(
  variables: GetDashboardStatsQueryVariables,
) {
  return useQuery<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>(
    GetDashboardStatsDocument,
    {
      variables,
    },
  );
}
