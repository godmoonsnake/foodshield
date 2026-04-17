'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, type TargetAndTransition } from 'framer-motion';
import { useEffect, useState, ReactNode } from 'react';

interface TransitionConfig {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
}

// Per-route transition configs
const transitionConfigs: Record<string, TransitionConfig> = {
  '/': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
  },
  '/dashboard': {
    initial: { opacity: 0, scale: 0.92, filter: 'blur(12px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -80, filter: 'blur(6px)' },
  },
  '/analytics': {
    initial: { opacity: 0, x: 120, filter: 'blur(8px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -120, filter: 'blur(8px)' },
  },
  '/inspect': {
    initial: { opacity: 0, y: -60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, rotateY: 15, scale: 0.9 },
  },
  '/reports': {
    initial: { opacity: 0, scale: 0.9, rotateX: -5 },
    animate: { opacity: 1, scale: 1, rotateX: 0 },
    exit: { opacity: 0, y: 60, filter: 'blur(10px)' },
  },
  '/restaurant': {
    initial: { opacity: 0, rotateY: -8, scale: 0.95 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    exit: { opacity: 0, rotateY: 8, scale: 0.95 },
  },
};

const defaultTransition: TransitionConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) return <>{children}</>;

  const config = transitionConfigs[pathname] || defaultTransition;

  return (
    <motion.div
      key={pathname}
      initial={config.initial}
      animate={config.animate}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}
