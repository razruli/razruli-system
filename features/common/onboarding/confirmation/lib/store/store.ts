import { create } from "zustand";

interface ConfirmationState {
  confirmed: boolean;
  error?: string;
  setConfirmed: (confirmed: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

export const useConfirmationStore = create<ConfirmationState>((set) => ({
  confirmed: false,
  error: undefined,
  setConfirmed: (confirmed) => set({ confirmed, error: undefined }),
  setError: (error) => set({ error }),
  reset: () => set({ confirmed: false, error: undefined }),
}));
