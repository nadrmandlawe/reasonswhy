'use client';

import { ReactNode } from "react";
import { ConvexProvider } from "convex/react";
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';
import { Suspense } from "react";
import { convex } from '@/lib/convex';

// Lazy load non-critical providers
const ThemeProvider = dynamic(
  () => import('next-themes').then(mod => mod.ThemeProvider),
  { ssr: false }
);

const Toaster = dynamic(
  () => import('sonner').then(mod => mod.Toaster),
  { ssr: false }
);

// Lightweight loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-screen bg-background" />
  </div>
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ConvexProvider client={convex}>
        <Suspense fallback={<LoadingSkeleton />}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </Suspense>
      </ConvexProvider>
    </SessionProvider>
  );
}
