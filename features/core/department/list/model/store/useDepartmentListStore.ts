"use client";

import { create } from "zustand";

interface DepartmentListState {
  page: number;
  limit: number;
  sort: string;
  filter: string;
  selectedIds: string[];

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: string) => void;
  setFilter: (filter: string) => void;
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useDepartmentListStore = create<DepartmentListState>((set) => ({
  page: 1,
  limit: 20,
  sort: "name",
  filter: "",
  selectedIds: [],

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSort: (sort) => set({ sort, page: 1 }),
  setFilter: (filter) => set({ filter, page: 1 }),

  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    })),

  clearSelection: () => set({ selectedIds: [] }),
  reset: () => set({ page: 1, sort: "name", filter: "", selectedIds: [] }),
}));
