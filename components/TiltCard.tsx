'use client';

import { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareEnabled?: boolean;
}

export default function TiltCard({ children, className = '', tiltAmount = 10, glareEnabled = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [tiltAmount, -tiltAmount]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltAmount, tiltAmount]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(x, [0, 1], ['-50%', '150%']);
  const glareY = useTransform(y, [0, 1], ['-50%', '150%']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={`relative ${className}`}
    >
      {children}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glareX}px ${glareY}px, rgba(255,77,77,0.08) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}
