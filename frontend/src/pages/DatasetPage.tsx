import React from 'react';
import { FileUploadZone } from '../components/dataset/FileUploadZone';
import { DatasetStats } from '../components/dataset/DatasetStats';
import { ColumnMapper } from '../components/dataset/ColumnMapper';
import { DataTable } from '../components/dataset/DataTable';
import { motion } from 'framer-motion';

export const DatasetPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      {/* Upload Zone */}
      <FileUploadZone />

      {/* Dataset Health Statistics */}
      <DatasetStats />

      {/* Column Schema Mapping */}
      <ColumnMapper />

      {/* Dynamic Data Preview Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Transaction Records Preview
        </h3>
        <DataTable />
      </div>
    </motion.div>
  );
};

