import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Settings, Server, Sliders, Shield, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const { addToast } = useToast();

  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [useLocalEngine, setUseLocalEngine] = useState(true);
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Platform configuration and API routing preferences updated.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend API Connection */}
        <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Backend API & Gateway Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Configure connection to your Python Flask/FastAPI Market Basket microservice
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                API Base URL (VITE_API_BASE_URL)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full max-w-lg px-3.5 py-2.5 bg-dark-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Endpoints: <code className="text-cyan-400">POST /api/analysis/run</code>,{' '}
                <code className="text-cyan-400">POST /api/dataset/upload</code>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="localEngine"
                checked={useLocalEngine}
                onChange={(e) => setUseLocalEngine(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-dark-800 text-cyan-500 focus:ring-cyan-500/20"
              />
              <label htmlFor="localEngine" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold text-white block">
                  Enable Client-Side In-Browser Fallback Engine
                </span>
                <span className="text-slate-400">
                  Allows full offline mining of uploaded datasets if the Python server is offline.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* User Experience & Accessibility */}
        <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Interface & Accessibility Preferences
              </h3>
              <p className="text-xs text-slate-400">
                Adjust animations, table interactions, and notification sensitivity
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoDrawer"
                checked={autoOpenDrawer}
                onChange={(e) => setAutoOpenDrawer(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-dark-800 text-cyan-500 focus:ring-cyan-500/20"
              />
              <label htmlFor="autoDrawer" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold text-white block">
                  Quick Inspect Drawer on Rule Selection
                </span>
                <span className="text-slate-400">
                  Open side drawer immediately when clicking any row in the association rules table.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="reducedMotion"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-dark-800 text-cyan-500 focus:ring-cyan-500/20"
              />
              <label htmlFor="reducedMotion" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold text-white block">
                  Reduced Motion Mode (prefers-reduced-motion)
                </span>
                <span className="text-slate-400">
                  Minimize canvas animations and card entrance transitions for smoother accessibility.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-glow-cyan transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

