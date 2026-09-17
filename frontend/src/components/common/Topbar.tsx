import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Play,
  Database,
  Menu,
  Sparkles,
  CheckCircle2,
  Sliders,
  Share2,
} from 'lucide-react';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { activeView, setActiveView, dataset, isAnalyzing, runAnalysis } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time overview of customer purchase behavior and cross-sell affinities',
    },
    dataset: {
      title: 'Dataset Management',
      subtitle: 'Upload, inspect, and map multi-attribute transaction records',
    },
    preprocessing: {
      title: 'Data Preprocessing Pipeline',
      subtitle: 'Visual data hygiene, deduplication, and basket aggregation',
    },
    analysis: {
      title: 'Analysis Configuration',
      subtitle: 'Configure Apriori & FP-Growth mining parameters, support, and lift thresholds',
    },
    rules: {
      title: 'Association Rules Explorer',
      subtitle: 'Mined itemset implications with support, confidence, lift, and conviction metrics',
    },
    insights: {
      title: 'Product Insights & Analytics',
      subtitle: 'Category distribution, frequent itemsets, and pairwise co-occurrence rankings',
    },
    recommendations: {
      title: 'Smart Product Recommendations',
      subtitle: 'Instant cross-sell engine and interactive basket value uplift simulator',
    },
    reports: {
      title: 'Reports & Exports',
      subtitle: 'Generate executive summaries, export CSV/JSON, and share findings',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'System preferences, algorithm tuning, and API gateway endpoints',
    },
  };

  const currentMeta = titles[activeView] || {
    title: 'Market Basket Intelligence',
    subtitle: 'Association rule mining and affinity analytics',
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-dark-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-slate-400 truncate hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, items..."
            className="w-full pl-9 pr-8 py-2 bg-dark-800/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            /
          </kbd>
        </div>

        {/* Dataset Status Badge */}
        {dataset && (
          <div
            onClick={() => setActiveView('dataset')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/50 cursor-pointer transition-colors"
            title="Click to view dataset preview"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
              {dataset.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        )}

        {/* Run Analysis Action Button */}
        <button
          onClick={() => {
            if (activeView !== 'analysis') {
              setActiveView('analysis');
            } else {
              runAnalysis();
            }
          }}
          disabled={isAnalyzing}
          className="relative group flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-glow-cyan transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isAnalyzing ? 'Mining...' : 'Run Analysis'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-dark-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/40 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-200 font-medium">Analysis Completed</p>
                    <p className="text-[11px] text-slate-400">126 rules generated with FP-Growth algorithm.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/40 text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-200 font-medium">New Cross-Sell Pattern</p>
                    <p className="text-[11px] text-slate-400">High affinity: T-Light Holder & Metal Lantern (3.42x lift).</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center text-xs font-bold text-cyan-300">
              DA
            </div>
          </div>
          <div className="hidden 2xl:block text-left">
            <p className="text-xs font-semibold text-white">Lead Analyst</p>
            <p className="text-[10px] text-slate-400">Retail BI Unit</p>
          </div>
        </div>
      </div>
    </header>
  );
};

