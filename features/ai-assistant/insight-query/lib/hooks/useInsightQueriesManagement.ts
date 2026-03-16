import { useCallback } from "react";

import type { InsightQuery } from "@/entities/ai-assistant/insight-query";

import { useInsightQueriesStore } from "../store/insightQueriesStore";

export function useInsightQueriesManagement() {
  const {
    queries,
    activeQueryId,
    addQuery,
    updateQuery,
    removeQuery,
    setActiveQuery,
    clearQueries,
  } = useInsightQueriesStore();

  const addInsightQuery = useCallback(
    (query: InsightQuery) => {
      addQuery(query);
    },
    [addQuery],
  );

  const runQuery = useCallback(
    (queryId: string) => {
      updateQuery(queryId, { status: "loading" });
    },
    [updateQuery],
  );

  const completeQuery = useCallback(
    (queryId: string, result: string) => {
      updateQuery(queryId, { status: "success", result });
    },
    [updateQuery],
  );

  const failQuery = useCallback(
    (queryId: string, error: string) => {
      updateQuery(queryId, { status: "error", error });
    },
    [updateQuery],
  );

  const activeQuery = queries.find((q) => q.id === activeQueryId);

  return {
    queries,
    activeQuery,
    activeQueryId,
    addInsightQuery,
    runQuery,
    completeQuery,
    failQuery,
    removeQuery,
    setActiveQuery,
    clearQueries,
  };
}
