/**
 * Shape of filter form values
 * Generated from config
 */
export type UserTableFilterValues = {
  search: string;
  status?: string | null;
  emailVerified?: boolean | null;
  createdDate?: {
    from: Date | null;
    to: Date | null;
  };
};

/**
 * Maps to GQL query variables
 * subset of UseUsersQueryOptions
 */
export type UserTableFilterVariables = {
  search?: string;
  status?: string;
  emailVerified?: boolean;
  createdAfter?: string; // ISO date
  createdBefore?: string; // ISO date
};

export type UserDatasetFilterValues = UserTableFilterValues;
export type UserDatasetFilterVariables = UserTableFilterVariables;
