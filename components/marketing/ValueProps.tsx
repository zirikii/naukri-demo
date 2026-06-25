import { BadgeCheck, Eye, Sparkles, Target } from "lucide-react";

const ICONS = [Target, Eye, BadgeCheck, Sparkles];

export function ValueProps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <div key={item.title} className="surface-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
