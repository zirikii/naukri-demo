import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Search, Target, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "For Employers" };

const FEATURES = [
  {
    icon: Search,
    title: "Search 10 Cr+ resumes",
    body: "Find the right candidates with powerful filters across India's largest talent pool.",
  },
  {
    icon: Target,
    title: "Post jobs that reach millions",
    body: "Get your openings in front of active and passive job seekers instantly.",
  },
  {
    icon: Users,
    title: "Branded company page",
    body: "Showcase your culture and attract candidates who fit your team.",
  },
  {
    icon: Building2,
    title: "Hiring analytics",
    body: "Track applies, views, and funnel performance in real time.",
  },
];

export default function EmployersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Hire the right talent, faster
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          India&apos;s recruiters trust Naukri to find, engage, and hire the best candidates. (This
          employer experience is a teaser in the demo.)
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/register">Post a job</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/jobs">Browse talent</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="surface-card flex gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
