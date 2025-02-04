'use client';

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Card className="p-6 w-full max-w-md text-center">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <h2 className="text-xl font-bold">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your content</p>
      </Card>
    </div>
  );
} 