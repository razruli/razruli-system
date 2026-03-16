import { create } from "zustand";

import type { InsightQuery } from "@/entities/ai-assistant/insight-query";

interface InsightQueriesState {
  queries: InsightQuery[];
  activeQueryId: string | null;
  addQuery: (query: InsightQuery) => void;
  updateQuery: (queryId: string, updates: Partial<InsightQuery>) => void;
  removeQuery: (queryId: string) => void;
  setActiveQuery: (queryId: string | null) => void;
  clearQueries: () => void;
}

export const useInsightQueriesStore = create<InsightQueriesState>((set) => ({
  queries: [],
  activeQueryId: null,

  addQuery: (query: InsightQuery) =>
    set((state) => ({
      queries: [...state.queries, query],
      activeQueryId: query.id,
    })),

  updateQuery: (queryId: string, updates: Partial<InsightQuery>) =>
    set((state) => ({
      queries: state.queries.map((q) =>
        q.id === queryId ? { ...q, ...updates } : q,
      ),
    })),

  removeQuery: (queryId: string) =>
    set((state) => {
      const filtered = state.queries.filter((q) => q.id !== queryId);
      return {
        queries: filtered,
        activeQueryId:
          state.activeQueryId === queryId
            ? filtered[0]?.id || null
            : state.activeQueryId,
      };
    }),

  setActiveQuery: (queryId: string | null) =>
    set({
      activeQueryId: queryId,
    }),

  clearQueries: () =>
    set({
      queries: [],
      activeQueryId: null,
    }),
}));
