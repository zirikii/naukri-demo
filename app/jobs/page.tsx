import type { Metadata } from "next";

import { SearchResults } from "@/components/jobs/SearchResults";
import { getApplications, getJobsWithCompany, getSavedJobs } from "@/lib/data/queries";
import { getSession } from "@/lib/auth/getSession";
import { parseFilters } from "@/lib/utils/filter-url";
import { activeFilterCount, filterJobs, paginate, sortJobs } from "@/lib/utils/filter";
import { PAGE_SIZE } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search Jobs",
  description: "Search and filter jobs across India's top companies.",
};

interface SearchPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function JobsPage({ searchParams }: SearchPageProps) {
  const filters = parseFilters(searchParams);

  const [allJobs, session, saved, applications] = await Promise.all([
    getJobsWithCompany(),
    getSession(),
    getSavedJobs(),
    getApplications(),
  ]);

  const filtered = sortJobs(filterJobs(allJobs, filters), filters.sort);
  const jobs = paginate(filtered, filters.page, PAGE_SIZE);

  const initialData = {
    jobs,
    total: filtered.length,
    page: filters.page,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    activeFilters: activeFilterCount(filters),
  };

  return (
    <SearchResults
      initialFilters={filters}
      initialData={initialData}
      isAuthenticated={session !== null}
      initialSavedIds={saved.map((s) => s.jobId)}
      initialAppliedIds={applications.map((a) => a.jobId)}
    />
  );
}
