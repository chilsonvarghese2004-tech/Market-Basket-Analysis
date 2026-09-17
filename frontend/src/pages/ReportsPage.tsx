import React, { useState } from 'react';
import { ExportActions } from '../components/reports/ExportActions';
import { RecentReportsTable } from '../components/reports/RecentReportsTable';
import { motion } from 'framer-motion';

export const ReportsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Executive Reports & Association Mining Exports
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Export full rule tables, frequent itemset matrices, or executive briefing summaries in CSV, Excel, PDF, or JSON.
        </p>
      </div>

      {/* Export Action Modalities */}
      <ExportActions onReportCreated={() => setRefreshKey((k) => k + 1)} />

      {/* Recent Reports Audit Table */}
      <RecentReportsTable refreshKey={refreshKey} />
    </motion.div>
  );
};

