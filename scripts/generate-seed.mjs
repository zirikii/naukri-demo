// Deterministic seed-data generator for the Naukri demo.
// Produces realistic Indian-job-market JSON in /data. Re-run with `node scripts/generate-seed.mjs`.
// Hand-curated companies/profile/messages + template-generated jobs for breadth.
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// --- Companies -------------------------------------------------------------
const companies = [
  {
    name: "TCS",
    industry: "IT Services & Consulting",
    type: "Indian MNC",
    rating: 3.8,
    reviews: 89400,
    hue: 210,
    tagline: "Tata Consultancy Services",
  },
  {
    name: "Infosys",
    industry: "IT Services & Consulting",
    type: "Indian MNC",
    rating: 3.9,
    reviews: 78200,
    hue: 205,
    tagline: "Navigate your next",
  },
  {
    name: "Wipro",
    industry: "IT Services & Consulting",
    type: "Indian MNC",
    rating: 3.7,
    reviews: 61300,
    hue: 145,
    tagline: "Wipro Limited",
  },
  {
    name: "Flipkart",
    industry: "E-commerce",
    type: "Unicorn",
    rating: 4.1,
    reviews: 21800,
    hue: 215,
    tagline: "India ka apna e-commerce",
  },
  {
    name: "Zomato",
    industry: "Internet",
    type: "Unicorn",
    rating: 3.6,
    reviews: 9400,
    hue: 350,
    tagline: "Better food for more people",
  },
  {
    name: "Swiggy",
    industry: "Internet",
    type: "Unicorn",
    rating: 3.9,
    reviews: 8700,
    hue: 28,
    tagline: "Anything, delivered",
  },
  {
    name: "Paytm",
    industry: "FinTech",
    type: "Unicorn",
    rating: 3.4,
    reviews: 15200,
    hue: 200,
    tagline: "India's payments leader",
  },
  {
    name: "HDFC Bank",
    industry: "Banking & Financial Services",
    type: "Product",
    rating: 3.9,
    reviews: 33100,
    hue: 230,
    tagline: "We understand your world",
  },
  {
    name: "Reliance Jio",
    industry: "Telecom",
    type: "Indian MNC",
    rating: 3.9,
    reviews: 24500,
    hue: 260,
    tagline: "Digital life",
  },
  {
    name: "Tech Mahindra",
    industry: "IT Services & Consulting",
    type: "Indian MNC",
    rating: 3.6,
    reviews: 41200,
    hue: 0,
    tagline: "Connected world, connected experiences",
  },
  {
    name: "Razorpay",
    industry: "FinTech",
    type: "Unicorn",
    rating: 4.0,
    reviews: 3100,
    hue: 220,
    tagline: "Power your finance, grow your business",
  },
  {
    name: "Freshworks",
    industry: "Software Product",
    type: "Product",
    rating: 4.1,
    reviews: 2600,
    hue: 160,
    tagline: "Uncomplicate business software",
  },
  {
    name: "Accenture",
    industry: "IT Services & Consulting",
    type: "MNC",
    rating: 3.9,
    reviews: 56800,
    hue: 280,
    tagline: "Let there be change",
  },
  {
    name: "Cognizant",
    industry: "IT Services & Consulting",
    type: "MNC",
    rating: 3.7,
    reviews: 49200,
    hue: 195,
    tagline: "Intuition engineered",
  },
  {
    name: "PhonePe",
    industry: "FinTech",
    type: "Unicorn",
    rating: 4.0,
    reviews: 4200,
    hue: 270,
    tagline: "Karte ja, badhte ja",
  },
  {
    name: "Myntra",
    industry: "E-commerce",
    type: "Unicorn",
    rating: 4.0,
    reviews: 6100,
    hue: 330,
    tagline: "India's fashion expert",
  },
].map((c) => ({
  id: `cmp-${slugify(c.name)}`,
  name: c.name,
  slug: slugify(c.name),
  rating: c.rating,
  reviewsCount: c.reviews,
  industry: c.industry,
  type: c.type,
  logoHue: c.hue,
  tagline: c.tagline,
  about: `${c.name} is a leading ${c.industry.toLowerCase()} organisation. With a strong presence across India, ${c.name} is known for ${c.tagline.toLowerCase()} and a culture that values innovation, ownership, and continuous learning. The team works on products and services that impact millions of users every day.`,
}));

const byName = Object.fromEntries(companies.map((c) => [c.name, c]));

// --- Job templates ---------------------------------------------------------
const cities = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Gurugram",
  "Noida",
];
const workModes = ["Remote", "Hybrid", "Office"];

// [title, role, department, skills, expMin, expMax, salMin, salMax, education, employment]
const templates = [
  [
    "Senior Software Engineer - Backend",
    "Backend Developer",
    "Engineering - Software",
    ["Java", "Spring Boot", "Microservices", "SQL", "AWS"],
    4,
    8,
    18,
    32,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Frontend Engineer (React)",
    "Frontend Developer",
    "Engineering - Software",
    ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    2,
    5,
    12,
    24,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Full Stack Developer",
    "Full Stack Developer",
    "Engineering - Software",
    ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
    3,
    6,
    14,
    28,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "DevOps Engineer",
    "DevOps Engineer",
    "Engineering - Software",
    ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
    3,
    7,
    16,
    30,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Software Engineer - Fresher",
    "Software Engineer",
    "Engineering - Software",
    ["Java", "Python", "SQL", "Data Structures"],
    0,
    0,
    4,
    7,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Python Developer",
    "Python Developer",
    "Engineering - Software",
    ["Python", "Django", "SQL", "REST APIs"],
    2,
    5,
    10,
    20,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Engineering Manager",
    "Engineering Manager",
    "Engineering - Software",
    ["Java", "System Design", "Leadership", "AWS"],
    8,
    12,
    40,
    65,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Data Scientist",
    "Data Scientist",
    "Data Science & Analytics",
    ["Python", "Machine Learning", "SQL", "Data Analysis"],
    3,
    6,
    18,
    34,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Data Analyst",
    "Data Analyst",
    "Data Science & Analytics",
    ["SQL", "Python", "Data Analysis", "Excel", "Power BI"],
    1,
    4,
    7,
    15,
    "Any Graduate",
    "Full Time",
  ],
  [
    "Machine Learning Engineer",
    "ML Engineer",
    "Data Science & Analytics",
    ["Python", "Machine Learning", "TensorFlow", "AWS"],
    3,
    7,
    20,
    40,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Product Manager",
    "Product Manager",
    "Engineering - Software",
    ["Product Management", "Analytics", "Roadmapping", "SQL"],
    4,
    8,
    25,
    45,
    "MBA/PGDM",
    "Full Time",
  ],
  [
    "Business Development Manager",
    "BD Manager",
    "Sales & BD",
    ["Sales", "Negotiation", "B2B", "CRM"],
    3,
    7,
    9,
    18,
    "MBA/PGDM",
    "Full Time",
  ],
  [
    "Inside Sales Executive",
    "Sales Executive",
    "Sales & BD",
    ["Sales", "Communication", "Lead Generation"],
    1,
    3,
    4,
    8,
    "Any Graduate",
    "Full Time",
  ],
  [
    "Key Account Manager",
    "Account Manager",
    "Sales & BD",
    ["Account Management", "Sales", "Salesforce"],
    4,
    8,
    12,
    22,
    "MBA/PGDM",
    "Full Time",
  ],
  [
    "Financial Analyst",
    "Financial Analyst",
    "Finance",
    ["Financial Modelling", "Excel", "SQL", "Accounting"],
    2,
    5,
    8,
    16,
    "B.Com",
    "Full Time",
  ],
  [
    "Chartered Accountant",
    "Chartered Accountant",
    "Finance",
    ["Accounting", "Taxation", "Audit", "Compliance"],
    3,
    6,
    12,
    24,
    "Any Graduate",
    "Full Time",
  ],
  [
    "HR Business Partner",
    "HR Business Partner",
    "Human Resources",
    ["HR Operations", "Talent Management", "Employee Relations"],
    4,
    8,
    10,
    20,
    "MBA/PGDM",
    "Full Time",
  ],
  [
    "Talent Acquisition Specialist",
    "Recruiter",
    "Human Resources",
    ["Recruitment", "Sourcing", "Communication"],
    2,
    5,
    6,
    12,
    "Any Graduate",
    "Full Time",
  ],
  [
    "Digital Marketing Manager",
    "Marketing Manager",
    "Marketing",
    ["Digital Marketing", "SEO", "Google Ads", "Analytics"],
    3,
    7,
    10,
    20,
    "MBA/PGDM",
    "Full Time",
  ],
  [
    "Performance Marketing Lead",
    "Marketing Lead",
    "Marketing",
    ["Performance Marketing", "Google Ads", "Meta Ads", "Analytics"],
    5,
    9,
    18,
    32,
    "MBA/PGDM",
    "Full Time",
  ],
  [
    "Content Marketing Specialist",
    "Content Specialist",
    "Marketing",
    ["Content Writing", "SEO", "Social Media"],
    1,
    4,
    5,
    11,
    "Any Graduate",
    "Full Time",
  ],
  [
    "UX/UI Designer",
    "Product Designer",
    "Design",
    ["Figma", "UI Design", "UX Research", "Prototyping"],
    2,
    5,
    10,
    22,
    "Any Graduate",
    "Full Time",
  ],
  [
    "Customer Success Manager",
    "Customer Success Manager",
    "Customer Success",
    ["Customer Success", "SaaS", "Communication", "CRM"],
    3,
    6,
    9,
    18,
    "Any Graduate",
    "Full Time",
  ],
  [
    "QA Automation Engineer",
    "QA Engineer",
    "Engineering - Software",
    ["Selenium", "Java", "Automation Testing", "API Testing"],
    2,
    5,
    8,
    18,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Android Developer",
    "Android Developer",
    "Engineering - Software",
    ["Kotlin", "Android", "Java", "REST APIs"],
    2,
    6,
    12,
    26,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "iOS Developer",
    "iOS Developer",
    "Engineering - Software",
    ["Swift", "iOS", "Xcode", "REST APIs"],
    2,
    6,
    12,
    26,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Salesforce Developer",
    "Salesforce Developer",
    "Engineering - Software",
    ["Salesforce", "Apex", "Lightning", "SQL"],
    3,
    6,
    12,
    22,
    "B.Tech/B.E.",
    "Full Time",
  ],
  [
    "Cloud Architect",
    "Cloud Architect",
    "Engineering - Software",
    ["AWS", "Azure", "System Design", "Kubernetes"],
    8,
    12,
    35,
    60,
    "B.Tech/B.E.",
    "Full Time",
  ],
];

// Deterministic pseudo-random for stable output.
let seed = 42;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickSome = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++)
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};

const companyNames = companies.map((c) => c.name);
const now = Date.now();
const jobs = [];
let counter = 1;

// Generate ~45 jobs by combining templates with companies/cities.
for (let i = 0; i < 45; i++) {
  const t = templates[i % templates.length];
  const [title, role, department, skills, expMin, expMax, salMin, salMax, education, employment] =
    t;
  const company = byName[pick(companyNames)];
  const locCount = 1 + Math.floor(rand() * 2);
  const locations = pickSome(cities, locCount);
  const workMode = pick(workModes);
  const ageDays = Math.floor(rand() * 28);
  const postedAt = new Date(
    now - ageDays * 24 * 60 * 60 * 1000 - Math.floor(rand() * 12) * 3600 * 1000,
  ).toISOString();
  const variant =
    i >= templates.length ? ` - ${pick(["Growth", "Platform", "Core", "Enterprise"])} Team` : "";
  const fullTitle = `${title}${variant}`;
  const idNum = String(counter++).padStart(3, "0");
  const slug = `${slugify(fullTitle)}-${company.slug}-${idNum}`;

  jobs.push({
    id: `job-${idNum}`,
    slug,
    title: fullTitle,
    companyId: company.id,
    department,
    role,
    experienceMin: expMin,
    experienceMax: expMax,
    salaryMin: rand() > 0.12 ? salMin : null,
    salaryMax: rand() > 0.12 ? salMax : null,
    locations,
    workMode,
    skills,
    education,
    employmentType: employment,
    industry: company.industry,
    companyType: company.type,
    openings: 1 + Math.floor(rand() * 20),
    applicants: 20 + Math.floor(rand() * 1200),
    postedAt,
    summary: `${company.name} is hiring a ${role} to work on high-impact ${department.toLowerCase()} initiatives. Work with a talented team using ${skills.slice(0, 3).join(", ")} in a ${workMode.toLowerCase()} setup.`,
    descriptionMd: `## About the role\n\nWe are looking for a **${fullTitle}** to join ${company.name} in ${locations.join(", ")}. You will collaborate with cross-functional teams to build and scale products used by millions across India.\n\nThis is a ${workMode.toLowerCase()} role suited for someone with ${expMin === 0 ? "a strong foundation" : `${expMin}-${expMax} years of experience`} and hands-on expertise in ${skills.join(", ")}.\n\n### What you'll do\n\n- Design, build, and maintain reliable, scalable solutions.\n- Partner with product and design to ship customer-focused features.\n- Write clean, well-tested, maintainable code and review peers' work.\n- Continuously improve performance, quality, and developer experience.\n\n### What we're looking for\n\n- ${education} or equivalent practical experience.\n- Strong fundamentals and proven experience with ${skills.slice(0, 3).join(", ")}.\n- Excellent communication and a collaborative, ownership-driven mindset.`,
    responsibilities: [
      `Own end-to-end delivery of ${department.toLowerCase()} features.`,
      `Apply ${skills[0]} and ${skills[1]} to solve real customer problems.`,
      "Collaborate across product, design, and engineering teams.",
      "Mentor peers and uphold a high bar for quality.",
    ],
  });
}

// --- Profile (seeded candidate ~60% complete) ------------------------------
const profile = {
  fullName: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98xxxxxx10",
  location: "Bengaluru",
  experienceYears: 4,
  currentRole: "Software Engineer",
  currentCompany: "Infosys",
  avatarHue: 213,
  headline:
    "Software Engineer with 4 years of experience building scalable web applications using React, Node.js, and AWS.",
  keySkills: ["React", "Node.js", "TypeScript", "JavaScript", "AWS", "SQL"],
  employment: [
    {
      id: "emp-1",
      title: "Software Engineer",
      company: "Infosys",
      startDate: "2022-06",
      endDate: null,
      current: true,
      description:
        "Building microservices and React dashboards for a banking client. Improved API latency by 35% and led migration to TypeScript.",
    },
    {
      id: "emp-2",
      title: "Associate Software Engineer",
      company: "Tech Mahindra",
      startDate: "2020-07",
      endDate: "2022-05",
      current: false,
      description:
        "Developed REST APIs and internal tooling. Worked across the SDLC in an Agile team.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Tech, Computer Science",
      institution: "VIT Vellore",
      startYear: "2016",
      endYear: "2020",
      grade: "8.4 CGPA",
    },
  ],
  projects: [],
  certifications: [],
  itSkills: [
    { id: "it-1", name: "React", version: "18", lastUsedYear: "2024", experienceMonths: 42 },
    { id: "it-2", name: "Node.js", version: "20", lastUsedYear: "2024", experienceMonths: 40 },
    { id: "it-3", name: "AWS", version: "-", lastUsedYear: "2024", experienceMonths: 30 },
  ],
  personal: {
    gender: "Male",
    dateOfBirth: "1998-04-12",
    maritalStatus: "Single",
    phone: "+91 98xxxxxx10",
    address: "Koramangala, Bengaluru, Karnataka",
    languages: ["English", "Hindi", "Kannada"],
  },
  career: {
    preferredLocations: ["Bengaluru", "Hyderabad", "Remote"],
    industries: ["Software Product", "Internet"],
    roles: ["Full Stack Developer", "Frontend Developer", "Backend Developer"],
    expectedSalary: 22,
    noticePeriod: "30 days",
    workMode: "Hybrid",
    employmentType: "Full Time",
  },
};

// --- Applications (mixed statuses, referencing first jobs) ------------------
const statuses = ["Applied", "Application viewed", "Shortlisted", "Not selected"];
const applications = jobs.slice(0, 6).map((job, i) => ({
  id: `app-${String(i + 1).padStart(3, "0")}`,
  jobId: job.id,
  appliedAt: new Date(now - (i + 1) * 3 * 24 * 60 * 60 * 1000).toISOString(),
  status: statuses[i % statuses.length],
}));

// --- Saved jobs ------------------------------------------------------------
const saved = jobs.slice(10, 15).map((job, i) => ({
  jobId: job.id,
  savedAt: new Date(now - (i + 1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
}));

// --- Recruiter messages ----------------------------------------------------
const recruiters = [
  ["Priya Nair", "Senior Talent Partner", "Flipkart"],
  ["Rohan Mehta", "Tech Recruiter", "Razorpay"],
  ["Sneha Reddy", "Talent Acquisition Lead", "Swiggy"],
  ["Vikram Singh", "HR Manager", "Freshworks"],
  ["Ananya Iyer", "Recruitment Specialist", "PhonePe"],
  ["Karthik Rao", "Lead Recruiter", "Zomato"],
  ["Meera Joshi", "Talent Partner", "Myntra"],
  ["Arjun Verma", "Senior Recruiter", "Paytm"],
  ["Divya Menon", "HR Business Partner", "HDFC Bank"],
  ["Aditya Kumar", "Tech Talent Sourcer", "Accenture"],
  ["Nisha Gupta", "Talent Acquisition", "Cognizant"],
];

const messages = recruiters.map((r, i) => {
  const [name, title, companyName] = r;
  const company = byName[companyName];
  const job = jobs.find((j) => j.companyId === company.id) ?? jobs[i];
  const sentAt = new Date(
    now - i * 18 * 60 * 60 * 1000 - Math.floor(rand() * 6) * 3600 * 1000,
  ).toISOString();
  return {
    id: `msg-${String(i + 1).padStart(3, "0")}`,
    recruiterName: name,
    recruiterTitle: title,
    companyId: company.id,
    subject: `Opportunity: ${job.title} at ${company.name}`,
    snippet: `Hi Aarav, I came across your profile and think you'd be a great fit for our ${job.role} role.`,
    bodyMd: `Hi Aarav,\n\nI'm ${name}, ${title} at **${company.name}**. I came across your profile on Naukri and was impressed by your experience with ${profile.keySkills.slice(0, 3).join(", ")}.\n\nWe're currently hiring for a **${job.title}** role based in ${job.locations.join(", ")} (${job.workMode}). Given your background, I believe this could be a strong match.\n\nWould you be open to a quick call this week to discuss further? Looking forward to hearing from you.\n\nBest regards,\n${name}\n${title}, ${company.name}`,
    unread: i < 4,
    sentAt,
    jobId: job.id,
    replies: [],
  };
});

// --- Settings --------------------------------------------------------------
const settings = {
  jobPreferences: {
    desiredRoles: ["Full Stack Developer", "Frontend Developer"],
    preferredLocations: ["Bengaluru", "Hyderabad", "Remote"],
    industries: ["Software Product", "Internet"],
    expectedSalary: 22,
    workMode: "Hybrid",
    availabilityToJoin: "1 month",
  },
  account: { email: "aarav.sharma@example.com" },
  alerts: [
    {
      id: "alert-1",
      keyword: "React Developer",
      location: "Bengaluru",
      experience: "4 years",
      frequency: "Daily",
      createdAt: new Date(now - 6 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "alert-2",
      keyword: "Full Stack",
      location: "Remote",
      experience: "3-6 years",
      frequency: "Weekly",
      createdAt: new Date(now - 12 * 24 * 3600 * 1000).toISOString(),
    },
  ],
  notifications: {
    recruiterMessages: true,
    jobRecommendations: true,
    applicationUpdates: true,
    promotions: false,
  },
  privacy: {
    profileVisibility: "Visible to all recruiters",
    showContactDetails: true,
    showSalaryDetails: false,
  },
};

// --- Users (registered accounts) ------------------------------------------
const users = [
  {
    id: "user-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    experienceYears: 4,
    currentLocation: "Bengaluru",
    keySkills: ["React", "Node.js", "TypeScript", "AWS"],
    createdAt: new Date(now - 200 * 24 * 3600 * 1000).toISOString(),
  },
];

async function main() {
  await mkdir(dataDir, { recursive: true });
  const write = (file, data) =>
    writeFile(join(dataDir, file), JSON.stringify(data, null, 2) + "\n");
  await Promise.all([
    write("companies.json", companies),
    write("jobs.json", jobs),
    write("profile.json", profile),
    write("applications.json", applications),
    write("saved.json", saved),
    write("messages.json", messages),
    write("settings.json", settings),
    write("users.json", users),
  ]);
  console.log(
    `Seed written: ${companies.length} companies, ${jobs.length} jobs, ${messages.length} messages.`,
  );
}

main();
