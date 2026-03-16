import { useShallow } from "zustand/react/shallow";

import { useRoleStore } from "./store";

export const useRoleData = () => useRoleStore((state) => state.data);
export const useRoleError = () => useRoleStore((state) => state.error);
export const useRoleActions = () =>
  useRoleStore(
    useShallow((state) => ({
      setData: state.setData,
      setError: state.setError,
      reset: state.reset,
    })),
  );
