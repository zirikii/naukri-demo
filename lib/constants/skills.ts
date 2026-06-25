export const POPULAR_SKILLS = [
  "React",
  "Java",
  "Python",
  "SQL",
  "Node.js",
  "AWS",
  "JavaScript",
  "TypeScript",
  "Spring Boot",
  "Kubernetes",
  "Docker",
  "Machine Learning",
  "Data Analysis",
  "Salesforce",
  "Digital Marketing",
  "Figma",
] as const;

export const SALARY_RANGES = [
  { label: "0-3 LPA", min: 0 },
  { label: "3-6 LPA", min: 3 },
  { label: "6-10 LPA", min: 6 },
  { label: "10-15 LPA", min: 10 },
  { label: "15-25 LPA", min: 15 },
  { label: "25+ LPA", min: 25 },
] as const;

export const POSTED_WINDOWS = [
  { label: "Last 1 day", value: 1 },
  { label: "Last 3 days", value: 3 },
  { label: "Last 7 days", value: 7 },
  { label: "Last 15 days", value: 15 },
  { label: "Last 30 days", value: 30 },
] as const;
