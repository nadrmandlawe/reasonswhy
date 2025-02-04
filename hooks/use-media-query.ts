import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [mounted, setMounted] = useState(false);
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = () => setMatches(media.matches);
    
    // Start listening for changes
    media.addEventListener("change", listener);

    // Cleanup
    return () => media.removeEventListener("change", listener);
  }, [query]);

  // Prevent SSR mismatch by returning false if not mounted
  if (!mounted) return false;

  return matches;
} 

