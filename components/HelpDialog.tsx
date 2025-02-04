'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Phone, Heart } from "lucide-react";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HOTLINES = [
  {
    name: "ERAN - Emotional First Aid",
    number: "1201",
    description: "24/7 emotional support and suicide prevention",
  },
  {
    name: "NATAL - Trauma and Anxiety Hotline",
    number: "1-800-363-363",
    description: "Support for trauma and anxiety related to national security",
  },
  {
    name: "Israel Crisis Hotline",
    number: "1201",
    description: "24/7 crisis intervention and emotional support",
  },
  {
    name: "AMCHA - Support for Holocaust Survivors",
    number: "1-800-27-66-66",
    description: "Mental health support for Holocaust survivors and their families",
  },
  {
    name: "Sahar - Online Emotional Support",
    number: "www.sahar.org.il",
    description: "Online emotional support in multiple languages",
  },
];

export default function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col p-4 gap-0 border-0 sm:border sm:p-6 sm:gap-4 rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Heart className="h-5 w-5 text-red-500" />
            Need Help?
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Here are some hotlines that can provide support and assistance
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {HOTLINES.map((hotline) => (
            <div
              key={hotline.name}
              className="rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <h3 className="font-medium">{hotline.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {hotline.description}
              </p>
              <div className="flex items-center gap-2 text-primary">
                <Phone className="h-4 w-4" />
                <span className="font-medium text-sm">{hotline.number}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 