import { describe, expect, it } from "vitest";

import { GET } from "./route";
import { PAGE_SIZE } from "@/lib/types";

function get(query: string) {
  return GET(new Request(`http://localhost/api/jobs?${query}`));
}

describe("GET /api/jobs", () => {
  it("returns paginated jobs from seed data", async () => {
    const res = await get("");
    const data = await res.json();
    expect(data.total).toBeGreaterThan(0);
    expect(data.jobs.length).toBeLessThanOrEqual(PAGE_SIZE);
    expect(data.totalPages).toBeGreaterThanOrEqual(1);
  });

  it("filters by keyword query", async () => {
    const res = await get("q=React");
    const data = await res.json();
    expect(data.total).toBeGreaterThan(0);
    for (const job of data.jobs) {
      const haystack =
        `${job.title} ${job.role} ${job.skills.join(" ")} ${job.company.name}`.toLowerCase();
      expect(haystack).toContain("react");
    }
  });

  it("narrows results when a department facet is applied", async () => {
    const all = await (await get("")).json();
    const filtered = await (await get("department=Data+Science+%26+Analytics")).json();
    expect(filtered.total).toBeLessThanOrEqual(all.total);
    for (const job of filtered.jobs) {
      expect(job.department).toBe("Data Science & Analytics");
    }
  });

  it("respects pagination", async () => {
    const page1 = await (await get("page=1")).json();
    const page2 = await (await get("page=2")).json();
    if (page1.totalPages > 1) {
      expect(page2.page).toBe(2);
      const ids1 = page1.jobs.map((j: { id: string }) => j.id);
      const ids2 = page2.jobs.map((j: { id: string }) => j.id);
      expect(ids1).not.toEqual(ids2);
    }
  });
});
