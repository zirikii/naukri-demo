import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { GlobalNav } from "./GlobalNav";
import { SessionProvider } from "@/hooks/use-session";

// Mock next/navigation so the nav can read a fixed pathname and a no-op router.
vi.mock("next/navigation", () => ({
  usePathname: () => "/jobs",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function renderNav(authenticated: boolean) {
  return render(
    <SessionProvider
      initialUser={authenticated ? { id: "u1", name: "Aarav Sharma", email: "a@b.com" } : null}
    >
      <GlobalNav />
    </SessionProvider>,
  );
}

describe("GlobalNav", () => {
  it("marks the active route with aria-current", () => {
    renderNav(false);
    const jobsLinks = screen.getAllByRole("link", { name: "Jobs" });
    const active = jobsLinks.find((el) => el.getAttribute("aria-current") === "page");
    expect(active).toBeTruthy();
  });

  it("shows login/register when unauthenticated", () => {
    renderNav(false);
    expect(screen.getAllByRole("link", { name: "Login" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Register" }).length).toBeGreaterThan(0);
  });

  it("shows authenticated nav items when logged in", () => {
    renderNav(true);
    expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Messages" }).length).toBeGreaterThan(0);
  });
});
