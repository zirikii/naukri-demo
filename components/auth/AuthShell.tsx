import Link from "next/link";
import { BadgeCheck, Briefcase, Sparkles } from "lucide-react";

import { Logo } from "@/components/layout/Logo";

const HIGHLIGHTS = [
  { icon: Briefcase, text: "Access 50 lakh+ jobs from India's top companies" },
  { icon: BadgeCheck, text: "Get discovered by 5 lakh+ verified recruiters" },
  { icon: Sparkles, text: "Build your career with Naukri 360 AI tools" },
];

/** Two-column auth layout: form card on the left, branded value panel on the right. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Unofficial demo — not affiliated with Naukri.com / Info Edge.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-primary-dark lg:flex lg:flex-col lg:justify-center lg:px-12">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-10 right-24 h-40 w-40 rounded-full bg-sky/20"
          aria-hidden="true"
        />
        <div className="relative max-w-md text-primary-foreground">
          <h2 className="text-3xl font-bold leading-tight">Find a job made for you.</h2>
          <p className="mt-3 text-primary-foreground/90">
            Join millions of job seekers who found their next opportunity on India&apos;s largest
            job portal.
          </p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              return (
                <li key={h.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-primary-foreground/95">{h.text}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 rounded-lg bg-white/10 p-4 text-sm">
            <Link href="/jobs" className="font-semibold underline-offset-4 hover:underline">
              Or browse jobs without signing in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
