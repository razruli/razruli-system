// entities/user/index.ts
// Public API for User entity slice
// Exports: types, configs, utilities, dumb components
// Does NOT export: hooks, business logic

// Types
export type { UserTData } from "./type/user";
export type { UserTableRow } from "./type/user";

// Filter configuration & types
export type {
  UserTableFilterValues,
  UserDatasetFilterValues,
} from "./model/filters/types";
export type {
  UserTableFilterVariables,
  UserDatasetFilterVariables,
} from "./model/filters/types";
export {
  userTableFilterConfig,
  userDatasetFilterConfig,
} from "./model/filters/config";
export {
  userTableFilterDefaults,
  userDatasetFilterDefaults,
} from "./model/filters/config";

// Row configuration
export { userRowConfig } from "./model/table-rows/config";

// Utilities
export { mapUsersToRows } from "./lib/mappers/mapGQLTypeToTData";

// UI Components (dumb)
export { FilterTextInput } from "./ui/filters/FilterTextInput";
export { FilterSelect } from "./ui/filters/FilterSelect";
export { FilterSwitch } from "./ui/filters/FilterSwitch";
export { FilterCheckboxGroup } from "./ui/filters/FilterCheckboxGroup";
export { FilterDateRange } from "./ui/filters/FilterDateRange";
