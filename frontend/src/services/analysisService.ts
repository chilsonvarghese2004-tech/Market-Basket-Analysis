import { AnalysisConfig, AnalysisResults, AssociationRule } from '../types';
import { INITIAL_ANALYSIS_RESULTS } from '../data/mockData';
import { runClientAssociationMining } from '../utils/aprioriEngine';
import { API_BASE_URL } from './api';

export type AnalysisStepCallback = (stepName: string, progressPercent: number) => void;

export class AnalysisService {
  /**
   * Run Market Basket Analysis with multi-stage progress reporting
   */
  public static async runAnalysis(
    config: AnalysisConfig,
    rawTransactions?: string[][],
    datasetName: string = 'Assignment-1_Data.csv',
    onProgress?: AnalysisStepCallback
  ): Promise<AnalysisResults> {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Multi-stage progress indicators
    const stages = [
      { name: 'Preparing transaction sparse matrix...', percent: 20, wait: 350 },
      { name: 'Mining frequent itemsets via ' + config.algorithm.toUpperCase() + '...', percent: 45, wait: 400 },
      { name: 'Generating candidate association rules...', percent: 70, wait: 350 },
      { name: 'Computing support, confidence, lift, & conviction...', percent: 90, wait: 300 },
      { name: 'Synthesizing actionable retail business insights...', percent: 100, wait: 250 },
    ];

    for (const stage of stages) {
      if (onProgress) {
        onProgress(stage.name, stage.percent);
      }
      await delay(stage.wait);
    }

    // Try backend API if configured
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analysis/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config, datasetName }),
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.warn('Backend API unavailable, falling back to local client execution engine:', e);
      }
    }

    // If custom raw transactions were parsed from user upload, use client engine
    if (rawTransactions && rawTransactions.length > 5) {
      return runClientAssociationMining(rawTransactions, config, datasetName);
    }

    // Otherwise, simulate dynamic filtering and rule generation from default data
    const baseResults = { ...INITIAL_ANALYSIS_RESULTS };
    
    // Filter rules based on new config parameters
    const filteredRules = baseResults.rules.filter(
      (r) =>
        r.support >= config.minSupport &&
        r.confidence >= config.minConfidence &&
        r.lift >= config.minLift
    );

    // Sort according to metricSort
    filteredRules.sort((a, b) => {
      switch (config.metricSort) {
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

    const avgSupport =
      filteredRules.length > 0
        ? filteredRules.reduce((acc, r) => acc + r.support, 0) / filteredRules.length
        : 0;
    const avgConfidence =
      filteredRules.length > 0
        ? filteredRules.reduce((acc, r) => acc + r.confidence, 0) / filteredRules.length
        : 0;
    const avgLift =
      filteredRules.length > 0
        ? filteredRules.reduce((acc, r) => acc + r.lift, 0) / filteredRules.length
        : 0;

    return {
      ...baseResults,
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      datasetName,
      algorithmUsed: config.algorithm,
      config,
      rulesCount: filteredRules.length,
      avgSupport,
      avgConfidence,
      avgLift,
      rules: filteredRules,
    };
  }

  /**
   * Filter rules in-memory by text query or ranges
   */
  public static filterRules(
    rules: AssociationRule[],
    query: string = '',
    minConfidence: number = 0,
    minLift: number = 1.0,
    selectedCategory: string = 'all'
  ): AssociationRule[] {
    const q = query.toLowerCase().trim();
    return rules.filter((r) => {
      if (minConfidence > 0 && r.confidence < minConfidence) return false;
      if (minLift > 1.0 && r.lift < minLift) return false;
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;

      if (q) {
        const anteMatch = r.antecedent.some((item) => item.toLowerCase().includes(q));
        const consMatch = r.consequent.some((item) => item.toLowerCase().includes(q));
        const catMatch = r.category?.toLowerCase().includes(q);
        if (!anteMatch && !consMatch && !catMatch) return false;
      }

      return true;
    });
  }
}

