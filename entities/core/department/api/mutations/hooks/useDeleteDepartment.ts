/**
 * useDeleteDepartment Hook
 * Wraps DeleteDepartmentDocument for department deletion
 */

"use client";

import { useMutation } from "@apollo/client/react";

import {
  DeleteDepartmentDocument,
  type DeleteDepartmentMutation,
  type DeleteDepartmentMutationVariables,
} from "@/shared/graphql/generated";

export function useDeleteDepartment() {
  return useMutation<
    DeleteDepartmentMutation,
    DeleteDepartmentMutationVariables
  >(DeleteDepartmentDocument);
}
