import React from 'react';
import { ProductRecommendation } from '../../types';
import { formatPercent, getLiftBadge } from '../../utils/formatters';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, ArrowUpRight, Zap, Tag, Plus } from 'lucide-react';

interface RecommendationCardsProps {
  selectedProduct: string;
  recommendations: ProductRecommendation[];
  onAddToBasket?: (product: string) => void;
}

export const RecommendationCards: React.FC<RecommendationCardsProps> = ({
  selectedProduct,
  recommendations,
  onAddToBasket,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Customers who bought</span>
            <span className="text-cyan-400 font-extrabold underline underline-offset-4 truncate max-w-sm">
              "{selectedProduct}"
            </span>
            <span>also bought:</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by association lift factor and conditional purchase probability
          </p>
        </div>

        <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
          {recommendations.length} Recommendations Found
        </span>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {recommendations.map((rec, i) => {
            const liftBadge = getLiftBadge(rec.lift);

            return (
              <motion.div
                key={rec.product}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative p-5 rounded-2xl bg-dark-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${liftBadge.bg} ${liftBadge.text} ${liftBadge.border}`}
                    >
                      {liftBadge.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      {rec.lift.toFixed(2)}x Lift
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {rec.product}
                  </h4>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Confidence</span>
                      <span className="font-bold text-white">{formatPercent(rec.confidence)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Support</span>
                      <span className="font-bold text-slate-300">{formatPercent(rec.support)}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                    <Tag className="w-3 h-3" />
                    <span>{rec.bundleDiscountSuggested}</span>
                  </div>

                  {onAddToBasket && (
                    <button
                      onClick={() => onAddToBasket(rec.product)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-white text-cyan-400 border border-slate-700 hover:border-cyan-400 transition-colors"
                      title="Add to basket simulator"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-dark-900/60 border border-slate-800 text-slate-500 text-xs">
          No strong association rules were found with "{selectedProduct}" as an antecedent at the current lift threshold.
        </div>
      )}
    </div>
  );
};

