"use client";

import { useState } from "react";

import { signIn } from "@/shared/lib/auth/auth-client";

import type { SignInCredentials } from "../../model";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn.email(credentials, {
        onSuccess: () => {
          // Redirect is handled by better-auth
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.error?.message || "Sign in failed");
          setIsLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return {
    signIn: handleSignIn,
    isLoading,
    error,
  };
}
