import Link from "next/link";

import { Logo } from "./Logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Job Seekers",
    links: [
      { label: "Search Jobs", href: "/jobs" },
      { label: "Recommendations", href: "/recommendations" },
      { label: "Saved Jobs", href: "/saved" },
      { label: "Naukri 360", href: "/naukri-360" },
    ],
  },
  {
    title: "Recruiters",
    links: [
      { label: "Post a Job", href: "/employers" },
      { label: "Search Resumes", href: "/employers" },
      { label: "Hiring Solutions", href: "/employers" },
      { label: "Talent Pulse", href: "/employers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Help & FAQ", href: "/about" },
      { label: "Terms of Use", href: "/about" },
      { label: "Privacy Policy", href: "/about" },
    ],
  },
  {
    title: "Top Locations",
    links: [
      { label: "Jobs in Bengaluru", href: "/jobs?location=Bengaluru" },
      { label: "Jobs in Mumbai", href: "/jobs?location=Mumbai" },
      { label: "Jobs in Hyderabad", href: "/jobs?location=Hyderabad" },
      { label: "Jobs in Pune", href: "/jobs?location=Pune" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              India&apos;s largest job portal — connecting job seekers with the right opportunities.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Naukri demo. Unofficial — not affiliated with Naukri.com /
            Info Edge.
          </p>
          <p>Built for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
