'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({ 
  icon = <Plus className="w-6 h-6" />,
  label = "Add",
  className,
  ...props 
}: FloatingActionButtonProps) {
  return (
<Button 
  aria-label="Add Reason"
  size="icon"
  className={cn(
    "sticky bottom-0 right-0 h-16 w-16 rounded-full shadow-2xl ml-auto flex",
    "hover:scale-105 active:scale-95 transition-all z-[999]",
    "bg-primary text-white", // Ensure it matches your theme
    className
  )}
  {...props}
>
  {icon}
  <span className="sr-only">{label}</span>
</Button>


  );
} 