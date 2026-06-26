import { beforeEach, describe, expect, it, vi } from "vitest";

import type { JobWithCompany, SavedJob } from "@/lib/types";

const getSession = vi.fn();
const getSavedJobs = vi.fn();
const getJobById = vi.fn();
const writeData = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getSavedJobs: () => getSavedJobs(),
  getJobById: (id: string) => getJobById(id),
}));
vi.mock("@/lib/data/store", () => ({ writeData: (k: string, d: unknown) => writeData(k, d) }));

import { DELETE, GET, POST } from "./route";

const session = { id: "u1", name: "Aarav", email: "aarav@example.com" };
const job = { id: "job-001", title: "Frontend Engineer", company: { name: "TCS" } } as JobWithCompany;

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

function del(query = "") {
  return DELETE(new Request(`http://localhost/api/saved${query}`));
}

describe("/api/saved", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("returns saved jobs from storage", async () => {
    const saved = [{ jobId: "job-001", savedAt: "2026-01-01T00:00:00.000Z" }];
    getSavedJobs.mockResolvedValue(saved);

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ saved });
  });

  it("rejects unauthenticated save requests", async () => {
    getSession.mockResolvedValue(null);

    const res = await post({ jobId: "job-001" });

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Please log in to save jobs" });
    expect(writeData).not.toHaveBeenCalled();
  });

  it("returns 400 when saving without a jobId", async () => {
    getSession.mockResolvedValue(session);

    const res = await post({});

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "A jobId is required" });
    expect(getJobById).not.toHaveBeenCalled();
    expect(writeData).not.toHaveBeenCalled();
  });

  it("returns 404 when saving an unknown job", async () => {
    getSession.mockResolvedValue(session);
    getJobById.mockResolvedValue(null);

    const res = await post({ jobId: "missing-job" });

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Job not found" });
    expect(writeData).not.toHaveBeenCalled();
  });

  it("saves an existing job for an authenticated user", async () => {
    const now = new Date("2026-06-26T05:41:00.000Z");
    vi.setSystemTime(now);
    getSession.mockResolvedValue(session);
    getJobById.mockResolvedValue(job);
    getSavedJobs.mockResolvedValue([{ jobId: "job-002", savedAt: "2026-01-01T00:00:00.000Z" }]);

    const res = await post({ jobId: "job-001" });

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ saved: true });
    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, SavedJob[]];
    expect(key).toBe("saved");
    expect(written).toEqual([
      { jobId: "job-001", savedAt: now.toISOString() },
      { jobId: "job-002", savedAt: "2026-01-01T00:00:00.000Z" },
    ]);
  });

  it("removes an already saved job when toggled", async () => {
    getSession.mockResolvedValue(session);
    getJobById.mockResolvedValue(job);
    getSavedJobs.mockResolvedValue([
      { jobId: "job-001", savedAt: "2026-01-01T00:00:00.000Z" },
      { jobId: "job-002", savedAt: "2026-01-02T00:00:00.000Z" },
    ]);

    const res = await post({ jobId: "job-001" });

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ saved: false });
    expect(writeData).toHaveBeenCalledWith("saved", [
      { jobId: "job-002", savedAt: "2026-01-02T00:00:00.000Z" },
    ]);
  });

  it("rejects unauthenticated delete requests", async () => {
    getSession.mockResolvedValue(null);

    const res = await del("?jobId=job-001");

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Please log in" });
    expect(writeData).not.toHaveBeenCalled();
  });

  it("returns 400 when deleting without a jobId", async () => {
    getSession.mockResolvedValue(session);

    const res = await del();

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "A jobId is required" });
    expect(writeData).not.toHaveBeenCalled();
  });

  it("deletes only the requested saved job", async () => {
    getSession.mockResolvedValue(session);
    getSavedJobs.mockResolvedValue([
      { jobId: "job-001", savedAt: "2026-01-01T00:00:00.000Z" },
      { jobId: "job-002", savedAt: "2026-01-02T00:00:00.000Z" },
    ]);

    const res = await del("?jobId=job-001");

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(writeData).toHaveBeenCalledWith("saved", [
      { jobId: "job-002", savedAt: "2026-01-02T00:00:00.000Z" },
    ]);
  });
});
