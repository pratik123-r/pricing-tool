export interface PaginationResult<T = any> {
  data: T[];
  total: number;
}

export interface PaginationResultWithMeta<T = any> extends PaginationResult<T> {
  page: number;
  limit: number;
}

