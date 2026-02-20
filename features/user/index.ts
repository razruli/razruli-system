// features/user/index.ts
// Public API for User feature slice
// Exports only what is used by dataset widget and features

// Dataset/Filter Hooks
export { useUserDatasetFilterForm } from "./model/hooks/useUserDatasetFilterForm";
export { useFilterDrawer } from "./model/table/filter/useFilterDrawer";

// Dataset Columns & Row Behavior Hooks
export { useUserDatasetColumns } from "./config/table/hooks/useUserDatasetColumns";
export { useUserRowModel } from "./config/table/rows/hooks/useUserRowModel";

// Filter UI Components (smart) - Dataset names are primary
export { UserTableFiltersUI as UserDatasetFiltersUI } from "./ui/UserTableFiltersUI";
export { UserTableFiltersBar as UserDatasetFiltersBar } from "./ui/UserTableFiltersBar";
export { UserTableFilterDrawer as UserDatasetFilterDrawer } from "./ui/UserTableFilterDrawer";
export { UserFilterForm as UserDatasetFilterForm } from "./ui/userFilterForm";
export { UserFilters as UserDatasetFilters } from "./ui/UserFilter";
