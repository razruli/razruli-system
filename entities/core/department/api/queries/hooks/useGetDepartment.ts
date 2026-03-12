/**
 * useGetDepartment Hook
 * Wraps GetDepartmentDocument for entity-level query
 */

"use client";

import { useQuery } from "@apollo/client";

import {
  GetDepartmentDocument,
  type GetDepartmentQuery,
  type GetDepartmentQueryVariables,
} from "@/shared/graphql/generated";

export function useGetDepartment(variables: GetDepartmentQueryVariables) {
  return useQuery<GetDepartmentQuery, GetDepartmentQueryVariables>(
    GetDepartmentDocument,
    {
      variables,
    },
  );
}
