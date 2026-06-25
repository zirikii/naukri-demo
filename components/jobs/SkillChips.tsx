import { cn } from "@/lib/utils/cn";

interface SkillChipsProps {
  skills: string[];
  max?: number;
  className?: string;
}

/** Render key-skill chips with an overflow "+N more" indicator. */
export function SkillChips({ skills, max = 5, className }: SkillChipsProps) {
  const visible = skills.slice(0, max);
  const remaining = skills.length - visible.length;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visible.map((skill) => (
        <span key={skill} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {skill}
        </span>
      ))}
      {remaining > 0 ? (
        <span className="text-xs font-medium text-muted-foreground">+{remaining} more</span>
      ) : null}
    </div>
  );
}
