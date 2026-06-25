import { join } from "node:path";

export const DATA_DIR = join(process.cwd(), "data");

export const DATA_FILES = {
  companies: "companies.json",
  jobs: "jobs.json",
  profile: "profile.json",
  applications: "applications.json",
  saved: "saved.json",
  messages: "messages.json",
  settings: "settings.json",
  users: "users.json",
} as const;

export type DataFileKey = keyof typeof DATA_FILES;
