"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import * as React from "react";

import { JobCard } from "./JobCard";
import { ApplyDialog } from "./ApplyDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { JobWithCompany } from "@/lib/types";

interface SavedListProps {
  jobs: JobWithCompany[];
  appliedIds: string[];
}

export function SavedList({ jobs, appliedIds }: SavedListProps) {
  const { toast } = useToast();
  const [items, setItems] = React.useState(jobs);
  const [applied, setApplied] = React.useState<Set<string>>(new Set(appliedIds));
  const [applyJob, setApplyJob] = React.useState<JobWithCompany | null>(null);

  async function handleRemove(jobId: string) {
    setItems((prev) => prev.filter((j) => j.id !== jobId));
    await fetch(`/api/saved?jobId=${encodeURIComponent(jobId)}`, { method: "DELETE" });
    toast({ title: "Removed from saved", variant: "default" });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No saved jobs"
        description="Save jobs you're interested in to revisit them later."
        action={
          <Button asChild>
            <Link href="/jobs">Browse jobs</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSaved
          isApplied={applied.has(job.id)}
          onToggleSave={handleRemove}
          onApply={(j) => setApplyJob(j)}
        />
      ))}

      <ApplyDialog
        job={applyJob}
        open={applyJob !== null}
        onOpenChange={(open) => !open && setApplyJob(null)}
        onApplied={(jobId) => setApplied((prev) => new Set(prev).add(jobId))}
      />
    </div>
  );
}
