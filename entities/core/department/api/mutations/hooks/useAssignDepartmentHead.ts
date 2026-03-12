/**
 * useAssignDepartmentHead Hook
 * Wraps AssignDepartmentHeadDocument for department head assignment
 */

"use client";
import { useMutation } from "@apollo/client/react";

import {
  AssignDepartmentHeadDocument,
  type AssignDepartmentHeadMutation,
  type AssignDepartmentHeadMutationVariables,
} from "@/shared/graphql/generated";

export function useAssignDepartmentHead() {
  return useMutation<
    AssignDepartmentHeadMutation,
    AssignDepartmentHeadMutationVariables
  >(AssignDepartmentHeadDocument);
}
