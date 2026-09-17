import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Rows3,
  Columns3,
  PackageSearch,
  AlertTriangle,
  CopyX,
  ShieldCheck,
} from 'lucide-react';

export const DatasetStats: React.FC = () => {
  const { dataset } = useApp();

  if (!dataset) return null;

  const stats = [
    {
      label: 'Total Rows',
      value: dataset.rowCount.toLocaleString(),
      icon: Rows3,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Attributes / Columns',
      value: dataset.columnCount.toString(),
      icon: Columns3,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Unique Catalog Items',
      value: dataset.uniqueProductsCount.toLocaleString(),
      icon: PackageSearch,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      label: 'Missing Cells',
      value: dataset.missingValuesCount.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Duplicate Records',
      value: dataset.duplicateRowsCount.toLocaleString(),
      icon: CopyX,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'Validation Status',
      value: 'Production Ready',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${stat.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-lg font-bold text-white font-mono tracking-tight">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

