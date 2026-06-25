import { GlobalNav } from "./GlobalNav";

/** Authenticated app chrome: sticky global nav + a centered content container. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
