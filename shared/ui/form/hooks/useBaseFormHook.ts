import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { ZodType } from "zod";

type UseBaseFormParams<T extends FieldValues> = {
  schema?: ZodType<T, any, any>;
  options?: UseFormProps<T>;
  mode?: UseFormProps<T>["mode"];
  reValidateMode?: UseFormProps<T>["reValidateMode"];
  shouldFocusError?: boolean;
};

/**
 * Reusable wrapper around react-hook-form's useForm with Zod support
 * - Defaults: mode="onSubmit", reValidateMode="onChange", shouldFocusError=true
 * - Allows overriding any RHF options
 */
export function useBaseForm<T extends FieldValues>({
  schema,
  options,
  mode = "onSubmit",
  reValidateMode = "onChange",
  shouldFocusError = true,
}: UseBaseFormParams<T>) {
  return useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode,
    reValidateMode,
    shouldFocusError,
    ...options, // allow defaultValues, criteriaMode, delayError, etc.
  });
}
