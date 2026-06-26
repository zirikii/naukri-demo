import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({
  getSession: () => getSession(),
}));

import { GET } from "./route";

describe("GET /api/auth/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when there is no active session", async () => {
    getSession.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ user: null });
  });

  it("returns the current session user", async () => {
    const user = { id: "user-1", name: "Aarav Sharma", email: "aarav.sharma@example.com" };
    getSession.mockResolvedValue(user);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ user });
  });
});
