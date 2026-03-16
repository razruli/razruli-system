/**
 * useUpdateEmployeeEfficiency Hook
 * Wraps UpdateEmployeeEfficiencyDocument for efficiency coefficient updates
 */

"use client";

import { useMutation } from "@apollo/client/react";

import {
  UpdateEmployeeEfficiencyDocument,
  type UpdateEmployeeEfficiencyMutation,
  type UpdateEmployeeEfficiencyMutationVariables,
} from "@/shared/graphql/generated";

export function useUpdateEmployeeEfficiency() {
  return useMutation<
    UpdateEmployeeEfficiencyMutation,
    UpdateEmployeeEfficiencyMutationVariables
  >(UpdateEmployeeEfficiencyDocument);
}
