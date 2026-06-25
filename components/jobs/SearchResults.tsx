"use client";

import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import * as React from "react";

import { JobCard } from "./JobCard";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { FilterRail } from "./FilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { AppliedFilterChips } from "./AppliedFilterChips";
import { SortDropdown } from "./SortDropdown";
import { Pagination } from "./Pagination";
import { ApplyDialog } from "./ApplyDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { filterReducer, activeFilterCount } from "@/lib/utils/filter";
import { serializeFilters } from "@/lib/utils/filter-url";
import type { JobFilterState, JobWithCompany } from "@/lib/types";

interface JobsResponse {
  jobs: JobWithCompany[];
  total: number;
  page: number;
  totalPages: number;
}

interface SearchResultsProps {
  initialFilters: JobFilterState;
  initialData: JobsResponse;
  isAuthenticated: boolean;
  initialSavedIds: string[];
  initialAppliedIds: string[];
}

export function SearchResults({
  initialFilters,
  initialData,
  isAuthenticated,
  initialSavedIds,
  initialAppliedIds,
}: SearchResultsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [filters, dispatch] = React.useReducer(filterReducer, initialFilters);
  const [data, setData] = React.useState<JobsResponse>(initialData);
  const [loading, setLoading] = React.useState(false);
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set(initialSavedIds));
  const [appliedIds, setAppliedIds] = React.useState<Set<string>>(new Set(initialAppliedIds));
  const [applyJob, setApplyJob] = React.useState<JobWithCompany | null>(null);

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    // Skip the fetch on first mount — server already provided initialData.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const query = serializeFilters(filters);
    router.replace(`/jobs${query ? `?${query}` : ""}`, { scroll: false });

    let cancelled = false;
    setLoading(true);
    fetch(`/api/jobs?${query}`)
      .then((res) => res.json() as Promise<JobsResponse>)
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, router]);

  function requireAuth(action: string): boolean {
    if (isAuthenticated) return true;
    toast({ title: "Please log in", description: `Log in to ${action}.`, variant: "info" });
    router.push(`/login?redirect=/jobs`);
    return false;
  }

  async function handleToggleSave(jobId: string) {
    if (!requireAuth("save jobs")) return;
    const willSave = !savedIds.has(jobId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (willSave) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) {
      toast({
        title: willSave ? "Job saved" : "Removed from saved",
        variant: willSave ? "success" : "default",
      });
    }
  }

  function handleApply(job: JobWithCompany) {
    if (!requireAuth("apply to jobs")) return;
    setApplyJob(job);
  }

  function handleApplied(jobId: string) {
    setAppliedIds((prev) => new Set(prev).add(jobId));
  }

  const activeCount = activeFilterCount(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <FilterRail filters={filters} dispatch={dispatch} className="hidden self-start lg:block" />

        <div>
          <div className="surface-card mb-4 flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold text-foreground">{data.total} jobs found</h1>
                {filters.keyword ? (
                  <p className="text-sm text-muted-foreground">
                    Showing results for &ldquo;{filters.keyword}&rdquo;
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <MobileFilterDrawer
                  filters={filters}
                  dispatch={dispatch}
                  resultCount={data.total}
                  activeCount={activeCount}
                />
                <SortDropdown
                  value={filters.sort}
                  onChange={(value) => dispatch({ type: "SET_SORT", value })}
                />
              </div>
            </div>
            <AppliedFilterChips filters={filters} dispatch={dispatch} />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : data.jobs.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No jobs match your filters"
              description="Try removing some filters or searching with different keywords."
              action={
                <Button onClick={() => dispatch({ type: "CLEAR_ALL" })}>Clear all filters</Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {data.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedIds.has(job.id)}
                  isApplied={appliedIds.has(job.id)}
                  onToggleSave={handleToggleSave}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(page) => {
                dispatch({ type: "SET_PAGE", value: page });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>

      <ApplyDialog
        job={applyJob}
        open={applyJob !== null}
        onOpenChange={(open) => !open && setApplyJob(null)}
        onApplied={handleApplied}
      />
    </div>
  );
}
