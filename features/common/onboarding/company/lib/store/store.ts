import { create } from "zustand";

import { CompanyFormData } from "../../model";

interface CompanyState {
  data: CompanyFormData | null;
  error?: string;
  setData: (data: Partial<CompanyFormData>) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  data: null,
  error: undefined,
  setData: (data) =>
    set((state) => ({
      data: state.data ? { ...state.data, ...data } : (data as CompanyFormData),
      error: undefined,
    })),
  setError: (error) => set({ error }),
  reset: () => set({ data: null, error: undefined }),
}));
