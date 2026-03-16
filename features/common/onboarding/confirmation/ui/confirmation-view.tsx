"use client";

import { useCompanyData } from "../../company/lib";
import { useMappingStore } from "../../mapping/lib/store/store";
import { useRoleData } from "../../role/lib";
import { useUploadFiles } from "../../upload/lib/store";
import { useConfirmationData, useConfirmationActions } from "../lib";

export function ConfirmationView() {
  const company = useCompanyData();
  const role = useRoleData();
  const uploadedFiles = useUploadFiles();
  const mappingFiles = useMappingStore((state) => state.files);
  const confirmed = useConfirmationData();
  const { setConfirmed } = useConfirmationActions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Confirm Your Setup</h2>
        <p className="text-muted-foreground mt-1">
          Review your information before completing onboarding
        </p>
      </div>

      <div className="space-y-4">
        {/* Company Info */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Company Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company Name:</span>
              <span className="font-medium">{company?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Industry:</span>
              <span className="font-medium">{company?.industry || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone:</span>
              <span className="font-medium">{company?.timezone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Working Hours:</span>
              <span className="font-medium">
                {company?.workingHours?.start || "N/A"} -{" "}
                {company?.workingHours?.end || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Role Info */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Role</h3>
          <div className="text-sm">
            <span className="text-muted-foreground">Your Role: </span>
            <span className="font-medium capitalize">
              {role?.role || "N/A"}
            </span>
          </div>
        </div>

        {/* Data Files */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Data Files</h3>
          {uploadedFiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files uploaded</p>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile, idx) => {
                const mappingFile = mappingFiles.find(
                  (m) => m.name === uploadedFile.name,
                );
                return (
                  <div key={uploadedFile.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        File {idx + 1}:
                      </span>
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    {mappingFile && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Sample rows:
                        </span>
                        <span className="font-medium">
                          {mappingFile.sampleRows.length}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Company will be created with provided information</li>
            <li>
              ✓ Your account will be created with role:{" "}
              <span className="font-semibold capitalize">
                {role?.role || "N/A"}
              </span>
            </li>
            <li>✓ All 3 data files will be processed:</li>
            <ul className="ml-4 space-y-1 mt-1">
              <li>• Departments will be created</li>
              <li>• Employees will be imported in those departments</li>
              <li>• Processes will be imported</li>
            </ul>
            <li>
              ✓ Atomic transaction guarantee: all data succeeds or all fails
            </li>
          </ul>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 border rounded-lg p-4 bg-muted/50">
        <input
          type="checkbox"
          id="confirm"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="confirm" className="cursor-pointer flex-1">
          <p className="font-medium">
            I confirm that all information is correct
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Once confirmed, your data will be processed and stored in our system
            with atomic transaction guarantee
          </p>
        </label>
      </div>
    </div>
  );
}
