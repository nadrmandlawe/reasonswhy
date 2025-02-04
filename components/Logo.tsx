'use client';

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showLink?: boolean;
}

export function Logo({ 
  className, 
  width = 400, 
  height = 200, 
  showLink = true 
}: LogoProps) {
  const image = (
    <Image 
      src="/logo.svg" 
      alt="ReasonsWhy - Share reasons to stay alive" 
      width={width} 
      height={height} 
      priority
      className={cn("max-w-[90vw]", className)}
    />
  );

  if (showLink) {
    return (
      <Link href="/" aria-label="Go to home page" className="block">
        {image}
      </Link>
    );
  }

  return image;
} 