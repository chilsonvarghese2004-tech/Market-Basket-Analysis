import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const ProductFrequencyChart: React.FC = () => {
  const { analysisResults } = useApp();

  const data = (analysisResults?.topProducts || []).slice(0, 8).map((p) => ({
    name: p.name.length > 22 ? p.name.slice(0, 20) + '...' : p.name,
    fullName: p.name,
    count: p.count,
    support: (p.support * 100).toFixed(1),
  }));

  const colors = [
    '#06B6D4',
    '#0EA5E9',
    '#3B82F6',
    '#6366F1',
    '#8B5CF6',
    '#A855F7',
    '#D946EF',
    '#EC4899',
  ];

  return (
    <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Top 8 Most Frequent Catalog Products
          </h3>
          <p className="text-xs text-slate-400">
            Absolute transaction frequency across all customer baskets
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
          Ranked by Baskets
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-3 bg-dark-950 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1">
                      <p className="font-bold text-white">{item.fullName}</p>
                      <p className="text-cyan-400 font-mono">
                        {item.count.toLocaleString()} transactions
                      </p>
                      <p className="text-slate-400 font-mono">Support: {item.support}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

