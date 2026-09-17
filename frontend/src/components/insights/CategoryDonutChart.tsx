import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const CategoryDonutChart: React.FC = () => {
  const { analysisResults } = useApp();

  const categories = analysisResults?.categories || [];

  return (
    <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Product Category Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Merchandising department distribution across transactions
          </p>
        </div>
        <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
          Share of Basket
        </span>
      </div>

      <div className="h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-dark-950 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1">
                      <p className="font-bold text-white">{data.name}</p>
                      <p className="text-cyan-400 font-mono">
                        {data.count.toLocaleString()} line items
                      </p>
                      <p className="text-slate-400 font-mono">{data.percentage.toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={categories}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
            >
              {categories.map((cat, index) => (
                <Cell key={`cell-${index}`} fill={cat.color} stroke="#0B111E" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-400 font-medium">Categories</span>
          <span className="text-lg font-bold font-mono text-white">{categories.length}</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
        {categories.slice(0, 4).map((cat) => (
          <div key={cat.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-slate-300 truncate max-w-[110px]">{cat.name}</span>
            <span className="text-slate-500 font-mono ml-auto">{cat.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

