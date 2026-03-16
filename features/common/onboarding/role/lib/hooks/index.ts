import { useCallback } from "react";

import { RoleFormData, RoleFormSchema } from "../../model";
import { useRoleActions } from "../store/selectors";

export function useValidateRole() {
  const { setError } = useRoleActions();

  return useCallback(
    (data: RoleFormData | null): boolean => {
      if (!data) {
        setError("Role selection is required");
        return false;
      }

      const result = RoleFormSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.issues.map((e) => e.message).join(", ");
        setError(errors);
        return false;
      }

      setError(undefined);
      return true;
    },
    [setError],
  );
}
