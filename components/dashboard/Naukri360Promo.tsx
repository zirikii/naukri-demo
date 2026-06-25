import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function Naukri360Promo() {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
      <CardContent className="p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          Naukri 360
        </span>
        <h3 className="mt-3 text-base font-semibold">Level up your career</h3>
        <p className="mt-1 text-sm text-primary-foreground/90">
          Build a standout resume, ace interviews, and practice coding with AI-assisted tools.
        </p>
        <Link
          href="/naukri-360"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
        >
          Explore tools
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
