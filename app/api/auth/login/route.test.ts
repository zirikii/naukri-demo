// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";

const cookieSet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    set: cookieSet,
    delete: vi.fn(),
    get: vi.fn(),
  }),
}));

import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid email", async () => {
    const res = await post({ email: "not-an-email", password: "secret" });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("returns 400 when password is missing", async () => {
    const res = await post({ email: "aarav.sharma@example.com" });
    expect(res.status).toBe(400);
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("logs in a seeded user and sets the session cookie", async () => {
    const res = await post({ email: "aarav.sharma@example.com", password: "any" });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.user).toEqual({
      id: "user-1",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
    });

    expect(cookieSet).toHaveBeenCalledTimes(1);
    const [name, token, options] = cookieSet.mock.calls[0] as [string, string, Record<string, unknown>];
    expect(name).toBe(SESSION_COOKIE);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  });

  it("creates a demo session for unknown emails", async () => {
    const res = await post({ email: "jane.doe@example.com", password: "demo" });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.user).toEqual({
      id: "user-jane.doe",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });
    expect(cookieSet).toHaveBeenCalledTimes(1);
  });
});
