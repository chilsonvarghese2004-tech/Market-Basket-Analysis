import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from 'recharts';

export const ScatterSupportConfidence: React.FC = () => {
  const { analysisResults, setSelectedRule } = useApp();

  const rules = analysisResults?.rules || [];

  const data = rules.map((r) => ({
    x: parseFloat((r.support * 100).toFixed(2)),
    y: parseFloat((r.confidence * 100).toFixed(1)),
    z: r.lift,
    rule: `${r.antecedent[0]} → ${r.consequent[0]}`,
    lift: r.lift.toFixed(2),
    support: (r.support * 100).toFixed(2),
    confidence: (r.confidence * 100).toFixed(1),
    rawRule: r,
  }));

  const getColor = (lift: number) => {
    if (lift >= 3.5) return '#10B981'; // emerald
    if (lift >= 2.5) return '#06B6D4'; // cyan
    if (lift >= 1.8) return '#8B5CF6'; // violet
    return '#64748B'; // slate
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Support vs. Confidence Frontier
          </h3>
          <p className="text-xs text-slate-400">
            Rules plotted by market support (x) and conditional confidence (y), sized/colored by Lift
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> &gt;3.5x Lift
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> &gt;2.5x
          </span>
          <span className="flex items-center gap-1 text-violet-400">
            <span className="w-2 h-2 rounded-full bg-violet-400" /> &gt;1.8x
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              type="number"
              dataKey="x"
              name="Support"
              unit="%"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              label={{ value: 'Support (%)', position: 'insideBottom', offset: -12, fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Confidence"
              unit="%"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 220]} name="Lift" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="p-3 bg-dark-950 border border-slate-800 rounded-xl shadow-2xl text-xs space-y-1 max-w-xs">
                      <p className="font-bold text-white truncate">{p.rule}</p>
                      <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Support</span>
                          <span className="text-white font-bold">{p.support}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Conf</span>
                          <span className="text-cyan-400 font-bold">{p.confidence}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Lift</span>
                          <span className="text-emerald-400 font-bold">{p.lift}x</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              data={data}
              onClick={(entry) => setSelectedRule(entry.rawRule)}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.z)}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

