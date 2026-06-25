import { cn } from "@/lib/utils/cn";

interface JdSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function JdSection({ title, children, className }: JdSectionProps) {
  return (
    <section className={cn("border-t border-border py-5 first:border-t-0 first:pt-0", className)}>
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
