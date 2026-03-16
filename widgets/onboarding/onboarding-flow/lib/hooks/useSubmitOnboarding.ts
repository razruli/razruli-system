import { useCallback } from "react";

import {
  CompanyFormData,
  RoleFormData,
  ColumnMapping,
} from "@/features/common/onboarding";

export interface OnboardingSubmitData {
  company: CompanyFormData;
  role: RoleFormData;
  files: File[];
  columnMappings: Record<string, ColumnMapping>; // { fileName: { csvColumn: dbField } }
}

export function useSubmitOnboarding() {
  const submit = useCallback(async (data: OnboardingSubmitData) => {
    const formData = new FormData();
    formData.append("company", JSON.stringify(data.company));
    formData.append("role", JSON.stringify(data.role));

    // Append each file
    data.files.forEach((file) => {
      formData.append("files", file);
    });

    // Append column mappings for each file
    const mappingEntries = Object.entries(data.columnMappings);
    console.warn("Submitting onboarding with:", {
      filesCount: data.files.length,
      fileNames: data.files.map((f) => f.name),
      mappingKeys: mappingEntries.map(([key]) => key),
      mappings: mappingEntries.map(([key, mapping]) => ({
        key,
        mappingSize: Object.keys(mapping).length,
        mapping,
      })),
    });

    mappingEntries.forEach(([fileName, mapping]) => {
      formData.append(`mapping_${fileName}`, JSON.stringify(mapping));
    });

    const response = await fetch("/api/onboarding/submit", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Onboarding submission error:", error);
      throw new Error(error.message || "Failed to complete onboarding");
    }

    return response.json();
  }, []);

  return { submitOnboarding: submit };
}
