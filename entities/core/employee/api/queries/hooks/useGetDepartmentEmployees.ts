/**
 * useGetDepartmentEmployees Hook
 * Wraps GetDepartmentEmployeesDocument for entity-level query
 */

"use client";

import { useQuery } from "@apollo/client/react";

import {
  GetDepartmentEmployeesDocument,
  type GetDepartmentEmployeesQuery,
  type GetDepartmentEmployeesQueryVariables,
} from "@/shared/graphql/generated";

export function useGetDepartmentEmployees(
  variables: GetDepartmentEmployeesQueryVariables,
) {
  return useQuery<
    GetDepartmentEmployeesQuery,
    GetDepartmentEmployeesQueryVariables
  >(GetDepartmentEmployeesDocument, { variables });
}
