import { useCallback } from "react";

import { ConfirmationSchema, ConfirmationData } from "../../model";
import { useConfirmationActions } from "../store";

export function useValidateConfirmation() {
  const { setError } = useConfirmationActions();

  return useCallback(
    (data: ConfirmationData | null): boolean => {
      if (!data) {
        setError("Confirmation is required");
        return false;
      }

      const result = ConfirmationSchema.safeParse(data);
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
