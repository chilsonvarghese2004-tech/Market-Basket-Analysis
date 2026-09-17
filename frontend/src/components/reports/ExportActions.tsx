import React from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ReportService } from '../../services/reportService';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  FileCode,
  Share2,
  Sparkles,
  Download,
} from 'lucide-react';

interface ExportActionsProps {
  onReportCreated?: () => void;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ onReportCreated }) => {
  const { analysisResults } = useApp();
  const { addToast } = useToast();

  const handleExport = (format: 'CSV' | 'JSON' | 'PDF' | 'EXCEL') => {
    if (!analysisResults) {
      addToast({
        type: 'warning',
        title: 'No Analysis Available',
        message: 'Please run an analysis before generating reports.',
      });
      return;
    }

    try {
      const rep = ReportService.generateReport(analysisResults, format);
      addToast({
        type: 'success',
        title: `${format} Export Triggered`,
        message: `Generated and downloaded "${rep.name}".`,
      });
      if (onReportCreated) onReportCreated();
    } catch (e: any) {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: e.message || 'Unable to generate export.',
      });
    }
  };

  const exportButtons = [
    {
      format: 'CSV' as const,
      label: 'Export Rules to CSV',
      desc: 'Tabular rule metrics for Excel, Python pandas, and R analysis',
      icon: FileDown,
      color: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/10 text-cyan-300',
    },
    {
      format: 'EXCEL' as const,
      label: 'Generate Excel Workbook',
      desc: 'Multi-sheet export with frequent itemsets, rules, and top pairs',
      icon: FileSpreadsheet,
      color: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 text-emerald-300',
    },
    {
      format: 'PDF' as const,
      label: 'Download Executive Report',
      desc: 'Formatted summary report highlighting strategic cross-sell patterns',
      icon: FileText,
      color: 'border-violet-500/40 hover:border-violet-400 bg-violet-500/10 text-violet-300',
    },
    {
      format: 'JSON' as const,
      label: 'Export REST JSON Payload',
      desc: 'Machine-readable schema ready for recommendation API ingestion',
      icon: FileCode,
      color: 'border-amber-500/40 hover:border-amber-400 bg-amber-500/10 text-amber-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {exportButtons.map((btn) => {
        const Icon = btn.icon;
        return (
          <div
            key={btn.format}
            onClick={() => handleExport(btn.format)}
            className={`group p-5 rounded-2xl bg-dark-900/90 border cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-card flex flex-col justify-between ${btn.color}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6" />
                <Download className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-white tracking-tight">{btn.label}</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{btn.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <span className="font-mono text-[10px] uppercase">Format: {btn.format}</span>
              <span className="text-cyan-400 group-hover:underline">Download Now →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

