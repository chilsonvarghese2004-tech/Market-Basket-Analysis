import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Rows3,
  Layers,
  ArrowDown,
  Sparkles,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PipelineVisualizer: React.FC = () => {
  const { preprocessingSteps, setActiveView } = useApp();

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Check className="w-3.5 h-3.5" />
            <span>Pipeline Executed Successfully</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            End-to-End Market Basket Data Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Cleaned, validated, deduplicated, and transformed raw transaction logs into dense basket matrices ready for Apriori & FP-Growth mining.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('analysis')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-glow-cyan transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Configure Analysis</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Steps */}
      <div className="relative space-y-4 max-w-4xl mx-auto py-4">
        {preprocessingSteps.map((step, idx) => {
          const isLast = idx === preprocessingSteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="group relative p-5 rounded-2xl bg-dark-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-card transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Step Number, Title, Description */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-glow-cyan">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                          {step.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Complete</span>
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics & Processing Time */}
                  <div className="flex items-center gap-5 text-right shrink-0">
                    {step.metricLabel && (
                      <div className="hidden sm:block">
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                          {step.metricLabel}
                        </p>
                        <p className="text-sm font-bold font-mono text-cyan-400">
                          {step.metricValue}
                        </p>
                      </div>
                    )}

                    <div className="hidden md:block">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">
                        Rows Impacted
                      </p>
                      <p className="text-sm font-bold font-mono text-slate-300">
                        {step.rowsAffected.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{step.durationMs}ms</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Animated Connector */}
              {!isLast && (
                <div className="flex justify-center my-1">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500/80 to-blue-500/20" />
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-400/80 -mt-1" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

