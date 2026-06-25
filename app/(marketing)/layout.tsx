import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav showSearch={false} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
