import { beforeEach, describe, expect, it, vi } from "vitest";

import type { JobAlert, Settings } from "@/lib/types";

const getSession = vi.fn();
const getSettings = vi.fn();
const writeData = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getSettings: () => getSettings(),
}));
vi.mock("@/lib/data/store", () => ({ writeData: (k: string, d: unknown) => writeData(k, d) }));

import { DELETE, GET, POST } from "./route";

const baseSettings: Settings = {
  jobPreferences: {
    desiredRoles: [],
    preferredLocations: [],
    industries: [],
    expectedSalary: 20,
    workMode: "Remote",
    availabilityToJoin: "Immediate",
  },
  account: { email: "aarav.sharma@example.com" },
  alerts: [
    {
      id: "alert-1",
      keyword: "React Developer",
      location: "Bengaluru",
      experience: "4 years",
      frequency: "Daily",
      createdAt: "2026-06-19T12:40:19.674Z",
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

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

function del(query: string) {
  return DELETE(new Request(`http://localhost/api/alerts?${query}`));
}

describe("GET /api/alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns alerts from settings", async () => {
    getSettings.mockResolvedValue(baseSettings);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.alerts).toHaveLength(1);
    expect(data.alerts[0]?.keyword).toBe("React Developer");
  });
});

describe("POST /api/alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSettings.mockResolvedValue(baseSettings);
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await post({ keyword: "Node.js" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when keyword is missing", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await post({ keyword: "" });
    expect(res.status).toBe(400);
  });

  it("creates a new alert", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });

    const res = await post({ keyword: "TypeScript", location: "Remote", frequency: "Weekly" });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.alert.keyword).toBe("TypeScript");
    expect(data.alert.location).toBe("Remote");
    expect(data.alert.frequency).toBe("Weekly");
    expect(data.alert.id).toMatch(/^alert-/);

    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, Settings];
    expect(key).toBe("settings");
    expect(written.alerts).toHaveLength(2);
    expect(written.alerts[0]?.keyword).toBe("TypeScript");
  });
});

describe("DELETE /api/alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSettings.mockResolvedValue(baseSettings);
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await del("id=alert-1");
    expect(res.status).toBe(401);
  });

  it("returns 400 when id is missing", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await del("");
    expect(res.status).toBe(400);
  });

  it("deletes an alert by id", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });

    const res = await del("id=alert-1");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ ok: true });

    const [, written] = writeData.mock.calls[0] as [string, Settings];
    expect(written.alerts).toHaveLength(0);
  });
});
