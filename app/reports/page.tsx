'use client';

import AppNavbar from '@/components/AppNavbar';
import AppFooter from '@/components/AppFooter';
import FoodParticles from '@/components/FoodParticles';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CustomSelect from '@/components/CustomSelect';

export default function ReportsPage() {
  const [riskLevel, setRiskLevel] = useState('Risk Level');

  return (
    <>
      <AppNavbar />
      <FoodParticles count={10} />

      <motion.main
        initial={{ opacity: 0, scale: 0.95, rotateX: -3 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1200 }}
        className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto min-h-screen flex flex-col lg:flex-row gap-8 relative z-10"
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-red-500 mb-1 block">Active Surveillance Engine</span>
              <h1 className="text-5xl font-black tracking-tighter">
                Audit <span className="text-shimmer">Intelligence</span>
              </h1>
              <p className="text-stone-400 text-sm mt-2 font-mono uppercase tracking-widest">Active Surveillance & Pathogen Tracking</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-panel px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold text-stone-300 hover:border-amber-400/30 transition-colors"
              >
                <span className="material-symbols-outlined text-amber-400">download</span>
                Export CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-[0_0_20px_rgba(255,77,77,0.3)]"
              >
                <span className="material-symbols-outlined">add_circle</span>
                New Audit
              </motion.button>
            </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">search</span>
              <input className="w-full bg-[var(--surface-container-lowest)] border-none rounded-xl py-3.5 pl-10 pr-4 text-[var(--on-surface)] placeholder:text-stone-600 focus:ring-1 focus:ring-red-500/50 focus:shadow-[0_0_8px_rgba(255,77,77,0.3)] transition-shadow" placeholder="Search by Restaurant, Pathogen, or Region..." type="text" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <CustomSelect
                options={['Risk Level', 'Critical', 'Elevated', 'Stable']}
                value={riskLevel}
                onChange={setRiskLevel}
                className="w-full md:w-40 z-20"
              />
              <button className="p-3 glass-panel rounded-xl hover:border-red-500/20 transition-colors">
                <span className="material-symbols-outlined text-stone-400">tune</span>
              </button>
            </div>
          </motion.section>

          {/* Report Cards — Timeline cascade */}
          <section className="space-y-4">
            {[
              { name: 'The Gilded Fork', location: 'Downtown Core, Sector 7', risk: 'Critical Risk', riskColor: 'var(--error)', pathogen: 'Salmonella', desc: 'Nausea, Pyrexia reported in 12+ patrons.', date: '12 OCT 2024 • 14:32', icon: 'warning', borderColor: 'var(--error)', emoji: '🍴' },
              { name: 'Oceanic Deli', location: 'Marina District, Pier 11', risk: 'Elevated Risk', riskColor: '#ffd700', pathogen: 'E. Coli', desc: 'Abdominal cramping, isolated incidents.', date: '12 OCT 2024 • 09:15', icon: 'biotech', borderColor: '#ffd700', emoji: '🦐' },
              { name: 'Green Garden Bistro', location: 'Suburban Zone C', risk: 'Resolved', riskColor: '#22c55e', pathogen: 'Norovirus', desc: 'Sanitation audit passed. Incident closed.', date: '11 OCT 2024 • 18:40', icon: 'verified', borderColor: '#22c55e', dimmed: true, emoji: '🥗' },
            ].map((entry, idx) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className={`group glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start cursor-pointer ${entry.dimmed ? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}
                style={{ borderLeft: `4px solid ${entry.borderColor}` }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-[var(--surface-container-low)]" style={{ borderColor: entry.borderColor }}>
                  {entry.emoji}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-[var(--on-surface)] group-hover:text-red-400 transition-colors">{entry.name}</h4>
                    <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-full" style={{ color: entry.riskColor, background: `color-mix(in srgb, ${entry.riskColor} 15%, transparent)` }}>{entry.risk}</span>
                    <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-full bg-white/5 text-stone-400">{entry.pathogen}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {entry.location}
                  </div>
                  <p className="text-stone-400 text-sm">{entry.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                  <span className="font-mono text-[10px] text-stone-500">{entry.date}</span>
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Full Audit <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </section>
        </div>

        {/* Sidebar: Live Feed */}
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="glass-panel p-6 rounded-2xl sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm font-bold tracking-widest text-red-400 uppercase">Live Feed</span>
              </div>
              <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="text-stone-500 hover:text-stone-300">
                <span className="material-symbols-outlined">refresh</span>
              </motion.button>
            </div>
            <div className="space-y-6">
              {[
                { time: '2M AGO', title: 'Data Spike detected', desc: 'Unusual cluster in South Sector water supply.', color: 'var(--error)' },
                { time: '14M AGO', title: 'Audit Completed', desc: 'The Daily Roast sanitation verify success.', color: '#22c55e' },
                { time: '1H AGO', title: 'Incident Alert', desc: 'High-pathogen load reported at "Central Buffet".', color: 'var(--error)' },
                { time: '3H AGO', title: 'System Update', desc: 'Firmware updated on Regional Biosensors.', color: 'var(--secondary)' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.12 }}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: item.color }} />
                    {idx < 3 && <div className="w-0.5 flex-1 bg-stone-800" />}
                  </div>
                  <div className="pb-4">
                    <span className="font-mono text-[10px] text-stone-600 block mb-1">{item.time}</span>
                    <h4 className="font-bold text-sm text-[var(--on-surface)] group-hover:text-red-400 transition-colors">{item.title}</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 glass-panel text-stone-300 font-semibold rounded-xl hover:border-red-500/20 transition-colors text-sm"
            >
              VIEW SYSTEM LOGS
            </motion.button>
          </div>
        </motion.aside>
      </motion.main>
      <AppFooter />
    </>
  );
}
