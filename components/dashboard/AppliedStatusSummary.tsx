import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Application, ApplicationStatus } from "@/lib/types";

const STATUS_ORDER: ApplicationStatus[] = [
  "Applied",
  "Application viewed",
  "Shortlisted",
  "Not selected",
];

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  Applied: "bg-primary",
  "Application viewed": "bg-sky",
  Shortlisted: "bg-success",
  "Not selected": "bg-destructive",
};

export function AppliedStatusSummary({ applications }: { applications: Application[] }) {
  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));
  const total = applications.length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Application status</CardTitle>
        <Link
          href="/applied"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{total}</p>
        <p className="text-sm text-muted-foreground">Total applications</p>

        <div className="mt-4 space-y-2.5">
          {counts.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLOR[status]}`} />
              <span className="flex-1 text-sm text-foreground/90">{status}</span>
              <span className="text-sm font-semibold text-foreground">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
