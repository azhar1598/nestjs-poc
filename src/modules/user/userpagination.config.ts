export interface PaginationConfig {
  page: number;
  limit: number;
}

export const DEFAULT_PAGINATION: PaginationConfig = {
  page: 1,
  limit: 10,
};
