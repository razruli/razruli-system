"use client";

import { create } from "zustand";

interface DepartmentEditState {
  selectedId: string | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  open: (id: string) => void;
  close: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDepartmentEditStore = create<DepartmentEditState>((set) => ({
  selectedId: null,
  isOpen: false,
  isLoading: false,
  error: null,

  open: (id) => set({ selectedId: id, isOpen: true, error: null }),
  close: () => set({ isOpen: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ selectedId: null, isOpen: false, isLoading: false, error: null }),
}));
