import { create } from "zustand";

import { RoleFormData } from "../../model";

interface RoleState {
  data: RoleFormData | null;
  error?: string;
  setData: (data: RoleFormData) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  data: null,
  error: undefined,
  setData: (data) =>
    set((state) => ({
      data: state.data ? { ...state.data, ...data } : (data as RoleFormData),
      error: undefined,
    })),
  setError: (error) => set({ error }),
  reset: () => set({ data: null, error: undefined }),
}));
