import Link from "next/link";

import { cn } from "@/lib/utils/cn";

const QUICK_SEARCHES: { label: string; href: string }[] = [
  { label: "Remote", href: "/jobs?workMode=Remote" },
  { label: "MNC", href: "/jobs?companyType=MNC" },
  { label: "Engineering", href: "/jobs?department=Engineering+-+Software" },
  { label: "Fresher", href: "/jobs?experience=0" },
  { label: "Work from home", href: "/jobs?workMode=Remote" },
  { label: "Data Science", href: "/jobs?department=Data+Science+%26+Analytics" },
  { label: "Startup", href: "/jobs?companyType=Startup" },
];

export function QuickSearchChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">Trending:</span>
      {QUICK_SEARCHES.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
