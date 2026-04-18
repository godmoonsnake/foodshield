'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  icon?: string;
}

export default function CustomSelect({ options, value, onChange, className = '', icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-[var(--surface-container-lowest)] border border-white/5 hover:border-red-500/30 rounded-xl py-3 px-4 text-[var(--on-surface)] transition-colors focus:outline-none focus:ring-1 focus:ring-red-500/50"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="material-symbols-outlined text-stone-400 text-[18px]">{icon}</span>}
          <span className="font-semibold text-sm truncate">{value}</span>
        </div>
        <span className={`material-symbols-outlined text-stone-500 text-[18px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-xl border border-white/10 glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.8)] origin-top"
          >
            <div className="py-1 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                    value === option ? 'text-red-400 font-bold bg-red-500/5' : 'text-stone-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
