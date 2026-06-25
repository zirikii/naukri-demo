import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusPipeline } from "@/components/jobs/StatusPipeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getApplicationsWithJob } from "@/lib/data/queries";
import { formatExperience, formatSalary, postedAgo } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Applied Jobs" };

export default async function AppliedPage() {
  const applications = await getApplicationsWithJob();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader
        title="Applied jobs"
        description={`You have applied to ${applications.length} job${applications.length === 1 ? "" : "s"}`}
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Jobs you apply to will appear here with their latest status."
          action={
            <Button asChild>
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) =>
            app.job ? (
              <Card key={app.id} className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <CompanyLogo
                    name={app.job.company.name}
                    hue={app.job.company.logoHue}
                    size={48}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          <Link href={`/jobs/${app.job.slug}`} className="hover:text-primary">
                            {app.job.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{app.job.company.name}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatExperience(app.job.experienceMin, app.job.experienceMax)} ·{" "}
                      {formatSalary(app.job.salaryMin, app.job.salaryMax)} ·{" "}
                      {app.job.locations.join(", ")}
                    </p>
                    <div className="mt-3 border-t border-border pt-3">
                      <StatusPipeline status={app.status} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Applied {postedAgo(app.appliedAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
