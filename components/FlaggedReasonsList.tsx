'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FlaggedReasonsList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const flaggedReasons = useQuery(api.reasons.listFlaggedReasons);
  const removeReason = useMutation(api.reasons.removeReason);
  const dismissFlagMutation = useMutation(api.reasons.dismissFlag);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  if (!flaggedReasons) {
    return <div>Loading flagged reasons...</div>;
  }

  const handleRemoveReason = async (reasonId: Id<"reasons">) => {
    try {
      await removeReason({ reasonId });
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
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 mt-6">Flagged Reasons</h1>
      <div className="grid grid-cols-auto md:grid-cols-2 xl:grid-cols-3 gap-6">
        {flaggedReasons.length === 0 ? (
          <p>No flagged reasons to review.</p>
        ) : (
          flaggedReasons.map((flag) => (
            <Card key={flag._id} className="p-6 max-w-[400px] pb-10 h-full flex break-all flex-col flex-wrap">
              <div className="space-y-6">
                {/* Reason Details */}
                <div>
                  <h3 className="font-medium mb-2">Reason Text:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap break-words">
                    {flag.reason?.reasonText || "Reason not found"}
                  </p>
                </div>

                {/* Tags */}
                {flag.reason?.tags && flag.reason.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2 break-all">
                      {flag.reason.tags.map((tag) => (
                        <p
                          key={tag}
                          className="px-2 py-1 bg-muted rounded-full text-sm whitespace-pre-wrap break-words"
                        >
                          {"#"} {tag}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex flex-wrap gap-2 flex-col">
                  <h3 className="font-medium">Author:</h3>
                  <div className="flex flex-row gap-1 justify-between">
                    <p className="text-muted-foreground whitespace-pre-wrap break-words">
                      {flag.reason?.initialName || "Unknown"}
                    </p>
                    {flag.reason?.location && (
                      <div className="flex items-center gap-1 break-all">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground whitespace-pre-wrap break-words">
                          {flag.reason.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Report Info */}
                <div className="break-all">
                  <h3 className="font-medium mb-2">Report:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap break-words">
                    {flag.report}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Flagged At:</h3>
                  <p className="text-muted-foreground">
                    {new Date(flag.flaggedAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveReason(flag.reasonId)}
                  >
                    Remove Reason
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDismissFlag(flag._id)}
                  >
                    Dismiss Flag
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 