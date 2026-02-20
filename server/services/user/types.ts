// server/services/user/types.ts
export interface CreateUserInput {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface UpdateUserInput {
  id: string;
  name?: string;
  image?: string;
}
export interface ListUsersInput {
  limit: number;
  offset: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
  emailVerified?: boolean;
  createdBefore?: Date;
  createdAfter?: Date;
}

export interface UsersListResult {
  items: UserResult[];
  total: number;
  hasMore: boolean;
}

export interface UserResult {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
