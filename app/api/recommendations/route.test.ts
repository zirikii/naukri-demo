import { describe, expect, it } from "vitest";

import { GET } from "./route";

function get(query = "") {
  return GET(new Request(`http://localhost/api/recommendations${query ? `?${query}` : ""}`));
}

describe("GET /api/recommendations", () => {
  it("returns scored job recommendations from seed data", async () => {
    const res = await get();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.recommendations.length).toBeGreaterThan(0);

    const first = data.recommendations[0];
    expect(first.job).toBeTruthy();
    expect(first.job.id).toBeTruthy();
    expect(typeof first.score).toBe("number");
    expect(Array.isArray(first.reasons)).toBe(true);
  });

  it("respects the limit query parameter", async () => {
    const all = await (await get()).json();
    const limited = await (await get("limit=3")).json();

    expect(limited.recommendations.length).toBeLessThanOrEqual(3);
    expect(limited.recommendations.length).toBeLessThanOrEqual(all.recommendations.length);
  });

  it("returns recommendations sorted by descending score", async () => {
    const data = await (await get("limit=5")).json();
    const scores = data.recommendations.map((r: { score: number }) => r.score);

    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]!);
    }
  });
});
