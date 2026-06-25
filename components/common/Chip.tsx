import { X } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

/** A small pill used for skills and active-filter tags. */
export function Chip({ label, onRemove, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="rounded-full p-0.5 transition-colors hover:bg-primary/10"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}
