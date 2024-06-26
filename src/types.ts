export interface ApiResponse {
  success: boolean;
  rows: IOlympicData[];
}

export interface IOlympicData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export type SortQueryParams = Record<string, "asc" | "desc">;
