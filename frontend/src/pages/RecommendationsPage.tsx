import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductSelector } from '../components/recommendations/ProductSelector';
import { RecommendationCards } from '../components/recommendations/RecommendationCards';
import { BasketSimulator } from '../components/recommendations/BasketSimulator';
import { RecommendationService } from '../services/recommendationService';
import { motion } from 'framer-motion';

export const RecommendationsPage: React.FC = () => {
  const { selectedProduct, setSelectedProduct, analysisResults } = useApp();

  const [basket, setBasket] = useState<string[]>([
    'WHITE HANGING HEART T-LIGHT HOLDER',
    'HAND WARMER UNION JACK',
  ]);

  const rules = useMemo(() => analysisResults?.rules || [], [analysisResults]);

  const recommendations = useMemo(() => {
    if (!selectedProduct) return [];
    return RecommendationService.getRecommendationsForProduct(selectedProduct, rules);
  }, [selectedProduct, rules]);

  const handleAddToBasket = (product: string) => {
    if (!basket.includes(product)) {
      setBasket((prev) => [...prev, product]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Product Selector */}
      <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Smart Product Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Select any item in your catalog to retrieve high-lift association rules, predicted next-best purchases, and bundle discount recommendations.
          </p>
        </div>

        <ProductSelector
          selectedProduct={selectedProduct}
          onSelect={setSelectedProduct}
        />
      </div>

      {/* Product Recommendation Cards */}
      <RecommendationCards
        selectedProduct={selectedProduct}
        recommendations={recommendations}
        onAddToBasket={handleAddToBasket}
      />

      {/* Multi-Item Basket Uplift Simulator */}
      <BasketSimulator basket={basket} setBasket={setBasket} />
    </motion.div>
  );
};

