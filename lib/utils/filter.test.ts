import { describe, expect, it } from "vitest";

import { activeFilterCount, filterJobs, filterReducer, paginate, sortJobs } from "./filter";
import { DEFAULT_FILTERS, type Company, type JobWithCompany } from "@/lib/types";

const company = (id: string, overrides: Partial<Company> = {}): Company => ({
  id,
  name: id,
  slug: id,
  rating: 4,
  reviewsCount: 100,
  industry: "Software Product",
  type: "Product",
  logoHue: 210,
  tagline: "",
  about: "",
  ...overrides,
});

const job = (overrides: Partial<JobWithCompany>): JobWithCompany => ({
  id: "job-x",
  slug: "job-x",
  title: "Software Engineer",
  companyId: "c1",
  department: "Engineering - Software",
  role: "Backend Developer",
  experienceMin: 2,
  experienceMax: 5,
  salaryMin: 10,
  salaryMax: 20,
  locations: ["Bengaluru"],
  workMode: "Hybrid",
  skills: ["React", "Node.js"],
  education: "B.Tech/B.E.",
  employmentType: "Full Time",
  industry: "Software Product",
  companyType: "Product",
  openings: 2,
  applicants: 100,
  postedAt: new Date().toISOString(),
  summary: "",
  descriptionMd: "",
  responsibilities: [],
  company: company("c1"),
  ...overrides,
});

const jobs: JobWithCompany[] = [
  job({
    id: "a",
    title: "React Developer",
    skills: ["React"],
    department: "Engineering - Software",
    workMode: "Remote",
    locations: ["Bengaluru"],
    salaryMin: 10,
    salaryMax: 20,
    experienceMin: 2,
    experienceMax: 5,
  }),
  job({
    id: "b",
    title: "Data Analyst",
    skills: ["SQL"],
    department: "Data Science & Analytics",
    workMode: "Office",
    locations: ["Mumbai"],
    salaryMin: 5,
    salaryMax: 9,
    experienceMin: 1,
    experienceMax: 3,
  }),
  job({
    id: "c",
    title: "Java Engineer",
    skills: ["Java"],
    department: "Engineering - Software",
    workMode: "Hybrid",
    locations: ["Hyderabad"],
    salaryMin: 18,
    salaryMax: 30,
    experienceMin: 4,
    experienceMax: 8,
  }),
];

describe("filterReducer", () => {
  it("toggles an array facet on and off", () => {
    const added = filterReducer(DEFAULT_FILTERS, {
      type: "TOGGLE_FACET",
      facet: "department",
      value: "Engineering - Software",
    });
    expect(added.department).toContain("Engineering - Software");

    const removed = filterReducer(added, {
      type: "TOGGLE_FACET",
      facet: "department",
      value: "Engineering - Software",
    });
    expect(removed.department).toHaveLength(0);
  });

  it("resets to page 1 when a facet changes", () => {
    const onPage3 = { ...DEFAULT_FILTERS, page: 3 };
    const next = filterReducer(onPage3, { type: "SET_KEYWORD", value: "react" });
    expect(next.page).toBe(1);
  });

  it("clears all filters", () => {
    const dirty = filterReducer(DEFAULT_FILTERS, { type: "SET_KEYWORD", value: "react" });
    const cleared = filterReducer(dirty, { type: "CLEAR_ALL" });
    expect(cleared).toEqual(DEFAULT_FILTERS);
  });
});

describe("filterJobs", () => {
  it("narrows results by department facet", () => {
    const filtered = filterJobs(jobs, {
      ...DEFAULT_FILTERS,
      department: ["Engineering - Software"],
    });
    expect(filtered.map((j) => j.id).sort()).toEqual(["a", "c"]);
  });

  it("narrows by keyword across title and skills", () => {
    expect(filterJobs(jobs, { ...DEFAULT_FILTERS, keyword: "react" }).map((j) => j.id)).toEqual([
      "a",
    ]);
  });

  it("filters by minimum salary (job's max salary must reach the floor)", () => {
    // a (max 20) and c (max 30) clear a 15 LPA floor; b (max 9) does not.
    expect(
      filterJobs(jobs, { ...DEFAULT_FILTERS, salaryMin: 15 })
        .map((j) => j.id)
        .sort(),
    ).toEqual(["a", "c"]);
  });

  it("filters by experience within range", () => {
    expect(filterJobs(jobs, { ...DEFAULT_FILTERS, experience: 7 }).map((j) => j.id)).toEqual(["c"]);
  });

  it("filters by work mode and location", () => {
    expect(filterJobs(jobs, { ...DEFAULT_FILTERS, workMode: ["Remote"] }).map((j) => j.id)).toEqual(
      ["a"],
    );
    expect(filterJobs(jobs, { ...DEFAULT_FILTERS, location: "mumbai" }).map((j) => j.id)).toEqual([
      "b",
    ]);
  });

  it("returns all jobs with default filters", () => {
    expect(filterJobs(jobs, DEFAULT_FILTERS)).toHaveLength(3);
  });
});

describe("sortJobs & paginate", () => {
  it("sorts by date descending", () => {
    const older = job({ id: "old", postedAt: "2020-01-01T00:00:00Z" });
    const newer = job({ id: "new", postedAt: "2026-01-01T00:00:00Z" });
    expect(sortJobs([older, newer], "date").map((j) => j.id)).toEqual(["new", "old"]);
  });

  it("paginates a list", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, 1, 2)).toEqual([1, 2]);
    expect(paginate(items, 2, 2)).toEqual([3, 4]);
    expect(paginate(items, 3, 2)).toEqual([5]);
  });
});

describe("activeFilterCount", () => {
  it("counts active facets", () => {
    expect(activeFilterCount(DEFAULT_FILTERS)).toBe(0);
    expect(
      activeFilterCount({
        ...DEFAULT_FILTERS,
        keyword: "react",
        department: ["Engineering - Software", "Design"],
        salaryMin: 10,
      }),
    ).toBe(4);
  });
});
