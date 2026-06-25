"use client";

import * as React from "react";
import {
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { StarRating } from "@/components/common/StarRating";
import { Markdown } from "@/components/common/Markdown";
import { JdSection } from "./JdSection";
import { SimilarJobs } from "./SimilarJobs";
import { ApplyDialog } from "./ApplyDialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { formatCount, formatExperience, formatSalary, postedAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { JobWithCompany } from "@/lib/types";

interface JobDetailProps {
  job: JobWithCompany;
  similar: JobWithCompany[];
  isAuthenticated: boolean;
  initialSaved: boolean;
  initialApplied: boolean;
}

export function JobDetail({
  job,
  similar,
  isAuthenticated,
  initialSaved,
  initialApplied,
}: JobDetailProps) {
  const { toast } = useToast();
  const { isAuthenticated: sessionAuth } = useSession();
  const router = useRouter();
  const authed = isAuthenticated || sessionAuth;

  const [saved, setSaved] = React.useState(initialSaved);
  const [applied, setApplied] = React.useState(initialApplied);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function requireAuth(action: string): boolean {
    if (authed) return true;
    toast({ title: "Please log in", description: `Log in to ${action}.`, variant: "info" });
    router.push(`/login?redirect=/jobs/${job.slug}`);
    return false;
  }

  async function toggleSave() {
    if (!requireAuth("save jobs")) return;
    const willSave = !saved;
    setSaved(willSave);
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id }),
    });
    toast({
      title: willSave ? "Job saved" : "Removed from saved",
      variant: willSave ? "success" : "default",
    });
  }

  function openApply() {
    if (!requireAuth("apply to jobs")) return;
    setDialogOpen(true);
  }

  const roleDetails: { label: string; value: string }[] = [
    { label: "Role", value: job.role },
    { label: "Industry Type", value: job.industry },
    { label: "Department", value: job.department },
    { label: "Employment Type", value: job.employmentType },
    { label: "Education", value: job.education },
    { label: "Work Mode", value: job.workMode },
  ];

  const ApplyActions = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center gap-3", className)}>
      {applied ? (
        <Button variant="success" disabled className="flex-1">
          Applied
        </Button>
      ) : (
        <Button onClick={openApply} className="flex-1">
          Apply
        </Button>
      )}
      <Button
        variant="outline"
        onClick={toggleSave}
        aria-pressed={saved}
        className={cn(saved && "border-primary text-primary")}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-primary")} />
        {saved ? "Saved" : "Save"}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {/* Header card */}
          <div className="surface-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <CompanyLogo name={job.company.name} hue={job.company.logoHue} size={56} />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{job.title}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {job.company.name}
                  </span>
                  <StarRating rating={job.company.rating} reviewsCount={job.company.reviewsCount} />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/90">
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {formatExperience(job.experienceMin, job.experienceMax)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {job.locations.join(", ")}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Posted {postedAgo(job.postedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {formatCount(job.applicants)} applicants
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                {job.openings} opening{job.openings === 1 ? "" : "s"}
              </span>
            </div>

            <ApplyActions className="mt-5 lg:hidden" />
          </div>

          {/* Body */}
          <div className="surface-card mt-4 p-5 sm:p-6">
            <JdSection title="Job description">
              <Markdown>{job.descriptionMd}</Markdown>
            </JdSection>

            <JdSection title="Key responsibilities">
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </JdSection>

            <JdSection title="Key skills">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground/90"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </JdSection>

            <JdSection title="Role details">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {roleDetails.map((d) => (
                  <div key={d.label} className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">{d.label}</dt>
                    <dd className="text-sm font-medium text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </JdSection>

            <JdSection title={`About ${job.company.name}`}>
              <div className="flex items-start gap-3">
                <CompanyLogo name={job.company.name} hue={job.company.logoHue} size={44} />
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {job.company.name}
                    <StarRating
                      rating={job.company.rating}
                      reviewsCount={job.company.reviewsCount}
                    />
                  </p>
                  <p className="mt-2 text-sm text-foreground/80">{job.company.about}</p>
                </div>
              </div>
            </JdSection>
          </div>

          <SimilarJobs jobs={similar} />
        </div>

        {/* Sticky apply rail (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="surface-card p-5">
              <p className="text-sm text-muted-foreground">Interested in this role?</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatExperience(job.experienceMin, job.experienceMax)} · {job.workMode}
              </p>
              <ApplyActions className="mt-4" />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {formatCount(job.applicants)} people have applied
              </p>
            </div>
          </div>
        </aside>
      </div>

      <ApplyDialog
        job={dialogOpen ? job : null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApplied={() => setApplied(true)}
      />
    </div>
  );
}
