import { useShallow } from "zustand/react/shallow";

import { useMappingStore, useUploadFiles } from "@/features/common/onboarding";

import { useOnboardingOrchestrator } from "./orchestrator-store";
export const useCurrentStep = () =>
  useOnboardingOrchestrator((state) => state.currentStep);
export const useIsSubmitting = () =>
  useOnboardingOrchestrator((state) => state.isSubmitting);
export const useGlobalError = () =>
  useOnboardingOrchestrator((state) => state.globalError);

export const useOnboardingStepActions = () =>
  useOnboardingOrchestrator(
    useShallow((state) => ({
      nextStep: state.nextStep,
      prevStep: state.prevStep,
      goToStep: state.goToStep,
    })),
  );

export const useOnboardingActions = () =>
  useOnboardingOrchestrator(
    useShallow((state) => ({
      nextStep: state.nextStep,
      prevStep: state.prevStep,
      goToStep: state.goToStep,
      setSubmitting: state.setSubmitting,
      setGlobalError: state.setGlobalError,
      reset: state.reset,
    })),
  );

/**
 * Hook to check if user can proceed to next step based on current step requirements
 */
export const useCanProceedToNextStep = () => {
  const currentStep = useCurrentStep();
  const uploadFiles = useUploadFiles();
  const allFilesMappingsComplete = useMappingStore(
    (state) => state.allFilesMappingsComplete,
  );

  if (currentStep === "upload") {
    // Must have at least one file uploaded
    return uploadFiles.length > 0;
  }

  if (currentStep === "mapping") {
    // All uploaded files must have complete mappings
    return allFilesMappingsComplete();
  }

  return true;
};
