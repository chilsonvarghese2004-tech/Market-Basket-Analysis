import React from 'react';
import { ProductFrequencyChart } from '../components/insights/ProductFrequencyChart';
import { TopAssociationsCard } from '../components/insights/TopAssociationsCard';
import { ScatterSupportConfidence } from '../components/insights/ScatterSupportConfidence';
import { CategoryDonutChart } from '../components/insights/CategoryDonutChart';
import { ProductNetworkGraph } from '../components/graph/ProductNetworkGraph';
import { motion } from 'framer-motion';

export const ProductInsightsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 2-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductFrequencyChart />
        <CategoryDonutChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAssociationsCard />
        <ScatterSupportConfidence />
      </div>

      {/* Network View */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Product Association Topological Map
        </h3>
        <ProductNetworkGraph />
      </div>
    </motion.div>
  );
};

