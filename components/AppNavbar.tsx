'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/analytics', label: 'Analytics', icon: 'monitoring' },
  { href: '/inspect', label: 'Inspect', icon: 'search_insights' },
  { href: '/reports', label: 'Reports', icon: 'description' },
  { href: '/restaurant', label: 'Restaurant Portal', icon: 'restaurant' },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as Element).closest('.popover-container')) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#080505]/95 backdrop-blur-2xl shadow-[0_4px_60px_rgba(0,0,0,0.8)]'
            : 'bg-transparent backdrop-blur-md'
        }`}
        style={{ height: scrolled ? '64px' : '76px' }}
      >
        <div className="flex justify-between items-center px-8 h-full w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight group relative"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400 group-hover:from-amber-400 group-hover:to-red-500 transition-all duration-500">
                FoodShield
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-amber-400 group-hover:w-full transition-all duration-500" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] rounded-full px-2 py-1.5 border border-white/[0.04]">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    prefetch={true}
                    key={item.href}
                    href={item.href}
                    className="relative px-5 py-2 rounded-full text-sm font-medium tracking-tight transition-all duration-300"
                  >
                    {/* Sliding pill background */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-amber-400/10 rounded-full border border-red-500/30"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-2 ${
                        isActive
                          ? 'text-red-400'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 popover-container relative">
            {/* Notification bell with popover */}
            <div className="relative">
              <button 
                onClick={() => setActivePopover(activePopover === 'notifications' ? null : 'notifications')}
                className={`relative text-stone-400 hover:text-amber-400 transition-all p-2.5 rounded-xl group ${activePopover === 'notifications' ? 'bg-white/10 text-amber-400' : 'hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <AnimatePresence>
                {activePopover === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-panel border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-4"
                  >
                    <h4 className="font-mono text-[10px] uppercase text-stone-500 mb-3 tracking-widest font-bold">System Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-red-500 text-lg">warning</span>
                        <div>
                          <p className="text-sm font-bold text-[var(--on-surface)]">Pathogen Spike Detected</p>
                          <p className="text-xs text-stone-400">Sector 7 reported elevated E.coli risk.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-amber-400 text-lg">description</span>
                        <div>
                          <p className="text-sm font-bold text-[var(--on-surface)]">New Audit Generated</p>
                          <p className="text-xs text-stone-400">The Gilded Fork inspection complete.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings popover */}
            <div className="relative">
              <button 
                onClick={() => setActivePopover(activePopover === 'settings' ? null : 'settings')}
                className={`text-stone-400 hover:text-amber-400 transition-all p-2.5 rounded-xl ${activePopover === 'settings' ? 'bg-white/10 text-amber-400' : 'hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
              <AnimatePresence>
                {activePopover === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 glass-panel border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                  >
                    <div className="p-2">
                       <button className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                         <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> System Config
                       </button>
                       <button className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                         <span className="material-symbols-outlined text-[18px]">public</span> API Endpoints
                       </button>
                       <button className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                         <span className="material-symbols-outlined text-[18px]">palette</span> Theme Preferences
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setActivePopover(activePopover === 'profile' ? null : 'profile')}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-amber-400 flex items-center justify-center text-[#0a0606] font-bold text-sm cursor-pointer hover:scale-110 transition-transform"
              >
                FS
              </div>
              <AnimatePresence>
                {activePopover === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-panel border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-bold text-[var(--on-surface)]">Admin Node</p>
                      <p className="text-xs text-stone-400 font-mono">ID: FS-9284-AX</p>
                    </div>
                    <div className="p-2 space-y-1">
                       <button className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                         <span className="material-symbols-outlined text-[18px]">manage_accounts</span> Account
                       </button>
                       <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-3 mt-2">
                         <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out Node
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-stone-400 hover:text-stone-200 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#080505]/98 backdrop-blur-3xl flex flex-col items-center justify-center gap-6 lg:hidden"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-stone-400">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-3xl font-bold tracking-tight ${
                    pathname === item.href ? 'text-red-400' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
