'use client';

import AppNavbar from '@/components/AppNavbar';
import AppFooter from '@/components/AppFooter';
import TiltCard from '@/components/TiltCard';
import FoodParticles from '@/components/FoodParticles';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function DashboardPage() {
  return (
    <>
      <AppNavbar />
      <FoodParticles count={15} />

      <motion.main
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pt-28 px-8 max-w-[1440px] mx-auto w-full pb-12 flex-grow"
      >
        {/* Hero Stats */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: 'emergency', label: 'Global Impact', value: '600M', desc: 'foodborne cases/year detected globally', color: 'red', borderColor: 'var(--primary)' },
            { icon: 'speed', label: 'Response Time', value: '2-6 hours', desc: 'average threat detection window', color: 'amber', borderColor: 'var(--secondary)' },
            { icon: 'neurology', label: 'Intelligence', value: '16 Active', desc: 'ML algorithms monitoring supply chains', color: 'yellow', borderColor: '#ffd700' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i}>
              <TiltCard tiltAmount={6}>
                <div className={`glass-panel p-8 rounded-2xl border-l-4 transition-all group`} style={{ borderLeftColor: stat.borderColor }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`material-symbols-outlined text-${stat.color}-500 text-4xl group-hover:scale-110 transition-transform`}>{stat.icon}</span>
                    <span className={`font-mono text-${stat.color}-500 text-xs tracking-widest uppercase`}>{stat.label}</span>
                  </div>
                  <h3 className="text-4xl font-extrabold text-[var(--on-surface)] mb-2">{stat.value}</h3>
                  <p className="text-stone-400 font-medium text-sm">{stat.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.section>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Center Interactive Map */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <TiltCard tiltAmount={3}>
                <div className="glass-panel-lg rounded-2xl p-6 h-[600px] relative overflow-hidden group" style={{ boxShadow: 'inset 0 0 100px rgba(255,77,77,0.04)' }}>
                  <div className="absolute top-6 left-6 z-20">
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--on-surface)]">National Risk Perimeter</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">Live Threat Mapping: India</span>
                    </div>
                  </div>
                  <div className="w-full h-full bg-[var(--surface-container-low)] rounded-xl relative overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover grayscale brightness-50 opacity-40" alt="Map of India" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8kXSOCYwl2KqnGgoTyKEkIRGBtKC8fjp8F_IUkOUMcQEKVO_ijC667Ygys861XRY4uCJ5tOLa4U7V1NMY8crtSt3wKE3QUQxHaqymY9OolOJyzF7JLu3EStf-_HdArAx8cYTOQR-sKIPA2ogUeeGCDo_BRD4zw7S2RHqlMWjgfXrdbMgAVeEjNFai85LoA5C2RQAzBfLBCZML2R6jM-op0uqwvEF4FH_psRfJ_mbVAK2QdZiujs9TX0NH3Ha-OUISZ0dgh2t_ZbI" />
                    {/* Pulsing Hotspots */}
                    {[
                      { top: '28%', left: '48%', title: 'Delhi', delay: 0 },
                      { top: '62%', left: '33%', title: 'Mumbai', delay: 0.5 },
                      { top: '79%', left: '48%', title: 'Bangalore', delay: 1 },
                      { top: '81%', left: '53%', title: 'Chennai', delay: 1.5 },
                    ].map((dot) => (
                      <motion.div
                        key={dot.title}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: dot.delay + 0.5, type: 'spring' }}
                        className="absolute z-30 group/dot cursor-pointer"
                        style={{ top: dot.top, left: dot.left }}
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-glow shadow-[0_0_20px_4px_rgba(255,77,77,0.8)]" />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a0606]/90 backdrop-blur-md px-3 py-1 rounded-lg opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap">
                          <span className="text-[10px] font-mono text-red-400 font-bold">{dot.title}</span>
                        </div>
                      </motion.div>
                    ))}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                      <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        <div className="text-xs font-mono">
                          <div className="text-[var(--on-surface)]">DELHI SECTOR</div>
                          <div className="text-red-500">CRITICAL THREAT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Recent Intelligence Feed */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="glass-panel rounded-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">rss_feed</span>
                  Recent Intelligence Feed
                </h3>
                <span className="text-xs font-mono text-stone-500">Update: 1m ago</span>
              </div>
              <div className="overflow-y-auto max-h-[300px] p-2 space-y-1">
                {[
                  { name: 'Spicy Fusion Kitchen', symptoms: 'NAUSEA, ABDOMINAL CRAMPS', time: '14:22 IST', severity: 3, color: 'var(--error)' },
                  { name: 'Green Garden Bistro', symptoms: 'MILD DIZZINESS', time: '13:45 IST', severity: 1, color: 'var(--secondary)' },
                  { name: 'Urban Taco Truck', symptoms: 'ACUTE GASTROENTERITIS', time: '12:10 IST', severity: 2, color: 'var(--error)' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.15 }}
                    className="p-4 hover:bg-white/[0.03] transition-all rounded-xl flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: item.color }} />
                      <div>
                        <h4 className="font-bold text-[var(--on-surface)] group-hover:text-red-400 transition-colors">{item.name}</h4>
                        <p className="text-xs text-stone-500 font-mono">SYMPTOMS: {item.symptoms}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--on-surface)]">{item.time}</div>
                      <div className="flex justify-end gap-1 mt-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i < item.severity ? '' : 'bg-stone-800'}`} style={i < item.severity ? { background: item.color } : {}} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar: High Risk Analysis */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">biotech</span>
                High Risk Analysis
              </h3>
              <div className="space-y-6">
                {[
                  { name: "Joe's Diner", tag: 'Salmonella Detection', pct: 92, color: 'var(--error)', tagBg: 'rgba(255,107,53,0.1)' },
                  { name: 'Biggies Burger', tag: 'Contamination Prob.', pct: 85, color: 'var(--secondary)', tagBg: 'rgba(245,166,35,0.1)' },
                  { name: 'Burger King', tag: 'E. coli Threat', pct: 78, color: 'var(--secondary)', tagBg: 'rgba(245,166,35,0.1)' },
                  { name: "McDonald's", tag: 'Hygiene Variance', pct: 62, color: 'var(--tertiary)', tagBg: 'rgba(255,215,0,0.1)' },
                  { name: 'KFC', tag: 'Nominal Drift', pct: 45, color: 'var(--secondary)', tagBg: 'rgba(245,166,35,0.1)' },
                ].map((r, idx) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-bold text-[var(--on-surface)] group-hover:text-red-400 transition-colors">{r.name}</h4>
                        <span className="text-[10px] font-mono tracking-tight uppercase px-2 py-0.5 rounded" style={{ color: r.color, background: r.tagBg }}>{r.tag}</span>
                      </div>
                      <span className="text-xl font-black font-mono" style={{ color: r.color }}>{r.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.pct}%` }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ background: r.color, boxShadow: `0 0 10px ${r.color}` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,77,77,0.3)] hover:shadow-[0_0_40px_rgba(255,77,77,0.5)] transition-shadow"
              >
                <span className="material-symbols-outlined">shield</span>
                INITIATE SITE AUDIT
              </motion.button>
            </motion.div>

            {/* Critical Alert Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 scan-line"
            >
              <div className="relative z-10">
                <h4 className="font-mono text-red-500 text-[10px] tracking-widest uppercase mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  Critical Shield Alert
                </h4>
                <p className="text-sm text-[var(--on-surface)] font-medium leading-relaxed">
                  Cluster detected in South Bangalore. Cross-referencing poultry supply lines for common pathogens.
                </p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-red-500/10 text-8xl">radar</span>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <AppFooter />
    </>
  );
}
