import { useShallow } from "zustand/react/shallow";

import { useConfirmationStore } from "./store";

export const useConfirmationData = () =>
  useConfirmationStore((state) => state.confirmed);
export const useConfirmationError = () =>
  useConfirmationStore((state) => state.error);
export const useConfirmationActions = () =>
  useConfirmationStore(
    useShallow((state) => ({
      setConfirmed: state.setConfirmed,
      setError: state.setError,
      reset: state.reset,
    })),
  );
