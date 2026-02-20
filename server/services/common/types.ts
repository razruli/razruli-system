export interface ListFilters {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ListResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface FindManyOptions<T> {
  where?: any;
  orderBy?: any;
  take?: number;
  skip?: number;
  include?: any;
}
