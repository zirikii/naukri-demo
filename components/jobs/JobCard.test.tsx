import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { JobCard } from "./JobCard";
import type { Company, JobWithCompany } from "@/lib/types";

const company: Company = {
  id: "c1",
  name: "Flipkart",
  slug: "flipkart",
  rating: 4.1,
  reviewsCount: 21800,
  industry: "E-commerce",
  type: "Unicorn",
  logoHue: 215,
  tagline: "",
  about: "",
};

const job: JobWithCompany = {
  id: "job-1",
  slug: "react-developer-flipkart-001",
  title: "React Developer",
  companyId: "c1",
  department: "Engineering - Software",
  role: "Frontend Developer",
  experienceMin: 2,
  experienceMax: 5,
  salaryMin: 12,
  salaryMax: 24,
  locations: ["Bengaluru"],
  workMode: "Hybrid",
  skills: ["React", "TypeScript", "Node.js"],
  education: "B.Tech/B.E.",
  employmentType: "Full Time",
  industry: "E-commerce",
  companyType: "Unicorn",
  openings: 3,
  applicants: 240,
  postedAt: new Date().toISOString(),
  summary: "Build delightful UIs at scale.",
  descriptionMd: "",
  responsibilities: [],
  company,
};

describe("JobCard", () => {
  it("renders title, company, rating and skills", () => {
    render(<JobCard job={job} />);
    expect(screen.getByText("React Developer")).toBeInTheDocument();
    expect(screen.getByText("Flipkart")).toBeInTheDocument();
    expect(screen.getByText("4.1")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("calls onApply when Apply is clicked", async () => {
    const onApply = vi.fn();
    render(<JobCard job={job} onApply={onApply} />);
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApply).toHaveBeenCalledWith(job);
  });

  it("toggles save state via onToggleSave", async () => {
    const onToggleSave = vi.fn();
    render(<JobCard job={job} onToggleSave={onToggleSave} />);
    await userEvent.click(screen.getByRole("button", { name: /save job/i }));
    expect(onToggleSave).toHaveBeenCalledWith("job-1");
  });

  it("shows an disabled Applied state", () => {
    render(<JobCard job={job} isApplied onApply={vi.fn()} />);
    const applied = screen.getByRole("button", { name: "Applied" });
    expect(applied).toBeDisabled();
  });

  it("reflects saved state with aria-pressed", () => {
    render(<JobCard job={job} isSaved onToggleSave={vi.fn()} />);
    expect(screen.getByRole("button", { name: /remove from saved/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
