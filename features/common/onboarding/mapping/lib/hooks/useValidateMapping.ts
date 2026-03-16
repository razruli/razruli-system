import { useCallback } from "react";

import { useMappingStore } from "../store/store";

export function useValidateMapping() {
  const allFilesMappingsComplete = useMappingStore(
    (state) => state.allFilesMappingsComplete,
  );

  return useCallback(() => {
    return allFilesMappingsComplete();
  }, [allFilesMappingsComplete]);
}
