export type ApplicationStatus = "Applied" | "Application viewed" | "Shortlisted" | "Not selected";

export interface Application {
  id: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface SavedJob {
  jobId: string;
  savedAt: string;
}
