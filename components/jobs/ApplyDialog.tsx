"use client";

import * as React from "react";
import { Building2, Briefcase, IndianRupee, MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { useToast } from "@/hooks/use-toast";
import type { JobWithCompany } from "@/lib/types";
import { formatExperience, formatSalary } from "@/lib/utils/format";

interface ApplyDialogProps {
  job: JobWithCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplied: (jobId: string) => void;
}

export function ApplyDialog({ job, open, onOpenChange, onApplied }: ApplyDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleApply() {
    if (!job) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Could not apply");
      }
      onApplied(job.id);
      toast({
        title: "Application submitted",
        description: `You applied to ${job.title} at ${job.company.name}.`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your application</DialogTitle>
          <DialogDescription>
            Review the role before applying. Your profile will be shared with the recruiter.
          </DialogDescription>
        </DialogHeader>

        {job ? (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <CompanyLogo name={job.company.name} hue={job.company.logoHue} size={44} />
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{job.title}</p>
              <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {job.company.name}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {formatExperience(job.experienceMin, job.experienceMax)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.locations.join(", ")}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={submitting}>
            {submitting ? "Applying…" : "Apply now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
