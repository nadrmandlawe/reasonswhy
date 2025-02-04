'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/')} className="px-6 py-3">
          Go Back Home
        </Button>
      </div>
    </div>
  );
} 