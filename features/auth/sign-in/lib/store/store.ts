"use client";

import { create } from "zustand";

import type { SignInFormErrors } from "../../model";

interface SignInStore {
  // Form data
  email: string;
  password: string;

  // State
  isLoading: boolean;
  errors: SignInFormErrors;
  isSignUp: boolean;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setErrors: (errors: SignInFormErrors) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSignUp: (isSignUp: boolean) => void;
  resetForm: () => void;
  setSubmitError: (error: string) => void;
}

const initialState = {
  email: "",
  password: "",
  isLoading: false,
  errors: {},
  isSignUp: false,
};

export const useSignInStore = create<SignInStore>((set) => ({
  ...initialState,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setErrors: (errors) => set({ errors }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSignUp: (isSignUp) => set({ isSignUp }),
  resetForm: () => set(initialState),
  setSubmitError: (error) =>
    set((state) => ({
      errors: { ...state.errors, submit: error },
    })),
}));
