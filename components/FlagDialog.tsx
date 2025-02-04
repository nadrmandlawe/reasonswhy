import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface FlagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasonId: Id<"reasons">;
}

export function FlagDialog({ open, onOpenChange, reasonId }: FlagDialogProps) {
  const [report, setReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flagReason = useMutation(api.reasons.flagReason);

  const handleSubmit = async () => {
    if (!report.trim()) {
      toast.error("Please provide a reason for flagging");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await flagReason({ reasonId, report: report.trim() });
      toast.success("Report submitted successfully");
      setReport("");
      onOpenChange(false);
    } catch (error) {
      console.error("Flag submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!open) {
          setReport("");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col rounded-lg">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Please describe why you think this reason should be reviewed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report">Report Details</Label>
            <div className="relative">
              <Textarea
                id="report"
                placeholder="Describe the issue..."
                value={report}
                onChange={(e) => setReport(e.target.value)}
                className="min-h-[100px]"
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="absolute text-xs right-2 bottom-2 text-muted-foreground">
                {report.length}/1000
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 