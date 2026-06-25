import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JobDetail } from "@/components/jobs/JobDetail";
import {
  getApplications,
  getJobBySlug,
  getJobsWithCompany,
  getSavedJobs,
} from "@/lib/data/queries";
import { getSession } from "@/lib/auth/getSession";
import { formatSalary } from "@/lib/utils/format";

interface JdPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: JdPageProps): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} - ${job.company.name}`,
    description: `${job.title} at ${job.company.name}. ${formatSalary(job.salaryMin, job.salaryMax)}. ${job.locations.join(", ")}.`,
  };
}

export default async function JobDetailPage({ params }: JdPageProps) {
  const job = await getJobBySlug(params.slug);
  if (!job) {
    notFound();
  }

  const [allJobs, session, saved, applications] = await Promise.all([
    getJobsWithCompany(),
    getSession(),
    getSavedJobs(),
    getApplications(),
  ]);

  const similar = allJobs
    .filter((j) => j.id !== job.id && j.department === job.department)
    .slice(0, 4);

  return (
    <JobDetail
      job={job}
      similar={similar}
      isAuthenticated={session !== null}
      initialSaved={saved.some((s) => s.jobId === job.id)}
      initialApplied={applications.some((a) => a.jobId === job.id)}
    />
  );
}
