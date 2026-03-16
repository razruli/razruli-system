import { useCallback } from "react";

import { CompanyFormData, CompanyFormSchema } from "../../model";
import { useCompanyActions } from "../store";
export function useValidateCompany() {
  const { setError } = useCompanyActions();

  return useCallback(
    (data: CompanyFormData | null): boolean => {
      if (!data) {
        setError("Company information is required");
        return false;
      }

      const result = CompanyFormSchema.safeParse(data);
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
