import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_VARIANT: Record<ApplicationStatus, "default" | "sky" | "success" | "destructive"> = {
  Applied: "default",
  "Application viewed": "sky",
  Shortlisted: "success",
  "Not selected": "destructive",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>;
}
