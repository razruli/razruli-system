import { useEffect } from "react";

import {
  useValidateCompany,
  useCompanyData,
  useValidateConfirmation,
  useConfirmationData,
  useValidateRole,
  useRoleData,
  useValidateUpload,
  useUploadFiles,
} from "@/features/common/onboarding";
import {
  useValidateMapping,
  useMappingStore,
  useInitializeMappingFromFiles,
} from "@/features/common/onboarding";
import { useRouter } from "@/shared/i18n/navigation";

import { useSubmitOnboarding } from "../lib";
import {
  useCurrentStep,
  useGlobalError,
  useIsSubmitting,
  useOnboardingActions,
} from "../lib/store/orchestrator-selectors";

const useOnboardingFlowModel = () => {
  const router = useRouter();
  const currentStep = useCurrentStep();
  const { nextStep, prevStep, setSubmitting, setGlobalError } =
    useOnboardingActions();
  const isSubmitting = useIsSubmitting();
  const globalError = useGlobalError();

  const validateCompany = useValidateCompany();
  const validateRole = useValidateRole();
  const validateUpload = useValidateUpload();
  const validateMapping = useValidateMapping();
  const validateConfirmation = useValidateConfirmation();
  const { submitOnboarding } = useSubmitOnboarding();

  const company = useCompanyData();
  const role = useRoleData();
  const uploadedFiles = useUploadFiles();
  const confirmed = useConfirmationData();

  // Mapping store
  const mappingFiles = useMappingStore((state) => state.files);
  const initializeMappingFromFiles = useInitializeMappingFromFiles(
    uploadedFiles.map((f) => f.file),
  );

  const isLastStep = currentStep === "confirmation";
  const steps = [
    "company",
    "role",
    "upload",
    "mapping",
    "confirmation",
  ] as const;
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Initialize mapping files when moving to mapping step
  useEffect(() => {
    if (currentStep === "mapping" && mappingFiles.length === 0) {
      initializeMappingFromFiles().catch((error) => {
        setGlobalError("Failed to parse CSV files: " + error.message);
      });
    }
  }, [
    currentStep,
    mappingFiles.length,
    initializeMappingFromFiles,
    setGlobalError,
  ]);

  const canProceed = (): boolean => {
    if (currentStep === "company") return validateCompany(company);
    if (currentStep === "role") return validateRole(role);
    if (currentStep === "upload") return uploadedFiles.length === 4;
    if (currentStep === "mapping") return validateMapping();
    if (currentStep === "confirmation")
      return validateConfirmation({ confirmed });
    return false;
  };

  return {
    router,
    currentStep,
    currentStepIndex,
    isLastStep,
    steps,
    progress,
    company,
    role,
    uploadedFiles: uploadedFiles.map((f) => f.file),
    mappingFiles,
    confirmed,
    isSubmitting,
    globalError,
    nextStep,
    prevStep,
    setSubmitting,
    setGlobalError,
    validateCompany,
    validateRole,
    validateUpload,
    validateMapping,
    validateConfirmation,
    submitOnboarding,
    canProceed,
  };
};

export default useOnboardingFlowModel;
