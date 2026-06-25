import { describe, expect, it } from "vitest";

import { formatCount, formatExperience, formatSalary, initials, postedAgo } from "./format";

describe("formatSalary", () => {
  it("formats a ₹ LPA range", () => {
    expect(formatSalary(12, 18)).toBe("₹ 12-18 LPA");
  });

  it("formats a single value when min equals max", () => {
    expect(formatSalary(10, 10)).toBe("₹ 10 LPA");
  });

  it("returns 'Not disclosed' when either bound is null", () => {
    expect(formatSalary(null, 18)).toBe("Not disclosed");
    expect(formatSalary(12, null)).toBe("Not disclosed");
    expect(formatSalary(null, null)).toBe("Not disclosed");
  });
});

describe("formatExperience", () => {
  it("returns 'Fresher' for 0-0", () => {
    expect(formatExperience(0, 0)).toBe("Fresher");
  });

  it("formats a range", () => {
    expect(formatExperience(2, 5)).toBe("2-5 Yrs");
  });

  it("formats a single year", () => {
    expect(formatExperience(3, 3)).toBe("3 Yrs");
  });
});

describe("postedAgo", () => {
  const now = new Date("2026-06-25T12:00:00.000Z");

  it("returns 'Just now' for very recent timestamps", () => {
    expect(postedAgo("2026-06-25T11:59:30.000Z", now)).toBe("Just now");
  });

  it("returns minutes ago", () => {
    expect(postedAgo("2026-06-25T11:30:00.000Z", now)).toBe("30 minutes ago");
  });

  it("returns hours ago", () => {
    expect(postedAgo("2026-06-25T09:00:00.000Z", now)).toBe("3 hours ago");
  });

  it("returns days ago", () => {
    expect(postedAgo("2026-06-20T12:00:00.000Z", now)).toBe("5 days ago");
  });

  it("singularises one day", () => {
    expect(postedAgo("2026-06-24T11:00:00.000Z", now)).toBe("1 day ago");
  });
});

describe("formatCount", () => {
  it("keeps small numbers", () => {
    expect(formatCount(999)).toBe("999");
  });

  it("compacts thousands", () => {
    expect(formatCount(1200)).toBe("1.2K");
    expect(formatCount(2000)).toBe("2K");
  });
});

describe("initials", () => {
  it("derives initials from a full name", () => {
    expect(initials("Aarav Sharma")).toBe("AS");
  });

  it("handles single names", () => {
    expect(initials("Flipkart")).toBe("FL");
  });
});
