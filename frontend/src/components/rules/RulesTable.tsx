import React, { useState } from 'react';
import { AssociationRule } from '../../types';
import { useApp } from '../../context/AppContext';
import { getLiftBadge, getConfidenceBadge, formatPercent } from '../../utils/formatters';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface RulesTableProps {
  rules: AssociationRule[];
}

export const RulesTable: React.FC<RulesTableProps> = ({ rules }) => {
  const { setSelectedRule } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(rules.length / pageSize) || 1;
  const paginatedRules = rules.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-dark-950/95 backdrop-blur-md border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-4 px-4 w-12 text-center text-slate-600">#</th>
              <th className="py-4 px-4 min-w-[200px]">Antecedent (IF)</th>
              <th className="py-4 px-2 text-center w-8"></th>
              <th className="py-4 px-4 min-w-[200px]">Consequent (THEN)</th>
              <th className="py-4 px-4 text-right">Support</th>
              <th className="py-4 px-4 text-right">Confidence</th>
              <th className="py-4 px-4 text-right">Lift</th>
              <th className="py-4 px-4 text-right hidden lg:table-cell">Leverage</th>
              <th className="py-4 px-4 text-right hidden xl:table-cell">Conviction</th>
              <th className="py-4 px-4 text-center">Quality</th>
              <th className="py-4 px-4 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedRules.length > 0 ? (
              paginatedRules.map((rule, idx) => {
                const rowNum = (currentPage - 1) * pageSize + idx + 1;
                const liftBadge = getLiftBadge(rule.lift);
                const confBadge = getConfidenceBadge(rule.confidence);

                return (
                  <tr
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                      {rowNum}
                    </td>

                    {/* Antecedent */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rule.antecedent.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-dark-800 border border-slate-700 font-semibold text-slate-200 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Arrow */}
                    <td className="py-3.5 px-2 text-center">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors inline" />
                    </td>

                    {/* Consequent */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rule.consequent.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/30 font-semibold text-violet-300 group-hover:border-violet-500/60 transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Support */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 font-medium">
                      {formatPercent(rule.support)}
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {formatPercent(rule.confidence)}
                    </td>

                    {/* Lift */}
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-cyan-400">
                      {rule.lift.toFixed(2)}x
                    </td>

                    {/* Leverage */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 hidden lg:table-cell">
                      {rule.leverage.toFixed(3)}
                    </td>

                    {/* Conviction */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 hidden xl:table-cell">
                      {rule.conviction.toFixed(2)}
                    </td>

                    {/* Quality Badges */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${liftBadge.bg} ${liftBadge.text} ${liftBadge.border}`}
                      >
                        {liftBadge.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRule(rule);
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="View rule insight"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500 text-xs">
                  No association rules match current filter thresholds.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-dark-900/60">
        <div>
          Showing{' '}
          <span className="font-semibold text-white">
            {rules.length ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-white">
            {Math.min(currentPage * pageSize, rules.length)}
          </span>{' '}
          of <span className="font-semibold text-white">{rules.length}</span> association rules
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-dark-800 border border-slate-700 rounded-md text-xs text-slate-300"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-slate-300 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

