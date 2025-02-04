'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface Flag {
  _id: Id<"flaggedReasons">;
  reasonId: Id<"reasons">;
  report: string;
  flaggedAt: number;
  status: string;
}

interface Reason {
  _id: Id<"reasons">;
  reasonText: string;
  initialName: string;
  location?: string;
  tags?: string[];
  createdAt: number;
}

interface FlaggedReasonDetailsProps {
  reason: Reason;
  flags: Flag[];
  onClose: () => void;
}

export function FlaggedReasonDetails({ reason, flags, onClose }: FlaggedReasonDetailsProps) {
  const removeReason = useMutation(api.reasons.removeReason);
  const dismissFlagMutation = useMutation(api.reasons.dismissFlag);

  const handleRemoveReason = async () => {
    try {
      await removeReason({ reasonId: reason._id });
      toast.success("Reason removed successfully");
      onClose();
    } catch (error) {
      console.error("Failed to remove reason:", error);
      toast.error("Failed to remove reason");
    }
  };

  const handleDismissFlag = async (flagId: Id<"flaggedReasons">) => {
    try {
      await dismissFlagMutation({ flagId });
      toast.success('Flag dismissed successfully');
    } catch (error) {
      console.error('Error dismissing flag:', error);
      toast.error('Failed to dismiss flag');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Flagged Reason Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Reason Content */}
          <Card className="p-4">
            <h3 className="font-medium mb-2">Reason Content</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{reason.reasonText}</p>
            
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{reason.initialName}</span>
              {reason.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="text-muted-foreground">{reason.location}</span>
                </div>
              )}
            </div>

            {reason.tags && reason.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {reason.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted rounded-full text-xs"
                    >
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Flags */}
          <div className="space-y-4">
            <h3 className="font-medium">Reports ({flags.length})</h3>
            {flags.map((flag) => (
              <Card key={flag._id} className="p-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground whitespace-pre-wrap">{flag.report}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(flag.flaggedAt).toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissFlag(flag._id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleRemoveReason}
        >
          Remove Reason
        </Button>
      </div>
    </div>
  );
} 