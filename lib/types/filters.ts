export type SortOption = "relevance" | "date";

export interface JobFilterState {
  keyword: string;
  location: string;
  experience: number | null;
  salaryMin: number | null;
  workMode: string[];
  department: string[];
  industry: string[];
  companyType: string[];
  education: string[];
  postedWithinDays: number | null;
  sort: SortOption;
  page: number;
}

export const DEFAULT_FILTERS: JobFilterState = {
  keyword: "",
  location: "",
  experience: null,
  salaryMin: null,
  workMode: [],
  department: [],
  industry: [],
  companyType: [],
  education: [],
  postedWithinDays: null,
  sort: "relevance",
  page: 1,
};

export const PAGE_SIZE = 8;
