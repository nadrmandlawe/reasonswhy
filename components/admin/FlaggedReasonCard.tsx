'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
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

interface FlaggedReasonCardProps {
  reason: Reason;
  flags: Flag[];
  onSelect?: () => void;
  isSelected?: boolean;
}

export function FlaggedReasonCard({ reason, flags, onSelect, isSelected }: FlaggedReasonCardProps) {
  const removeReason = useMutation(api.reasons.removeReason);
  const dismissFlagMutation = useMutation(api.reasons.dismissFlag);

  const handleRemoveReason = async () => {
    try {
      await removeReason({ reasonId: reason._id });
      toast.success("Reason removed successfully");
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
    <Card 
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? "border-primary" : "hover:border-muted-foreground"
      }`}
      onClick={onSelect}
    >
      <div className="space-y-4">
        {/* Reason Text */}
        <div>
          <h3 className="font-medium mb-2">Reason:</h3>
          <p className="text-muted-foreground line-clamp-3">{reason.reasonText}</p>
        </div>

        {/* Flag Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {flags.length} {flags.length === 1 ? "flag" : "flags"}
          </span>
          <span className="text-sm text-muted-foreground">
            {new Date(flags[0].flaggedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{reason.initialName}</span>
          {reason.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="text-muted-foreground">{reason.location}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveReason();
            }}
          >
            Remove
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Dismiss all flags for this reason
              flags.forEach(flag => handleDismissFlag(flag._id));
            }}
          >
            Dismiss All
          </Button>
        </div>
      </div>
    </Card>
  );
} 