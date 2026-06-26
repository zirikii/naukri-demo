// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserAccount } from "@/lib/types";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";

const getUsers = vi.fn();
const writeData = vi.fn();
const cookieSet = vi.fn();

vi.mock("@/lib/data/queries", () => ({
  getUsers: () => getUsers(),
}));
vi.mock("@/lib/data/store", () => ({
  writeData: (key: string, data: unknown) => writeData(key, data),
}));
vi.mock("next/headers", () => ({
  cookies: () => ({
    set: cookieSet,
    delete: vi.fn(),
    get: vi.fn(),
  }),
}));

import { POST } from "./route";

const validBody = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  password: "demo",
  experienceYears: 3,
  currentLocation: "Mumbai",
  keySkills: ["React", "TypeScript"],
};

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue([]);
  });

  it("returns 400 for invalid input", async () => {
    const res = await post({ ...validBody, email: "bad-email" });
    expect(res.status).toBe(400);
    expect(writeData).not.toHaveBeenCalled();
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("returns 409 when the email already exists", async () => {
    getUsers.mockResolvedValue([
      { id: "user-1", name: "Existing", email: "jane.doe@example.com" },
    ]);

    const res = await post(validBody);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toContain("already exists");
    expect(writeData).not.toHaveBeenCalled();
  });

  it("creates a user, sets the session cookie, and returns 201", async () => {
    const res = await post(validBody);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.user).toMatchObject({
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });
    expect(data.user.id).toMatch(/^user-/);

    expect(writeData).toHaveBeenCalledTimes(1);
    const [key, written] = writeData.mock.calls[0] as [string, UserAccount[]];
    expect(key).toBe("users");
    expect(written).toHaveLength(1);
    expect(written[0]).toMatchObject({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      experienceYears: 3,
      currentLocation: "Mumbai",
      keySkills: ["React", "TypeScript"],
    });

    expect(cookieSet).toHaveBeenCalledTimes(1);
    const [name, token, options] = cookieSet.mock.calls[0] as [string, string, Record<string, unknown>];
    expect(name).toBe(SESSION_COOKIE);
    expect(typeof token).toBe("string");
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  });
});
