import { create } from "zustand";

interface UploadedFile {
  file: File;
  name: string;
  progress: number;
  error?: string;
}

interface UploadState {
  files: UploadedFile[];
  isUploading: boolean;
  globalError?: string;

  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
  updateFileProgress: (fileName: string, progress: number) => void;
  setFileError: (fileName: string, error?: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  setGlobalError: (error?: string) => void;
  reset: () => void;
  getFiles: () => File[];
}

export const useUploadStore = create<UploadState>((set, get) => ({
  files: [],
  isUploading: false,
  globalError: undefined,

  addFile: (file) =>
    set((state) => ({
      files: [
        ...state.files,
        {
          file,
          name: file.name,
          progress: 0,
          error: undefined,
        },
      ],
      globalError: undefined,
    })),

  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((f) => f.name !== fileName),
      globalError: undefined,
    })),

  updateFileProgress: (fileName, progress) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.name === fileName ? { ...f, progress } : f,
      ),
    })),

  setFileError: (fileName, error) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.name === fileName ? { ...f, error } : f,
      ),
    })),

  setIsUploading: (isUploading) => set({ isUploading }),

  setGlobalError: (error) => set({ globalError: error }),

  reset: () =>
    set({
      files: [],
      isUploading: false,
      globalError: undefined,
    }),

  getFiles: () => get().files.map((f) => f.file),
}));
