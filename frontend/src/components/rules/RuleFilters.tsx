import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface RuleFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  minConfidence: number;
  onConfidenceChange: (c: number) => void;
  minLift: number;
  onLiftChange: (l: number) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  sortBy: 'lift' | 'confidence' | 'support' | 'conviction';
  onSortChange: (sort: 'lift' | 'confidence' | 'support' | 'conviction') => void;
  onReset: () => void;
  totalFiltered: number;
  totalRules: number;
}

export const RuleFilters: React.FC<RuleFiltersProps> = ({
  searchQuery,
  onSearchChange,
  minConfidence,
  onConfidenceChange,
  minLift,
  onLiftChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  onReset,
  totalFiltered,
  totalRules,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card space-y-4">
      {/* Top row: search & category & sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items in antecedent or consequent..."
            className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 bg-dark-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort metric */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Rank by:</span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'lift' | 'confidence' | 'support' | 'conviction')
            }
            className="px-3 py-2 bg-dark-800 border border-slate-700 rounded-xl text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500 capitalize"
          >
            <option value="lift">Lift Ratio</option>
            <option value="confidence">Confidence %</option>
            <option value="support">Support %</option>
            <option value="conviction">Conviction</option>
          </select>
        </div>
      </div>

      {/* Bottom row: threshold sliders & count */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* Min confidence slider */}
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400">Min Confidence:</span>
            <input
              type="range"
              min="0"
              max="0.9"
              step="0.05"
              value={minConfidence}
              onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="font-mono text-cyan-400 font-bold w-10">
              {(minConfidence * 100).toFixed(0)}%
            </span>
          </div>

          {/* Min lift slider */}
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400">Min Lift:</span>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={minLift}
              onChange={(e) => onLiftChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <span className="font-mono text-emerald-400 font-bold w-12">
              {minLift.toFixed(1)}x
            </span>
          </div>

          {/* Reset button */}
          {(searchQuery || minConfidence > 0 || minLift > 1.0 || selectedCategory !== 'all') && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="text-slate-400">
          Showing <span className="font-bold text-white">{totalFiltered}</span> of{' '}
          <span className="font-bold text-white">{totalRules}</span> rules
        </div>
      </div>
    </div>
  );
};

