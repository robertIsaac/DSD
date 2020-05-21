export interface Filter<T, T2 = string> {
  filter?: keyof T;
  value?: string | T2;
  page: number;
  limit: number;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}
