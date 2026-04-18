'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/MagneticButton';
import AnimatedCounter from '@/components/AnimatedCounter';

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <main className="selection:bg-red-500/30 overflow-hidden">
      {/* ============================================
          HERO SECTION — 3D WebGL + Parallax
          ============================================ */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--surface)]"
      >
        {/* 3D Scene Background */}
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-red-500/20 to-amber-400/10 animate-pulse blur-2xl" />
          </div>
        }>
          <HeroScene />
        </Suspense>

        {/* Particle Grid Overlay */}
        <div className="absolute inset-0 particle-bg z-[2]" />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-4 max-w-5xl"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-mono text-stone-400 text-xs uppercase tracking-widest">
              Stark Intelligence Interface • v3.0
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-8xl font-black tracking-[-0.04em] text-[var(--on-surface)] mb-8 leading-[0.88]"
          >
            Elevate Your Food <br />
            <span className="text-shimmer">
              Security Experience
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            The next evolution in global safety. Real-time pathogen detection
            and intelligence powered by neural-link analytics.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <MagneticButton>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-500 to-amber-400 text-[#0a0606] font-bold rounded-2xl shadow-[0_0_40px_rgba(255,77,77,0.3)] hover:shadow-[0_0_60px_rgba(255,77,77,0.5)] transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Enter Platform</span>
                <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link
                href="/inspect"
                className="group inline-flex items-center gap-3 px-10 py-4 glass-panel text-stone-200 font-bold rounded-2xl hover:border-red-500/30 transition-all duration-500"
              >
                AI Food Inspector
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Trusted by badges */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-16 flex items-center justify-center gap-8 opacity-40"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Trusted by</span>
            {['WHO', 'FDA', 'FSSAI', 'EU Safety'].map((org) => (
              <span key={org} className="font-mono text-xs text-stone-500 border border-stone-800 rounded-full px-4 py-1.5">{org}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-600">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border-2 border-stone-700 rounded-full flex justify-center pt-1"
          >
            <div className="w-1 h-2 bg-red-500 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ============================================
          INTELLIGENCE BENTO GRID — Scroll Animated
          ============================================ */}
      <section className="py-32 px-8 bg-[var(--surface-container-low)] relative">
        <div className="absolute inset-0 particle-bg" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="max-w-7xl mx-auto relative z-10"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-20">
            <span className="font-mono text-red-500 text-sm font-bold tracking-widest uppercase mb-3 block">
              01 // Real-time Intelligence
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-[var(--on-surface)] tracking-tight leading-[0.95]">
              The Global <span className="text-shimmer">Pulse.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Large feature card */}
            <motion.div
              variants={slideInLeft}
              className="md:col-span-8 glass-panel-lg rounded-2xl p-10 relative overflow-hidden group cursor-pointer min-h-[360px]"
            >
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-6">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Live Stream
                </span>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Neural Data Stream</h3>
                <p className="text-stone-400 max-w-md text-lg leading-relaxed">
                  Aggregating billions of telemetry points from farm-to-table sensors globally to predict outbreaks before they occur.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-30 group-hover:scale-110 group-hover:opacity-50 transition-all duration-1000">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover" alt="Data visualization" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5LvHPmiB5vRAII8CMHbAxiDk-A5ybKOGs_Bbnbr9w2x26hWY0Wj6TrA8KuSyF5QFpY9CnjdlKpqZtMK4kgqqA8Kr41BbRXnB6uxUP1uyLZ5lGbLJ6L6K-Q9lg7APVvFTtdvuvigLgQ2FCez9NZ9ZeRqcAZtT9W0CS6J3eFtJJBmnIWLj_duP6AfkITiHtwi1pejVUwPCgmEvTNVNXPP4BLXRla96KXp4DLTtnDQf3zhP_ZpUVSd98Wj7W6LdZJPRnecWPMEw7wtw" />
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
            </motion.div>

            {/* Stats card */}
            <motion.div
              variants={slideInRight}
              className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-between border-l-4 border-red-500 group"
            >
              <div>
                <span className="material-symbols-outlined text-red-500 text-4xl mb-4">analytics</span>
                <h3 className="text-xl font-bold mb-2">Early Warning</h3>
                <p className="text-stone-400 text-sm">Automated protocol triggers for supply chain isolation.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex justify-between items-end">
                  <AnimatedCounter value="99.98%" label="Uptime Precision" />
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-green-500">trending_up</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mini stat */}
            <motion.div variants={fadeUp} custom={3} className="md:col-span-4 glass-panel rounded-2xl p-6 group hover:border-red-500/20 transition-all">
              <div className="font-mono text-xs text-red-500 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                ACTIVE THREATS
              </div>
              <AnimatedCounter value="0.00" label="Contained Systems" />
              <div className="mt-4 h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '20%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-gradient-to-r from-red-500 to-amber-400 shadow-[0_0_12px_rgba(255,77,77,0.6)] rounded-full"
                />
              </div>
            </motion.div>

            {/* Secure Hub */}
            <motion.div variants={fadeUp} custom={4} className="md:col-span-8 glass-panel rounded-2xl p-8 flex items-center justify-between overflow-hidden relative group">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Secure Communication Hub</h3>
                <p className="text-stone-400 text-sm max-w-sm">Encrypted communication layer for verified food safety inspectors worldwide.</p>
              </div>
              <div className="w-48 h-full bg-amber-400/5 rounded-full absolute -right-12 blur-3xl group-hover:bg-amber-400/10 transition-all duration-1000" />
              <span className="material-symbols-outlined text-6xl text-amber-400/15 group-hover:text-amber-400/30 transition-colors duration-700">verified_user</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============================================
          PATHOGEN DETECTION — Parallax Section
          ============================================ */}
      <section className="py-32 px-8 bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-500/[0.03] rounded-full blur-[120px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10"
        >
          <motion.div variants={slideInLeft} className="flex-1 order-2 md:order-1">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full animate-pulse" />
              <div className="relative glass-panel-lg rounded-full p-8 border-red-500/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-contain relative z-10 animate-float" alt="Microscopic pathogen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5oHWC70TWpkE5K5z_oVuCdzOwmeTEptuyfqj8TxFxJwg7hO64iRJjdTZMYjJa9fYcHvJSOB_YYVikxodrktaTaMhEza0dP7hfafqSdccmrpzvx_Mq9jrX-CTwKfTQI_1KtDeinby9eYxSBUadyAcXZNNDgTEf7GciagM_tjiVi5E46X8rVLqGUDmtrPF3JdaViZ3btMd4iOPLNiFKOKXpWKJoj9eZGVoQF9zX9JfIQEjLYpTXXSKoncvTjREv5GShOo-DpAHqFJg" />
              </div>
              {/* Floating alert badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 -right-4 bg-[#1a0606]/80 backdrop-blur-xl border border-red-500/50 px-4 py-2 rounded-full flex items-center gap-2 z-20 shadow-[0_0_20px_rgba(255,77,77,0.2)]"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="font-mono text-red-400 text-[10px] font-bold uppercase">Critical Threat</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={slideInRight} className="flex-1 order-1 md:order-2">
            <span className="font-mono text-red-500 text-sm font-bold tracking-widest uppercase mb-3 block">02 // Pathogen Detection</span>
            <h2 className="text-4xl md:text-6xl font-black text-[var(--on-surface)] tracking-tight mb-6 leading-[0.95]">
              Unrivaled <span className="text-shimmer">Velocity.</span>
            </h2>
            <p className="text-lg text-stone-400 mb-10 leading-relaxed">
              Our proprietary Bio-Link processors accelerate identification cycles from days to minutes.
            </p>
            <div className="space-y-4">
              {[
                { icon: 'speed', value: '2-6 Hours', label: 'Total Identification Time', color: 'red' },
                { icon: 'science', value: '99.9%', label: 'Molecular Sensitivity', color: 'amber' },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-6 p-5 rounded-2xl glass-panel cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined text-${item.color}-500 text-3xl`}>{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--on-surface)]">{item.value}</div>
                    <div className="text-xs text-stone-500 font-mono uppercase tracking-wider">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          STATS COUNTER BAR
          ============================================ */}
      <section className="py-20 px-8 bg-[var(--surface-container-lowest)] border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: '142+', label: 'Member Nations' },
            { val: '12000', label: 'Enterprise Partners' },
            { val: '45000000', label: 'Daily Inspections' },
            { val: '0.5s', label: 'Sync Latency' },
          ].map((s) => (
            <div key={s.label} className="text-center p-6">
              <AnimatedCounter value={s.val} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          CTA — Global Safety
          ============================================ */}
      <section className="py-32 px-8 bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full h-full object-cover" alt="World map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDmK0byDJncGtjNJ_CtD1L_c-Hc-5FYfIpg-k4sdOsMeecbWb_g7s9N30qb_G5D3V1wSqkJHzywIZe8p6kUZAPBj24h41QleIXf00V_40-1ffhB8OHwh6KRliTadEma7mttRG2r99Z82phXfDJHodetR8sn-ySrLo63Kzr9iUCB_vsST9PtF72MJ4Qg4XstVS6-prnYc9NOlliF_64ZSf0joOhUDq8qBB9gWtktOz44CqU4j59NmPwyyZZl89x44lWFGDzOgiujow" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.span variants={fadeUp} custom={0} className="font-mono text-amber-400 text-sm font-bold tracking-widest uppercase mb-4 block">03 // Global Safety Network</motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-black text-[var(--on-surface)] mb-8 tracking-tight">
            United for <span className="text-shimmer">Resilience.</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-xl text-stone-400 mb-16 font-light">
            Join an elite consortium of governments and producers connected through the FoodShield Safety Protocol.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <MagneticButton>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-14 py-5 bg-gradient-to-r from-red-500 to-amber-400 text-[#0a0606] font-black rounded-2xl shadow-[0_0_40px_rgba(255,77,77,0.4)] hover:shadow-[0_0_80px_rgba(255,77,77,0.5)] transition-all duration-500 text-lg"
              >
                ENTER COMMAND CENTER
                <span className="material-symbols-outlined">rocket_launch</span>
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-[#030202] w-full py-16 border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400 mb-4">FoodShield</div>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xs">Empowering the global food chain with military-grade detection and prediction systems.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">Protocols</h4>
            {['Privacy Protocol', 'System Status', 'API Docs', 'Security'].map((l) => (
              <a key={l} className="text-stone-600 hover:text-amber-400 transition-colors text-sm" href="#">{l}</a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">Resources</h4>
            {['Global Contact', 'Whitepaper', 'Compliance', 'Partner Portal'].map((l) => (
              <a key={l} className="text-stone-600 hover:text-amber-400 transition-colors text-sm" href="#">{l}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-8 mt-12 pt-8 border-t border-white/[0.03] flex justify-between items-center">
          <p className="text-stone-700 font-mono text-[10px] uppercase tracking-widest">© 2026 FoodShield Intelligence. ForgeX | CMR Institute of Technology.</p>
          <div className="flex gap-4">
            {['GitHub', 'LinkedIn', 'X'].map((s) => (
              <a key={s} className="text-stone-700 hover:text-red-500 transition-colors text-xs font-mono" href="#">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
