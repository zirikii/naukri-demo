import Link from "next/link";

import { CompanyLogo } from "@/components/common/CompanyLogo";
import { StarRating } from "@/components/common/StarRating";
import type { Company } from "@/lib/types";

export function CompanyLogoBar({ companies }: { companies: Company[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Top companies hiring now
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover opportunities at India&apos;s most sought-after employers
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {companies.slice(0, 8).map((company) => (
          <Link
            key={company.id}
            href={`/jobs?q=${encodeURIComponent(company.name)}`}
            className="surface-card flex items-center gap-3 p-4 transition-shadow hover:shadow-card-hover"
          >
            <CompanyLogo name={company.name} hue={company.logoHue} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{company.name}</p>
              <StarRating rating={company.rating} reviewsCount={company.reviewsCount} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
