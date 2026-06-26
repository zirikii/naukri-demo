import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SavedJob } from "@/lib/types";

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

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

function del(query: string) {
  return DELETE(new Request(`http://localhost/api/saved?${query}`));
}

describe("GET /api/saved", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns saved jobs", async () => {
    getSavedJobs.mockResolvedValue([{ jobId: "job-011", savedAt: "2026-06-23T12:40:19.674Z" }]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.saved).toHaveLength(1);
    expect(data.saved[0]?.jobId).toBe("job-011");
  });
});

describe("POST /api/saved", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await post({ jobId: "job-001" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when jobId is missing", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await post({});
    expect(res.status).toBe(400);
  });

  it("returns 404 when the job does not exist", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getJobById.mockResolvedValue(null);

    const res = await post({ jobId: "missing-job" });
    expect(res.status).toBe(404);
  });

  it("saves a job when it is not already saved", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getJobById.mockResolvedValue({ id: "job-001", title: "Engineer" });
    getSavedJobs.mockResolvedValue([]);

    const res = await post({ jobId: "job-001" });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.saved).toBe(true);

    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, SavedJob[]];
    expect(key).toBe("saved");
    expect(written).toHaveLength(1);
    expect(written[0]?.jobId).toBe("job-001");
  });

  it("unsaves a job when it is already saved", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getJobById.mockResolvedValue({ id: "job-001", title: "Engineer" });
    getSavedJobs.mockResolvedValue([{ jobId: "job-001", savedAt: "2026-06-01T00:00:00.000Z" }]);

    const res = await post({ jobId: "job-001" });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.saved).toBe(false);

    const [, written] = writeData.mock.calls[0] as [string, SavedJob[]];
    expect(written).toHaveLength(0);
  });
});

describe("DELETE /api/saved", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    getSession.mockResolvedValue(null);
    const res = await del("jobId=job-001");
    expect(res.status).toBe(401);
  });

  it("returns 400 when jobId is missing", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    const res = await del("");
    expect(res.status).toBe(400);
  });

  it("removes a saved job", async () => {
    getSession.mockResolvedValue({ id: "u1", name: "Aarav", email: "a@b.com" });
    getSavedJobs.mockResolvedValue([
      { jobId: "job-001", savedAt: "2026-06-01T00:00:00.000Z" },
      { jobId: "job-002", savedAt: "2026-06-02T00:00:00.000Z" },
    ]);

    const res = await del("jobId=job-001");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ ok: true });

    const [, written] = writeData.mock.calls[0] as [string, SavedJob[]];
    expect(written).toHaveLength(1);
    expect(written[0]?.jobId).toBe("job-002");
  });
});
