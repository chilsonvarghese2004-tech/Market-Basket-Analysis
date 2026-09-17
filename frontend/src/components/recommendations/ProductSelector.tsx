import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, Check, ChevronDown } from 'lucide-react';

interface ProductSelectorProps {
  onSelect: (product: string) => void;
  selectedProduct: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  onSelect,
  selectedProduct,
}) => {
  const { analysisResults } = useApp();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique products from rules and top products
  const products = React.useMemo(() => {
    const set = new Set<string>();
    (analysisResults?.rules || []).forEach((r) => {
      r.antecedent.forEach((item) => set.add(item));
      r.consequent.forEach((item) => set.add(item));
    });
    (analysisResults?.topProducts || []).forEach((p) => set.add(p.name));
    return Array.from(set);
  }, [analysisResults]);

  const filteredProducts = products.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
        Select Anchor Product for Recommendation:
      </label>

      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-slate-700/80 hover:border-cyan-500/50 text-left text-xs font-semibold text-white shadow-card transition-all"
      >
        <div className="flex items-center gap-2.5 truncate">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate">{selectedProduct || 'Choose a product...'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl z-30 space-y-2.5 max-h-80 flex flex-col">
          {/* Search box inside dropdown */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog item..."
              className="w-full pl-8 pr-3 py-1.5 bg-dark-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {filteredProducts.map((p) => {
              const isSelected = p === selectedProduct;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    onSelect(p);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{p}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                </button>
              );
            })}
            {filteredProducts.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-500">No matching products</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

