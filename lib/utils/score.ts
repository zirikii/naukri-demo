import type { CareerProfile, JobWithCompany, Profile } from "@/lib/types";

export interface ScoredJob {
  job: JobWithCompany;
  score: number;
  reasons: string[];
}

/**
 * Score a job against the candidate profile preferences. Heuristic, deterministic, and
 * explainable — each matching dimension contributes points and a human-readable reason.
 */
export function scoreJob(job: JobWithCompany, profile: Profile): ScoredJob {
  const career: CareerProfile = profile.career;
  let score = 0;
  const reasons: string[] = [];

  const profileSkills = new Set(profile.keySkills.map((s) => s.toLowerCase()));
  const matchedSkills = job.skills.filter((s) => profileSkills.has(s.toLowerCase()));
  if (matchedSkills.length > 0) {
    score += matchedSkills.length * 20;
    reasons.push(`Matches your skills: ${matchedSkills.slice(0, 3).join(", ")}`);
  }

  if (
    career.preferredLocations.some((loc) =>
      job.locations.some((jl) => jl.toLowerCase() === loc.toLowerCase()),
    )
  ) {
    score += 25;
    reasons.push("In your preferred location");
  }

  if (career.roles.some((r) => job.role.toLowerCase().includes(r.toLowerCase()))) {
    score += 25;
    reasons.push("Aligned with your preferred role");
  }

  if (career.industries.some((i) => i.toLowerCase() === job.industry.toLowerCase())) {
    score += 15;
    reasons.push("In your preferred industry");
  }

  if (
    profile.experienceYears >= job.experienceMin &&
    profile.experienceYears <= job.experienceMax
  ) {
    score += 20;
    reasons.push("Matches your experience level");
  }

  if (job.salaryMax !== null && job.salaryMax >= career.expectedSalary) {
    score += 15;
    reasons.push("Meets your expected salary");
  }

  if (job.company.rating >= 4) {
    score += 5;
    reasons.push(`Highly rated company (${job.company.rating}★)`);
  }

  if (reasons.length === 0) {
    reasons.push("Popular role among similar candidates");
  }

  return { job, score, reasons };
}

/** Return jobs sorted by descending match score. */
export function recommendJobs(
  jobs: JobWithCompany[],
  profile: Profile,
  limit?: number,
): ScoredJob[] {
  const scored = jobs.map((job) => scoreJob(job, profile)).sort((a, b) => b.score - a.score);
  return typeof limit === "number" ? scored.slice(0, limit) : scored;
}

/** Compute the profile completeness percentage (0-100). */
export function profileCompleteness(profile: Profile): number {
  const checks: boolean[] = [
    profile.headline.trim().length > 0,
    profile.keySkills.length >= 3,
    profile.employment.length > 0,
    profile.education.length > 0,
    profile.projects.length > 0,
    profile.certifications.length > 0,
    profile.itSkills.length > 0,
    profile.personal.phone.trim().length > 0,
    profile.personal.dateOfBirth.trim().length > 0,
    profile.career.preferredLocations.length > 0,
    profile.career.roles.length > 0,
    profile.career.expectedSalary > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

/** List of profile sections still missing content (for "add missing details" prompts). */
export function missingProfileSections(profile: Profile): string[] {
  const missing: string[] = [];
  if (profile.projects.length === 0) missing.push("Projects");
  if (profile.certifications.length === 0) missing.push("Certifications");
  if (profile.itSkills.length === 0) missing.push("IT Skills");
  if (profile.headline.trim().length === 0) missing.push("Resume headline");
  if (profile.personal.phone.trim().length === 0) missing.push("Personal details");
  return missing;
}
