"use client";

import Link from "next/link";
import { Bookmark, Briefcase, Building2, IndianRupee, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { StarRating } from "@/components/common/StarRating";
import { SkillChips } from "./SkillChips";
import type { JobWithCompany } from "@/lib/types";
import { formatExperience, formatSalary, postedAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export interface JobCardProps {
  job: JobWithCompany;
  isSaved?: boolean;
  isApplied?: boolean;
  onToggleSave?: (jobId: string) => void;
  onApply?: (job: JobWithCompany) => void;
  className?: string;
}

export function JobCard({
  job,
  isSaved = false,
  isApplied = false,
  onToggleSave,
  onApply,
  className,
}: JobCardProps) {
  return (
    <article
      className={cn(
        "surface-card group p-4 transition-shadow hover:shadow-card-hover sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <CompanyLogo name={job.company.name} hue={job.company.logoHue} size={48} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                <Link href={`/jobs/${job.slug}`} className="hover:text-primary">
                  {job.title}
                </Link>
              </h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {job.company.name}
                </span>
                <StarRating rating={job.company.rating} />
              </div>
            </div>

            {onToggleSave ? (
              <button
                type="button"
                onClick={() => onToggleSave(job.id)}
                aria-label={isSaved ? "Remove from saved" : "Save job"}
                aria-pressed={isSaved}
                className={cn(
                  "rounded-full p-2 transition-colors hover:bg-secondary",
                  isSaved ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Bookmark className={cn("h-5 w-5", isSaved && "fill-primary")} />
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {formatExperience(job.experienceMin, job.experienceMax)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.locations.join(", ")}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{job.summary}</p>

          <SkillChips skills={job.skills} className="mt-3" />

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{postedAgo(job.postedAt)}</span>
            <div className="flex items-center gap-2">
              {isApplied ? (
                <Button variant="success" size="sm" disabled>
                  Applied
                </Button>
              ) : (
                <Button size="sm" onClick={() => onApply?.(job)} asChild={!onApply}>
                  {onApply ? <span>Apply</span> : <Link href={`/jobs/${job.slug}`}>Apply</Link>}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
