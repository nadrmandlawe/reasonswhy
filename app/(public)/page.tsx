'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useState, useEffect } from "react";
import RandomReasonModal from "@/components/RandomReasonModal";
import { Search, ArrowRight } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function LandingPagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reasonsCount = useQuery(api.reasons.getCount);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isSharedReasonOpen, setIsSharedReasonOpen] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const randomReason = useQuery(api.reasons.getRandomReason, { timestamp });

  // Get shared reason if exists
  const sharedReasonId = searchParams.get('reason');
  const sharedReason = useQuery(
    api.reasons.getReason,
    sharedReasonId ? { id: sharedReasonId as Id<"reasons"> } : "skip"
  );

  useEffect(() => {
    setTimestamp(Date.now());
  }, []);

  // Open shared reason modal if exists
  useEffect(() => {
    if (sharedReason) {
      setIsSharedReasonOpen(true);
    }
  }, [sharedReason]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/wall?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/wall?tags=${encodeURIComponent(tag)}`);
  };

  const handleFeelingLucky = () => {
    setTimestamp(Date.now());
    setIsRandomModalOpen(true);
  };

  // Handle shared reason modal close
  const handleSharedReasonClose = (open: boolean) => {
    setIsSharedReasonOpen(open);
    if (!open) {
      // Remove reason from URL when modal is closed
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  };


  return (
    // <div className="container flex flex-col items-center justify-center mx-auto">
    //   <div className="flex flex-col items-center space-y-6 text-center">
    //     <div className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-bold leading-tight">
    //       ReasonsWhy
    //     </div>
  
    //     <div className="space-y-4">
    //       <div className="text-2xl font-medium text-muted-foreground">
    //         <AnimatedCounter
    //           value={reasonsCount ?? 0}
    //           className="font-bold text-primary"
    //         />{' '}
    //         reasons shared
    //       </div>
    //       <p className="text-base text-muted-foreground max-w-[600px] mx-auto">
    //         Sharing Life&apos;s Joys Together, A place to share and discover reasons that matter to you
    //       </p>
    //     </div>
    //   </div>
  
    //   <form className="w-full max-w-2xl mt-6 space-y-6" onSubmit={handleSearch}>
    //     <div className="relative">
    //       <div className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-muted-foreground">
    //         <Search className="w-5 h-5" />
    //       </div>
    //       <Input
    //         type="text"
    //         placeholder="Search reasons..."
    //         className="w-full py-6 pl-10 pr-16 text-base rounded-full"
    //         value={searchQuery}
    //         onChange={(e) => setSearchQuery(e.target.value)}
    //         onKeyDown={(e) => {
    //           if (e.key === 'Enter') {
    //             handleSearch(e);
    //           }
    //         }}
    //       />
    //       <div className="absolute -translate-y-1/2 right-2 top-1/2">
    //         <Button type="submit" size="icon" className="w-10 h-10 rounded-full">
    //           <ArrowRight className="w-5 h-5" />
    //           <span className="sr-only">Search</span>
    //         </Button>
    //       </div>
    //     </div>
  
    //     <div className="flex flex-col justify-center gap-4 sm:flex-row">
    //       <Button
    //         variant="outline"
    //         onClick={() => router.push('/wall')}
    //         type="button"
    //         size="default"
    //         className="text-base rounded-full"
    //       >
    //         Browse Reasons
    //       </Button>
    //       <Button
    //         type="button"
    //         size="default"
    //         className="text-base rounded-full"
    //         onClick={handleFeelingLucky}
    //       >
    //         I&apos;m Feeling Lucky
    //       </Button>
    //     </div>
    //   </form>
  
    //   <RandomReasonModal
    //     open={isRandomModalOpen}
    //     onOpenChange={setIsRandomModalOpen}
    //     reason={randomReason}
    //     onTagClick={handleTagClick}
    //   />
  
    //   {sharedReason && (
    //     <RandomReasonModal
    //       open={isSharedReasonOpen}
    //       onOpenChange={handleSharedReasonClose}
    //       reason={sharedReason}
    //       onTagClick={handleTagClick}
    //     />
    //   )}
    // </div>

    <div className="container absolute inset-0 flex flex-col items-center justify-center w-full mx-auto">
          {/* Title */}
          <div className="space-y-6 text-center">
            <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-bold leading-tight">
              ReasonsWhy
            </h1>
    
            <div className="space-y-4">
              <div className="text-2xl font-medium text-muted-foreground">
                <AnimatedCounter
                  value={reasonsCount ?? 0}
                  className="font-bold text-primary"
                />{' '}
                reasons shared
              </div>
              <p className="text-base text-muted-foreground max-w-[600px] mx-auto">
                Sharing Life&apos;s Joys Together, A place to share and discover reasons that matter to you.
              </p>
            </div>
          </div>
    
          {/* Search Box */}
          <form
            className="w-full max-w-2xl mt-6 space-y-6"
            onSubmit={handleSearch}
          >
            <div className="relative">
              <div className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Search reasons..."
                className="w-full py-6 pl-10 pr-16 text-base rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
              />
              <div className="absolute -translate-y-1/2 right-2 top-1/2">
                <Button type="submit" size="icon" className="w-10 h-10 rounded-full">
                  <ArrowRight className="w-5 h-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>
    
            {/* Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => router.push('/wall')}
                type="button"
                size="default"
                className="text-base rounded-full"
              >
                Browse Reasons
              </Button>
              <Button
                type="button"
                size="default"
                className="text-base rounded-full"
                onClick={handleFeelingLucky}
              >
                I&apos;m Feeling Lucky
              </Button>
            </div>
          </form>
    
          {/* Modals */}
          <RandomReasonModal
            open={isRandomModalOpen}
            onOpenChange={setIsRandomModalOpen}
            reason={randomReason}
            onTagClick={handleTagClick}
          />
    
          {sharedReason && (
            <RandomReasonModal
              open={isSharedReasonOpen}
              onOpenChange={handleSharedReasonClose}
              reason={sharedReason}
              onTagClick={handleTagClick}
            />
          )}


      
        </div>
        
  );
}