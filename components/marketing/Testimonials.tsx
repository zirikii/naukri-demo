import { Quote } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils/format";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="bg-card py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Success stories from job seekers
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Thousands find the right job on Naukri every day
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="surface-card flex flex-col p-6">
              <Quote className="h-7 w-7 text-primary/30" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials(t.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
