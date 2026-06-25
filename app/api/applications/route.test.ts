import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Application } from "@/lib/types";

const getSession = vi.fn();
const getApplications = vi.fn();
const getJobById = vi.fn();
const writeData = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getApplications: () => getApplications(),
  getJobById: (id: string) => getJobById(id),
}));
vi.mock("@/lib/data/store", () => ({ writeData: (k: string, d: unknown) => writeData(k, d) }));

import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await post({ jobId: "job-001" });
    expect(res.status).toBe(401);
  });

  it("writes a new application for an authenticated user", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getApplications.mockResolvedValue([]);
    getJobById.mockResolvedValue({ id: "job-001", title: "Engineer", company: { name: "TCS" } });

    const res = await post({ jobId: "job-001" });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.application.jobId).toBe("job-001");
    expect(data.application.status).toBe("Applied");

    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, Application[]];
    expect(key).toBe("applications");
    expect(written[0]?.jobId).toBe("job-001");
  });

  it("prevents duplicate applications", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getApplications.mockResolvedValue([
      { id: "app-1", jobId: "job-001", appliedAt: "", status: "Applied" },
    ]);
    getJobById.mockResolvedValue({ id: "job-001", title: "Engineer", company: { name: "TCS" } });

    const res = await post({ jobId: "job-001" });
    expect(res.status).toBe(409);
    expect(writeData).not.toHaveBeenCalled();
  });

  it("returns 400 when jobId is missing", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await post({});
    expect(res.status).toBe(400);
  });
});
