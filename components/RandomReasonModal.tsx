'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import ReasonCard from "./ReasonCard";
import { useState } from "react";
import { ScratchToReveal } from "./ui/scratch-to-reveal";

type RandomReasonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: {
    _id: Id<"reasons">;
    _creationTime: number;
    initialName: string;
    tags?: string[];
    location?: string;
    reasonText: string;
    createdAt: number;
  } | null | undefined;
  onTagClick?: (tag: string) => void;
};

export default function RandomReasonModal({
  open,
  onOpenChange,
  reason,
  onTagClick,
}: RandomReasonModalProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!reason) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-background border-2 rounded-lg border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <DialogHeader className="p-6 border-b-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {isRevealed ? "Your Random Reason" : "Scratch to Reveal Your Reason"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6 overflow-hidden max-h-[calc(95vh-120px)] flex items-center justify-center">
          {isRevealed ? (
            <div className="w-[420px]">
              <ReasonCard reason={reason} onTagClick={onTagClick} />
            </div>
          ) : (
            <ScratchToReveal
              width={420}
              height={500}
              onComplete={() => setIsRevealed(true)}
              gradientColors={['#a5b4fc', '#818cf8', '#6366f1']}
              className="flex items-center justify-center overflow-hidden rounded-2xl p-2"
            >
              <ReasonCard reason={reason} onTagClick={onTagClick} />
            </ScratchToReveal>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 