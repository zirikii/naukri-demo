import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Settings } from "@/lib/types";

const getSession = vi.fn();
const getSettings = vi.fn();
const writeData = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getSettings: () => getSettings(),
}));
vi.mock("@/lib/data/store", () => ({ writeData: (k: string, d: unknown) => writeData(k, d) }));

import { GET, PATCH } from "./route";

const baseSettings: Settings = {
  jobPreferences: {
    desiredRoles: ["Full Stack Developer"],
    preferredLocations: ["Bengaluru"],
    industries: ["Software Product"],
    expectedSalary: 22,
    workMode: "Hybrid",
    availabilityToJoin: "1 month",
  },
  account: { email: "aarav.sharma@example.com" },
  alerts: [],
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

function patch(body: unknown) {
  return PATCH(
    new Request("http://localhost/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("GET /api/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns settings", async () => {
    getSettings.mockResolvedValue(baseSettings);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.settings.account.email).toBe("aarav.sharma@example.com");
    expect(data.settings.jobPreferences.workMode).toBe("Hybrid");
  });
});

describe("PATCH /api/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSettings.mockResolvedValue(baseSettings);
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await patch({ notifications: { promotions: true } });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid payloads", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await patch("invalid");
    expect(res.status).toBe(400);
  });

  it("merges settings updates for authenticated users", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });

    const res = await patch({
      notifications: {
        recruiterMessages: false,
        jobRecommendations: true,
        applicationUpdates: true,
        promotions: true,
      },
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.settings.notifications.promotions).toBe(true);
    expect(data.settings.notifications.recruiterMessages).toBe(false);
    expect(data.settings.account.email).toBe("aarav.sharma@example.com");

    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, Settings];
    expect(key).toBe("settings");
    expect(written.notifications.promotions).toBe(true);
  });
});
