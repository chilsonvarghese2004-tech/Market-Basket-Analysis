import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { formatPercent, getLiftBadge } from '../../utils/formatters';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Percent,
  Zap,
  ShoppingBag,
  Store,
  Layers,
  HelpCircle,
  Network,
} from 'lucide-react';

export const RuleDetailModal: React.FC = () => {
  const { selectedRule, setSelectedRule, setActiveView, setSelectedProduct, analysisResults } = useApp();

  if (!selectedRule) return null;

  const liftBadge = getLiftBadge(selectedRule.lift);

  // Find related products co-occurring with antecedent or consequent
  const relatedRules = (analysisResults?.rules || []).filter(
    (r) =>
      r.id !== selectedRule.id &&
      (r.antecedent.some((item) => selectedRule.antecedent.includes(item)) ||
        r.consequent.some((item) => selectedRule.consequent.includes(item)))
  ).slice(0, 4);

  return (
    <Drawer
      isOpen={!!selectedRule}
      onClose={() => setSelectedRule(null)}
      title="Association Rule Intelligence"
      subtitle={`Rule ID: ${selectedRule.id}`}
      width="lg"
    >
      {/* Rule Flow Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Rule Affinity Flow
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${liftBadge.bg} ${liftBadge.text} ${liftBadge.border}`}
          >
            {liftBadge.label}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm font-bold text-white pt-1">
          <div className="flex-1 p-3 rounded-xl bg-dark-900 border border-cyan-500/30 text-cyan-300">
            <span className="text-[10px] text-slate-400 block font-normal uppercase">Antecedent (IF)</span>
            <span className="truncate block font-semibold">{selectedRule.antecedent.join(', ')}</span>
          </div>

          <div className="shrink-0 p-2 rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="flex-1 p-3 rounded-xl bg-dark-900 border border-violet-500/30 text-violet-300">
            <span className="text-[10px] text-slate-400 block font-normal uppercase">Consequent (THEN)</span>
            <span className="truncate block font-semibold">{selectedRule.consequent.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Statistical Affinity Metrics
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <span className="text-[11px] text-slate-400">Support</span>
            <p className="text-lg font-bold font-mono text-white mt-1">
              {formatPercent(selectedRule.support)}
            </p>
            <span className="text-[10px] text-slate-500 block">Overall market frequency</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <span className="text-[11px] text-slate-400">Confidence</span>
            <p className="text-lg font-bold font-mono text-cyan-400 mt-1">
              {formatPercent(selectedRule.confidence)}
            </p>
            <span className="text-[10px] text-slate-500 block">P(Then | If)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <span className="text-[11px] text-slate-400">Lift Ratio</span>
            <p className="text-lg font-bold font-mono text-emerald-400 mt-1">
              {selectedRule.lift.toFixed(2)}x
            </p>
            <span className="text-[10px] text-slate-500 block">{'>'} 1 = positive correlation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <span className="text-[11px] text-slate-400">Leverage</span>
            <p className="text-lg font-bold font-mono text-violet-400 mt-1">
              {selectedRule.leverage.toFixed(4)}
            </p>
            <span className="text-[10px] text-slate-500 block">Excess probability</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <span className="text-[11px] text-slate-400">Conviction</span>
            <p className="text-lg font-bold font-mono text-amber-400 mt-1">
              {selectedRule.conviction.toFixed(2)}
            </p>
            <span className="text-[10px] text-slate-500 block">Degree of implication</span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80">
            <span className="text-[11px] text-slate-400">Co-purchases</span>
            <p className="text-lg font-bold font-mono text-white mt-1">
              {selectedRule.transactionCount.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500 block">Basket instances</span>
          </div>
        </div>
      </div>

      {/* Plain English Explanation */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <HelpCircle className="w-4 h-4" />
          <span>Natural Language Interpretation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedRule.explanation}
        </p>
      </div>

      {/* Actionable Business Insight */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-dark-850 to-dark-900 border border-slate-700/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Strategic Business Recommendations</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3">
            <Store className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Store Placement & Layout</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedRule.businessInsight}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Cross-Selling & Digital Checkout</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedRule.crossSellAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Rules & Next-Best Actions */}
      {relatedRules.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Related Association Cluster</span>
            <button
              onClick={() => {
                setSelectedRule(null);
                setActiveView('rules');
              }}
              className="text-cyan-400 hover:underline capitalize"
            >
              View all
            </button>
          </h4>

          <div className="space-y-2">
            {relatedRules.map((rel) => (
              <div
                key={rel.id}
                onClick={() => setSelectedRule(rel)}
                className="p-3 rounded-xl bg-dark-800/80 border border-slate-700 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-200 truncate max-w-[280px]">
                  <span className="truncate">{rel.antecedent[0]}</span>
                  <span className="text-cyan-400">→</span>
                  <span className="truncate">{rel.consequent[0]}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-cyan-400 font-bold">{rel.lift.toFixed(1)}x Lift</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            setSelectedProduct(selectedRule.antecedent[0]);
            setSelectedRule(null);
            setActiveView('recommendations');
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-glow-cyan transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Recommender for Antecedent</span>
        </button>
      </div>
    </Drawer>
  );
};

