"use client";

import {
  CompanyForm,
  RoleForm,
  UploadForm,
  MappingView,
  ConfirmationView,
} from "@/features/common/onboarding";
import { useMappingStore } from "@/features/common/onboarding";
import {
  useCompanyError,
  useRoleError,
  useUploadGlobalError,
} from "@/features/common/onboarding";
import { Button } from "@/shared/ui/shadcn/button";

import useOnboardingFlowModel from "../model/useOnboardingFlowModel";

export function OnboardingFlowWidget() {
  const {
    router,
    currentStep,
    currentStepIndex,
    isLastStep,
    steps,
    progress,
    company,
    role,
    uploadedFiles,
    isSubmitting,
    globalError,
    nextStep,
    prevStep,
    setSubmitting,
    setGlobalError,
    submitOnboarding,
    canProceed,
  } = useOnboardingFlowModel();

  const columnMappings = useMappingStore((state) => state.columnMappings);

  // Get error states from stores
  const companyError = useCompanyError();
  const roleError = useRoleError();
  const uploadGlobalError = useUploadGlobalError();

  // Determine if Next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === "company") return !!companyError || !company?.name;
    if (currentStep === "role") return !!roleError || !role?.role;
    if (currentStep === "upload")
      return uploadedFiles.length === 0 || !!uploadGlobalError;
    return false;
  };

  const handleNext = async () => {
    if (!isNextDisabled() && canProceed()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setSubmitting(true);
    try {
      if (!company || !role || uploadedFiles.length === 0) {
        throw new Error("Missing required data");
      }

      const response = await submitOnboarding({
        company,
        role,
        files: uploadedFiles,
        columnMappings,
      });

      // Redirect to company dashboard using company slug
      // Build URL using slug for better readability
      const companySlug = response.company?.slug;
      if (companySlug) {
        router.push(`/${companySlug}/dashboard`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete onboarding";
      setGlobalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete Your Setup</h1>
          <p className="text-muted-foreground mt-2">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mb-8 flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex flex-col items-center flex-1 ${
                index !== steps.length - 1 ? "mr-2" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index < currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : index === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-2 text-center capitalize text-muted-foreground">
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card border rounded-lg p-8 mb-6">
          {currentStep === "company" && <CompanyForm />}
          {currentStep === "role" && <RoleForm />}
          {currentStep === "upload" && <UploadForm />}
          {currentStep === "mapping" && <MappingView />}
          {currentStep === "confirmation" && <ConfirmationView />}
        </div>

        {/* Error Message */}
        {globalError && (
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 mb-6">
            {globalError}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === "company" || isSubmitting}
          >
            Back
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Completing..." : "Complete Setup"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isSubmitting || isNextDisabled()}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
