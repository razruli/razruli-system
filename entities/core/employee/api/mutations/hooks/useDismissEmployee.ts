/**
 * useDismissEmployee Hook
 * Wraps DismissEmployeeDocument for dismissal mutations
 */

"use client";

import { useMutation } from "@apollo/client";

import {
  DismissEmployeeDocument,
  type DismissEmployeeMutation,
  type DismissEmployeeMutationVariables,
} from "@/shared/graphql/generated";

export function useDismissEmployee() {
  return useMutation<DismissEmployeeMutation, DismissEmployeeMutationVariables>(
    DismissEmployeeDocument,
  );
}
