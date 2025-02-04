import { Loader2 } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
}

export function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${fullScreen ? 'h-[calc(100vh-60px)]' : 'h-full'}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
} 