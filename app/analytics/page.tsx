'use client';

import AppNavbar from '@/components/AppNavbar';
import AppFooter from '@/components/AppFooter';
import TiltCard from '@/components/TiltCard';
import FoodParticles from '@/components/FoodParticles';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import CustomSelect from '@/components/CustomSelect';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function AnimatedSVGChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="relative h-72 w-full">
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-mono text-stone-600 pointer-events-none">
        <span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span>
      </div>
      <svg className="w-full h-full pt-2 pl-8 pb-8" preserveAspectRatio="none" viewBox="0 0 1000 300">
        <defs>
          <linearGradient id="grad-alpha" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-beta" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f5a623" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 75, 150, 225, 300].map((y) => (
          <line key={y} x1="0" x2="1000" y1={y} y2={y} stroke="rgba(255,77,77,0.03)" strokeWidth="1" />
        ))}
        {/* Animated fill areas */}
        <motion.path
          d="M0,250 Q100,200 200,220 T400,150 T600,100 T800,120 T1000,50 L1000,300 L0,300 Z"
          fill="url(#grad-alpha)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.25 } : {}}
          transition={{ duration: 1.5 }}
        />
        <motion.path
          d="M0,280 Q150,260 300,240 T500,200 T700,220 T900,180 T1000,190 L1000,300 L0,300 Z"
          fill="url(#grad-beta)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.15 } : {}}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        {/* Animated line draw */}
        <motion.path
          d="M0,250 Q100,200 200,220 T400,150 T600,100 T800,120 T1000,50"
          fill="none"
          stroke="#ff4d4d"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,77,77,0.4))' }}
        />
        <motion.path
          d="M0,280 Q150,260 300,240 T500,200 T700,220 T900,180 T1000,190"
          fill="none"
          stroke="#f5a623"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(245,166,35,0.4))' }}
        />
        {/* Data points appear after lines */}
        {[
          { cx: 200, cy: 220, delay: 1.5, color: '#ff4d4d' },
          { cx: 600, cy: 100, delay: 1.8, color: '#ff4d4d' },
          { cx: 500, cy: 200, delay: 2.0, color: '#f5a623' },
        ].map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.cx}
            cy={pt.cy}
            fill={pt.color}
            initial={{ r: 0 }}
            animate={isInView ? { r: 5 } : {}}
            transition={{ delay: pt.delay, type: 'spring', stiffness: 300 }}
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-8 right-0 flex justify-between font-mono text-[10px] uppercase text-stone-600">
        <span>Week 01</span><span>Week 02</span><span>Week 03</span><span>Week 04</span><span>Week 05</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [geoNode, setGeoNode] = useState('Global Cluster');

  return (
    <>
      <AppNavbar />
      <FoodParticles count={12} />

      <motion.main
        initial={{ opacity: 0, x: 80, filter: 'blur(6px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto min-h-screen relative z-10"
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-red-500 mb-2 block">System Analytics Engine</span>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[var(--on-surface)]">
              Outbreak <span className="text-shimmer">Intelligence</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-4 glass-panel p-2.5 rounded-2xl">
            <div className="flex flex-col px-4 py-1 border-r border-white/5 z-20">
              <span className="font-mono text-[10px] uppercase text-stone-500 mb-1">Time Range</span>
              <CustomSelect
                options={['Last 30 Days', 'Quarter to Date', 'Year to Date', 'All Time']}
                value={timeRange}
                onChange={setTimeRange}
                className="w-40"
              />
            </div>
            <div className="flex flex-col px-4 py-1 border-r border-white/5 z-10">
              <span className="font-mono text-[10px] uppercase text-stone-500 mb-1">Geographic Node</span>
              <CustomSelect
                options={['Global Cluster', 'APAC Delta', 'EMEA Core', 'NA Primary']}
                value={geoNode}
                onChange={setGeoNode}
                className="w-44"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl self-center hover:shadow-[0_0_20px_rgba(255,77,77,0.4)] transition-all text-sm"
            >
              Generate Report
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Outbreak Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-8"
          >
            <TiltCard tiltAmount={3}>
              <div className="glass-panel-lg rounded-2xl p-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-[var(--on-surface)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">monitoring</span>
                    Outbreak Propagation Trends
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,77,77,0.6)]" />
                      <span className="font-mono text-xs text-stone-400">Pathogen Alpha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
                      <span className="font-mono text-xs text-stone-400">Viral Beta</span>
                    </div>
                  </div>
                </div>
                <AnimatedSVGChart />
              </div>
            </TiltCard>
          </motion.div>

          {/* AI Engine Efficiency */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--on-surface)] mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">precision_manufacturing</span>
                AI Engine Efficiency
              </h3>
              <div className="space-y-8">
                {[
                  { label: 'Detection Speed', value: '0.04s', filled: 11, total: 12, color: '#ff4d4d' },
                  { label: 'False Positive Mitigation', value: '99.2%', filled: 12, total: 12, color: '#ff4d4d' },
                  { label: 'Blockchain Hash Latency', value: '1.2ms', filled: 5, total: 12, color: '#f5a623' },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-3">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-stone-400">{metric.label}</span>
                      <span className="font-bold" style={{ color: metric.color }}>{metric.value}</span>
                    </div>
                    <div className="h-2 w-full flex gap-0.5">
                      {[...Array(metric.total)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                          className="flex-1 rounded-sm origin-left"
                          style={{
                            background: i < metric.filled ? metric.color : 'rgba(255,255,255,0.05)',
                            boxShadow: i < metric.filled ? `0 0 4px ${metric.color}` : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-500 animate-pulse">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <div>
                  <p className="text-[var(--on-surface)] font-bold text-sm">Turbo Mode Active</p>
                  <p className="text-[10px] text-stone-500">Processing 4.2M packets/sec</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Geographic Risk Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-12 lg:col-span-7 glass-panel-lg rounded-2xl overflow-hidden min-h-[450px] flex flex-col group"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[var(--on-surface)] flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">public</span>
                Risk Heatmap: Global Distribution
              </h3>
              <div className="flex items-center gap-2 bg-red-500/5 px-4 py-1.5 rounded-full border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-[10px] text-red-400 font-bold tracking-widest uppercase">Live Delta Feed</span>
              </div>
            </div>
            <div className="flex-grow relative bg-[#050303] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="World Map" className="w-full h-full object-cover opacity-20 mix-blend-screen scale-110 group-hover:scale-100 transition-transform duration-[10s]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAonWmMtAU0JRmEQvuKtAF8qkrvYStj-UVdbwLfSPx-qrmoBKkfqEs3rYY_o1mKdXaPfLF43IBcnuMXnDMHZZQW03uty_FIaq-787KURyJjrP6jDsXTflaUzxVMKtrglqSY27K8SJCPI-1Jk-uBlmsfpfw6VyHrB-H1B1UxhQZuu-0AOcc_dimYxSD4izKRMbguRzXoEBPi2I99TRTN-0LsL0ijCqfPdFjUbF6aa69Z11GSLyHDt1Nv3hbDQUt08mSXZxYzgCVvMVY" />
              {/* Hotspots */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="absolute top-[35%] left-[22%]"
              >
                <div className="w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#f5a623] animate-pulse" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute top-[42%] left-[48%]"
              >
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_#ff4d4d]" />
              </motion.div>
              <div className="absolute bottom-8 left-8 glass-panel p-5 rounded-xl max-w-[200px]">
                <p className="font-mono text-[10px] uppercase text-stone-500 mb-3 tracking-widest font-bold">Protocol Status</p>
                <ul className="space-y-3">
                  {[
                    { name: 'Seattle Delta-9', color: 'var(--secondary)', status: 'Critical', statusColor: 'var(--error)' },
                    { name: 'Berlin Logistics', color: 'var(--primary)', status: 'Stable', statusColor: '#22c55e' },
                    { name: 'Tokyo Node', color: 'var(--outline)', status: 'Offline', statusColor: 'var(--outline)' },
                  ].map((p) => (
                    <li key={p.name} className="flex items-center justify-between gap-4" style={p.status === 'Offline' ? { opacity: 0.5 } : {}}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-xs text-[var(--on-surface)]">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: p.statusColor }}>{p.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right Cards */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
            {/* Shield Integrity */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel rounded-2xl p-6 flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase text-stone-500 tracking-widest">Shield Integrity</p>
                <h4 className="text-4xl font-black text-red-500 animate-counter-glow">99.98%</h4>
                <p className="text-[10px] text-stone-600 uppercase tracking-tighter">Maximum security protocol engaged</p>
              </div>
              <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-red-500/10" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="6" />
                  <motion.circle
                    className="text-red-500"
                    cx="50" cy="50" fill="none" r="45" stroke="currentColor"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    whileInView={{ strokeDashoffset: 5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    strokeWidth="6"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255,77,77,0.6))' }}
                  />
                </svg>
                <span className="material-symbols-outlined text-3xl text-red-500 group-hover:scale-110 transition-transform">shield</span>
              </div>
            </motion.div>

            {/* Active Threats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-xs uppercase text-stone-500 tracking-widest mb-1">Active Threats</p>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-4xl font-black text-[var(--on-surface)]">1,248</h4>
                    <span className="text-green-500 text-xs font-bold">-12% ↓</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-16 mt-4">
                {[50, 66, 80, 50, 75, 100, 33].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="flex-1 rounded-t"
                    style={{ background: h === 100 ? 'var(--primary)' : h >= 75 ? 'rgba(255,77,77,0.4)' : 'var(--surface-container-highest)' }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Emergency Response */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer border-amber-400/10 hover:border-amber-400/30 transition-colors"
            >
              <div className="absolute top-0 right-0 p-1 bg-amber-400/10 border-b border-l border-amber-400/20 rounded-bl-lg">
                <span className="text-[8px] font-bold text-amber-400 tracking-widest uppercase px-2">Priority 1</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-400/20">
                    <span className="material-symbols-outlined text-3xl animate-pulse">warning</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[var(--on-surface)]">Emergency Response</h4>
                    <p className="text-sm text-stone-400">2 critical nodes require immediate override</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-red-500/20 transition-all">
                  <span className="material-symbols-outlined text-stone-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <AppFooter />
    </>
  );
}
