import type { Metadata } from "next";

import { PageHeader } from "@/components/common/PageHeader";
import { RecommendationsList } from "@/components/jobs/RecommendationsList";
import { getApplications, getJobsWithCompany, getProfile, getSavedJobs } from "@/lib/data/queries";
import { recommendJobs } from "@/lib/utils/score";

export const metadata: Metadata = { title: "Recommended Jobs" };

export default async function RecommendationsPage() {
  const [jobs, profile, saved, applications] = await Promise.all([
    getJobsWithCompany(),
    getProfile(),
    getSavedJobs(),
    getApplications(),
  ]);

  const items = recommendJobs(jobs, profile, 12).map((r) => ({ job: r.job, reasons: r.reasons }));

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader
        title="Recommended for you"
        description="Jobs matched to your skills, experience, and career preferences"
      />
      <RecommendationsList
        items={items}
        initialSavedIds={saved.map((s) => s.jobId)}
        initialAppliedIds={applications.map((a) => a.jobId)}
      />
    </div>
  );
}
