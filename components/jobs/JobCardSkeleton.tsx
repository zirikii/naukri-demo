import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <div className="flex gap-3">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
