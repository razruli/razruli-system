"use client";

import { useRef, useState } from "react";

import {
  useUploadFiles,
  useUploadIsUploading,
  useUploadGlobalError,
  useUploadActions,
} from "../lib";
import { useValidateUpload } from "../lib/hooks";

const REQUIRED_FILES = [
  { type: "departments", label: "Departments File", order: 1 },
  { type: "employees", label: "Employees File", order: 2 },
  { type: "processes", label: "Processes File", order: 3 },
  { type: "finishedTasks", label: "Finished Tasks File", order: 4 },
];

const OPTIONAL_FILES: any[] = [];

export function UploadForm() {
  const files = useUploadFiles();
  const isUploading = useUploadIsUploading();
  const globalError = useUploadGlobalError();
  const { addFile, removeFile, setGlobalError } = useUploadActions();
  const validateUpload = useValidateUpload();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (fileName: string): string | null => {
    const lower = fileName.toLowerCase();
    if (lower.includes("depart")) return "departments";
    if (lower.includes("employ")) return "employees";
    if (lower.includes("process")) return "processes";
    if (
      lower.includes("finished") ||
      lower.includes("completed") ||
      lower.includes("task")
    )
      return "finishedTasks";
    return null;
  };

  const getUploadedTypes = () => {
    return files
      .map((f) => getFileType(f.name))
      .filter((t) => t !== null) as string[];
  };

  const getMissingFiles = () => {
    const uploaded = getUploadedTypes();
    return REQUIRED_FILES.filter((rf) => !uploaded.includes(rf.type));
  };

  const handleFileSelect = (selectedFile: File) => {
    const fileType = getFileType(selectedFile.name);

    if (!fileType) {
      setGlobalError(
        "File name must contain 'departments', 'employees', 'processes', or 'finished tasks'",
      );
      return;
    }

    // Check if we already have this file type
    if (files.some((f) => getFileType(f.name) === fileType)) {
      setGlobalError(
        `${REQUIRED_FILES.find((rf) => rf.type === fileType)?.label} already uploaded`,
      );
      return;
    }

    if (validateUpload(selectedFile)) {
      addFile(selectedFile);
      setGlobalError(undefined);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      for (let i = 0; i < droppedFiles.length; i++) {
        handleFileSelect(droppedFiles[i]);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        handleFileSelect(selectedFiles[i]);
      }
    }
  };

  const handleRemoveFile = (fileName: string) => {
    removeFile(fileName);
  };

  const missingFiles = getMissingFiles();
  const allFilesUploaded = missingFiles.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Upload Data Files</h2>
        <p className="text-muted-foreground mt-1">
          Upload all 4 required CSV files in any order: departments, employees,
          processes, and finished tasks
        </p>
      </div>

      {/* Required Files Status */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold text-sm mb-3 text-blue-900">
          Required Files ({REQUIRED_FILES.length - missingFiles.length}/
          {REQUIRED_FILES.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REQUIRED_FILES.map((req) => {
            const isUploaded = files.some(
              (f) => getFileType(f.name) === req.type,
            );
            return (
              <div
                key={req.type}
                className={`flex items-center gap-2 p-2 rounded ${
                  isUploaded
                    ? "bg-green-100 text-green-700"
                    : "bg-white text-muted-foreground"
                }`}
              >
                <span className="text-lg">
                  {isUploaded ? "✓" : `${req.order}`}
                </span>
                <span className="text-sm font-medium">{req.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-input hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="space-y-2"
        >
          <div className="text-4xl">📄</div>
          <p className="font-semibold">Drag and drop your files here</p>
          <p className="text-sm text-muted-foreground">
            or click to select from your computer
          </p>
          <p className="text-xs text-muted-foreground">
            CSV or Excel files up to 10MB each
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">
            Uploaded Files ({files.length}/{REQUIRED_FILES.length})
          </h3>
          {files.map((uploadedFile) => {
            const fileType = getFileType(uploadedFile.name);
            const fileInfo = REQUIRED_FILES.find((rf) => rf.type === fileType);
            return (
              <div
                key={uploadedFile.name}
                className="border rounded-lg p-4 bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-2xl">📄</div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fileInfo?.label} •{" "}
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => handleRemoveFile(uploadedFile.name)}
                      className="ml-2 text-destructive hover:text-destructive/80 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {uploadedFile.error && (
                  <div className="mt-2 text-sm text-destructive">
                    {uploadedFile.error}
                  </div>
                )}
                {uploadedFile.progress > 0 && uploadedFile.progress < 100 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-muted-foreground">
                        {uploadedFile.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Missing Files Info */}
      {!allFilesUploaded && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-900 mb-2">
            Still need to upload:
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            {missingFiles.map((mf) => (
              <li key={mf.type}>
                • {mf.order}. {mf.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {globalError && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
          {globalError}
        </div>
      )}
    </div>
  );
}
