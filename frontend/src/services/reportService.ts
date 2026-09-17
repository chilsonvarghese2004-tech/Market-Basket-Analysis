import { AnalysisResults, ReportItem } from '../types';
import { INITIAL_REPORTS } from '../data/mockData';
import { exportRulesToCSV, exportRulesToJSON, exportAnalysisSummaryReport } from '../utils/exportUtils';

export class ReportService {
  private static reports: ReportItem[] = [...INITIAL_REPORTS];

  public static getReports(): ReportItem[] {
    return this.reports;
  }

  public static generateReport(
    analysis: AnalysisResults,
    format: 'CSV' | 'JSON' | 'PDF' | 'EXCEL',
    reportName?: string
  ): ReportItem {
    const defaultName = reportName || `${analysis.datasetName.split('.')[0]} MBA Report`;
    const filename = `${defaultName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${format.toLowerCase()}`;

    let fileSize = '1.2 MB';
    if (format === 'CSV') {
      exportRulesToCSV(analysis.rules, filename);
      fileSize = `${Math.max(12, Math.round(analysis.rules.length * 0.45))} KB`;
    } else if (format === 'JSON') {
      exportRulesToJSON(analysis.rules, filename);
      fileSize = `${Math.max(18, Math.round(analysis.rules.length * 0.85))} KB`;
    } else {
      // PDF or Executive format: generate printable executive summary text report
      exportAnalysisSummaryReport(analysis, filename.replace(`.${format.toLowerCase()}`, '.txt'));
      fileSize = '320 KB';
    }

    const newReport: ReportItem = {
      id: `report-${Date.now()}`,
      name: defaultName,
      generatedDate: new Date().toISOString(),
      datasetName: analysis.datasetName,
      rulesCount: analysis.rules.length,
      format,
      status: 'Ready',
      fileSize,
      summary: `Automated ${format} generation for ${analysis.rules.length} mined association rules at ${analysis.config.algorithm.toUpperCase()} algorithm configuration.`,
    };

    this.reports.unshift(newReport);
    return newReport;
  }
}

