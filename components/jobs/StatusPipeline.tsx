import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { ApplicationStatus } from "@/lib/types";

const STAGES: ApplicationStatus[] = ["Applied", "Application viewed", "Shortlisted"];

/** Horizontal progress pipeline for an application's status. */
export function StatusPipeline({ status }: { status: ApplicationStatus }) {
  if (status === "Not selected") {
    return (
      <p className="text-xs font-medium text-destructive">Not selected — better luck next time</p>
    );
  }

  const currentIndex = STAGES.indexOf(status);

  return (
    <ol className="flex items-center gap-1">
      {STAGES.map((stage, i) => {
        const done = i <= currentIndex;
        return (
          <li key={stage} className="flex items-center gap-1">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={cn("text-xs", done ? "text-foreground" : "text-muted-foreground")}>
              {stage}
            </span>
            {i < STAGES.length - 1 ? (
              <span
                className={cn("mx-1 h-px w-6", done ? "bg-success" : "bg-border")}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
