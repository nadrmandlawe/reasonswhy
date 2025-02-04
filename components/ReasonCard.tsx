'use client';

import { Copy, Check, MapPin, Share2, Flag, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlagDialog } from "./FlagDialog";


type ReasonCardProps = {
  reason: {
    _id: Id<"reasons">;
    initialName: string;
    tags?: string[];
    location?: string;
    reasonText: string;
  };
  onTagClick?: (tag: string) => void;
};




export default function ReasonCard({ reason, onTagClick }: ReasonCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      // Try using clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(reason.reasonText);
      } else {
        // Fallback for browsers without clipboard API
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = reason.reasonText;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.opacity = '0';

        document.body.appendChild(tempTextArea);

        // Handle iOS keyboard issues
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          tempTextArea.contentEditable = 'true';
          tempTextArea.readOnly = false;
        }

        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
      }

      setIsCopied(true);
      toast.success("Copied to clipboard!");

      // Reset the icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error("Failed to copy. Please try selecting the text manually.");
    }
  };

  const handleShare = async () => {
    try {
      // Get the base URL from window.location
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
      // Construct the share URL
      const shareUrl = `${baseUrl}/reason/${reason._id}`;
  
      // Try using clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } else {
        // Fallback for browsers without clipboard API
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = shareUrl;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.opacity = '0';
        tempTextArea.style.left = '-9999px';
  
        document.body.appendChild(tempTextArea);
  
        // Handle iOS keyboard issues
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          tempTextArea.contentEditable = 'true';
          tempTextArea.readOnly = false;
        }
  
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
  
        toast.success("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error("Unable to share. Please try again.");
    }
  };

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    } else {
      router.push(`/wall?tag=${encodeURIComponent(tag)}`);
    }
  };



  return (
    <Card className="flex flex-col justify-between min-w-[380px] w-full ">
      <CardHeader className="flex flex-row justify-between w-full">
        <CardTitle className="flex flex-col items-start justify-between w-full">
          <p className="text-base font-medium break-all">
            {reason.reasonText}
          </p>
          {/* Tags at bottom */}
          {reason.tags && reason.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {reason.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm break-all rounded-full hover:cursor-pointer text-primary"
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardTitle>

        {/* Action Buttons */}
        <div className="flex flex-col items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            <span className="sr-only">Share reason</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="sr-only">Copy reason</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setIsFlagDialogOpen(true)}
          >
            <Flag className="w-4 h-4" />
            <span className="sr-only">Flag reason</span>
          </Button>
        </div>
      </CardHeader>
      {/* Card Footer */}
      <CardFooter className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base text-muted-foreground break-all">
          {reason.initialName === "admin" && (
            <BadgeCheck className="flex-shrink-0 w-4 h-4 text-primary" />
          )}
          <span>{reason.initialName}</span>

        </div>
        {reason.location && (
          <div className="flex items-center gap-2 text-xs break-all sm:text-sm md:text-base text-muted-foreground">
            <MapPin className="w-4 h-4 sm:h-5 sm:w-5" />
            {reason.location}
          </div>
        )}
      </CardFooter>

      {/* Flag Dialog */}
      <FlagDialog
        open={isFlagDialogOpen}
        onOpenChange={setIsFlagDialogOpen}
        reasonId={reason._id}
      />
    </Card>
  );

} 