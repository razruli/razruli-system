/**
 * useGetDepartmentWithMetrics Hook
 * Wraps GetDepartmentWithMetricsDocument for department with analytics data
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetDepartmentWithMetricsDocument,
  type GetDepartmentWithMetricsQuery,
  type GetDepartmentWithMetricsQueryVariables,
} from "@/shared/graphql/generated";

export function useGetDepartmentWithMetrics(
  variables: GetDepartmentWithMetricsQueryVariables,
) {
  return useQuery<
    GetDepartmentWithMetricsQuery,
    GetDepartmentWithMetricsQueryVariables
  >(GetDepartmentWithMetricsDocument, { variables });
}
