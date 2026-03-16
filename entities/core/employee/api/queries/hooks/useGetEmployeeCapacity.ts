/**
 * useGetEmployeeCapacity Hook
 * Wraps GetEmployeeCapacityDocument for employee capacity queries
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetEmployeeCapacityDocument,
  type GetEmployeeCapacityQuery,
  type GetEmployeeCapacityQueryVariables,
} from "@/shared/graphql/generated";

export function useGetEmployeeCapacity(
  variables: GetEmployeeCapacityQueryVariables,
) {
  return useQuery<GetEmployeeCapacityQuery, GetEmployeeCapacityQueryVariables>(
    GetEmployeeCapacityDocument,
    { variables },
  );
}
