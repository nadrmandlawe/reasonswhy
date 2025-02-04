'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { z } from "zod";
import { Filter } from "bad-words";
import React, { useState } from "react";
import { Confetti } from "@/components/ui/confetti";
import { triggerConfetti } from '@/components/GlobalConfetti';
import { usePathname } from "next/navigation";
import { Country, countries } from "@/lib/countries";

interface AddReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_TAGS = 10;
const MAX_REASON_LENGTH = 250;
const MAX_NAME_LENGTH = 25;
const MAX_TAG_LENGTH = 25;

const filter = new Filter();

const formSchema = z.object({
  reasonText: z.string()
    .min(1, "Reason is required")
    .max(MAX_REASON_LENGTH, `Reason must be less than ${MAX_REASON_LENGTH} characters`),
  initialName: z.string()
    .min(1, "Name is required")
    .max(MAX_NAME_LENGTH, `Name must be less than ${MAX_NAME_LENGTH} characters`)
    .refine(
      (name) => {
        // This validation will be overridden in the form submission
        // to allow admin users to use "admin"
        return name.toLowerCase() !== "admin";
      },
      {
        message: "This name is reserved",
      }
    ),
  location: z.string().optional(),
  tags: z.array(
    z.string()
      .min(1)
      .max(MAX_TAG_LENGTH, `Tag must be less than ${MAX_TAG_LENGTH} characters`)
  ).max(MAX_TAGS, `Maximum ${MAX_TAGS} tags allowed`),
});

type ReasonFormData = z.infer<typeof formSchema>;

function AddReasonForm({ className, onOpenChange }: { className?: string; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') || false;

  const [formData, setFormData] = React.useState<ReasonFormData>({
    initialName: isAdmin ? "admin" : "",
    reasonText: "",
    location: "",
    tags: [],
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof ReasonFormData, string>>>({});
  const [tagInput, setTagInput] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti] = useState(false);
  const initialNameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialNameRef.current) {
      initialNameRef.current.focus();
    }
  }, []);

  const createReason = useMutation(api.reasons.createReason);

  // Update the form schema based on admin status
  const currentFormSchema = isAdmin ? 
    formSchema.omit({ initialName: true }).extend({
      initialName: z.literal("admin")
    }) : 
    formSchema;

  const validateForm = () => {
    try {
      currentFormSchema.parse(formData);
      
      // Check for profanity in all fields
      const hasProfanity = 
        filter.isProfane(formData.reasonText) || 
        (formData.location && filter.isProfane(formData.location)) || 
        formData.tags.some(tag => filter.isProfane(tag));

      if (hasProfanity) {
        toast.error("Please remove any inappropriate language from your submission.");
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ReasonFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ReasonFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Clean the text and validate before sending to API
      const cleanData = {
        initialName: filter.clean(formData.initialName),
        reasonText: filter.clean(formData.reasonText),
        location: formData.location ? filter.clean(formData.location) : "",
        tags: formData.tags.map(tag => filter.clean(tag)),
      };

      // Pre-validate for sensitive information patterns before making API request
      const sensitivePatterns = [
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, // email
        /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, // phone
        /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, // IP address
      ];

      const combinedText = `${cleanData.initialName} ${cleanData.reasonText} ${cleanData.location} ${cleanData.tags.join(' ')}`;
      const hasSensitiveInfo = sensitivePatterns.some(pattern => pattern.test(combinedText));

      if (hasSensitiveInfo) {
        toast.error("Please remove any sensitive information (email, phone numbers, etc.) from your inputs.");
        setIsLoading(false);
        return;
      }

      // Only make API request if client-side validation passes
      const response = await fetch('/api/arcjet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: cleanData.initialName,
            text: cleanData.reasonText,
            location: cleanData.location,
            tags: cleanData.tags.join(','),
          },
        }),
      });

      const result = await response.json();

      if (result.conclusion !== "ALLOW") {
        if (result.reason?.type === "RATE_LIMIT") {
          toast.error("You've added too many reasons recently. Please try again later.");
        } else if (result.reason?.type === "SENSITIVE_INFO") {
          toast.error("Please remove any sensitive information (email, phone numbers, etc.) from your inputs.");
        } else if (result.reason?.type === "BOT") {
          toast.error("Your request was flagged as automated. Please try again later.");
        } else {
          toast.error("Your submission was not allowed. Please try again later.");
        }
        setIsLoading(false);
        return;
      }

      // If all checks pass, create the reason
      await createReason({
        initialName: cleanData.initialName,
        reasonText: cleanData.reasonText,
        location: cleanData.location || undefined,
        tags: cleanData.tags,
      });

      // Close dialog immediately
      onOpenChange(false);
      // Reset form
      setFormData({
        initialName: "",
        reasonText: "",
        location: "",
        tags: [],
      });
      
      // Show success message and confetti after dialog closes
      setTimeout(() => {
        triggerConfetti();
        toast.success("Your reason was added successfully!");
      }, 100);

    } catch (error) {
      console.error('Error submitting reason:', error);
      toast.error("Failed to submit your reason. Please try again.");
    }
    setIsLoading(false);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (tag && !formData.tags.includes(tag)) {
      if (formData.tags.length >= MAX_TAGS) {
        toast.error(`You can only add up to ${MAX_TAGS} tags`);
        return;
      }
      if (tag.length > MAX_TAG_LENGTH) {
        toast.error(`Tag must be less than ${MAX_TAG_LENGTH} characters`);
        return;
      }
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    } else if (formData.tags.includes(tag)) {
      toast.error("This tag already exists");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <>
      <Confetti isActive={showConfetti} />
      <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
          <Label htmlFor="name" className="flex justify-between text-sm">
            <span>Your Name *</span>
            <span className={cn(
              "text-xs",
              formData.initialName.length >= MAX_NAME_LENGTH && "text-destructive font-medium"
            )}>
              {formData.initialName.length}/{MAX_NAME_LENGTH}
            </span>
          </Label>
          <Input
            ref={initialNameRef}
            id="name"
            placeholder="Enter your name or initials"
            value={formData.initialName}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                initialName: isAdmin ? "admin" : e.target.value.slice(0, MAX_NAME_LENGTH)
              }))
            }
            disabled={isAdmin}
            className={cn(
              "text-sm min-h-[44px]",
              errors.initialName && "border-destructive",
              formData.initialName.length >= MAX_NAME_LENGTH && "border-destructive"
            )}
          />
          {errors.initialName && (
            <p className="text-sm text-destructive">{errors.initialName}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reason" className="flex justify-between text-sm">
            <span>Your Reason *</span>
            <span className={cn(
              "text-xs",
              formData.reasonText.length >= MAX_REASON_LENGTH && "text-destructive font-medium"
            )}>
              {formData.reasonText.length}/{MAX_REASON_LENGTH}
            </span>
          </Label>
          <Textarea
            id="reason"
            placeholder="Share your reason..."
            className={cn(
              "min-h-[150px] text-sm resize-none",
              errors.reasonText && "border-destructive",
              formData.reasonText.length >= MAX_REASON_LENGTH && "border-destructive"
            )}
            value={formData.reasonText}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                reasonText: e.target.value.slice(0, MAX_REASON_LENGTH)
              }))
            }
          />
          {errors.reasonText && (
            <p className="text-sm text-destructive">{errors.reasonText}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location" className="text-sm">
            Location
          </Label>
          <Select
            value={formData.location || ""}
            onValueChange={(value) =>
              setFormData(prev => ({
                ...prev,
                location: value
              }))
            }
          >
            <SelectTrigger id="location" className="text-sm min-h-[44px]">
              <SelectValue placeholder="Select your country (optional)" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country: Country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags" className="flex justify-between text-sm">
            <span>Tags</span>
            <span className={cn(
              "text-xs",
              formData.tags.length >= MAX_TAGS && "text-destructive font-medium"
            )}>
              {formData.tags.length}/{MAX_TAGS}
            </span>
          </Label>
          <div className="space-y-2">
            <Input
              id="tags"
              placeholder="Type a tag and press Enter (optional)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value.slice(0, MAX_TAG_LENGTH))}
              onKeyDown={handleTagInputKeyDown}
              onBlur={() => {
                if (tagInput.trim()) {
                  addTag();
                }
              }}
              className={cn(
                "text-sm min-h-[44px]",
                errors.tags && "border-destructive",
                formData.tags.length >= MAX_TAGS && "border-destructive"
              )}
            />
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags}</p>
            )}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-secondary"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[44px] text-sm "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Reason"
          )}
        </Button>
      </form>
    </>
  );
}

export default function AddReasonDialog({ open, onOpenChange }: AddReasonDialogProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg ">Share your reason with others</DialogTitle>
          <DialogDescription className="text-xs text-red-500">
            All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1">
          <AddReasonForm onOpenChange={onOpenChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 