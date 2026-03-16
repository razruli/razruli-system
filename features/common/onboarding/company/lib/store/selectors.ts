import { useShallow } from "zustand/react/shallow";

import { useCompanyStore } from "./store";

export const useCompanyData = () => useCompanyStore((state) => state.data);
export const useCompanyError = () => useCompanyStore((state) => state.error);
export const useCompanyActions = () =>
  useCompanyStore(
    useShallow((state) => ({
      setData: state.setData,
      setError: state.setError,
      reset: state.reset,
    })),
  );
