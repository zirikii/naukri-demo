import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
  type JobFilterState,
  type JobWithCompany,
  type SortOption,
} from "@/lib/types";

/** Array fields on JobFilterState that behave as multi-select facets. */
export type ArrayFacet = "workMode" | "department" | "industry" | "companyType" | "education";

export type FilterAction =
  | { type: "SET_KEYWORD"; value: string }
  | { type: "SET_LOCATION"; value: string }
  | { type: "SET_EXPERIENCE"; value: number | null }
  | { type: "SET_SALARY"; value: number | null }
  | { type: "SET_POSTED"; value: number | null }
  | { type: "SET_SORT"; value: SortOption }
  | { type: "SET_PAGE"; value: number }
  | { type: "TOGGLE_FACET"; facet: ArrayFacet; value: string }
  | { type: "CLEAR_FACET"; facet: keyof JobFilterState }
  | { type: "CLEAR_ALL" }
  | { type: "REPLACE"; value: JobFilterState };

/**
 * Pure reducer driving the Search Results Page filter rail. Any change that affects the
 * result set resets pagination to page 1; only SET_PAGE changes the page directly.
 */
export function filterReducer(state: JobFilterState, action: FilterAction): JobFilterState {
  switch (action.type) {
    case "SET_KEYWORD":
      return { ...state, keyword: action.value, page: 1 };
    case "SET_LOCATION":
      return { ...state, location: action.value, page: 1 };
    case "SET_EXPERIENCE":
      return { ...state, experience: action.value, page: 1 };
    case "SET_SALARY":
      return { ...state, salaryMin: action.value, page: 1 };
    case "SET_POSTED":
      return { ...state, postedWithinDays: action.value, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.value, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.value };
    case "TOGGLE_FACET": {
      const current = state[action.facet];
      const next = current.includes(action.value)
        ? current.filter((v) => v !== action.value)
        : [...current, action.value];
      return { ...state, [action.facet]: next, page: 1 };
    }
    case "CLEAR_FACET": {
      const reset = DEFAULT_FILTERS[action.facet];
      return { ...state, [action.facet]: reset, page: 1 };
    }
    case "CLEAR_ALL":
      return { ...DEFAULT_FILTERS };
    case "REPLACE":
      return { ...action.value };
    default:
      return state;
  }
}

function matchesKeyword(job: JobWithCompany, keyword: string): boolean {
  if (!keyword) return true;
  const q = keyword.toLowerCase();
  return (
    job.title.toLowerCase().includes(q) ||
    job.company.name.toLowerCase().includes(q) ||
    job.role.toLowerCase().includes(q) ||
    job.skills.some((s) => s.toLowerCase().includes(q))
  );
}

function matchesLocation(job: JobWithCompany, location: string): boolean {
  if (!location) return true;
  const q = location.toLowerCase();
  return job.locations.some((l) => l.toLowerCase().includes(q));
}

/** Apply all active facet predicates. Does not sort or paginate. */
export function filterJobs(jobs: JobWithCompany[], filters: JobFilterState): JobWithCompany[] {
  return jobs.filter((job) => {
    if (!matchesKeyword(job, filters.keyword)) return false;
    if (!matchesLocation(job, filters.location)) return false;

    if (filters.experience !== null) {
      if (filters.experience < job.experienceMin || filters.experience > job.experienceMax) {
        return false;
      }
    }

    if (filters.salaryMin !== null) {
      if (job.salaryMax === null || job.salaryMax < filters.salaryMin) return false;
    }

    if (filters.workMode.length > 0 && !filters.workMode.includes(job.workMode)) return false;
    if (filters.department.length > 0 && !filters.department.includes(job.department)) return false;
    if (filters.industry.length > 0 && !filters.industry.includes(job.industry)) return false;
    if (filters.companyType.length > 0 && !filters.companyType.includes(job.companyType)) {
      return false;
    }
    if (filters.education.length > 0 && !filters.education.includes(job.education)) return false;

    if (filters.postedWithinDays !== null) {
      const ageDays = (Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays > filters.postedWithinDays) return false;
    }

    return true;
  });
}

/** Sort jobs by the chosen option (relevance falls back to most recent + applicants). */
export function sortJobs(jobs: JobWithCompany[], sort: SortOption): JobWithCompany[] {
  const copy = [...jobs];
  if (sort === "date") {
    copy.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  } else {
    copy.sort((a, b) => b.applicants - a.applicants);
  }
  return copy;
}

export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/** Count how many distinct facets are currently active (for the "clear all" affordance). */
export function activeFilterCount(filters: JobFilterState): number {
  let count = 0;
  if (filters.keyword) count += 1;
  if (filters.location) count += 1;
  if (filters.experience !== null) count += 1;
  if (filters.salaryMin !== null) count += 1;
  if (filters.postedWithinDays !== null) count += 1;
  count += filters.workMode.length;
  count += filters.department.length;
  count += filters.industry.length;
  count += filters.companyType.length;
  count += filters.education.length;
  return count;
}
