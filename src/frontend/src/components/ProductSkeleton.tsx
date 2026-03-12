import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-4 w-20" />
      <div className="flex gap-1">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
