'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  label: string;
  duration?: number;
}

export default function AnimatedCounter({ value, label, duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const numericPart = value.replace(/[^0-9.]/g, '');
    const suffix = value.replace(/[0-9.]/g, '');
    const target = parseFloat(numericPart);

    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const startTime = Date.now();
    const durationMs = duration * 1000;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (target >= 100) {
        setDisplayValue(Math.round(current).toLocaleString() + suffix);
      } else if (target >= 1) {
        setDisplayValue(current.toFixed(1) + suffix);
      } else {
        setDisplayValue(current.toFixed(2) + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-4xl md:text-5xl font-black animate-counter-glow">{displayValue}</div>
      <div className="text-xs font-mono uppercase text-stone-500 tracking-widest mt-1">{label}</div>
    </motion.div>
  );
}
