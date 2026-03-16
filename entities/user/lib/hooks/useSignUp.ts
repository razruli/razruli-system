"use client";

import { useState } from "react";

import { signUp } from "@/shared/lib/auth/auth-client";

import type { SignUpCredentials } from "../../model";

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp.email(credentials, {
        onSuccess: () => {
          // Redirect is handled by better-auth
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.error?.message || "Sign up failed");
          setIsLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return {
    signUp: handleSignUp,
    isLoading,
    error,
  };
}
