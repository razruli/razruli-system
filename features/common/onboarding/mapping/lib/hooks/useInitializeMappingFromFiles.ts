import { useCallback } from "react";

import {
  readAndParseCSV,
  getCSVPreview,
} from "@/shared/lib/dataProcessing/csvParser";

import { FileType, useMappingStore } from "../store/store";

export function useInitializeMappingFromFiles(uploadedFiles: File[]) {
  const addFile = useMappingStore((state) => state.addFile);
  const files = useMappingStore((state) => state.files);
  const fileNames = files.map((f) => f.name);

  const getFileType = (fileName: string): FileType | null => {
    const lower = fileName.toLowerCase();
    if (lower.includes("depart")) return "department";
    if (lower.includes("employ")) return "employee";
    if (lower.includes("process")) return "process";
    return null;
  };

  const initialize = useCallback(async () => {
    if (uploadedFiles.length === 0) return;

    try {
      for (const file of uploadedFiles) {
        // Skip if already initialized
        if (fileNames.includes(file.name)) {
          continue;
        }

        const parsed = await readAndParseCSV(file);
        const preview = getCSVPreview(parsed, 5);

        // Determine file type from filename
        const fileType = getFileType(file.name);

        if (!fileType) {
          throw new Error(
            `Could not determine file type for ${file.name}. File name must contain 'departments', 'employees', or 'processes'.`,
          );
        }

        addFile({
          name: file.name,
          type: fileType,
          headers: parsed.headers,
          sampleRows: preview,
        });
      }
    } catch (error) {
      console.error("Failed to parse CSV file:", error);
      throw error;
    }
  }, [uploadedFiles, addFile, fileNames]);

  return initialize;
}
