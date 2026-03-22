/**
 * useGetDashboardOverview Hook
 * Wraps GetDashboardOverviewDocument for fetching dashboard overview data
 * Includes employees, departments, and company stats
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetDashboardOverviewDocument,
  type GetDashboardOverviewQuery,
  type GetDashboardOverviewQueryVariables,
} from "@/shared/graphql/generated";

export function useGetDashboardOverview(
  variables: GetDashboardOverviewQueryVariables,
) {
  return useQuery<GetDashboardOverviewQuery, GetDashboardOverviewQueryVariables>(
    GetDashboardOverviewDocument,
    {
      variables,
    },
  );
}
