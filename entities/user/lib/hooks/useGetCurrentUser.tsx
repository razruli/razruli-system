"use client";

import { useSession } from "@/shared/lib/auth/auth-client";

import { User } from "../../model";

/**
 * Hook to get the current authenticated user
 * Returns user data from better-auth session
 */
export function useGetCurrentUser() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user as User | undefined,
    isLoading: isPending,
    error,
    isAuthenticated: !!session?.user,
  };
}
