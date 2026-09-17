import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationService } from '../../services/recommendationService';
import { ShoppingCart, Plus, X, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

export const BasketSimulator: React.FC<{
  basket: string[];
  setBasket: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ basket, setBasket }) => {
  const { analysisResults } = useApp();
  const [inputItem, setInputItem] = useState('');

  const rules = analysisResults?.rules || [];
  const { recommendations, estimatedUpliftPercent, matchedRulesCount } =
    RecommendationService.getBasketRecommendations(basket, rules);

  const addItem = (item: string) => {
    if (item && !basket.includes(item)) {
      setBasket((prev) => [...prev, item]);
      setInputItem('');
    }
  };

  const removeItem = (item: string) => {
    setBasket((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Basket Value Uplift Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Add products to test real-time cross-sell trigger rules and projected cart value expansion
            </p>
          </div>
        </div>

        {/* Uplift Metric Badge */}
        <div className="flex items-center gap-3 bg-dark-800 px-4 py-2 rounded-xl border border-slate-700">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Estimated Basket Uplift
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-400">
              +{estimatedUpliftPercent}% Uplift
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Current Basket Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Current Cart Items ({basket.length})
          </span>
          {basket.length > 0 && (
            <button
              onClick={() => setBasket([])}
              className="text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {basket.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <span className="truncate max-w-[220px]">{item}</span>
              <button
                onClick={() => removeItem(item)}
                className="p-0.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {basket.length === 0 && (
            <p className="text-xs text-slate-500 italic py-2">
              Cart is currently empty. Click "+" on recommendations or add items below.
            </p>
          )}
        </div>
      </div>

      {/* Suggested Next-Best Cross-Sells for this Basket */}
      {recommendations.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next-Best Items For This Cart:</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Triggered by {matchedRulesCount} rules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.product}
                className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{rec.product}</p>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    {rec.lift.toFixed(2)}x Lift • {(rec.confidence * 100).toFixed(0)}% Conf
                  </p>
                </div>
                <button
                  onClick={() => addItem(rec.product)}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-white font-bold transition-all shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

