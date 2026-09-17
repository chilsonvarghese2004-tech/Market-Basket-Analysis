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
import { ArrowRight, Sparkles } from 'lucide-react';

export const TopAssociationsCard: React.FC = () => {
  const { analysisResults, setSelectedProduct, setActiveView } = useApp();

  const pairs = (analysisResults?.topPairs || []).slice(0, 7).map((p) => ({
    name: p.pair.length > 28 ? p.pair.slice(0, 26) + '...' : p.pair,
    fullPair: p.pair,
    itemA: p.itemA,
    itemB: p.itemB,
    count: p.cooccurrences,
    lift: p.lift.toFixed(2),
    confidence: (p.confidence * 100).toFixed(0),
  }));

  return (
    <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Strongest Co-Purchased Product Pairs
          </h3>
          <p className="text-xs text-slate-400">
            Highest frequency item combinations found inside single checkouts
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          Ranked by Co-occurrences
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={pairs}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              width={140}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 bg-dark-950 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1">
                      <p className="font-bold text-white">{d.fullPair}</p>
                      <p className="text-emerald-400 font-mono">
                        {d.count.toLocaleString()} co-occurrences
                      </p>
                      <p className="text-cyan-400 font-mono">Lift: {d.lift}x • Conf: {d.confidence}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill="#10B981" radius={[0, 6, 6, 0]}>
              {pairs.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#10B981' : index === 1 ? '#06B6D4' : '#6366F1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

