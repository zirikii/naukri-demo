// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_COOKIE } from "@/lib/auth/session";

const cookieDelete = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    set: vi.fn(),
    delete: cookieDelete,
    get: vi.fn(),
  }),
}));

import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears the session cookie and returns ok", async () => {
    const res = await POST();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ ok: true });
    expect(cookieDelete).toHaveBeenCalledWith(SESSION_COOKIE);
  });
});
