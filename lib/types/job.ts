export type WorkMode = "Remote" | "Hybrid" | "Office";

export type Department =
  | "Engineering - Software"
  | "Sales & BD"
  | "Finance"
  | "Human Resources"
  | "Marketing"
  | "Data Science & Analytics"
  | "Customer Success"
  | "Design";

export type EmploymentType = "Full Time" | "Part Time" | "Contract" | "Internship";

export interface Job {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  department: Department;
  role: string;
  experienceMin: number;
  experienceMax: number;
  /** Salary in ₹ LPA. null when "Not disclosed". */
  salaryMin: number | null;
  salaryMax: number | null;
  locations: string[];
  workMode: WorkMode;
  skills: string[];
  education: string;
  employmentType: EmploymentType;
  industry: string;
  companyType: string;
  openings: number;
  applicants: number;
  /** ISO date string. */
  postedAt: string;
  /** Short snippet shown on job cards. */
  summary: string;
  /** Full JD body as markdown. */
  descriptionMd: string;
  responsibilities: string[];
  /** Optional monthly stipend in ₹ for internships. */
  stipend?: number;
}
