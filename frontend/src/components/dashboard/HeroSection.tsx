import React from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedNetworkHero } from './AnimatedNetworkHero';
import { Play, UploadCloud, Sparkles, ArrowRight, Zap, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const { setActiveView, runAnalysis, isAnalyzing } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900 via-dark-900/90 to-dark-950 border border-slate-800/90 shadow-2xl p-8 sm:p-12">
      {/* Background Interactive Graph Network */}
      <AnimatedNetworkHero />

      {/* Decorative Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Category Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-glow-cyan"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enterprise Association Rule Mining Engine</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
        >
          Market Basket{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
            Intelligence
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
        >
          Discover hidden relationships between products and turn millions of transaction records
          into high-converting merchandising strategies, bundle cross-sells, and actionable retail insights.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => setActiveView('analysis')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-glow-cyan transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => setActiveView('dataset')}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-cyan-500/40 transition-all duration-200 active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Dataset</span>
          </button>

          <button
            onClick={() => setActiveView('rules')}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
          >
            <Network className="w-4 h-4 text-violet-400" />
            <span>Explore Rules</span>
          </button>
        </motion.div>

        {/* Feature Badges */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>FP-Growth & Apriori Algorithms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Interactive Force Network Graph</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>Automated Basket Value Uplift</span>
          </div>
        </div>
      </div>
    </div>
  );
};

