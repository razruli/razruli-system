"use client";

import { useCallback } from "react";

import { useInsightQueriesManagement } from "@/features/ai-assistant/insight-query";
import { useBatchInsightsLoading } from "@/features/ai-assistant/insight-query";

/**
 * Widget Model: Orchestrates insight-query feature
 *
 * This hook manages insights widget behavior:
 * - Query list management
 * - Batch loading coordination
 * - Remove/refresh actions
 *
 * Widget UI consumes ONLY this hook
 */
export function useInsightsWidget() {
  const { queries, addInsightQuery, removeQuery, setActiveQuery } =
    useInsightQueriesManagement();
  const { isLoadingBatch, loadInsightsInBatch } = useBatchInsightsLoading();

  const handleRefresh = useCallback(() => {
    loadInsightsInBatch();
  }, [loadInsightsInBatch]);

  const handleRemove = useCallback(
    (queryId: string) => {
      removeQuery(queryId);
    },
    [removeQuery],
  );

  return {
    queries,
    isLoadingBatch,
    addInsightQuery,
    removeQuery,
    setActiveQuery,
    handleRemove,
    handleRefresh,
  };
}
