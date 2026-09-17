import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Play,
  Cpu,
  Zap,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  Timer,
  FileCheck,
} from 'lucide-react';
import { MiningAlgorithm } from '../../types';

export const ConfigPanel: React.FC = () => {
  const { analysisConfig, setAnalysisConfig, runAnalysis, isAnalyzing, dataset } = useApp();

  const handleSliderChange = (key: 'minSupport' | 'minConfidence' | 'minLift', val: number) => {
    setAnalysisConfig((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Dynamic estimate calculations based on slider parameters
  const estimatedRules = Math.max(
    8,
    Math.round(
      (1 / (analysisConfig.minSupport * 10)) *
        (1 / analysisConfig.minConfidence) *
        (6 / analysisConfig.minLift) *
        12
    )
  );

  const estimatedTimeSec =
    analysisConfig.algorithm === 'fpgrowth' ? '~2-4 seconds' : '~6-9 seconds';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Left: Configuration Sliders & Selectors (2 columns) */}
      <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card space-y-7">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Mining Hyperparameters
              </h3>
              <p className="text-xs text-slate-400">
                Adjust statistical thresholds to isolate the most actionable product affinities
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Tuning</span>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Mining Algorithm</span>
            <span className="text-[10px] text-cyan-400 font-normal lowercase">(tree vs iterative)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'fpgrowth' as MiningAlgorithm,
                name: 'FP-Growth (Recommended)',
                desc: 'Frequent-Pattern Tree structure. 5-10x faster memory performance.',
              },
              {
                id: 'apriori' as MiningAlgorithm,
                name: 'Apriori Algorithm',
                desc: 'Classical level-wise candidate generation and join approach.',
              },
            ].map((algo) => {
              const isSelected = analysisConfig.algorithm === algo.id;
              return (
                <div
                  key={algo.id}
                  onClick={() =>
                    setAnalysisConfig((prev) => ({ ...prev, algorithm: algo.id }))
                  }
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-glow-cyan text-white'
                      : 'bg-dark-800/60 border-slate-700/80 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-200">{algo.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{algo.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimum Support Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200">
                Minimum Support Threshold (s)
              </span>
              <p className="text-[11px] text-slate-400">
                Frequency of occurrence of itemsets across total baskets
              </p>
            </div>
            <span className="font-mono text-base font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
              {(analysisConfig.minSupport * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.40"
            step="0.01"
            value={analysisConfig.minSupport}
            onChange={(e) => handleSliderChange('minSupport', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>1.0% (Exploratory)</span>
            <span>20.0% (High Frequency)</span>
            <span>40.0% (Dominant)</span>
          </div>
        </div>

        {/* Minimum Confidence Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200">
                Minimum Confidence Threshold (c)
              </span>
              <p className="text-[11px] text-slate-400">
                Conditional probability: P(Consequent | Antecedent)
              </p>
            </div>
            <span className="font-mono text-base font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg border border-violet-500/20">
              {(analysisConfig.minConfidence * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.95"
            step="0.05"
            value={analysisConfig.minConfidence}
            onChange={(e) => handleSliderChange('minConfidence', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>10% (Permissive)</span>
            <span>50% (Standard)</span>
            <span>95% (Near Guaranteed)</span>
          </div>
        </div>

        {/* Minimum Lift Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200">
                Minimum Lift Ratio (L)
              </span>
              <p className="text-[11px] text-slate-400">
                Association strength: {'>'} 1.0 means positive co-purchase affinity
              </p>
            </div>
            <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              {analysisConfig.minLift.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.1"
            value={analysisConfig.minLift}
            onChange={(e) => handleSliderChange('minLift', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>1.0x (Independent)</span>
            <span>2.5x (Strong Synergy)</span>
            <span>6.0x (Hyper-Affinity)</span>
          </div>
        </div>

        {/* Maximum Itemset Size */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Maximum Itemset Size (k-itemsets)
          </label>
          <div className="flex items-center gap-3">
            {[2, 3, 4, 5].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setAnalysisConfig((prev) => ({ ...prev, maxItemsetSize: size }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  analysisConfig.maxItemsetSize === size
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-glow-cyan'
                    : 'bg-dark-800 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {size} Items
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Estimated Analysis Summary & Action CTA (1 column) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-dark-900 via-dark-850 to-dark-950 border border-slate-800 shadow-card flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Analysis Estimation</span>
          </div>

          <h4 className="text-lg font-bold text-white tracking-tight">
            Execution Preview
          </h4>

          <div className="space-y-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Target Dataset</span>
              <span className="text-xs font-bold text-white truncate max-w-[150px]">
                {dataset?.name || 'Assignment-1'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Estimated Rules</span>
              <span className="text-xs font-bold text-cyan-300 font-mono">
                ~{estimatedRules} rules
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Processing Time</span>
              <span className="text-xs font-bold text-emerald-300 font-mono">
                {estimatedTimeSec}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Target Metric</span>
              <span className="text-xs font-bold text-violet-300 uppercase font-mono">
                {analysisConfig.metricSort}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Calculated dynamically. The algorithm will construct frequent itemsets, prune non-viable paths, and rank implications.
            </span>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-glow-cyan transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing Transactions...' : 'Run Market Basket Analysis'}</span>
        </button>
      </div>
    </div>
  );
};

