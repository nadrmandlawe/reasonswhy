import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  // Create a spring animation for smooth counting
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 15,
    duration: 2
  });

  // Transform the spring value to the target number
  const display = useTransform(spring, Math.round);

  // Update the spring when the value changes
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
} 