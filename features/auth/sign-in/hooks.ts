"use client";

import { useCallback } from "react";

import { signInFormSchema } from "./model";
import { useSignInStore } from "./store";

export function useSignInActions() {
  const store = useSignInStore();

  const validateForm = useCallback(() => {
    const result = signInFormSchema.safeParse({
      email: store.email,
      password: store.password,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      store.setErrors(errors as any);
      return false;
    }

    store.setErrors({});
    return true;
  }, [store]);

  const handleSubmit = useCallback(
    async (onSubmit: () => Promise<void>) => {
      if (!validateForm()) {
        return;
      }

      store.setIsLoading(true);
      try {
        await onSubmit();
        store.resetForm();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        store.setSubmitError(message);
      } finally {
        store.setIsLoading(false);
      }
    },
    [validateForm, store],
  );

  return {
    setEmail: store.setEmail,
    setPassword: store.setPassword,
    validateForm,
    handleSubmit,
    toggleSignUp: () => store.setIsSignUp(!store.isSignUp),
  };
}
