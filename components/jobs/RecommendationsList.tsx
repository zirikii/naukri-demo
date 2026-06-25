"use client";

import { Sparkles } from "lucide-react";
import * as React from "react";

import { JobCard } from "./JobCard";
import { ApplyDialog } from "./ApplyDialog";
import { useToast } from "@/hooks/use-toast";
import type { JobWithCompany } from "@/lib/types";

export interface RecommendationItem {
  job: JobWithCompany;
  reasons: string[];
}

interface RecommendationsListProps {
  items: RecommendationItem[];
  initialSavedIds: string[];
  initialAppliedIds: string[];
}

export function RecommendationsList({
  items,
  initialSavedIds,
  initialAppliedIds,
}: RecommendationsListProps) {
  const { toast } = useToast();
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set(initialSavedIds));
  const [appliedIds, setAppliedIds] = React.useState<Set<string>>(new Set(initialAppliedIds));
  const [applyJob, setApplyJob] = React.useState<JobWithCompany | null>(null);

  async function handleToggleSave(jobId: string) {
    const willSave = !savedIds.has(jobId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (willSave) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    toast({
      title: willSave ? "Job saved" : "Removed from saved",
      variant: willSave ? "success" : "default",
    });
  }

  return (
    <div className="space-y-4">
      {items.map(({ job, reasons }) => (
        <div key={job.id}>
          <JobCard
            job={job}
            isSaved={savedIds.has(job.id)}
            isApplied={appliedIds.has(job.id)}
            onToggleSave={handleToggleSave}
            onApply={(j) => setApplyJob(j)}
          />
          <div className="mt-1.5 flex flex-wrap items-center gap-2 px-1">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Why recommended:
            </span>
            {reasons.slice(0, 3).map((reason) => (
              <span key={reason} className="rounded-full bg-sky/10 px-2 py-0.5 text-xs text-sky">
                {reason}
              </span>
            ))}
          </div>
        </div>
      ))}

      <ApplyDialog
        job={applyJob}
        open={applyJob !== null}
        onOpenChange={(open) => !open && setApplyJob(null)}
        onApplied={(jobId) => setAppliedIds((prev) => new Set(prev).add(jobId))}
      />
    </div>
  );
}
