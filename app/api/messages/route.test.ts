import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/messages", () => {
  it("returns messages from seed data", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.messages.length).toBeGreaterThan(0);
    expect(data.messages[0]).toMatchObject({
      id: expect.any(String),
      subject: expect.any(String),
      recruiterName: expect.any(String),
      replies: expect.any(Array),
    });
  });
});
