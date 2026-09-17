import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { LoadingOverlay } from './components/analysis/LoadingOverlay';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { DatasetPage } from './pages/DatasetPage';
import { PreprocessingPage } from './pages/PreprocessingPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { RulesPage } from './pages/RulesPage';
import { ProductInsightsPage } from './pages/ProductInsightsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'dataset':
        return <DatasetPage />;
      case 'preprocessing':
        return <PreprocessingPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'rules':
        return <RulesPage />;
      case 'insights':
        return <ProductInsightsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-950 text-slate-100 flex overflow-x-hidden bg-grid-pattern">
      {/* Desktop Sidebar (hidden on mobile, fixed) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] bg-dark-900 border-r border-slate-800 h-full flex flex-col z-10"
            >
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-16">
          <AnimatePresence mode="wait">
            {renderActivePage()}
          </AnimatePresence>
        </main>
      </div>

      {/* Multi-stage Mining Analysis Loading Overlay */}
      <LoadingOverlay />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;

