import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  Code2,
  HeartHandshake,
  LineChart,
  Megaphone,
  PenTool,
  Wallet,
} from "lucide-react";

const CATEGORIES: { label: string; href: string; icon: typeof Code2; count: string }[] = [
  {
    label: "Engineering - Software",
    href: "/jobs?department=Engineering+-+Software",
    icon: Code2,
    count: "12.4K+ jobs",
  },
  {
    label: "Data Science & Analytics",
    href: "/jobs?department=Data+Science+%26+Analytics",
    icon: BarChart3,
    count: "3.1K+ jobs",
  },
  {
    label: "Sales & BD",
    href: "/jobs?department=Sales+%26+BD",
    icon: LineChart,
    count: "8.7K+ jobs",
  },
  { label: "Marketing", href: "/jobs?department=Marketing", icon: Megaphone, count: "4.2K+ jobs" },
  { label: "Finance", href: "/jobs?department=Finance", icon: Wallet, count: "5.6K+ jobs" },
  {
    label: "Human Resources",
    href: "/jobs?department=Human+Resources",
    icon: HeartHandshake,
    count: "2.3K+ jobs",
  },
  { label: "Design", href: "/jobs?department=Design", icon: PenTool, count: "1.8K+ jobs" },
  {
    label: "Customer Success",
    href: "/jobs?department=Customer+Success",
    icon: Briefcase,
    count: "2.9K+ jobs",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-card py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Browse jobs by category
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore roles across departments and find your fit
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
