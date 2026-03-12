/**
 * useCreateEmployee Hook
 * Wraps CreateEmployeeDocument for entity-level mutation
 */

"use client";

import { useMutation } from "@apollo/client";

import {
  CreateEmployeeDocument,
  type CreateEmployeeMutation,
  type CreateEmployeeMutationVariables,
} from "@/shared/graphql/generated";

export function useCreateEmployee() {
  return useMutation<CreateEmployeeMutation, CreateEmployeeMutationVariables>(
    CreateEmployeeDocument,
  );
}
