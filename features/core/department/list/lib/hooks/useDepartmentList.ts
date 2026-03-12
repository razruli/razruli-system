"use client";

import { useCallback } from "react";

import { useDepartmentListStore } from "../../model/store";

// Main feature hook: Department list data and actions
export function useDepartmentList() {
  const { page, limit, sort, filter, selectedIds } = useDepartmentListStore();

  // TODO: Connect to entity hooks when available
  // const { data, loading, error, refetch } = useGetDepartments({
  //   variables: { page, limit, sort, filter },
  // });

  const handlePageChange = useCallback((newPage: number) => {
    useDepartmentListStore.setState({ page: newPage });
  }, []);

  const handleSort = useCallback((newSort: string) => {
    useDepartmentListStore.setState({ sort: newSort });
  }, []);

  const handleFilter = useCallback((newFilter: string) => {
    useDepartmentListStore.setState({ filter: newFilter });
  }, []);

  return {
    // Data
    // departments: data?.departments?.nodes,
    // total: data?.departments?.total,
    // loading,
    // error,

    // State
    page,
    limit,
    sort,
    filter,
    selectedIds,

    // Actions
    handlePageChange,
    handleSort,
    handleFilter,
  };
}
