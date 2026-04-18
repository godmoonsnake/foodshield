'use client';

import AppNavbar from '@/components/AppNavbar';
import TiltCard from '@/components/TiltCard';
import FoodParticles from '@/components/FoodParticles';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';

interface IngredientAnalysis {
  ingredient: string;
  quantity: string;
  condition: string;
  visible_concerns: string;
  shelf_life: {
    base_safe_hours: number;
    adjusted_safe_hours: number;
    temperature_impact: string;
    humidity_impact: string;
    already_spoiled: boolean;
    safe_until: string;
  };
  risk: string;
  risk_color: string;
  pathogens_at_risk: string[];
  safety_notes: string;
}

interface AnalysisResult {
  timestamp: string;
  environmental_conditions: {
    temperature_c: number;
    humidity_percent: number;
    risk_level: string;
    note: string;
  };
  vision_analysis: {
    estimated_dish: string;
    overall_visual_safety: string;
    ai_immediate_concern: string | null;
  };
  ingredient_analysis: IngredientAnalysis[];
  overall_assessment: {
    estimated_dish: string;
    overall_visual_safety: string;
    risk_score_100: number;
    critical_window_hours: number;
    highest_risk_ingredient: string;
    highest_risk_level: string;
    all_pathogens_at_risk: string[];
    safe_to_eat_now: boolean;
    immediate_concern: string | null;
    physical_contaminants: string[];
    cross_contamination_risks: string[];
    packaging_issues: string[];
  };
  recommendations: Array<{
    priority: string;
    icon: string;
    message: string;
  }>;
}

type InspectMode = 'upload' | 'scanning' | 'results';

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'CRITICAL': return '#ff3b30';
    case 'HIGH': return '#ff9500';
    case 'MODERATE': return '#ffd700';
    case 'LOW': return '#22c55e';
    default: return '#ff9500';
  }
}

function getSafetyStatusColor(status: string): string {
  switch (status) {
    case 'DANGER': return '#ff3b30';
    case 'WARNING': return '#ff9500';
    case 'CAUTION': return '#ffd700';
    case 'SAFE': return '#22c55e';
    default: return '#ff9500';
  }
}

export default function InspectPage() {
  const [mode, setMode] = useState<InspectMode>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setMode('scanning');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/inspect-food', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setMode('results');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Analysis failed: ${msg}`);
      setMode('upload');
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleReset = () => {
    setMode('upload');
    setResult(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <AppNavbar />
      <FoodParticles count={10} />

      <motion.main
        initial={{ opacity: 0, y: -40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pt-28 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-[var(--on-surface)]">
            AI Food <span className="text-shimmer">Inspector</span>
          </h1>
          <p className="text-stone-400 font-mono uppercase tracking-widest text-sm">
            Upload any food image for instant AI contamination analysis
          </p>
        </motion.div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & Controls */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="glass-panel p-1.5 rounded-2xl flex items-center">
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold transition-all shadow-[0_0_15px_rgba(255,77,77,0.3)]">
                  Food Scanner
                </button>
                <button className="px-6 py-2.5 rounded-xl text-stone-400 hover:text-stone-200 transition-all font-semibold">
                  Barcode Scanner
                </button>
              </div>
            </motion.div>

            {/* Camera Viewfinder / Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <TiltCard tiltAmount={4}>
                <div
                  className="relative group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div
                    className="aspect-video glass-panel-lg rounded-2xl overflow-hidden relative flex items-center justify-center"
                    style={{ boxShadow: 'inset 0 0 10px rgba(255,77,77,0.08), 0 0 5px rgba(255,77,77,0.04)' }}
                  >
                    <AnimatePresence mode="wait">
                      {/* Upload State */}
                      {mode === 'upload' && !previewUrl && (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center gap-6 text-center px-8"
                        >
                          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse-glow">
                            <span className="material-symbols-outlined text-red-500 text-5xl">photo_camera</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[var(--on-surface)] mb-2">Drop Food Image Here</h3>
                            <p className="text-stone-500 text-sm font-mono">or click Upload Image below</p>
                          </div>
                          {error && (
                            <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl">
                              <p className="text-red-400 text-sm font-mono">{error}</p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Scanning State */}
                      {mode === 'scanning' && previewUrl && (
                        <motion.div
                          key="scanning"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full relative"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="Food being analyzed" className="w-full h-full object-cover opacity-80" src={previewUrl} />
                          {/* HUD Overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            {/* Scan line */}
                            <motion.div
                              animate={{ top: ['0%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"
                            />
                            {/* Viewfinder Corners */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-red-500/50" />
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-red-500/50" />
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-red-500/50" />
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-red-500/50" />
                            {/* Analysis Status */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
                                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                <div>
                                  <p className="text-[var(--on-surface)] font-bold">Analyzing with Gemini AI...</p>
                                  <p className="text-stone-500 text-xs font-mono">SCANNING FOR PATHOGENS & SPOILAGE</p>
                                </div>
                              </div>
                            </div>
                            {/* Telemetry */}
                            <div className="absolute bottom-12 right-12 text-right font-mono text-red-500/50 text-[10px] space-y-1">
                              <div>MODE: AI_VISION_SCAN</div>
                              <div>ENGINE: GEMINI_1.5_FLASH</div>
                              <div>STATUS: PROCESSING</div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Results State - Image with overlays */}
                      {mode === 'results' && previewUrl && result && (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full relative"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="Analyzed food" className="w-full h-full object-cover opacity-80" src={previewUrl} />
                          {/* HUD Overlays */}
                          <div className="absolute inset-0 pointer-events-none">
                            {/* Bounding Box */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2"
                              style={{ borderColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) + '99' }}
                            >
                              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4" style={{ borderColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }} />
                              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4" style={{ borderColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }} />
                              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4" style={{ borderColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }} />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4" style={{ borderColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }} />
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="absolute -top-10 left-0 px-3 py-1 flex items-center space-x-2 rounded-md shadow-[0_0_15px_rgba(255,77,77,0.5)]"
                                style={{ backgroundColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }}
                              >
                                <span className="material-symbols-outlined text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                                  {result.overall_assessment.safe_to_eat_now ? 'check_circle' : 'warning'}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-white uppercase">
                                  {result.overall_assessment.estimated_dish} — {result.overall_assessment.overall_visual_safety}
                                </span>
                              </motion.div>
                            </motion.div>
                            {/* Viewfinder */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-red-500/30" />
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-red-500/30" />
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-red-500/30" />
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-red-500/30" />
                            {/* Telemetry */}
                            <div className="absolute bottom-12 right-12 text-right font-mono text-red-500/50 text-[10px] space-y-1">
                              <div>RISK SCORE: {result.overall_assessment.risk_score_100}/100</div>
                              <div>PATHOGENS: {result.overall_assessment.all_pathogens_at_risk.length} DETECTED</div>
                              <div>WINDOW: {result.overall_assessment.critical_window_hours}H REMAINING</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-20">
                    {mode === 'results' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-[0_0_30px_rgba(255,77,77,0.4)] transition-shadow"
                      >
                        <span className="material-symbols-outlined">restart_alt</span>
                        <span>Scan Another</span>
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleUploadClick}
                          disabled={mode === 'scanning'}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-[0_0_30px_rgba(255,77,77,0.4)] transition-shadow disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined">upload_file</span>
                          <span>Upload Image</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          {/* Right Column: Analysis Results */}
          <div className="lg:col-span-4 space-y-6">
            <AnimatePresence mode="wait">
              {/* Waiting State */}
              {mode === 'upload' && !result && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel p-8 rounded-2xl border-l-4 border-stone-700"
                >
                  <div className="flex flex-col items-center text-center gap-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-stone-500 text-3xl">search_insights</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-400">Awaiting Image</h3>
                    <p className="text-stone-600 text-sm font-mono">Upload a food image to begin AI analysis</p>
                  </div>
                </motion.div>
              )}

              {/* Scanning State */}
              {mode === 'scanning' && (
                <motion.div
                  key="scanning-panel"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-panel p-8 rounded-2xl border-l-4 border-amber-400"
                >
                  <div className="flex flex-col items-center text-center gap-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="text-lg font-bold text-amber-400">Analyzing...</h3>
                    <p className="text-stone-500 text-sm font-mono">Gemini AI Vision is scanning</p>
                    <div className="w-full space-y-2 mt-4">
                      {['Detecting ingredients', 'Checking spoilage signs', 'Computing risk score'].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.5 }}
                          className="flex items-center gap-3 text-sm text-stone-400"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ delay: i * 0.5, repeat: Infinity, duration: 1 }}
                            className="w-2 h-2 bg-amber-400 rounded-full"
                          />
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results State */}
              {mode === 'results' && result && (
                <motion.div
                  key="results-panel"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Main Analysis Card */}
                  <div
                    className="glass-panel p-8 rounded-2xl border-l-4"
                    style={{ borderLeftColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2"
                          style={{ color: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }}>
                          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }} />
                          {result.overall_assessment.overall_visual_safety} Analysis
                        </p>
                        <h2 className="text-2xl font-bold text-[var(--on-surface)]">
                          {result.overall_assessment.estimated_dish}
                        </h2>
                      </div>
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) + '1A' }}>
                        <span className="material-symbols-outlined" style={{ color: getSafetyStatusColor(result.overall_assessment.overall_visual_safety), fontVariationSettings: "'FILL' 1" }}>
                          {result.overall_assessment.safe_to_eat_now ? 'verified' : 'dangerous'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {/* Risk Score Bar */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-stone-400 text-sm font-mono uppercase">Risk Score</span>
                          <span className="font-black text-2xl" style={{ color: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }}>
                            {result.overall_assessment.risk_score_100}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-stone-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.overall_assessment.risk_score_100}%` }}
                            transition={{ delay: 0.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(to right, ${getSafetyStatusColor(result.overall_assessment.overall_visual_safety)}, ${getSafetyStatusColor(result.overall_assessment.highest_risk_level)})`,
                              boxShadow: `0 0 10px ${getSafetyStatusColor(result.overall_assessment.overall_visual_safety)}99`
                            }}
                          />
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[var(--surface-container-low)] p-4 rounded-xl">
                          <p className="text-stone-500 text-[10px] font-mono uppercase mb-1">Highest Risk</p>
                          <p className="text-[var(--on-surface)] font-semibold text-lg">
                            {result.overall_assessment.highest_risk_ingredient}
                          </p>
                          <p className="text-xs mt-1" style={{ color: getRiskColor(result.overall_assessment.highest_risk_level) }}>
                            {result.overall_assessment.highest_risk_level} Risk
                          </p>
                        </div>
                        <div className="bg-[var(--surface-container-low)] p-4 rounded-xl">
                          <p className="text-stone-500 text-[10px] font-mono uppercase mb-1">Safe Window</p>
                          <p className="text-[var(--on-surface)] font-semibold text-lg">
                            {result.overall_assessment.critical_window_hours} Hours Remaining
                          </p>
                          <p className="text-red-500/70 text-xs mt-1">
                            Env: {result.environmental_conditions.temperature_c}°C / {result.environmental_conditions.humidity_percent}% Humidity
                          </p>
                        </div>
                      </div>

                      {/* Pathogens */}
                      {result.overall_assessment.all_pathogens_at_risk.length > 0 && (
                        <div className="bg-[var(--surface-container-low)] p-4 rounded-xl">
                          <p className="text-stone-500 text-[10px] font-mono uppercase mb-2">Pathogens at Risk</p>
                          <div className="flex flex-wrap gap-2">
                            {result.overall_assessment.all_pathogens_at_risk.map((p) => (
                              <span key={p} className="text-xs font-mono bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Verdict Banner */}
                      <div
                        className="p-4 rounded-xl text-center animate-pulse-glow border"
                        style={{
                          backgroundColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) + '1A',
                          borderColor: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) + '33',
                        }}
                      >
                        <p className="font-bold text-sm" style={{ color: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) }}>
                          {result.overall_assessment.safe_to_eat_now ? '✅ SAFE TO CONSUME' : '⚠️ EXERCISE CAUTION'}
                        </p>
                        {result.overall_assessment.immediate_concern && (
                          <p className="text-[10px] font-mono mt-1" style={{ color: getSafetyStatusColor(result.overall_assessment.overall_visual_safety) + 'AA' }}>
                            {result.overall_assessment.immediate_concern}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ingredient Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg px-2">Ingredient Breakdown</h3>
                    <div className="space-y-2">
                      {result.ingredient_analysis.map((item, idx) => (
                        <motion.div
                          key={item.ingredient}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className={`flex items-center space-x-4 p-3 bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] rounded-xl transition-all cursor-pointer ${item.risk === 'CRITICAL' || item.risk === 'HIGH' ? 'border-r-4' : ''}`}
                          style={{ borderRightColor: item.risk === 'CRITICAL' || item.risk === 'HIGH' ? item.risk_color : undefined }}
                        >
                          <div className="w-10 h-10 rounded-lg bg-[var(--surface-container-highest)] flex items-center justify-center text-lg">
                            🍽️
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-bold text-[var(--on-surface)] capitalize">{item.ingredient}</span>
                              <span className="text-[10px] font-mono font-bold" style={{ color: item.risk_color }}>
                                {item.risk}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                              {item.shelf_life.already_spoiled ? 'ALREADY SPOILED' : `${item.shelf_life.adjusted_safe_hours}h safe window`}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg px-2">Recommendations</h3>
                      {result.recommendations.slice(0, 3).map((rec, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          className="glass-panel p-4 rounded-xl"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{rec.icon}</span>
                            <div>
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full" style={{
                                color: rec.priority === 'CRITICAL' || rec.priority === 'URGENT' ? '#ff3b30' : rec.priority === 'HIGH' ? '#ff9500' : '#ffd700',
                                backgroundColor: (rec.priority === 'CRITICAL' || rec.priority === 'URGENT' ? '#ff3b30' : rec.priority === 'HIGH' ? '#ff9500' : '#ffd700') + '1A'
                              }}>
                                {rec.priority}
                              </span>
                              <p className="text-sm text-stone-300 mt-1 leading-relaxed">{rec.message}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>

      <footer className="bg-[#050303] border-t border-white/[0.03] flex justify-between items-center px-12 w-full py-6">
        <div className="font-mono uppercase tracking-widest text-[10px] text-stone-600">© 2026 FOODSHIELD AI SYSTEMS. ALL RIGHTS RESERVED.</div>
        <div className="flex space-x-8 font-mono uppercase tracking-widest text-[10px]">
          <span className="text-red-500">SYSTEM STATUS: OPTIMAL</span>
          <a className="text-stone-600 hover:text-amber-400 transition-colors" href="#">PRIVACY PROTOCOL</a>
          <a className="text-stone-600 hover:text-amber-400 transition-colors" href="#">LEGAL</a>
        </div>
      </footer>
    </>
  );
}
