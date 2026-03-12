/**
 * useCreateDepartment Hook
 * Wraps CreateDepartmentDocument for department creation
 */

"use client";

import { useMutation } from "@apollo/client";

import {
  CreateDepartmentDocument,
  type CreateDepartmentMutation,
  type CreateDepartmentMutationVariables,
} from "@/shared/graphql/generated";

export function useCreateDepartment() {
  return useMutation<
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables
  >(CreateDepartmentDocument);
}
