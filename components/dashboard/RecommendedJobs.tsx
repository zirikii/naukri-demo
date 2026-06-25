"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";
import { ApplyDialog } from "@/components/jobs/ApplyDialog";
import { useToast } from "@/hooks/use-toast";
import type { JobWithCompany } from "@/lib/types";

interface RecommendedJobsProps {
  jobs: JobWithCompany[];
  initialSavedIds: string[];
  initialAppliedIds: string[];
}

export function RecommendedJobs({
  jobs,
  initialSavedIds,
  initialAppliedIds,
}: RecommendedJobsProps) {
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
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recommended jobs for you</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <Link href="/recommendations">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={savedIds.has(job.id)}
            isApplied={appliedIds.has(job.id)}
            onToggleSave={handleToggleSave}
            onApply={(j) => setApplyJob(j)}
            className="shadow-none"
          />
        ))}
      </CardContent>

      <ApplyDialog
        job={applyJob}
        open={applyJob !== null}
        onOpenChange={(open) => !open && setApplyJob(null)}
        onApplied={(jobId) => setAppliedIds((prev) => new Set(prev).add(jobId))}
      />
    </Card>
  );
}
