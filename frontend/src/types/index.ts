export interface DatasetColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sampleValues: (string | number)[];
  nullCount: number;
  uniqueCount: number;
}

export interface Dataset {
  id: string;
  name: string;
  sizeBytes: number;
  rowCount: number;
  columnCount: number;
  columns: DatasetColumn[];
  sampleRows: Record<string, any>[];
  uniqueProductsCount: number;
  missingValuesCount: number;
  duplicateRowsCount: number;
  uploadDate: string;
  status: 'ready' | 'processing' | 'error';
  rawTransactions?: string[][];
}

export interface ColumnMapping {
  transactionId: string;
  productName: string;
  quantity?: string;
  date?: string;
  customerId?: string;
  price?: string;
  country?: string;
}

export interface PreprocessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  rowsAffected: number;
  durationMs: number;
  metricLabel?: string;
  metricValue?: string;
}

export type MiningAlgorithm = 'apriori' | 'fpgrowth';

export interface AnalysisConfig {
  minSupport: number;       // e.g. 0.01 to 0.50 (1% to 50%)
  minConfidence: number;    // e.g. 0.10 to 1.00 (10% to 100%)
  minLift: number;          // e.g. 1.0 to 10.0
  algorithm: MiningAlgorithm;
  maxItemsetSize: number;   // 2 to 5
  metricSort: 'lift' | 'confidence' | 'support' | 'conviction';
}

export interface AssociationRule {
  id: string;
  antecedent: string[];
  consequent: string[];
  support: number;            // e.g. 0.184 (18.4%)
  confidence: number;         // e.g. 0.728 (72.8%)
  lift: number;               // e.g. 2.41
  leverage: number;           // e.g. 0.082
  conviction: number;         // e.g. 2.85
  antecedentSupport: number;
  consequentSupport: number;
  transactionCount: number;
  explanation: string;
  businessInsight: string;
  crossSellAction: string;
  category?: string;
}

export interface FrequentItemset {
  id: string;
  items: string[];
  support: number;
  count: number;
}

export interface ProductMetric {
  name: string;
  count: number;
  support: number;
  category: string;
  avgBasketSize?: number;
}

export interface ProductPairCooccurrence {
  itemA: string;
  itemB: string;
  pair: string;
  cooccurrences: number;
  lift: number;
  confidence: number;
}

export interface CategoryDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AnalysisResults {
  id: string;
  timestamp: string;
  datasetName: string;
  totalTransactions: number;
  uniqueProductsCount: number;
  frequentItemsetsCount: number;
  rulesCount: number;
  avgSupport: number;
  avgConfidence: number;
  avgLift: number;
  executionTimeMs: number;
  algorithmUsed: MiningAlgorithm;
  config: AnalysisConfig;
  rules: AssociationRule[];
  itemsets: FrequentItemset[];
  topProducts: ProductMetric[];
  topPairs: ProductPairCooccurrence[];
  categories: CategoryDistribution[];
}

export interface NetworkNode {
  id: string;
  label: string;
  category: string;
  degree: number;
  count: number;
  support: number;
  color: string;
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  lift: number;
  confidence: number;
  support: number;
  strength: number;
}

export interface ProductRecommendation {
  product: string;
  confidence: number;
  lift: number;
  support: number;
  cooccurrences: number;
  reason: string;
  actionableStrategy: string;
  category: string;
  bundleDiscountSuggested: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  durationMs?: number;
}

export interface ReportItem {
  id: string;
  name: string;
  generatedDate: string;
  datasetName: string;
  rulesCount: number;
  format: 'CSV' | 'JSON' | 'PDF' | 'EXCEL';
  status: 'Ready' | 'Generating';
  fileSize: string;
  summary: string;
}

