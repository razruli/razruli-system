import { useShallow } from "zustand/react/shallow";

import { useUploadStore } from "./store";

export const useUploadFiles = () => useUploadStore((state) => state.files);
export const useUploadIsUploading = () =>
  useUploadStore((state) => state.isUploading);
export const useUploadGlobalError = () =>
  useUploadStore((state) => state.globalError);

export const useUploadActions = () =>
  useUploadStore(
    useShallow((state) => ({
      addFile: state.addFile,
      removeFile: state.removeFile,
      updateFileProgress: state.updateFileProgress,
      setFileError: state.setFileError,
      setIsUploading: state.setIsUploading,
      setGlobalError: state.setGlobalError,
      reset: state.reset,
      getFiles: state.getFiles,
    })),
  );
