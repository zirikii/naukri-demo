import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface CompanyLogoProps {
  name: string;
  hue: number;
  size?: number;
  className?: string;
}

/**
 * Colored initials avatar standing in for a company logo. Uses the company's brand hue to
 * produce a soft, consistent badge (no real third-party logos required).
 */
export function CompanyLogo({ name, hue, size = 48, className }: CompanyLogoProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-border font-bold",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue} 70% 96%)`,
        color: `hsl(${hue} 65% 38%)`,
        fontSize: size * 0.36,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
