'use client';

import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

type ConfettiStore = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
};

const useConfettiStore = create<ConfettiStore>((set) => ({
  isActive: false,
  setIsActive: (active) => set({ isActive: active }),
}));

export const triggerConfetti = () => {
  useConfettiStore.getState().setIsActive(true);
};

export function GlobalConfetti() {
  const { isActive, setIsActive } = useConfettiStore();
  const leftCannonRef = useRef<HTMLCanvasElement>(null);
  const rightCannonRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const leftCannon = leftCannonRef.current;
    const rightCannon = rightCannonRef.current;
    if (!leftCannon || !rightCannon) return;

    const leftConfetti = confetti.create(leftCannon, {
      resize: true,
      useWorker: true,
    });

    const rightConfetti = confetti.create(rightCannon, {
      resize: true,
      useWorker: true,
    });

    // Left cannon
    leftConfetti({
      particleCount: 50,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      angle: 45,
      startVelocity: 45,
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
    });

    // Right cannon
    rightConfetti({
      particleCount: 50,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      angle: 135,
      startVelocity: 45,
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
    });

    // Reset after animation
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isActive, setIsActive]);

  return (
    <>
      <canvas
        ref={leftCannonRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      <canvas
        ref={rightCannonRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
} 