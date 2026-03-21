import { create } from "zustand";

import { ColumnMapping, REQUIRED_FIELDS_BY_TYPE } from "../../model";

export type FileType =
  | "employee"
  | "company"
  | "role"
  | "department"
  | "process"
  | "finishedTasks";

interface MappingFile {
  name: string;
  type: FileType;
  sampleRows: Record<string, any>[]; // First few rows from CSV
  headers: string[]; // All CSV column headers
}

interface FileMapping {
  fileName: string;
  fileType: FileType;
  columnMap: ColumnMapping;
  sampleRows: Record<string, any>[];
  requiredFields: string[];
  validationErrors: string[];
  isValid: boolean;
}

interface MappingStoreState {
  files: MappingFile[];
  columnMappings: Record<string, ColumnMapping>; // { fileName: { csvColumn: dbField } }
  validationErrors: Record<string, string[]>; // { fileName: [errors] }
  isValidating: boolean;

  // Actions
  addFile: (file: MappingFile) => void;
  removeFile: (fileName: string) => void;
  setColumnMapping: (
    fileName: string,
    csvColumn: string,
    dbField: string,
  ) => void;
  clearColumnMappings: (fileName: string) => void;
  setValidationErrors: (fileName: string, errors: string[]) => void;
  setIsValidating: (isValidating: boolean) => void;
  getFileMapping: (fileName: string) => FileMapping | null;
  getMissingRequiredFields: (fileName: string) => string[];
  isFileMappingComplete: (fileName: string) => boolean;
  allFilesMappingsComplete: () => boolean;
  reset: () => void;
}

export const useMappingStore = create<MappingStoreState>((set, get) => ({
  files: [],
  columnMappings: {},
  validationErrors: {},
  isValidating: false,

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
      columnMappings: {
        ...state.columnMappings,
        [file.name]: {},
      },
      validationErrors: {
        ...state.validationErrors,
        [file.name]: [],
      },
    })),

  removeFile: (fileName) =>
    set((state) => {
      const newMappings = { ...state.columnMappings };
      const newErrors = { ...state.validationErrors };
      delete newMappings[fileName];
      delete newErrors[fileName];
      return {
        files: state.files.filter((f) => f.name !== fileName),
        columnMappings: newMappings,
        validationErrors: newErrors,
      };
    }),

  setColumnMapping: (fileName, csvColumn, dbField) =>
    set((state) => ({
      columnMappings: {
        ...state.columnMappings,
        [fileName]: {
          ...state.columnMappings[fileName],
          [csvColumn]: dbField,
        },
      },
    })),

  clearColumnMappings: (fileName) =>
    set((state) => ({
      columnMappings: {
        ...state.columnMappings,
        [fileName]: {},
      },
    })),

  setValidationErrors: (fileName, errors) =>
    set((state) => ({
      validationErrors: {
        ...state.validationErrors,
        [fileName]: errors,
      },
    })),

  setIsValidating: (isValidating) => set({ isValidating }),

  getFileMapping: (fileName) => {
    const state = get();
    const file = state.files.find((f) => f.name === fileName);
    if (!file) return null;

    const requiredFields = REQUIRED_FIELDS_BY_TYPE[file.type];

    return {
      fileName,
      fileType: file.type,
      columnMap: state.columnMappings[fileName] || {},
      sampleRows: file.sampleRows,
      requiredFields: Array.from(requiredFields),
      validationErrors: state.validationErrors[fileName] || [],
      isValid: (state.validationErrors[fileName] || []).length === 0,
    };
  },

  getMissingRequiredFields: (fileName) => {
    const state = get();
    const file = state.files.find((f) => f.name === fileName);
    if (!file) return [];

    const requiredFields = REQUIRED_FIELDS_BY_TYPE[file.type];
    const mappedDbFields = Object.values(state.columnMappings[fileName] || {});

    return requiredFields.filter((field) => !mappedDbFields.includes(field));
  },

  isFileMappingComplete: (fileName) => {
    const state = get();
    return (
      state.getMissingRequiredFields(fileName).length === 0 &&
      (state.validationErrors[fileName] || []).length === 0
    );
  },

  allFilesMappingsComplete: () => {
    const state = get();
    const REQUIRED_TYPES = [
      "department",
      "employee",
      "process",
      "finishedTasks",
    ];

    // Check all required file types are present
    const uploadedTypes = state.files.map((f) => f.type);
    const hasAllTypes = REQUIRED_TYPES.every((type) =>
      uploadedTypes.includes(type as FileType),
    );

    if (!hasAllTypes) {
      return false;
    }

    // Check all files have complete mappings
    return (
      state.files.length > 0 &&
      state.files.every((file) => state.isFileMappingComplete(file.name))
    );
  },

  reset: () =>
    set({
      files: [],
      columnMappings: {},
      validationErrors: {},
      isValidating: false,
    }),
}));
