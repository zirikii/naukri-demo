import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Naukri360BandProps {
  title: string;
  body: string;
  cta: string;
}

export function Naukri360Band({ title, body, cta }: Naukri360BandProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-6 py-10 text-primary-foreground sm:px-12">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-sky/20"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Naukri 360
          </span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-primary-foreground/90 sm:text-base">{body}</p>
          <Button
            asChild
            variant="secondary"
            className="mt-6 bg-white text-primary hover:bg-white/90"
          >
            <Link href="/naukri-360">
              {cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
