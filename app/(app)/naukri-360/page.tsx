import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { Naukri360Tools } from "@/components/naukri360/Naukri360Tools";

export const metadata: Metadata = { title: "Naukri 360" };

export default function Naukri360Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-6 py-8 text-primary-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          Naukri 360
        </span>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Your AI career companion</h1>
        <p className="mt-1 max-w-2xl text-sm text-primary-foreground/90">
          Build a standout resume, prepare for interviews, and sharpen your coding skills — all in
          one place. These tools are simulated for the demo.
        </p>
      </div>

      <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground">
        Demo only — these tools simulate AI features with sample content and timers. No real AI is
        used.
      </div>

      <Naukri360Tools />
    </div>
  );
}
