import React from 'react';
import { HeroSection } from '../components/dashboard/HeroSection';
import { KPIGrid } from '../components/dashboard/KPIGrid';
import { QuickInsights } from '../components/dashboard/QuickInsights';
import { ProductNetworkGraph } from '../components/graph/ProductNetworkGraph';
import { ProductFrequencyChart } from '../components/insights/ProductFrequencyChart';
import { CategoryDonutChart } from '../components/insights/CategoryDonutChart';
import { TopAssociationsCard } from '../components/insights/TopAssociationsCard';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* KPI Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Executive Market Basket KPIs
        </h2>
        <KPIGrid />
      </div>

      {/* Automated Business Insights */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Automated Strategic Takeaways
        </h2>
        <QuickInsights />
      </div>

      {/* Product Relationship Network Graph */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Interactive Product Affinity Topology
        </h2>
        <ProductNetworkGraph />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductFrequencyChart />
        <CategoryDonutChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopAssociationsCard />
      </div>
    </motion.div>
  );
};

