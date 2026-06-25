import { NextResponse } from "next/server";

import { getJobsWithCompany } from "@/lib/data/queries";
import { parseFilters } from "@/lib/utils/filter-url";
import { activeFilterCount, filterJobs, paginate, sortJobs } from "@/lib/utils/filter";
import { PAGE_SIZE } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseFilters(searchParams);

  const all = await getJobsWithCompany();
  const filtered = sortJobs(filterJobs(all, filters), filters.sort);
  const jobs = paginate(filtered, filters.page, PAGE_SIZE);

  return NextResponse.json({
    jobs,
    total: filtered.length,
    page: filters.page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    activeFilters: activeFilterCount(filters),
  });
}
