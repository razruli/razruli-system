import { useCallback } from "react";
import { useInsightsStore } from "../store/insightsStore";
import type { InsightQuery } from "../../model/types";

export function useInsights() {
  const { queries, activeQueryId, addQuery, updateQuery, removeQuery, setActiveQuery, clearQueries } = useInsightsStore();

  const addInsightQuery = useCallback(
    (query: InsightQuery) => {
      addQuery(query);
    },
    [addQuery]
  );

  const runQuery = useCallback(
    (queryId: string) => {
      updateQuery(queryId, { status: "loading" });
    },
    [updateQuery]
  );

  const updateQueryResult = useCallback(
    (queryId: string, status: "success" | "error", updates?: Record<string, unknown>) => {
      updateQuery(queryId, { status, ...updates });
    },
    [updateQuery]
  );

  const activeQuery = queries.find((q) => q.id === activeQueryId);

  return {
    queries,
    activeQuery,
    activeQueryId,
    addInsightQuery,
    runQuery,
    updateQueryResult,
    removeQuery,
    setActiveQuery,
    clearQueries,
  };
}
