/**
 * useDashboardOverview Hook
 * Feature-level hook that connects dashboard state management to entity hooks
 * Manages loading, error, and data consumption patterns
 */

"use client";

import { useCallback, useMemo } from "react";

import { useGetDashboardOverview } from "@/entities/system/dashboard-overview";
import type {
  DepartmentFilterInput,
  EmployeeFilterInput,
  EmployeePaginationInput,
} from "@/shared/graphql/generated";

interface UseDashboardOverviewParams {
  companyId: string;
  departmentFilter: DepartmentFilterInput;
  employeeFilter?: EmployeeFilterInput;
  employeePagination?: EmployeePaginationInput;
}

/**
 * Main dashboard overview hook
 * Preloads and manages dashboard data (employees, departments, company stats)
 */
export function useDashboardOverview(params: UseDashboardOverviewParams) {
  const { companyId, departmentFilter, employeeFilter, employeePagination } =
    params;

  // Fetch dashboard overview data via entity hook
  const { data, loading, error, refetch } = useGetDashboardOverview({
    companyId,
    departmentFilter,
    employeeFilter: employeeFilter || { companyId },
    employeePagination: employeePagination || { offset: 0, limit: 20 },
  });

  // Memoize dashboard data for performance
  const dashboardData = useMemo(
    () => ({
      employees: data?.employees,
      departments: data?.departments,
      company: data?.company,
    }),
    [data],
  );

  // Provide refetch capability for manual updates
  const handleRefresh = useCallback(() => {
    return refetch();
  }, [refetch]);

  return {
    // Data
    dashboardData,
    employees: data?.employees,
    departments: data?.departments,
    company: data?.company,

    // State
    isLoading: loading,
    error,

    // Actions
    refetch: handleRefresh,
  };
}
