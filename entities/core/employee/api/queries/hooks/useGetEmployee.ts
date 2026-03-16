/**
 * useGetEmployee Hook
 * Wraps GetEmployeeDocument for entity-level query
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetEmployeeDocument,
  type GetEmployeeQuery,
  type GetEmployeeQueryVariables,
} from "@/shared/graphql/generated";

export function useGetEmployee(variables: GetEmployeeQueryVariables) {
  return useQuery<GetEmployeeQuery, GetEmployeeQueryVariables>(
    GetEmployeeDocument,
    {
      variables,
    },
  );
}
