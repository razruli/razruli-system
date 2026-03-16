/**
 * useGetEmployees Hook
 * Wraps GetEmployeesDocument for entity-level query with pagination and filters
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetEmployeesDocument,
  type GetEmployeesQuery,
  type GetEmployeesQueryVariables,
} from "@/shared/graphql/generated";

export function useGetEmployees(variables: GetEmployeesQueryVariables) {
  return useQuery<GetEmployeesQuery, GetEmployeesQueryVariables>(
    GetEmployeesDocument,
    {
      variables,
    },
  );
}
