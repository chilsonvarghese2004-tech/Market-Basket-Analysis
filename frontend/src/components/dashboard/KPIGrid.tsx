import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import {
  Receipt,
  PackageCheck,
  Boxes,
  Network,
  Percent,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const KPIGrid: React.FC = () => {
  const { analysisResults, dataset } = useApp();

  const totalTransactions = analysisResults?.totalTransactions || dataset?.rowCount || 22190;
  const uniqueProducts = analysisResults?.uniqueProductsCount || dataset?.uniqueProductsCount || 1247;
  const frequentItemsets = analysisResults?.frequentItemsetsCount || 384;
  const associationRules = analysisResults?.rulesCount || 126;
  const avgSupport = (analysisResults?.avgSupport || 0.184) * 100;
  const avgConfidence = (analysisResults?.avgConfidence || 0.728) * 100;
  const avgLift = analysisResults?.avgLift || 2.41;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        title="Total Transactions"
        value={totalTransactions}
        icon={Receipt}
        color="cyan"
        trend="+14.2%"
        trendDirection="up"
        delay={0.05}
      />

      <MetricCard
        title="Unique Products"
        value={uniqueProducts}
        icon={PackageCheck}
        color="violet"
        trend="+5.8%"
        trendDirection="up"
        delay={0.1}
      />

      <MetricCard
        title="Frequent Itemsets"
        value={frequentItemsets}
        icon={Boxes}
        color="emerald"
        trend="+18.3%"
        trendDirection="up"
        delay={0.15}
      />

      <MetricCard
        title="Association Rules"
        value={associationRules}
        icon={Network}
        color="cyan"
        trend="+12.4%"
        trendDirection="up"
        delay={0.2}
      />

      <MetricCard
        title="Average Support"
        value={avgSupport}
        isPercentage
        suffix="%"
        icon={Percent}
        color="amber"
        trend="+2.1%"
        trendDirection="up"
        delay={0.25}
      />

      <MetricCard
        title="Average Confidence"
        value={avgConfidence}
        isPercentage
        suffix="%"
        icon={TrendingUp}
        color="violet"
        trend="+6.7%"
        trendDirection="up"
        delay={0.3}
      />
    </div>
  );
};

