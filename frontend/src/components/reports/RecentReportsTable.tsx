import React, { useState } from 'react';
import { ReportService } from '../../services/reportService';
import { formatDate } from '../../utils/formatters';
import { FileText, Download, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const RecentReportsTable: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const { addToast } = useToast();
  const reports = ReportService.getReports();

  const handleDownloadAgain = (rep: (typeof reports)[0]) => {
    addToast({
      type: 'info',
      title: 'Downloading Report',
      message: `Fetching "${rep.name}" (${rep.format})...`,
    });
  };

  return (
    <div className="rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Recent Generated Reports</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of exported Market Basket Intelligence archives
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
          {reports.length} Total Reports
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-dark-950/95 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Report Name</th>
              <th className="py-3.5 px-4">Generated Date</th>
              <th className="py-3.5 px-4">Source Dataset</th>
              <th className="py-3.5 px-4 text-center">Rules</th>
              <th className="py-3.5 px-4 text-center">Format</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reports.map((rep) => (
              <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-xs">{rep.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono">
                  {formatDate(rep.generatedDate)}
                </td>
                <td className="py-3 px-4 text-slate-300 truncate max-w-[160px]">
                  {rep.datasetName}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-white">
                  {rep.rulesCount}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-dark-800 border border-slate-700 text-cyan-300 uppercase">
                    {rep.format}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{rep.status}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDownloadAgain(rep)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

