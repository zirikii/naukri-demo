import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";

/** Public job-browsing chrome (SRP + JD). Accessible without authentication. */
export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
