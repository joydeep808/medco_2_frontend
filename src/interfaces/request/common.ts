// requests/common.ts

export interface PaginationQuery {
  page?: number; // default: 0
  size?: number; // default: 20
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DateRange {
  startDate: number; // timestamp
  endDate: number;   // timestamp
}