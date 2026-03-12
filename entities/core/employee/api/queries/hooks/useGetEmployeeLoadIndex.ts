/**
 * useGetEmployeeLoadIndex Hook
 * Wraps GetEmployeeLoadIndexDocument for employee load queries
 */

"use client";

import { useQuery } from "@apollo/client";

import {
  GetEmployeeLoadIndexDocument,
  type GetEmployeeLoadIndexQuery,
  type GetEmployeeLoadIndexQueryVariables,
} from "@/shared/graphql/generated";

export function useGetEmployeeLoadIndex(
  variables: GetEmployeeLoadIndexQueryVariables,
) {
  return useQuery<
    GetEmployeeLoadIndexQuery,
    GetEmployeeLoadIndexQueryVariables
  >(GetEmployeeLoadIndexDocument, { variables });
}
