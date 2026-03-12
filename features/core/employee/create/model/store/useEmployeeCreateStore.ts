"use client";

import { create } from "zustand";

interface EmployeeCreateState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  open: () => void;
  close: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEmployeeCreateStore = create<EmployeeCreateState>((set) => ({
  isOpen: false,
  isLoading: false,
  error: null,

  open: () => set({ isOpen: true, error: null }),
  close: () => set({ isOpen: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ isOpen: false, isLoading: false, error: null }),
}));
