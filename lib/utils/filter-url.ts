import { DEFAULT_FILTERS, type JobFilterState, type SortOption } from "@/lib/types";

type ParamsLike = URLSearchParams | Record<string, string | string[] | undefined>;

function getAll(params: ParamsLike, key: string): string[] {
  if (params instanceof URLSearchParams) {
    return params.getAll(key);
  }
  const v = params[key];
  if (v === undefined) return [];
  return Array.isArray(v) ? v : v.split(",").filter(Boolean);
}

function getOne(params: ParamsLike, key: string): string | null {
  if (params instanceof URLSearchParams) {
    return params.get(key);
  }
  const v = params[key];
  if (v === undefined) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

/** Build a JobFilterState from URL search params (used on the SRP). */
export function parseFilters(params: ParamsLike): JobFilterState {
  const num = (key: string): number | null => {
    const v = getOne(params, key);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const sortRaw = getOne(params, "sort");
  const sort: SortOption = sortRaw === "date" ? "date" : "relevance";

  return {
    keyword: getOne(params, "q") ?? "",
    location: getOne(params, "location") ?? "",
    experience: num("experience"),
    salaryMin: num("salary"),
    workMode: getAll(params, "workMode"),
    department: getAll(params, "department"),
    industry: getAll(params, "industry"),
    companyType: getAll(params, "companyType"),
    education: getAll(params, "education"),
    postedWithinDays: num("posted"),
    sort,
    page: Math.max(1, num("page") ?? 1),
  };
}

/** Serialize filter state into a URL query string (omitting defaults). */
export function serializeFilters(filters: JobFilterState): string {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("q", filters.keyword);
  if (filters.location) params.set("location", filters.location);
  if (filters.experience !== null) params.set("experience", String(filters.experience));
  if (filters.salaryMin !== null) params.set("salary", String(filters.salaryMin));
  if (filters.postedWithinDays !== null) params.set("posted", String(filters.postedWithinDays));
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  for (const v of filters.workMode) params.append("workMode", v);
  for (const v of filters.department) params.append("department", v);
  for (const v of filters.industry) params.append("industry", v);
  for (const v of filters.companyType) params.append("companyType", v);
  for (const v of filters.education) params.append("education", v);
  return params.toString();
}
