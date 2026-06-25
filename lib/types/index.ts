export * from "./company";
export * from "./job";
export * from "./user";
export * from "./profile";
export * from "./application";
export * from "./message";
export * from "./settings";
export * from "./filters";

/** A job joined with its company, used widely across the UI. */
import type { Company } from "./company";
import type { Job } from "./job";

export interface JobWithCompany extends Job {
  company: Company;
}
