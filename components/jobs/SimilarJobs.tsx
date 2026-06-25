import Link from "next/link";

import { CompanyLogo } from "@/components/common/CompanyLogo";
import { StarRating } from "@/components/common/StarRating";
import { formatExperience, formatSalary, postedAgo } from "@/lib/utils/format";
import type { JobWithCompany } from "@/lib/types";

export function SimilarJobs({ jobs }: { jobs: JobWithCompany[] }) {
  if (jobs.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Similar jobs</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="surface-card flex gap-3 p-4 transition-shadow hover:shadow-card-hover"
          >
            <CompanyLogo name={job.company.name} hue={job.company.logoHue} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{job.title}</p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                {job.company.name}
                <StarRating rating={job.company.rating} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatExperience(job.experienceMin, job.experienceMax)} ·{" "}
                {formatSalary(job.salaryMin, job.salaryMax)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{postedAgo(job.postedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
