"use client";

import { useCallback } from "react";

import { useEmployeeListStore } from "../../model/store";

// Main feature hook: Employee list data and actions
export function useEmployeeList() {
  const { page, limit, sort, filter, selectedIds } = useEmployeeListStore();

  // TODO: Connect to entity hooks when available
  // const { data, loading, error, refetch } = useGetEmployees({
  //   variables: { page, limit, sort, filter },
  // });

  const handlePageChange = useCallback((newPage: number) => {
    useEmployeeListStore.setState({ page: newPage });
  }, []);

  const handleSort = useCallback((newSort: string) => {
    useEmployeeListStore.setState({ sort: newSort });
  }, []);

  const handleFilter = useCallback((newFilter: string) => {
    useEmployeeListStore.setState({ filter: newFilter });
  }, []);

  return {
    // Data
    // employees: data?.employees?.nodes,
    // total: data?.employees?.total,
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
