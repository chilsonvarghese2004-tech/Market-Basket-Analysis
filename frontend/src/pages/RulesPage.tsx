import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RuleFilters } from '../components/rules/RuleFilters';
import { RulesTable } from '../components/rules/RulesTable';
import { RuleDetailModal } from '../components/rules/RuleDetailModal';
import { AnalysisService } from '../services/analysisService';
import { AssociationRule } from '../types';
import { motion } from 'framer-motion';

export const RulesPage: React.FC = () => {
  const { analysisResults } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [minConfidence, setMinConfidence] = useState(0);
  const [minLift, setMinLift] = useState(1.0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'lift' | 'confidence' | 'support' | 'conviction'>('lift');

  const allRules: AssociationRule[] = useMemo(() => analysisResults?.rules || [], [analysisResults]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allRules.forEach((r: AssociationRule) => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, [allRules]);

  // Filter and sort rules
  const filteredRules = useMemo(() => {
    const filtered = AnalysisService.filterRules(
      allRules,
      searchQuery,
      minConfidence,
      minLift,
      selectedCategory
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'support':
          return b.support - a.support;
        case 'conviction':
          return b.conviction - a.conviction;
        case 'lift':
        default:
          return b.lift - a.lift;
      }
    });
  }, [allRules, searchQuery, minConfidence, minLift, selectedCategory, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setMinConfidence(0);
    setMinLift(1.0);
    setSelectedCategory('all');
    setSortBy('lift');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Rule Filters */}
      <RuleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        minConfidence={minConfidence}
        onConfidenceChange={setMinConfidence}
        minLift={minLift}
        onLiftChange={setMinLift}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleReset}
        totalFiltered={filteredRules.length}
        totalRules={allRules.length}
      />

      {/* Rules Table */}
      <RulesTable rules={filteredRules} />

      {/* Detail Drawer / Modal */}
      <RuleDetailModal />
    </motion.div>
  );
};

