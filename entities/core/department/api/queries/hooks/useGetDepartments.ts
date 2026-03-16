/**
 * useGetDepartments Hook
 * Wraps GetDepartmentsDocument for department list queries with pagination and filters
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetDepartmentsDocument,
  type GetDepartmentsQuery,
  type GetDepartmentsQueryVariables,
} from "@/shared/graphql/generated";

export function useGetDepartments(variables: GetDepartmentsQueryVariables) {
  return useQuery<GetDepartmentsQuery, GetDepartmentsQueryVariables>(
    GetDepartmentsDocument,
    {
      variables,
    },
  );
}
