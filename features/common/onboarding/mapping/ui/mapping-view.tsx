"use client";

import { useState } from "react";

import { FileType, useMappingStore } from "../lib/store/store";
import { REQUIRED_FIELDS_BY_TYPE, OPTIONAL_FIELDS_BY_TYPE } from "../model";

export function MappingView() {
  const files = useMappingStore((state) => state.files);
  const columnMappings = useMappingStore((state) => state.columnMappings);
  const validationErrors = useMappingStore((state) => state.validationErrors);
  const setColumnMapping = useMappingStore((state) => state.setColumnMapping);
  const getMissingRequiredFields = useMappingStore(
    (state) => state.getMissingRequiredFields,
  );
  const isFileMappingComplete = useMappingStore(
    (state) => state.isFileMappingComplete,
  );
  const allFilesMappingsComplete = useMappingStore(
    (state) => state.allFilesMappingsComplete,
  );

  const [activeTab, setActiveTab] = useState(0);
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No files uploaded yet. Please go back to upload files.
        </p>
      </div>
    );
  }

  const activeFile = files[activeTab];
  const fileMapping = columnMappings[activeFile.name] || {};
  const requiredFields = REQUIRED_FIELDS_BY_TYPE[activeFile.type];
  const optionalFields = OPTIONAL_FIELDS_BY_TYPE[activeFile.type];
  const missingFields = getMissingRequiredFields(activeFile.name);
  const fileErrors = validationErrors[activeFile.name] || [];

  const handleColumnMapChange = (csvColumn: string, dbField: string) => {
    setColumnMapping(activeFile.name, csvColumn, dbField);
  };

  //   const getMappedDbFields = () => Object.values(fileMapping);

  const getUnmappedCsvColumns = () =>
    activeFile.headers.filter((header) => !(header in fileMapping));

  const getPreviewData = () => {
    if (!previewMode || previewMode !== activeFile.name) return null;

    return activeFile.sampleRows.slice(0, 3).map((row) => {
      const mappedRow: Record<string, any> = {};
      Object.entries(fileMapping).forEach(([csvCol, dbField]) => {
        mappedRow[dbField] = row[csvCol];
      });
      return mappedRow;
    });
  };

  const getMissingFileTypes = () => {
    const REQUIRED_TYPES = ["department", "employee", "process"];
    const uploadedTypes = files.map((f) => f.type);
    return REQUIRED_TYPES.filter(
      (type) => !uploadedTypes.includes(type as FileType),
    );
  };

  const missingTypes = getMissingFileTypes();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Map CSV Columns</h2>
        <p className="text-muted-foreground mt-1">
          Match CSV columns to data fields. All marked fields are required.
          {missingTypes.length > 0 && (
            <span className="block text-amber-600 text-sm mt-2">
              Missing files:{" "}
              {missingTypes
                .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                .join(", ")}
            </span>
          )}
        </p>
      </div>

      {/* Missing Files Warning */}
      {missingTypes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-900 mb-2">
            ⚠️ Missing Files
          </p>
          <p className="text-sm text-amber-800 mb-2">
            You need to upload the following files:
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            {missingTypes.map((type) => (
              <li key={type}>
                • <span className="capitalize">{type}s</span> file
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Tabs */}
      <div className="border-b">
        <div className="flex gap-2 flex-wrap">
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => {
                setActiveTab(idx);
                setPreviewMode(null);
              }}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === idx
                  ? "border-primary text-primary font-semibold"
                  : `border-transparent text-muted-foreground hover:text-foreground ${
                      isFileMappingComplete(file.name)
                        ? "text-green-600"
                        : "text-destructive"
                    }`
              }`}
            >
              {file.name}
              {isFileMappingComplete(file.name) && (
                <span className="ml-1">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active File Mapping */}
      <div className="space-y-4">
        {/* Required Fields Mapping */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Required Fields *</h3>
          {requiredFields.map((dbField) => (
            <div key={dbField} className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  {dbField} *
                </label>
                <select
                  value={
                    Object.entries(fileMapping).find(
                      ([_, mapped]) => mapped === dbField,
                    )?.[0] || ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      handleColumnMapChange(e.target.value, dbField);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                >
                  <option value="">-- Select CSV Column --</option>
                  {activeFile.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              {missingFields.includes(dbField) && (
                <span className="text-destructive text-sm">Required</span>
              )}
            </div>
          ))}
        </div>

        {/* Optional Fields Mapping */}
        {optionalFields.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Optional Fields</h3>
            {optionalFields.map((dbField) => (
              <div key={dbField} className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    {dbField}
                  </label>
                  <select
                    value={
                      Object.entries(fileMapping).find(
                        ([_, mapped]) => mapped === dbField,
                      )?.[0] || ""
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        handleColumnMapChange(e.target.value, dbField);
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="">-- Skip this field --</option>
                    {activeFile.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unmapped Columns Warning */}
        {getUnmappedCsvColumns().length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-semibold mb-1">Unmapped CSV Columns:</p>
            <p>{getUnmappedCsvColumns().join(", ")}</p>
            <p className="text-xs mt-2">
              These columns will be ignored during import.
            </p>
          </div>
        )}

        {/* Validation Errors */}
        {fileErrors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
            {fileErrors.map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
          </div>
        )}

        {/* Status and Preview */}
        <div className="space-y-3">
          {isFileMappingComplete(activeFile.name) ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              ✓ This file mapping is complete
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              {missingFields.length > 0 && (
                <p>Missing mappings for: {missingFields.join(", ")}</p>
              )}
            </div>
          )}

          <button
            onClick={() =>
              setPreviewMode(
                previewMode === activeFile.name ? null : activeFile.name,
              )
            }
            disabled={!isFileMappingComplete(activeFile.name)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {previewMode === activeFile.name
              ? "Hide Preview"
              : "Preview Mapped Data"}
          </button>
        </div>

        {/* Preview Table */}
        {previewMode === activeFile.name && getPreviewData() && (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {requiredFields.map((field) => (
                      <th
                        key={field}
                        className="px-3 py-2 text-left font-semibold border-b"
                      >
                        {field}
                      </th>
                    ))}
                    {optionalFields.map((field) => (
                      <th
                        key={field}
                        className="px-3 py-2 text-left font-semibold border-b text-muted-foreground"
                      >
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getPreviewData()!.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b hover:bg-muted/50">
                      {requiredFields.map((field) => (
                        <td key={field} className="px-3 py-2 truncate max-w-xs">
                          {row[field] ?? "-"}
                        </td>
                      ))}
                      {optionalFields.map((field) => (
                        <td
                          key={field}
                          className="px-3 py-2 truncate max-w-xs text-muted-foreground"
                        >
                          {row[field] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Overall Status */}
      {files.length > 1 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Files Complete:{" "}
              {files.filter((f) => isFileMappingComplete(f.name)).length}/
              {files.length}
            </span>
            {allFilesMappingsComplete() && (
              <span className="text-sm text-green-600 font-semibold">
                ✓ All files are ready to proceed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
