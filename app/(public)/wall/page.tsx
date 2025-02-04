"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import ReasonCard from "@/components/ReasonCard";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReasonSkeleton } from "@/components/ReasonSkeleton";
import { usePaginatedQuery } from "convex/react";
import Masonry from "react-masonry-css";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import AddReasonDialog from "@/components/AddReasonDialog";

const breakpointColumns = {
  default: 4, // 5 columns on extra-large screens
  2000: 3,
  1600: 3, // 4 columns on large screens
  1280: 2, // 3 columns on medium-large screens
  992: 2, // 2 columns on tablets and small desktops
  768: 1, // 1 column on mobile screens
};

const MAX_TAGS = 10;

export default function WallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const searchQuery = searchParams.get("q") || "";

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    results: reasons,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.reasons.listReasons,
    { tags: selectedTags.length > 0 ? selectedTags : undefined },
    { initialNumItems: 10 }
  );

  // Filter reasons based on search query
  const filteredReasons = reasons?.filter((reason) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    return (
      reason.reasonText.toLowerCase().includes(query) ||
      reason.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });



  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          status === "CanLoadMore" &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true);
          try {
            await loadMore(10);
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [status, loadMore, isLoadingMore]);


  useEffect(() => {
    if (isLoading && !reasons?.length) {
      document.body.style.overflowY = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflowY = "auto"; // Enable scrolling after loading
    }
  
    return () => {
      document.body.style.overflowY = "auto"; // Cleanup on unmount
    };
  }, [isLoading, reasons]);

  

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      const newTags = selectedTags.filter((t) => t !== tag);
      if (newTags.length === 0) {
        router.push("/wall");
      } else {
        router.push(`/wall?tags=${newTags.join(",")}`);
      }
    } else if (selectedTags.length < MAX_TAGS) {
      // Add tag if under the limit
      const newTags = [...selectedTags, tag];
      router.push(`/wall?tags=${newTags.join(",")}`);
    } else {
      // Show error if trying to add more than MAX_TAGS
      toast.error(`You can only select up to ${MAX_TAGS} tags`);
    }
  };

  const clearTagFilter = () => {
    router.push("/wall");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    if (newTags.length === 0) {
      router.push("/wall");
    } else {
      router.push(`/wall?tags=${newTags.join(",")}`);
    }
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <section className="flex flex-col w-screen h-full px-6">
      {/* Tags Section */}
      {selectedTags.length > 0 && (
        <div className="w-full py-4 border-b">
          <div className="flex flex-wrap items-center gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted"
              >
                <span className="text-sm font-medium">#{tag}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5 hover:bg-background/50"
                  onClick={() => removeTag(tag)}
                >
                  <X className="w-3 h-3" />
                  <span className="sr-only">Remove {tag} tag</span>
                </Button>
              </div>
            ))}
            {selectedTags.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTagFilter}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-6 ">
        {isLoading && !reasons?.length ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-full gap-6"
            columnClassName="masonry-column space-y-6"
          >
            {Array.from({ length: 100 }).map((_, index) => (
              <div key={index} className="mb-6">
                <ReasonSkeleton />
              </div>
            ))}
          </Masonry>
        ) : filteredReasons?.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-base text-muted-foreground">
              No reasons found{" "}
              {searchQuery.trim() && `for "${searchQuery.trim()}"`}
            </p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className={`flex gap-6 mx-auto w-full ${filteredReasons.length < 3 ? "max-w-3xl flex gap-6 flex-row space-x-32 mx-auto w-full" : ""}`} // Limits width when few items
            columnClassName="masonry-column space-y-6"
          >
            {filteredReasons?.map((reason) => (
              <div
                key={reason._id}
                className="flex items-center justify-center w-full px-4"
              >
                {" "}
                {/* Keeps proper spacing */}
                <ReasonCard reason={reason} onTagClick={handleTagClick} />
              </div>
            ))}
          </Masonry>
        )}

        {/* Load More Section */}
        {status === "CanLoadMore" && (
          <div ref={loadMoreRef} className="flex justify-center py-4 mt-8">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Loading more reasons...
              </span>
            </div>
          </div>
        )}
      </div>

      <FloatingActionButton
        onClick={() => setIsAddDialogOpen(true)}
        label="Add reason"
      />
      <AddReasonDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </section>
  );
}
