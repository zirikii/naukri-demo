import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Profile } from "@/lib/types";

const getSession = vi.fn();
const getProfile = vi.fn();
const writeData = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getProfile: () => getProfile(),
}));
vi.mock("@/lib/data/store", () => ({ writeData: (k: string, d: unknown) => writeData(k, d) }));

import { GET, PATCH } from "./route";

const baseProfile: Profile = {
  fullName: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98xxxxxx10",
  location: "Bengaluru",
  experienceYears: 4,
  currentRole: "Software Engineer",
  currentCompany: "Infosys",
  avatarHue: 213,
  headline: "Software Engineer with 4 years of experience",
  keySkills: ["React", "Node.js"],
  employment: [],
  education: [],
  projects: [],
  certifications: [],
  itSkills: [],
  personal: {
    gender: "Male",
    dateOfBirth: "1998-04-12",
    maritalStatus: "Single",
    phone: "+91 98xxxxxx10",
    address: "Bengaluru",
    languages: ["English"],
  },
  career: {
    preferredLocations: ["Bengaluru"],
    industries: ["Software Product"],
    roles: ["Full Stack Developer"],
    expectedSalary: 22,
    noticePeriod: "30 days",
    workMode: "Hybrid",
    employmentType: "Full Time",
  },
};

function patch(body: unknown) {
  return PATCH(
    new Request("http://localhost/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("GET /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the profile from seed data", async () => {
    getProfile.mockResolvedValue(baseProfile);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.profile.fullName).toBe("Aarav Sharma");
    expect(data.profile.email).toBe("aarav.sharma@example.com");
  });
});

describe("PATCH /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getProfile.mockResolvedValue(baseProfile);
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await patch({ headline: "Updated headline" });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid payloads", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await patch(null);
    expect(res.status).toBe(400);
  });

  it("merges profile updates for authenticated users", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });

    const res = await patch({ headline: "Full stack engineer", location: "Hyderabad" });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.profile.headline).toBe("Full stack engineer");
    expect(data.profile.location).toBe("Hyderabad");
    expect(data.profile.fullName).toBe("Aarav Sharma");

    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, Profile];
    expect(key).toBe("profile");
    expect(written.headline).toBe("Full stack engineer");
  });
});
