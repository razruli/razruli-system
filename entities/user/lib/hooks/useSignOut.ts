'use client';

import { useState } from 'react';

import { authClient } from '@/shared/lib/auth/auth-client';

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signOut();
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      setIsLoading(false);
    }
  };

  return {
    signOut: handleSignOut,
    isLoading,
    error,
  };
}
