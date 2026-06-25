import type { Metadata } from "next";

import { PageHeader } from "@/components/common/PageHeader";
import { SavedList } from "@/components/jobs/SavedList";
import { getApplications, getSavedWithJob } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Saved Jobs" };

export default async function SavedPage() {
  const [saved, applications] = await Promise.all([getSavedWithJob(), getApplications()]);
  const jobs = saved.map((s) => s.job).filter((j): j is NonNullable<typeof j> => j !== undefined);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader
        title="Saved jobs"
        description={`${jobs.length} job${jobs.length === 1 ? "" : "s"} saved for later`}
      />
      <SavedList jobs={jobs} appliedIds={applications.map((a) => a.jobId)} />
    </div>
  );
}
