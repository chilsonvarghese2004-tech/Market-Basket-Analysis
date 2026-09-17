import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCw, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const LoadingOverlay: React.FC = () => {
  const { isAnalyzing, analysisProgress } = useApp();

  const stages = [
    'Preparing transaction sparse matrix...',
    'Mining frequent itemsets via FP-Growth / Apriori...',
    'Generating candidate association rules...',
    'Computing support, confidence, lift, & conviction...',
    'Synthesizing actionable retail business insights...',
  ];

  const currentPercent = analysisProgress.percent || 15;

  return (
    <AnimatePresence>
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 text-center space-y-6 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Spinner */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-blue-500 border-b-transparent border-l-transparent animate-spin" />
              <div className="w-14 h-14 rounded-2xl bg-dark-800/90 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
                <Cpu className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Analyzing Transactions...
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {analysisProgress.step}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Mining Progress</span>
                <span className="text-cyan-400 font-bold">{currentPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-300 shadow-glow-cyan"
                  style={{ width: `${currentPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist of stages */}
            <div className="text-left space-y-2.5 pt-2 border-t border-slate-800">
              {stages.map((stage, i) => {
                const stagePercent = (i + 1) * 20;
                const isDone = currentPercent >= stagePercent;
                const isCurrent = currentPercent >= stagePercent - 20 && currentPercent < stagePercent;

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 text-xs transition-colors ${
                      isDone
                        ? 'text-slate-300'
                        : isCurrent
                        ? 'text-cyan-300 font-medium'
                        : 'text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-800 shrink-0 ml-1" />
                    )}
                    <span className="truncate">{stage}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

