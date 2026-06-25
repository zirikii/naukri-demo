import { SearchBar } from "@/components/layout/SearchBar";
import { QuickSearchChips } from "./QuickSearchChips";

interface HeroProps {
  title: string;
  subtitle: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/60 to-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(213 81% 50%) 0, transparent 35%), radial-gradient(circle at 80% 30%, hsl(198 91% 50%) 0, transparent 30%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>

        <div className="mx-auto mt-8 max-w-3xl">
          <SearchBar variant="hero" />
        </div>

        <QuickSearchChips className="mt-6 justify-center" />
      </div>
    </section>
  );
}
