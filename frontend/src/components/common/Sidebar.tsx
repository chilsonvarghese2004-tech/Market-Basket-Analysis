import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Cpu,
  Link2,
  BarChart3,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, dataset, isAnalyzing } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'dataset', label: 'Dataset', icon: Database, badge: dataset ? `${(dataset.rowCount / 1000).toFixed(0)}k` : null },
    { id: 'preprocessing', label: 'Data Preprocessing', icon: GitBranch, badge: 'Clean' },
    { id: 'analysis', label: 'Run Analysis', icon: Cpu, badge: isAnalyzing ? 'Running' : null, isSpecial: true },
    { id: 'rules', label: 'Association Rules', icon: Link2, badge: '126' },
    { id: 'insights', label: 'Product Insights', icon: BarChart3, badge: null },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles, badge: 'AI' },
    { id: 'reports', label: 'Reports & Export', icon: FileText, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-dark-900/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3.5 overflow-hidden">
          <div className="relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <DatabaseZap className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white truncate">Market Basket</span>
                <span className="text-xs px-1.5 py-0.2 rounded font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase truncate">
                Intelligence Platform
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden lg:flex items-center justify-center"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="relative shrink-0">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  } ${item.id === 'analysis' && isAnalyzing ? 'animate-spin text-cyan-400' : ''}`}
                />
              </div>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700/60 group-hover:border-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-dark-800 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Dataset Status Footer Card */}
      <div className="p-3.5 border-t border-slate-800/60 bg-dark-950/50">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">Dataset Active</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                {dataset ? `${(dataset.rowCount / 1000).toFixed(0)}k rows` : 'None'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {dataset ? dataset.name : 'No dataset selected'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title={dataset?.name || 'No dataset loaded'}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

