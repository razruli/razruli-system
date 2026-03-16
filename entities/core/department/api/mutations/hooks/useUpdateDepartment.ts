/**
 * useUpdateDepartment Hook
 * Wraps UpdateDepartmentDocument for department updates
 */

"use client";

import { useMutation } from "@apollo/client/react";

import {
  UpdateDepartmentDocument,
  type UpdateDepartmentMutation,
  type UpdateDepartmentMutationVariables,
} from "@/shared/graphql/generated";

export function useUpdateDepartment() {
  return useMutation<
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables
  >(UpdateDepartmentDocument);
}
