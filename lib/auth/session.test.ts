// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";

import { decodeSession, encodeSession } from "./session";
import type { SessionUser } from "@/lib/types";

const user: SessionUser = { id: "user-1", name: "Aarav Sharma", email: "aarav@example.com" };

describe("session token", () => {
  beforeAll(() => {
    process.env.DEMO_AUTH_SECRET = "test-secret";
  });

  it("encodes and decodes a round-trip", async () => {
    const token = await encodeSession(user);
    const decoded = await decodeSession(token);
    expect(decoded).toEqual(user);
  });

  it("returns null for an undefined token", async () => {
    expect(await decodeSession(undefined)).toBeNull();
  });

  it("returns null for a tampered token", async () => {
    const token = await encodeSession(user);
    const tampered = `${token}tamper`;
    expect(await decodeSession(tampered)).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await encodeSession(user);
    process.env.DEMO_AUTH_SECRET = "another-secret";
    expect(await decodeSession(token)).toBeNull();
    process.env.DEMO_AUTH_SECRET = "test-secret";
  });
});
