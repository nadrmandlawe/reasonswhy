import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReasonSkeleton() {
  return (
    <Card className="p-4 min-w-[380px] w-full">
      <div className="flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1 space-y-4 flex-col flex ">
          {/* Reason text and copy button container */}
          <div className="flex items-start gap-4 justify-between">

            <div className="flex flex-col gap-6 justify-between">

              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
              </div>

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-8 shrink-0" />
              <Skeleton className="h-8 w-8 shrink-0" />
              <Skeleton className="h-8 w-8 shrink-0" />
            </div>

          </div>

        </div>

        {/* Author info skeleton */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
} 