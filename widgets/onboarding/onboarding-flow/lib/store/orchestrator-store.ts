import { create } from "zustand";

export type OnboardingStep =
  | "company"
  | "role"
  | "upload"
  | "mapping"
  | "confirmation";

interface OnboardingOrchestratorState {
  currentStep: OnboardingStep;
  isSubmitting: boolean;
  globalError?: string;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setGlobalError: (error?: string) => void;
  reset: () => void;
}

const STEPS: OnboardingStep[] = [
  "company",
  "role",
  "upload",
  "mapping",
  "confirmation",
];

export const useOnboardingOrchestrator = create<OnboardingOrchestratorState>(
  (set) => ({
    currentStep: "company",
    isSubmitting: false,
    globalError: undefined,
    nextStep: () =>
      set((state) => {
        const currentIndex = STEPS.indexOf(state.currentStep);
        const nextIndex = Math.min(currentIndex + 1, STEPS.length - 1);
        return { currentStep: STEPS[nextIndex] };
      }),
    prevStep: () =>
      set((state) => {
        const currentIndex = STEPS.indexOf(state.currentStep);
        const prevIndex = Math.max(currentIndex - 1, 0);
        return { currentStep: STEPS[prevIndex] };
      }),
    goToStep: (step) => set({ currentStep: step }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setGlobalError: (error) => set({ globalError: error }),
    reset: () =>
      set({
        currentStep: "company",
        isSubmitting: false,
        globalError: undefined,
      }),
  }),
);
