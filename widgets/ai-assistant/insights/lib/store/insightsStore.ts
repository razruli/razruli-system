import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { InsightQuery, InsightsState } from "../model/types";

export const useInsightsStore = create<
  InsightsState & {
    addQuery: (query: InsightQuery) => void;
    updateQuery: (queryId: string, updates: Partial<InsightQuery>) => void;
    removeQuery: (queryId: string) => void;
    setActiveQuery: (queryId: string | null) => void;
    clearQueries: () => void;
  }
>(
  immer((set) => ({
    queries: [],
    activeQueryId: null,

    addQuery: (query: InsightQuery) =>
      set((state) => {
        state.queries.push(query);
        state.activeQueryId = query.id;
      }),

    updateQuery: (queryId: string, updates: Partial<InsightQuery>) =>
      set((state) => {
        const query = state.queries.find((q) => q.id === queryId);
        if (query) {
          Object.assign(query, updates);
        }
      }),

    removeQuery: (queryId: string) =>
      set((state) => {
        state.queries = state.queries.filter((q) => q.id !== queryId);
        if (state.activeQueryId === queryId) {
          state.activeQueryId = state.queries[0]?.id || null;
        }
      }),

    setActiveQuery: (queryId: string | null) =>
      set((state) => {
        state.activeQueryId = queryId;
      }),

    clearQueries: () =>
      set({
        queries: [],
        activeQueryId: null,
      }),
  }))
);
