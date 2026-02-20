"use client";

import { useUsersDatasetModel } from "./model/useUsersDatasetModel";
import { UsersDatasetView } from "./ui/UserDatasetView";

interface UsersDatasetWidgetProps {
  // Feature toggles - control what the widget renders
  rowFilters?: boolean;
  pagination?: boolean;
  // Filter visibility: array of filter field IDs to show
  // Undefined = show all from config, empty array = no filters
  filters?: string[];
}

/**
 * Users Dataset Widget - Orchestrator
 *
 * Responsibility: Instantiate the model and pass to view
 * The model is the single source of truth for all state and behavior
 *
 * Pattern: Query-Driven Architecture
 * - Model manages unified query state
 * - View is pure presentation (dumb component)
 * - Everything flows from query object
 */
export default function UsersDatasetWidget({
  rowFilters = true,
  pagination = true,
  filters,
}: UsersDatasetWidgetProps) {
  // Single source of truth: the dataset model
  const model = useUsersDatasetModel();

  return (
    <UsersDatasetView
      // All table/data/form state from model
      table={model.table}
      form={model.form}
      users={model.users}
      pageInfo={model.pageInfo}
      totalPages={model.totalPages}
      currentPage={model.currentPage}
      loading={model.loading}
      error={model.error}
      query={model.query}
      // All handlers from model
      onPageChange={model.onPageChange}
      onPageSizeChange={model.onPageSizeChange}
      onApplyFilters={model.onApplyFilters}
      onSearchChange={model.onSearchChange}
      onRefresh={model.onRefresh}
      onReset={model.onReset}
      // Style handlers
      styleOptions={model.styleOptions}
      setStyleVariant={model.setStyleVariant}
      setTheme={model.setTheme}
      // Column visibility
      columnVisibility={model.columnVisibility}
      toggleColumn={model.toggleColumn}
      showAllColumns={model.showAllColumns}
      hideAllColumns={model.hideAllColumns}
      // Feature flags
      showRowFilters={rowFilters}
      showPagination={pagination}
      // Filter visibility
      filters={filters}
    />
  );
}
