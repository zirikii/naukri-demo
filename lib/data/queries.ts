import "server-only";

import type {
  Application,
  Company,
  Job,
  JobWithCompany,
  Message,
  Profile,
  SavedJob,
  Settings,
  UserAccount,
} from "@/lib/types";

import { readData } from "./store";

export async function getCompanies(): Promise<Company[]> {
  return readData<Company[]>("companies");
}

export async function getCompanyMap(): Promise<Map<string, Company>> {
  const companies = await getCompanies();
  return new Map(companies.map((c) => [c.id, c]));
}

/** All jobs joined with their company record. */
export async function getJobsWithCompany(): Promise<JobWithCompany[]> {
  const [jobs, companyMap] = await Promise.all([readData<Job[]>("jobs"), getCompanyMap()]);
  return jobs
    .map((job) => {
      const company = companyMap.get(job.companyId);
      return company ? { ...job, company } : null;
    })
    .filter((j): j is JobWithCompany => j !== null);
}

export async function getJobBySlug(slug: string): Promise<JobWithCompany | null> {
  const jobs = await getJobsWithCompany();
  return jobs.find((j) => j.slug === slug) ?? null;
}

export async function getJobById(id: string): Promise<JobWithCompany | null> {
  const jobs = await getJobsWithCompany();
  return jobs.find((j) => j.id === id) ?? null;
}

export async function getProfile(): Promise<Profile> {
  return readData<Profile>("profile");
}

export async function getApplications(): Promise<Application[]> {
  return readData<Application[]>("applications");
}

export async function getSavedJobs(): Promise<SavedJob[]> {
  return readData<SavedJob[]>("saved");
}

export async function getMessages(): Promise<Message[]> {
  return readData<Message[]>("messages");
}

export async function getSettings(): Promise<Settings> {
  return readData<Settings>("settings");
}

export async function getUsers(): Promise<UserAccount[]> {
  return readData<UserAccount[]>("users");
}

/** Applications enriched with their job + company for list rendering. */
export async function getApplicationsWithJob(): Promise<
  Array<Application & { job: JobWithCompany | undefined }>
> {
  const [applications, jobs] = await Promise.all([getApplications(), getJobsWithCompany()]);
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  return applications.map((app) => ({ ...app, job: jobMap.get(app.jobId) }));
}

export async function getSavedWithJob(): Promise<
  Array<SavedJob & { job: JobWithCompany | undefined }>
> {
  const [saved, jobs] = await Promise.all([getSavedJobs(), getJobsWithCompany()]);
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  return saved.map((s) => ({ ...s, job: jobMap.get(s.jobId) }));
}
