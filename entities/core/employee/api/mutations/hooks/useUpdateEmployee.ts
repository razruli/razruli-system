/**
 * useUpdateEmployee Hook
 * Wraps UpdateEmployeeDocument for entity-level mutation
 */

"use client";

import { useMutation } from "@apollo/client/react";

import {
  UpdateEmployeeDocument,
  type UpdateEmployeeMutation,
  type UpdateEmployeeMutationVariables,
} from "@/shared/graphql/generated";

export function useUpdateEmployee() {
  return useMutation<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>(
    UpdateEmployeeDocument,
  );
}
