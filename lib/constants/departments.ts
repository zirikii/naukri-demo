import type { Department } from "@/lib/types";

export const DEPARTMENTS: Department[] = [
  "Engineering - Software",
  "Sales & BD",
  "Finance",
  "Human Resources",
  "Marketing",
  "Data Science & Analytics",
  "Customer Success",
  "Design",
];

export const INDUSTRIES = [
  "IT Services & Consulting",
  "Software Product",
  "Internet",
  "Banking & Financial Services",
  "E-commerce",
  "FinTech",
  "FMCG",
  "Telecom",
] as const;

export const COMPANY_TYPES = [
  "MNC",
  "Indian MNC",
  "Startup",
  "Unicorn",
  "Product",
  "Government",
] as const;

export const EDUCATION_LEVELS = [
  "B.Tech/B.E.",
  "MCA",
  "B.Sc",
  "MBA/PGDM",
  "B.Com",
  "Any Graduate",
] as const;

export const WORK_MODES = ["Remote", "Hybrid", "Office"] as const;
