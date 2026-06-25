import type { Job } from "@/lib/types";

/** Format a ₹ LPA salary range, e.g. "₹ 12-18 LPA" or "Not disclosed". */
export function formatSalary(min: number | null, max: number | null): string {
  if (min === null || max === null) {
    return "Not disclosed";
  }
  if (min === max) {
    return `₹ ${min} LPA`;
  }
  return `₹ ${min}-${max} LPA`;
}

/** Format an experience range in years, e.g. "2-5 Yrs" or "Fresher". */
export function formatExperience(min: number, max: number): string {
  if (min === 0 && max === 0) {
    return "Fresher";
  }
  if (min === max) {
    return `${min} Yrs`;
  }
  return `${min}-${max} Yrs`;
}

/** Human friendly "posted N days ago" relative to now (or a provided reference date). */
export function postedAgo(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 0) return "Today";
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
}

/** Compact applicant count, e.g. 1200 -> "1.2K". */
export function formatCount(count: number): string {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`;
}

/** Convert a string into uppercase initials (max 2 chars). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Short salary used in compact contexts, e.g. "12-18 LPA". */
export function shortSalary(job: Pick<Job, "salaryMin" | "salaryMax">): string {
  return formatSalary(job.salaryMin, job.salaryMax);
}

/** Format an integer with Indian thousands separators (₹). */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
