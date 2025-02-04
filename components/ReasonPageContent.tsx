'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ReasonCard from "./ReasonCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReasonSkeleton } from "./ReasonSkeleton";

export function ReasonPageContent({ reasonId }: { reasonId: string }) {
  const router = useRouter();
  const reason = useQuery(api.reasons.getReason, { id: reasonId as Id<"reasons"> });

  // Show loading state while the query is in progress
  if (reason === undefined) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <ReasonSkeleton/>
      </div>
    );
  }

  // Show not found state only if the query has completed and returned null
  if (reason === null) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-2xl font-bold">Reason not found</h1>
        <Button onClick={() => router.push('/')}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ReasonCard reason={reason} />
      <Button onClick={() => router.push('/')}>Go Back Home</Button>
    </div>
  );
} 