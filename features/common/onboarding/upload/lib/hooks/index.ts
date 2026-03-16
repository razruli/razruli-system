import { useCallback } from "react";

import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UploadFormSchema,
} from "../../model";
import { useUploadActions } from "../store";

export function useValidateUpload() {
  const { setFileError, setGlobalError } = useUploadActions();

  return useCallback(
    (file: File | null): boolean => {
      if (!file) {
        setGlobalError("File is required");
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError(file.name, "File size must be less than 10MB");
        return false;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError(file.name, "Only CSV and Excel files are allowed");
        return false;
      }

      const result = UploadFormSchema.safeParse({
        file,
        fileName: file.name,
      });

      if (!result.success) {
        const errors = result.error.issues.map((e) => e.message).join(", ");
        setFileError(file.name, errors);
        return false;
      }

      setFileError(file.name, undefined);
      return true;
    },
    [setFileError, setGlobalError],
  );
}
