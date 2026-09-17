import React from 'react';
import { PipelineVisualizer } from '../components/preprocessing/PipelineVisualizer';
import { motion } from 'framer-motion';

export const PreprocessingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PipelineVisualizer />
    </motion.div>
  );
};

