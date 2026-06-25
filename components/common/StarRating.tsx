import { Star } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  rating: number;
  reviewsCount?: number;
  size?: "sm" | "md";
  className?: string;
}

/** Compact company rating: a single amber star with the numeric value (Naukri style). */
export function StarRating({ rating, reviewsCount, size = "sm", className }: StarRatingProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-muted-foreground",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
    >
      <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
        {rating.toFixed(1)}
        <Star className="h-3 w-3 fill-warning text-warning" />
      </span>
      {typeof reviewsCount === "number" ? (
        <span>
          {reviewsCount >= 1000 ? `${(reviewsCount / 1000).toFixed(1)}K` : reviewsCount} Reviews
        </span>
      ) : null}
    </span>
  );
}
