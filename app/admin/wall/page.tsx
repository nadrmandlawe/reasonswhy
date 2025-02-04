"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import Masonry from "react-masonry-css";
import { Loading } from "@/components/ui/loading";

const breakpointColumns = {
  default: 7,
  3000: 6, // 6 columns on extra extra extra large screens
  2400: 5, // 5 columns on extra extra extra large screens
  2000: 4, // 4 columns on extra extra large screens
  1536: 3, // 3 columns on extra large screens
  1280: 2, // 2 columns on large screens
  768: 2, // 2 columns on medium screens
  640: 1, // 1 column on mobile
};

export default function AdminWallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const reasons = useQuery(api.reasons.listReasons, {
    paginationOpts: {
      numItems: 50,
      cursor: null,
    },
  });
  const removeReason = useMutation(api.reasons.removeReason);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && session?.user?.role !== "admin")
    ) {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !reasons) {
    return <Loading />;
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const handleDelete = async (reasonId: Id<"reasons">) => {
    try {
      await removeReason({ reasonId });
      toast.success("Reason removed successfully");
    } catch (error) {
      console.error("Failed to remove reason:", error);
      toast.error("Failed to remove reason");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="h-[60px] flex items-center px-6 border-b">
        <h1 className="font-semibold">Wall</h1>
      </div>
      <ScrollArea className="flex items-center justify-center flex-1">
        <div className="p-2 sm:p-4 md:p-6 ">
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto -ml-2 sm:-ml-4 "
            columnClassName="pl-2 sm:pl-4"
          >
            {reasons.page.map((reason) => (
              <div key={reason._id} className="p-2 mb-2 sm:mb-4 ">
                <Card className="p-3 sm:p-4 w-[340px] ">
                  <div className="flex flex-col h-full">
                    <p className="flex-1 mb-3 text-sm break-words whitespace-pre-wrap sm:mb-4 sm:text-base">
                      {reason.reasonText}
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        <span>{reason.initialName}</span>
                        {reason.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{reason.location}</span>
                          </div>
                        )}
                      </div>
                      {reason.tags && reason.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {reason.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 sm:py-1 bg-muted rounded-full text-xs"
                            >
                              # {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                        onClick={() => handleDelete(reason._id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Delete Reason
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </Masonry>
        </div>
      </ScrollArea>
    </div>
  );
}
