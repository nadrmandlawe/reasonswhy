'use client';

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Clock, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Loading } from "@/components/ui/loading";

interface ReasonData {
  reason: {
    _id: Id<"reasons">;
    reasonText: string;
    initialName: string;
    location?: string;
    tags?: string[];
    _creationTime: number;
  };
  reports: Array<{
    id: Id<"flaggedReasons">;
    report: string;
    flaggedAt: number;
  }>;
}

export default function FlaggedReasonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const flaggedReasons = useQuery(api.reasons.listFlaggedReasons);
  const dismissFlagMutation = useMutation(api.reasons.dismissFlag);
  const removeReasonMutation = useMutation(api.reasons.removeReason);

  // Group all reports for this reason
  const reasonData = React.useMemo(() => {
    if (!flaggedReasons) return null;
    
    const reports = flaggedReasons.filter(flag => flag.reason?._id === unwrappedParams.id);
    if (reports.length === 0 || !reports[0].reason) return null;

    return {
      reason: reports[0].reason,
      reports: reports.map(flag => ({
        id: flag._id,
        report: flag.report,
        flaggedAt: flag.flaggedAt
      }))
    } as ReasonData;
  }, [flaggedReasons, unwrappedParams.id]);

  if (!reasonData) {
    return <Loading />;
  }

  const handleDismissFlag = async (flagId: Id<"flaggedReasons">) => {
    try {
      await dismissFlagMutation({ flagId });
      toast.success("Flag dismissed successfully");
    } catch (error) {
      console.error("Failed to dismiss flag:", error);
      toast.error("Failed to dismiss flag");
    }
  };

  const handleRemoveReason = async () => {
    try {
      await removeReasonMutation({ reasonId: reasonData.reason._id });
      toast.success("Reason removed successfully");
      // Navigate back to the admin page
      window.location.href = "/admin";
    } catch (error) {
      console.error("Failed to remove reason:", error);
      toast.error("Failed to remove reason");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold">Flagged Reason Review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and take action on this flagged reason
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="px-6 py-6 space-y-6">
            {/* Reason Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Posted {formatDistanceToNow(new Date(reasonData.reason._creationTime), { addSuffix: true })}</span>
              </div>
              
              <Card className="relative p-6 overflow-hidden">
                <div className="space-y-4">
                  <p className="text-lg">{reasonData.reason.reasonText}</p>
                  
                  <div className="space-y-3">
                    {reasonData.reason.tags && reasonData.reason.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {reasonData.reason.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-blue-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{reasonData.reason.initialName}</span>
                      {reasonData.reason.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{reasonData.reason.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Reports Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-destructive" />
                <h2 className="text-lg font-semibold">Reports ({reasonData.reports.length})</h2>
              </div>
              
              {reasonData.reports.map((report) => (
                <Card key={report.id} className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Reported {formatDistanceToNow(new Date(report.flaggedAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm leading-relaxed break-all">{report.report}</p>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissFlag(report.id)}
                      >
                        Dismiss Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer Actions */}
      <div className="border-t p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Take action on this flagged reason
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={handleRemoveReason}
            >
              Remove Reason
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 