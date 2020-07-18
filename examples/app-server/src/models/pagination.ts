export interface IPaginationParams {
  offset?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  count: number;
}

export function applyPaginationBound(params: IPaginationParams = {}, limit: number = 50) {
  return {
    offset: 0,
    ...params,
    limit: params.limit && params.limit <= limit ? params.limit : limit
  };
}

