import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import profileFixture from "@/data/profile.json";
import type { Profile } from "@/lib/types";

vi.mock("@/components/dashboard/ProfileSummaryCard", () => ({
  ProfileSummaryCard: () => <div data-testid="profile-summary" />,
}));
vi.mock("@/components/dashboard/RecommendedJobs", () => ({
  RecommendedJobs: () => <div data-testid="recommended-jobs" />,
}));
vi.mock("@/components/dashboard/RecruiterActions", () => ({
  RecruiterActions: () => <div data-testid="recruiter-actions" />,
}));
vi.mock("@/components/dashboard/ProfilePerformance", () => ({
  ProfilePerformance: () => <div data-testid="profile-performance" />,
}));
vi.mock("@/components/dashboard/AppliedStatusSummary", () => ({
  AppliedStatusSummary: () => <div data-testid="applied-status" />,
}));
vi.mock("@/components/dashboard/Naukri360Promo", () => ({
  Naukri360Promo: () => <div data-testid="naukri360-promo" />,
}));

const getSession = vi.fn();
const getProfile = vi.fn();
const getJobsWithCompany = vi.fn();
const getApplications = vi.fn();
const getSavedJobs = vi.fn();
const getMessages = vi.fn();
const getCompanyMap = vi.fn();

vi.mock("@/lib/auth/getSession", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/data/queries", () => ({
  getProfile: () => getProfile(),
  getJobsWithCompany: () => getJobsWithCompany(),
  getApplications: () => getApplications(),
  getSavedJobs: () => getSavedJobs(),
  getMessages: () => getMessages(),
  getCompanyMap: () => getCompanyMap(),
}));

import DashboardPage from "./page";

const profile = profileFixture as Profile;

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getProfile.mockResolvedValue(profile);
    getJobsWithCompany.mockResolvedValue([]);
    getApplications.mockResolvedValue([]);
    getSavedJobs.mockResolvedValue([]);
    getMessages.mockResolvedValue([]);
    getCompanyMap.mockResolvedValue(new Map());
  });

  it("does not render the welcome back heading", async () => {
    render(await DashboardPage());
    expect(screen.queryByRole("heading", { name: /welcome back/i })).not.toBeInTheDocument();
  });

  it("renders the dashboard intro text", async () => {
    render(await DashboardPage());
    expect(
      screen.getByText(/here's what's happening with your job search today/i),
    ).toBeInTheDocument();
  });

  it("does not fetch session data for a greeting", async () => {
    await DashboardPage();
    expect(getSession).not.toHaveBeenCalled();
  });
});
