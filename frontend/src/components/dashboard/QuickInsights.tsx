import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Zap,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Tag,
  Share2,
  Package,
} from 'lucide-react';

export const QuickInsights: React.FC = () => {
  const { analysisResults, setActiveView, setSelectedRule } = useApp();

  const strongestRule = analysisResults?.rules[0];
  const topProduct = analysisResults?.topProducts[0];
  const secondRule = analysisResults?.rules[1] || analysisResults?.rules[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Insight 1: Strongest Association */}
      <div className="relative group p-6 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-slate-800 hover:border-cyan-500/40 shadow-card transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Highest Lift Factor</span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300">
            {strongestRule ? `${strongestRule.lift.toFixed(2)}x Lift` : '3.42x'}
          </span>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Strongest Association
        </h3>

        {strongestRule ? (
          <div className="mt-2.5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-base leading-snug">
              <span className="truncate max-w-[180px]">{strongestRule.antecedent.join(', ')}</span>
              <span className="text-cyan-400">→</span>
              <span className="truncate max-w-[180px]">{strongestRule.consequent.join(', ')}</span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {strongestRule.explanation}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400">No rule calculated yet.</p>
        )}

        <button
          onClick={() => {
            if (strongestRule) setSelectedRule(strongestRule);
            setActiveView('rules');
          }}
          className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Inspect Rule Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Insight 2: Most Frequent Product */}
      <div className="relative group p-6 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-slate-800 hover:border-violet-500/40 shadow-card transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold">
            <Package className="w-3.5 h-3.5" />
            <span>Anchor Product</span>
          </div>
          <span className="text-xs font-mono font-bold text-violet-300">
            {topProduct ? `${(topProduct.support * 100).toFixed(1)}% Support` : '29.1%'}
          </span>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Highest Basket Penetration
        </h3>

        {topProduct ? (
          <div className="mt-2.5 space-y-2">
            <div className="text-white font-bold text-base truncate">
              {topProduct.name}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Purchased in {topProduct.count.toLocaleString()} transactions. Acts as a prime anchor
              item driving complementary cross-category purchases.
            </p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400">Loading catalog metrics...</p>
        )}

        <button
          onClick={() => setActiveView('insights')}
          className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          <span>View Product Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Insight 3: Prime Cross-Selling Opportunity */}
      <div className="relative group p-6 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-slate-800 hover:border-emerald-500/40 shadow-card transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>High Conversion Opportunity</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300">
            {secondRule ? `${(secondRule.confidence * 100).toFixed(1)}% Conf` : '76.4%'}
          </span>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Cross-Selling Strategy
        </h3>

        {secondRule ? (
          <div className="mt-2.5 space-y-2">
            <div className="text-white font-bold text-base truncate">
              {secondRule.antecedent[0]} + {secondRule.consequent[0]}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {secondRule.crossSellAction ||
                'High affinity indicates bundling these items at checkout will immediately increase average basket size.'}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400">Loading cross-sell strategies...</p>
        )}

        <button
          onClick={() => setActiveView('recommendations')}
          className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Simulate Cart Uplift</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

